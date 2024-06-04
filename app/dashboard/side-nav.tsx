'use client'

import { cn } from '@/lib/utils'
import { ClipboardPenIcon, Cog, FilesIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SideNav() {
  const pathname = usePathname()

  return (
    <nav>
      <ul className='space-y-6'>
        <li>
          <Link
            className={cn(
              'font-light flex gap-2 items-center text-xl hover:text-blue-300',
              {
                'text-blue-500': pathname.endsWith('/documents'),
              }
            )}
            href='/dashboard/documents'
          >
            <FilesIcon /> Documents
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              'font-light flex gap-2 items-center text-xl hover:text-blue-300',
              {
                'text-blue-500': pathname.endsWith('/notes'),
              }
            )}
            href='/dashboard/notes'
          >
            <ClipboardPenIcon /> Notes
          </Link>
        </li>
        <li>
          <Link
            className={cn(
              'font-light flex gap-2 items-center text-xl hover:text-blue-300',
              {
                'text-blue-500': pathname.endsWith('/settings'),
              }
            )}
            href='/dashboard/settings'
          >
            <Cog /> Setting
          </Link>
        </li>
      </ul>
    </nav>
  )
}
