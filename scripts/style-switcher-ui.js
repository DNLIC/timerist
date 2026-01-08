/**
 * TimeristWP Style Switcher UI
 * Adds a dropdown menu to switch between styles
 */

(function() {
    'use strict';
    
    const STYLES = [
        { value: 'style1', label: 'Style 1 (Dark Mode)' },
        { value: 'style2', label: 'Style 2' },
        { value: 'style3', label: 'Style 3 (Default)' }
    ];
    
    /**
     * Create the style switcher UI
     */
    function createStyleSwitcher() {
        // Check if switcher already exists
        if (document.getElementById('timerist-style-switcher')) {
            return;
        }
        
        // Create container
        const container = document.createElement('div');
        container.id = 'timerist-style-switcher';
        container.className = 'timerist-style-switcher';
        
        // Create label
        const label = document.createElement('label');
        label.htmlFor = 'timerist-style-select';
        label.textContent = 'Style:';
        label.className = 'timerist-style-label';
        
        // Create select dropdown
        const select = document.createElement('select');
        select.id = 'timerist-style-select';
        select.className = 'timerist-style-select';
        
        // Add options
        STYLES.forEach(style => {
            const option = document.createElement('option');
            option.value = style.value;
            option.textContent = style.label;
            select.appendChild(option);
        });
        
        // Set current value
        const currentTheme = window.TimeristWP ? window.TimeristWP.getTheme() : 'style3';
        select.value = currentTheme;
        
        // Add change event listener
        select.addEventListener('change', function() {
            const selectedStyle = this.value;
            if (window.TimeristWP) {
                window.TimeristWP.setTheme(selectedStyle);
            }
            // Update URL without reload
            const url = new URL(window.location);
            url.searchParams.set('style', selectedStyle);
            window.history.pushState({}, '', url);
        });
        
        // Assemble
        container.appendChild(label);
        container.appendChild(select);
        
        // Add to page
        const timerContainer = document.querySelector('.timer-container');
        if (timerContainer) {
            // Insert before timer container
            timerContainer.parentNode.insertBefore(container, timerContainer);
        } else {
            // Fallback: add to body
            document.body.insertBefore(container, document.body.firstChild);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for theme switcher to initialize
            setTimeout(createStyleSwitcher, 100);
        });
    } else {
        setTimeout(createStyleSwitcher, 100);
    }
    
    // Update select when theme changes externally
    if (window.TimeristWP) {
        const originalSetTheme = window.TimeristWP.setTheme;
        window.TimeristWP.setTheme = function(theme) {
            originalSetTheme.call(this, theme);
            const select = document.getElementById('timerist-style-select');
            if (select) {
                select.value = theme;
            }
        };
    }
    
})();
