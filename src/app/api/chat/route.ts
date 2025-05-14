import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { LangChainAdapter, Message as VercelChatMessage } from 'ai';
import { NextResponse } from 'next/server';
import { queryVectorStore } from '../helpers';
import { getVectorStore } from './ingest/route';
import { VectorStore } from '@langchain/core/vectorstores';

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

async function* logAndPassThrough<T>(
  iterable: AsyncIterable<T>
): AsyncIterable<T> {
  for await (const item of iterable) {
    console.log('Stream item:', item);
    yield item;
  }
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const QA_PROMPT_TEMPLATE = `אתה עובד במשרד העירייה של תל אביב. תשובה בעברית.
  Context: """"{context}"""
  Question: """{input}"""

  Helpful answer in markdown:`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const retriever = getVectorStore().asRetriever();
    console.log('querying vector store', currentMessageContent);
    await queryVectorStore(getVectorStore(), currentMessageContent);

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

    const chain = await createRetrievalChain({
      retriever,
      combineDocsChain: questionAnswerChain,
    });

    const stream = await chain.stream({
      input: currentMessageContent,
    });

    const readableStream = asyncIterableToReadableStream(stream);

    return LangChainAdapter.toDataStreamResponse(readableStream);
  } catch (error) {
    console.error(error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}
