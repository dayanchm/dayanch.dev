'use client'

import { useState } from 'react'
import { FiArrowUpRight, FiBookOpen, FiCode, FiDatabase, FiLayers, FiTerminal } from 'react-icons/fi'

const projects = [
  {
    title: 'Go Turkmen',
    shortTitle: 'Go',
    url: 'https://go.dayanch.dev',
    label: 'go.dayanch.dev',
    description: 'Lessons, runnable examples, and tests designed to make programming education more accessible.',
    meta: 'Education · Go',
    Icon: FiBookOpen,
  },
  {
    title: 'tm-data',
    shortTitle: 'Data',
    url: 'https://github.com/turkmenos/tm-data',
    label: 'github.com/turkmenos/tm-data',
    description: 'Open-source Turkmenistan data for developers, researchers, writers, and students.',
    meta: 'Open source · Data',
    Icon: FiDatabase,
  },
  {
    title: 'GitHub',
    shortTitle: 'OSS',
    url: 'https://github.com/dayanchm',
    label: 'github.com/dayanchm',
    description: 'Small experiments, learning notes, and public repositories from my development process.',
    meta: 'Open source · Experiments',
    Icon: FiCode,
  },
  {
    title: 'Backend Notes',
    shortTitle: 'Notes',
    url: '/blog',
    label: 'dayanch.dev/blog',
    description: 'Practical notes on backend systems, deployment, tooling, and the lessons behind shipped work.',
    meta: 'Writing · Systems',
    Icon: FiTerminal,
  },
  {
    title: 'Experiments',
    shortTitle: 'Labs',
    url: '/one-object',
    label: 'dayanch.dev/one-object',
    description: 'Interactive sketches and small interface experiments built while exploring new ideas.',
    meta: 'Interface · Experiments',
    Icon: FiLayers,
  },
]

export default function ProjectTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = projects[activeIndex]
  const ActiveIcon = activeProject.Icon

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

        <div className="relative">
          <div className="absolute left-6 right-6 top-5 hidden h-px bg-[var(--border)] sm:block" aria-hidden="true" />
          <div className="grid gap-3 sm:grid-cols-5">
            {projects.map((project, index) => {
              const Icon = project.Icon
              const isActive = index === activeIndex

              return (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group relative flex min-h-16 w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left transition-colors hover:border-[var(--foreground-muted)] sm:min-h-28 sm:flex-col sm:items-start sm:justify-start sm:border-0 sm:bg-transparent sm:px-0 sm:pt-0"
                  aria-pressed={isActive}
                >
                  <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-[var(--background)] transition-colors ${isActive ? 'border-[var(--foreground)] text-[var(--foreground)]' : 'border-[var(--border)] text-[var(--accent)] group-hover:border-[var(--foreground-muted)]'}`}>
                    <Icon />
                  </span>
                  <span className="min-w-0 sm:mt-4 sm:pr-3">
                    <span className="block truncate text-sm font-semibold text-[var(--foreground)] sm:text-base">{project.shortTitle}</span>
                    <span className="mt-1 block truncate text-xs text-[var(--foreground-muted)]">{project.title}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-[var(--border)] pt-8 md:grid-cols-[0.75fr_1.25fr_auto] md:items-start">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--bg-surface)] text-xl text-[var(--accent)]">
              <ActiveIcon />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-xs text-[var(--foreground-muted)]">{activeProject.label}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{activeProject.title}</h3>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--foreground-muted)]">{activeProject.meta}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">{activeProject.description}</p>
          </div>

          <a
            href={activeProject.url}
            target={activeProject.url.startsWith('http') ? '_blank' : undefined}
            rel={activeProject.url.startsWith('http') ? 'noreferrer' : undefined}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Open
            <FiArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}
