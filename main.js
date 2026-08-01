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
});
