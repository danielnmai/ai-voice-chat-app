'use client'
import { Flex, ScrollArea } from '@mantine/core'
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

export type CallbackResetFunction = () => void

const ChatPage = () => {
  const storedSessionId = readLocalStorageValue({ key: 'sessionId' }) as number
  const [sessionId, setSessionId] = useState<number>(storedSessionId)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceChatId, setVoiceChatId] = useState<number>()

  const [chats, setChats] = useState<ChatType[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const { loggedInUser } = useAuth()
  const router = useRouter()
  const { saveSessionId } = useSession()
  const API = new APIService()

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
      if (loggedInUser) {
        const { data } = await API.getChatSessions({ userId: loggedInUser.id })
        setSessions(data)
      }
    }
    fetchChatSessions()
  }, [])
  const getMonthAndYear = (date: string) => {
    return dayjs(date).format('MMMM YYYY')
  }
  if (sessions) {
    const formatData = groupBy(sessions, ({ created }) => getMonthAndYear(created))
    console.log('formatted data', formatData)
  }

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

  return (
    <Flex>
      <ScrollArea className="w-0 md:w-[280px] fixed">
        <p>
          Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside from the chest to the
          tip of its tail. It has a long neck, small blue eyes, slightly raised nostrils, and two horn-like structures
          protruding from the back of its rectangular head. There are two fangs visible in the upper jaw when its mouth
          is closed. Two large wings with blue-green undersides sprout from its back, and a horn-like appendage juts out
          from the top of the third joint of each wing. A single wing-finger is visible through the center of each wing
          membrane. Charizard's arms are short and skinny compared to its robust belly, and each limb has three white
          claws. It has stocky legs with cream-colored soles on each of its plantigrade feet. The tip of its long,
          tapering tail burns with a sizable flame. As Mega Charizard X, its body and legs are more physically fit,
          though its arms remain thin. Its skin turns black with a sky-blue underside and limb has three white claws. It
          has stocky legs with cream-colored soles on each of its plantigrade feet. The tip of its long, tapering tail
          burns with a sizable flame. As Mega Charizard X, its body and legs are more physically fit, though its arms
          remain thin. Its skin turns black with a sky-blue underside andlimb has three white claws. It has stocky legs
          with cream-colored soles on each of its plantigrade feet. The tip of its long, tapering tail burns with a
          sizable flame. As Mega Charizard X, its body and legs are more physically fit, though its arms remain thin.
          Its skin turns black with a sky-blue underside andlimb has three white claws. It has stocky legs with
          cream-colored soles on each of its plantigrade feet. The tip of its long, tapering tail burns with a sizable
          flame. As Mega Charizard X, its body and legs are more physically fit, though its arms remain thin. Its skin
          turns black with a sky-blue underside andlimb has three white claws. It has stocky legs with cream-colored
          soles on each of its plantigrade feet. The tip of its long, tapering tail burns with a sizable flame. As Mega
          Charizard X, its body and legs are more physically fit, though its arms remain thin. Its skin turns black with
          a sky-blue underside andlimb has three white claws. It has stocky legs with cream-colored soles on each of its
          plantigrade feet. The tip of its long, tapering tail burns with a sizable flame. As Mega Charizard X, its body
          and legs are more physically fit, though its arms remain thin. Its skin turns black with a sky-blue underside
          andlimb has three white claws. It has stocky legs with cream-colored soles on each of its plantigrade feet.
          The tip of its long, tapering tail burns with a sizable flame. As Mega Charizard X, its body and legs are more
          physically fit, though its arms remain thin. Its skin turns black with a sky-blue underside andlimb has three
          white claws. It has stocky legs with cream-colored soles on each of its plantigrade feet. The tip of its long,
          tapering tail burns with a sizable flame. As Mega Charizard X, its body and legs are more physically fit,
          though its arms remain thin. Its skin turns black with a sky-blue underside and
        </p>
      </ScrollArea>

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
