const fs = require('fs');
const path = require('path');

const siteUrl = 'https://churchofchristakaro.com';
const logoUrl = 'https://churchofchristakaro.com/img/CHURCH%20LOGO%20PNG.png';
const root = process.cwd();
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

const analyticsSnippet = `    <!-- Google Analytics (replace GA_ID with your tracking ID) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID');
    </script>`;

const structuredData = `    <script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Church of Christ, Aka Road, Uyo",
      "url": siteUrl,
      "logo": logoUrl,
      "sameAs": [
        "https://www.facebook.com/churchofchristaka/",
        "https://www.instagram.com/coc_144akard/",
        "https://x.com/coc_akaroad",
        "https://wa.me/2349090090481"
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+2349090090481",
          "contactType": "Customer service",
          "areaServed": "NG"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "144 Aka Road",
        "addressLocality": "Uyo",
        "addressRegion": "Akwa Ibom",
        "addressCountry": "NG"
      }
    },
    {
      "@type": "WebSite",
      "url": siteUrl,
      "name": "Church of Christ, Aka Road, Uyo",
      "publisher": {
        "@type": "Organization",
        "name": "Church of Christ, Aka Road, Uyo"
      }
    }
  ]
}, null, 2)}
    </script>`;

const defaultTags = (title, description, canonical, options = {}) => {
  const {
    includeThemeColor = true,
    includeCanonical = true,
    includeOg = true,
    includeTwitter = true
  } = options;

  const tags = [];
  if (includeThemeColor) {
    tags.push(`    <meta name="theme-color" content="#1e3a8a">`);
  }
  if (includeCanonical) {
    tags.push(`    <link rel="canonical" href="${canonical}">`);
  }
  if (includeOg) {
    tags.push(`    <meta property="og:title" content="${title}">`);
    tags.push(`    <meta property="og:description" content="${description}">`);
    tags.push(`    <meta property="og:type" content="website">`);
    tags.push(`    <meta property="og:url" content="${canonical}">`);
    tags.push(`    <meta property="og:image" content="${logoUrl}">`);
  }
  if (includeTwitter) {
    tags.push(`    <meta name="twitter:card" content="summary_large_image">`);
    tags.push(`    <meta name="twitter:title" content="${title}">`);
    tags.push(`    <meta name="twitter:description" content="${description}">`);
    tags.push(`    <meta name="twitter:image" content="${logoUrl}">`);
  }
  return tags.join('\n');
};

pages.forEach((page) => {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) {
    console.warn('Page not found:', page);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta name="description" content="([^"]*)">/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Church of Christ, Aka Road, Uyo';
  const description = descMatch ? descMatch[1].trim() : 'Church of Christ, Aka Road, Uyo official website.';
  const canonical = page === 'index.html' ? `${siteUrl}/` : `${siteUrl}/${page}`;

  const hasThemeColor = /<meta name="theme-color"/i.test(html);
  const hasCanonicalTag = /<link rel="canonical"/i.test(html);
  const hasOgTitle = /<meta property="og:title"/i.test(html);
  const hasTwitterTitle = /<meta name="twitter:title"/i.test(html);
  const hasAnalytics = /gtag\('config'|googletagmanager\.com\/gtag\//i.test(html);
  const hasStructuredData = /<script type="application\/ld\+json">/i.test(html);

  const canonicalLineMatch = html.match(/<link rel="canonical"[^>]*>/i);
  const insertAnchor = canonicalLineMatch ? canonicalLineMatch[0] : html.match(/<meta name="viewport" content="[^>]*">/i)?.[0] || '<meta charset="UTF-8">';

  let injection = '';
  injection += `${defaultTags(title, description, canonical, {
    includeThemeColor: !hasThemeColor,
    includeCanonical: !hasCanonicalTag,
    includeOg: !hasOgTitle,
    includeTwitter: !hasTwitterTitle
  })}\n`;

  if (!hasAnalytics) {
    injection += `${analyticsSnippet}\n`;
  }

  if (!hasStructuredData) {
    injection += `${structuredData}\n`;
  }

  if (injection) {
    html = html.replace(insertAnchor, `${insertAnchor}\n${injection}`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Updated SEO/analytics data for', page);
  } else {
    console.log('No changes needed for', page);
  }
});
