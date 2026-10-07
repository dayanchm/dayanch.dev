import { createMetadata } from '@/lib/metadata'
import BlogClient from './BlogClient'
import { getAllPosts } from '@/lib/blog'

export const metadata = createMetadata({
  title: 'Blog',
  description: 'Practical tutorials and guides on software development, Laravel, Go, Docker, CI/CD, and deployment.',
  url: '/blog',
})

export default function Page() {
  const allPosts = getAllPosts()

  return <BlogClient allPosts={allPosts} />
}
