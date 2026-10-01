import BlogClient from '../blog/BlogClient'
import { getAllPosts } from '@/lib/blog'

export const metadata = {
  title: 'Journal | dayanch.dev',
  description: 'Software notes, personal stories, and lessons from building things.',
  alternates: { canonical: '/journal' },
  openGraph: { url: '/journal', title: 'Journal | dayanch.dev' },
}

export default function JournalPage() {
  return <BlogClient allPosts={getAllPosts()} postBasePath="/journal" />
}
