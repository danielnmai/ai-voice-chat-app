'use client'

import { AppShell, Burger } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { PropsWithChildren } from 'react'
import Footer from './footer'
import Header from './header'

const SharedApp = ({ children }: PropsWithChildren) => {
  const [mobileOpened, { toggle }] = useDisclosure(false)

  return (
    <html>
      <body>
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
        >
          <AppShell.Header withBorder={false}>
            <Burger opened={mobileOpened} onClick={toggle} aria-label="toggle navigation" hiddenFrom="sm" />
            <Header />
          </AppShell.Header>

          <AppShell.Navbar></AppShell.Navbar>

          <AppShell.Main>{children}</AppShell.Main>
          <AppShell.Footer withBorder={false}>
            <Footer />
          </AppShell.Footer>
        </AppShell>
      </body>
    </html>
  )
}

export default SharedApp
