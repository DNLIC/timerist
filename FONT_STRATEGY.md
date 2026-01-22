# Timerist Font Strategy

## Goal
Consistent, readable, and performant typography across:
- Standalone static HTML timer files (quick-countdown.html, tabata.html, emom.html, etc.)
- Next.js landing page and any React components (using ShadCN + Tailwind)
- Future ports to React Native / Expo / Capacitor for App Store apps

## Chosen Fonts
- **Primary font (all body text, labels, buttons, headings, instructions, round counters, etc.)**: Inter  
  → Modern, highly legible variable sans-serif font optimized for screens and fitness app use cases  
  → Loaded via Google Fonts  
  → Mapped to Tailwind's `font-sans`

- **Secondary font (large timer digits / countdown / stopwatch display only)**: System monospace stack  
  → Ensures perfect numeral alignment (no width jumping when digits change 1→2, 8→9, etc.)  
  → Gives a clean, athletic, stopwatch-like appearance  
  → Mapped to Tailwind's `font-mono` (or explicit monospace classes where needed)

## Implementation Details

### Tailwind Configuration (tailwind.config.ts)
```ts
theme: {
  extend: {
    fontFamily: {
      sans: [
        '"Inter var"',
        'Inter',
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
  },
}
```

### CSS Global Styles (app/globals.css)
Inter is loaded via Google Fonts import at the top of the file:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap');
```

The base layer applies `font-sans` to the entire document:
```css
@layer base {
  html, body {
    @apply font-sans antialiased;
  }
}
```

### HTML Timer Files
Each standalone HTML timer file includes:
1. **Google Fonts link in `<head>`**:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
   ```

2. **CSS font-family declarations**:
   - Body text, labels, buttons: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
   - Timer digits: `font-family: 'Courier New', monospace;` (legacy) or `font-mono` class (preferred)

3. **Tailwind classes**:
   - `font-sans` for all non-timer text
   - `font-mono` for timer displays (with `tabular-nums` for perfect alignment)

### Timer Display Utilities
The `app/globals.css` includes a `.timer-display` utility class that combines monospace font with responsive sizing:
```css
.timer-display {
  @apply text-[var(--timer-size-desktop)] font-bold text-primary font-mono tabular-nums;
}
```

This ensures:
- Monospace font for perfect digit alignment
- `tabular-nums` for consistent character width
- Responsive sizing via CSS custom properties
- Bold weight for visibility

## Usage Guidelines

### When to Use Inter (`font-sans`)
- All body text and paragraphs
- Headings (h1, h2, h3, etc.)
- Button labels and UI controls
- Form inputs and labels
- Status labels (e.g., "Work", "Rest", "Round 1")
- Instructions and help text
- Navigation and links
- Round counters and metadata
- Any text that isn't a large timer display

### When to Use Monospace (`font-mono`)
- Large timer digit displays (countdown, stopwatch, interval timers)
- Any numeric display where alignment matters (e.g., split times)
- Always use with `tabular-nums` class for consistent digit width

### Examples
```html
<!-- Timer display - monospace -->
<div class="timer-display font-mono tabular-nums">00:30</div>

<!-- Status label - Inter -->
<span class="font-sans text-lg font-medium">Work</span>

<!-- Button - Inter -->
<button class="font-sans px-4 py-2">Start</button>

<!-- Round counter - Inter -->
<div class="font-sans text-sm">Round 3 of 8</div>
```

## Migration Path

### Current State (HTML Timers)
- ✅ Inter loaded via Google Fonts link tag
- ✅ Font-family declarations in inline styles
- ⚠️ Some legacy `'Courier New'` monospace references (should migrate to `font-mono`)

### Next.js / React Components
- ✅ Inter imported in `app/globals.css`
- ✅ Tailwind config extends font families
- ✅ Base styles apply `font-sans` globally
- ✅ ShadCN components inherit Inter via Tailwind

### Future Mobile Apps (React Native / Expo)
1. **Inter Font Installation**:
   - Use `expo-font` to load Inter from Google Fonts or local assets
   - Or use `@expo-google-fonts/inter` package
   - Configure in `app.json` or `expo.json`

2. **Monospace Font**:
   - Use system monospace fonts (SF Mono on iOS, Roboto Mono on Android)
   - Or bundle a monospace font if custom styling needed

3. **Styling Consistency**:
   - Use NativeWind (Tailwind for React Native) to maintain class-based styling
   - Map `font-sans` → Inter, `font-mono` → system monospace
   - Export design tokens from CSS variables for cross-platform use

## Performance Considerations

### Font Loading
- **Google Fonts**: Uses `display=swap` to prevent FOIT (Flash of Invisible Text)
- **Variable Font**: Inter variable font reduces file size vs. multiple static weights
- **Preconnect**: Consider adding `<link rel="preconnect" href="https://fonts.googleapis.com">` for faster loading

### Optimization
- For production, consider self-hosting Inter font files
- Use `font-display: swap` in CSS for better performance
- Preload critical font weights if needed

## Verification

See `FONT_VERIFICATION_CHECKLIST.md` for detailed testing steps to verify Inter is properly applied across all timer files and components.

## Design Tokens

Font-related design tokens are defined in `app/globals.css`:
- Timer display sizes: `--timer-size-mobile`, `--timer-size-tablet`, `--timer-size-desktop`
- Typography spacing: `--spacing-xs` through `--spacing-xl`
- Transitions: `--transition-fast`, `--transition-normal`, `--transition-slow`

These tokens can be exported as JSON for use in mobile apps and design systems.
