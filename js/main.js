// Modern SRE Portfolio — Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCounters();
    initScroll();
});

// Navigation scroll effect
function initNav() {
    const nav = document.getElementById('nav');
    
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
    
    // Mobile menu
    const toggle = document.getElementById('menutoggle');
    const navlinks = document.getElementById('navlinks');
    
    toggle?.addEventListener('click', () => {
        navlinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.h-num[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const update = () => {
                current += step;
                if (current < target) {
                    el.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            };
            
            update();
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
}

// Smooth scroll for nav links
function initScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Close mobile menu if open
            document.getElementById('navlinks')?.classList.remove('active');
        });
    });
}