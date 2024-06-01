'use client'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { api } from '@/convex/_generated/api'
import { SignInButton, UserButton } from '@clerk/nextjs'
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react'

export default function Home() {
  const createDocument = useMutation(api.documents.createDocuments)
  const documents = useQuery(api.documents.getDocuments)

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'></main>
  )
}
