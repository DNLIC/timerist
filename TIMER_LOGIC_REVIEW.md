# Custom Timer Logic Review

## Sample Workout Analysis
**Workout:** Burpees & Crunches
- RoundGroup: "Burpees" (2 rounds, 10s rest between rounds)
- Activity 1: Burpees (rep mode, 20 reps, no time cap, no rest between activities)
- Activity 2: Crunches (rep mode, 20 reps, no time cap, no rest between activities)

**Expected Phase Sequence:**
1. Work: Burpees (Round 1) - rep mode, manual complete
2. Work: Crunches (Round 1) - rep mode, manual complete
3. Rest: 10s (restBetweenRounds)
4. Work: Burpees (Round 2) - rep mode, manual complete
5. Work: Crunches (Round 2) - rep mode, manual complete
6. Complete

---

## Phase Initialization & Sequencing

### ✅ **What Works**

**Phase Building (`buildWorkoutState()`):**
- Correctly iterates through roundGroups → rounds → activities
- Creates work phases for each activity in each round
- Inserts `restBetweenActivities` after each activity (except last activity of last round)
- Inserts `restBetweenRounds` after completing all activities in a round (if more rounds remain)
- Phase structure: `{ type, roundGroupIndex, activityIndex, round, duration, timeCapSeconds, activity }`

**Activity Boundary Detection (`isActivityBoundary()`):**
- Correctly identifies transitions between different activities/rounds
- Stops timer at boundaries for rep-based activities (requires manual "Complete/Next")
- Allows auto-advance within same activity (work → rest)

**Sequence Example (Sample JSON):**
```
Phase 0: Work (Burpees, Round 1) - rep mode
Phase 1: Work (Crunches, Round 1) - rep mode  
Phase 2: Rest (10s, restBetweenRounds)
Phase 3: Work (Burpees, Round 2) - rep mode
Phase 4: Work (Crunches, Round 2) - rep mode
```

---

## Mode-Specific Timing

### ✅ **Time-Based Mode**
- **Implementation:** Countdown from `duration`
- **Display:** `formatTime(currentTime)` (MM:SS)
- **Completion:** Auto-advances when `currentTime <= 0`
- **Audio:** Countdown beeps at 3, 2, 1 seconds
- **Status:** ✅ Works correctly

### ✅ **Rep-Based Mode (No Time Cap)**
- **Implementation:** Manual completion via "Complete/Next" button
- **Display:** Time of day clock (`formatTimeOfDay()`)
- **Tracking:** Records start/stop times in `repBasedSegmentTimes`
- **Completion:** User clicks "Complete/Next" → moves to next phase
- **Audio:** Three low tones on completion
- **Status:** ✅ Works correctly

### ✅ **Rep-Based Mode (With Time Cap)**
- **Implementation:** Time cap countdown runs while user completes reps
- **Display:** Main clock shows time cap countdown, roundInfo shows elapsed time
- **Completion:** Auto-advances when `timeCapCountdown <= 0` OR manual "Complete/Next"
- **Audio:** Countdown beeps at 3, 2, 1 seconds (time cap), three low tones on completion
- **Status:** ✅ Works correctly

### ⚠️ **EMOM Mode**
- **Implementation:** 1-minute increments with beeps at top of each minute
- **Display:** `Minute X of N - SS` (seconds remaining in current minute)
- **Completion:** Auto-advances when all minutes complete
- **Audio:** Two beeps at start of each new minute (`playMinuteStartBeep()`)
- **Gap:** ❌ **No failure handling** - timer continues even if user doesn't complete work in time
- **Status:** ⚠️ Works but missing failure detection

### ✅ **AMRAP Mode**
- **Implementation:** Countdown from `duration` (same as time-based)
- **Display:** `formatTime(currentTime)` (MM:SS)
- **Completion:** Auto-advances when `currentTime <= 0`
- **Audio:** Countdown beeps at 3, 2, 1 seconds
- **Note:** Rep tracking would need to be added separately (not in current implementation)
- **Status:** ✅ Works correctly (as time-based countdown)

---

## Rest/Setup/Prep Handling

### ✅ **Rest Phases**
- **Types:** `rest` (between activities/rounds), `restAfter` (after last activity)
- **Implementation:** Countdown from `duration`
- **Display:** "Rest" label, countdown timer
- **Audio:** Transition beep on completion
- **Auto-advance:** ✅ Automatically moves to next phase
- **Status:** ✅ Works correctly

### ❌ **Prep Phases**
- **Expected:** Silent countdown before work phase
- **Reality:** **Prep phases are NOT created in `buildWorkoutState()`**
- **Code References:** Prep phases are referenced in:
  - `updateDisplay()` (line 1830)
  - Timer interval (line 2646: "ONLY if not in prep phase")
  - Comments mentioning "prep → work → rest" flow
- **Gap:** Prep phases exist in code logic but are never instantiated
- **Status:** ❌ **Missing implementation**

### ✅ **Setup Button**
- **Function:** Opens workout configuration drawer
- **Visibility:** Hidden during active workout, shown when stopped
- **Status:** ✅ Works correctly

---

## Mental Walkthrough (Sample JSON - 2 Rounds)

### Round 1

**Phase 0: Burpees (Rep Mode, No Time Cap)**
1. User clicks "Start" → Timer shows time of day
2. User completes 20 burpees
3. User clicks "Complete/Next" → Plays three low tones
4. **Boundary check:** Next phase is different activity → **STOPS** (armed state)
5. Display: "Ready for next round: Crunches"

**Phase 1: Crunches (Rep Mode, No Time Cap)**
6. User clicks "Start" → Timer shows time of day
7. User completes 20 crunches
8. User clicks "Complete/Next" → Plays three low tones
9. **Boundary check:** Next phase is rest (same round) → **AUTO-ADVANCES**

**Phase 2: Rest (10s)**
10. Auto-starts countdown from 10s
11. Countdown beeps at 3, 2, 1
12. At 0: Plays transition beep, auto-advances
13. **Boundary check:** Next phase is different round → **STOPS** (armed state)
14. Display: "Ready for next round: Burpees"

### Round 2

**Phase 3: Burpees (Rep Mode, No Time Cap)**
15. User clicks "Start" → Timer shows time of day
16. User completes 20 burpees
17. User clicks "Complete/Next" → Plays three low tones
18. **Boundary check:** Next phase is different activity → **STOPS** (armed state)
19. Display: "Ready for next round: Crunches"

**Phase 4: Crunches (Rep Mode, No Time Cap)**
20. User clicks "Start" → Timer shows time of day
21. User completes 20 crunches
22. User clicks "Complete/Next" → Plays three low tones
23. **Boundary check:** No more phases → **WORKOUT COMPLETE**

**Result:** ✅ Sequence works correctly for sample JSON

---

## Bugs & Gaps

### 🔴 **Critical Issues**

1. **Prep Phases Not Created**
   - **Location:** `buildWorkoutState()` (lines 1668-1726)
   - **Issue:** Prep phases are referenced throughout code but never instantiated
   - **Impact:** Prep time feature is non-functional
   - **Fix:** Add prep phase creation before work phases if `act.prepTime > 0`

2. **EMOM Failure Handling Missing**
   - **Location:** EMOM timer logic (lines 2550-2640)
   - **Issue:** Timer continues to next minute even if work isn't completed
   - **Impact:** No way to track failed EMOM rounds
   - **Fix:** Add manual "Failed" button or auto-detect incomplete work

### ⚠️ **Minor Issues**

3. **Unclear Mode Display Transitions**
   - **Location:** `updateDisplay()` (lines 1833-1904)
   - **Issue:** When switching between modes (e.g., rep → time), display format changes abruptly
   - **Impact:** User confusion during mode transitions
   - **Fix:** Add visual indicator for mode changes

4. **AMRAP Rep Tracking Missing**
   - **Location:** AMRAP mode handling
   - **Issue:** AMRAP works as time-based countdown but doesn't track reps
   - **Impact:** Limited AMRAP functionality
   - **Fix:** Add rep counter UI and tracking similar to rep-based mode

5. **Rest Phase Activity Reference**
   - **Location:** `buildWorkoutState()` rest phase creation (lines 1696-1703, 1712-1719)
   - **Issue:** Rest phases reference the previous activity, which may be confusing
   - **Impact:** Minor - rest phases show previous activity name in roundInfo
   - **Fix:** Consider showing "Rest" or next activity name instead

---

## Summary Table

| Feature | Status | Notes |
|---------|--------|-------|
| **Phase Initialization** | ✅ Works | Correctly flattens round groups into phases |
| **Rest Insertion** | ✅ Works | Rests inserted between activities and rounds correctly |
| **Time-Based Mode** | ✅ Works | Countdown with audio beeps |
| **Rep-Based (No Cap)** | ✅ Works | Manual complete, time of day display |
| **Rep-Based (Time Cap)** | ✅ Works | Time cap countdown + elapsed time display |
| **EMOM Mode** | ⚠️ Partial | Works but missing failure handling |
| **AMRAP Mode** | ⚠️ Partial | Works as countdown but no rep tracking |
| **Rest Phases** | ✅ Works | Countdown with auto-advance |
| **Prep Phases** | ❌ Missing | Referenced but never created |
| **Activity Boundaries** | ✅ Works | Correctly stops at boundaries for rep-based |
| **Audio System** | ✅ Works | Mode-specific audio cues |
| **Manual Complete** | ✅ Works | "Complete/Next" button for rep-based |

---

## Quick Fixes

### Fix 1: Add Prep Phase Creation

```javascript
// In buildWorkoutState(), before work phase creation (around line 1680):
for (let actIndex = 0; actIndex < rg.activities.length; actIndex++) {
    const act = rg.activities[actIndex];
    
    // Prep phase (if prepTime > 0)
    if (act.prepTime && act.prepTime > 0) {
        state.phases.push({
            type: 'prep',
            roundGroupIndex: rgIndex,
            activityIndex: actIndex,
            round: round,
            duration: act.prepTime,
            activity: act
        });
    }
    
    // Work phase
    state.phases.push({
        // ... existing work phase code
    });
}
```

### Fix 2: Add EMOM Failure Detection (Optional)

```javascript
// Add to EMOM timer logic (around line 2558):
if (emomSecondsInMinute <= 0) {
    // Check if user wants to mark this minute as failed
    // Could add a "Failed" button or auto-detect based on rep count
    if (emomCurrentMinute < emomTotalMinutes) {
        playMinuteStartBeep(phase);
        // Optionally: Record failed minute
        emomCurrentMinute++;
        emomSecondsInMinute = 60;
    }
}
```

### Fix 3: Improve Mode Transition Display

```javascript
// In updateDisplay(), add mode indicator:
if (phase.type === 'work') {
    const modeLabels = {
        'time': 'Time',
        'rep': 'Reps',
        'emom': 'EMOM',
        'amrap': 'AMRAP'
    };
    phaseText = `${act.name} (${modeLabels[act.mode] || act.mode})`;
}
```

---

## Conclusion

The timer logic **correctly handles** the core workout structure for the sample JSON:
- ✅ Phases are initialized and sequenced properly
- ✅ Rep-based activities work with manual completion
- ✅ Rests are inserted correctly between rounds
- ✅ Activity boundaries stop timer appropriately

**Main gaps:**
- ❌ Prep phases are not implemented (referenced but never created)
- ⚠️ EMOM mode lacks failure handling
- ⚠️ AMRAP mode lacks rep tracking

The code is well-structured and handles the sample workout correctly. The identified issues are fixable with the provided code snippets.
