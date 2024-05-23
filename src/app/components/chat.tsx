'use client'

import 'regenerator-runtime/runtime'

import { Button, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useRef, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { AuthContext } from '../context/auth'
import APIService, { ChatType } from '../service/api'

type ChatMessageType = {
  source: string
  content: string
}
const ChatMessage = ({ source, content }: ChatMessageType) => {
  return (
    <div className="mb-4 w-3/4 md:w-1/2 self-center">
      <h3 className="font-bold my-2">{source}</h3>
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
  const [chats, setChats] = useState<ChatType[]>([])
  const { loggedInUser } = useContext(AuthContext)

  const { finalTranscript, resetTranscript } = useSpeechRecognition()
  const messageEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetInput = () => {
    resetTranscript()
    setInput('')
  }

  if (!loggedInUser) {
    return router.push('/login')
  }

  const api = new APIService(loggedInUser.authToken)

  const handlePostChat = async (content: string) => {
    try {
      const userChat: ChatType = { sessionId, language: 'en', content, source: 'client' }
      setChats([...chats, userChat])

      const response = await api.postChat(userChat)

      const serverChat = response.data
      const { id, sessionId: serverSessionId } = serverChat

      setSessionId(serverSessionId)

      if (voiceEnabled) {
        setVoiceChatId(id)
      }

      setChats([...chats, userChat, serverChat])
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

  const onTextInput = () => handlePostChat(input)

  const onVoiceInput = (transcript: string) => handlePostChat(transcript)

  const toggleVoiceResponse = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
  }

  // scroll to the latest message
  useEffect(() => {
    scrollToBottom()
  }, [chats])

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
        {chats.map(({ source, content }, index) => (
          <ChatMessage key={index} source={source} content={content} />
        ))}
        <div ref={messageEndRef} className="self-center">
          {voiceEnabled && voiceChatId && (
            <audio id="ai-voice" src={api.getChatAudioURL(voiceChatId)} autoPlay>
              <track kind="captions" content={chats[chats.length - 1].content} />
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

        <Button variant="outline" onClick={onTextInput} className="self-end my-2">
          Send
        </Button>
      </div>
    </div>
  )
}

export default Chat
