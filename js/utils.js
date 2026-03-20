/* ===================================
   UTILITY FUNCTIONS
   =================================== */

/* ===================================
   SMOOTH SCROLL FUNCTION
   =================================== */

function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/* ===================================
   SCROLL TO ELEMENT
   =================================== */

function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

/* ===================================
   DEBOUNCE FUNCTION
   =================================== */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ===================================
   THROTTLE FUNCTION
   =================================== */

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ===================================
   LOCAL STORAGE UTILITIES
   =================================== */

const StorageUtils = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Storage error:', e);
        }
    }
};

/* ===================================
   VALIDATION UTILITIES
   =================================== */

const Validation = {
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isPhone: (phone) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 10;
    },

    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    isEmpty: (value) => {
        return value === null || value === undefined || value.trim() === '';
    },

    isStrong: (password) => {
        return password.length >= 8 &&
               /[a-z]/.test(password) &&
               /[A-Z]/.test(password) &&
               /\d/.test(password);
    }
};

/* ===================================
   STRING UTILITIES
   =================================== */

const StringUtils = {
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    capitalizeWords: (str) => {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    },

    truncate: (str, length) => {
        return str.length > length ? str.substring(0, length) + '...' : str;
    },

    slugify: (str) => {
        return str.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]/g, '')
            .replace(/\-\-+/g, '-');
    },

    repeat: (str, count) => {
        return str.repeat(count);
    }
};

/* ===================================
   ARRAY UTILITIES
   =================================== */

const ArrayUtils = {
    shuffle: (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    unique: (array) => {
        return [...new Set(array)];
    },

    flatten: (array) => {
        return array.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? ArrayUtils.flatten(item) : item);
        }, []);
    },

    chunk: (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
};

/* ===================================
   TIME UTILITIES
   =================================== */

const TimeUtils = {
    formatDate: (date, format = 'MM/DD/YYYY') => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();

        return format
            .replace('MM', month)
            .replace('DD', day)
            .replace('YYYY', year);
    },

    getTimeAgo: (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        
        return Math.floor(seconds) + ' seconds ago';
    },

    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getDayName: (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date(date).getDay()];
    }
};

/* ===================================
   DOM UTILITIES
   =================================== */

const DOMUtils = {
    hasClass: (element, className) => {
        return element.classList.contains(className);
    },

    addClass: (element, className) => {
        element.classList.add(className);
    },

    removeClass: (element, className) => {
        element.classList.remove(className);
    },

    toggleClass: (element, className) => {
        element.classList.toggle(className);
    },

    hide: (element) => {
        element.style.display = 'none';
    },

    show: (element) => {
        element.style.display = 'block';
    },

    remove: (element) => {
        element.remove();
    },

    empty: (element) => {
        element.innerHTML = '';
    }
};

/* ===================================
   API UTILITIES
   =================================== */

const APIUtils = {
    get: async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },

    post: async (url, data) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }
};

/* ===================================
   COOKIE UTILITIES
   =================================== */

const CookieUtils = {
    set: (name, value, days = 7) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },

    get: (name) => {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    },

    delete: (name) => {
        CookieUtils.set(name, "", -1);
    }
};

/* ===================================
   CLIPBOARD UTILITIES
   =================================== */

const ClipboardUtils = {
    copy: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            return false;
        }
    }
};

/* ===================================
   ROUTER UTILITIES
   =================================== */

const RouterUtils = {
    getQueryParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    setQueryParam: (param, value) => {
        const url = new URL(window.location);
        url.searchParams.set(param, value);
        window.history.pushState({}, '', url);
    },

    getCurrentPath: () => {
        return window.location.pathname;
    }
};

/* ===================================
   MATH UTILITIES
   =================================== */

const MathUtils = {
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    lerp: (start, end, t) => {
        return start + (end - start) * t;
    },

    average: (array) => {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }
};

/* ===================================
   EXPORT UTILITIES
   =================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        smoothScroll,
        scrollToElement,
        debounce,
        throttle,
        StorageUtils,
        Validation,
        StringUtils,
        ArrayUtils,
        TimeUtils,
        DOMUtils,
        APIUtils,
        CookieUtils,
        ClipboardUtils,
        RouterUtils,
        MathUtils
    };
}
