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

The blog has Software and Life sections. Existing posts default to Software;
`category: "daily"` or `category: "life"` puts a post in Life. Set `section: "life"`
explicitly to use a personal topic such as `category: "travel"`. You can also set
`section: "software"` explicitly. Year and topic filters follow the selected section.

## Books & Life

Kitaplar `data/books/` klasöründeki `.md` dosyalarından okunur. Başlangıç örneği:
`data/books/ornek-kitap.md`. Dosya adı sayfanın adresidir:
`/books-and-life/ornek-kitap`.

```md
---
title: "Kitap adı"
author: "Yazar adı"
status: "finished"
finishedAt: "2026-09"
cover: "/images/books/kitabim.jpg"
description: "Kitap hakkında kısa bir açıklama."
---

## Kitap hakkında

Kendi yorumunu buraya yaz.

![Kitap fotoğrafım](/images/books/kitabim.jpg)

## Aklımda kalanlar

- İlk notum.
- İkinci notum.
```

Fotoğrafları `public/images/books/` klasörüne koy. Markdown ve `cover` yollarında
`public` yazma: `public/images/books/kitabim.jpg` için `/images/books/kitabim.jpg`
kullan. Örnekteki SVG bir yer tutucudur; kendi fotoğrafınla değiştirebilirsin.

`status`: `reading`, `finished` veya `planned`. `finishedAt`, `cover` ve
`description` isteğe bağlıdır. Uzun yorumlar frontmatter altındaki Markdown
bölümüne yazılır. Kitap kartı yorumun tamamını gösteren ayrı bir sayfaya açılır.

Kişisel yazılar ayrı olarak `data/life/` klasöründe tutulur ve Books & Life
sayfasındaki Life Notes bölümünde listelenir. Örnek: `data/life/ornek-life-notu.md`.
`title`, `createdAt` (YYYY-MM-DD), `description`, `author` ve `category`
frontmatter alanlarını kullanabilirsin. `section` eklemene gerek yok.
Fotoğraflar için `public/images/life/` klasörünü kullan.
Yazı adresi: `/books-and-life/life/dosya-adi`.
