'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
      </Authenticated>
    </main>
  )
}
