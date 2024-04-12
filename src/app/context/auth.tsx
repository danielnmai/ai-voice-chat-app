'use client'

import { PropsWithChildren, createContext, useState } from 'react'
import { User } from '../hooks/useAuth'
import { readLocalStorageValue } from '@mantine/hooks'

interface IAuthContext {
  loggedInUser: User | null | undefined
  setLoggedInUser: (user: User | null) => void
}

export const AuthContext = createContext<IAuthContext>({ loggedInUser: null, setLoggedInUser: () => {} })

const AuthProvider = ({ children }: PropsWithChildren) => {
  // Get the user object stored in local storage
  const user = readLocalStorageValue({ key: 'user', defaultValue: '{}' })
  const parsedUser = JSON.parse(user)

  const [loggedInUser, setLoggedInUser] = useState<User | null>(parsedUser)

  return <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>{children}</AuthContext.Provider>
}

export default AuthProvider
