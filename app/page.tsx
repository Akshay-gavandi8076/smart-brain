'use client'

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { DocumentCard } from './document-card'
import UploadeDocumentButton from './upload-document-button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function Home() {
  const documents = useQuery(api.documents.getDocuments)

  return (
    <main className='p-24 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>My Documents</h1>
        <UploadeDocumentButton />
      </div>

      {!documents && (
        <div className='grid grid-cols-4 gap-4'>
          {new Array(4).fill(0).map((_, i) => (
            <Card
              key={i}
              className=' h-[150px] p-6 flex flex-col justify-between'
            >
              <Skeleton className='h-[20px] rounded' />
              <Skeleton className='h-[20px] rounded' />
              <Skeleton className='w-[80px] h-[30px] rounded' />
            </Card>
          ))}
        </div>
      )}

      {documents && documents.length === 0 && (
        <div className='py-12 flex flex-col justify-center items-center gap-6'>
          <Image
            src='/documents.svg'
            width='200'
            height='200'
            alt='No documents'
          />
          <h2 className='text-2xl'>You have no documents</h2>
          <UploadeDocumentButton />
        </div>
      )}

      {documents && documents.length > 0 && (
        <div className='grid grid-cols-4 gap-4'>
          {documents?.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
            />
          ))}
        </div>
      )}
    </main>
  )
}
