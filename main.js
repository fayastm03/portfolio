/**
 * Fayas T M Portfolio - Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initLocalTime();
  initNavbarScroll();
  initScrollAnimations();
});

/**
 * 1. Kannur, India Real-Time Clock
 * Shows the developer's exact local time (Asia/Kolkata) to visitors globally.
 */
function initLocalTime() {
  const timeElement = document.getElementById('current-time');
  if (!timeElement) return;

  function updateClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
      timeElement.textContent = timeString;
    } catch (e) {
      // Fallback if timezone conversion fails
      timeElement.textContent = new Date().toLocaleTimeString();
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * 2. Navbar Scroll Behavior
 * Applies backdrop/opacity adjustments on scroll.
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.style.backgroundColor = 'rgba(213, 207, 190, 0.96)'; // Keep sand background
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
    } else {
      navbar.style.backgroundColor = 'rgba(213, 207, 190, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once in case page loads scrolled down
}

/**
 * 3. Scroll Reveal Animations
 * Snappy, minimalist animations inspired by high-end websites.
 */
function initScrollAnimations() {
  const animTargets = [
    '#hero .hero-badge',
    '#hero .hero-title',
    '#hero .hero-description',
    '#hero .hero-actions',
    '.section-subtitle',
    '.section-title',
    '.section-divider',
    '.project-item',
    '.about-photo-wrapper',
    '.about-intro',
    '.stat-card',
    '.skills-column',
    '.contact-board'
  ];

  // Inject structural styling for minimal, snappy transitions (only 10px translate)
  const style = document.createElement('style');
  style.innerHTML = `
    .scroll-reveal {
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .scroll-reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  animTargets.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.classList.add('scroll-reveal');
      
      // Calculate stagger for grids
      if (selector === '.stat-card' || selector === '.skills-column' || selector === '.project-item') {
        el.dataset.delay = (index % 3) * 80; // 80ms increments
      }
      
      observer.observe(el);
    });
  });
}
