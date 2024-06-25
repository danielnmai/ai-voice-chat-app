'use client'

import { Button, Container, Stack, Text, Title } from '@mantine/core'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { CallbackResetFunction } from '../chat/page'
import APIService, { ChatType } from '../service/api'
import Chat from './chat'

const Landing = () => {
  const [chats, setChats] = useState<ChatType[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false)
  const [voiceChatId, setVoiceChatId] = useState<number>()
  const [demoEnded, setDemoEnded] = useState<boolean>(false)

  const chatRef = useRef<HTMLDivElement>(null)

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePostChat = async (content: string, reset: CallbackResetFunction) => {
    try {
      const API = new APIService()
      const userChat: ChatType = { language: 'en', content, source: 'client' }
      setChats([...chats, userChat])

      const response = await API.postChatDemo(userChat)

      if (response && response.data) {
        const serverChat = response.data
        const { id } = serverChat

        if (voiceEnabled) {
          setVoiceChatId(id)
        }
        setChats([...chats, userChat, serverChat])
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        setDemoEnded(true)
      }
    } finally {
      reset()
    }
  }

  return (
    <div>
      <div className="h-[80vh] bg-hero bg-no-repeat bg-cover bg-center">
        <Container className="flex flex-col h-full justify-center" size="lg">
          <Title className="text-4xl text-white mb-5">An AI Conversationalist</Title>
          <Text className="text-white text-2xl mb-10">
            A helpful assistant that can listen to your voice and speak to you
          </Text>
          <Stack align="start" justify="center">
            <Link href={{ pathname: '/chat' }}>
              <Button
                w={200}
                className="text-xl"
                variant="gradient"
                gradient={{ from: 'pink', to: 'yellow' }}
                size="xl"
                mb="md"
              >
                Get started
              </Button>
            </Link>
            <Button
              w={200}
              className="text-xl"
              variant="gradient"
              gradient={{ from: 'green', to: 'blue' }}
              size="xl"
              mb="md"
              onClick={scrollToChat}
            >
              Give it a try
            </Button>
          </Stack>
        </Container>
      </div>
      <div className="my-5">
        <Chat
          chats={chats}
          chatComponentRef={chatRef}
          handlePostChat={handlePostChat}
          voiceEnabled={voiceEnabled}
          voiceChatId={voiceChatId}
          setVoiceEnabled={setVoiceEnabled}
          demoEnded={demoEnded}
        />
      </div>
    </div>
  )
}

export default Landing
