const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLabel = navToggle.querySelector('.sr-only');

const setNavigationState = (isOpen) => {
  siteNav.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  navLabel.textContent = isOpen ? 'Close navigation' : 'Open navigation';
};

navToggle.addEventListener('click', () => {
  setNavigationState(!siteNav.classList.contains('open'));
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setNavigationState(false);
  });
});

document.addEventListener('click', (event) => {
  if (!siteNav.contains(event.target) && !navToggle.contains(event.target)) {
    setNavigationState(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav.classList.contains('open')) {
    setNavigationState(false);
    navToggle.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 850) setNavigationState(false);
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
