# dayanch.dev

Personal website and blog for Dayanch. Built with Next.js, Tailwind CSS, and local Markdown blog content.

## Structure

```text
app/          Next.js routes, layouts, global styles, and route-only pages
components/   Reusable UI components
data/blog/    Blog post metadata and content files
lib/          Server-side helpers for blog and GitHub data
public/       Static assets
```

## Development

```bash
yarn install
yarn dev
```

Open `http://localhost:3000`.

## Build

```bash
yarn lint
yarn build
```

## Blog Content

Blog posts live in `data/blog` as Markdown files with frontmatter:

```md
---
title: "Post title"
author: "dayanch"
createdAt: "2026-01-01T00:00:00.000Z"
description: "Short summary"
category: "notes"
---

Post content goes here.
```
