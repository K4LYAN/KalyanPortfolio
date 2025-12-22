document.addEventListener('DOMContentLoaded', () => {

    // --- Simple Page Router ---
    const allPages = document.querySelectorAll('.page');

    function showPage(pageId, anchor) {
        // Hide all pages
        allPages.forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        // Show the target page
        let pageToShow = document.getElementById(pageId);
        if (!pageToShow) {
            pageToShow = document.getElementById('page-home'); // Fallback
        }

        pageToShow.style.display = 'block';
        pageToShow.classList.add('active');

        // Handle scrolling
        if (anchor) {
            const anchorEl = document.getElementById(anchor);
            if (anchorEl) {
                anchorEl.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Only scroll to top if not an anchor link
            if (!window.location.hash.includes('#') || window.location.hash === '#page-home' || window.location.hash === '' || window.location.hash === '#top') {
                window.scrollTo(0, 0);
            }
        }
    }

    function handleNavigation() {
        let hash = window.location.hash || '#page-home';
        let pageId = 'page-home';
        let anchor = null;

        if (hash.startsWith('#page-')) {
            pageId = hash.substring(1);
        } else if (hash !== '#' && hash !== '#top' && hash !== '') {
            // It's an anchor link on the home page
            pageId = 'page-home';
            anchor = hash.substring(1);
        }

        showPage(pageId, anchor);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleNavigation);

    // Initial page load
    handleNavigation();


    // --- Sticky Nav & Scroll Progress ---
    const nav = document.querySelector('.global-nav');
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Toggle sticky class
        if (window.scrollY > 50) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }

        // Update progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    });


    // --- Music Button Logic ---

    try {
        const musicBtn = document.getElementById('music-toggle-btn');
        let isPlaying = false;

        // 1. Create the audio components for a calm, elegant sound
        const reverb = new Tone.Reverb(1.5).toDestination();
        const delay = new Tone.FeedbackDelay("8n", 0.4).connect(reverb);
        const synth = new Tone.FMSynth({
            harmonicity: 1.5,
            modulationIndex: 1.2,
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.1,
                release: 0.5
            },
            modulationEnvelope: {
                attack: 0.01,
                decay: 0.5,
                sustain: 0,
                release: 0.5
            }
        }).connect(delay);
        synth.volume.value = -1; // Lower the volume

        // 2. Create the looping melody
        const notes = ['C4', 'E4', 'G4', 'B4', 'G4', 'E4'];
        let noteIndex = 0;
        const loop = new Tone.Loop(time => {
            let note = notes[noteIndex % notes.length];
            synth.triggerAttackRelease(note, "8n", time);
            noteIndex++;
        }, "4n").start(0);

        // 3. Create the click handler
        musicBtn.addEventListener('click', async () => {
            if (isPlaying) {
                // Stop the music
                await Tone.Transport.stop();
                musicBtn.classList.remove('is-playing');
                musicBtn.setAttribute('aria-label', 'Play background music');
                isPlaying = false;
            } else {
                // Start the music
                await Tone.start(); // Required by browser to start audio
                await Tone.Transport.start();
                musicBtn.classList.add('is-playing');
                musicBtn.setAttribute('aria-label', 'Pause background music');
                isPlaying = true;
            }
        });

    } catch (error) {
        console.error("Tone.js failed to initialize:", error);
        // Hide the button if Tone.js fails for any reason
        const musicBtn = document.getElementById('music-toggle-btn');
        if (musicBtn) musicBtn.style.display = 'none';
    }

    // --- Spacer Classification & Decorative Text ---
    document.querySelectorAll('.skill-category').forEach(card => {
        // Find all list items
        const listItems = card.querySelectorAll('li');
        listItems.forEach(li => {
            const text = li.textContent.trim();
            // Check for empty text or the literal string "&nbsp;"
            if (text === "" || text.toLowerCase() === "&nbsp;") {
                li.classList.add('spacer');
            }
        });

        // Add decorative text
        const title = card.querySelector('h4').textContent;
        const decorativeEl = card.querySelector('.decorative-text');
        if (decorativeEl) {
            decorativeEl.textContent = title;
        }
    });


    // --- Intersection Observer for All Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('skill-category')) {
                    const items = entry.target.querySelectorAll('li:not(.spacer)');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 100}ms`;
                    });
                }
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.grid-tile, .footer-cta-content').forEach(tile => {
        observer.observe(tile);
    });

    // --- Copyright Year ---
    const copyrightEl = document.getElementById('copyright');
    if (copyrightEl) {
        copyrightEl.textContent = `© ${new Date().getFullYear()} Kalyan Chavala`;
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        });
    }

    // --- Case Study Modal Logic ---
    const projectData = {
        project1: {
            title: "Secure Web Portal",
            subtitle: "CyberSecurity Awareness",
            description: "Developed a comprehensive, role-based web portal for a cybersecurity awareness program. The platform provides distinct dashboards and functionalities for students, teachers, and administrators to manage courses, track progress, and simulate real-world security scenarios. A key feature is the integration of a CVE (Common Vulnerabilities and Exposures) tracking system to keep users updated on the latest threats, alongside a virtual lab environment using VMs for hands-on practice with OWASP Top 10 vulnerabilities.",
            tech: ["Java", "Spring Boot", "Spring Security", "JavaScript", "MySQL", "VirtualBox", "OWASP"],
            link: "https://github.com/K4LYAN/Cybersecurity-and-Awareness"
        },

        project2: {
            title: "Modern Career",
            subtitle: "Guidance Platform",
            description: "Engineered an intelligent career guidance platform designed to replace traditional counseling methods. The system uses a multi-faceted recommendation engine, leveraging collaborative filtering and content-based filtering (NLP) to analyze user profiles, academic performance, and interests. It provides personalized course and career path suggestions, resulting in a 60% boost in user engagement and a 35% increase in course completion rates.",
            tech: ["Java", "Spring Boot", "Machine Learning", "NLP", "Python", "REST APIs", "React"],
            link: "https://github.com/K4LYAN/modern-carrier-guidance"
        }
    };

    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalDescription = document.getElementById('modal-description');
    const modalTechList = document.getElementById('modal-tech-list');
    const modalLink = document.getElementById('modal-link');
    const modalCloseBtn = document.getElementById('modal-close');

    document.querySelectorAll('.tile-cta').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.projectId;
            const data = projectData[projectId];

            if (data) {
                modalTitle.textContent = data.title;
                modalSubtitle.textContent = data.subtitle;
                modalDescription.textContent = data.description;
                modalLink.href = data.link;

                modalTechList.innerHTML = ''; // Clear old tech
                data.tech.forEach(techItem => {
                    const li = document.createElement('li');
                    li.textContent = techItem;
                    modalTechList.appendChild(li);
                });

                modalOverlay.classList.add('is-visible');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modalOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // --- Full Screen Menu Logic (Redesigned) ---
    const menuOverlay = document.getElementById('menu-overlay');
    const openMenuBtn = document.getElementById('open-menu-btn');
    const closeMenuBtn = document.getElementById('menu-close-btn');
    const menuCloseTriggers = document.querySelectorAll('.close-trigger');

    function openMenu() {
        menuOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    openMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

    menuCloseTriggers.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- Menu 3D Tilt Effect REMOVED to prevent conflict with Scrolling ---
    // The scrolling animation uses `transform`, so applying a separate tilt `transform` via JS would break the layout.
    // Keeping the shine effect logic relative to mouse position only.

    document.querySelectorAll('.menu-grid-img').forEach(card => {
        const shine = card.querySelector('.img-shine');

        card.addEventListener('mousemove', (e) => {
            if (shine) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (shine) {
                shine.style.background = 'transparent';
            }
        });
    });


    // --- Global Escape Key Listener ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('is-visible')) {
                closeModal();
            }
            if (menuOverlay.classList.contains('is-visible')) {
                closeMenu();
            }
        }
    });

});
// --- Analytics Tracking Logic ---
function trackEvent(action) {
    const stats = JSON.parse(localStorage.getItem('kalyan_stats')) || {
        visits: 0,
        downloads: 0,
        logs: []
    };

    if (action === 'visit') {
        stats.visits++;
    } else if (action === 'download') {
        stats.downloads++;
    }

    // Add log entry
    stats.logs.push({
        action: action,
        timestamp: new Date().toISOString()
    });

    // Limit logs to last 50
    if (stats.logs.length > 50) {
        stats.logs.shift();
    }

    localStorage.setItem('kalyan_stats', JSON.stringify(stats));
}

// Track Page Visit (once per session/refresh)
if (!sessionStorage.getItem('visited_this_session')) {
    trackEvent('visit');
    sessionStorage.setItem('visited_this_session', 'true');
}

// Track Resume Download
const downloadLinks = document.querySelectorAll('a[href*="Resume"], a[download]');
downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('download');
    });
});
