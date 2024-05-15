'use client'

import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Chat from './components/chat'

const App = () => {
  const [opened, { toggle }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 40, collapsed: false }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: true, desktop: true }
      }}
      footer={{
        height: 40
      }}
      id="app"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar></AppShell.Navbar>

      <AppShell.Main>
        <Chat />
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>
  )
}

export default App
