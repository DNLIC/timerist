// Simple dark mode toggle for static HTML pages
// Supports both .dark class (for most pages) and data-theme="style1" (for quick-countdown.html)
(function() {
  const themeKey = 'timerist-theme';
  const darkClass = 'dark';
  const darkThemeValue = 'style1';
  
  // Get saved theme or default to system preference
  function getInitialTheme() {
    const saved = localStorage.getItem(themeKey);
    if (saved) {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Check if dark mode is currently active (supports both methods)
  function isDarkMode() {
    const root = document.documentElement;
    return root.classList.contains(darkClass) || root.getAttribute('data-theme') === darkThemeValue;
  }
  
  // Apply theme (supports both .dark class and data-theme="style1")
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
      // Apply both methods for compatibility
      root.classList.add(darkClass);
      root.setAttribute('data-theme', darkThemeValue);
    } else {
      // Remove both methods
      root.classList.remove(darkClass);
      root.removeAttribute('data-theme');
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
    const current = isDarkMode() ? 'dark' : 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };
  
  // Expose getTheme function
  window.getTheme = function() {
    return isDarkMode() ? 'dark' : 'light';
  };
})();
