import Link from 'next/link'
import { FiArrowUpRight, FiBookOpen } from 'react-icons/fi'
import Image from 'next/image'
import { getAllBooks } from '@/lib/books'
// Life notes are temporarily disabled.
// import { getAllLifePosts } from '@/lib/life'

export const metadata = {
  title: 'Books & Life | dayanch.dev',
  description: 'My reading shelf, notes from books, and stories from everyday life.',
  alternates: { canonical: '/books-and-life' },
}

const statusLabels = { reading: 'Currently reading', finished: 'Read', planned: 'Want to read' }

export default function BooksAndLifePage() {
  const books = getAllBooks()
  // const lifePosts = getAllLifePosts()

  return (
    <main className="overflow-hidden px-4 pb-16 sm:px-6">
      <div className="home-grid pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl">
        <header className="py-10 lg:py-14">
          <div className="mb-4 flex items-center gap-3"><span className="section-label">Books & Life</span><span className="h-px w-10 bg-[var(--accent)]" /></div>
          <h1 className="text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[.95] tracking-[-0.055em]">Beyond <span className="text-[var(--foreground-muted)]">the screen.</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">Books I spend time with, ideas that stay with me, and small stories from everyday life.</p>
        </header>

        <section aria-labelledby="books-heading" className="border-t border-[var(--border)] py-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="books-heading" className="text-2xl font-semibold tracking-tight">My bookshelf</h2>
            <span className="text-xs text-[var(--foreground-muted)]">{books.length} {books.length === 1 ? 'book' : 'books'}</span>
          </div>
          {books.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books.map(book => (
                <article key={book.slug} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                  {book.cover && <Link href={`/books-and-life/${book.slug}`} className="mb-6 block"><Image src={book.cover} alt={`${book.title} cover`} width={400} height={560} unoptimized className="h-64 w-full rounded-lg object-contain" /></Link>}
                  <div className="mb-6 flex items-center justify-between gap-3"><FiBookOpen aria-hidden="true" className="text-xl text-[var(--accent)]" /><span className="text-[10px] uppercase tracking-[.13em] text-[var(--foreground-muted)]">{statusLabels[book.status] || 'Read'}</span></div>
                  <h3 className="text-xl font-semibold tracking-tight"><Link href={`/books-and-life/${book.slug}`} className="hover:text-[var(--accent)]">{book.title}</Link></h3>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">{book.author}</p>
                  {book.finishedAt && <p className="mt-3 text-xs text-[var(--foreground-muted)]">Finished {book.finishedAt}</p>}
                  {book.description && <p className="mt-5 border-t border-[var(--border)] pt-4 text-sm leading-7 text-[var(--foreground-muted)]">{book.description}</p>}
                  <Link href={`/books-and-life/${book.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--accent)]">Read notes <FiArrowUpRight aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center"><FiBookOpen aria-hidden="true" className="mx-auto mb-4 text-2xl text-[var(--accent)]" /><p className="font-medium">The bookshelf is waiting for its first book.</p><p className="mt-2 text-sm text-[var(--foreground-muted)]">Reading notes will find a home here.</p></div>}
        </section>

        {/* Life notes are temporarily disabled.
        <section aria-labelledby="life-heading" className="border-t border-[var(--border)] py-8">
          <h2 id="life-heading" className="mb-6 text-2xl font-semibold tracking-tight">Life notes</h2>
          {lifePosts.length ? <div>{lifePosts.map(post => (
            <Link key={post.slug} href={`/books-and-life/life/${post.slug}`} className="group flex items-center justify-between gap-5 border-b border-[var(--border)] py-5">
              <div><h3 className="text-lg font-semibold transition-colors group-hover:text-[var(--accent)]">{post.title}</h3>{post.description && <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{post.description}</p>}</div>
              <FiArrowUpRight aria-hidden="true" className="shrink-0 text-[var(--accent)]" />
            </Link>
          ))}</div> : <p className="text-sm leading-7 text-[var(--foreground-muted)]">More stories soon. A place for moments, discoveries, and things I learn along the way.</p>}
        </section>
        */}
      </div>
    </main>
  )
}
