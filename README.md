# Church of Christ, Aka Road Website

A modern, fully-functional, production-ready church website built with vanilla HTML5, CSS3, and JavaScript. Features include responsive design, smooth animations, multiple content sections, and an interactive UI.

## 🎯 Features

### Core Pages
- **Home**: Hero section with navigation and quick info cards
- **About**: Church history, mission, vision, values, and beliefs
- **Sermons**: Comprehensive sermon library with series organization
- **Events**: Upcoming events with countdown timers and registration tracking
- **Gallery**: Photo gallery with lightbox preview functionality
- **Contact**: Contact form with validation and embedded Google Maps
- **Give/Donate**: Donation interface with multiple payment methods
- **Live Stream**: Watch live services and events
- **Radio**: Audio broadcasting page

### Technical Features
✅ Fully responsive (mobile, tablet, desktop)
✅ Smooth scroll animations and transitions
✅ Intersection Observer for scroll-triggered animations
✅ Countdown timers for events
✅ Interactive forms with client-side validation
✅ Lightbox gallery with keyboard navigation
✅ Mobile-friendly hamburger menu
✅ Accessibility features (ARIA labels, semantic HTML)
✅ Performance optimized
✅ SEO-friendly structure
✅ No build tools required (vanilla HTML/CSS/JS)

### Design Highlights
- Clean, minimal, modern aesthetic
- Church-appropriate color palette (Deep Blue #1e3a8a, Gold #d4af37, White)
- Professional typography and spacing
- Subtle gradients and shadows
- Calming aesthetic for spiritual environment

## 📁 Project Structure

```
church-website/
├── index.html                 # Home page
├── about.html                 # About page
├── sermons.html               # Sermons library
├── events.html                # Events & countdown timers
├── gallery.html               # Photo gallery
├── contact.html               # Contact form + Maps
├── give.html                  # Donation page
├── livestream.html            # Live stream page
├── radio.html                 # Radio page
│
├── css:
│   ├── main.css              # Main stylesheet (1200+ lines)
│   ├── animations.css        # Animation keyframes
│   └── responsive.css        # Mobile responsive styles
│
├── js/
│   ├── script.js             # Main application logic
│   ├── animations.js         # Animation utilities
│   └── utils.js              # Helper functions
│
├── img/                      # Image assets for site media
├── README.md                 # This file
└── .gitignore               # Git ignore file
```

## 🚀 Getting Started

### Quick Start
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Navigate through pages using the menu
4. Test responsive design by resizing your browser

### Local Development
No installation required! This project uses vanilla HTML, CSS, and JavaScript.

1. **Open with Live Server (Recommended)**
   - Install VS Code Live Server extension
   - Right-click on `index.html` → "Open with Live Server"
   - Server runs at `http://localhost:5500`

2. **Or use any local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Then visit**: `http://localhost:8000`

## 📋 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `index.html` | Landing page with hero section |
| About | `about.html` | Church history, mission, beliefs |
| Sermons | `sermons.html` | Sermon library with filtering |
| Events | `events.html` | Upcoming events with countdowns |
| Gallery | `gallery.html` | Photo gallery with lightbox |
| Contact | `contact.html` | Contact form + Google Maps |
| Give | `give.html` | Donation interface |
| Live Stream | `livestream.html` | Live streaming service page |
| Radio | `radio.html` | Audio broadcast page |


### Update Colors
Open `css/main.css` and adjust:
```css
:root {
    --primary: #1e3a8a;   /* Deep Blue */
    --accent: #d4af37;    /* Gold */
    --text: #333;         /* Dark Gray */
    --light: #f8f9fa;     /* Light Gray */
}
```

### Add Your Content
1. **Sermons**: Edit sermon data in `sermons.html` JavaScript section
2. **Events**: Edit event data in `events.html` JavaScript section
3. **Team**: Edit team data in `leadership.html` JavaScript section
4. **Gallery**: Add your images to `img/gallery/` and generate the manifest

### Gallery Workflow
The gallery is automated to load images from `img/gallery/gallery.json`.
To add pictures:
1. Place image files into `img/gallery/`
2. Run `npm run generate-gallery` or `node scripts/generate-gallery.js`
3. Open `gallery.html` from a local server

This means you do not need to edit the gallery HTML manually after uploading.

### Replace Placeholder Images
If the gallery manifest is missing, the page will show temporary placeholders instead. To use real images:
1. Add your image files to `img/gallery/`
2. Run the manifest generator
3. Reload `gallery.html`

### Update Social Media Links
Find social media links in footer and update:
```html
<a href="https://facebook.com/yourchurch">Facebook</a>
<a href="https://instagram.com/yourchurch">Instagram</a>
```

## 🔗 Google Maps Embed
In `contact.html`, update the embed URL:
```html
<!-- Replace with your actual Google Maps embed -->
<iframe src="https://www.google.com/maps/embed?pb=..."></iframe>
```

Get your embed code from: https://www.google.com/maps

## 📱 Responsive Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## ⌨️ Keyboard Shortcuts
- `Home` - Jump to top
- `End` - Jump to bottom
- `Escape` - Close mobile menu

## ♿ Accessibility Features
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Sufficient color contrast
- Alt text for images (when added)

## ⚡ Performance Tips
1. Optimize images before uploading
2. Use WebP format for best performance
3. Minimize external requests
4. Enable browser caching

## 🌐 Deployment

### Deploy to Netlify (Free)
1. Sign up at netlify.com
2. Drag & drop the `church-website` folder
3. Site goes live instantly

### Deploy to GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in settings
3. Select main branch as source

### Deploy to Hosting Provider
1. Upload files via FTP/SFTP
2. Ensure `index.html` is in root directory
3. Set proper file permissions (644 for files, 755 for folders)

### .htaccess for Apache
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## 🔒 Security Considerations
- All inputs are validated on the client side
- For live forms, use a backend/form service
- Recommended services: Formspree, Netlify Forms, Basin
- Never hardcode sensitive information

## ⚠️ Known Limitations
- Contact form is front-end only; you must integrate a server-side service to send emails
- Donate interface is demo-style; configure payment gateway (Stripe/PayPal) before production use
- Live stream and radio pages may require additional backend/media service configuration
- No database is included; content is static HTML and JS-driven

## 📊 Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Latest)

## 🐛 Troubleshooting

### Mobile Menu Not Working
- Check if hamburger element has ID `hamburger`
- Ensure nav menu has ID `navMenu`
- Verify JavaScript is loaded

### Animations Not Showing
- Ensure `css/animations.css` is linked
- Check browser support for CSS animations
- Disable if using `prefers-reduced-motion`

### Forms Not Validating
- Check browser console for errors
- Ensure `js/utils.js` is loaded
- Verify form IDs match JavaScript

### Maps Not Loading
- Check Google Maps API key
- Verify embed URL is correct
- Check browser console for CORS errors

## 🚧 Future Enhancements
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] CMS integration
- [ ] Blog section
- [ ] Prayer request form
- [ ] Membership system
- [ ] Live streaming integration
- [ ] Mobile app version

## 📄 License
Free to use for churches and non-profits

## 🤝 Support
For questions or customization help, contact the development team.

## 📞 Quick Reference

**Key Colors:**
- Primary: `#1e3a8a` (Deep Blue)
- Accent: `#d4af37` (Gold)
- Dark: `#003d82` (Darker Blue)

**Key Font Sizes:**
- H1: 3rem (desktop), 2rem (tablet), 1.5rem (mobile)
- H2: 2.2rem (desktop), 1.5rem (tablet)
- Body: 1rem base, 1.6 line-height

**Utility Functions Available:**
- `smoothScroll(elementId)` - Smooth scroll to element
- `Validation.isEmail(email)` - Validate email
- `StorageUtils.set(key, value)` - Store data
- `TimeUtils.formatDate(date)` - Format dates

## ✨ Credits
Built with modern web standards and best practices. No external dependencies required.

---

**Made with ❤️ for Church of Christ, Aka Road, Uyo**

Last Updated: March 2026
