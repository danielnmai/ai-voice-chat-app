'use client'

import { Button, Group } from '@mantine/core'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

const Header = () => {
  const { loggedInUser } = useAuth()
  const [mounted, setMounted] = useState(false)
  const { logoutUser } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const onLogin = () => {}

  const onLogout = () => {
    console.log('logging out...')
    logoutUser()
  }

  const onSignup = () => {}

  return (
    <Group visibleFrom="sm" justify="right" h={50} align="center" mr={10} color="red">
      {loggedInUser ? (
        <Link href={{ pathname: '/loginsignup', query: { type: 'login' } }} replace>
          <Button variant="default" onClick={onLogout}>
            Log out
          </Button>
        </Link>
      ) : (
        <Link href={{ pathname: '/loginsignup', query: { type: 'login' } }} replace>
          <Button variant="default" onClick={onLogin}>
            Log in
          </Button>
        </Link>
      )}
      <Link href={{ pathname: '/loginsignup', query: { type: 'signup' } }} replace>
        <Button onClick={onSignup}>Sign up</Button>
      </Link>
    </Group>
  )
}

export default Header
