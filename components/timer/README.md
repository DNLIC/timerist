# Timer UI Skeleton Components

Reusable components extracted from the countdown timer page for building consistent timer interfaces across different timer types.

## Components

### `TimerLayout`
Main page wrapper with safe area insets, responsive padding, and centered layout.

```tsx
<TimerLayout maxWidth="6xl" headerContent={<MenuButton />}>
  {/* Timer content */}
</TimerLayout>
```

**Props:**
- `children`: React.ReactNode - Timer content
- `maxWidth?`: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full" - Maximum content width
- `headerContent?`: React.ReactNode - Optional header content (e.g., menu button)
- `className?`: string - Additional classes

### `TimerDisplay`
Large, responsive timer display with automatic MM:SS formatting.

```tsx
<TimerDisplay 
  time={remaining} 
  textColor="#000000"
  minSize="3rem"
  maxSize="10rem"
  scaleFactor="12vw"
/>
```

**Props:**
- `time`: number - Time in seconds to display
- `textColor?`: string - Custom text color
- `minSize?`: string - Minimum font size (default: "3rem")
- `maxSize?`: string - Maximum font size (default: "10rem")
- `scaleFactor?`: string - Viewport-based scaling (default: "12vw")
- `className?`: string - Additional classes

### `TimerStatusLabel`
Status label showing current timer phase (Ready/Running/Paused/Complete).

```tsx
<TimerStatusLabel 
  phase={phase}
  labels={{
    idle: "Ready",
    running: "Running",
    paused: "Paused",
    complete: "Complete"
  }}
/>
```

**Props:**
- `phase`: TimerPhase - Current timer phase
- `labels?`: Object - Custom labels for each phase
- `className?`: string - Additional classes

### `TimerControlButtons`
Control buttons for Start/Pause/Resume/Reset with responsive sizing.

```tsx
<TimerControlButtons
  isRunning={isRunning}
  isPaused={isPaused}
  onStart={handleStart}
  onPause={handlePause}
  onResume={handleResume}
  onReset={handleReset}
  showLabels={true}
/>
```

**Props:**
- `isRunning`: boolean - Whether timer is running
- `isPaused`: boolean - Whether timer is paused
- `onStart`: () => void - Start callback
- `onPause`: () => void - Pause callback
- `onResume`: () => void - Resume callback
- `onReset`: () => void - Reset callback
- `showLabels?`: boolean - Show text labels (default: true on sm+)
- `className?`: string - Additional classes

### `TimerProgressBar`
Progress bar showing timer completion percentage.

```tsx
<TimerProgressBar 
  value={progress} 
  progressColor="#3b82f6"
  height="md"
/>
```

**Props:**
- `value`: number - Progress value (0-100)
- `progressColor?`: string - Custom progress color
- `height?`: "sm" | "md" | "lg" - Bar height (default: "md")
- `className?`: string - Additional classes

### `TimerSettingsDrawer`
Settings drawer with accordion support for timer configuration.

```tsx
<TimerSettingsDrawer 
  open={drawerOpen} 
  onOpenChange={setDrawerOpen}
  title="Settings"
>
  {/* Settings content */}
</TimerSettingsDrawer>
```

**Props:**
- `open`: boolean - Whether drawer is open
- `onOpenChange`: (open: boolean) => void - Open state change callback
- `title?`: string - Drawer title (default: "Settings")
- `children`: React.ReactNode - Settings content
- `className?`: string - Additional classes

## Complete Example

```tsx
import {
  TimerLayout,
  TimerDisplay,
  TimerStatusLabel,
  TimerControlButtons,
  TimerProgressBar,
  TimerSettingsDrawer,
  type TimerPhase,
} from "@/components/timer"

export default function MyTimerPage() {
  const [phase, setPhase] = useState<TimerPhase>("idle")
  const [remaining, setRemaining] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const progress = ((60 - remaining) / 60) * 100

  return (
    <TimerLayout
      maxWidth="6xl"
      headerContent={
        <Button onClick={() => setDrawerOpen(true)}>
          <Menu />
        </Button>
      }
    >
      <TimerStatusLabel phase={phase} />
      <TimerDisplay time={remaining} />
      <TimerProgressBar value={progress} />
      <TimerControlButtons
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onReset={() => {
          setIsRunning(false)
          setIsPaused(false)
          setRemaining(60)
        }}
      />
      <TimerSettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        {/* Settings content */}
      </TimerSettingsDrawer>
    </TimerLayout>
  )
}
```

## Benefits

1. **Consistency**: All timer pages use the same UI skeleton
2. **Maintainability**: Update once, apply everywhere
3. **Responsive**: Built-in responsive design patterns
4. **Accessible**: ARIA labels and semantic HTML included
5. **Customizable**: Props allow customization while maintaining structure

## Usage in Other Timer Types

These components can be used for:
- Tabata timers
- Interval timers
- HIIT timers
- EMOM timers
- Stopwatch
- Custom timers

Simply import and compose them with your timer logic!
