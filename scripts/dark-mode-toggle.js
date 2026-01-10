// Simple dark mode toggle for static HTML pages
(function() {
  const themeKey = 'timerist-theme';
  const darkClass = 'dark';
  
  // Get saved theme or default to system preference
  function getInitialTheme() {
    const saved = localStorage.getItem(themeKey);
    if (saved) {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add(darkClass);
    } else {
      root.classList.remove(darkClass);
    }
    localStorage.setItem(themeKey, theme);
  }
  
  // Initialize
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(themeKey)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Expose toggle function
  window.toggleTheme = function() {
    const current = document.documentElement.classList.contains(darkClass) ? 'dark' : 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };
  
  // Expose getTheme function
  window.getTheme = function() {
    return document.documentElement.classList.contains(darkClass) ? 'dark' : 'light';
  };
})();
