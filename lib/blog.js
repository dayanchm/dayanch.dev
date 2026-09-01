import fs from 'fs'
import path from 'path'

const blogDirectory = path.join(process.cwd(), 'data/blog')

function parseFrontmatter(fileContents) {
  const match = fileContents.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    return { metadata: {}, text: fileContents.trim() }
  }

  const [, frontmatter, text] = match
  const metadata = frontmatter.split('\n').reduce((data, line) => {
    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) return data

    const key = line.slice(0, separatorIndex).trim()
    const rawValue = line.slice(separatorIndex + 1).trim()

    try {
      data[key] = JSON.parse(rawValue)
    } catch {
      data[key] = rawValue
    }

    return data
  }, {})

  return { metadata, text: text.trim() }
}

function readPost(filename) {
  const filePath = path.join(blogDirectory, filename)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { metadata, text } = parseFrontmatter(fileContents)

  return {
    ...metadata,
    text,
    slug: filename.replace('.md', ''),
  }
}

export function getAllPosts() {
  return fs.readdirSync(blogDirectory)
    .filter(filename => filename.endsWith('.md'))
    .map(readPost)
}

export function getPostBySlug(slug) {
  return readPost(`${slug}.md`)
}
