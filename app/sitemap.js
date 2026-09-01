import { getAllPosts } from '@/lib/blog'

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

  return [...staticRoutes, ...blogRoutes]
}