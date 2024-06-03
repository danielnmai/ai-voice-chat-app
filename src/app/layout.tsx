import React from 'react'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import AuthProvider from './context/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Voice Chat App',
  description: 'Start a conversation with your AI assistant speech to speech'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider>
          <Notifications position="top-right" />
          <AuthProvider>
            <div id="app">{children}</div>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
