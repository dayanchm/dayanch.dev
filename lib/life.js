import fs from 'fs'
import path from 'path'
import { parseFrontmatter } from './blog'

const lifeDirectory = path.join(process.cwd(), 'data/life')

export function getAllLifePosts() {
  return fs.readdirSync(lifeDirectory)
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const { metadata, text } = parseFrontmatter(fs.readFileSync(path.join(lifeDirectory, filename), 'utf8'))
      return { ...metadata, text, slug: filename.slice(0, -3) }
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
}

export function getLifePostBySlug(slug) {
  return getAllLifePosts().find(post => post.slug === slug)
}
