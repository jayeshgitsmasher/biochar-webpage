// ============================================================
//  main.js — NatWorks Transformation · Shared page behaviour
// ============================================================

/* ----------------------------------------------------------
   1. Navbar – scroll effect + hamburger toggle + active link
---------------------------------------------------------- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  // Close menu when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// Highlight the nav link that matches the current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ----------------------------------------------------------
   2. Smooth anchor scroll
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ----------------------------------------------------------
   3. Particle system
---------------------------------------------------------- */
function createParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const colors = [
    '#66bb6a', '#2e7d32', '#1a73e8',
    '#42a5f5', '#e53935', '#a5d6a7'
  ];
  const animations = ['floatParticle', 'floatParticle2', 'floatParticle3'];

  for (let i = 0; i < 60; i++) {
    const particle = document.createElement('div');

    const size     = Math.random() * 9 + 3;           // 3–12 px
    const top      = Math.random() * 100;              // 0–100 %
    const left     = Math.random() * 100;              // 0–100 %
    const color    = colors[Math.floor(Math.random() * colors.length)];
    const opacity  = (Math.random() * 0.5 + 0.3).toFixed(2);  // 0.3–0.8
    const anim     = animations[Math.floor(Math.random() * animations.length)];
    const duration = (Math.random() * 12 + 6).toFixed(1);     // 6–18 s
    const delay    = (Math.random() * 8).toFixed(1);           // 0–8 s

    particle.style.cssText = [
      'position: absolute',
      `top: ${top}%`,
      `left: ${left}%`,
      `width: ${size}px`,
      `height: ${size}px`,
      'border-radius: 50%',
      `background-color: ${color}`,
      `opacity: ${opacity}`,
      `animation: ${anim} ${duration}s ${delay}s infinite ease-in-out`,
      'pointer-events: none'
    ].join(';');

    container.appendChild(particle);
  }
}

/* ----------------------------------------------------------
   4. Scroll reveal – IntersectionObserver
---------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------------
   5. Animated counters
---------------------------------------------------------- */
function animateCounter(element, target, suffix) {
  const duration = 2000;
  const start    = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(startVal + (target - startVal) * eased);
    element.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ----------------------------------------------------------
   6. Stability bar animation (biochar.html)
---------------------------------------------------------- */
function initStabilityBars() {
  const bars = document.querySelectorAll('.stability-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width || '0%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
}

/* ----------------------------------------------------------
   7. Bootstrap everything on DOMContentLoaded
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  createParticles('particles');
  initScrollReveal();
  initCounters();
  initStabilityBars();
});
