# Church Website Deployment Guide

## 🚀 Deployment Options

### Option 1: Netlify (Recommended - FREE)

**Easiest deployment option with automatic updates**

#### Steps:
1. **Sign up for Netlify**
   - Visit https://www.netlify.com
   - Click "Sign Up"
   - Create account with GitHub, GitLab, or email

2. **Deploy Your Site**
   - Option A: Drag & Drop
     - Click "Sites" in navbar
     - Drag the `church-website` folder into the drop zone
     - Site goes live instantly!
   
   - Option B: Git Integration
     - Push your files to GitHub/GitLab
     - Click "New site from Git"
     - Select your repository
   - Click "Deploy"

    #### Gallery manifest (optional build step)

    If you want the gallery to automatically pick up images pushed to `img/gallery`, add a small build step to generate a JSON manifest before deploy. Create a Netlify build command that runs:

    ```bash
    node scripts/generate-gallery.js
    # then your normal build (if any)
    ```

    This writes `img/gallery/gallery.json` which the site will use to populate the carousel and gallery grid.

3. **Configure Custom Domain**
   - In Site Settings → Domain settings
   - Add your custom domain
   - Update DNS records with Netlify nameservers
   - Wait 24-48 hours for DNS to propagate

   #### Netlify CMS & Identity Setup (recommended)

   1. Enable Netlify Identity in your site dashboard (Site settings → Identity). Turn on "Registration: Invite only" for controlled access.
   2. Enable Git Gateway (Identity → Services → Git Gateway) and connect to your Git provider.
   3. Add the following environment variables in Netlify (Site settings → Build & deploy → Environment):
      - `GITHUB_TOKEN` — a personal access token with `repo` scope (used by `netlify/functions/save-file` when committing edits).
      - `GITHUB_REPO` — repository slug like `username/repo`.
      - `GITHUB_BRANCH` — branch to commit to (default: `main`).
   4. Place the `admin/` folder in the repo (already added). Visit `https://<your-site>/.netlify/functions/` to verify functions, and `https://<your-site>/admin/` to open the CMS.

   Security note: Prefer using Git Gateway rather than direct `GITHUB_TOKEN` when possible. If using `GITHUB_TOKEN`, store it securely in Netlify env and rotate regularly.

#### Benefits:
- ✅ Free hosting
- ✅ Automatic deployments on code push
- ✅ Free SSL certificate
- ✅ CDN included
- ✅ Easy rollback versions

---

### Option 2: GitHub Pages (FREE)

**Great for version control and transparency**

#### Steps:
1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Church website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/church-website.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages"
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Click "Save"

3. **Add Custom Domain**
   - In Pages settings, add your domain
   - Update DNS records:
     ```
     A record: 185.199.108.153
     A record: 185.199.109.153
     A record: 185.199.110.153
     A record: 185.199.111.153
     ```

#### Benefits:
- ✅ Free hosting
- ✅ Version control with Git
- ✅ Automatic SSL
- ✅ Professional looking (`username.github.io`)
- ✅ Transparent code repository

---

### Option 3: Traditional Web Hosting

**Use when you have existing hosting or need more control**

#### FTP/SFTP Deployment:
1. **Upload Files**
   - Connect via FTP/SFTP client (FileZilla, cyberduck)
   - Upload all files to `public_html/` or `www/` folder
   - Ensure `index.html` is in root directory

2. **Set File Permissions**
   ```
   Files (.html, .css, .js, .json): 644
   Folders: 755
   ```

3. **Configure DNS**
   - Point domain to your hosting provider's nameservers
   - Update A record to hosting IP

#### Popular Hosting Providers:
- Bluehost (~$2.99/month)
- HostGator (~$2.64/month)
- DreamHost (~$2.59/month)
- InMotion (~$2.49/month)
- Kinsta (Premium, from $35/month)

---

### Option 4: AWS / Google Cloud / Azure

**For advanced users wanting scalability**

#### AWS S3 + CloudFront:
1. Create S3 bucket
2. Upload files with public permissions
3. Enable static website hosting
4. Create CloudFront distribution
5. Update DNS to CloudFront distribution

Cost: ~$0.50-2.00/month

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- [ ] All pages load correctly locally
- [ ] Responsive design tested on mobile/tablet
- [ ] All forms are working (or redirected to form service)
- [ ] Links are correct (no 404 errors)
- [ ] Images are optimized
- [ ] Church information is updated
- [ ] Social media links are correct
- [ ] Contact form service is configured
- [ ] Google Maps embed is updated
- [ ] No console errors in browser dev tools
- [ ] Spelling and grammar checked
- [ ] Metadata/SEO optimized

---

## 🔧 Configuration for Live Forms

Since this is static HTML, use these services for form submissions:

### Option A: Netlify Forms (RECOMMENDED)
1. Add attribute to form:
   ```html
   <form name="contact" method="POST" netlify>
       <!-- your form fields -->
   </form>
   ```
2. Deploy to Netlify
3. Submissions appear in Netlify dashboard

### Option B: Formspree
1. Visit https://formspree.io
2. Create project with your form
3. Update form action:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option C: Basin
1. Sign up at https://usebasin.com
2. Create form endpoint
3. Update form action to Basin URL
4. Emails sent to your inbox

---

## 🌍 Custom Domain Setup

### Purchase Domain
- GoDaddy ($10-15/year)
- Namecheap (~$9/year)
- Google Domains (~$12/year)
- Cloudflare (~$11/year)

### Connect to Netlify
1. In Netlify Site settings
2. Go to "Domain settings"
3. Click "Add custom domain"
4. Enter your domain
5. Netlify gives you nameservers
6. Update nameservers at registrar

### Connect to GitHub Pages
1. Add CNAME file to repository:
   ```
   yourdomain.com
   ```
2. Commit and push
3. Configure DNS A records at registrar

---

## 🔒 SSL Certificate

**All major hosting providers include FREE SSL:**
- Netlify: Automatic
- GitHub Pages: Automatic
- Traditional Hosting: Usually free with cPanel
- Always force HTTPS: Check hosting settings

---

## 📊 SEO Optimization

Before launch, optimize for search:

### 1. Update Meta Tags
In `index.html` head:
```html
<title>Church of Christ, Aka Road - Welcome</title>
<meta name="description" content="Your church description">
<meta name="keywords" content="church, worship, faith, community">
<meta property="og:image" content="path/to/image.jpg">
```

### 2. Add Sitemap
Create `sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://yourchurch.com/</loc>
        <lastmod>2026-03-20</lastmod>
    </url>
    <url>
        <loc>https://yourchurch.com/about.html</loc>
        <lastmod>2026-03-20</lastmod>
    </url>
    <!-- Add other pages -->
</urlset>
```

### 3. Add Robots.txt
Create `robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yourchurch.com/sitemap.xml
```

### 4. Submit to Search Engines
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters
- DuckDuckGo: https://duckduckgo.com/search

---

## 📈 Analytics Setup

### Google Analytics
1. Go to https://analytics.google.com
2. Create new property
3. Get tracking ID
4. Add to all pages:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'GA_ID');
   </script>
   ```

---

## 🚨 Monitoring After Launch

### Essential Monitoring:
1. **Uptime Monitoring**
   - UptimeRobot (free): Alerts if site goes down
   
2. **Error Tracking**
   - Browser console monitoring
   - Form submission tracking
   
3. **Redirect Chains**
   - Test old URLs if migrating
   - Set up 301 redirects

4. **Mobile Testing**
   - Test on real devices
   - Check Google Mobile-Friendly Test

---

## 🆘 Troubleshooting Deployment

### Pages Show 404
- Verify file paths are correct
- Check file permissions
- Ensure index.html is in root

### Styles Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file paths
- Verify file permissions

### Forms Not Working
- Check form service configuration
- Test in different browser
- Verify form names match

### Slow Performance
- Optimize images
- Enable compression
- Use CDN
- Minimize CSS/JS

---

## 📞 Support Contacts

**Netlify Support**: support@netlify.com
**GitHub Help**: https://github.community
**Form Services Support**: Check their website

---

## 📋 Post-Launch Tasks

- [ ] Set up Google Analytics
- [ ] Submit sitemap to search engines
- [ ] Test on all major browsers
- [ ] Verify mobile responsiveness
- [ ] Backup your files
- [ ] Set up monitoring
- [ ] Create admin documentation
- [ ] Train staff on content updates

---

**Congratulations on launching your church website! 🎉**

For ongoing maintenance and updates, see README.md
