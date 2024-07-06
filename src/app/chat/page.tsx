'use client'
import { Flex, ScrollArea } from '@mantine/core'
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
    <Flex className="w-full h-full">
      <div className="md:w-1/4 sm:w-0 h-full">
        <ScrollArea className="w-[300px] sm:w-0 h-dvh fixed">
          <p>
            Charizard is a draconic, bipedal Pokémon. It is primarily orange with a cream underside from the chest to
            the tip of its tail. It has a long neck, small blue eyes, slightly raised nostrils, and two horn-like
            structures protruding from the back of its rectangular head. There are two fangs visible in the upper jaw
            when its mouth is closed. Two large wings with blue-green undersides sprout from its back, and a horn-like
            appendage juts out from the top of the third joint of each wing. A single wing-finger is visible through the
            center of each wing membrane. Charizard's arms are short and skinny compared to its robust belly, and each
            limb has three white claws. It has stocky legs with cream-colored soles on each of its plantigrade feet. The
            tip of its long, tapering tail burns with a sizable flame. As Mega Charizard X, its body and legs are more
            physically fit, though its arms remain thin. Its skin turns black with a sky-blue underside and soles. Two
            spikes with blue tips curve upward from the front and back of each shoulder, while the tips of its horns
            sharpen, turn blue, and curve slightly upward. Its brow and claws are larger, and its eyes are now red. It
            has two small, fin-like spikes under each horn and two more down its lower neck. The finger disappears from
            the wing membrane, and the lower edges are divided into large, rounded points. The third joint of each
            wing-arm is adorned with a claw-like spike. Mega Charizard X breathes blue flames out the sides of its
            mouth, and the flame on its tail now burns blue. It is said that its new power turns it black and creates
            more intense flames. It has two small, fin-like spikes under each horn and two more down its lower neck. The
            finger disappears from the wing membrane, and the lower edges are divided into large, rounded points. The
            third joint of each wing-arm is adorned with a claw-like spike. Mega Charizard X breathes blue flames out
            the sides of its mouth, and the flame on its tail now burns blue. It is said that its new power turns it
            black and creates more intense flames. It has two small, fin-like spikes under each horn and two more down
            its lower neck. The finger disappears from the wing membrane, and the lower edges are divided into large,
            rounded points. The third joint of each wing-arm is adorned with a claw-like spike. Mega Charizard X
            breathes blue flames out the sides of its mouth, and the flame on its tail now burns blue. It is said that
            its new power turns it black and creates more intense flames.
          </p>
        </ScrollArea>
      </div>

      <div className="md:w-3/4 sm:w-full">
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
