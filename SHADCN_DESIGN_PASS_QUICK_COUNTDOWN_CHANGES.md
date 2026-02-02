# Shadcn Design Pass: Quick Countdown — Changes Made & Additions for Process Doc

This list captures everything we did during the shadcn design pass on **quick-countdown.html** and follow-up iterations. Use it to update **TIMER_SHADCN_DESIGN_APPLICATION.md** with items that were **not** already in the initial design pass document.

---

## Part 1: Full List of Changes We Made to Quick Countdown

### A. Initial shadcn design pass (aligned with TIMER_SHADCN_DESIGN_APPLICATION.md)

- **Viewport:** `maximum-scale=1.0, user-scalable=no`; Inter font (preconnect + link).
- **Layout:** Removed `timerist-design-system.css`; all styles in-page. Container `max-width: 28rem`, `padding-bottom: env(safe-area-inset-bottom, 1rem)`.
- **Header:** Fixed, `max-w-md`, border-bottom; logo uses `currentColor`; theme toggle + menu (☰).
- **Bottom sheet:** Replaced right drawer with `.sheet-overlay`, `.bottom-sheet`, `.sheet-grabber`, `.sheet-header`, `.sheet-content`, `.sheet-section`.
- **Inputs:** `.shadcn-input` / `.shadcn-textarea` — 16px font, 52px min-height, 2px border, 0.75rem radius, 3px focus ring.
- **Control buttons:** Min 56×56px (48px on narrow), 1rem radius, gray hover for Clear/Resume/Reset, paused state, touch-friendly.
- **Quick-select presets:** Pill chips (`.quick-select-btn`), 48px min-height, 2px border, grid 3 cols (2 on narrow), `.selected` = primary bg + shadow.
- **Timer display block:** Card, 1rem radius, cursor pointer, tap-highlight off.

### B. Follow-up iterations (beyond the initial doc)

1. **Trash button in sheet header** — Icon next to close (×); clears timer + resets all settings to defaults **with confirmation**.
2. **Double-tap on timer block opens sheet** — Single tap does nothing; **double-tap** (mouse `dblclick` + touch two taps within 400ms) opens the bottom sheet (to avoid accidental opens).
3. **Default timer name above time display** — Title row always visible: when idle and no custom title, show **"Quick Countdown"** (page name); when user has a workout title, show that.
4. **Larger preset button text** — Front-page preset chips use **1.125rem** font for readability.
5. **Title area when timer is active** — When timer is running, paused, or has a countdown set: **do not** show the default "Quick Countdown"; show only the user’s workout title if any, otherwise hide the title block.
6. **Clear button: no confirmation on main page** — Main page **Clear** clears timer and resets all settings **without** a confirmation dialog. Only settings-panel actions ask for confirmation.
7. **Settings-panel clear: with confirmation** — **Trash** icon and **"Clear All Settings"** button both: confirm (“Clear timer and reset all settings to defaults?”), then clear timer + reset settings (same behavior).
8. **"Clear All Settings" button in sheet** — Full-width destructive button in its own **sheet-section**, placed **just above "About This Timer"**, same confirm-then-clear behavior as the trash icon. CSS: `.btn-clear-all-settings` (52px min-height, destructive bg, hover/active states).

---

## Part 2: Items NOT in the Initial Design Pass Document (Add These)

These are the items that are **not** already spelled out in **TIMER_SHADCN_DESIGN_APPLICATION.md** and are good candidates to add to the process document.

| # | Item | Suggested addition for process doc |
|---|------|-------------------------------------|
| 1 | **Double-tap to open sheet** | For timers where the main content is the time display, consider **double-tap** on the timer block to open the settings sheet (not single tap): use `dblclick` for mouse and touch double-tap (e.g. two taps within 400ms) so the timer doesn’t open the sheet on every tap. |
| 2 | **Default timer name above time** | For timers **without** a Work/Rest phase label: show a **default timer name** (e.g. page name like “Quick Countdown”) **above** the time display when idle and no custom workout title; when the user has set a workout title, show that instead. |
| 3 | **Hide default name when timer is active** | When the timer is running, paused, or has a countdown set: **do not** show the default timer name in the title area. Show only the user’s workout title if present; otherwise hide the title block. |
| 4 | **Main page Clear: no confirm** | **Main page Clear** button: clear timer and reset all settings **without** a confirmation dialog. **Only** the settings-panel actions (trash icon and “Clear All Settings” button) should show a confirmation dialog (e.g. “Clear timer and reset all settings to defaults?”). |
| 5 | **Clear All Settings placement** | Place the **“Clear All Settings”** button in its own **sheet-section** **just above** the **“About This Timer”** section (same as quick-interval-iphone-shadcn). |
| 6 | **Preset chip / quick-select font size** | For preset or quick-select chips on the **main page** (e.g. countdown presets), use a **larger font size** (e.g. **1.125rem**) for better readability. |

---

## Part 3: Where These Could Go in TIMER_SHADCN_DESIGN_APPLICATION.md

- **Section 2 (Bottom sheet)** or **Section 10 (Timer display block):** Add a bullet for “double-tap on timer block to open sheet (optional per timer).”
- **Section 4 (Phase label / timer title)** or a new **“Timer name / title row”** note: Add bullets for “default timer name above time when idle” and “hide default name when timer is active; show only custom workout title or hide block.”
- **Section 3 (Clear buttons):** Add a bullet: “Main page Clear: no confirmation. Trash and Clear All Settings: show confirmation.” Add placement: “Clear All Settings in its own sheet-section just above About This Timer.”
- **Section 8 (Preset chips)** or **“Quick-select on main page”:** Add “Consider font-size 1.125rem or larger for preset/quick-select labels on the main page.”

---

*Generated from the quick-countdown shadcn design pass and follow-up iterations. Compare with TIMER_SHADCN_DESIGN_APPLICATION.md v1.0.*
