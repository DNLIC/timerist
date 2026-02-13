# Timer Shadcn/iPhone Design Application Guide

**Process name: Shadcn design pass.**  
*“We’re doing the shadcn design pass on [page] next.”* — One sweep across all timer pages: shadcn-style inputs, bottom sheet, and mobile-friendly UI.

This document captures the styling and interface changes applied when transforming **quick-interval.html** into **quick-interval-iphone-shadcn.html**. Use it as a checklist when applying the shadcn design pass to other active timer pages (e.g. quick-countdown, countdown, emom, tabata, hiit, mobility, amrap-splits, stopwatch, etc.).

**Reference files:**
- **Source (before):** `quick-interval.html`
- **Target (after):** `quick-interval-iphone-shadcn.html`

---

## 1. Viewport & Layout

| Item | Before (quick-interval) | After (iphone-shadcn) |
|------|-------------------------|------------------------|
| Viewport | `width=device-width, initial-scale=1.0` | Add `maximum-scale=1.0, user-scalable=no` for consistent mobile zoom |
| Container | `max-width: 1200px`, flexible | `max-width: 28rem` (mobile-first), `padding-bottom: env(safe-area-inset-bottom, 1rem)` |
| Layout | Side drawer (right slide), main + rounds + presets on page | **Bottom sheet** only; no presets/rounds on main page (all in sheet) |
| Header | Absolute `.header-top`, wide | **Keep left-justified** — do not change to fixed/centered (see §1.1) |

**Checklist:**
- [ ] Viewport meta includes `maximum-scale=1.0, user-scalable=no` (optional per product)
- [ ] Container uses `env(safe-area-inset-bottom)` for notched devices
- [ ] Settings panel is a **bottom sheet** (slides up from bottom), not a side drawer (unless page is desktop-first)
- [ ] **Header format:** Main page header remains **left-justified** per §1.1; do not inadvertently center it.

### 1.1 Main page header: left-justified (do not change)

**Reference files:** `interval.html`, `countdown.html` — use these as the source of truth for header layout.

The main page header (`.header-top`) must stay **left-justified**: logo and page title on the left, theme/setup buttons on the right. Do **not** convert it to a fixed, narrow, centered strip (e.g. `position: fixed` + `max-width: 28rem` + `margin: 0 auto`), which centers the header and breaks the expected layout.

**Required header pattern:**
- `position: absolute` (not fixed)
- `top: clamp(1rem, 3vw, 2rem)`; `left: 0`; `right: 0`
- `padding: 0 clamp(1rem, 3vw, 2rem)`
- `max-width: 1200px` (match container), `width: 100%`, `margin: 0 auto`
- `display: flex`; `justify-content: space-between`; `align-items: center`
- No background or border-bottom on the header bar (content flows underneath)
- `.header-top > div:first-child`: flex, left-aligned (logo + link + separator + page name)
- Media queries: at 390px use `padding: 0 0.75rem`; at 391px–428px use `padding: 0 1rem`; hide separator/site link on small screens as in interval/countdown

**Checklist (every shadcn design pass):**
- [ ] After any layout/header change, verify the main page header matches **interval.html** / **countdown.html**: left-justified, absolute, full content width (1200px max), not a narrow centered strip.

---

## 2. Settings Panel: Bottom Sheet (not Side Drawer)

| Item | Before | After |
|------|--------|--------|
| Panel | `.settings-drawer` right: -100% → 0, max-width 400px | `.bottom-sheet` translateY(100%) → 0, full width, max-height 85vh |
| Overlay | `.drawer-overlay` | `.sheet-overlay` (same role) |
| Open animation | `right: 0` | `transform: translateY(0)` |
| Grabber | None | `.sheet-grabber` (40×4px pill) at top of sheet |
| Content area | `.drawer-content` | `.sheet-content` with overflow-y: auto, safe-area padding |
| Section headings | `.drawer-section h3` (0.875rem, foreground) | `.sheet-section h3` (0.75rem, uppercase, muted-foreground) |

**Checklist:**
- [ ] Replace side drawer with bottom sheet (`.bottom-sheet`, `.sheet-overlay`, `.sheet-grabber`, `.sheet-header`, `.sheet-content`, `.sheet-section`)
- [ ] Sheet opens with `transform: translateY(0)` and `padding-bottom: env(safe-area-inset-bottom)`
- [ ] Sheet header has flex layout with title + actions (clear + close)

---

## 3. Clear Buttons in Settings Panel

| Item | Before | After |
|------|--------|--------|
| Header clear | Not present | **Header clear** button (trash icon) next to close; clears all settings to defaults |
| Full clear | Not present | **“Clear All Settings”** button in sheet content; same action, with confirm dialog |

**Checklist:**
- [ ] **Main page Clear button:** Clear timer and reset all settings **without** a confirmation dialog. Only settings-panel actions (trash + “Clear All Settings”) ask for confirmation.
- [ ] Add **header clear** button in sheet header (e.g. `#headerClearBtn`): icon-only, destructive color, `aria-label="Clear settings to defaults"`. On click: **confirm** then call same clear/reset logic as “Clear All Settings”.
- [ ] Add **“Clear All Settings”** button in sheet (e.g. `#clearAllSettingsBtn`): full-width, destructive background, label “Clear All Settings”. Place it in its own **sheet-section just above “About This Timer”**. On click: **confirm** then reset work/rest/rounds/presets/title/notes/countdown/completion message to defaults.
- [ ] Confirm dialog text (for trash and “Clear All Settings” only): e.g. “Clear timer and reset all settings to defaults?” or “Clear all settings? Work time, rest time, rounds, presets, title, notes, countdown, and completion message will be reset to defaults.”

---

## 4. Phase Label: Timer Title by Default (not “Work”)

| Item | Before | After |
|------|--------|--------|
| Initial phase label | Hardcoded “Work” in HTML | **Empty** in HTML; set by JS |
| When timer not running / invalid | — | Show the **page’s own timer title** in the phase label area |
| When timer running | “Work” / “Rest” | “Work” / “Rest” (or “Get ready” during countdown) |

**Clarification:** The default phase label text must come from **existing information on each page**—the name/title of that specific timer. Examples: **Stopwatch**, **Stopwatch Intervals**, **Tabata**, **Quick Interval**, etc. Do *not* use a generic phrase for all timers. In the quick-interval file only, the value used is “Interval Presets”; other pages should use their own title (e.g. “Stopwatch”, “Tabata”).

**Checklist:**
- [ ] Do **not** hardcode “Work” in `#phaseLabel`. Leave empty or set via script.
- [ ] Define a page-specific title (e.g. `TIMER_NAME` or equivalent) that matches **this page’s** timer: e.g. “Stopwatch”, “Tabata”, “Quick Interval”, “Interval Presets” (quick-interval), etc. Pull from existing page context (header text, page title, or a constant).
- [ ] In `updateDisplay()` (or equivalent):
  - **Countdown phase:** `phaseLabel.textContent = 'Get ready'`.
  - **Running (valid timer):** `phaseLabel.textContent = isWorkPhase ? 'Work' : 'Rest'`.
  - **Not running / invalid:** `phaseLabel.textContent = <this page’s timer title>`. So on load, the user sees that timer’s name; when they start, they see “Get ready” then “Work”/“Rest”.
- [ ] **Timers without Work/Rest phase label (e.g. simple countdown):** Show a **default timer name** (e.g. page name like “Quick Countdown”) **above** the time display when idle and no custom workout title; when the user has set a workout title, show that instead.
- [ ] **When timer is active (running, paused, or countdown set):** Do **not** show the default timer name in the title area. Show only the user’s workout title if present; otherwise hide the title block.

---

## 5. Workout Title & Notes Display + “Modified” Message

| Item | Before | After |
|------|--------|--------|
| Title/notes source | Only from inputs | Preset-aware: use preset title/description when a preset is selected and user hasn’t edited |
| User edit tracking | None | `userEditedTitle`, `userEditedDescription` (set true when user types in title/notes) |
| Preset application | Fill inputs only | Also set `appliedPresetWork`, `appliedPresetRest`, `appliedPresetRounds` when applying preset |
| Workout notes display | Raw description only | If preset selected and (work, rest, rounds) differ from applied preset, append “Modified: Xs work, Ys rest, Z rounds” to the displayed notes |

**When to apply:** Only for timers that have presets (work/rest/rounds or equivalent). Timers without presets (e.g. simple countdown, stopwatch) skip this section. The Modified message alerts participants when a preset was selected but the user then changed parameters so the displayed notes reflect the actual session.

**Checklist (timers with presets only):**
- [ ] Add `currentPresetKey`, `userEditedTitle`, `userEditedDescription`, `appliedPresetWork`, `appliedPresetRest`, `appliedPresetRounds` (or equivalent for the timer's parameters).
- [ ] When user types in title: set `userEditedTitle = true`. When user types in notes: set `userEditedDescription = true`.
- [ ] When applying a preset: set `currentPresetKey`, `appliedPresetWork/Round/Rounds`, and `userEditedTitle = false`, `userEditedDescription = false`.
- [ ] **Title for display:** If `userEditedTitle` use input value; else if preset selected use preset title; else use input value.
- [ ] **Notes for display:** If `userEditedDescription` use input value; else if preset selected use preset description, and **if current parameters differ from applied preset values**, append `\n\nModified: {work}s work, {rest}s rest, {rounds} round(s)` (implement `formatModifiedParams()`). Use singular "round" when rounds === 1.
- [ ] Call this “workout display” update whenever preset is applied, inputs change, or timer state changes so the main screen always shows the correct title and notes (with optional “Modified” line).

- [ ] **Timers without presets:** Skip this section; no "Modified" logic required.

---

## 6. Control Buttons (Start / Pause / Reset / Clear / Set Up)

| Item | Before | After |
|------|--------|--------|
| Size | padding 0.5rem 1rem, 0.875rem font | **Min 56×56px** (48px on small), padding 0.75rem 1.25rem, 1rem font |
| Border radius | 0.5rem | **1rem** (0.75rem on small) |
| Hover (primary/secondary) | rgba primary/secondary 0.9 | **Gray** for Set Up, Clear, Start, Pause, Reset: rgb(100,100,100) light; rgb(150,150,150) dark theme |
| Touch | — | `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation` |
| Small screens | Slightly smaller | `flex: 1 1 0`, `flex-wrap: nowrap`, so buttons share one row |

**Checklist:**
- [ ] Control buttons: min-height/min-width 56px (48px below 390px), border-radius 1rem (0.75rem on narrow).
- [ ] Set Up, Clear, Start, Pause, Reset: hover = dark gray (light mode) / light gray (dark mode), not primary color.
- [ ] Add touch-friendly styles: no tap highlight, `touch-action: manipulation`.

---

## 7. Inputs (Shadcn-Style: 16px, Touch-Friendly)

| Item | Before | After |
|------|--------|--------|
| Text/textarea | `.custom-time-input`, 1.125rem, 48px min-height, Courier | **.shadcn-input / .shadcn-textarea** (or same class): **font-size 16px** (avoids iOS zoom), padding 0.875rem 1rem, min-height **52px**, border 2px, border-radius **0.75rem**, inherit font |
| Focus | 2px ring | **3px** ring: `box-shadow: 0 0 0 3px rgba(var(--ring), 0.2)` |
| Time inputs | Steppers only | **Sliders** (work 0–600s, rest 0–300s, 52px height, 40px thumb) **plus** steppers (−10 / MM:SS / +10); `.time-slider-wrap`, `.time-stepper-row`, `.stepper-btn` |
| Stepper buttons | 44×44px | **56×56px** (64×64 for rounds), border-radius 1rem, `.stepper-btn` |
| Rounds | Separate rounds-adjust styling | Same stepper style; `.rounds-stepper` with larger +/- (64–72px) |
| Countdown input | Number input with spinners | **Hide spinners**: `.countdown-input-no-spinners` (webkit/moz) |

**Time data entry (minutes and seconds):** Use a **single combined MM:SS** control per duration, not separate “Minutes” and “Seconds” fields. Each duration (e.g. Work Time, Rest Time, or a single countdown “Time”) should have:
1. A **section label** (e.g. “Work Time (MM:SS)” or “Time (MM:SS)”).
2. A **slider** for coarse adjustment (e.g. 0–600s work, 0–300s rest, 0–3600s countdown; step 5; 52px height, ~40px thumb).
3. A **time-stepper row**: **−10** button | **MM:SS** text input | **+10** button. The −10/+10 adjust by 10 seconds; the central input displays and accepts MM:SS (e.g. `00:00`, `1:30`). Slider and input stay in sync (parse/format MM:SS in script).

**Thick sliders (use in Shadcn design pass wherever there is a time entry):** Use thick slider styling—not the browser default thin track. Apply: **Wrapper** `.time-slider-wrap`; **Track** 16px height, border-radius 8px, background `rgb(var(--input))` via `::-webkit-slider-runnable-track` and `::-moz-range-track`; range input `-webkit-appearance: none; appearance: none; background: transparent; height: 52px`; **Thumb** 40×40px circle, primary fill, 3px card border, shadow (`::-webkit-slider-thumb` with `margin-top: -12px`, and `::-moz-range-thumb`). Reference: `amrap.html` for the full `.time-slider-wrap` block.

**Checklist:**
- [ ] All main inputs: at least **16px** font-size, **52px** min-height where applicable, 2px border, 0.75rem radius, focus ring 3px.
- [ ] **Time entry:** One **MM:SS** control per duration (slider + −10 / MM:SS input / +10). **Do not** use separate “Minutes” and “Seconds” inputs.
- [ ] **Use thick sliders** for every time-entry slider: 16px track, 40px thumb, custom track/thumb CSS. Do not use default thin range inputs. See **Thick sliders** note below.
- [ ] Work/rest: add sliders + stepper row; stepper buttons 56px+, rounded.
- [ ] Rounds: large stepper (64–72px), same visual language.
- [ ] Countdown: use class to hide number input spinners.
- [ ] Labels: 0.75rem, uppercase, muted-foreground; section h3: 0.75rem, uppercase, muted.

---

## 8. Preset Chips (Workout & Time Presets)

| Item | Before | After |
|------|--------|--------|
| Layout | Grid on main page + in drawer | **Only in bottom sheet**; no presets on main page |
| Style | `.quick-select-btn` primary or card, rectangular | **.preset-chip**: pill (`border-radius: 9999px`), **card background**, 2px border, min-height 48px |
| Grid | 2–5 columns by breakpoint | **Workout:** 2 columns (`.preset-grid-workout`). **Time:** 3 columns (2 on narrow) `.preset-grid-time`; use `minmax(0, 1fr)` to avoid overflow |
| Selected | .selected font-weight | `.preset-chip.selected`: primary bg, primary-foreground, primary border, font-weight 600, box-shadow |
| Hover | Gray (card) or primary | **Accent** background (not primary) |

**Checklist:**
- [ ] Preset controls live only in the bottom sheet (or as per product: main page can have a short list, but sheet has full grid).
- [ ] Preset chips: pill shape, card bg, border, 48px min-height; selected = primary bg + border + shadow.
- [ ] For preset or quick-select chips on the **main page** (e.g. countdown presets): use **font-size 1.125rem or larger** for better readability.
- [ ] Workout presets grid: 2 columns; time presets: 3 columns (2 on narrow).
- [ ] Chips use `data-preset-key`, `data-work`, `data-rest`, `data-rounds`, `data-title`, `data-description` and sync with dropdown.

---

## 9. Workout Select Dropdown

| Item | Before | After |
|------|--------|--------|
| Size | min-height 2.5rem, 0.875rem font | **52px** min-height, **16px** font |
| Border | 1px | **2px** |
| Radius | var(--radius) | **0.75rem** |
| Arrow (dark mode) | Same SVG | **Separate SVG** with white stroke for dark theme (`[data-theme="style1"] .workout-select` background-image) |

**Checklist:**
- [ ] Dropdown: 52px min-height, 16px font, 2px border, 0.75rem radius.
- [ ] Dark mode: dropdown arrow uses white stroke so it’s visible on dark background.

---

## 10. Timer Display Block

| Item | Before | After |
|------|--------|--------|
| Wrapper | Card, rounded-lg | **Explicit** card bg, 1px border, **1rem** border-radius, box-shadow, **cursor: pointer** (tap to open sheet), tap-highlight off, user-select none |
| Click target | — | **Whole block** opens settings (drawer/sheet) when tapped |
| Title/description | Optional | **#workoutTitleDisplay**, **#workoutDescriptionDisplay** (hidden when empty); description shows preset text + optional “Modified” line |

**Checklist:**
- [ ] Timer display block: card style, 1rem radius, clickable; tap/click opens settings sheet.
- [ ] **Optional (to avoid accidental opens):** For timers where the main content is the time display, use **double-tap** on the timer block to open the settings sheet (not single tap): use `dblclick` for mouse and touch double-tap (e.g. two taps within 400ms) so the sheet doesn’t open on every tap.
- [ ] Workout title and workout notes sections: show when present; notes area shows preset description + “Modified: …” when params changed.

---

## 11. Theme / Dark Mode

| Item | Before | After |
|------|--------|--------|
| Script | External `scripts/dark-mode-toggle.js` | **Inline** theme script: `timerist-theme` localStorage, `style1` = dark, apply on load and on system preference change |
| Toggle | Same | Same: `window.toggleTheme`, then logo + icon update |
| Logo | Inline stroke color | **currentColor** on SVG; JS sets stroke to light/dark so logo matches theme |

**Checklist:**
- [ ] Theme key `timerist-theme`; value `style1` = dark. Apply on load; listen to `prefers-color-scheme` if no saved theme.
- [ ] Logo uses `currentColor` or JS-updated stroke so it’s visible in both themes.
- [ ] Theme icon (e.g. 🌙/☀️) updates when theme changes.

---

## 12. Miscellaneous

| Item | Before | After |
|------|--------|--------|
| External CSS | `styles/timerist-design-system.css` | **No** external design system CSS; all in-page (or single shared shadcn-style file if you add one) |
| Rounds on main page | quick-interval has rounds + presets on main page | iphone-shadcn: **no** main-page rounds or presets; everything in sheet |
| Sliders | None | Work 0–600s, rest 0–300s, step 5; sync with MM:SS inputs |
| Version/release | In drawer | Same; e.g. “Version: v0.17 · {date}” in sheet footer |
| Done message save | “completed” typo in one place | Save as “Completed” when empty (capital C) |

**Checklist:**
- [ ] Remove or replace dependency on external design-system CSS if going self-contained.
- [ ] If design is mobile-first, consider moving rounds and presets into the sheet only.
- [ ] Work/rest sliders sync with MM:SS; steppers and inputs sync with each other and with `workTime`/`restTime`.
- [ ] Done message default “Completed” (capital C) when saving empty.

---

## 13. Page-Specific Behavior (Quick Interval)

These may or may not apply to other timers; adapt as needed.

- [ ] **EMOM / zero rest:** Allow rest = 0 when preset is EMOM or custom; `hasValidTimerData()` treats as valid; in `tick()`, when rest is 0 skip rest phase and go straight to next round.
- [ ] **loadQuickPreset:** When switching to “custom”, set `currentPresetKey = null` and update workout display.
- [ ] **clearTimer:** Clear title/notes, preset selection, set `currentPresetKey = null`, `userEditedTitle = false`, `userEditedDescription = false`.

---

## 14. Active Timer Pages to Update (Shadcn Design Pass)

Use this list and the checklists above when doing the **shadcn design pass** on each timer; apply the same design and behaviors where they make sense.

**Presets vs no presets:** For the “Modified” message (Section 5), only timers that have **presets** (e.g. work/rest/rounds presets) need that logic. Timers with no presets skip Section 5’s preset/Modified behavior.

| Page | Has presets? | Section 5 (Modified message) |
|------|--------------|------------------------------|
| quick-interval.html | Yes (work/rest/rounds presets) | Apply |
| quick-countdown.html | Yes (time presets) | Apply if preset params can be modified after selection |
| countdown.html | Varies | Apply if page has presets with modifiable params |
| emom-splits / emom | Often yes | Apply if presets exist |
| tabata.html | Often yes | Apply if presets exist |
| hiit.html | Often yes | Apply if presets exist |
| mobility.html | Often yes | Apply if presets exist |
| amrap-splits.html | Varies | Apply if presets exist |
| stopwatch.html | Typically no | N/A — skip Modified logic |

- [ ] quick-interval.html (reference: already has a shadcn variant)
- [ ] quick-countdown (e.g. __quick-countdown.html or main quick-countdown page)
- [ ] countdown.html
- [ ] emom-splits.html / emom-style pages
- [ ] tabata.html
- [ ] hiit.html
- [ ] mobility.html
- [ ] amrap-splits.html
- [ ] stopwatch.html
- [ ] Other: _______________

---

## Blog / Article Page Hero Section (Timerist Blog Posts)

Use this pattern for **blog-style article pages** (e.g. EMOM Timer guide, Tabata guide, HIIT guide). Reference: [shadcn-ui Theme Explorer](https://shadcn-ui-theme-explorer.vercel.app/default) (“Why so bland?” / “Color the web with beautifully designed themes”). Implemented in **emom-timer-about.html**; the hero block is wrapped in `<!-- ========== HERO SECTION ... ========== -->` comments so it can be copied to other timer article pages.

### 1. Headline

- **Purpose:** Large, impactful title (e.g. “Master Every Minute: The EMOM Timer Guide”).
- **Class:** `.hero-headline`
- **Font weight:** 900 (black). Use Inter 800/900 from Google Fonts.
- **Gradient:** Vertical, **darker at top → lighter at bottom** (debossed look). Light mode: black → charcoal; dark mode: white → light gray.
- **Size:** Responsive — `text-5xl sm:text-6xl md:text-7xl`, `tracking-tight`, `leading-tight`.
- **CSS (in page or shared styles):**
  - Light: `background: linear-gradient(180deg, rgb(0 0 0) 0%, rgb(24 24 27) 35%, rgb(63 63 70) 100%);`
  - Dark: `background: linear-gradient(180deg, rgb(250 250 250) 0%, rgb(212 212 216) 40%, rgb(161 161 170) 100%);`
  - Plus: `-webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent;`

### 2. Subhead

- **Purpose:** Tagline under the headline (e.g. “Build unbreakable endurance and efficiency — one timed minute at a time.”).
- **Class:** `.hero-subhead`
- **Font weight:** 800 (extrabold) — matches Theme Explorer subhead.
- **Gradient:** Horizontal, **light at left → dark at right** (same direction as reference).
  - Light: `linear-gradient(90deg, rgb(148 163 184) 0%, rgb(100 116 139) 25%, rgb(51 65 85) 50%, rgb(30 41 59) 85%, rgb(15 23 42) 100%);`
  - Dark: `linear-gradient(90deg, rgb(248 250 252) 0%, rgb(203 213 225) 35%, rgb(148 163 184) 65%, rgb(71 85 105) 100%);`
- **Size:** `text-xl sm:text-2xl md:text-3xl`, `leading-relaxed`, `max-w-3xl mx-auto`. Letter-spacing: `-0.02em`.
- Same `background-clip: text` / `color: transparent` pattern as headline.

### 3. Metadata / credit line

- **Purpose:** Credit and contact under the subhead (e.g. “Brought to you by Timerist • Questions or suggestions? Reach out at …”).
- **Style:** Matches reference “Inspired by @peduarte work on Raycast Theme Explorer…” block.
- **Classes:** `text-base leading-7 text-muted-foreground text-center max-w-2xl mx-auto`, with `mt-6` for spacing below subhead.
- **Size:** Base (16px), not small — use `text-base`, not `text-sm`.

**Checklist for each new blog post:**

- [ ] Headline uses `.hero-headline` (weight 900, vertical gradient darker→lighter).
- [ ] Subhead uses `.hero-subhead` (weight 800, horizontal gradient light→dark left to right).
- [ ] Metadata/credit line uses `text-base leading-7 text-muted-foreground` (and optional `max-w-2xl mx-auto`).
- [ ] Hero block is inside `<!-- ========== HERO SECTION ... ========== -->` so it can be reused; only headline and subhead copy change per page.

---

## Quick Reference: Class Names Mapping

| quick-interval (old) | quick-interval-iphone-shadcn (new) |
|----------------------|-------------------------------------|
| .drawer-overlay | .sheet-overlay |
| .settings-drawer | .bottom-sheet |
| .drawer-header | .sheet-header |
| .drawer-content | .sheet-content |
| .drawer-section | .sheet-section |
| .drawer-close | .drawer-close (same; in .sheet-header) |
| .time-adjust-btn | .stepper-btn (in .time-stepper-row) |
| .quick-select-btn (primary/card) | .preset-chip.quick-select-btn |
| .custom-time-input (small) | .custom-time-input + .shadcn-input (16px, 52px) |
| — | .time-slider-wrap, .time-stepper-row, .rounds-stepper |
| — | .header-clear-btn, .btn-clear-all-settings |

**Header (do not change):** Main page `.header-top` must stay **left-justified** (position absolute, max-width 1200px, padding clamp(1rem, 3vw, 2rem)). Reference: **interval.html**, **countdown.html**. Do not use fixed + narrow max-width (e.g. 28rem) which centers the header.

---

*Document version: 1.5. Section "Blog / Article Page Hero Section": headline, subhead, metadata line; reference emom-timer-about.html. v1.4: Section 1.1: Main page header must remain left-justified; reference interval.html and countdown.html; checklist to verify header format after any layout change. v1.3: Section 5 “Modified” message; Section 14 presets table. v1.2: Time data entry: single MM:SS control per duration. v1.1: quick-countdown pass. Use interval.html, countdown.html, quick-interval.html, and quick-countdown.html as references.*
