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
  const [output, setOutput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceChatId, setVoiceChatId] = useState<number>();
  const [messages, setMessages] = useState<ChatCardType[]>([]);
  const {
    listening,
    finalTranscript,
    resetTranscript,
    // browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const api = new APIService({ username: 'dan', password: '1234' });

  // setVoiceEnabled(true); // auto enable it for now

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const postMessage = async (message: string) => {
    try {
      const streamResponse = await api.streamResponse({ language: 'en', content: message, source: 'client' });

      const reader = streamResponse.body?.getReader();
      let text = '';
      const decoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      // read streams of text and save to output
      while (true) {
        if (!reader) break;

        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader!.read();
        const partialText = decoder.decode(value);

        if (done) {
          // remove the last 'None' keyword, which indicates the end of generated text
          text = text.substring(0, text.lastIndexOf('None'));
          setOutput(text);
          break;
        }

        text += partialText;
        setOutput(text);
      }

      // save the generated text response
      const response = await api.postChat({
        language: 'en',
        source: 'server',
        content: text,
      });

      // get the chat id and play audio if voice chat is enabled
      const { id } = response.data;

      if (voiceEnabled) {
        setVoiceChatId(id);
      }

      // Reset the transcript for next convo
      resetTranscript();
    } catch (error) {
      console.log(error);
    }
  };

  // Handles text input from user
  const onClick = async () => {
    const messagesWithoutOutput = [...messages, { title: 'You', content: input }];
    const messagesWithOutput = [...messages, { title: 'ChatGPT', content: output }, { title: 'You', content: input }];

    const latestMessages = output ? messagesWithOutput : messagesWithoutOutput;
    setMessages(latestMessages);
    await postMessage(input);
    setInput('');
  };

  // Handles voice input from user
  const onVoiceInput = async (message: string) => {
    const messagesWithoutOutput = [...messages, { title: 'You', content: message }];
    const messagesWithOutput = [...messages, { title: 'ChatGPT', content: output }, { title: 'You', content: message }];

    const latestMessages = output ? messagesWithOutput : messagesWithoutOutput;
    setMessages(latestMessages);
    await postMessage(message, latestMessages);
  };

  const onStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const onStopListening = () => {
    SpeechRecognition.stopListening();
  };

  // scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [output]);

  // get the audio transcript
  useEffect(() => {
    if (finalTranscript) {
      setMessages([...messages, { title: 'ChatGPT', content: output }]);
      setOutput('');
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
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-100px)] m-2 w-full">
        {
            messages.map(({ title, content }, index) => (
              <ChatMessage
                key={index}
                title={title}
                content={content}
              />
            ))
          }
        {output && <ChatMessage title="ChatGPT" content={output} />}
        {
            voiceEnabled && voiceChatId
            && (
              <div>
                <audio id="ai-voice" src={api.getChatAudioURL(voiceChatId)} autoPlay>
                  <track kind="captions" content={messages[messages.length - 1].content} />
                </audio>
              </div>
            )
          }
        <div ref={messageEndRef} />
      </div>
      <div className="flex flex-col w-1/2 self-center h-[100px]">
        <Input
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
