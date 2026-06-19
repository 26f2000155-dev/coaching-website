// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Menu Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinkElements = document.querySelectorAll('.nav-link');

function setActiveLink() {
    const scrollY = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinkElements.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== Smooth Scroll =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = navbar.offsetHeight;
        const sectionTop = section.offsetTop - navHeight;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
}

// ===== Animated Counter =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger counter animation for hero stats
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.feature-card, .fee-card, .testimonial-card, .hero-stats, .admission-wrapper, .hero-content, .hero-visual').forEach(el => {
    observer.observe(el);
});

// ===== Testimonial Slider =====
const track = document.getElementById('testimonialsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('testimonialsDots');
const cards = track.querySelectorAll('.testimonial-card');

let currentSlide = 0;
let cardsPerView = getCardsPerView();
let totalSlides = Math.ceil(cards.length / cardsPerView);
let autoSlideInterval;

function getCardsPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
}

function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateSlider() {
    const gap = 24;
    const cardWidth = (track.parentElement.offsetWidth - gap * (cardsPerView - 1)) / cardsPerView;
    const offset = currentSlide * (cardWidth + gap) * cardsPerView;
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Initialize slider
createDots();
startAutoSlide();

// Handle resize
window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    totalSlides = Math.ceil(cards.length / cardsPerView);
    currentSlide = Math.min(currentSlide, totalSlides - 1);
    createDots();
    updateSlider();
});

// ===== Admission Form =====
const admissionForm = document.getElementById('admissionForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
        admissionForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }, 1500);
});

function resetForm() {
    admissionForm.reset();
    admissionForm.style.display = 'flex';
    formSuccess.style.display = 'none';
}

// ===== Form Input Animations =====
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        if (input.value) {
            input.parentElement.classList.add('filled');
        } else {
            input.parentElement.classList.remove('filled');
        }
    });
});

// ===== WhatsApp Button Animation =====
const whatsappBtn = document.getElementById('whatsappBtn');
let whatsappPulseInterval;

function startWhatsAppPulse() {
    whatsappPulseInterval = setInterval(() => {
        whatsappBtn.classList.add('pulse');
        setTimeout(() => whatsappBtn.classList.remove('pulse'), 1000);
    }, 4000);
}

startWhatsAppPulse();

// ===== Parallax Effect on Hero Orbs =====
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.hero-orb');
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (targetId) {
            scrollToSection(targetId);
        }
    });
});
