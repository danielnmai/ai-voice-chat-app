'use client'
import { readLocalStorageValue } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import 'regenerator-runtime/runtime'
import useAuth from '../hooks/useAuth'
import APIService, { ChatType } from '../service/api'
import Chat from '../shared/chat'

const ChatPage = () => {
  const storedSessionId = readLocalStorageValue({ key: 'sessionId' }) as number
  const [sessionId, setSessionId] = useState<number>(storedSessionId)
  const [chats, setChats] = useState<ChatType[]>([])
  const { loggedInUser } = useAuth()
  const router = useRouter()

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

  return <Chat chats={chats} sessionId={sessionId} setSessionId={setSessionId} setChats={setChats} />
}

export default ChatPage
