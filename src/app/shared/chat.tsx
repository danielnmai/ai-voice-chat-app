'use client'

import 'regenerator-runtime/runtime'

import { ActionIcon, Button, TextInput } from '@mantine/core'
import { getHotkeyHandler } from '@mantine/hooks'
import { IconArrowUp } from '@tabler/icons-react'
import { RefObject, useEffect, useRef, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { CallbackResetFunction } from '../chat/page'
import APIService, { ChatType } from '../service/api'

type ChatMessageType = Pick<ChatType, 'source' | 'content'>

const ChatMessage = ({ source, content }: ChatMessageType) => {
  return (
    <div className="mb-4 w-3/4 md:w-1/2 self-center">
      <h3 className="font-bold my-2">{source == 'client' ? 'You' : 'AI'}</h3>
      <p>{content}</p>
    </div>
  )
}

type ChatComponentProps = {
  sessionId?: number
  chats: ChatType[]
  chatComponentRef?: RefObject<HTMLDivElement>
  handlePostChat: (content: string, callback: CallbackResetFunction) => void
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  voiceChatId?: number
}

const Chat = (props: ChatComponentProps) => {
  const { chats, chatComponentRef, handlePostChat, voiceEnabled, setVoiceEnabled, voiceChatId } = props
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState<boolean>(false)
  const { finalTranscript, resetTranscript } = useSpeechRecognition()
  const API = new APIService()
  const messageEndRef = useRef<HTMLDivElement>(null)

  // auto scroll to end of chat
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetInput = () => {
    resetTranscript()
    setInput('')
  }

  const onTextInput = () => handlePostChat(input, resetInput)

  const onVoiceInput = (transcript: string) => handlePostChat(transcript, resetInput)

  const toggleVoiceResponse = () => {
    setVoiceEnabled(!voiceEnabled)
  }

  const toggleVoiceInput = () => {
    setIsListening(!isListening)
  }

  // scroll to the latest message
  useEffect(() => {
    if (chats.length > 0) {
      scrollToBottom()
    }
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
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-230px)] w-full">
        {chats.map(({ source, content }, index) => (
          <ChatMessage key={index} source={source} content={content} />
        ))}
        <div ref={messageEndRef} className="self-center">
          {voiceEnabled && voiceChatId && (
            <audio id="ai-voice" src={API.getChatAudioURL(voiceChatId)} autoPlay>
              <track kind="captions" content={chats[chats.length - 1].content} />
            </audio>
          )}
        </div>
      </div>
      <div ref={chatComponentRef} className="flex flex-col self-center px-4 pt-4 w-full md:w-1/2">
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
        <TextInput
          placeholder="How can I help?"
          onChange={(event) => setInput(event.target.value)}
          value={input}
          size="lg"
          onKeyDown={getHotkeyHandler([['Enter', onTextInput]])}
          rightSection={
            <ActionIcon size={36} mr={5}>
              <IconArrowUp onClick={onTextInput} width={20}>
                Send
              </IconArrowUp>
            </ActionIcon>
          }
        />
      </div>
    </div>
  )
}

export default Chat
