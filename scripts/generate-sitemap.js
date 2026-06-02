const fs = require('fs');
const path = require('path');

const siteUrl = 'https://churchofchristakaro.com';
const pages = [
  'index.html',
  'about.html',
  'sermons.html',
  'events.html',
  'gallery.html',
  'give.html',
  'contact.html',
  'livestream.html',
  'radio.html'
];

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return formatDate(stats.mtime);
  } catch (error) {
    return formatDate(new Date());
  }
}

const urlEntries = pages.map((page) => {
  const loc = page === 'index.html' ? `${siteUrl}/` : `${siteUrl}/${page}`;
  const filePath = path.join(process.cwd(), page);
  const lastmod = getLastModified(filePath);
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join('\n')}\n</urlset>\n`;
const robotsContent = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;

fs.writeFileSync(path.join(process.cwd(), 'sitemap.xml'), sitemapContent, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'robots.txt'), robotsContent, 'utf8');

console.log('Generated sitemap.xml and robots.txt');
