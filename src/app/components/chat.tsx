'use client'

import 'regenerator-runtime/runtime'

import { Button, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { AuthContext } from '../context/auth'
import APIService from '../service/api'

type ChatCardType = {
  title: string
  content: string
  sessionId?: number
  chatId?: number
}

const ChatMessage = ({ title, content }: ChatCardType) => {
  return (
    <div className="mb-4 w-3/4 md:w-1/2 self-center">
      <h3 className="font-bold my-2">{title}</h3>
      <p>{content}</p>
    </div>
  )
}

const Chat = () => {
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<number>()
  const router = useRouter()
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceChatId, setVoiceChatId] = useState<number>()
  const [messages, setMessages] = useState<ChatCardType[]>([])
  const { loggedInUser } = useContext(AuthContext)

  // user not login
  useEffect(() => {
    if (!loggedInUser) {
      router.push('/login')
    }
  }, [])
  const {
    // listening,
    // isMicrophoneAvailable,
    finalTranscript,
    resetTranscript
    // browserSupportsSpeechRecognition,
  } = useSpeechRecognition()
  const messageEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetInput = () => {
    resetTranscript()
    setInput('')
  }

  const api = new APIService()

  const postMessage = async (message: string, latestMessages: ChatCardType[]) => {
    try {
      const response = await api.postChat({ language: 'en', content: message, source: 'client' })
      const { content, id, sessionId: serverSessionId } = response.data

      // store the sessionId sent from server
      if (serverSessionId && !sessionId) {
        setSessionId(sessionId)
      }

      if (voiceEnabled) {
        setVoiceChatId(id)
      }

      setMessages([...latestMessages, { title: 'AI', content, sessionId }])
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        notifications.show({ color: 'red', title: 'Error', message: error.message })
      } else {
        notifications.show({ color: 'red', title: 'Error', message: 'Oops, that did not work. Please try again' })
      }
    } finally {
      resetInput()
    }
  }

  const onClick = async () => {
    const latestMessages = [...messages, { title: 'You', content: input }]
    setMessages(latestMessages)
    await postMessage(input, latestMessages)
  }

  const onVoiceInput = async (message: string) => {
    const latestMessages = [...messages, { title: 'You', content: message }]
    setMessages(latestMessages)
    await postMessage(message, latestMessages)
  }

  const toggleVoiceResponse = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
  }

  // scroll to the latest message
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // trigger microphone input
  useEffect(() => {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true })
    } else {
      SpeechRecognition.stopListening()
    }
  }, [isListening])

  // obtain transcript from voice input
  useEffect(() => {
    if (finalTranscript) {
      onVoiceInput(finalTranscript)
    }
  }, [finalTranscript])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-220px)] w-full">
        {messages.map(({ title, content }, index) => (
          <ChatMessage key={index} title={title} content={content} />
        ))}
        <div ref={messageEndRef} className="self-center">
          {voiceEnabled && voiceChatId && (
            <audio id="ai-voice" src={api.getChatAudioURL(voiceChatId)} autoPlay>
              <track kind="captions" content={messages[messages.length - 1].content} />
            </audio>
          )}
        </div>
      </div>
      <div className="flex flex-col self-center px-4 w-full md:w-1/2">
        <div className="mb-2 self-center">
          <div className="flex">
            <Button variant="outline" className="mr-2" onClick={toggleVoiceInput}>
              {isListening ? 'Stop' : 'Start'} Talking
            </Button>
            <Button variant="outline" className="mr-2" onClick={toggleVoiceResponse}>
              {voiceEnabled ? 'Disable' : 'Enable'} Voice Response
            </Button>
          </div>
        </div>
        <TextInput placeholder="How can I help?" onChange={(event) => setInput(event.target.value)} value={input} />

        <Button variant="outline" onClick={onClick} className="self-end my-2">
          Send
        </Button>
      </div>
    </div>
  )
}

export default Chat
