'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import ChatPanel from './chat-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<'documents'> }
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  })

  if (!document) {
    return <div>You don&apos;t have access to view this document</div>
  }

  return (
    <main className='p-24 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>{document.title}</h1>
      </div>
      <div className='flex gap-12'>
        <Tabs
          defaultValue='account'
          className='w-full'
        >
          <TabsList className='mb-2'>
            <TabsTrigger value='document'>Document</TabsTrigger>
            <TabsTrigger value='chat'>Chat</TabsTrigger>
          </TabsList>
          <TabsContent value='document'>
            <div className='bg-gray-900 p-4 rounded-xl flex-1 h-[550px]'>
              {document.documentUrl && (
                <iframe
                  className='w-full h-full'
                  src={document.documentUrl}
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value='chat'>
            <ChatPanel documentId={document._id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
