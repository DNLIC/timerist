# Timerist Audio & Sound Rules

**Purpose:** Rules and conventions for audio, sound settings, and feedback across all timers. Use **amrap.html** and **amrap-splits.html** as the reference implementations when rolling out sound to other timers (HIIT, Tabata, EMOM, Interval, Countdown, Stopwatch, etc.).

---

## 1. Reference Files

| File | Role |
|------|------|
| **amrap.html** | AMRAP timer with full audio: tones, voice, haptics, iOS banner, reminders, localStorage, import triggers unlock |
| **amrap-splits.html** | Same as above + export/import of audio preferences in workout JSON |
| **countdown.html** | Countdown timer with full audio; includes iOS voice priming (§6.3) |
| **preset-countdown.html** | Preset countdown with full audio; includes iOS voice priming (§6.3) |
| **interval.html** | Preset interval timer with full audio; Tabata preset (20s work, 10s rest, 8 rounds); prep phase, 3-2-1 at work/rest, work cues on every round (§14) |
| **emom.html** | EMOM (Every Minute On the Minute) timer with full audio; prep phase, work cues on every round, 3-2-1 at end of each minute, no rest phase, reminder section when total duration &gt; 0 (§14.6) |

When adding or changing audio behavior, keep amrap.html and amrap-splits.html in sync and use them as the source of truth. For countdown-style timers, use countdown.html and preset-countdown.html as reference. For interval/work-rest timers (including Tabata), use **interval.html** as reference. For every-minute style timers with no rest phase (EMOM), use **emom.html** as reference.

---

## 2. Audio Rules (Behavior)

### 2.1 When to Play Sound

- **Never** play any sound before the user has unlocked the audio context (see §4 iOS).
- **Always** guard tone/voice/haptic with the corresponding settings: `enableTones`, `enableVoice`, `enableHaptic` (and `audioStarted` for tones).
- **Tone.js:** Use only after `ensureToneStarted()` / `unlockAudioForIOS()` has resolved (or `audioStarted === true`).
- **Fallback:** If Tone.js is missing or fails, use the inline `playSound()` (Web Audio API oscillator) for critical cues (e.g. round completed beep); optional per timer.

### 2.2 Guard Pattern for Tones

Before every Tone-based cue, use the same guard:

```js
if (!enableTonesEl || !enableTonesEl.checked || !audioStarted || typeof Tone === 'undefined') return;
```

Apply this in: `playBeepShort`, `playWorkStartChime`, `playRestStartTone`, `playWorkoutCompleteFanfare`, `playThreeBeeps`, `playDoubleBeep`, and any timer-tick or transition logic that triggers these.

### 2.3 Guard Pattern for Voice

```js
if (!enableVoiceEl || !enableVoiceEl.checked || !text) return;
```

Use in `speak(text)`. Cancel any in-progress utterance before speaking a new one (`speechSynthesis.cancel()`).

### 2.4 Guard Pattern for Haptics

```js
if (!enableHapticEl || !enableHapticEl.checked) return;
```

Use at the start of `triggerHaptic(style)`.

### 2.5 Standard Sound Events (map per timer type)

| Event | Tones | Voice | Haptic |
|-------|--------|-------|--------|
| Prep countdown (3, 2, 1) | `playBeepShort` | optional count | — |
| Work start | `playWorkStartChime` | "Work" | short |
| Rest start | `playRestStartTone` | "Rest" | double |
| Completion | `playWorkoutCompleteFanfare` + `playThreeBeeps` | completion message | complete |
| Pause | — | "Pause" | long |
| Resume | `playBeepShort` | "Resume" | short |
| Round/segment completed (e.g. Round Completed button) | `playSound()` or `playBeepShort` | — | optional |
| Reminder (½ point, 2 min, 1 min) | `playDoubleBeep` | reminder message | double |

Not every timer has all events; implement only what applies (e.g. no “Rest” on a simple countdown).

### 2.6 Tone.js Script Tag

Include once in `<head>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>
```

### 2.7 Fallback `playSound()` (Web Audio API)

Use when Tone.js is unavailable or for a single beep without Tone:

```js
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) { /* ignore */ }
}
```

Use sparingly; prefer Tone.js for consistency.

---

## 3. Sound Settings Preferences (Settings Panel)

### 3.1 Section Markup

In the timer setup **bottom sheet**, include a section **“Audio & Feedback”** with this structure:

```html
<div class="sheet-section">
    <h3>Audio &amp; Feedback</h3>
    <label><input type="checkbox" id="enableTones" checked> Enable Audio Cues (tones)</label><br>
    <label><input type="checkbox" id="enableVoice" checked> Enable Audio Cues (voice)</label><br>
    <label><input type="checkbox" id="enableHaptic" checked> Enable Haptics (where supported)</label>
    <!-- Optional: reminder subsection for timers with duration (AMRAP, etc.) -->
    <p class="text-xs text-[rgb(var(--muted-foreground))] mt-2">After you set workout duration above, choose when to hear an audible reminder.</p>
    <div id="reminderSection" style="display: none;" class="mt-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--muted-foreground))] mb-2">Audible reminders</p>
        <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="reminderMinutesRemain" aria-label="1/2 workout point"> 1/2 Workout Point <span id="reminderHalfwayText" class="text-[rgb(var(--muted-foreground))]">— alerts at — min remaining</span></label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="reminder2Min" aria-label="2 minutes remain"> 2 Minutes Remain</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="reminder1Min" aria-label="1 minute remains"> 1 Minute Remains</label>
        </div>
    </div>
</div>
```

- **enableTones** – Tone.js beeps/chimes.
- **enableVoice** – Web Speech (spoken cues).
- **enableHaptic** – Vibration / iOS haptic workaround.
- **reminderSection** – Shown only when the timer has a total duration &gt; 0 (e.g. AMRAP total time). Update `reminderHalfwayText` when duration changes (e.g. “— alerts at 5 min remaining”).

### 3.2 localStorage Keys and Defaults

| Key | Type | Default | Used by |
|-----|------|---------|--------|
| `enableTones` | boolean (string) | `true` (`!== 'false'`) | All timers with tones |
| `enableVoice` | boolean (string) | `true` (`!== 'false'`) | All timers with voice |
| `enableHaptic` | boolean (string) | `true` (`!== 'false'`) | All timers with haptics |
| `reminderMinutesRemain` | boolean (string) | `false` (`=== 'true'`) | AMRAP-style timers |
| `reminder2Min` | boolean (string) | `false` (`=== 'true'`) | AMRAP-style timers |
| `reminder1Min` | boolean (string) | `false` (`=== 'true'`) | AMRAP-style timers |

**Load on init:**

```js
if (enableTonesEl) { try { enableTonesEl.checked = localStorage.getItem('enableTones') !== 'false'; } catch (e) {} }
if (enableVoiceEl) { try { enableVoiceEl.checked = localStorage.getItem('enableVoice') !== 'false'; } catch (e) {} }
if (enableHapticEl) { try { enableHapticEl.checked = localStorage.getItem('enableHaptic') !== 'false'; } catch (e) {} }
// Reminders (opt-in)
if (reminderMinutesRemainEl) { try { reminderMinutesRemainEl.checked = localStorage.getItem('reminderMinutesRemain') === 'true'; } catch (e) {} }
if (reminder2MinEl) { try { reminder2MinEl.checked = localStorage.getItem('reminder2Min') === 'true'; } catch (e) {} }
if (reminder1MinEl) { try { reminder1MinEl.checked = localStorage.getItem('reminder1Min') === 'true'; } catch (e) {} }
```

**Persist on change:** attach `change` listeners that `localStorage.setItem(key, element.checked)` (wrap in try/catch).

### 3.3 Disabling During Run

When the timer is running or paused, disable the **Audio & Feedback**, **Reminder**, and **all other setup inputs** (including prep countdown, work/rest times, rounds, etc.) so the user cannot change them mid-session. Re-enable when the timer is cleared or reset to setup state.

---

## 4. iOS Sound Banner and Unlock

### 4.1 Why

iOS Safari (and WebView) require a **user gesture** to start `AudioContext` / `Tone.context`. Until then, sounds will not play. The banner asks the user to tap “Enable Sound” (unlock) or “Silent” (dismiss and continue without sound).

### 4.2 Banner Markup

Place the banner **above** the main control buttons, inside the same container as the timer display:

```html
<!-- iOS: enable sound or dismiss (shown until audio unlocked or user chooses Silent) -->
<div id="iosSoundBanner" class="p-3 rounded-xl bg-[rgb(var(--accent))] border border-[rgb(var(--border))] mb-3 text-center hidden" role="region" aria-label="Enable sound">
    <p class="text-sm font-medium text-[rgb(var(--foreground))] mb-2 m-0">On iPhone/iPad, tap below to enable sound before starting.</p>
    <div class="ios-sound-banner-buttons">
        <button type="button" class="control-btn btn-primary" id="iosUnlockSoundBtn" aria-label="Enable sound">Enable Sound</button>
        <button type="button" class="control-btn btn-secondary" id="iosSilentBtn" aria-label="Silent – do not enable sound">Silent</button>
    </div>
</div>
```

### 4.3 Banner CSS

Reuse the same layout as other control buttons (e.g. Set Up / Clear):

```css
.ios-sound-banner-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
}
.ios-sound-banner-buttons .control-btn {
    flex: 1 1 0;
    min-width: 0;
}
@media (min-width: 390px) { .ios-sound-banner-buttons { gap: 0.75rem; } }
@media (min-width: 640px) { .ios-sound-banner-buttons { gap: 1rem; } }
```

### 4.4 Visibility Logic

- **Show banner:** Only on iOS when `!audioStarted`. Use a small detector: `function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; }`
- On load, if `isIOS()` and `!audioStarted`: remove `hidden` and set `iosSoundBanner.style.display = ''`.
- **Hide banner:** When `audioStarted` becomes true (after successful unlock), or when user taps “Silent” (dismiss only; do not set `audioStarted`).

### 4.5 Unlock and Dismiss

- **Enable Sound button:** Call `unlockAudioForIOS()`. That should: hide banner, resume Tone.context if suspended, call `Tone.start()`, set `audioStarted = true`, optionally play one short beep if tones enabled, call `primeSpeechForIOS()` for voice (see §6.3), then update UI.
- **Silent button:** Call `dismissIOSSoundBannerSilent()`: add `hidden` and `display: none` to the banner. Do **not** set `audioStarted = true`, so no sounds will play until the user unlocks on a later gesture (e.g. Import).

### 4.6 When to Call Unlock (user gesture)

- “Enable Sound” button click.
- **Start** button click: call `ensureToneStarted()` (or equivalent) before starting the tick; if that resolves, then play start cues. On iOS, the first Start tap can unlock if you use Tone.start() inside that gesture.
- **Import workout:** After applying the imported workout, call `unlockAudioForIOS()` so that the file-picker gesture is used to unlock audio (as in amrap.html / amrap-splits.html).

### 4.7 ensureToneStarted vs unlockAudioForIOS

- **ensureToneStarted()** – Idempotent; if already started or Tone missing, resolve immediately. Otherwise call `Tone.start()`, set `audioStarted = true`, hide iOS banner. Use this on **Start** / **Resume** before playing any tone.
- **unlockAudioForIOS()** – Explicit unlock from “Enable Sound” or Import; hide banner, resume context, `Tone.start()`, set `audioStarted = true`, optionally play a short beep, call `primeSpeechForIOS()`. Use on button click or after file import.

---

## 5. Haptics

### 5.1 Hidden Toggle (iOS Safari Workaround)

iOS Safari does not support `navigator.vibrate`. Haptics are faked by toggling a hidden checkbox so the system plays selection haptics. Add once per page (e.g. inside the sheet or at end of body):

```html
<div class="hidden"><input type="checkbox" id="haptic-switch" switch><label for="haptic-switch" id="haptic-label"></label></div>
```

Keep it in the DOM but not visible.

### 5.2 triggerHaptic(style)

- **short** – Single light tap (round complete, resume).
- **double** – Two quick taps (rest start, reminders).
- **long** – Longer buzz (pause).
- **complete** – Multi-pulse (workout complete).

Implementation: if iOS + Safari, toggle the hidden checkbox (and label click) in a pattern; else use `navigator.vibrate` with appropriate patterns (e.g. 50, [50,30,50], 150, [100,50,100,50,100]).

### 5.3 Respect enableHaptic

All haptic triggers must check `enableHapticEl.checked` before running.

---

## 6. Voice (Web Speech API)

### 6.1 Default Voice

Prefer **Samantha** (en-US) if available; otherwise first en-US voice. Load voices in `speechSynthesis.getVoices()` and on `voiceschanged`.

### 6.2 speak(text)

- Check `enableVoiceEl && enableVoiceEl.checked` and `text`.
- Cancel any current utterance: `speechSynthesis.cancel()`.
- Use `SpeechSynthesisUtterance` with rate ~1.1, pitch 1.0, volume 1.0.
- Delay voice slightly after tones (e.g. 800 ms) so the beep is heard first.

### 6.3 iOS Voice Priming (Required for Mobile Safari)

**Problem:** iOS Safari requires the first `speechSynthesis.speak()` call to happen **during a user gesture**. If voice is only triggered from `setTimeout` or `setInterval` (e.g. 800 ms after Start), the utterance is silently blocked and no speech plays—even though tones work. No error is reported.

**Solution:** Call `primeSpeechForIOS()` during a user gesture to “prime” the speech synthesis. This plays an empty utterance immediately, which enables subsequent utterances from timeouts/intervals for the rest of the session.

**Implementation:**

```js
let speechPrimed = false;
function primeSpeechForIOS() {
    if (speechPrimed || !enableVoiceEl || !enableVoiceEl.checked) return;
    try {
        speechSynth.cancel();
        speechSynth.speak(new SpeechSynthesisUtterance(''));
        speechPrimed = true;
    } catch (e) {}
}
```

**When to call (during user gesture):**

- **unlockAudioForIOS()** – When user taps “Enable Sound” on the iOS banner.
- **Start button / Start action** – When user taps Start (e.g. at start of `toggleStartPause` or equivalent).
- **Preset tap** – When user taps a preset button to start (e.g. at start of preset click handler, before any `setTimeout`).
- **Resume/Pause button** – When user taps the main play/pause control.

Call `primeSpeechForIOS()` at the **beginning** of these handlers (synchronously, before any async or `setTimeout`), so it runs within the user gesture context. Reference: **countdown.html**, **preset-countdown.html**.

---

## 7. Reminder Section (Duration-Based Timers)

- **Visibility:** Show `#reminderSection` only when the timer has a total duration &gt; 0 (e.g. AMRAP total time). Update when duration input changes.
- **reminderHalfwayText:** Set to “— alerts at X min remaining” where X = half of total duration in minutes (rounded); update when duration changes.
- **Tick logic:** When `currentTime === halfSec` (½ point), or `120`, or `60`, and the corresponding reminder checkbox is checked, play reminder (double beep + voice + haptic double). Play each reminder at most once per run.

---

## 8. Workout / Export–Import JSON

### 8.1 Audio Fields in Workout Object

For timers that export/import workout config (e.g. AMRAP-Splits), include in the **workout** object:

| Field | Type | Description |
|-------|------|-------------|
| `enableTones` | boolean | Whether tones are enabled |
| `enableVoice` | boolean | Whether voice is enabled |
| `enableHaptic` | boolean | Whether haptics are enabled |

Optional for future: `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` (boolean) so reminders travel with the workout.

### 8.2 Export

When building the payload, set:

```js
enableTones: !!(enableTonesEl && enableTonesEl.checked),
enableVoice: !!(enableVoiceEl && enableVoiceEl.checked),
enableHaptic: !!(enableHapticEl && enableHapticEl.checked)
```

### 8.3 Import

When applying an imported workout, after filling form fields and updating state:

```js
if (enableTonesEl != null && w.enableTones !== undefined) enableTonesEl.checked = !!w.enableTones;
if (enableVoiceEl != null && w.enableVoice !== undefined) enableVoiceEl.checked = !!w.enableVoice;
if (enableHapticEl != null && w.enableHaptic !== undefined) enableHapticEl.checked = !!w.enableHaptic;
```

Then call `unlockAudioForIOS()` so the file-picker user gesture is used to unlock audio on iOS.

### 8.4 Backward Compatibility

Older JSON files may not have `enableTones` / `enableVoice` / `enableHaptic`. Use `!== undefined` before applying so missing keys leave the current UI checkbox state unchanged.

---

## 9. iOS Permissions and Configuration

### 9.1 In-App (Web)

- **No special permission prompts** are required for Web Audio or Speech in Safari; the only requirement is **user gesture** to start the context (hence the iOS banner and unlock on Start/Import).
- Microphone is **not** used; no need to request microphone permission.

### 9.2 PWA / WKWebView / Native Wrapper

- If the app is installed as a **PWA** or run in a **WKWebView** (e.g. Cordova, Capacitor, Expo WebView):
  - Audio playback follows the same rules as Safari (user gesture to start).
  - **Info.plist (iOS):** No audio-specific keys are required for playback. If you add background audio later, you would add `UIBackgroundModes` with `audio` and document the use case.
  - **version.json / app config:** `public/version.json` is for build/version display only. New sound settings are **not** stored in version.json; they live in localStorage and, where applicable, in workout export JSON.

### 9.3 Modified Settings Panels and New Fields

- When you add new **audio-related** settings (e.g. volume, reminder options), add:
  - **UI** in the “Audio & Feedback” section.
  - **localStorage** key and load/save in the same way as existing keys.
  - **Export/import** fields in workout JSON if the timer supports export/import.
- No change to **version.json** is required for new preferences; bump version when you ship features for user-facing clarity.

---

## 10. version.json and Build

- **public/version.json** holds `version`, `buildTime`, `buildDate` for display (e.g. “About” or footer). It does **not** hold audio preferences.
- New or modified **audio preferences** (checkboxes, reminder options) do **not** require new keys in version.json. They are stored in localStorage and optionally in workout JSON.

---

## 11. Rollout Checklist for Other Timers

Use this when adding sound to HIIT, Tabata, EMOM, Interval, Countdown, Stopwatch, etc.

- [ ] **Tone.js:** Add script tag in `<head>`.
- [ ] **Settings panel:** Add “Audio & Feedback” section with `enableTones`, `enableVoice`, `enableHaptic` (and reminder subsection if the timer has a total duration).
- [ ] **localStorage:** Load/save for each checkbox; disable section when timer is running/paused.
- [ ] **iOS banner:** Add `#iosSoundBanner` markup and `.ios-sound-banner-buttons` CSS; show only on iOS when `!audioStarted`; wire “Enable Sound” and “Silent”.
- [ ] **Unlock:** Implement `unlockAudioForIOS()` and `ensureToneStarted()`; call ensure/unlock on Start (and Import if applicable).
- [ ] **Hidden haptic switch:** Add `#haptic-switch` and `#haptic-label`; implement `triggerHaptic(style)` with iOS checkbox workaround and `navigator.vibrate` fallback.
- [ ] **Voice:** Implement `populateVoices()` and `speak(text)` with Samantha/en-US default; guard with `enableVoice`.
- [ ] **iOS voice priming:** Implement `primeSpeechForIOS()` and call it from unlock, Start, preset tap, and Resume/Pause handlers (see §6.3).
- [ ] **Tone helpers:** Implement `playBeepShort`, `playWorkStartChime`, `playRestStartTone`, `playWorkoutCompleteFanfare`, `playThreeBeeps`, `playDoubleBeep` (or subset) with the standard guard; add `playSound()` fallback if desired.
- [ ] **Map events:** For that timer type, trigger the right tone/voice/haptic at: start, pause, resume, work start, rest start, completion, round/segment, reminders (if applicable).
- [ ] **Reminder section:** If the timer has a total duration, show `#reminderSection` and update `reminderHalfwayText`; in tick, fire reminder at ½, 2 min, 1 min when checkboxes are set.
- [ ] **Export/import:** If the timer has workout export/import, add `enableTones`, `enableVoice`, `enableHaptic` to payload and apply on import; call `unlockAudioForIOS()` after import.
- [ ] **Testing:** Verify on iOS Safari: banner appears, “Enable Sound” unlocks and plays beep, “Silent” hides banner and no sound; Start after unlock plays cues; Import unlocks audio; **voice** plays (“Start”, “Pause”, “Resume”, completion message, reminders) after priming.

---

## 12. Summary Table: localStorage and JSON

| Setting | localStorage key | Default | In workout JSON (export/import) |
|---------|------------------|---------|----------------------------------|
| Tones | `enableTones` | true | `workout.enableTones` |
| Voice | `enableVoice` | true | `workout.enableVoice` |
| Haptics | `enableHaptic` | true | `workout.enableHaptic` |
| ½ point reminder | `reminderMinutesRemain` | false | optional |
| 2 min reminder | `reminder2Min` | false | optional |
| 1 min reminder | `reminder1Min` | false | optional |

Reference implementations: **amrap.html**, **amrap-splits.html**. Keep these two in sync when changing audio or settings behavior.

---

## 13. Layout: Exercise entry fields (vertical iPhone)

On a **vertical iPhone** (narrow viewport), the exercise list in the settings sheet must **fit within the visible space** without horizontal overflow. The name field should shrink so the **reps number** and **× remove button** stay visible; avoid truncation or overflow. This has been applied in **amrap.html** and **amrap-splits.html**; use the same pattern in any timer that has exercise entry rows (e.g. `#roundsExercisesList`, `#repsExercisesList`).

### 13.1 Principle

- **One row per exercise:** name (text) + reps (number, Rounds mode) + remove (×) button.
- **Name field:** Takes remaining space and **shrinks** on narrow screens (`flex: 1 1 0`, `min-width: 0`).
- **Number and button:** **Do not shrink** (`flex-shrink: 0`); fixed/min width so they stay visible and tappable.
- **Container:** `.exercise-item` has `min-width: 0` so the flex row can shrink within the sheet.

### 13.2 Required CSS

Use this pattern so the row fits on vertical iPhone without horizontal scroll or clipped controls:

```css
/* Exercise list styles – name field shrinks so number + × button stay visible (no truncation) */
.exercise-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 0.75rem;
    border: 1px solid rgb(var(--border));
    border-radius: var(--radius);
    background-color: rgb(var(--card));
    min-width: 0;
}

.exercise-item input[type="text"] {
    flex: 1 1 0;
    min-width: 0;
    padding: 0.5rem;
    border: 1px solid rgb(var(--input));
    border-radius: var(--radius);
    background-color: rgb(var(--background));
    color: rgb(var(--foreground));
    font-size: 0.875rem;
}

.exercise-item input[type="number"] {
    width: 80px;
    min-width: 80px;
    flex-shrink: 0;
    padding: 0.5rem;
    border: 1px solid rgb(var(--input));
    border-radius: var(--radius);
    background-color: rgb(var(--background));
    color: rgb(var(--foreground));
    font-size: 0.875rem;
    text-align: center;
}

.exercise-item button {
    flex-shrink: 0;
    padding: 0.5rem;
    border: none;
    background-color: rgb(var(--destructive));
    color: rgb(var(--destructive-foreground));
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    min-width: 32px;
}
```

### 13.3 Optional: Narrow viewport overrides

If you need tighter spacing on very narrow portrait (e.g. &lt; 390px), you can add:

- Reduce `.exercise-item` `gap` and/or `padding` (e.g. `gap: 0.35rem`, `padding: 0.5rem`).
- Slightly smaller `.exercise-item input[type="number"]` width (e.g. `width: 64px; min-width: 64px`) and smaller font-size if necessary.
- Keep **min-width: 0** on the text input and **flex-shrink: 0** on number and button so the row never overflows.

### 13.4 Sheet container

The list lives inside the bottom sheet (`.sheet-content`), which has `max-height: 85vh` and `overflow-y: auto`, so many exercises scroll vertically while each row stays within the visible width.

---

## 14. Interval Timer: Tabata Preset and Work/Rest Flow

For **interval-style timers** (work/rest rounds, e.g. Tabata 20s work / 10s rest × 8 rounds), use **interval.html** as the reference. The Tabata preset also appears in the HIIT timer as an option.

### 14.1 Prep Phase (Workout PREP Countdown)

- **Duration:** MM:SS format, 0–300 seconds (5 min), with slider and ±10s stepper.
- **Prep phase announcement:** User-configurable label (e.g. "Countdown", "Prepare", "Setup")—spoken at start and shown as phase label during prep.
- **Flow:** At start, speak the prep label; show countdown; play 3-2-1 beeps at last 3 seconds; transition to work with chime + "Work" + haptic short.
- **localStorage:** `preset-interval-prepTimeSeconds`, `preset-interval-prepPhaseLabel`.

### 14.2 3-2-1 Beeps Before Phase Transitions

Play `playBeepShort` (and haptic short) at 3, 2, 1 seconds remaining in:

- **Prep countdown** — before first work.
- **Work phase** — before transitioning to rest (or next round in EMOM).
- **Rest phase** — before transitioning to next work round (only when restTime &gt; 0).

### 14.3 Work Cues on Every Work Round

Play **work cues** (chime + voice "Work" + haptic short) on **every** work round start, not just the first:

- After prep countdown → first work.
- After rest → 2nd, 3rd, etc. work rounds.

Avoid only playing work cues on the first round; repeat them on each rest→work transition.

### 14.4 Rest Cues

Play `playRestStartTone` + voice "Rest" + haptic double when transitioning from work to rest.

### 14.5 Total Duration and Reminders

For interval timers with rounds: `totalDuration = totalRounds * workTime + (totalRounds - 1) * restTime`. Show reminder section when totalDuration &gt; 0; fire reminders at ½ point, 2 min, 1 min remaining based on elapsed time across rounds. **Do not fire reminders during prep phase**; only during the actual workout rounds.

### 14.6 EMOM (Every Minute On the Minute) – No Rest Phase

For timers with work-only rounds (no rest, e.g. EMOM):

- **Total duration:** `totalDuration = totalRounds * workTime` (no rest component).
- **Total remaining:** `elapsed = (currentRound - 1) * workTime + (workTime - currentTime)`; `totalRemaining = totalDuration - elapsed`.
- **No rest cues:** Omit `playRestStartTone`, voice "Rest", and rest haptics.
- **Work cues:** Play work cues (chime + "Work" + haptic short) on **every** round start—after prep, and at each minute transition.
- **3-2-1 beeps:** Play at end of each work period (e.g. last 3 seconds of each minute) before transitioning to the next round.
- **Prep phase:** Same as §14.1; optional prep countdown with customizable label. Use timer-specific localStorage keys (e.g. `emom-prepTimeSeconds`, `emom-prepPhaseLabel`).
- **Reference:** **emom.html**.
