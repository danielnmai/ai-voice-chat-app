'use client'

import { useLocalStorage } from '@mantine/hooks'
import { useContext } from 'react'
import { AuthContext } from '../context/auth'
import usePersistSession from './useSession'

export interface User {
  id: number
  name: string
  email: string
  authToken?: string
}

const useAuth = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext)
  const [, saveUser, removeUser] = useLocalStorage({ key: 'user', getInitialValueInEffect: false })
  const { removeSessionId } = usePersistSession()

  const loginUser = (user: User) => {
    setLoggedInUser(user)
    saveUser(JSON.stringify(user))
  }

  const logoutUser = () => {
    setLoggedInUser(null)
    removeUser()
    removeSessionId()
  }

  return { loggedInUser, setLoggedInUser, loginUser, logoutUser }
}

export default useAuth
