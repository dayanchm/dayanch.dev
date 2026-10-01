import { createMetadata } from '@/lib/metadata'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAllBooks, getBookBySlug } from '@/lib/books'

export function generateStaticParams() {
  return getAllBooks().map(book => ({ slug: book.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const book = getBookBySlug(slug)
  if (!book) notFound()
  return createMetadata({
    title: `${book.title} | Books & Life | dayanch.dev`,
    description: book.description,
    url: `/books-and-life/${slug}`,
    type: 'article',
  })
}

const markdownComponents = {
  h2: ({ children }) => <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-8 text-xl font-semibold">{children}</h3>,
  p: ({ children }) => <p className="my-4 leading-8 text-[var(--foreground-muted)]">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 leading-7 text-[var(--foreground-muted)]">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 leading-7 text-[var(--foreground-muted)]">{children}</ol>,
  a: ({ href, children }) => <a href={href} className="text-[var(--accent)] underline underline-offset-4">{children}</a>,
  blockquote: ({ children }) => <blockquote className="my-6 border-l-2 border-[var(--accent)] pl-5 italic">{children}</blockquote>,
  img: ({ src, alt }) => src ? <Image src={src} alt={alt || ''} width={1000} height={750} unoptimized className="my-6 h-auto max-h-[640px] w-full rounded-xl object-contain" /> : null,
}

export default async function BookPage({ params }) {
  const { slug } = await params
  const book = getBookBySlug(slug)
  if (!book) notFound()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <Link href="/books-and-life" className="text-sm text-[var(--accent)]">← Books & Life</Link>
      <header className="mt-8 grid items-center gap-8 border-b border-[var(--border)] pb-10 sm:grid-cols-[180px_1fr]">
        {book.cover && <Image src={book.cover} alt={`${book.title} cover`} width={400} height={560} unoptimized className="h-64 w-full rounded-lg object-contain sm:h-auto" />}
        <div><span className="section-label">Reading notes</span><h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{book.title}</h1><p className="mt-4 text-[var(--foreground-muted)]">{book.author}</p>{book.description && <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">{book.description}</p>}</div>
      </header>
      <article className="mx-auto max-w-3xl py-6"><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{book.text}</ReactMarkdown></article>
    </main>
  )
}
