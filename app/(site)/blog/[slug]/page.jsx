import { getPostBySlug } from '@/lib/blog'
import ClientPost from '@/components/ClientPost'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const url = `/blog/${slug}`
  const image = post.image || '/og-portrait.png'

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'dayanch.dev',
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'dayanch'],
      images: [
        {
          url: image,
          width: 1200,
          height: post.image ? 675 : 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  return <ClientPost post={post} />
}
