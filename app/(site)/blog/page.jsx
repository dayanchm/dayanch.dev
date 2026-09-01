import BlogClient from './BlogClient'
import { getAllPosts } from '@/lib/blog'

export default function Page() {
  const allPosts = getAllPosts()

  return <BlogClient allPosts={allPosts} />
}
