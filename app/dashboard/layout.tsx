import { ClipboardPenIcon, Cog, FilesIcon } from 'lucide-react'
import Link from 'next/link'
import SideNav from './side-nav'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex gap-16 container mx-auto pt-12'>
      <SideNav />

      {children}
    </div>
  )
}
