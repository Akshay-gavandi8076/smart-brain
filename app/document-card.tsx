import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Doc } from '@/convex/_generated/dataModel'
import { Eye } from 'lucide-react'
import Link from 'next/link'

export function DocumentCard({ document }: { document: Doc<'documents'> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <Button
          variant='secondary'
          className='flex items-center gap-2'
          asChild
        >
          <Link href={`/documents/${document._id}`}>
            <Eye className='h-4 w-4' />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
