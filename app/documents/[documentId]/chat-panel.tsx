'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useAction } from 'convex/react'

export default function ChatPanel({
  documentId,
}: {
  documentId: Id<'documents'>
}) {
  const askQuestion = useAction(api.documents.askQuestion)

  return (
    <div className='w-[300px] bg-gray-900 flex flex-col justify-between gap-2 p-4'>
      <div className='w-[350] overflow-y-auto'>
        <div className='bg-gray-800'>Heloo</div>
        <div className='bg-gray-800'>world</div>
        <div className='bg-gray-800'>world</div>
        <div className='bg-gray-800'>world</div>
        <div className='bg-gray-800'>world</div>
        <div className='bg-gray-800'>world</div>
        <div className='bg-gray-800'>skjldbksd sdfsdfsdf sdfsdffsdfs</div>
        <div className='bg-gray-800'>world</div>
      </div>
      <div className='flex gap-1'>
        <form
          onSubmit={async (event) => {
            event.preventDefault()

            const form = event.target as HTMLFormElement
            const formData = new FormData(form)
            const text = formData.get('text') as string

            await askQuestion({ question: text, documentId }).then(console.log)
          }}
        >
          <Input
            required
            name='text'
          />
          <Button>Submit</Button>
        </form>
      </div>
    </div>
  )
}
