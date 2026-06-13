/* ===================================
   MAIN APPLICATION SCRIPT
   =================================== */

// ===================================
// HAMBURGER MENU FUNCTIONALITY
// ===================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navContent = document.querySelector('.nav-content');

    if (!hamburger || !navMenu || !navContent) return;
    if (hamburger.dataset.navInit === 'true') return;
    hamburger.dataset.navInit = 'true';

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        const isOpen = !navMenu.classList.contains('active');
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen.toString());
    };

    document.addEventListener('click', (e) => {
        if (e.target.closest('#hamburger')) {
            e.preventDefault();
            toggleMenu();
            return;
        }

        if (!e.target.closest('.nav-content')) {
            closeMenu();
        }
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

// ===================================
// FLOATING DONATE CTA
// ===================================
function initFloatingDonate() {
    if (document.getElementById('floatingDonate')) return;

    const btn = document.createElement('a');
    btn.id = 'floatingDonate';
    btn.className = 'floating-donate pulse';
    btn.href = 'give.html';
    btn.setAttribute('aria-label', 'Donate');
    btn.setAttribute('title', 'Donate to the church');
    btn.innerHTML = `<span class="icon" aria-hidden="true">🤝</span><span class="label">Give</span>`;

    btn.addEventListener('click', (e) => {
        // allow normal navigation; track click event if analytics present
        if (window.gtag) {
            try { gtag('event', 'donate_click', { 'event_category': 'engagement' }); } catch (e) {}
        }
    });

    document.body.appendChild(btn);
}


// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const windowTop = window.scrollY;

        if (windowTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = windowTop;
    });
}

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[data-scroll]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navbar = document.getElementById('navbar');
                    const offset = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (navLinks.length === 0) return;

    const updateActiveLink = () => {
        let currentSection = '';

        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);

            if (section) {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSection = sectionId;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', debounce(updateActiveLink, 50));
}

// ===================================
// BACK TO TOP BUTTON
// ===================================

function initBackToTop() {
    let backToTopBtn = document.getElementById('backToTopBtn');

    if (!backToTopBtn) {
        // Create button if it doesn't exist
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTopBtn';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1e3a8a;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            display: none;
            z-index: 999;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.background = '#d4af37';
        this.style.color = '#1e3a8a';
        this.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.background = '#1e3a8a';
        this.style.color = 'white';
        this.style.transform = 'scale(1)';
    });
}

// ===================================
// LOADING SKELETON
// ===================================

function initLoading() {
    // Remove loading spinner when page is fully loaded
    window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Trigger animations
        initScrollReveal();
    });
}

// ===================================
// HERO POLISH: rotating microcopy, video fallback, CTA microinteractions
// ===================================
function initHeroPolish() {
    try {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        // Rotating microcopy (non-blocking): keep a short set of taglines
        const lines = [
            'Experience the love of Christ in a vibrant, growing community',
            'Join us for worship, fellowship, and spiritual growth',
            'Real people. Real faith. Real change.'
        ];

        let rotator = document.getElementById('hero-rotator');
        if (!rotator) {
            rotator = document.createElement('p');
            rotator.id = 'hero-rotator';
            rotator.className = 'hero-rotator fade-in';
            // insert before hero-buttons if present
            const buttons = heroContent.querySelector('.hero-buttons');
            if (buttons) heroContent.insertBefore(rotator, buttons);
            else heroContent.appendChild(rotator);
        }

        let idx = 0;
        rotator.textContent = lines[idx];
        rotator.style.opacity = '1';
        rotator.style.transition = 'opacity 0.45s ease-in-out';

        setInterval(() => {
            rotator.style.opacity = '0';
            setTimeout(() => {
                idx = (idx + 1) % lines.length;
                rotator.textContent = lines[idx];
                rotator.style.opacity = '1';
            }, 450);
        }, 5000);

        // Mobile-friendly behavior: hide heavy hero video on small screens or reduced motion
        const hero = document.querySelector('.hero');
        const video = document.querySelector('.hero-video');
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isSmall = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        if ((isSmall || prefersReduced) && hero) {
            hero.classList.add('hero-video-hidden');
        }

        // CTA microinteraction: briefly pulse the primary hero button to draw attention
        const primary = document.querySelector('.hero-buttons .btn-primary');
        if (primary) {
            primary.classList.add('pulse');
            setTimeout(() => primary.classList.remove('pulse'), 3800);
        }
    } catch (err) {
        console.warn('initHeroPolish error', err);
    }
}

// ===================================
// FORM SUBMISSION (Newsletter)
// ===================================

function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const messageDiv = document.getElementById('formMessage');

        if (emailInput && Validation.isEmail(emailInput.value)) {
            // Show success message
            messageDiv.style.color = '#16a34a';
            messageDiv.textContent = '✓ Thank you for subscribing!';

            // Reset form
            form.reset();

            // Clear message after 3 seconds
            setTimeout(() => {
                messageDiv.textContent = '';
            }, 3000);
        } else {
            messageDiv.style.color = '#dc2626';
            messageDiv.textContent = '✗ Please enter a valid email address';
        }
    });
}

// ===================================
// LAZY LOADING IMAGES
// ===================================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===================================
// TOOLTIPS
// ===================================

function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    tooltips.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #1e3a8a;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';

            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    });
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + / for search (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            console.log('Search activated');
        }

        // Escape key to close modals
        if (e.key === 'Escape') {
            const navbar = document.getElementById('navMenu');
            if (navbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                document.getElementById('hamburger').classList.remove('active');
            }
        }

        // Home key to go to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // End key to go to bottom
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

// ===================================
// ACCESSIBILITY: SKIP TO MAIN
// ===================================

function initAccessibility() {
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            const main = document.getElementById('main-content');
            if (main) {
                main.focus();
            }
        });
    }

    // Announce dynamic content changes to screen readers
    window.announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    };
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

function initPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', pageLoadTime, 'ms');
        });
    }
}

// ===================================
// LIVESTREAM EMBED HANDLING
// ===================================

function initLivestreamEmbed() {
    try {
        const iframe = document.getElementById('livestreamEmbed');
        const videoWrap = document.getElementById('videoWrap');
        if (!iframe || !videoWrap) return;
        let timeoutId = null;
        let listenersAdded = false;

        const cleanup = () => {
            if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
            if (listenersAdded) {
                iframe.removeEventListener('load', onLoad);
                iframe.removeEventListener('error', onError);
                listenersAdded = false;
            }
        };

        const onLoad = () => {
            videoWrap.classList.remove('embed-failed');
            cleanup();
        };

        const onError = () => {
            videoWrap.classList.add('embed-failed');
            cleanup();
        };

        const fallbackLinks = document.getElementById('fallbackLinks');

        const setState = () => {
            cleanup();
            const src = (iframe.getAttribute('src') || iframe.src || '').trim();
            if (src) {
                // hide fallback while embed attempts to load
                fallbackLinks && fallbackLinks.classList.add('hidden');
                iframe.addEventListener('load', onLoad);
                iframe.addEventListener('error', onError);
                listenersAdded = true;

                timeoutId = setTimeout(() => {
                    // If load didn't fire, show fallback links
                    fallbackLinks && fallbackLinks.classList.remove('hidden');
                }, 6000);
            } else {
                // no src -> show fallback links
                fallbackLinks && fallbackLinks.classList.remove('hidden');
            }
        };

        // Initial
        setState();

        // Observe changes to the iframe src attribute (in case embed is set dynamically)
        const mo = new MutationObserver(() => setState());
        mo.observe(iframe, { attributes: true, attributeFilter: ['src'] });
    } catch (err) {
        console.error('initLivestreamEmbed error', err);
    }
}

// ===================================
// ADMIN: set embed URL from page
// ===================================

// Admin embed UI removed: embed management handled outside this script now.

// (theme toggle removed)

// ===================================
// INITIALIZE ALL
// ===================================

function initializeApp() {
    // Core functionality
    initNavigation();
    initNavbarScroll();
    initSmoothScroll();
    initActiveNavLink();
    initBackToTop();
    initLoading();

    // Forms & Input
    initNewsletter();

    // Performance & UX
    initLazyLoading();
    initTooltips();
    initKeyboardShortcuts();
    initAccessibility();
    initPerformanceMonitoring();
        // Livestream embed handling
        initLivestreamEmbed();

    // Init new floating donate CTA
    initFloatingDonate();
    // Hero polish features
    initHeroPolish();

    // Log initialization
    console.log('Church website initialized successfully');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Re-initialize on page restore (browser back/forward)
window.addEventListener('pageshow', initializeApp);

// Cleanup on page hide
window.addEventListener('pagehide', () => {
    // Remove event listeners if needed
});
