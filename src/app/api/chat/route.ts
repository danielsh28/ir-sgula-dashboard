import { asyncIterableToReadableStream } from '@/lib/utils';
import { getVectorStore } from '@/lib/vectorStore';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, Message as VercelChatMessage } from 'ai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { NextResponse } from 'next/server';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const QA_PROMPT_TEMPLATE = `אתה עובד במשרד העירייה של תל אביב. עליך לענות בעברית על שאלות תושבים.

חשוב מאוד: יש להתבסס אך ורק על המידע שסופק בהקשר למטה. אם המידע אינו נמצא בהקשר, יש לציין בבירור שאין לך את המידע המבוקש.

שיחה קודמת:
{previous_messages}

הקשר: """{context}"""
שאלה: """{input}"""

תשובה מועילה בסגנון מרקדאון:`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    if (!currentMessageContent) {
      return NextResponse.json(
        { error: 'Empty message content' },
        { status: 400 }
      );
    }

    // Use the singleton vector store
    console.log('Getting vector store from singleton...');
    const vectorStore = await getVectorStore();

    const retriever = vectorStore.asRetriever({
      searchType: 'similarity',
      k: 5, // Retrieve k most relevant documents
    });

    const llm = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0,
      streaming: true,
    });

    const qaPrompt = ChatPromptTemplate.fromTemplate(QA_PROMPT_TEMPLATE);

    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: qaPrompt,
    });

    // Create the retrieval chain
    const chain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    // Log what we're about to query
    console.log('🔍 Querying with:', currentMessageContent);

    const stream = await chain.stream({
      input: currentMessageContent,
      previous_messages: formattedPreviousMessages.join('\n'),
    });

    const readableStream = asyncIterableToReadableStream(stream);

    return LangChainAdapter.toDataStreamResponse(readableStream);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
