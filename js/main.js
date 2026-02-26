/**
 * SRE Portfolio — Main JavaScript
 * Professional UK Standard — Light Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCounters();
    initSmoothScroll();
    initActiveNav();
});

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navtoggle');
    const navLinks = document.getElementById('navlinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Mobile menu
    toggle?.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        toggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-value[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            const label = counter.nextElementSibling?.textContent || '';
            const suffix = label.includes('%') ? '%' : 
                          label.includes('K') ? 'K+' : 
                          label.includes('Hours') ? '+' : '';
            
            animateCounter(counter, target, suffix);
            observer.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(element, target, suffix) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(easeProgress * target);
        element.textContent = current + (progress < 1 ? '' : suffix);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Active navigation
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0 
    });
    
    sections.forEach(s => observer.observe(s));
}

// Contact form
const contactForm = document.getElementById('contactform');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent';
                btn.style.background = 'var(--colour-success)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            btn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error — Email Directly';
            btn.style.background = '#dc2626';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        }
    });
}

// Reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}