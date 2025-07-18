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

const SIMPLE_QA_PROMPT_TEMPLATE = `
אתה פקיד מידע מטעם עיריית תל אביב-יפו. עליך לענות על שאלות התושבים בשפה העברית בלבד, ענה במורה פשוטה  ומובנת, תמציתית וממוקדת.
השתמש בהקשר שלך כדי לענות על השאלה הבאה. הקשר: {context}. שאלה: {input}.
היסטוריית שיחה קודמת: {previous_messages}.

`;

const QA_PROMPT_TEMPLATE = `אתה פקיד מידע מטעם משרד העירייה של תל אביב-יפו. עליך לענות על שאלות תושבים בשפה העברית בלבד.

**הנחיות חשובות:**
1.  **התבססות על הקשר:** יש להתבסס אך ורק על המידע שסופק בקטע ה"הקשר" שלהלן. אל תמציא מידע או תנחש.
2.  **,טיפול במידע חסר:** אם המידע הדרוש למתן תשובה אינו נמצא בקטע ה"הקשר", ענה בנימוס ובאופן תמציתי: "אני מתנצל/ת, אך אין לי את המידע המבוקש בהקשר שסופק לי. אנא נסה/נסי לנסח מחדש את שאלתך או פנה/פני לערוץ שירות אחר."
3.  **סגנון וטון:** התשובות צריכות להיות **ברורות, מנומסות, תמציתיות וממוקדות**.
4.  **פורמט תשובה:** השתמש בפורמט Markdown לתשובה שלך, כולל כותרות (אם רלוונטי), רשימות ממוספרות/נקודתיות וטקסט מודגש לפי הצורך.
5. **בכל מקרה, אנא ספק את ההקשר שניתן לך**


**היסטוריית שיחה קודמת:**
{previous_messages}

**הקשר:**
"""{context}"""

**שאלת התושב:**
"""{input}"""

**תשובה:**
`;

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
    const vectorStore = await getVectorStore();
    const numOfRetrievedDocs = 100;

    const retriever = vectorStore.asRetriever({
      searchType: 'similarity',
      k: numOfRetrievedDocs,
    });

    // --- TEMPORARY DEBUGGING STEP (can remove later) ---
    // This logs what the retriever *would* return directly, but is not
    // the exact flow for the chain.
    vectorStore.similaritySearch(currentMessageContent).then(docs => {
      console.log('Number of retrieved docs:', docs.length);
    });
    // --- END TEMPORARY DEBUGGING STEP ---

    console.log('Retriever created');
    const llm = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0,
      streaming: true,
    });

    const qaPrompt = ChatPromptTemplate.fromTemplate(SIMPLE_QA_PROMPT_TEMPLATE);

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
