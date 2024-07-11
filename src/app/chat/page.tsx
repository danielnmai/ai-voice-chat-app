'use client'
import { Container, Flex, ScrollArea, Stack, Text, Title } from '@mantine/core'
import { readLocalStorageValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { groupBy } from 'lodash'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import useAuth from '../hooks/useAuth'
import useSession from '../hooks/useSession'
import APIService, { ChatSession, ChatType } from '../service/api'
import handleError from '../service/handleError'
import Chat from '../shared/chat'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
})

type DateChatSessions = {
  [key: string]: ChatSession[]
}

type ChatSessionList = {
  date: string
  sessionList: ChatSession[]
}

export type CallbackResetFunction = () => void

const ChatPage = () => {
  const storedSessionId = readLocalStorageValue({ key: 'sessionId' }) as number
  const [sessionId, setSessionId] = useState<number>(storedSessionId)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceChatId, setVoiceChatId] = useState<number>()

  const [chats, setChats] = useState<ChatType[]>([])
  const [sessions, setSessions] = useState<DateChatSessions>()
  const { loggedInUser } = useAuth()
  const router = useRouter()
  const { saveSessionId } = useSession()
  const API = new APIService()

  const SessionList = ({ date, sessionList }: ChatSessionList) => {
    return (
      <Container>
        <Title order={6}>{date}</Title>
        <Stack>
          {sessionList.map((session) => (
            <Text key={session.id}>{session.firstMessage}</Text>
          ))}
        </Stack>
      </Container>
    )
  }

  const renderSessionList = () => {
    if (!sessions) return

    return Object.entries(sessions).map(([date, list], index) => (
      <SessionList key={index} id={index} date={date} sessionList={list} />
    ))
  }

  // fetch chat history based on stored information
  useEffect(() => {
    const fetchChats = async () => {
      if (loggedInUser && storedSessionId) {
        const { data } = await API.getChats({
          userId: loggedInUser.id,
          sessionId: storedSessionId
        })
        setChats(data)
      }
    }
    fetchChats()
  }, [])

  // fetch chat sessions of the user
  useEffect(() => {
    const fetchChatSessions = async () => {
      const getMonthAndYear = (date: string) => dayjs(date).format('MMMM YYYY')

      if (loggedInUser) {
        const { data } = await API.getChatSessions({ userId: loggedInUser.id })
        const formatData = groupBy(data, ({ created }) => getMonthAndYear(created))
        setSessions(formatData)
      }
    }
    fetchChatSessions()
  }, [])

  // Redirect user if not logged in
  useEffect(() => {
    if (!loggedInUser) {
      router.replace('/loginsignup')
    }
  }, [loggedInUser])

  const handlePostChat = async (content: string, reset: CallbackResetFunction) => {
    try {
      const userChat: ChatType = { sessionId, language: 'en', content, source: 'client' }
      setChats([...chats, userChat])

      const response = await API.postChat(userChat)

      const serverChat = response.data
      const { id, sessionId: serverSessionId } = serverChat

      if (serverSessionId && serverSessionId != sessionId) {
        setSessionId(serverSessionId)
        saveSessionId(serverSessionId)
      }

      if (voiceEnabled) {
        setVoiceChatId(id)
      }

      setChats([...chats, userChat, serverChat])
    } catch (error: unknown) {
      handleError(error)
    } finally {
      reset()
    }
  }
  console.log('sessions ', sessions)

  return (
    <Flex>
      <ScrollArea className="w-0 md:w-[280px] fixed">{renderSessionList()}</ScrollArea>

      <div className="w-full md:ml-[280px]">
        <Chat
          chats={chats}
          sessionId={sessionId}
          handlePostChat={handlePostChat}
          voiceEnabled={voiceEnabled}
          voiceChatId={voiceChatId}
          setVoiceEnabled={setVoiceEnabled}
        />
      </div>
    </Flex>
  )
}

export default ChatPage
