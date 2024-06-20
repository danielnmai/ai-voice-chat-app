'use client'
import { readLocalStorageValue } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import useAuth from '../hooks/useAuth'
import useSession from '../hooks/useSession'
import APIService, { ChatType } from '../service/api'
import handleError from '../service/handleError'
import Chat from '../shared/chat'

export type CallbackResetFunction = () => void

const ChatPage = () => {
  const storedSessionId = readLocalStorageValue({ key: 'sessionId' }) as number
  const [sessionId, setSessionId] = useState<number>(storedSessionId)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceChatId, setVoiceChatId] = useState<number>()

  const [chats, setChats] = useState<ChatType[]>([])
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
    <Chat
      chats={chats}
      sessionId={sessionId}
      handlePostChat={handlePostChat}
      voiceEnabled={voiceEnabled}
      voiceChatId={voiceChatId}
      setVoiceEnabled={setVoiceEnabled}
    />
  )
}

export default ChatPage
