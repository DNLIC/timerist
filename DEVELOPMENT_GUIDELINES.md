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

### Control Button Bar on Narrow Viewports (3+ Buttons)

**When to apply:** Any timer that shows more than three control buttons across the center (e.g. Start/Pause, Reset, Clear, Set Up, Repeat, Complete/Next). When button labels are long enough to truncate or become illegible on narrow viewports (e.g. iPhone 13 portrait in vertical mode), use this pattern so labels display properly at a legible size.

**Problem:** On narrow portrait screens, four (or more) buttons in a single row overflow or truncate. Forcing one row with `flex: 1 1 0` can make labels unreadable. Letting buttons wrap naturally often produces a “hanging” layout (e.g. 3 on top, 1 on bottom), which looks unbalanced.

**Solution:**

1. **Constrain the container**  
   The card wrapping the control buttons is a flex child; without constraints it can grow to the width of the button row and get clipped by the viewport.  
   - Give the card a class (e.g. `control-buttons-card`) and set: `min-width: 0`, `width: 100%`, `box-sizing: border-box`.  
   - On the flex container (e.g. `.control-buttons-container`): `width: 100%`, `min-width: 0`, `max-width: 100%`, `box-sizing: border-box`.  
   This keeps the bar within the viewport so layout and wrap behave correctly.

2. **Narrow viewport: three (or fewer) buttons**  
   - Single row: `flex-wrap: nowrap`.  
   - Buttons shrink to fit: `flex: 1 1 0`, `min-width: 0`.  
   - Reduce size so three fit without truncation: smaller padding (e.g. `0.5rem 0.375rem`), smaller font (e.g. `0.8125rem`), and optionally smaller `min-height` (e.g. `48px`). At very narrow (e.g. max-width 390px), reduce further (e.g. `font-size: 0.75rem`, `padding: 0.45rem 0.25rem`).

3. **Narrow viewport: exactly four buttons**  
   Use a **2×2 layout** (two rows of two) so there is no single button on the second row.  
   - **JS:** After updating which buttons are visible, count visible `.control-btn` elements (e.g. `getComputedStyle(b).display !== 'none'`) and toggle a class on the container (e.g. `four-buttons`) when the count is exactly 4. Call this logic from the same function that sets button visibility (and on initial load).  
   - **CSS (only when the class is present and viewport is narrow, e.g. max-width: 430px):**  
     - `.control-buttons-container.four-buttons { flex-wrap: wrap; }`  
     - `.control-buttons-container.four-buttons .control-btn { flex: 1 1 calc(50% - 0.25rem); min-width: calc(50% - 0.25rem); }`  
   So four visible buttons always break into two equal rows.

4. **Wider viewports**  
   Above the narrow breakpoint (e.g. min-width: 431px), keep a single row and normal button sizing; do not apply the 2×2 layout on large screens.

**Reference implementation:** `mobility.html` — control-buttons-card wrapper, `#controlButtonsContainer`, `updateButtonStates()` toggling `four-buttons`, and the associated media queries.

**Checklist when adding or changing a timer with 4+ control buttons:**
- [ ] Card and container have width/min-width constraints so the bar doesn’t overflow on narrow viewports.
- [ ] Narrow viewport (e.g. ≤430px): single row with smaller buttons so 3 across fit and remain legible.
- [ ] When exactly 4 buttons are visible: JS adds a class; CSS uses it to show 2×2 (no hanging button).
- [ ] Class toggle runs on load and whenever button visibility changes.
- [ ] Test on iPhone 13 (or similar) portrait to confirm no truncation and readable labels.

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

- **Last Updated:** 2026-02-04
- **Drawer pattern:** Multiple times - setup drawer became inaccessible. Final fix: moved `toggleDrawer` and `closeDrawer` to `<head>`. Prevention: define UI-critical functions in `<head>` before HTML parsing.
- **Control button bar (narrow viewports):** Mobility timer (2026-02-04) — when 4+ buttons and labels truncate on narrow portrait, constrain container, use smaller buttons for 3 across, and use a JS-toggled class to show 2×2 when exactly 4 buttons visible. See “Control Button Bar on Narrow Viewports” above.
