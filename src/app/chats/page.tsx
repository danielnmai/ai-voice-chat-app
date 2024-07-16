'use client'
import { Container, Flex, ScrollArea, Stack, Text, Title } from '@mantine/core'
import { readLocalStorageValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { groupBy, reverse } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import Chat from '../components/chat'
import useAuth from '../hooks/useAuth'
import useSession from '../hooks/useSession'
import APIService, { ChatSession, ChatType } from '../service/api'
import handleError from '../service/handleError'

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

const ChatsPage = () => {
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
      <Container mt={10} mb={10} w={280}>
        <Title order={6}>{date}</Title>
        <Stack gap="xs">
          {sessionList.map((session, index) => (
            <Link
              key={index}
              href={{ pathname: '/chats', query: { sessionId: session.id } }}
              onClick={() => onSessionSelected(session.id)}
            >
              <Text pl={10} py={5} key={session.id} lineClamp={3} className="hover:bg-gray-100">
                {session.firstMessage}
              </Text>
            </Link>
          ))}
        </Stack>
      </Container>
    )
  }

  const renderSessionList = () => {
    if (!sessions) return

    return Object.entries(sessions).map(([date, list], index) => (
      <SessionList key={index} date={date} sessionList={list} />
    ))
  }

  const onSessionSelected = (id: number) => {
    setSessionId(id)
    saveSessionId(id)
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
  }, [storedSessionId])

  // fetch chat sessions of the user
  useEffect(() => {
    const fetchChatSessions = async () => {
      const getMonthAndYear = (date: string) => dayjs(date).format('MMMM YYYY')

      if (loggedInUser) {
        const { data } = await API.getChatSessions({ userId: loggedInUser.id })

        const groupedSessionsByDate = groupBy(reverse(data), ({ created }) => getMonthAndYear(created))
        setSessions(groupedSessionsByDate)
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
    if (!content) return

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

  return (
    <Flex>
      <ScrollArea className="w-0 md:w-[280px] fixed h-full">{renderSessionList()}</ScrollArea>

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

export default ChatsPage
