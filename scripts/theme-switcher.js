/**
 * TimeristWP Theme Switcher
 * Handles switching between Style 1, Style 2, and Style 3
 * Supports URL parameters and localStorage persistence
 * Default: Style 3 (current design)
 */

(function() {
    'use strict';
    
    const THEME_STORAGE_KEY = 'timeristwp_theme';
    const VALID_THEMES = ['style1', 'style2', 'style3'];
    const DEFAULT_THEME = 'style3';
    
    /**
     * Get theme from URL parameter, localStorage, or default
     */
    function getTheme() {
        // Check URL parameter first (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const urlTheme = urlParams.get('style');
        
        if (urlTheme && VALID_THEMES.includes(urlTheme)) {
            return urlTheme;
        }
        
        // Check localStorage
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme && VALID_THEMES.includes(storedTheme)) {
            return storedTheme;
        }
        
        // Return default
        return DEFAULT_THEME;
    }
    
    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        if (!VALID_THEMES.includes(theme)) {
            theme = DEFAULT_THEME;
        }
        
        // Set data attribute on root element
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage (unless it came from URL parameter)
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('style')) {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    }
    
    /**
     * Initialize theme on page load
     */
    function initTheme() {
        const theme = getTheme();
        applyTheme(theme);
    }
    
    /**
     * Public API for changing theme programmatically
     */
    window.TimeristWP = window.TimeristWP || {};
    window.TimeristWP.setTheme = function(theme) {
        applyTheme(theme);
    };
    
    window.TimeristWP.getTheme = function() {
        return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    };
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
})();
