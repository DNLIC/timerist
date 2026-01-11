"use client"

import * as React from "react"
import { Play, Pause, Square, RotateCcw, Timer, Clock, AlertTriangle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { CircularProgress } from "@/components/ui/circular-progress"
import { cn } from "@/lib/utils"

export type TimerMode = "tabata" | "interval" | "hiit" | "emom" | "countdown" | "stopwatch" | "custom"

// Mode-specific default configurations
export const MODE_DEFAULTS: Record<TimerMode, { duration: number; rounds?: number; workDuration?: number; restDuration?: number }> = {
  tabata: { duration: 20, rounds: 8, workDuration: 20, restDuration: 10 },
  interval: { duration: 30, rounds: 5, workDuration: 30, restDuration: 15 },
  hiit: { duration: 45, rounds: 6, workDuration: 45, restDuration: 15 },
  emom: { duration: 60, rounds: 10 },
  countdown: { duration: 60 },
  stopwatch: { duration: 0 },
  custom: { duration: 30 },
}

export interface TimerControlsProps {
  /** Whether the timer is currently running */
  isRunning: boolean
  /** Whether the timer is paused */
  isPaused?: boolean
  /** Current timer mode */
  mode: TimerMode
  /** Callback when play/pause is toggled */
  onTogglePlayPause: () => void
  /** Callback when reset is clicked */
  onReset: () => void
  /** Callback when stop is clicked */
  onStop?: () => void
  /** Callback when mode changes */
  onModeChange?: (mode: TimerMode) => void
  /** Callback when mode changes - receives new mode and suggested defaults */
  onModeChangeWithDefaults?: (mode: TimerMode, defaults: typeof MODE_DEFAULTS[TimerMode]) => void
  /** Optional duration in seconds (for countdown/interval) */
  duration?: number
  /** Callback when duration changes */
  onDurationChange?: (duration: number) => void
  /** Minimum duration in seconds */
  minDuration?: number
  /** Maximum duration in seconds */
  maxDuration?: number
  /** Current round/phase info (for Tabata/Interval) */
  currentRound?: number
  /** Total rounds */
  totalRounds?: number
  /** Current phase label (e.g., "Work", "Rest") */
  phaseLabel?: string
  /** Whether to show mode selector (default: true) */
  showModeSelector?: boolean
  /** Whether to show duration slider */
  showDurationSlider?: boolean
  /** Whether to show timer display with circular progress */
  showTimerDisplay?: boolean
  /** Initial/max duration for current phase (for progress calculation) */
  initialDuration?: number
  /** Seconds before phase change to show warning (default: 3) */
  warningThreshold?: number
  /** Whether to show visual feedback for upcoming phase changes */
  showPhaseWarnings?: boolean
  /** Whether to play audio beeps */
  enableBeeps?: boolean
  /** Beep volume (0-1, default: 0.3) */
  beepVolume?: number
  /** Additional className */
  className?: string
  /** Disabled state */
  disabled?: boolean
}

export function TimerControls({
  isRunning,
  isPaused = false,
  mode,
  onTogglePlayPause,
  onReset,
  onStop,
  onModeChange,
  onModeChangeWithDefaults,
  duration,
  onDurationChange,
  minDuration = 1,
  maxDuration = 600,
  currentRound,
  totalRounds,
  phaseLabel,
  showModeSelector = true,
  showDurationSlider = false,
  showTimerDisplay = false,
  initialDuration,
  warningThreshold = 3,
  showPhaseWarnings = true,
  enableBeeps = true,
  beepVolume = 0.3,
  className,
  disabled = false,
}: TimerControlsProps) {
  const isActive = isRunning && !isPaused

  // Calculate if we're in warning zone (approaching phase change)
  const isWarningZone = React.useMemo(() => {
    if (!showPhaseWarnings || !duration || duration > warningThreshold) return false
    return duration <= warningThreshold && duration > 0 && isActive
  }, [showPhaseWarnings, duration, warningThreshold, isActive])

  // Create and manage a single AudioContext instance
  const audioContextRef = React.useRef<AudioContext | null>(null)

  // Initialize audio context on user interaction
  const initAudioContext = React.useCallback(async () => {
    if (audioContextRef.current) {
      // Resume if suspended
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }
      return audioContextRef.current
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContextClass()
      // Resume in case it starts suspended
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }
      return audioContextRef.current
    } catch (error) {
      console.warn("Failed to create audio context:", error)
      return null
    }
  }, [])

  // Resume audio context when timer starts
  React.useEffect(() => {
    if (isActive && enableBeeps) {
      initAudioContext().then(ctx => {
        if (ctx) {
          console.log("Audio context initialized:", ctx.state)
        }
      })
    }
  }, [isActive, enableBeeps, initAudioContext])

  // Audio beep function using Web Audio API
  const playBeep = React.useCallback(async (frequency: number = 800, duration: number = 0.2, type: "single" | "double" | "triple" = "single") => {
    if (!enableBeeps) {
      console.log("Beeps disabled")
      return
    }

    try {
      const audioContext = await initAudioContext()
      if (!audioContext) {
        console.warn("No audio context available")
        return
      }
      
      // Ensure context is running
      if (audioContext.state === "suspended") {
        await audioContext.resume()
        console.log("Audio context resumed")
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(beepVolume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)

      // For double/triple beeps, play additional beeps
      if (type === "double") {
        setTimeout(() => {
          playBeep(frequency, duration, "single")
        }, duration * 1000 + 50)
      } else if (type === "triple") {
        setTimeout(() => {
          playBeep(frequency, duration, "double")
        }, duration * 1000 + 50)
      }
    } catch (error) {
      console.warn("Audio playback failed:", error)
    }
  }, [enableBeeps, beepVolume, initAudioContext])

  // Track previous duration to detect changes and avoid duplicate beeps
  const prevDurationRef = React.useRef<number | undefined>(duration)

  // Play beeps based on timer state
  React.useEffect(() => {
    if (!isActive || duration === undefined || !enableBeeps) {
      prevDurationRef.current = duration
      return
    }

    // Only play beep if duration actually changed
    if (prevDurationRef.current === duration) {
      return
    }

    // Phase change beep (when timer reaches 0 or transitions)
    if (duration === 0 || (prevDurationRef.current !== undefined && prevDurationRef.current > 0 && duration <= 0)) {
      playBeep(1000, 0.3, "double").catch(err => console.warn("Beep failed:", err))
      prevDurationRef.current = duration
      return
    }

    // Warning beep at threshold (only when crossing into warning zone)
    if (
      duration === warningThreshold &&
      showPhaseWarnings &&
      prevDurationRef.current !== undefined &&
      prevDurationRef.current > warningThreshold
    ) {
      playBeep(600, 0.15, "single").catch(err => console.warn("Beep failed:", err))
      prevDurationRef.current = duration
      return
    }

    // Final countdown beep (1 second remaining, only when crossing into it)
    if (duration === 1 && prevDurationRef.current !== undefined && prevDurationRef.current > 1) {
      playBeep(800, 0.2, "single").catch(err => console.warn("Beep failed:", err))
      prevDurationRef.current = duration
      return
    }

    prevDurationRef.current = duration
  }, [duration, isActive, enableBeeps, warningThreshold, showPhaseWarnings, playBeep])

  // Determine next phase for ARIA announcements
  const nextPhase = React.useMemo(() => {
    if (!phaseLabel) return null
    const phaseLower = phaseLabel.toLowerCase()
    return phaseLower === "work" ? "Rest" : "Work"
  }, [phaseLabel])

  // ARIA announcement message
  const ariaAnnouncement = React.useMemo(() => {
    if (!isWarningZone || !nextPhase) return ""
    if (duration === warningThreshold) {
      return `Warning: ${warningThreshold} seconds until ${nextPhase} phase`
    } else if (duration === 1) {
      return `Phase change: Switching to ${nextPhase} now`
    }
    return ""
  }, [isWarningZone, duration, warningThreshold, nextPhase])

  // Calculate progress percentage for circular ring
  const progressPercentage = React.useMemo(() => {
    if (!showTimerDisplay || !duration || !initialDuration) return 0
    return Math.max(0, Math.min(100, ((initialDuration - duration) / initialDuration) * 100))
  }, [showTimerDisplay, duration, initialDuration])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handleModeChange = (value: string) => {
    if (value && onModeChange) {
      const newMode = value as TimerMode
      onModeChange(newMode)
      
      // If onModeChangeWithDefaults is provided, call it with suggested defaults
      if (onModeChangeWithDefaults) {
        onModeChangeWithDefaults(newMode, MODE_DEFAULTS[newMode])
      }
    }
  }

  const handleDurationChange = (value: number[]) => {
    if (onDurationChange) {
      onDurationChange(value[0])
    }
  }

  // Determine background tint color based on phase
  const backgroundTintColor = React.useMemo(() => {
    if (!phaseLabel) return null
    const phaseLower = phaseLabel.toLowerCase()
    if (phaseLower === "work") {
      return "destructive" // Red tint for Work phase
    } else if (phaseLower === "rest") {
      return "secondary" // Green tint for Rest phase
    }
    return null
  }, [phaseLabel])

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 bg-card border rounded-lg shadow-lg",
        "transition-all duration-500 ease-in-out",
        "relative overflow-visible", // Changed from overflow-hidden to prevent text clipping
        // Phase-based border color (subtle)
        phaseLabel?.toLowerCase() === "work"
          ? "border-destructive/20 dark:border-destructive/30"
          : phaseLabel?.toLowerCase() === "rest"
          ? "border-secondary/20 dark:border-secondary/30"
          : "border-border",
        className
      )}
      role="group"
      aria-label="Timer controls"
    >
      {/* ARIA Live Region for announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {ariaAnnouncement}
      </div>

      {/* Phase-based background overlay */}
      {backgroundTintColor && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-500",
            backgroundTintColor === "destructive"
              ? "bg-destructive/5 dark:bg-destructive/10"
              : "bg-secondary/5 dark:bg-secondary/10",
            // Enhanced tint when in warning zone
            isWarningZone && "opacity-100"
          )}
          aria-hidden="true"
        />
      )}
      {/* Timer Display with Circular Progress */}
      {showTimerDisplay && duration !== undefined && (
        <div className="flex flex-col items-center justify-center py-6 relative z-10 w-full min-w-0 overflow-visible">
          <div className="relative flex items-center justify-center min-w-0 w-full" style={{ maxWidth: "none" }}>
            {/* Circular Progress - positioned absolutely, doesn't constrain text */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ 
                aspectRatio: "1",
                maxWidth: "min(360px, 90vw)",
                maxHeight: "min(360px, 90vw)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <CircularProgress
                value={progressPercentage}
                current={duration}
                max={initialDuration || duration}
                size={240}
                strokeWidth={12}
                phase={phaseLabel}
                animated={isActive}
                className="w-full h-full"
              />
            </div>
            {/* Timer Text - centered, can scale freely */}
            <div className="relative z-10 flex flex-col items-center justify-center min-w-0" style={{ width: "auto", maxWidth: "none" }}>
              <div className={cn(
                "font-mono font-bold tabular-nums transition-all duration-300",
                "leading-none whitespace-nowrap inline-block",
                isWarningZone
                  ? "text-destructive animate-pulse"
                  : "text-foreground"
              )}
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",
                lineHeight: "1",
                overflow: "visible",
                textOverflow: "clip",
                width: "auto",
                minWidth: "0",
                maxWidth: "none",
              }}>
                {formatTime(duration)}
              </div>
              {phaseLabel && (
                <div className={cn(
                  "text-sm uppercase tracking-wide mt-2 font-semibold transition-all duration-300",
                  phaseLabel.toLowerCase() === "work"
                    ? "text-destructive"
                    : "text-secondary",
                  isWarningZone && "animate-pulse"
                )}>
                  {phaseLabel}
                </div>
              )}
              {/* Warning icon overlay on timer display */}
              {isWarningZone && showPhaseWarnings && (
                <div className="absolute -top-2 -right-2 z-20">
                  <Bell
                    className={cn(
                      "w-6 h-6 text-destructive animate-bounce",
                      "drop-shadow-lg"
                    )}
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector - Always at the top */}
      {showModeSelector && onModeChange && (
        <div className="flex flex-col gap-2 relative z-10 border-b border-border pb-4 mb-2">
          <label
            htmlFor="timer-mode"
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
          >
            Timer Mode
          </label>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={handleModeChange}
            disabled={disabled || isActive}
            className="justify-start flex-wrap gap-2"
            aria-label="Select timer mode"
          >
            <ToggleGroupItem
              value="tabata"
              aria-label="Tabata timer (20s work, 10s rest, 8 rounds)"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground min-w-[100px]"
            >
              Tabata
            </ToggleGroupItem>
            <ToggleGroupItem
              value="interval"
              aria-label="Interval timer (30s work, 15s rest, 5 rounds)"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground min-w-[100px]"
            >
              Interval
            </ToggleGroupItem>
            <ToggleGroupItem
              value="hiit"
              aria-label="HIIT timer (45s work, 15s rest, 6 rounds)"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground min-w-[100px]"
            >
              HIIT
            </ToggleGroupItem>
            <ToggleGroupItem
              value="emom"
              aria-label="EMOM timer (Every Minute On the Minute)"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground min-w-[100px]"
            >
              EMOM
            </ToggleGroupItem>
            <ToggleGroupItem
              value="countdown"
              aria-label="Countdown timer"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground min-w-[100px]"
            >
              Countdown
            </ToggleGroupItem>
            <ToggleGroupItem
              value="stopwatch"
              aria-label="Stopwatch"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground min-w-[100px]"
            >
              Stopwatch
            </ToggleGroupItem>
          </ToggleGroup>
          {/* Mode description */}
          <p className="text-xs text-muted-foreground mt-1">
            {mode === "tabata" && "20s work, 10s rest, 8 rounds"}
            {mode === "interval" && "30s work, 15s rest, 5 rounds"}
            {mode === "hiit" && "45s work, 15s rest, 6 rounds"}
            {mode === "emom" && "Every minute on the minute, 10 rounds"}
            {mode === "countdown" && "Simple countdown timer"}
            {mode === "stopwatch" && "Track elapsed time"}
            {mode === "custom" && "Custom timer configuration"}
          </p>
        </div>
      )}

      {/* Status Badge & Phase Info */}
      {(phaseLabel || currentRound !== undefined || isWarningZone) && (
        <div className="flex items-center gap-3 flex-wrap relative z-10">
          {phaseLabel && (
            <Badge
              variant={phaseLabel.toLowerCase() === "work" ? "default" : "secondary"}
              className={cn(
                "text-sm font-semibold px-3 py-1 transition-all duration-300",
                phaseLabel.toLowerCase() === "work"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
                // Flash when in warning zone
                isWarningZone && "animate-pulse"
              )}
              aria-label={`Current phase: ${phaseLabel}`}
            >
              {phaseLabel}
            </Badge>
          )}
          {currentRound !== undefined && totalRounds !== undefined && (
            <Badge
              variant="outline"
              className="text-sm font-semibold px-3 py-1"
              aria-label={`Round ${currentRound} of ${totalRounds}`}
            >
              <Timer className="w-3 h-3 mr-1.5" aria-hidden="true" />
              Round {currentRound} / {totalRounds}
            </Badge>
          )}
          {/* Warning indicator for upcoming phase change */}
          {isWarningZone && showPhaseWarnings && (
            <Badge
              variant="destructive"
              className={cn(
                "text-sm font-semibold px-3 py-1 animate-pulse",
                "bg-destructive text-destructive-foreground"
              )}
              aria-live="assertive"
              aria-label={`Warning: ${duration} second${duration !== 1 ? "s" : ""} until ${nextPhase} phase`}
            >
              <AlertTriangle className="w-3 h-3 mr-1.5 animate-bounce" aria-hidden="true" />
              {duration}s to {nextPhase}
            </Badge>
          )}
          {isActive && !isWarningZone && (
            <Badge
              variant="default"
              className="bg-primary text-primary-foreground"
              aria-live="polite"
              aria-label="Timer is running"
            >
              Running
            </Badge>
          )}
        </div>
      )}

      {/* Duration Slider */}
      {showDurationSlider && duration !== undefined && onDurationChange && (
        <div className="flex flex-col gap-2 relative z-10">
          <div className="flex items-center justify-between">
            <label
              htmlFor="duration-slider"
              className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Duration
            </label>
            <span className="text-sm font-mono text-foreground">
              {Math.floor((duration || 0) / 60)}:{(duration || 0) % 60 < 10 ? "0" : ""}
              {(duration || 0) % 60}
            </span>
          </div>
          <Slider
            id="duration-slider"
            value={[duration]}
            onValueChange={handleDurationChange}
            min={minDuration}
            max={maxDuration}
            step={1}
            disabled={disabled || isActive}
            className="w-full"
            aria-label="Timer duration"
            aria-valuemin={minDuration}
            aria-valuemax={maxDuration}
            aria-valuenow={duration}
          />
        </div>
      )}

      {/* Main Control Buttons */}
      <div
        className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center relative z-10"
        role="group"
        aria-label="Timer action buttons"
      >
        {/* Play/Pause Toggle */}
        <Button
          onClick={async () => {
            // Initialize audio context on first user interaction (browser autoplay policy)
            if (!isActive && enableBeeps) {
              await initAudioContext()
            }
            onTogglePlayPause()
          }}
          disabled={disabled}
          size="lg"
          className={cn(
            "flex-1 sm:flex-initial min-w-[140px] font-semibold uppercase tracking-wide",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            isActive
              ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
          aria-label={isActive ? "Pause timer" : "Start timer"}
          aria-pressed={isActive}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" aria-hidden="true" />
              Start
            </>
          )}
        </Button>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          disabled={disabled || isActive}
          variant="outline"
          size="lg"
          className={cn(
            "flex-1 sm:flex-initial min-w-[140px] font-semibold uppercase tracking-wide",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            "border-2 hover:bg-accent hover:text-accent-foreground"
          )}
          aria-label="Reset timer"
        >
          <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
          Reset
        </Button>

        {/* Stop Button (optional) */}
        {onStop && (
          <Button
            onClick={onStop}
            disabled={disabled || !isActive}
            variant="destructive"
            size="lg"
            className={cn(
              "flex-1 sm:flex-initial min-w-[140px] font-semibold uppercase tracking-wide",
              "transition-all duration-200 hover:scale-105 active:scale-95"
            )}
            aria-label="Stop timer"
          >
            <Square className="w-4 h-4 mr-2" aria-hidden="true" />
            Stop
          </Button>
        )}
      </div>
    </div>
  )
}
