'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { usePathname } from 'next/navigation'
import { FaRedditAlien } from 'react-icons/fa'
import { PiShareFat } from 'react-icons/pi'
import { SiBluesky } from 'react-icons/si'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatCategory(category) {
  const value = (category || 'general').replace(/[-_]/g, ' ').trim()
  return value.replace(/\b\w/g, character => character.toUpperCase())
}

function getReadingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 180))
}

function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false)
  const codeText = String(children).replace(/\n$/, '')
  const match = /language-([\w-]+)/.exec(className || '')

  if (!match) {
    return (
      <code className="rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-[0.88em] text-[var(--accent-hover)]">
        {codeText}
      </code>
    )
  }

  const language = match[1]

  async function handleCopy() {
    await navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="my-7 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#15161b] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-2 py-1 text-xs font-medium text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          background: '#15161b',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          },
        }}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  )
}

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mb-5 mt-12 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-12 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-10 text-xl font-semibold text-[var(--foreground)]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-[16px] leading-8 text-[var(--foreground-muted)] sm:text-[17px]">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--foreground)]">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="my-6 list-disc space-y-2.5 pl-6 text-[16px] leading-7 text-[var(--foreground-muted)] marker:text-[var(--accent)] sm:text-[17px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 list-decimal space-y-2.5 pl-6 text-[16px] leading-7 text-[var(--foreground-muted)] marker:font-semibold marker:text-[var(--accent)] sm:text-[17px]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-7 rounded-r-xl border-l-2 border-[var(--accent)] bg-[var(--bg-surface)] px-5 py-1 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[var(--accent)] underline decoration-[var(--accent)]/35 underline-offset-4 transition-colors hover:text-[var(--accent-hover)]"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-10 border-[var(--border)]" />,
  pre: ({ children }) => children,
  code: CodeBlock,
  table: ({ children }) => (
    <div className="my-7 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 font-semibold text-[var(--foreground)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--foreground-muted)]">
      {children}
    </td>
  ),
}

export default function ClientPost({ post }) {
  const pathname = usePathname()
  const fullUrl = `https://dayanch.dev${pathname}`
  const readingTime = getReadingTime(post.text)

  return (
    <main className="px-4 py-8 sm:py-12 lg:py-16">
      <article className="mx-auto max-w-6xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <span aria-hidden="true">←</span>
          Back to blog
        </Link>

        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--foreground-muted)]">
            <span className="rounded-full border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1 font-medium text-[var(--accent-hover)]">
              {formatCategory(post.category)}
            </span>
            <span>{readingTime} min read</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--foreground-muted)] sm:text-xl">
              {post.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--foreground-muted)]">
            <span className="font-medium text-[var(--foreground)]">{post.author || 'dayanch'}</span>
            <span aria-hidden="true" className="text-[var(--border)]">•</span>
            <time dateTime={post.createdAt}>{dateFormatter.format(new Date(post.createdAt))}</time>
          </div>
        </header>

        {post.image && (
          <figure className="mt-10 max-w-5xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--bg-surface)]">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>
            {post.imageCaption && (
              <figcaption className="mt-3 text-sm text-[var(--foreground-muted)]">
                {post.imageCaption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,46rem)_15rem] lg:gap-16">
          <div className="min-w-0 border-t border-[var(--border)] pt-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {post.text}
            </ReactMarkdown>
          </div>

          <aside className="lg:order-last">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 lg:sticky lg:top-28">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                Article
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-[var(--foreground-muted)]">Published</dt>
                  <dd className="mt-1 text-[var(--foreground)]">
                    {dateFormatter.format(new Date(post.createdAt))}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--foreground-muted)]">Reading time</dt>
                  <dd className="mt-1 text-[var(--foreground)]">{readingTime} minutes</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <p className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <PiShareFat size={17} />
                  Share article
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Reddit"
                    className="grid size-10 place-items-center rounded-xl border border-[var(--border)] text-[var(--foreground-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <FaRedditAlien size={18} />
                  </a>
                  <a
                    href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${post.title} ${fullUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Bluesky"
                    className="grid size-10 place-items-center rounded-xl border border-[var(--border)] text-[var(--foreground-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <SiBluesky size={17} />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
