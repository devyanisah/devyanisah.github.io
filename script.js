// Minimal Portfolio JavaScript - Clean and Simple

class MinimalPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupScrollEffects();
        this.addThemeToggle();
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // If no saved theme, use system preference and track as system-managed
        if (!savedTheme) {
            localStorage.setItem('themeMode', 'system');
            this.setTheme(prefersDark ? 'dark' : 'light');
        } else {
            this.setTheme(savedTheme);
        }

        // Update theme when system preference changes (only if in system mode)
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = (e) => {
            const mode = localStorage.getItem('themeMode');
            if (mode === 'system' && !localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        };
        if (mql && mql.addEventListener) {
            mql.addEventListener('change', handleSystemChange);
        } else if (mql && mql.addListener) {
            // Safari fallback
            mql.addListener(handleSystemChange);
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);



        // Immediately update navbar background to fix dark mode lag
        const nav = document.querySelector('.nav');
        if (nav) {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 50) {
                nav.style.background = theme === 'dark' ? 'rgba(0, 0, 0, 0.98)' : 'rgba(255, 255, 255, 0.95)';
            } else {
                nav.style.background = theme === 'dark' ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.85)';
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        // Switching manually sets mode to manual and persists theme
        localStorage.setItem('themeMode', 'manual');
        this.setTheme(newTheme);
    }

    // Setup theme toggle in navbar
    addThemeToggle() {
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }



    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Only handle internal links
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);

                    if (target) {
                        const offsetTop = target.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        const nav = document.querySelector('.nav');
        const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
        const sectionsById = new Map();
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const el = document.querySelector(href);
                if (el) sectionsById.set(href.slice(1), { el, link });
            }
        });

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide/show navigation on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }

            // Add background blur when scrolled
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (currentScrollY > 50) {
                nav.style.background = isDark ? 'rgba(0, 0, 0, 0.98)' : 'rgba(255, 255, 255, 0.95)';
            } else {
                nav.style.background = isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.85)';
            }

            lastScrollY = currentScrollY;
        };

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Apply fade-in animation to sections
        const sections = document.querySelectorAll('.work-section, .interests-section, .contact-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Active nav link highlighting
        const activeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const match = sectionsById.get(id);
                if (!match) return;
                if (entry.isIntersecting) {
                    navLinks.forEach(a => a.classList.remove('active'));
                    match.link.classList.add('active');
                }
            });
        }, { threshold: 0.4, rootMargin: '-20% 0px -60% 0px' });

        // Observe the main nav sections present in the header nav
        sectionsById.forEach(({ el }) => activeObserver.observe(el));

        // Apply staggered animation to project items
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            observer.observe(item);
        });

        // Apply animation to interest categories
        const interestCategories = document.querySelectorAll('.interest-category');
        interestCategories.forEach((category, index) => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            category.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
            observer.observe(category);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MinimalPortfolio();
});

// Add some subtle interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-4px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // Add click effect to book items
    const bookItems = document.querySelectorAll('.book-item, .music-item');
    bookItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 150);
        });
    });
});
