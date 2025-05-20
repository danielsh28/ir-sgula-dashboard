'use client';
import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';
import { useEffect, useRef, useState } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
 // const [isInitializing, setIsInitializing] = useState(true);

  // useEffect(() => {
  //   // Check if vector store is initialized
  //   async function checkInitialization() {
  //     try {
  //       const response = await fetch('/api/chat/status');
  //       const data = await response.json();
  //       if (data.isInitialized) {
  //         setIsInitializing(false);
  //       } else {
  //         // Retry after 2 seconds
  //         setTimeout(checkInitialization, 2000);
  //       }
  //     } catch (error) {
  //       console.error('Failed to check initialization status:', error);
  //       // Retry after 2 seconds
  //       setTimeout(checkInitialization, 2000);
  //     }
  //   }
  //   checkInitialization();
  // }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // if (isInitializing) {
  //   return (
  //     <div className='flex h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 sm:h-[calc(100vh-6rem)]'>
  //       <div className='text-center'>
  //         <div className='mb-4 text-2xl font-semibold text-purple-600'>
  //           מאתחל מערכת...
  //         </div>
  //         <div className='text-gray-600'>
  //           אנא המתן בזמן שאנחנו מכינים את המערכת עבורך
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className='mx-auto flex h-[calc(100vh-4rem)] w-full flex-col justify-between bg-gray-50 p-2 sm:h-[calc(100vh-6rem)] sm:p-4'>
      <div
        className='flex h-full w-full flex-col space-y-3 overflow-y-auto sm:space-y-4'
        dir='rtl'
      >
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 sm:max-w-[80%] sm:px-4 ${
                message.role === 'user'
                  ? 'transform bg-purple-300 text-gray-800 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl'
                  : 'bg-white text-gray-800 shadow-md'
              }`}
            >
              <div className='mb-1 text-right text-xs font-semibold sm:text-sm'>
                {message.role === 'user' ? 'אתה' : 'עוזר רישוי'}
              </div>
              <div className='text-right text-xs whitespace-pre-wrap sm:text-sm'>
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className='mb-4 rounded-lg bg-red-100 p-4 text-red-700' dir='rtl'>
          <p className='font-semibold'>שגיאה:</p>
          <p>{error.message || 'אירעה שגיאה בלתי צפויה. אנא נסה שוב.'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className='mt-2 sm:mt-4' dir='rtl'>
        <div className='flex items-center space-x-2 space-x-reverse'>
          <textarea
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            dir='rtl'
            className='flex-1 resize-none rounded-lg border border-gray-300 p-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none sm:p-3 sm:text-base'
            value={input}
            placeholder={isLoading ? 'מעבד את השאלה שלך...' : 'מה תרצה לשאול?'}
            onChange={handleInputChange}
            rows={2}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}
