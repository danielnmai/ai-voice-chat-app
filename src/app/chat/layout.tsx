import React from 'react'
import SharedApp from '../shared/shareApp'

export default function DashboardLayout({
  children // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <SharedApp>{children}</SharedApp>
}
