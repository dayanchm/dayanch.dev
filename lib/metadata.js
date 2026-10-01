export function createMetadata({ title, description, url, type = 'website' }) {
  const images = [{ url: '/og.png', width: 1200, height: 630, alt: 'Dayanch — Software, ideas & open source' }]

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'dayanch.dev', type, images },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
  }
}
