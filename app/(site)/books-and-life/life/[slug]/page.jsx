import { notFound } from 'next/navigation'

// Life notes are temporarily disabled.
/*
import ClientPost from '@/components/ClientPost'
import { getAllLifePosts, getLifePostBySlug } from '@/lib/life'

export function generateStaticParams() {
  return getAllLifePosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getLifePostBySlug(slug)
  if (!post) notFound()
  return {
    title: `${post.title} | Life Notes | dayanch.dev`,
    description: post.description,
    alternates: { canonical: `/books-and-life/life/${slug}` },
  }
}

export default async function LifePostPage({ params }) {
  const { slug } = await params
  const post = getLifePostBySlug(slug)
  if (!post) notFound()
  return <ClientPost post={post} backHref="/books-and-life" backLabel="Back to Books & Life" />
}
*/

export default function LifePostPage() {
  notFound()
}
