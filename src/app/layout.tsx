import React from 'react'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css'
import './globals.css'

import { ColorSchemeScript, MantineProvider } from '@mantine/core'

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
          <div id="app">{children}</div>
        </MantineProvider>
      </body>
    </html>
  )
}
