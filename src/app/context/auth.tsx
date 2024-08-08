'use client'

import { readLocalStorageValue } from '@mantine/hooks'
import axios from 'axios'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { PropsWithChildren, createContext, useState } from 'react'
import { User } from '../hooks/useAuth'
import usePersistentSession from '../hooks/useSession'

interface IAuthContext {
  loggedInUser: User | null | undefined
  setLoggedInUser: (user: User | null) => void
}

export const AuthContext = createContext<IAuthContext>({ loggedInUser: null, setLoggedInUser: () => {} })

const AuthProvider = ({ children }: PropsWithChildren) => {
  // Get the user object stored in local storage
  const user = readLocalStorageValue({ key: 'user' }) as string
  const { removeSessionId } = usePersistentSession()

  let storedUser = null

  if (user) {
    const parsedUser: User = JSON.parse(user)
    storedUser = parsedUser

    // set token for all axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedUser.authToken}`

    // check token for expiration
    const { authToken } = parsedUser
    const { exp } = jwtDecode(authToken!)
    const now = dayjs()
    const expiredDate = dayjs.unix(exp!)

    // token expired, remove session from local storage
    if (now.isAfter(expiredDate)) {
      console.warn('token expired, user needs to log in again')
      storedUser = null
      removeSessionId()
    }
  }

  const [loggedInUser, setLoggedInUser] = useState<User | null>(storedUser)

  return <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>{children}</AuthContext.Provider>
}

export default AuthProvider
