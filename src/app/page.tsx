'use client';

import { Button, Input, Card, Affix } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useState, useEffect, useRef } from 'react';

type ChatCardType = {
  title: string;
  content: string;
}

const ChatMessage = ({ title, content }: ChatCardType) => (
  <div className='mb-2'>
    <h3 className='font-bold'>{title}</h3>
    <p>{content}</p>
  </div>
)

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatCardType[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const onClick = () => {
    setMessages([...messages, { title: 'You', content: input }]);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  return (
    <main className="flex flex-col min-h-screen">
      <div className='overflow-y-auto h-[90vh]'>
        {
          messages.map(({ title, content }, index) =>
            <ChatMessage key={index} title={title} content={content} />
          )
        }
        <div ref={messageEndRef} />
      </div>
      <div className='fixed bottom-0 flex flex-col w-1/2 self-center'>
        <Input
          size='large'
          placeholder='How can I help?'
          onChange={event => setInput(event.target.value)} />

        <Button onClick={onClick} className='w-max self-end my-2'>Send</Button>
      </div>
    </main>
  );
}
