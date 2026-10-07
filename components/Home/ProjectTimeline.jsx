import Link from 'next/link'
import { FiArrowUpRight, FiBookOpen, FiCode, FiDatabase, FiLayers, FiTerminal } from 'react-icons/fi'

const projects = [
  {
    title: 'Go Turkmen',
    url: 'https://go.dayanch.dev',
    label: 'go.dayanch.dev',
    description: 'Lessons, runnable examples, and tests designed to make programming education more accessible.',
    meta: 'Education · Go',
    Icon: FiBookOpen,
  },
  {
    title: 'tm-data',
    url: 'https://github.com/turkmenos/tm-data',
    label: 'github.com/turkmenos/tm-data',
    description: 'Open-source Turkmenistan data for developers, researchers, writers, and students.',
    meta: 'Open source · Data',
    Icon: FiDatabase,
  },
  {
    title: 'GitHub',
    url: 'https://github.com/dayanchm',
    label: 'github.com/dayanchm',
    description: 'Small experiments, learning notes, and public repositories from my development process.',
    meta: 'Open source · Experiments',
    Icon: FiCode,
  },
  {
    title: 'Backend Notes',
    url: '/blog',
    label: 'dayanch.dev/blog',
    description: 'Practical notes on backend systems, deployment, tooling, and the lessons behind shipped work.',
    meta: 'Writing · Systems',
    Icon: FiTerminal,
  },
  {
    title: 'Experiments',
    url: '/one-object',
    label: 'dayanch.dev/one-object',
    description: 'Interactive sketches and small interface experiments built while exploring new ideas.',
    meta: 'Interface · Experiments',
    Icon: FiLayers,
  },
]

export default function ProjectTimeline() {
  return (
    <section className="pb-20">
      <div className="border-y border-[var(--border)] py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Projects</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[var(--foreground)] sm:text-3xl">
              Selected work.
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--foreground-muted)]">{projects.length} items</span>
        </div>

        <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
          {projects.map(project => {
            const Icon = project.Icon
            const isExternal = project.url.startsWith('http')

            return (
              <li key={project.title}>
                <Link
                  href={project.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 rounded-lg px-3 py-5 transition-colors hover:bg-[var(--bg-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:grid-cols-[2.5rem_minmax(0,0.8fr)_minmax(0,1.2fr)_auto] sm:items-center sm:gap-x-6 sm:py-6"
                >
                  <span className="grid size-10 place-items-center rounded-xl border border-[var(--border)] text-lg text-[var(--accent)]">
                    <Icon aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)] sm:text-lg">
                      {project.title}
                    </h3>
                    <p className="mt-1 break-words font-mono text-[11px] text-[var(--foreground-muted)]">
                      {project.label}
                    </p>
                  </div>
                  <div className="col-start-2 row-start-2 min-w-0 sm:col-start-3 sm:row-start-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                      {project.meta}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--foreground-muted)]">
                      {project.description}
                    </p>
                  </div>
                  <FiArrowUpRight aria-hidden="true" className="col-start-3 row-start-1 mt-2 text-lg text-[var(--foreground-muted)] transition-colors group-hover:text-[var(--accent)] sm:col-start-4 sm:mt-0" />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
