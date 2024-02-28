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
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceChatId, setVoiceChatId] = useState<number>();
  const [messages, setMessages] = useState<ChatCardType[]>([]);
  const {
    // listening,
    // isMicrophoneAvailable,
    finalTranscript,
    resetTranscript,
    // browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetInput = () => {
    resetTranscript();
    setInput('');
  };

  const api = new APIService({ username: 'dan', password: '1234' });

  const postMessage = async (message: string, latestMessages: ChatCardType[]) => {
    try {
      const response = await api.postChat({ language: 'en', content: message, source: 'client' });
      const { content, id } = response.data;

      if (voiceEnabled) {
        setVoiceChatId(id);
      }

      setMessages([...latestMessages, { title: 'AI', content }]);
      resetInput();
    } catch (error) {
      resetInput();
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

  const toggleVoiceResponse = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  // scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // trigger microphone input
  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isListening]);

  // obtain transcript from voice input
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
      <div className="flex flex-col self-center h-[200px] px-4 w-full md:w-1/2">
        <div className="mb-2 self-center">
          <div className="flex">
            <Button className="mr-2" onClick={toggleVoiceInput}>
              {isListening ? 'Stop' : 'Start' }
              {' '}
              Talking
            </Button>
            <Button className="mr-2" onClick={toggleVoiceResponse}>
              {voiceEnabled ? 'Disable' : 'Enable'}
              {' '}
              Voice Response
            </Button>
          </div>
        </div>
        <Input
          className="h-12"
          size="large"
          placeholder="How can I help?"
          onChange={(event) => setInput(event.target.value)}
          value={input}
        />

        <Button onClick={onClick} className="self-end my-2">Send</Button>
      </div>
    </main>
  );
}
