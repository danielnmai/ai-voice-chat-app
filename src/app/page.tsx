'use client';

import 'regenerator-runtime/runtime';
import { Button, Input } from 'antd';
import { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import APIService from './service/api';

type ChatCardType = {
  title: string;
  content: string;
}

const sampleText = "Title: The Global Impacts of the War in Ukraine on the World Economy Introduction (200 words): The war in Ukraine has had significant ramifications not only on regional stability but also on the world economy. This essay aims to explore and analyze how the conflict has affected various aspects of the global economy. The following discussion will examine the impact on key sectors such as trade, energy, and investments, as well as the consequences for international financial institutions, currencies, and economic alliances. Furthermore, it will address the potential future implications of the war in Ukraine for the world economy. 1. Trade (400 words): The war in Ukraine has disrupted trade flows and harmed global economic interdependence. As a result, countries directly involved in the conflict, such as Ukraine and Russia, have experienced a decline in exports and reduced access to international markets due to geopolitical uncertainties. Moreover, neighboring countries and trading partners have also dealt with reduced trade volumes and deteriorating economic relations, amplifying the negative effects on the world economy. The decrease in trade adversely affects not only export-driven economies but also negatively impacts global supply chains, leading to the higher prices of goods and services for consumers worldwide. 2. Energy (400 words): Ukraine's strategic location and its vital role as a transit country for natural gas and oil have made energy security a significant concern during the conflict. The dispute between Ukraine and Russia, particularly over gas prices and transit conditions, has resulted in disruptions in energy supplies to European countries. These supply interruptions have increased energy prices, posing economic challenges to European businesses and households. Furthermore, concerns surrounding energy security have fueled calls for diversification and the development of alternative energy sources, creating both challenges and opportunities for the global energy market. 3. Investments (400 words): The war in Ukraine has deterred foreign direct investments (FDI) in the region, affecting not only the Ukrainian economy but also global investment flows. Heightened political risks, uncertainty, and security concerns have made investors wary of pouring capital into Ukraine and its neighboring countries. This reduction in FDI has hampered economic growth and development, limiting job creation and the modernization of industries. Additionally, the reluctance to invest in the region has had spillover effects on global investment trends, as it demonstrates the vulnerability of emerging markets and heightens investor risk aversion. 4. International Financial Institutions and Currencies (400 words): The war in Ukraine has strained international financial institutions (IFIs), such as the International Monetary Fund (IMF), European Bank for Reconstruction and Development (EBRD), and World Bank, as they have provided financial assistance to mitigate the economic fallout. These institutions have faced challenges in balancing their support for Ukraine while safeguarding their own financial stability. Bailout and loan programs have put pressure on IFIs' resources and have required assistance from member countries, potentially diverting funds from other critical investment and development projects globally. Additionally, uncertainties stemming from the war have affected global currencies, leading to currency depreciations and fluctuations, impacting financial markets and trade in various nations. 5. Economic Alliances and Geopolitical Implications (400 words): The war in Ukraine has highlighted geopolitical fault lines and strained international relationships, which can impact economic alliances and global economic cooperation. Sanctions imposed by Western countries on Russia, for instance, have disrupted trade and investment flows, affecting both sides. Moreover, the war has fueled debates over the effectiveness and long-term sustainability of regional economic integration projects, such as the European Union and the Eurasian Economic Union. These tensions have consequences for the world economy, introducing uncertainties that can potentially undermine global economic stability and cooperation. Conclusion (200 words): The war in Ukraine has undoubtedly had global economic implications in various sectors. Trade disruptions, energy insecurities, reduced investments, challenges faced by international financial institutions, currency fluctuations and strained economic alliances all contribute to the overall impact on the world economy. The war's effects on major socioeconomic variables such as growth, jobs, inflation, and financial stability should not be disregarded. As the conflict persists, the potential for further repercussions on regional and global stability remains a cause for concern. Therefore, proactive efforts by the international community to seek diplomatic solutions and de-escalate tensions are crucial to mitigate the detrimental effects on the world economy and foster sustainable long-term growth."

const sampleTexts: ChatCardType[] = [
  { title: 'ChatGPT', content: sampleText },
  { title: 'ChatGPT', content: sampleText },
  { title: 'ChatGPT', content: sampleText }
];

const ChatMessage = ({ title, content }: ChatCardType) => (
  <div className='mb-4 w-3/4 self-center'>
    <h3 className='font-bold my-2'>{title}</h3>
    <p>{content}</p>
  </div>
)

export default function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatCardType[]>([]);
  const {
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const postMessage = async (input: string, messages: ChatCardType[]) => {
    try {
      const api = new APIService({ username: 'dan', password: '1234' });
      const response = await api.postChat({ language: 'en', content: input, source: 'client' });
      setMessages([...messages, { title: 'ChatGPT', content: response.data.content }]);
      resetTranscript();
    } catch (error) {
      console.log(error);
    }
  }

  const onClick = async () => {
    const latestMessages = [...messages, { title: 'You', content: input }];
    setMessages(latestMessages);
    await postMessage(input, latestMessages);
  }

  const onVoiceInput = async (input: string) => {
    const latestMessages = [...messages, { title: 'You', content: input }];
    setMessages(latestMessages);
    await postMessage(input, latestMessages);
  }

  const onStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  }

  const onStopListening = () => {
    SpeechRecognition.stopListening();
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if(finalTranscript) {
      onVoiceInput(finalTranscript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript]);

  return (
    <main className="flex flex-col min-h-screen">
      <div className='h-24 self-center'>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <Button onClick={onStartListening}>Start</Button>
        <Button onClick={onStopListening}>Stop</Button>
        <Button onClick={resetTranscript}>Reset</Button>
      </div>
      <div className='flex flex-col overflow-y-auto h-[calc(100vh-100px)] p-5 w-full'>
        {
          messages.map(({ title, content }, index) =>
            <ChatMessage key={index} title={title} content={content} />
          )
        }
        <div ref={messageEndRef} className='self-center'> 
          <audio id='ai-voice' autoPlay muted={false} preload='auto' >
            <source src='http://localhost:8000/chats/943/audio/' />
            </audio>
          </div>
      </div>
      <div className='flex flex-col w-1/2 self-center h-[100px]'>
        <Input
          size='large'
          placeholder='How can I help?'
          onChange={event => setInput(event.target.value)} />

        <Button onClick={onClick} className='self-end my-2'>Send</Button>
      </div>
    </main>
  );
}
