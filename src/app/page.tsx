'use client';

import 'regenerator-runtime/runtime';
import { Button, Input } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import APIService from './service/api';

type ChatCardType = {
  title: string;
  content: string;
};

function ChatMessage({ title, content }: ChatCardType) {
  return (
    <div className="mb-4 w-3/4 self-center">
      <h3 className="font-bold my-2">{title}</h3>
      <p>{content}</p>
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceChatId, setVoiceChatId] = useState<number>();
  const [messages, setMessages] = useState<ChatCardType[]>([]);
  const {
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const postMessage = async (message: string, latestMessages: ChatCardType[]) => {
    try {
      const api = new APIService({ username: 'dan', password: '1234' });
      const response = await api.postChat({ language: 'en', content: message, source: 'client' });
      const { content, id } = response.data;

      if (voiceEnabled) {
        setVoiceChatId(id);
      }

      setMessages([...latestMessages, { title: 'ChatGPT', content }]);
      resetTranscript();
    } catch (error) {
      console.log(error);
    }
  };

  const onClick = async () => {
    const latestMessages = [...messages, { title: 'You', content: input }];
    setMessages(latestMessages);
    await postMessage(input, latestMessages);
  };

  const onVoiceInput = async (message: string) => {
    const latestMessages = [...messages, { title: 'You', content: message }];
    setMessages(latestMessages);
    await postMessage(message, latestMessages);
  };

  const onStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const onStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (finalTranscript) {
      onVoiceInput(finalTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

  return (
    <main className="flex flex-col min-h-screen">
      <div className="h-24 self-center">
        <p>
          Microphone:
          {listening ? 'on' : 'off'}
        </p>
        <Button onClick={onStartListening}>Start</Button>
        <Button onClick={onStopListening}>Stop</Button>
        <Button onClick={resetTranscript}>Reset</Button>
      </div>
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-100px)] p-5 w-full">
        {
          messages.map(({ title, content }, index) => (
            <ChatMessage
              key={index}
              title={title}
              content={content}
            />
          ))
        }
        <div ref={messageEndRef} className="self-center">
          {
            voiceEnabled && voiceChatId
            && (
              <audio id="ai-voice" src={APIService.getChatAudioURL(voiceChatId)} autoPlay>
                <track kind="captions" content={messages[messages.length - 1].content} />
              </audio>
            )
          }
        </div>
      </div>
      <div className="flex flex-col w-1/2 self-center h-[100px]">
        <Input
          size="large"
          placeholder="How can I help?"
          onChange={(event) => setInput(event.target.value)}
        />

        <Button onClick={onClick} className="self-end my-2">Send</Button>
      </div>
    </main>
  );
}
