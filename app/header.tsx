'use client'

import { ModeToggle } from '@/components/ui/mode-toggle'

import React from 'react'
import { HeaderActions } from './header-actions'
import Link from 'next/link'

export function Header() {
  return (
    <div className='bg-slate-900 py-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='flex gap-12 items-center'>
          <Link
            href='/'
            className='text-2xl cursor-pointer'
          >
            SmartBrain
          </Link>

          <Link
            href='/'
            className='hover:text-slate-400'
          >
            Documents
          </Link>
        </div>

        <div className='flex gap-4 items-center'>
          <ModeToggle />

          <HeaderActions />
        </div>
      </div>
    </div>
  )
}
