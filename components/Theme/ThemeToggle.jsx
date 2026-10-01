'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { FiMoon, FiSun } from 'react-icons/fi'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className="relative z-50 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--background)] text-lg text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      {mounted && (isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />)}
    </button>
  )
}
