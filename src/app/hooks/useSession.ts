import { useLocalStorage } from '@mantine/hooks'

const useSession = () => {
  const [savedSessionId, saveSessionId, removeSessionId] = useLocalStorage<number>({
    key: 'sessionId'
  })

  return { savedSessionId, saveSessionId, removeSessionId }
}

export default useSession
