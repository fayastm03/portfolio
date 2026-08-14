document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      entry.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(entry.target)) * 70}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px' });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.play().catch(() => {});
      else target.pause();
    });
  }, { threshold: .15 });
  document.querySelectorAll('.project-preview').forEach((video) => previewObserver.observe(video));

  const projects = document.querySelector('.projects-list');
  const previousProject = document.querySelector('[data-projects-prev]');
  const nextProject = document.querySelector('[data-projects-next]');
  if (projects && previousProject && nextProject) {
    const slides = [...projects.querySelectorAll('.project-card')];
    let activeSlide = 0;
    let direction = 1;
    let autoplay;
    let scrollTimeout;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const goToSlide = (index) => {
      activeSlide = Math.max(0, Math.min(index, slides.length - 1));
      projects.scrollTo({ left: slides[activeSlide].offsetLeft, behavior: 'smooth' });
    };
    const moveProjects = (step) => goToSlide(activeSlide + step);
    const stopAutoplay = () => window.clearInterval(autoplay);
    const startAutoplay = () => {
      if (reduceMotion) return;
      stopAutoplay();
      autoplay = window.setInterval(() => {
        if (activeSlide === slides.length - 1) direction = -1;
        if (activeSlide === 0) direction = 1;
        moveProjects(direction);
      }, 6500);
    };
    previousProject.addEventListener('click', () => { moveProjects(-1); startAutoplay(); });
    nextProject.addEventListener('click', () => { moveProjects(1); startAutoplay(); });
    projects.addEventListener('scroll', () => {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        activeSlide = Math.round(projects.scrollLeft / (projects.clientWidth + 28));
      }, 100);
    }, { passive: true });
    projects.addEventListener('pointerenter', stopAutoplay);
    projects.addEventListener('pointerleave', startAutoplay);
    projects.addEventListener('focusin', stopAutoplay);
    projects.addEventListener('focusout', startAutoplay);
    document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay());
    startAutoplay();
  }
});
