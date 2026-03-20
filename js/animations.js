/* ===================================
   SCROLL REVEAL ANIMATIONS
   =================================== */

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Run on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Run on load
    revealOnScroll();
}

/* ===================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   =================================== */

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('scroll-reveal')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

/* ===================================
   STAGGER ANIMATIONS
   =================================== */

function staggerChildren(parentSelector, itemSelector, delayIncrement = 100) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    const items = parent.querySelectorAll(itemSelector);
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * delayIncrement}ms`;
    });
}

/* ===================================
   FADE IN ELEMENTS ON LOAD
   =================================== */

function fadeInOnLoad() {
    const elementsToFade = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    
    elementsToFade.forEach((element, index) => {
        const delay = index * 100;
        element.style.animationDelay = `${delay}ms`;
    });
}

/* ===================================
   PARALLAX SCROLL EFFECT
   =================================== */

function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/* ===================================
   ANIMATE ON HOVER
   =================================== */

function addHoverAnimations() {
    const hoverElements = document.querySelectorAll('.btn, .card, .event-card, .value-card');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

/* ===================================
   COUNT UP ANIMATION
   =================================== */

function countUp(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/* ===================================
   GRADIENT ANIMATION
   =================================== */

function animateGradient(element) {
    const colors = [
        'linear-gradient(135deg, #1e3a8a, #d4af37)',
        'linear-gradient(135deg, #d4af37, #1e3a8a)',
        'linear-gradient(135deg, #003d82, #1e3a8a)'
    ];

    let colorIndex = 0;

    setInterval(() => {
        element.style.background = colors[colorIndex];
        element.style.transition = 'background 3s ease';
        colorIndex = (colorIndex + 1) % colors.length;
    }, 3000);
}

/* ===================================
   PULSE ANIMATION FOR CTA
   =================================== */

function addPulseAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.classList.add('pulse');
    });
}

/* ===================================
   TEXT ANIMATION
   =================================== */

function typewriterEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    const typeInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, speed);
}

/* ===================================
   BOUNCE ANIMATION
   =================================== */

function addBounceAnimation(selector, delay = 0) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.animation = `bounce 1s ease-in-out ${delay}s`;
    }
}

/* ===================================
   FLIP CARD ANIMATION
   =================================== */

function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.animation = 'flip 0.6s ease-in-out forwards';
        });
    });
}

/* ===================================
   SLIDE IN ON SCROLL
   =================================== */

function slideInOnScroll(selector) {
    const elements = document.querySelectorAll(selector);

    const slideInOnScroll = () => {
        elements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                element.style.animation = 'slideInLeft 0.8s ease-out forwards';
            }
        });
    };

    window.addEventListener('scroll', slideInOnScroll);
    slideInOnScroll();
}

/* ===================================
   FADE IN SEQUENCE
   =================================== */

function fadeInSequence(selector, delayIncrement = 100) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
        element.style.animation = `fadeInUp 0.6s ease-out forwards`;
        element.style.animationDelay = `${index * delayIncrement}ms`;
    });
}

/* ===================================
   HEARTBEAT ANIMATION FOR ELEMENTS
   =================================== */

function addHeartbeatAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'heartbeat 1.3s ease-in-out';
        });

        element.addEventListener('mouseout', function() {
            this.style.animation = 'none';
        });
    });
}

/* ===================================
   SCROLL TRIGGER FOR ELEMENTS
   =================================== */

function scrollTrigger(selector, className) {
    const elements = document.querySelectorAll(selector);

    const triggerElement = () => {
        elements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                element.classList.add(className);
            }
        });
    };

    window.addEventListener('scroll', triggerElement);
    triggerElement();
}

/* ===================================
   SMOOTHSCROLL POLYFILL SUPPORT
   =================================== */

function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
}

/* ===================================
   INITIALIZE ALL ANIMATIONS ON DOM LOAD
   =================================== */

function initializeAllAnimations() {
    fadeInOnLoad();
    initScrollReveal();
    initIntersectionObserver();
    addHoverAnimations();
    initParallax();
    smoothScrollPolyfill();
    addPulseAnimation('.cta-section .btn');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllAnimations);
} else {
    initializeAllAnimations();
}

// Re-initialize on page transitions
window.addEventListener('load', initializeAllAnimations);
