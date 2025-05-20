import {
  getVectorStore,
  getVectorStoreStatus,
  isStoreInitialized,
} from '@/lib/vectorStore';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, Message as VercelChatMessage } from 'ai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

function asyncIterableToReadableStream<T>(
  iterable: AsyncIterable<T>
): ReadableStream<string> {
  const iterator = iterable[Symbol.asyncIterator]();
  let accumulatedAnswer = '';

  return new ReadableStream<string>({
    async pull(controller) {
      try {
        while (true) {
          const { value, done } = await iterator.next();
          if (done) {
            controller.close();
            break;
          }

          const jsonString =
            typeof value === 'string' ? value : JSON.stringify(value);
          let parsed;
          try {
            parsed = JSON.parse(jsonString);
          } catch (parseErr) {
            console.warn('Failed to parse JSON:', jsonString, parseErr);
            continue;
          }

          if (parsed.answer) {
            accumulatedAnswer += parsed.answer;
            controller.enqueue(parsed.answer);
          }
        }
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const QA_PROMPT_TEMPLATE = `אתה עובד במשרד העירייה של תל אביב. תשובה בעברית.
  Previous conversation:
  {previous_messages}

  Context: """{context}"""
  Question: """{input}"""

  Helpful answer in markdown:`;



export async function POST(req: Request) {
  try {
    // Check if vector store is initialized
    // if (!isStoreInitialized()) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         'Vector store is not initialized. Please wait for initialization to complete.',
    //     },
    //     { status: 503 }
    //   );
    // }

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

    // Get the global vector store and check its status
    const vectorStore = getVectorStore();
//    const status = getVectorStoreStatus();
  //  console.log('Vector store status:', status);

    // if (status.documentsCount === 0) {
    //   return NextResponse.json(
    //     { error: 'No documents loaded in vector store' },
    //     { status: 503 }
    //   );
    // }

    const retriever = vectorStore.asRetriever();

    const llm = new ChatOpenAI({
      model: 'gpt-4',
      temperature: 0,
      streaming: true,
    });

    const qaPrompt = ChatPromptTemplate.fromTemplate(QA_PROMPT_TEMPLATE);

    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: qaPrompt,
    });

    const chain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

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
