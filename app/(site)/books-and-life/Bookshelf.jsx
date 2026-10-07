"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowUpRight, FiBookOpen } from 'react-icons/fi'
import styles from './bookshelf.module.css'

const statusLabels = { reading: 'Currently reading', finished: 'Read', planned: 'Want to read' }
const getYear = book => String(book.finishedAt || book.readYear || '').match(/^(\d{4})(?:$|-)/)?.[1] || 'undated'

export default function Bookshelf({ books }) {
  const [year, setYear] = useState('all')
  const years = [...new Set(books.map(getYear))].filter(value => value !== 'undated').sort((a, b) => Number(b) - Number(a))
  const filteredBooks = year === 'all' ? books : books.filter(book => getYear(book) === year)

  return (
    <section aria-labelledby="books-heading" className="border-t border-[var(--border)] py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 id="books-heading" className="text-2xl font-semibold tracking-tight">My bookshelf</h2>
        <div className="flex items-center gap-4">
          <span aria-live="polite" className="text-xs text-[var(--foreground-muted)]">{filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}</span>
          <label className={styles.yearFilter}>
            <span>Year</span>
            <select value={year} onChange={event => setYear(event.target.value)} aria-controls="bookshelf-items">
              <option value="all">All years</option>
              {years.map(value => <option key={value} value={value}>{value}</option>)}
              {books.some(book => getYear(book) === 'undated') && <option value="undated">Undated</option>}
            </select>
          </label>
        </div>
      </div>
      <div id="bookshelf-items">
        {filteredBooks.length ? (
          <div className={styles.shelf}>
          {filteredBooks.map((book, index) => (
            <article key={book.slug} className={styles.book}>
              <Link href={`/books-and-life/${book.slug}`} className={styles.coverLink} aria-label={`Read notes on ${book.title}`}>
                <div className={styles.cover}>
                  {book.cover ? (
                    <Image src={book.cover} alt={`${book.title} cover`} width={400} height={560} unoptimized className={styles.coverImage} />
                  ) : (
                    <div className={styles.fallbackCover}><FiBookOpen aria-hidden="true" /><span>{book.title}</span><small>{book.author}</small></div>
                  )}
                </div>
                <span className={styles.coverHint}>Read notes <FiArrowUpRight aria-hidden="true" /></span>
              </Link>
              <div className={styles.bookInfo}>
                <div className={styles.bookMeta}><span className={styles.bookNumber}>{String(index + 1).padStart(2, '0')}</span><span className={styles.status} data-reading={book.status === 'reading'}>{statusLabels[book.status] || 'Read'}</span></div>
                <h3 className={styles.bookTitle}><Link href={`/books-and-life/${book.slug}`}>{book.title}</Link></h3>
                <p className={styles.author}>{book.author}</p>
                {book.finishedAt && <p className={styles.finished}>Finished {book.finishedAt}</p>}
                {book.description && <p className={styles.description}>{book.description}</p>}
              </div>
            </article>
          ))}
          </div>
        ) : <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center"><FiBookOpen aria-hidden="true" className="mx-auto mb-4 text-2xl text-[var(--accent)]" /><p className="font-medium">{books.length ? 'No books for this year yet.' : 'The bookshelf is waiting for its first book.'}</p><p className="mt-2 text-sm text-[var(--foreground-muted)]">Reading notes will find a home here.</p></div>}
      </div>
    </section>
  )
}
