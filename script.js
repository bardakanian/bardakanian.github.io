const themeSelect = document.getElementById('theme-select');
const themeStatus = document.getElementById('theme-status');
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const allowedThemes = ['system', 'light', 'dark'];

const getSavedTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme-preference');
    return allowedThemes.includes(savedTheme) ? savedTheme : 'system';
  } catch (error) {
    return 'system';
  }
};

const applyTheme = (preference, { persist = false, announce = false } = {}) => {
  const resolvedTheme = preference === 'system'
    ? (systemTheme.matches ? 'dark' : 'light')
    : preference;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = resolvedTheme;
  themeSelect.value = preference;
  themeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f1b27' : '#0b1f33');

  if (persist) {
    try {
      localStorage.setItem('theme-preference', preference);
    } catch (error) {
      // The selected theme still applies for this visit when storage is unavailable.
    }
  }

  if (announce) {
    themeStatus.textContent = `${preference === 'system' ? `System theme, currently ${resolvedTheme}` : `${resolvedTheme} theme`} selected`;
  }
};

applyTheme(getSavedTheme());

themeSelect.addEventListener('change', () => {
  applyTheme(themeSelect.value, { persist: true, announce: true });
});

systemTheme.addEventListener('change', () => {
  if (document.documentElement.dataset.themePreference === 'system') {
    applyTheme('system');
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'theme-preference') applyTheme(getSavedTheme());
});

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
