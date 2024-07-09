import React, { Suspense } from 'react'

export default function LoginSignupLayout({
  children // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <Suspense>{children}</Suspense>
}
