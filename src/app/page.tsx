'use client'

import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Chat from './components/chat'
import Header from './components/header'

const App = () => {
  const [mobileOpened, { toggle }] = useDisclosure(false)

  return (
    <AppShell
      header={{ height: 50, collapsed: false }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: true }
      }}
      footer={{
        height: 40
      }}
      id="app"
    >
      <AppShell.Header withBorder={false}>
        <Burger opened={mobileOpened} onClick={toggle} aria-label="toggle navigation" hiddenFrom="sm" />
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <div>Navbar here</div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Chat />
      </AppShell.Main>
      <AppShell.Footer withBorder={false}>
        <div className="flex justify-center items-center h-full">
          <small>&copy; Copyright 2024, Daniel Mai</small>
        </div>
      </AppShell.Footer>
    </AppShell>
  )
}

export default App
