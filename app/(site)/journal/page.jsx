import { createMetadata } from '@/lib/metadata'
import BlogClient from '../blog/BlogClient'
import { getAllPosts } from '@/lib/blog'

export const metadata = createMetadata({
  title: 'Journal | dayanch.dev',
  description: 'Software notes, personal stories, and lessons from building things.',
  url: '/journal',
})

export default function JournalPage() {
  return <BlogClient allPosts={getAllPosts()} postBasePath="/journal" />
}
