import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/auth'
import { useLocalStorage, readLocalStorageValue } from '@mantine/hooks'

export interface User {
  id: string
  name: string
  email: string
  authToken?: string
}

const useAuth = () => {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext)
  const [, saveUser, removeUser] = useLocalStorage({ key: 'user', getInitialValueInEffect: false })

  const loginUser = (user: User) => {
    setLoggedInUser(user)
    saveUser(JSON.stringify(user))
  }

  const logoutUser = () => {
    setLoggedInUser(null)
    removeUser()
  }

  return { loggedInUser, setLoggedInUser, loginUser, logoutUser }
}

export default useAuth
