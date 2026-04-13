const SITE_URL = 'https://xarkive.com'

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${SITE_URL}</loc>
      <changefreq>hourly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${SITE_URL}/methodology</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  </urlset>`
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap()
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default SiteMap
