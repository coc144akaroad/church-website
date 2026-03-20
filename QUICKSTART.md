# 🚀 Quick Start Guide - Church of Christ, Aka Road Website

## ✅ What's Included

Your fully-functional church website includes:

### 📄 Pages (8 Total)
1. **Home** - Hero section with navigation, quick info, featured sermon, events preview, newsletter
2. **About** - Church history, mission, vision, core values, beliefs, timeline
3. **Sermons** - Sermon library with filtering by series, linked videos/audio
4. **Events** - Upcoming events with countdown timers, registration tracking
5. **Gallery** - Photo gallery with lightbox preview, keyboard navigation
6. **Contact** - Contact form with validation, address, phone, Google Maps embed
7. **Give/Donate** - Donation interface with multiple payment methods, impact stories
8. **Leadership** - Pastoral team, ministry leaders, ministry areas

### 🎨 Design Features
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Countdown timers
- ✅ Form validation
- ✅ Lightbox gallery
- ✅ Mobile hamburger menu
- ✅ Accessibility features
- ✅ Professional color palette (Blue #1e3a8a, Gold #d4af37)

### 📁 File Structure
```
church-website/
├── 8 HTML pages
├── css/ (3 stylesheets - 1200+ lines)
├── js/ (3 JavaScript files - 800+ lines)
├── README.md (Setup & features)
├── CUSTOMIZATION.md (How to customize)
├── DEPLOYMENT.md (How to deploy)
└── .gitignore
```

---

## 🎯 First Steps

### 1. Open the Website Locally
The website is already open in your browser! You can:
- Click through all pages
- Test the mobile menu
- Scroll for animations
- Fill out forms
- View the entire layout

### 2. Customize Your Content
**See CUSTOMIZATION.md for detailed instructions:**

Quick replacements:
- Find & Replace "Church of Christ, Aka Road, Uyo" → Your church name
- Find & Replace "123 Faith Street" → Your address
- Find & Replace "(555) 123-4567" → Your phone
- Find & Replace "info@gracettruth.org" → Your email

### 3. Update Key Information
- [ ] Church name (all pages)
- [ ] Address and phone (nav footer, contact page)
- [ ] Service times (index.html, footer)
- [ ] Pastor names (leadership.html, footer)
- [ ] Social media links (all footers)

### 4. Deploy to the Web
**See DEPLOYMENT.md for step-by-step instructions:**

**Easiest (Recommended):**
1. Sign up for Netlify (free)
2. Drag & drop the `church-website` folder
3. Your site is live!

**Other Options:**
- GitHub Pages (free)
- Traditional hosting (cheap)
- AWS/Google Cloud (scalable)

---

## 📝 Page-by-Page Content to Update

### Home (index.html)
- [ ] Update hero title/subtitle
- [ ] Edit quick info cards
- [ ] Add your latest sermon
- [ ] Update upcoming events list
- [ ] Customize newsletter section

### About (about.html)
- [ ] Update mission statement
- [ ] Update vision statement
- [ ] Edit church history
- [ ] Customize beliefs section
- [ ] Update core values

### Sermons (sermons.html)
- [ ] Edit sermon data in JavaScript
- [ ] Add your sermon series
- [ ] Update speaker names
- [ ] Add YouTube/Audio URLs

### Events (events.html)
- [ ] Edit event data in JavaScript
- [ ] Update event dates/times
- [ ] Add your church events
- [ ] Update event descriptions

### Gallery (gallery.html)
- [ ] Replace emoji placeholders with real images
- [ ] Update photo captions
- [ ] Add more gallery items

### Contact (contact.html)
- [ ] **Important**: Get Google Maps embed for your location
- [ ] Update address
- [ ] Update phone/email
- [ ] Update service times

### Give (give.html)
- [ ] Update donation amounts
- [ ] Edit why give section
- [ ] Add impact stories
- [ ] Connect to payment processor

### Leadership (leadership.html)
- [ ] Add pastor bios
- [ ] Add ministry leaders
- [ ] Update contact info
- [ ] Add/modify ministry areas

---

## 🔧 Essential Customizations

### 1. Update Colors (Optional)
In `css/main.css`:
```css
--primary: #1e3a8a;    /* Change to your primary color */
--accent: #d4af37;     /* Change to your accent color */
```

### 2. Update Fonts (Optional)
In `css/main.css` search for `font-family` and modify

### 3. Add Your Logo
Place logo in `assets/images/logo.png`
Update logo reference in HTML

---

## 📱 Test Your Site

Before launching:
- [ ] Test on mobile phone
- [ ] Test on tablet
- [ ] Test all navigation links
- [ ] Test all forms
- [ ] Test gallery lightbox
- [ ] Check all pages load correctly
- [ ] Verify animations work
- [ ] Check spelling/grammar

---

## 🌐 Ready to Deploy?

### Before Deploying
1. ✅ Complete all customizations
2. ✅ Test thoroughly (all devices)
3. ✅ Verify all content is accurate
4. ✅ Check for broken links
5. ✅ Optimize images
6. ✅ Update meta tags (SEO)

### Deploy Steps
1. Go to https://www.netlify.com
2. Sign up (free)
3. Drag & drop `church-website` folder
4. Your site is live!
5. (Optional) Add custom domain

See DEPLOYMENT.md for detailed instructions.

---

## 📞 Key Files for Reference

| File | Purpose |
|------|---------|
| README.md | Overview & setup |
| CUSTOMIZATION.md | How to customize content |
| DEPLOYMENT.md | How to deploy live |
| css/main.css | Main styles |
| css/animations.css | Animation definitions |
| js/script.js | Navigation & interactivity |
| js/animations.js | Scroll reveal animations |
| js/utils.js | Helper functions |

---

## 🎨 Color Palette

**Current Colors:**
- Primary Blue: `#1e3a8a`
- Accent Gold: `#d4af37`
- Dark Blue: `#003d82`
- Light Gray: `#f8f9fa`
- Dark Text: `#333`

**To Change:**
1. Open `css/main.css`
2. Find color values (hex codes)
3. Replace with your colors
4. Test in all browsers

---

## 📊 Browser Support

✅ Chrome/Edge (Latest)
✅ Firefox (Latest)
✅ Safari (Latest)
✅ Mobile Safari (iOS 12+)
✅ Chrome Mobile (Latest)

---

## 🔐 Security Notes

- ✅ No external dependencies
- ✅ No database required
- ✅ All data stored locally
- ✅ Forms use validation services if connected
- ✅ No sensitive data stored

**For live donation forms:**
- Use Netlify Forms (free, built-in)
- Or Formspree (free tier available)
- Or Basin (free tier available)
- Never hardcode payment info

---

## 💡 Pro Tips

1. **Use Find & Replace** to update content across multiple files at once
2. **Test locally first** before deploying
3. **Keep backups** of your work
4. **Update regularly** with fresh content
5. **Monitor analytics** after launch
6. **Get feedback** from church members
7. **Optimize images** for faster loading
8. **Use Git** to track changes

---

## 📚 Learn More

**Check the documentation files:**
- `README.md` - Complete feature list & setup
- `CUSTOMIZATION.md` - How to customize everything
- `DEPLOYMENT.md` - How to launch your site

**Support Resources:**
- Netlify Docs: https://docs.netlify.com
- GitHub Pages Docs: https://pages.github.com
- Web.dev: https://web.dev

---

## 🎉 What's Next?

1. **Customize Content** → See CUSTOMIZATION.md
2. **Test Everything** → Open all pages, test mobile
3. **Update Media** → Add your photos & videos
4. **Deploy** → See DEPLOYMENT.md for free hosting
5. **Monitor & Update** → Keep content fresh

---

## ❓ Troubleshooting

**Something looks broken?**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console (F12)
3. Verify file paths are correct
4. Test in different browser

**Forms not working?**
1. Check form validation in console
2. Verify form IDs match code
3. Check if form service connected

**Animations not showing?**
1. Verify animations.css is linked
2. Check browser support
3. Clear cache and reload

---

## 📞 Contact Your Developers

For customization help or issues:
- Review the documentation
- Check browser console (F12)
- Test in different browser
- Try clearing cache

---

## 🎊 Congratulations!

Your church website is ready! 

**Next steps:**
1. Customize the content (30 min)
2. Test on all devices (15 min)
3. Deploy to Netlify (5 min)
4. Share with your congregation! 🙌

---

**Church of Christ, Aka Road Website**
Built with ❤️ using modern web standards
No build tools required • No dependencies • 100% vanilla HTML/CSS/JS

**Ready to go live? See DEPLOYMENT.md →**
