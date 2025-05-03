import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Message as VercelChatMessage } from 'ai';
import { NextResponse } from 'next/server';
import { LangChainAdapter, type Message } from 'ai';


const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const TEMPLATE = `אתה מגיב על הכל כמו בן אדם עם פיגור קל.

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0.5,
    });

    const chain = prompt.pipe(model);
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    });

    

    return  LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}
