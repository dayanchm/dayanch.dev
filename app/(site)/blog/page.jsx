import { createMetadata } from '@/lib/metadata'
import BlogClient from './BlogClient'
import { getAllPosts } from '@/lib/blog'

export const metadata = createMetadata({
  title: 'Blog | dayanch.dev',
  description: 'Software development insights, tutorials, and developer experiences shared by Dayanch.',
  url: '/blog',
})

export default function Page() {
  const allPosts = getAllPosts()

  return <BlogClient allPosts={allPosts} />
}
