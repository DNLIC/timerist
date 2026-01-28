# Timerist Development Guidelines

## Critical UI/UX Patterns

### Drawer/Side Panel Functions Must Be Defined Early

**Issue:** The setup drawer (settings panel) has become inaccessible multiple times due to JavaScript execution order issues.

**Root Cause:** Functions used by `onclick` handlers in HTML must be defined **before** the HTML is parsed. If these functions are defined in the main `<script>` tag at the bottom of the page, and there are syntax errors or execution issues in that script, the functions will be `undefined` when users click the buttons.

**Solution:** Always define drawer/side panel functions in the `<head>` section:

```html
<head>
    <!-- ... other head content ... -->
    <script>
        // Define drawer functions immediately in head - must be available before HTML onclick handlers
        window.toggleDrawer = function() {
            const drawer = document.getElementById('settingsDrawer');
            const overlay = document.getElementById('drawerOverlay');
            if (drawer && overlay) {
                drawer.classList.toggle('open');
                overlay.classList.toggle('open');
            } else {
                console.error('Drawer elements not found:', { drawer, overlay });
            }
        };
        
        window.closeDrawer = function() {
            const drawer = document.getElementById('settingsDrawer');
            const overlay = document.getElementById('drawerOverlay');
            if (drawer && overlay) {
                drawer.classList.remove('open');
                overlay.classList.remove('open');
            }
        };
    </script>
    <!-- ... rest of head ... -->
</head>
```

**Why This Matters:**
- HTML `onclick` handlers execute immediately when the HTML is parsed
- If the function isn't defined yet, you'll get `TypeError: window.toggleDrawer is not a function`
- Syntax errors in the main script can prevent it from executing, leaving functions undefined
- Defining in `<head>` ensures functions are available regardless of main script execution

**Prevention Checklist:**
- [ ] All functions used by `onclick` handlers are defined in `<head>`
- [ ] Functions are attached to `window` object for global access
- [ ] Test drawer/side panel buttons after any major script changes
- [ ] Check browser console for `undefined` function errors

**Related Files:**
- `custom.html` - Setup drawer implementation
- All timer HTML files with drawer/side panel functionality

---

## JavaScript Execution Order Best Practices

### 1. Critical Functions in `<head>`
Functions that are called by HTML attributes (`onclick`, `onchange`, etc.) must be defined early.

### 2. Main Application Logic in Bottom `<script>`
Keep the main application logic in a `<script>` tag at the bottom of the body, but don't rely on it for critical UI functions.

### 3. Error Handling
Always check if functions exist before calling them:
```javascript
if (window.toggleDrawer) {
    window.toggleDrawer();
}
```

### 4. Syntax Error Prevention
- Use a linter or syntax checker before committing
- Test in browser console after major changes
- Watch for "Unexpected token" errors that can break entire scripts

---

## Common Issues & Solutions

### Issue: Drawer/Side Panel Not Opening
**Symptoms:** Clicking setup button or hamburger menu does nothing, console shows `TypeError: window.toggleDrawer is not a function`

**Solutions:**
1. Move function definition to `<head>`
2. Check for JavaScript syntax errors in main script
3. Verify function is attached to `window` object
4. Check browser console for errors

### Issue: Pointer Events Blocking Clicks
**Symptoms:** Buttons appear clickable but don't respond

**Solutions:**
1. Ensure drawer overlay has `pointer-events: none` when closed
2. Add `pointer-events: auto` and appropriate `z-index` to clickable elements
3. Check for overlapping elements with higher z-index

---

## Testing Checklist

Before committing changes that affect UI:
- [ ] Test all drawer/side panel open/close functionality
- [ ] Verify no JavaScript syntax errors in console
- [ ] Check that all `onclick` handlers have their functions defined
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Verify mobile touch interactions work

---

## Notes

- **Last Updated:** 2026-01-26
- **Issue Occurred:** Multiple times - setup drawer became inaccessible
- **Final Fix:** Moved `toggleDrawer` and `closeDrawer` functions to `<head>` section
- **Prevention:** Always define UI-critical functions in `<head>` before HTML parsing
