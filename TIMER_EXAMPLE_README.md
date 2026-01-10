# Complete Timer Example

This document provides a complete example of how to use the `TimerControls` component with full timer logic including countdown, phase switching, and pause/resume functionality.

## Files

1. **`app/timer-example/page.tsx`** - Next.js/React example with TypeScript
2. **`timer-example-complete.html`** - Standalone HTML example (no build required)

## Features Demonstrated

### 1. Timer State Management
- `useState` for all timer state (running, paused, duration, rounds, phase)
- `useRef` for interval cleanup
- Mode-specific defaults using `MODE_DEFAULTS`

### 2. Countdown Logic
- `useEffect` hook that runs the countdown interval
- Properly clears interval on pause/stop/unmount
- Handles timer reaching zero

### 3. Phase Switching
- **Tabata/Interval/HIIT**: Switches between Work and Rest phases
- **EMOM**: Resets to full minute each round
- **Countdown**: Completes when reaching zero
- **Stopwatch**: Counts up (not implemented in this example)

### 4. Pause/Resume
- Toggle between running and paused states
- Preserves current duration when paused
- Resumes from where it left off

### 5. Mode Switching
- Updates defaults when mode changes
- Resets timer state
- Handles mode-specific configurations

## Key Implementation Details

### Timer Countdown Effect

```typescript
useEffect(() => {
  if (isRunning && !isPaused && duration > 0) {
    intervalRef.current = setInterval(() => {
      setDuration((prev) => {
        const newDuration = prev - 1
        if (newDuration <= 0) {
          handlePhaseChange()
          return 0
        }
        return newDuration
      })
    }, 1000)
  } else {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}, [isRunning, isPaused, duration, ...otherDeps])
```

### Phase Change Handler

```typescript
const handlePhaseChange = () => {
  if (mode === "tabata" || mode === "interval" || mode === "hiit") {
    if (phaseLabel === "Work") {
      // Switch to Rest
      setPhaseLabel("Rest")
      setDuration(restDuration)
      setInitialDuration(restDuration)
    } else {
      // Switch to Work, next round
      setPhaseLabel("Work")
      setDuration(workDuration)
      setInitialDuration(workDuration)
      
      const nextRound = currentRound + 1
      if (nextRound > totalRounds) {
        handleTimerComplete()
      } else {
        setCurrentRound(nextRound)
      }
    }
  }
  // ... other mode handlers
}
```

## Usage

### Next.js Example

```tsx
import { TimerControls, MODE_DEFAULTS } from "@/components/TimerControls"

// Use the component with your state management
<TimerControls
  isRunning={isRunning}
  isPaused={isPaused}
  mode={mode}
  onTogglePlayPause={handleTogglePlayPause}
  onReset={handleReset}
  onModeChangeWithDefaults={handleModeChangeWithDefaults}
  duration={duration}
  currentRound={currentRound}
  totalRounds={totalRounds}
  phaseLabel={phaseLabel}
  // ... other props
/>
```

### Standalone HTML

Open `timer-example-complete.html` in your browser. No build step required.

## Timer Modes

### Tabata
- 20s work, 10s rest
- 8 rounds
- Alternates between Work and Rest phases

### Interval
- 30s work, 15s rest
- 5 rounds
- Alternates between Work and Rest phases

### HIIT
- 45s work, 15s rest
- 6 rounds
- Alternates between Work and Rest phases

### EMOM (Every Minute On the Minute)
- 60s per round
- 10 rounds
- Resets to full minute each round

### Countdown
- Simple countdown from set duration
- Completes when reaching zero

## State Flow

1. **Initial State**: Timer is stopped, duration set to mode default
2. **Start**: `isRunning = true`, `isPaused = false`, interval starts
3. **Pause**: `isPaused = true`, interval cleared, duration preserved
4. **Resume**: `isPaused = false`, interval restarted
5. **Phase Change**: Duration reaches 0, phase switches, new duration set
6. **Round Complete**: All rounds done, timer stops
7. **Reset**: All state reset to initial values

## Best Practices

1. **Always cleanup intervals**: Use `useEffect` cleanup function
2. **Use refs for intervals**: Prevents stale closures
3. **Handle edge cases**: Timer at 0, mode changes during run, etc.
4. **Update initialDuration**: When phase changes, update for progress calculation
5. **Disable controls when running**: Prevent state conflicts

## Troubleshooting

### Timer doesn't count down
- Check `isRunning` and `isPaused` states
- Verify interval is being created
- Check browser console for errors

### Phase doesn't switch
- Verify `handlePhaseChange` is called
- Check mode-specific logic
- Ensure duration reaches exactly 0

### State not updating
- Check dependency arrays in `useEffect`
- Verify state setters are being called
- Check for stale closures

## Next Steps

- Add audio beeps (already integrated in TimerControls)
- Add visual feedback (already integrated)
- Add workout history/logging
- Add custom timer presets
- Add share/export functionality
