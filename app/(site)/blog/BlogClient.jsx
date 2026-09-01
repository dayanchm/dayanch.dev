'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiArrowUpRight, FiBookOpen, FiSearch, FiX } from 'react-icons/fi'

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })

function timestamp(post) {
  const value = new Date(post.createdAt ?? post.publishedAt ?? 0).getTime()
  return Number.isFinite(value) ? value : 0
}

function formatDate(post) {
  const value = timestamp(post)
  return value ? dateFormatter.format(value) : 'Field note'
}

function categoryLabel(category = 'notes') {
  if (category === 'daily') return 'Life'
  if (!category) return 'Notes'
  return category.replace(/[-_]/g, ' ').trim().replace(/\b\w/g, char => char.toUpperCase())
}

function categoryGroup(category) {
  if (category === 'daily') return 'life'
  if (category === 'open-source') return 'open-source'
  if (!category) return 'notes'
  return 'software'
}

function excerpt(post, length = 180) {
  const value = (post.description || post.text || '').replace(/\s+/g, ' ').trim()
  return value.length > length ? `${value.slice(0, length - 3)}...` : value
}

function readTime(post) {
  const words = post.text?.trim().split(/\s+/).filter(Boolean).length ?? 0
  return `${Math.max(1, Math.round(words / 180))} min read`
}

const previewMarkdownComponents = {
  h1: ({ children }) => <h1 className="mb-4 mt-8 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-3 mt-8 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-7 text-xl font-semibold text-[var(--foreground)]">{children}</h3>,
  p: ({ children }) => <p className="my-4 text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-5 text-sm leading-7 text-[var(--foreground-muted)] marker:text-[var(--accent)] sm:text-base">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-5 text-sm leading-7 text-[var(--foreground-muted)] marker:text-[var(--accent)] sm:text-base">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-[var(--foreground)]">{children}</strong>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="font-medium text-[var(--accent)] underline underline-offset-4">{children}</a>,
  blockquote: ({ children }) => <blockquote className="my-6 border-l-2 border-[var(--accent)] bg-[var(--bg-surface)] px-4 py-1 italic">{children}</blockquote>,
  hr: () => <hr className="my-8 border-[var(--border)]" />,
  pre: ({ children }) => <pre className="my-5 overflow-x-auto rounded-xl bg-[#15161b] p-4 text-sm leading-6 text-white">{children}</pre>,
  code: ({ children }) => <code className="rounded border border-[var(--border)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--accent-hover)]">{children}</code>,
}

export default function BlogClient({ allPosts }) {
  const [selectedFilter, setSelectedFilter] = useState('latest')
  const [query, setQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)

  const posts = useMemo(() => [...allPosts].sort((a, b) => timestamp(b) - timestamp(a)), [allPosts])
  const years = useMemo(() => [...new Set(posts.map(post => {
    const value = timestamp(post)
    return value ? new Date(value).getFullYear().toString() : null
  }).filter(Boolean))], [posts])
  const categories = useMemo(() => ([
    { value: 'software', label: 'Software' },
    { value: 'life', label: 'Life' },
    { value: 'open-source', label: 'Open Source' },
    { value: 'notes', label: 'Notes' },
  ].filter(category => posts.some(post => categoryGroup(post.category) === category.value))), [posts])
  const filters = useMemo(() => [
    { value: 'latest', label: 'Latest', type: 'latest' },
    ...years.map(year => ({ value: `year:${year}`, label: year, type: 'year', year })),
    ...categories.map(category => ({ ...category, type: 'category' })),
  ], [categories, years])
  const matchingPosts = posts.filter(post => {
    const postYear = timestamp(post) ? new Date(timestamp(post)).getFullYear().toString() : ''
    const matchesFilter = selectedFilter === 'latest'
      || (selectedFilter.startsWith('year:') && selectedFilter === `year:${postYear}`)
      || categoryGroup(post.category) === selectedFilter
    const term = query.trim().toLowerCase()
    const matchesQuery = !term || `${post.title} ${post.description} ${post.category}`.toLowerCase().includes(term)
    return matchesFilter && matchesQuery
  })
  const filteredPosts = selectedFilter === 'latest' && !query.trim() ? matchingPosts.slice(0, 8) : matchingPosts
  const postsByYear = Object.entries(filteredPosts.reduce((groups, post) => {
    const year = timestamp(post) ? new Date(timestamp(post)).getFullYear().toString() : 'Undated'
    groups[year] = [...(groups[year] || []), post]
    return groups
  }, {})).sort(([yearA], [yearB]) => yearB.localeCompare(yearA))

  useEffect(() => {
    if (!selectedPost) return

    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedPost(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedPost])

  if (!posts.length) return <main className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6"><h1 className="text-5xl font-semibold">The journal is warming up.</h1></main>

  return (
    <main className="overflow-hidden px-4 pb-16 sm:px-6">
      <div className="home-grid pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl">
        <header className="grid gap-6 border-b border-[var(--border)] py-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end lg:py-14">
          <div>
            <div className="mb-4 flex items-center gap-3"><span className="section-label">The journal</span><span className="h-px w-10 bg-[var(--accent)]" /></div>
            <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[.95] tracking-[-0.055em]">Ideas in <span className="text-[var(--foreground-muted)]">progress.</span></h1>
          </div>
          <div className="lg:border-l lg:border-[var(--border)] lg:pl-6">
            <p className="text-sm leading-6 text-[var(--foreground-muted)]">Notes about software, life, open source, and the small things worth keeping.</p>
            <div className="mt-4 flex gap-6 text-[11px] uppercase tracking-[.13em] text-[var(--foreground-muted)]"><span><strong className="mr-1.5 text-sm text-[var(--foreground)]">{posts.length}</strong>articles</span><span><strong className="mr-1.5 text-sm text-[var(--foreground)]">{categories.length}</strong>sections</span></div>
          </div>
        </header>

        <section>
          <div className="flex flex-col gap-4 border-b border-[var(--border)] py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {filters.map(filter => <button key={filter.value} onClick={() => setSelectedFilter(filter.value)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] transition-colors ${selectedFilter === filter.value ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]'}`}>{filter.label}</button>)}
            </div>
            <label className="flex min-w-0 items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 lg:w-56"><FiSearch className="shrink-0 text-[var(--foreground-muted)]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the journal" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--foreground-muted)]" /></label>
          </div>

          <div className="py-9">
            <div className="mb-5 flex items-end justify-between"><div><p className="section-label">Archive</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Selected notes.</h2></div><p className="text-xs text-[var(--foreground-muted)]">{filteredPosts.length} results</p></div>
            {filteredPosts.length ? <div className="space-y-10">{postsByYear.map(([year, yearPosts]) => (
              <section key={year} className="grid gap-5 lg:grid-cols-[120px_1fr]">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className="flex items-baseline justify-between border-t border-[var(--foreground)] pt-3 lg:block">
                    <h3 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{year}</h3>
                    <p className="mt-2 text-xs uppercase tracking-[.13em] text-[var(--foreground-muted)]">{yearPosts.length} {yearPosts.length === 1 ? 'article' : 'articles'}</p>
                  </div>
                </div>
                <div className="border-t border-[var(--border)]">{yearPosts.map((post, index) => (
                  <button key={post.slug} type="button" onClick={() => setSelectedPost(post)} className="archive-row group grid w-full gap-3 border-b border-[var(--border)] py-4 text-left transition-colors hover:bg-[var(--bg-surface)] sm:grid-cols-[36px_1fr_auto] sm:items-center sm:px-3">
                    <span className="hidden font-mono text-[10px] text-[var(--foreground-muted)] sm:block">{String(index + 1).padStart(2, '0')}</span>
                    <div><div className="mb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[.13em] text-[var(--foreground-muted)]"><span className="text-[var(--accent)]">{categoryLabel(post.category)}</span><span>{formatDate(post)}</span></div><h4 className="text-base font-semibold leading-tight tracking-[-0.015em] transition-colors group-hover:text-[var(--accent)] sm:text-lg">{post.title}</h4><p className="mt-2 max-w-3xl text-xs leading-5 text-[var(--foreground-muted)] sm:hidden">{excerpt(post, 100)}</p></div>
                    <div className="flex items-center justify-between gap-5 sm:justify-end"><span className="flex items-center gap-2 text-[11px] text-[var(--foreground-muted)]"><FiBookOpen /> {readTime(post)}</span><FiArrowUpRight className="text-base transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" /></div>
                  </button>
                ))}</div>
              </section>
            ))}</div> : <div className="rounded-xl border border-dashed border-[var(--border)] py-14 text-center"><p className="text-lg font-medium">Nothing found.</p><button onClick={() => { setQuery(''); setSelectedFilter('latest') }} className="mt-3 text-sm text-[var(--accent)]">Clear filters</button></div>}
          </div>
        </section>
      </div>

      {selectedPost && (
        <div className="blog-preview-overlay fixed inset-0 z-[80] flex items-end bg-black/45 px-3 pt-16 backdrop-blur-sm sm:px-5" role="dialog" aria-modal="true" aria-labelledby="blog-preview-title">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close preview" onClick={() => setSelectedPost(null)} />
          <article className="blog-preview-panel relative mx-auto flex max-h-[86dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[28px] border border-[var(--border)] bg-[var(--background)] shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--background)]/95 px-5 py-4 backdrop-blur sm:px-7">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.13em] text-[var(--foreground-muted)]">
                  <span className="text-[var(--accent)]">{categoryLabel(selectedPost.category)}</span>
                  <span>{formatDate(selectedPost)}</span>
                  <span>{readTime(selectedPost)}</span>
                </div>
                <h2 id="blog-preview-title" className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">{selectedPost.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedPost(null)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border)] text-[var(--foreground-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]" aria-label="Close preview">
                <FiX />
              </button>
            </header>

            <div className="min-h-0 overflow-y-auto px-5 py-6 sm:px-7">
              {selectedPost.description && (
                <p className="mb-7 max-w-3xl text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">{selectedPost.description}</p>
              )}
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={previewMarkdownComponents}>
                {selectedPost.text}
              </ReactMarkdown>
            </div>

            <footer className="flex flex-col gap-3 border-t border-[var(--border)] bg-[var(--background)]/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs text-[var(--foreground-muted)]">Preview mode</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedPost(null)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]">
                  Close
                </button>
                <Link href={`/blog/${selectedPost.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)]">
                  Open full page
                  <FiArrowUpRight />
                </Link>
              </div>
            </footer>
          </article>
        </div>
      )}
    </main>
  )
}
