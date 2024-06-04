'use client'

import { ModeToggle } from '@/components/ui/mode-toggle'

import React from 'react'
import { HeaderActions } from './header-actions'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  return (
    <div className='bg-slate-900 py-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div
          className='text-2xl cursor-pointer'
          onClick={() => router.push('/')}
        >
          SmartBrain
        </div>
        <div className='flex gap-4 items-center'>
          <ModeToggle />

          <HeaderActions />
        </div>
      </div>
    </div>
  )
}
