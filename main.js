/**
 * Fayas T M Portfolio — Interactive Controller
 * High-performance, lightweight, and fully responsive
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.body.classList.add('motion-ready');
    window.requestAnimationFrame(() => document.body.classList.add('hero-loaded'));
  }

  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // --------------------------------------------------------------------------
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 2. Navigation & Scroll State
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');

  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }

    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Keep the portrait nudge subtle and limited to precise desktop pointers.
  const heroSection = document.querySelector('.hero-section');
  const heroPhoto = document.querySelector('.hero-photo');
  const canUseFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (heroSection && heroPhoto && canUseFinePointer && !prefersReducedMotion) {
    let pointerFrame = null;

    const resetHeroPhoto = () => {
      heroPhoto.style.transform = 'translate3d(0, 0, 0)';
    };

    heroSection.addEventListener('pointermove', (event) => {
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        const bounds = heroSection.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
        heroPhoto.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
    });

    heroSection.addEventListener('pointerleave', resetHeroPhoto);
  }

  // --------------------------------------------------------------------------
  // Smooth anchor scrolling
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mob-link');

  if (menuToggle && mobileOverlay) {
    function toggleMobileMenu(open) {
      const isOpen = open !== undefined ? open : !mobileOverlay.classList.contains('open');
      mobileOverlay.classList.toggle('open', isOpen);
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', () => toggleMobileMenu());

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  // --------------------------------------------------------------------------
  // 4. Project Filtering
  // --------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');

      filterPills.forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          window.requestAnimationFrame(() => card.classList.add('visible'));
        } else {
          card.classList.remove('visible');
          window.setTimeout(() => {
            if (!card.classList.contains('visible')) {
              card.style.display = 'none';
            }
          }, 450);
        }
      });

      showToast(`Filter: ${pill.textContent}`);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Project Quick-View Modals (Exact Fayas T M Data)
  // --------------------------------------------------------------------------
  const projectData = {
    torque: {
      title: 'Torque MotoTech — E-Commerce Platform',
      image: 'assets/torque-moto-tech-thumbnail.png',
      desc: 'Built and deployed a production full-stack e-commerce web platform for Torque MotoTech with product browsing, authentication, cart, order management, and an administrative dashboard.',
      features: [
        'Responsive React.js user interface styled with Tailwind CSS',
        'Robust REST APIs built with Node.js and Express.js',
        'MongoDB database with optimized schema design and indexing',
        'Admin panel for inventory and order management',
        'Deployed live in production on Vercel'
      ],
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Vercel'],
      liveUrl: 'https://torquemototechkannur.vercel.app/',
      githubUrl: 'https://github.com/fayastm03'
    },
    hasi: {
      title: 'Hasi Foods — E-Commerce Storefront',
      image: 'assets/hasi-foods-preview2.png',
      desc: 'Built a React.js storefront for Hasi Foods, a Kannur-based food and spice brand, with product browsing, product detail pages, brand storytelling, and WhatsApp ordering flows.',
      features: [
        'Responsive React.js and Next.js storefront for desktop and mobile',
        'Product collection and detailed blend pages for rice flours and spices',
        'WhatsApp ordering links for direct customer enquiries and purchases',
        'Editorial brand sections covering sourcing, craft, and customer stories',
        'Deployed live on Vercel'
      ],
      tags: ['React.js', 'Next.js', 'JavaScript', 'E-Commerce', 'Vercel'],
      liveUrl: 'https://hasi-foods.vercel.app/'
    },
    chat: {
      title: 'Real-Time Chat — Messaging Application',
      image: 'assets/realtime-chat-iphone-flow.png',
      desc: 'Developed a real-time messaging application with authentication, one-to-one conversations, contact management, and message history.',
      features: [
        'Implemented Socket.IO for real-time text and image messaging',
        'Integrated REST APIs for users, messages, media uploads, and synchronization',
        'Built responsive Flutter chat interfaces with Provider-based state management',
        'MongoDB backend for conversation persistence and chat history'
      ],
      tags: ['Flutter', 'Dart', 'Socket.IO', 'Node.js', 'Express.js', 'MongoDB', 'Provider'],
      liveUrl: 'https://github.com/fayastm03',
      githubUrl: 'https://github.com/fayastm03'
    },
    ecommerce: {
      title: 'E-Commerce Mobile Application',
      image: 'assets/ecommerce_mobile_mockup.png',
      desc: 'Developed a feature-rich Flutter e-commerce application with user authentication, comprehensive product catalog, interactive shopping cart, order management, and secure payment processing.',
      features: [
        'Designed responsive mobile interfaces with reusable Flutter widgets',
        'Razorpay payment gateway integration for frictionless transactions',
        'Connected to Node.js and MongoDB backend via clean REST APIs',
        'Cart state management, product filtering, and order history tracking'
      ],
      tags: ['Flutter', 'Dart', 'Node.js', 'MongoDB', 'Razorpay', 'REST APIs'],
      liveUrl: 'https://github.com/fayastm03',
      githubUrl: 'https://github.com/fayastm03'
    },
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalContent = document.getElementById('projectModalContent');
  const closeProjectModal = document.getElementById('closeProjectModal');

  function openProject(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModalContent) return;

    projectModalContent.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-project-img">
      <h3 class="modal-project-title">${data.title}</h3>
      <p class="modal-project-desc">${data.desc}</p>
      
      <div class="modal-features-list">
        <h4>Technical Highlights</h4>
        <ul>
          ${data.features.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div class="project-tags" style="margin-bottom: 20px;">
        ${data.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>

      <div class="modal-project-actions">
        ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noreferrer" class="pill pill-dark">Live Demo / Repo ↗</a>` : ''}
        ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" rel="noreferrer" class="pill pill-outline">GitHub Profile ↗</a>` : ''}
      </div>
    `;

    if (projectModal) {
      projectModal.classList.add('open');
      projectModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const projectId = card.getAttribute('data-project-id');
      if (projectId) {
        openProject(projectId);
      }
    });
  });

  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.remove('open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Services Accordion
  // --------------------------------------------------------------------------
  const serviceRows = document.querySelectorAll('.service-row');

  serviceRows.forEach((row) => {
    const header = row.querySelector('.service-row-header');
    if (header) {
      header.addEventListener('click', () => {
        const isCurrentlyExpanded = row.classList.contains('expanded');

        // Close all rows
        serviceRows.forEach((r) => {
          r.classList.remove('expanded');
          const icon = r.querySelector('.service-action-icon');
          if (icon) icon.textContent = '↗';
        });

        // Toggle state
        if (!isCurrentlyExpanded) {
          row.classList.add('expanded');
          const icon = row.querySelector('.service-action-icon');
          if (icon) icon.textContent = '✕';
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 7. Contact Modal & Form Handling
  // --------------------------------------------------------------------------
  const contactModal = document.getElementById('contactModal');
  const closeContactModal = document.getElementById('closeContactModal');
  const openContactBtn = document.getElementById('openContactBtn');
  const footerContactBtn = document.getElementById('footerContactBtn');
  const contactForm = document.getElementById('contactForm');

  function openContact() {
    if (contactModal) {
      contactModal.classList.add('open');
      contactModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeContact() {
    if (contactModal) {
      contactModal.classList.remove('open');
      contactModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openContactBtn) openContactBtn.addEventListener('click', openContact);
  if (footerContactBtn) footerContactBtn.addEventListener('click', openContact);
  if (closeContactModal) closeContactModal.addEventListener('click', closeContact);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeContact();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const subject = formData.get('subject') || 'Project Inquiry';
      const message = formData.get('message') || '';

      const mailtoUrl = `mailto:fayastm03@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      
      window.location.href = mailtoUrl;
      showToast('Opening email client for fayastm03@gmail.com...');
      closeContact();
      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 8. Clipboard Copy Email & Resume Download Handlers
  // --------------------------------------------------------------------------
  const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
  copyEmailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'fayastm03@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Copied fayastm03@gmail.com to clipboard!');
      }).catch(() => {
        showToast('Email: fayastm03@gmail.com');
      });
    });
  });

  const resumeButtons = document.querySelectorAll('.resume-download-btn');
  resumeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast('Downloading Fayas T M Resume (PDF)...');
    });
  });

  // Global Escape Key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('open')) {
        projectModal.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (contactModal && contactModal.classList.contains('open')) {
        contactModal.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (mobileOverlay && mobileOverlay.classList.contains('open')) {
        mobileOverlay.classList.remove('open');
        if (menuToggle) menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // --------------------------------------------------------------------------
  // 9. Reusable Intersection Observer motion system
  // --------------------------------------------------------------------------
  const revealGroups = [
    { selector: '.work-section, .service-section, .experience-section, .skills-section, .contact-section', className: 'reveal-section' },
    { selector: '.section-topbar, .contact-heading', className: 'reveal-heading' },
    { selector: '.projects-grid .project-card, .service-accordion .service-row, .experience-timeline .exp-item, .skills-grid .skill-card', className: 'reveal stagger-item' },
    { selector: '.project-media-wrap img, .service-mockup-card img', className: 'reveal-image' },
    { selector: '.filter-pills-row, .contact-inner > .availability-pill, .contact-subtext, .contact-action-btn, .footer-bar, .footer-credit', className: 'reveal' },
    { selector: '.experience-timeline', className: 'timeline-reveal' }
  ];

  const revealElements = [];
  revealGroups.forEach(({ selector, className }) => {
    document.querySelectorAll(selector).forEach((element) => {
      className.split(' ').forEach((name) => element.classList.add(name));
      revealElements.push(element);
    });
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'motion-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible', 'motion-visible'));
  }
});
