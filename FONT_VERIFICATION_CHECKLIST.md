# Inter Font Verification Checklist

## Setup Complete ✅
- ✅ `app/layout.tsx` - Added `font-sans` to `<html>` and `<body>` elements
- ✅ `app/globals.css` - Already has `@apply font-sans antialiased` on html/body
- ✅ `tailwind.config.ts` - Inter configured as first font in sans stack
- ✅ `components/ui/` - No hard-coded font-family declarations found
- ✅ Timer digits intentionally use `font-mono` (tabular-nums for alignment)

## Test Plan

### 1. Static HTML Pages (Direct Browser Open)
Test these files by opening them directly in your browser (not via Next.js dev server):

#### quick-countdown.html
- [ ] Open `quick-countdown.html` in browser
- [ ] Right-click on timer digits → Inspect Element
- [ ] Check Computed Styles → `font-family` should start with **"Inter"** or **"Inter var"**
- [ ] Verify body text and labels use Inter (not system fonts)
- [ ] Expected: Timer digits use monospace (intentional), all other text uses Inter

#### tabata.html
- [ ] Open `tabata.html` in browser
- [ ] Right-click on timer digits → Inspect Element
- [ ] Check Computed Styles → `font-family` should start with **"Inter"** or **"Inter var"**
- [ ] Verify status labels, buttons, and body text use Inter
- [ ] Expected: Timer digits use monospace (intentional), all other text uses Inter

#### emom.html
- [ ] Open `emom.html` in browser
- [ ] Right-click on timer digits → Inspect Element
- [ ] Check Computed Styles → `font-family` should start with **"Inter"** or **"Inter var"**
- [ ] Verify all UI elements use Inter
- [ ] Expected: Timer digits use monospace (intentional), all other text uses Inter

#### amrap.html
- [ ] Open `amrap.html` in browser
- [ ] Right-click on timer digits → Inspect Element
- [ ] Check Computed Styles → `font-family` should start with **"Inter"** or **"Inter var"**
- [ ] Verify all UI elements use Inter
- [ ] Expected: Timer digits use monospace (intentional), all other text uses Inter

#### Other HTML pages
- [ ] Test `interval.html`, `hiit.html`, `countdown.html`, `stopwatch.html`, `pyramid.html`
- [ ] Verify Inter is applied to all non-monospace text

### 2. Next.js Dev Server (React Components)
Run `npm run dev` and test these routes:

#### Homepage (/)
- [ ] Visit `http://localhost:3000`
- [ ] Right-click on any body text → Inspect Element
- [ ] Check Computed Styles → `font-family` should start with **"Inter"** or **"Inter var"**
- [ ] Verify headings, buttons, and all UI text use Inter
- [ ] Expected: All text uses Inter (except timer digits which use monospace)

#### Timer Example Page
- [ ] Visit any timer route (e.g., `/countdown`, `/timer-example`)
- [ ] Right-click on timer display → Inspect Element
- [ ] Check Computed Styles → Timer digits should use monospace (intentional)
- [ ] Right-click on status labels/buttons → Inspect Element
- [ ] Check Computed Styles → `font-family` should start with **"Inter"** or **"Inter var"**
- [ ] Expected: Timer digits use monospace, all other text uses Inter

### 3. Visual Verification
- [ ] **Large timer digits**: Should look clean/modern with monospace (tabular-nums for alignment)
- [ ] **Body text**: Should use Inter - check for smooth, modern appearance
- [ ] **Headings**: Should use Inter - verify consistency
- [ ] **Buttons**: Should use Inter - check labels and text
- [ ] **Form inputs**: Should use Inter - verify input text
- [ ] **Status labels**: Should use Inter - check timer status text

### 4. Browser DevTools Inspection
For each page, use DevTools to verify:

1. **Select `<html>` element**:
   - Computed `font-family` should show: `"Inter var", Inter, ui-sans-serif, system-ui, ...`

2. **Select `<body>` element**:
   - Computed `font-family` should show: `"Inter var", Inter, ui-sans-serif, system-ui, ...`
   - Should have `font-sans` class applied

3. **Select timer digit elements**:
   - Computed `font-family` should show monospace stack (intentional)
   - Should have `font-mono` class applied

4. **Select any other text element**:
   - Computed `font-family` should start with `"Inter"` or `"Inter var"`

### 5. Common Issues to Check
- [ ] **System fonts appearing**: If you see `-apple-system`, `BlinkMacSystemFont`, or `Segoe UI` as the primary font, Inter is not loading
- [ ] **Courier-style monospace**: Timer digits should use modern monospace, not Courier (check tailwind.config.ts mono stack)
- [ ] **Inconsistent fonts**: All non-monospace text should consistently use Inter
- [ ] **Font loading**: Check Network tab → ensure Inter font files are loading from Google Fonts

### 6. Expected Results Summary
✅ **Timer digits**: Use `font-mono` (modern monospace, tabular-nums)  
✅ **All other text**: Use `font-sans` (Inter)  
✅ **No system fonts**: Inter should be the primary font everywhere  
✅ **Consistent appearance**: All pages should have the same modern Inter typography  

## If Issues Found
If any page shows system fonts or inconsistent typography:

1. **Check font loading**: Verify `@import` in `app/globals.css` is loading Inter
2. **Check Tailwind config**: Verify `fontFamily.sans` includes Inter as first option
3. **Check CSS specificity**: Ensure no inline styles or higher-specificity rules override font-sans
4. **Check component classes**: Look for missing `font-sans` or conflicting font classes
5. **List conflicting elements**: Note which elements/pages have issues for targeted fixes

## Quick Test Commands
```bash
# Start Next.js dev server
npm run dev

# Then visit:
# - http://localhost:3000 (homepage)
# - http://localhost:3000/countdown (timer example)
# - http://localhost:3000/timer-example (timer controls demo)

# For static HTML files, open directly:
# - open quick-countdown.html
# - open tabata.html
# - open emom.html
# - open amrap.html
```
