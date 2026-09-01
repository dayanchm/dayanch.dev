import Image from 'next/image'
import Link from 'next/link'
import { FiArrowUpRight, FiGithub, FiMail, FiTerminal } from 'react-icons/fi'
import ProjectTimeline from '@/components/Home/ProjectTimeline'
import { getAllPosts } from '@/lib/blog'
import { getOpenSourceContributions } from '@/lib/github'

const dateFormatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' })

function readingTime(text = '') {
  return `${Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 180))} min`
}

function categoryName(category = 'notes') {
  return category.replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' })

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function getContributionCalendar(contributions) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const endDate = new Date(today)
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 17 * 7)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const countsByDate = new Map()
  contributions.forEach(contribution => {
    const date = new Date(contribution.createdAt)
    date.setHours(0, 0, 0, 0)

    if (date >= startDate && date <= endDate) {
      const key = toDateKey(date)
      countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1)
    }
  })

  const weeks = []
  const monthLabels = []
  const cursor = new Date(startDate)

  for (let weekIndex = 0; weekIndex < 18; weekIndex += 1) {
    const week = []

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const current = new Date(cursor)
      const key = toDateKey(current)
      week.push({
        key,
        count: countsByDate.get(key) ?? 0,
        isFuture: current > endDate,
      })
      cursor.setDate(cursor.getDate() + 1)
    }

    const monthName = monthFormatter.format(new Date(week[0].key))
    if (weekIndex === 0 || monthName !== monthLabels.at(-1)?.name) {
      monthLabels.push({ name: monthName, week: weekIndex })
    }

    weeks.push(week)
  }

  return { weeks, monthLabels }
}

function contributionLevel(count) {
  if (count === 0) return 'bg-[var(--bg-surface)]'
  if (count === 1) return 'bg-emerald-900/50'
  if (count === 2) return 'bg-emerald-700'
  if (count === 3) return 'bg-emerald-500'
  return 'bg-emerald-400'
}

export default async function HomePage() {
  const posts = getAllPosts().sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
  const latestPosts = posts.slice(0, 3)
  const contributions = await getOpenSourceContributions()
  const contributionCalendar = getContributionCalendar(contributions)

  return (
    <main className="home-shell overflow-hidden px-4 pb-8 sm:px-6">
      <div className="home-grid pointer-events-none fixed inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl">
        <section className="grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:py-14">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mx-auto mb-7 max-w-md text-left lg:mx-0">
              <a
                href="https://www.ois-solutions.ch/"
                target="_blank"
                rel="noreferrer"
                className="group mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-3.5 py-2 text-xs font-medium text-[var(--foreground)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:hidden"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                <span className="text-[var(--accent)]">Workplace</span>
                <span className="h-3 w-px bg-[var(--border)]" />
                OIS Solutions
                <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <div className="hidden grid-cols-[112px_minmax(0,1fr)] items-end gap-3 sm:grid">
              <div className="relative hidden h-16 opacity-60 sm:block" aria-hidden="true">
                <span className="absolute left-0 top-5 rotate-[-9deg] font-serif text-base italic text-[var(--accent)] sm:text-lg">
                  workplace
                </span>
                <svg className="absolute left-9 top-8 h-8 w-16 text-[var(--accent)] sm:left-14 sm:w-18" viewBox="0 0 86 44" fill="none">
                  <path
                    d="M4 8C18 31 46 37 73 24"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeDasharray="3 5"
                  />
                  <path
                    d="M66 17L76 23.5L68 32"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <a
                href="https://www.ois-solutions.ch/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--foreground)] shadow-sm transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:text-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                OIS Solutions
                <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              </div>
            </div>
            <h1 className="mx-auto max-w-2xl text-[clamp(2.05rem,4.25vw,3.65rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--foreground)] lg:mx-0">
              I build software<span className="block text-[var(--foreground-muted)]">and share the process.</span>
            </h1>
            <div className="mx-auto mt-8 grid max-w-xl gap-8 sm:grid-cols-[1fr_auto] sm:items-end lg:mx-0">
              <div className="flex max-w-xl items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--foreground)] sm:text-sm">Software Developer · Go Developer · Open Source Contributor</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)] sm:text-base sm:leading-7">I&apos;m Dayanch — I build software, explore ideas, and contribute to open source.</p>
                </div>
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--border)] sm:hidden">
                  <Image src="/dayanch-portrait-hq.png" alt="Dayanch" fill priority sizes="64px" quality={92} className="object-cover object-top grayscale-[8%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full sm:block sm:max-w-[280px] lg:mx-0 lg:max-w-[320px]">
            <div className="profile-card relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] sm:rounded-[2rem]">
              <Image src="/dayanch-portrait-hq.png" alt="Dayanch" fill priority sizes="(max-width: 640px) 190px, (max-width: 1024px) 280px, 320px" quality={92} className="object-cover object-top grayscale-[8%]" />
              <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-[#0b0c0f] via-[#0b0c0f]/55 to-transparent sm:block" />
              <div className="absolute inset-x-0 bottom-0 hidden p-6 sm:block"><div className="flex items-end justify-between gap-4"><div><p className="text-2xl font-semibold tracking-tight text-white">Dayanch</p><p className="mt-1 text-sm text-white/60">Go developer · Open source contributor</p></div><div className="flex gap-2"><a href="https://github.com/dayanchm" target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur hover:bg-white hover:text-black"><FiGithub /></a><a href="mailto:muhammetgeldiyevdayanc@gmail.com" aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur hover:bg-white hover:text-black"><FiMail /></a></div></div></div>
            </div>
            <div className="absolute -left-5 top-8 hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]/90 px-4 py-3 shadow-2xl backdrop-blur sm:block"><div className="flex items-center gap-2 font-mono text-xs"><FiTerminal className="text-[var(--accent)]" /><span>shipping ideas</span><span className="terminal-cursor" /></div></div>
          </div>
        </section>

        <ProjectTimeline />
      </div>
    </main>
  )
}
