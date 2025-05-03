'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  messages.forEach(message => {
    if (message.role !== 'user') {
      console.log('AI: ', message);
    } else {
      console.log('User: ', message);
    }
  });
  return (
    <div className='bg-white-500 mx-auto flex h-100 h-full w-full flex-col justify-between'>
      <div
        className='h-full w-full overflow-scroll'
        ref={el => {
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }}
      >
        {messages.map(message => (
          <div key={message.id} className='whitespace-pre-wrap'>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
              }
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className='flex justify-center'>
        <textarea
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          dir='rtl'
          className='w-3xl self-center rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-800 resize-none'
          value={input}
          placeholder='מה תרצה לשאול'
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
