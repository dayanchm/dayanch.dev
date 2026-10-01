import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from './blog'

const booksDirectory = path.join(process.cwd(), 'data/books')

export function getAllBooks() {
  return fs.readdirSync(booksDirectory)
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const { metadata, text } = parseFrontmatter(fs.readFileSync(path.join(booksDirectory, filename), 'utf8'))
      return { ...metadata, text, slug: filename.slice(0, -3) }
    })
}

export function getBookBySlug(slug) {
  return getAllBooks().find(book => book.slug === slug)
}
