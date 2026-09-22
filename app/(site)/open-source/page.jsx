import { FiArrowUpRight, FiGitPullRequest, FiGithub } from 'react-icons/fi'
import { getOpenSourceContributions } from '@/lib/github'

export const metadata = {
  title: 'Open Source Contributions | dayanch.dev',
  description: 'Problems solved and pull requests contributed by Dayanch to open-source projects.',
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const statusStyles = {
  Merged: 'bg-[#8250df]/10 text-[#8250df]',
  Open: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Closed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

export default async function OpenSourcePage() {
  const contributions = await getOpenSourceContributions({ allowUnauthenticated: true })
  const mergedCount = contributions.filter(contribution => contribution.status === 'Merged').length
  const openCount = contributions.filter(contribution => contribution.status === 'Open').length
  const repositoryCount = new Set(contributions.map(contribution => contribution.repository)).size

  return (
    <main className="home-shell overflow-hidden px-4 pb-20 sm:px-6">
      <div className="home-grid pointer-events-none fixed inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl">
        <header className="grid gap-9 border-b border-[var(--border)] py-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:py-16">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="section-label">Open source</span>
              <span className="h-px w-10 bg-[var(--accent)]" />
            </div>
            <h1 className="max-w-3xl text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[.9] tracking-[-0.065em]">
              Problems found.<span className="block text-[var(--foreground-muted)]">Solutions shared.</span>
            </h1>
          </div>

          <div className="lg:border-l lg:border-[var(--border)] lg:pl-6">
            <p className="text-sm leading-6 text-[var(--foreground-muted)]">
              Contributions I have made to other people&apos;s projects — the problems I investigated and the fixes I shared with the community.
            </p>
            <a href="https://github.com/dayanchm" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]">
              <FiGithub /> GitHub profile <FiArrowUpRight />
            </a>
          </div>
        </header>

        <section className="grid grid-cols-3 border-b border-[var(--border)]">
          {[
            ['Projects', repositoryCount],
            ['Merged', mergedCount],
            ['Open', openCount],
          ].map(([label, value], index) => (
            <div key={label} className={`py-6 text-center sm:py-8 ${index > 0 ? 'border-l border-[var(--border)]' : ''}`}>
              <strong className="block text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{value}</strong>
              <span className="mt-1 block text-[10px] uppercase tracking-[.15em] text-[var(--foreground-muted)]">{label}</span>
            </div>
          ))}
        </section>

        <section className="py-12">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">Contribution log</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">What I solved.</h2>
            </div>
            <p className="font-mono text-xs text-[var(--foreground-muted)]">{contributions.length} pull requests</p>
          </div>

          {contributions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {contributions.map(contribution => (
                <a
                  key={contribution.id}
                  href={contribution.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-64 flex-col rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 transition-colors hover:border-[var(--accent)] sm:p-7"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--foreground-muted)]">
                      <FiGitPullRequest className="text-[var(--accent)]" />
                      <span>{contribution.repository}</span>
                      <span>#{contribution.number}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[.1em] ${statusStyles[contribution.status] ?? statusStyles.Closed}`}>{contribution.status}</span>
                  </div>

                  <div className="mt-9">
                    <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--accent)]">What I solved</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.025em] transition-colors group-hover:text-[var(--accent)]">{contribution.title}</h3>
                    {contribution.summary && <p className="mt-4 text-sm leading-6 text-[var(--foreground-muted)]">{contribution.summary}</p>}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-8 text-xs text-[var(--foreground-muted)]">
                    <span>{dateFormatter.format(new Date(contribution.createdAt))}</span>
                    <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      View PR <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border)] px-6 py-14 text-center">
              <FiGitPullRequest className="mx-auto text-2xl text-[var(--accent)]" />
              <h3 className="mt-4 text-lg font-semibold">Contributions are being collected.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">External pull requests will appear here automatically.</p>
              <a href="https://github.com/dayanchm" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">View on GitHub <FiArrowUpRight /></a>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
