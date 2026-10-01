import { generateMetadata as generateBlogMetadata } from '../../blog/[slug]/page'
import { getPostBySlug } from '@/lib/blog'
import ClientPost from '@/components/ClientPost'

export async function generateMetadata(props) {
  const metadata = await generateBlogMetadata(props)
  const { slug } = await props.params
  const url = `/journal/${slug}`

  return {
    ...metadata,
    alternates: { canonical: url },
    openGraph: { ...metadata.openGraph, url },
  }
}

export default async function JournalPostPage({ params }) {
  const { slug } = await params
  return <ClientPost post={getPostBySlug(slug)} backHref="/journal" backLabel="Back to journal" />
}
