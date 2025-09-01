// Minimal Portfolio JavaScript - Clean and Simple

class MinimalPortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupCertificateCarousel();
        this.addThemeToggle();
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

        setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update theme toggle icon in navbar
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }

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
        this.setTheme(newTheme);
    }

    // Setup theme toggle in navbar
    addThemeToggle() {
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    // Certificate Carousel
    setupCertificateCarousel() {
        const certList = document.querySelector('.cert-list');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.cert-nav.prev');
        const nextBtn = document.querySelector('.cert-nav.next');

        if (!certList || indicators.length === 0) return;

        // Update indicators on scroll
        const updateUI = () => {
            const card = certList.querySelector('.cert-item');
            if (!card) return;
            const gap = parseFloat(getComputedStyle(certList).columnGap || getComputedStyle(certList).gap || 16);
            const cardWidth = card.offsetWidth + gap;
            const currentIndex = Math.round(certList.scrollLeft / cardWidth);
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
            if (prevBtn && nextBtn) {
                prevBtn.disabled = currentIndex <= 0;
                nextBtn.disabled = currentIndex >= indicators.length - 1;
            }
        };

        certList.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateUI);
        });

        // Click indicators to scroll
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const gap = parseFloat(getComputedStyle(certList).columnGap || getComputedStyle(certList).gap || 16);
                const cardWidth = certList.querySelector('.cert-item').offsetWidth + gap;
                certList.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
            });
        });

        // Touch/swipe support for better mobile experience
        let startX = 0;
        let scrollStart = 0;

        certList.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            scrollStart = certList.scrollLeft;
        });

        certList.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            certList.scrollLeft = scrollStart + diff;
        });

        // Prev/Next buttons
        const scrollByCard = (dir) => {
            const gap = parseFloat(getComputedStyle(certList).columnGap || getComputedStyle(certList).gap || 16);
            const cardWidth = certList.querySelector('.cert-item').offsetWidth + gap;
            certList.scrollTo({ left: certList.scrollLeft + dir * cardWidth, behavior: 'smooth' });
        };
        if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

        // Initialize UI state
        updateUI();
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
