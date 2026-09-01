const GITHUB_API = 'https://api.github.com'
const SEARCH_QUERY = 'is:pr author:dayanchm'

function githubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

function getRepositoryName(repositoryUrl = '') {
  return repositoryUrl.replace(`${GITHUB_API}/repos/`, '')
}

function getPrNumber(item) {
  const url = item?.pull_request?.html_url ?? ''
  return Number(url.split('/pull/').at(-1)) || item.number
}

function getStatus(item, details) {
  if (item.state === 'open') return 'Open'
  if (details?.merged) return 'Merged'
  return 'Closed'
}

async function fetchGithubJson(url) {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`)
  }

  return response.json()
}

async function getSearchItems() {
  if (!process.env.GITHUB_TOKEN) return []

  const items = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const url = new URL(`${GITHUB_API}/search/issues`)
    url.searchParams.set('q', SEARCH_QUERY)
    url.searchParams.set('sort', 'created')
    url.searchParams.set('order', 'desc')
    url.searchParams.set('per_page', '100')
    url.searchParams.set('page', String(page))

    const data = await fetchGithubJson(url)
    items.push(...(data.items ?? []))

    hasMore = items.length < Math.min(data.total_count ?? 0, 1000) && (data.items?.length ?? 0) === 100
    page += 1
  }

  return items
}

async function getPullRequestDetails(items) {
  const detailEntries = await Promise.all(
    items
      .filter(item => item.state !== 'open' && item.pull_request?.url)
      .map(async item => {
        try {
          return [item.id, await fetchGithubJson(item.pull_request.url)]
        } catch {
          return [item.id, null]
        }
      })
  )

  return new Map(detailEntries)
}

export async function getOpenSourceContributions() {
  try {
    const items = await getSearchItems()
    const detailsById = await getPullRequestDetails(items)

    return items
      .map(item => {
        const details = detailsById.get(item.id)

        return {
          id: item.id,
          repository: getRepositoryName(item.repository_url),
          number: getPrNumber(item),
          title: item.title,
          status: getStatus(item, details),
          createdAt: item.created_at,
          url: item.html_url,
        }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error(error)
    return []
  }
}
