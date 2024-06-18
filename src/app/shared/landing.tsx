'use client'

import { Button, Container, Stack, Text, Title } from '@mantine/core'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { ChatType } from '../service/api'
import Chat from './chat'

const Landing = () => {
  const [chats, setChats] = useState<ChatType[]>([])
  const chatRef = useRef<HTMLDivElement>(null)

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' })
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
              Give it a try!
            </Button>
          </Stack>
        </Container>
      </div>
      <div className="my-4">
        <Chat chats={chats} setChats={setChats} chatComponentRef={chatRef} />
      </div>
    </div>
  )
}

export default Landing
