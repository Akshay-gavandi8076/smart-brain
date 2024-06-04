'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'

export default function NotesPage() {
  const { noteId } = useParams<{ noteId: Id<'notes'> }>()
  const note = useQuery(api.notes.getNote, {
    noteId,
  })
  return <div>{note?.text}</div>
}
