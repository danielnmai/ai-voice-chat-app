'use client'

import { readLocalStorageValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { PropsWithChildren, createContext, useState } from 'react'
import { User } from '../hooks/useAuth'

interface IAuthContext {
  loggedInUser: User | null | undefined
  setLoggedInUser: (user: User | null) => void
}

export const AuthContext = createContext<IAuthContext>({ loggedInUser: null, setLoggedInUser: () => {} })

const AuthProvider = ({ children }: PropsWithChildren) => {
  // Get the user object stored in local storage
  const user = readLocalStorageValue({ key: 'user' }) as string
  let storedUser = null

  if (user) {
    const parsedUser: User = JSON.parse(user)
    storedUser = parsedUser

    // check token for expiration
    const { authToken } = parsedUser
    const { exp } = jwtDecode(authToken!)
    const now = dayjs()
    const expiredDate = dayjs.unix(exp!)

    // token expired
    if (now.isAfter(expiredDate)) {
      storedUser = null
    }
  }

  const [loggedInUser, setLoggedInUser] = useState<User | null>(storedUser)

  return <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>{children}</AuthContext.Provider>
}

export default AuthProvider
