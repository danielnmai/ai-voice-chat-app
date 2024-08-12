'use client'

import 'regenerator-runtime/runtime'

import { ActionIcon, Container, Flex, List, Text, TextInput, ThemeIcon, Tooltip } from '@mantine/core'
import { getHotkeyHandler, useHotkeys } from '@mantine/hooks'
import {
  IconArrowUp,
  IconCircleCheck,
  IconMicrophone,
  IconMicrophoneOff,
  IconVolume,
  IconVolumeOff
} from '@tabler/icons-react'
import Link from 'next/link'
import { RefObject, useEffect, useRef, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { CallbackResetFunction } from '../chats/page'
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
  demoEnded?: boolean
}

const Chat = (props: ChatComponentProps) => {
  const { chats, chatComponentRef, handlePostChat, voiceEnabled, setVoiceEnabled, voiceChatId, demoEnded } = props
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

  // Hotkey to turn on/off voice input
  useHotkeys([['mod+shift+S', () => toggleVoiceInput()]])

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
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-300px)] w-full">
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
      <div className="flex flex-col self-center px-4 pt-4 max-w-[700px] min-w-[300px] w-full h-44">
        {!demoEnded ? (
          <div>
            <TextInput
              placeholder="Type or hit ⇧⌘S to speak"
              onChange={(event) => setInput(event.target.value)}
              value={input}
              size="lg"
              onKeyDown={getHotkeyHandler([['Enter', onTextInput]])}
              rightSectionWidth={130}
              rightSection={
                <Flex>
                  <ActionIcon aria-label="Send" size={36} mr={5} onClick={onTextInput}>
                    <IconArrowUp width={20} />
                  </ActionIcon>
                  <ActionIcon aria-label="Microphone" size={36} mr={5} onClick={toggleVoiceInput}>
                    {isListening ? <IconMicrophoneOff width={20} /> : <IconMicrophone width={20} />}
                  </ActionIcon>
                  <Tooltip label="Toggle with ⇧⌘V">
                    <ActionIcon aria-label="Speaker" size={36} mr={5} onClick={toggleVoiceResponse}>
                      {voiceEnabled ? <IconVolumeOff width={20} /> : <IconVolume width={20} />}
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              }
            />
          </div>
        ) : (
          <Container>
            <Text mb={5} size="lg">
              You used up your free messages! Want to continue?{' '}
              <Link href={{ pathname: '/loginsignup', query: { type: 'signup' } }}>
                <Text c="blue" span>
                  Sign up{' '}
                </Text>
              </Link>
              to get:
            </Text>
            <List
              size="lg"
              spacing={2}
              icon={
                <ThemeIcon color="blue" size={24} radius="l">
                  <IconCircleCheck style={{ width: 16, height: 16 }} />
                </ThemeIcon>
              }
            >
              <List.Item>Custom chat prompt</List.Item>
              <List.Item>Chat session</List.Item>
              <List.Item>Chat history</List.Item>
            </List>
            <Text size="lg" mb={5} mt={5}>
              And many more for free!
            </Text>
          </Container>
        )}
        <div ref={chatComponentRef}></div>
      </div>
    </div>
  )
}

export default Chat
