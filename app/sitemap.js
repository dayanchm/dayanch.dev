import { getAllPosts } from '@/lib/blog'
import { getAllBooks } from '@/lib/books'
import { getAllLifePosts } from '@/lib/life'

export default async function sitemap() {
  const allPosts = getAllPosts()

  const baseUrl = 'https://dayanch.dev'

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  const blogRoutes = allPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const journalRoutes = blogRoutes.map(route => ({
    ...route,
    url: route.url.replace('/blog/', '/journal/'),
  }))

  return [...staticRoutes, {
    url: `${baseUrl}/journal`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }, {
    url: `${baseUrl}/books-and-life`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }, ...getAllBooks().map(book => ({
    url: `${baseUrl}/books-and-life/${book.slug}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  })), ...getAllLifePosts().map(post => ({
    url: `${baseUrl}/books-and-life/life/${post.slug}`,
    lastModified: new Date(post.createdAt),
    changeFrequency: 'monthly',
    priority: 0.5,
  })), ...blogRoutes, ...journalRoutes]
}
