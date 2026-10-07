import { createMetadata } from '@/lib/metadata'
import { getAllBooks } from '@/lib/books'
import Bookshelf from './Bookshelf'
// Life notes are temporarily disabled.
// import { getAllLifePosts } from '@/lib/life'

export const metadata = createMetadata({
  title: 'Books & Life',
  description: 'My reading shelf, notes from books, and stories from everyday life.',
  url: '/books-and-life',
})

export default function BooksAndLifePage() {
  const books = getAllBooks().map(({ text, ...book }) => book)
  // const lifePosts = getAllLifePosts()

  return (
    <main className="overflow-hidden px-4 pb-16 sm:px-6">
      <div className="home-grid pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <header className="py-10 lg:py-14">
          <div className="mb-4 flex items-center gap-3"><span className="section-label">Books & Life</span><span className="h-px w-10 bg-[var(--accent)]" /></div>
          <h1 className="text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[.95] tracking-[-0.055em]">Beyond <span className="text-[var(--foreground-muted)]">the screen.</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--foreground-muted)]">Books I spend time with, ideas that stay with me, and small stories from everyday life.</p>
        </header>

        <Bookshelf books={books} />

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
