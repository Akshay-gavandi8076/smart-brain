'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import ChatPanel from './chat-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

export default function DocumentPage({
  params,
}: {
  params: { documentId: Id<'documents'> }
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  })

  return (
    <main className='p-24 space-y-8'>
      {!document && (
        <div className='space-y-10'>
          <div>
            <Skeleton className='w-3/4 h-8' />
          </div>
          <div className='flex gap-1'>
            <Skeleton className='w-24 h-8' />
            <Skeleton className='w-24 h-8' />
          </div>
          <Skeleton className='h-[500px]' />
        </div>
      )}

      {document && (
        <>
          <div className='flex justify-between items-center'>
            <h1 className='text-4xl font-bold'>{document.title}</h1>
          </div>
          <div className='flex gap-12'>
            <Tabs
              defaultValue='document'
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
        </>
      )}
    </main>
  )
}
