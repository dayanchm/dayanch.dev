"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiArrowUpRight, FiGithub, FiMenu, FiX } from 'react-icons/fi'

const menuItems = [
  { label: 'Home', href: '/', note: 'Start here' },
  { label: 'Journal', href: '/blog', note: 'Writing & notes' },
]

export default function Menus() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    const closeOnEscape = event => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <nav className="flex w-full items-center justify-between" aria-label="Main navigation">
      <Link href="/" className="relative z-50 text-base font-semibold tracking-[-0.03em]">
        dayanch<span className="text-[var(--accent)]">.</span>dev
      </Link>

      <ul className="hidden items-center gap-8 sm:flex">
        {menuItems.map(item => (
          <li key={item.href}>
            <Link href={item.href} className={`text-sm transition-colors hover:text-[var(--foreground)] ${pathname === item.href ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="mailto:muhammetgeldiyevdayanc@gmail.com" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-2 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
            Let&apos;s talk <FiArrowUpRight />
          </Link>
        </li>
      </ul>

      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="relative z-50 grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--background)] text-lg sm:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full z-40 h-[calc(100dvh-73px)] overflow-y-auto bg-[var(--background)] px-4 pb-6 pt-8 transition-[opacity,transform,visibility] duration-300 sm:hidden ${isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'}`}
        aria-hidden={!isOpen}
      >
        <div className="home-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex h-full max-w-lg flex-col">
          <p className="section-label mb-5">Navigation</p>
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {menuItems.map((item, index) => (
              <Link key={item.href} href={item.href} tabIndex={isOpen ? 0 : -1} className="group flex min-h-24 items-center justify-between py-5">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[10px] text-[var(--accent)]">0{index + 1}</span>
                  <span className="text-3xl font-semibold tracking-[-0.04em]">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--foreground-muted)]">{item.note}</span>
                  <FiArrowUpRight className="text-lg text-[var(--accent)]" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href="https://github.com/dayanchm" target="_blank" rel="noreferrer" tabIndex={isOpen ? 0 : -1} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 text-sm">
              GitHub <FiGithub />
            </a>
            <a href="https://www.ois-solutions.ch/" target="_blank" rel="noreferrer" tabIndex={isOpen ? 0 : -1} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 text-sm">
              OIS Solutions <FiArrowUpRight />
            </a>
          </div>

          <div className="mt-auto">
            <p className="mb-3 text-xs text-[var(--foreground-muted)]">Have a project or an idea?</p>
            <a href="mailto:muhammetgeldiyevdayanc@gmail.com" tabIndex={isOpen ? 0 : -1} className="flex w-full items-center justify-between rounded-2xl bg-[var(--accent)] p-5 text-base font-semibold text-[#17120e]">
              Let&apos;s talk <FiArrowUpRight className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
