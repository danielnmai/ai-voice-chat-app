'use client';

import { Button, Input } from 'antd';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { headers } from 'next/headers';

type ChatCardType = {
  title: string;
  content: string;
}

type MessageType = {
  language: string;
  content: string;
  source: 'client' | 'server';
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

  const postMessage = async (messages: ChatCardType[]) => {
    try {
      const response = await axios.post('http://localhost:8000/chats/', {
        language: 'en',
        content: input,
        source: 'client'
      }, {
        headers: { 'Content-Type': 'application/json' },
        auth: { username: 'dan', password: '1234' }});
      setMessages([...messages, { title: 'ChatGPT', content: response.data.content }])
    } catch (error) {
      console.log(error);
    }
  }

  const onClick = async () => {
    const latestMessages = [...messages, { title: 'You', content: input }];
    setMessages(latestMessages);
    await postMessage(latestMessages);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      <div className='flex flex-col w-1/2 self-center'>
        <Input
          size='large'
          placeholder='How can I help?'
          onChange={event => setInput(event.target.value)} />

        <Button onClick={onClick} className='w-max self-end my-2'>Send</Button>
      </div>
    </main>
  );
}
