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
  // eslint-disable-next-line
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceChatId, setVoiceChatId] = useState<number>();
  const [messages, setMessages] = useState<ChatCardType[]>([]);
  const {
    listening,
    finalTranscript,
    resetTranscript,
    // eslint-disable-next-line
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const api = new APIService({ username: 'dan', password: '1234' });

  const postMessage = async (message: string, latestMessages: ChatCardType[]) => {
    try {
      const response = await api.postChat({ language: 'en', content: message, source: 'client' });
      const { content, id } = response.data;

      if (voiceEnabled) {
        setVoiceChatId(id);
      }

      setMessages([...latestMessages, { title: 'ChatGPT', content }]);
      resetTranscript();
    } catch (error) {
      resetTranscript();
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
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-200px)] p-5 w-full">
        {
          messages.map(({ title, content }, index) => (
            <ChatMessage
            // eslint-disable-next-line
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
              <audio id="ai-voice" src={api.getChatAudioURL(voiceChatId)} autoPlay>
                <track kind="captions" content={messages[messages.length - 1].content} />
              </audio>
            )
          }
        </div>
      </div>
      <div className="flex flex-col w-1/2 self-center h-[200px]">
        <div className="mb-2 mb-2 self-center">
          <div className="flex">
            <p className="mr-2">
              Microphone:
              {listening ? ' on' : ' off'}
            </p>
            <p>
              Voice response:
              {voiceEnabled ? ' on' : ' off'}
            </p>
          </div>
          <div className="flex">
            <Button className="mr-2" onClick={onStartListening}>Start</Button>
            <Button className="mr-2" onClick={onStopListening}>Stop</Button>
            <Button className="mr-2" onClick={resetTranscript}>Reset</Button>
            <Button className="mr-2" onClick={() => setVoiceEnabled(true)}>Enable voice</Button>
            <Button onClick={() => setVoiceEnabled(false)}>Disable voice</Button>
          </div>
        </div>
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
