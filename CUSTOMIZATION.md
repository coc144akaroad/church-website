# Customization Guide

## 🎨 Quick Customization Steps

### 1. Update Church Name & Contact Info

**Update in EVERY HTML file** (use Find & Replace in your editor):

Find and replace:
- `Church of Christ, Aka Road, Uyo` → Your church name
- `123 Faith Street` → Your address
- `Cityville, ST 12345` → Your city/state/zip
- `(555) 123-4567` → Your phone number
- `info@gracettruth.org` → Your email
- `(555) 123-4501` through `(555) 123-4503` → Your pastor phone numbers

**In all HTML files frontmatter:**
```html
<title>Your Church Name - Welcome</title>
<meta name="description" content="Welcome to [Your Church Name]...">
```

---

### 2. Customize Colors

Open `css/main.css` and update colors:

```css
/* Main Colors */
--primary-blue: #1e3a8a;      /* Change to your primary color */
--accent-gold: #d4af37;        /* Change to your accent color */
--dark-blue: #003d82;          /* Change to darker shade */
--text-color: #333;            /* Text color */
--light-bg: #f8f9fa;          /* Light background */
```

**Color Suggestions:**
- Modern Blue-Gold: #1e3a8a, #d4af37 (Current)
- Traditional Purple: #4a148c, #ffd700
- Nature Green: #1b5e20, #ffb300
- Classic Red: #b71c1c, #ffd700
- Elegant Gray: #424242, #ff9800

---

### 3. Add Your Logo

1. Create a logo image (PNG or SVG recommended)
2. Place in `assets/images/logo.png`
3. Update in each HTML file:

```html
<div class="logo">
    <img src="assets/images/logo.png" alt="Church Logo" style="height: 40px;">
    <span class="logo-text">Your Church</span>
</div>
```

Or replace the font symbol:

```html
<span class="logo-symbol">🏰</span>  <!-- Choose your icon -->
```

---

### 4. Update Navigation Links

In each HTML file, update:

```html
<li><a href="your-custom-page.html" class="nav-link">Your Page</a></li>
```

Add subpages by duplicating page templates and updating navigation.

---

### 5. Update Page Content

### Home Page (`index.html`)
- Update hero subtitle
- Change quick info cards
- Update featured sermon content
- Add your events
- Customize newsletter section

### About Page (`about.html`)
- Update Mission statement
- Update Vision statement
- Modify Core Values
- Update Church History timeline
- Update Beliefs section

### Sermons Page (`sermons.html`)
- Edit sermon data in the `<script>` section
- Add your sermon series
- Update speaker names
- Add video embed URLs

```javascript
const sermons = [
    {
        id: 1,
        title: "Your Sermon Title",
        speaker: "Pastor Name",
        date: "March 20, 2026",
        series: "Series Name",
        description: "Sermon description...",
        videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
        audioUrl: "https://link-to-audio.mp3"
    }
];
```

### Events Page (`events.html`)
- Update event data in `<script>` section
- Add your church events
- Set correct dates/times
- Update event descriptions

```javascript
const events = [
    {
        title: "Your Event",
        date: new Date(2026, 2, 31, 9, 0), // Month (0-based), Day, Hour, Min
        location: "Your Location",
        category: "Worship",
        description: "Event description..."
    }
];
```

### Gallery Page (`gallery.html`)
- Replace placeholder emojis with real images
- Update gallery captions
- Add more gallery items

```javascript
const galleryItems = [
    { 
        id: 1, 
        title: "Your Photo Title", 
        emoji: "📷",  // Replace with your emoji or use image path
        category: "Worship" 
    }
];
```

### Contact Page (`contact.html`)
- Service times
- Address
- Phone/Email
- **Update Google Maps embed** (IMPORTANT)

Get new Maps embed:
1. Go to https://www.google.com/maps
2. Search for your church location
3. Click "Share" → "Embed a map"
4. Copy the embed code
5. Replace in contact.html

### Give/Donate Page (`give.html`)
- Update "Why Give" section
- Customize donation amounts
- Update payment methods
- Add impact stories
- Link to actual payment processor

### Leadership Page (`leadership.html`)
- Update pastoral team info
- Add ministry leaders
- Update descriptions
- Add contact email/phone

```javascript
const pastors = [
    {
        name: 'Pastor Name',
        position: 'Lead Pastor',
        bio: 'Bio here...',
        email: 'email@church.org',
        phone: '(555) 000-0000',
        emoji: '👨‍💼'
    }
];
```

---

### 6. Update Footer

In each HTML file, update the footer section:

```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Your Church Name</h3>
                <p>123 Your Street<br>Your City, ST 12345<br>Phone: (555) 000-0000</p>
            </div>
            
            <div class="footer-section">
                <h3>Hours</h3>
                <p>Sunday: Your times<br>Wednesday: Your times<br>Office: Your hours</p>
            </div>
            
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <!-- Update links -->
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Connect</h3>
                <div class="social-links">
                    <a href="https://facebook.com/yourchurch">Facebook</a>
                    <a href="https://instagram.com/yourchurch">Instagram</a>
                    <!-- Update social links -->
                </div>
            </div>
        </div>
    </div>
</footer>
```

---

## 🔗 Add Links to External Services

### Google Maps
In `contact.html`, get an embed from Google Maps:
```html
<iframe src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"></iframe>
```

### YouTube Embeds (Sermons)
```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
```

### Social Media Links
Update footer and pages:
```html
<a href="https://facebook.com/your-page">Facebook</a>
<a href="https://instagram.com/your-handle">Instagram</a>
<a href="https://youtube.com/@yourchannel">YouTube</a>
```

---

## 🎨 Advanced Customization

### Change Font
In `css/main.css`:
```css
body {
    font-family: 'Your Font Name', sans-serif;
}

/* Import custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;600&display=swap');

body {
    font-family: 'Lato', sans-serif;
}

h1, h2, h3 {
    font-family: 'Playfair Display', serif;
}
```

### Adjust Spacing
```css
.section {
    padding: 4rem 0;  /* Change to your preference */
}

.container {
    max-width: 1200px;  /* Adjust container width */
}
```

### Modify Animations
In `css/animations.css`, adjust animation durations:
```css
.fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;  /* Change 0.8s to your duration */
}
```

---

## 📸 Replace Images

### Add Real Images
1. Create `assets/images/` folder
2. Add your images (optimize first!)
3. Update image paths in HTML:

```html
<img src="assets/images/your-image.jpg" alt="Image description">
```

### Optimize Images
- Use online tools like TinyPNG
- Target sizes: 200-500 KB for web
- Use WebP format for best performance
- Maintain aspect ratios

---

## 🔧 Add New Pages

1. Duplicate `about.html`
2. Rename to `your-page.html`
3. Update content
4. Add link to navigation in ALL files:

```html
<li><a href="your-page.html" class="nav-link">Your Page</a></li>
```

---

## 🎯 SEO Optimization

Update each page's title and description:

```html
<title>Page Title - Your Church Name</title>
<meta name="description" content="Brief description of page content for search results">
```

### Good SEO Titles:
- "About Our Church - Church of Christ, Aka Road"
- "Sermons - Church of Christ, Aka Road"
- "Give to Our Mission - Church of Christ, Aka Road"

---

## 📱 Mobile Testing Checklist

- [ ] Navigation menu works on mobile
- [ ] Text is readable (not too small)
- [ ] Images scale properly
- [ ] Forms are easy to fill on mobile
- [ ] Buttons are easy to tap (at least 44x44px)
- [ ] No horizontal scrolling
- [ ] Gallery works on mobile
- [ ] Videos are responsive

---

## 🔒 Backup Your Work

1. Keep original files as backup
2. Use version control (Git)
3. Regularly backup to cloud storage
4. Test changes before deploying

```bash
git add .
git commit -m "Updated church information"
git push origin main
```

---

## 🚀 Testing

Before deploying:
1. Test all links
2. Test forms (if connected)
3. Test on mobile device
4. Check browser console for errors
5. Test in different browsers
6. Verify contact information

---

## 📞 Common Customizations

### Add Prayer Request Form
Add new section in `index.html`:

```html
<section class="section">
    <div class="container">
        <h2>Prayer Requests</h2>
        <form>
            <input type="text" placeholder="Your Name" required>
            <textarea placeholder="Your Request" required></textarea>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</section>
```

### Add Blog/News Section
Duplicate `sermons.html` and modify for blog posts

### Add Giving Stats
Add to `give.html`:

```html
<div class="stats">
    <div class="stat-card">
        <h3>$50,000+</h3>
        <p>Donated to Community</p>
    </div>
</div>
```

---

## 💡 Pro Tips

1. **Use Find & Replace** properly update content across files
2. **Test locally** before deploying to live
3. **Keep backups** of working versions
4. **Use colors from brand palette** for consistency
5. **Optimize images** for faster loading
6. **Update regularly** with fresh content
7. **Review quarterly** for improvements
8. **Get feedback** from church members

---

## 📖 Need Help?

1. Check README.md for general info
2. Check DEPLOYMENT.md for hosting
3. Test in browser dev tools (F12)
4. Check browser console for errors
5. Valid HTML/CSS at w3.org validators

---

**Happy Customizing! 🎉**

Your unique church website is just one edit away!
