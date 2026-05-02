(() => {
    const LOCAL_CACHE_KEY = 'verseOfTheDay_v1';
    const API_URLS = [
        'https://beta.ourmanna.com/api/v1/get/?format=json&order=daily',
        'https://api.ourmanna.com/api/v1/get/?format=json&order=daily'
    ];
    const FETCH_TIMEOUT = 6000;

    const verses = [
        { text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", ref: "John 3:16" },
        { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1" },
        { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
        { text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", ref: "Romans 8:28" },
        { text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", ref: "Jeremiah 29:11" },
        { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5-6" },
        { text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", ref: "Matthew 11:28" },
        { text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee.", ref: "Isaiah 41:10" },
        { text: "God is our refuge and strength, a very present help in trouble.", ref: "Psalm 46:1" },
        { text: "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me.", ref: "Galatians 2:20" },
        { text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.", ref: "Ephesians 2:8" },
        { text: "Now faith is the substance of things hoped for, the evidence of things not seen.", ref: "Hebrews 11:1" },
        { text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself.", ref: "1 Corinthians 13:4-7" },
        { text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", ref: "Matthew 6:33" },
        { text: "Jesus saith unto him, I am the way, the truth, and the life.", ref: "John 14:6" },
        { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" },
        { text: "And be not conformed to this world: but be ye transformed by the renewing of your mind.", ref: "Romans 12:2" },
        { text: "Casting all your care upon him; for he careth for you.", ref: "1 Peter 5:7" },
        { text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.", ref: "Isaiah 40:31" },
        { text: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.", ref: "Matthew 5:16" },
        { text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.", ref: "Colossians 3:23" },
        { text: "Delight thyself also in the LORD; and he shall give thee the desires of thine heart.", ref: "Psalm 37:4" },
        { text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally.", ref: "James 1:5" },
        { text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", ref: "2 Timothy 1:7" },
        { text: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy.", ref: "Micah 6:8" },
        { text: "O taste and see that the LORD is good: blessed is the man that trusteth in him.", ref: "Psalm 34:8" },
        { text: "I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.", ref: "John 8:12" },
        { text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", ref: "Romans 5:8" },
        { text: "Beloved, let us love one another: for love is of God.", ref: "1 John 4:7" },
        { text: "I will lift up mine eyes unto the hills, from whence cometh my help.", ref: "Psalm 121:1-2" },
        { text: "Ye shall receive power, after that the Holy Ghost is come upon you.", ref: "Acts 1:8" },
        { text: "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy.", ref: "Zephaniah 3:17" },
        { text: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.", ref: "Matthew 28:19" },
        { text: "For with God nothing shall be impossible.", ref: "Luke 1:37" },
        { text: "For he hath said, I will never leave thee, nor forsake thee.", ref: "Hebrews 13:5" },
        { text: "Bless the LORD, O my soul, and forget not all his benefits.", ref: "Psalm 103:2" },
        { text: "If thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.", ref: "Romans 10:9" },
        { text: "These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.", ref: "John 16:33" },
        { text: "And God shall wipe away all tears from their eyes; and there shall be no more death.", ref: "Revelation 21:4" }
    ];

    function dayOfYear(d) {
        const start = new Date(d.getFullYear(), 0, 0);
        const diff = d - start;
        return Math.floor(diff / 86400000);
    }

    function pickLocalVerse() {
        const today = new Date();
        const idx = dayOfYear(today) % verses.length;
        return verses[idx];
    }

    async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            if (!res.ok) throw new Error('Network response not ok');
            return await res.json();
        } catch (err) {
            clearTimeout(id);
            throw err;
        }
    }

    function parseOurManna(json) {
        // expected: { verse: { details: { text, reference } } }
        if (json && json.verse && json.verse.details) {
            const d = json.verse.details;
            return { text: (d.text || '').trim(), ref: d.reference || '' };
        }
        if (json && json.data && json.data.verse) {
            const d = json.data.verse;
            return { text: (d.text || '').trim(), ref: d.reference || '' };
        }
        return null;
    }

    async function fetchVerseFromAPIs() {
        for (const url of API_URLS) {
            try {
                const json = await fetchWithTimeout(url);
                const parsed = parseOurManna(json);
                if (parsed && parsed.text) return parsed;
            } catch (err) {
                console.warn('Verse fetch failed for', url, err);
            }
        }
        return null;
    }

    function cacheDateKey() {
        const d = new Date();
        return d.toISOString().slice(0, 10); // YYYY-MM-DD
    }

    function saveToCache(dateStr, verseObj) {
        try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify({ date: dateStr, verse: verseObj }));
        } catch (e) {
            // ignore storage errors
        }
    }

    function loadFromCache(dateStr) {
        try {
            const raw = localStorage.getItem(LOCAL_CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && parsed.date === dateStr && parsed.verse) return parsed.verse;
        } catch (e) {
            // ignore
        }
        return null;
    }

    function renderVerseObj(verse) {
        const textEls = document.querySelectorAll('.daily-verse-text, #daily-verse-text');
        const refEls = document.querySelectorAll('.daily-verse-ref, #daily-verse-ref');

        if (textEls.length === 0 && refEls.length === 0) return;

        textEls.forEach(el => {
            el.textContent = verse.text || '';
        });

        refEls.forEach(el => {
            el.textContent = verse.ref || '';
        });

        // Update share controls (hero + footer)
        updateShareControls(verse);
    }

    function updateShareControls(verse) {
        const controls = document.querySelectorAll('.daily-verse-controls');
        const pageUrl = window.location.href;
        const siteName = 'Church of Christ, Aka Road';
        const quoteText = `${verse.text} — ${verse.ref} — From ${siteName}`;
        const shareText = `${quoteText}\n\n${pageUrl}`;
        const waLink = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText);
        const twLink = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(`${quoteText} ${pageUrl}`);
        const fbLink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '&quote=' + encodeURIComponent(quoteText);

        controls.forEach(ctrl => {
            const waEl = ctrl.querySelector('.share-wa');
            if (waEl) waEl.href = waLink;
            const twEl = ctrl.querySelector('.share-twitter');
            if (twEl) twEl.href = twLink;
            const fbEl = ctrl.querySelector('.share-fb');
            if (fbEl) fbEl.href = fbLink;

            const copyBtn = ctrl.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.onclick = async (e) => {
                    e.preventDefault();
                    try {
                        await copyToClipboard(shareText);
                        showCopied(copyBtn);
                    } catch (err) {
                        console.warn('copy failed', err);
                    }
                };
            }
        });
    }

    async function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            // ignore
        }
        ta.remove();
    }

    function showCopied(btn) {
        const tip = document.createElement('span');
        tip.className = 'verse-copied-tip';
        tip.textContent = 'Copied';
        tip.style.cssText = 'margin-left:8px;color:#16a34a;font-weight:600;';
        btn.parentNode.appendChild(tip);
        setTimeout(() => tip.remove(), 1800);
    }

    async function renderVerse() {
        const dateStr = cacheDateKey();
        const cached = loadFromCache(dateStr);
        if (cached) {
            renderVerseObj(cached);
            return;
        }

        // show local verse immediately while we try external APIs
        const local = pickLocalVerse();
        renderVerseObj(local);

        try {
            const apiVerse = await fetchVerseFromAPIs();
            if (apiVerse) {
                renderVerseObj(apiVerse);
                saveToCache(dateStr, apiVerse);
                return;
            }
        } catch (err) {
            // ignore
        }

        // final fallback: cache the local verse for today
        saveToCache(dateStr, local);
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderVerse().catch(err => console.error('Verse render error', err));
    });

})();
