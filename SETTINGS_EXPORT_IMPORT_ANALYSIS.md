# Settings Export/Import Analysis & Pre-Programmed Workouts

**Date:** 2026-02-12  
**Context:** New settings added (countdown, timers, countdown messages, audio preferences for beeps/voice/haptics). This document lists:
1. Timers with JSON export/import and their settings gaps
2. Pre-programmed workouts that may need adjustment for complete workout JSON

---

## Reference: Complete Settings (per AUDIO_RULES.md)

| Setting | localStorage key | In workout JSON | Notes |
|--------|------------------|----------------|-------|
| Tones | `enableTones` | `workout.enableTones` or top-level | Audio cue tones |
| Voice | `enableVoice` | `workout.enableVoice` or top-level | Spoken cues |
| Haptics | `enableHaptic` | `workout.enableHaptic` or top-level | Vibration feedback |
| Prep phase label | `prepPhaseLabel` (timer-specific) | `workout.prepPhaseLabel` or top-level | e.g. "Countdown", "Prepare" |
| Done/Completion message | varies | `doneMessage` / `completionMessage` | 14 chars max |
| ½ point reminder | `reminderMinutesRemain` | optional | Alerts at halfway |
| 2 min reminder | `reminder2Min` | optional | |
| 1 min reminder | `reminder1Min` | optional | |

---

## 1. Timers with JSON Export/Import – Settings Gaps

### Timers that need export/import updates (to include new settings)

| Timer | Export Missing | Import Missing | Action |
|-------|---------------|---------------|--------|
| **amrap.html** | `enableTones`, `enableVoice`, `enableHaptic` | Same | Add audio prefs to export payload; apply on import |
| **amrap-splits.html** | `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` | Same | Add reminder checkboxes to export; apply on import |
| **hiit.html** | `prepPhaseLabel` | Same | Add prepPhaseLabel to export/import |
| **hiit-presets.html** | `prepPhaseLabel`, `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` | Same | Add prepPhaseLabel + reminders |
| **quick-hiit.html** | `enableTones`, `enableVoice`, `enableHaptic`, `prepPhaseLabel`, `doneMessage` | Same | Add full audio + message export/import |
| **custom.html** | `enableTones`, `enableVoice`, `enableHaptic`, `prepPhaseLabel`, `doneMessage`, `completionMessage`, reminders | Same | Add full settings; custom uses roundGroups |
| **mobility.html** | `prepPhaseLabel`, `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` | Same | Add prepPhaseLabel + reminders |
| **pyramid.html** | (has enableTones, enableVoice, enableHaptic, prepPhaseLabel, doneMessage) | `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` (if applicable) | Check if pyramid has reminders; add if so |

### Timers already well-aligned
- **amrap-splits.html** – Has enableTones, enableVoice, enableHaptic, prepPhaseLabel, doneMessage. Missing reminders.
- **pyramid.html** – Full audio + prepPhaseLabel + doneMessage. Import applies them.

---

## 2. Pre-Programmed Workouts Needing Adjustment

### A. Workout JSON files in `workouts/` (downloads page)

| File | Timer Type | Current Structure | Missing for Complete JSON |
|------|------------|-------------------|---------------------------|
| **beginner-hiit-blast.json** | HIIT | `format`, `name`, `description`, `workSeconds`, `restSeconds`, `rounds` | `enableTones`, `enableVoice`, `enableHaptic`, `doneMessage`, `prepPhaseLabel`, `prepTime`; also uses `workSeconds`/`restSeconds` vs `workTime`/`restTime` |
| **leg-day-pyramid.json** | Pyramid | `format`, `name`, `description`, `steps` | `enableTones`, `enableVoice`, `enableHaptic`, `prepPhaseLabel`, `doneMessage`, `startTime`, `increment`, `peakTime`, `restTime`, `pyramids`, `warmupTime`, `cooldownTime`; format may differ from pyramid export |
| **amrap-core-crusher.json** | AMRAP | `format`, `workout`, `results`; workout has title, exercises, etc. | `enableTones`, `enableVoice`, `enableHaptic`, `prepPhaseLabel` in workout |
| **mobility-flow-sequence.json** | Mobility | `format`, `name`, `description`, `durationSeconds`, `activities` | `roundGroups` structure, `enableTones`, `enableVoice`, `enableHaptic`, `completionMessage`, `prepPhaseLabel` |
| **interval-fat-burner.json** | Interval | `format`, `name`, `description`, `intervals`, `rounds` | No interval timer has import; format may not match any timer |
| **emom-strength-builder.json** | EMOM | `format`, `name`, `description`, `durationMinutes`, `repTarget` | No EMOM timer has import; format may not match emom-splits |

### B. Inline pre-programmed workouts (one-click / dropdown)

| Timer | Source | Presets | Missing for Complete Export |
|-------|--------|---------|-----------------------------|
| **hiit-presets.html** | Preset buttons + dropdown | Tabata, EMOM, Little, Gibala, Norwegian, 30/30, 45/15, etc. | Buttons set work, rest, rounds, warmup, cooldown, title, description. **Do NOT set:** `doneMessage`, `prepPhaseLabel`, `enableTones`, `enableVoice`, `enableHaptic`, `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` - these use defaults/localStorage |
| **quick-hiit.html** | Same as hiit-presets | Same | Same as above |
| **hiit.html** | Preset chips + dropdown | Tabata, 30/30, 4×4, Little, Gibala, etc. | Same |
| **interval.html** | Preset chips + dropdown | Tabata, EMOM, etc. | No export/import |
| **interval-presets.html** | Preset chips + dropdown | Tabata, EMOM, etc. | No export/import |
| **quick-interval.html** | Preset chips + dropdown | Tabata, EMOM, etc. | No export/import |
| **mobility.html** | `workoutSelect` dropdown | Daily Wake-Up, Foot Roll, Ankle Stability, World's Greatest Stretch, 90/90 Hip Flow, etc. | `mobilityWorkouts` objects have `title`, `description`, `roundGroups`, `completionMessage`. **Missing:** `enableTones`, `enableVoice`, `enableHaptic`, `prepPhaseLabel`, `reminderMinutesRemain`, `reminder2Min`, `reminder1Min` |

### C. Summary: Pre-programmed workouts to adjust

**Workout JSON files (in `workouts/`):**
1. **beginner-hiit-blast.json** – Add audio prefs, doneMessage, prepPhaseLabel, prepTime; align workTime/restTime with HIIT import
2. **leg-day-pyramid.json** – Add full pyramid export fields or align with pyramid import format
3. **amrap-core-crusher.json** – Add enableTones, enableVoice, enableHaptic, prepPhaseLabel to workout
4. **mobility-flow-sequence.json** – Convert to mobility roundGroups format; add audio prefs, completionMessage, prepPhaseLabel
5. **interval-fat-burner.json** – Add import support for interval format or align with interval-presets/hiit import
6. **emom-strength-builder.json** – Add import support for EMOM format or align with emom-splits

**Inline presets (in-app):**
7. **hiit-presets.html** preset buttons – Consider adding optional presets for doneMessage, prepPhaseLabel, audio defaults (or document that these use defaults)
8. **quick-hiit.html** preset buttons – Same
9. **hiit.html** preset chips – Same
10. **mobility.html** `mobilityWorkouts` – Add optional `enableTones`, `enableVoice`, `enableHaptic`, `prepPhaseLabel`, `completionMessage`, reminders to each preset object

---

## 3. Next Steps

1. ~~**Update timer export/import**~~ – Add missing settings to each timer's export payload and import handler (per §1). **DONE**
2. ~~**Update workout JSON files**~~ – Add missing fields to each file in `workouts/` (per §2). **DONE**
3. ~~**Update inline presets**~~ – Optionally add default audio/message settings to preset objects (per §2). **DONE** (presets use defaults when missing)

## 4. Changes Applied (2026-02-12)

- **Default prep countdown:** 10 seconds for all timers (was 30 or 0)
- **Audible reminders:** Unchecked by default (no `checked` attribute; localStorage === 'true' for checked)
- **Timer export/import:** amrap, amrap-splits, hiit, hiit-presets, mobility, custom updated with new settings
- **Workout JSON files:** All 6 files updated with enableTones, enableVoice, enableHaptic, prepPhaseLabel, doneMessage/completionMessage, prepTime where applicable
