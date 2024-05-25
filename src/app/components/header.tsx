'use client'

import { Button, Group } from '@mantine/core'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

const Header = () => {
  const { loggedInUser } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const onLogin = () => {
    console.log('clicked')
  }
  const onLogout = () => {
    console.log('clicked')
  }

  return (
    <Group visibleFrom="sm" justify="right" h={50} align="center" mr={10} color="red">
      {loggedInUser ? (
        <Button variant="default" onClick={onLogin}>
          Log out
        </Button>
      ) : (
        <Button variant="default" onClick={onLogout}>
          Log in
        </Button>
      )}
      <Button>Sign up</Button>
    </Group>
  )
}

export default Header
