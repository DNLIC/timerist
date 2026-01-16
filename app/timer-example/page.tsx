"use client"

import React, { useState, useEffect, useRef } from "react"
import { TimerControls, type TimerMode, MODE_DEFAULTS } from "@/components/TimerControls"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { TimerSettingsDrawer } from "@/components/timer"

export default function TimerExamplePage() {
  // Timer state
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [mode, setMode] = useState<TimerMode>("tabata")
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  // Timer values
  const [duration, setDuration] = useState(20)
  const [initialDuration, setInitialDuration] = useState(20)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(8)
  const [phaseLabel, setPhaseLabel] = useState<"Work" | "Rest">("Work")
  
  // Work/Rest durations (for interval-based timers)
  const [workDuration, setWorkDuration] = useState(20)
  const [restDuration, setRestDuration] = useState(10)
  
  // Interval reference for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize mode defaults
  useEffect(() => {
    const defaults = MODE_DEFAULTS[mode]
    if (defaults.duration !== undefined) {
      setDuration(defaults.duration)
      setInitialDuration(defaults.duration)
    }
    if (defaults.rounds !== undefined) {
      setTotalRounds(defaults.rounds)
      setCurrentRound(1)
    }
    if (defaults.workDuration !== undefined) {
      setWorkDuration(defaults.workDuration)
    }
    if (defaults.restDuration !== undefined) {
      setRestDuration(defaults.restDuration)
    }
    setPhaseLabel("Work")
  }, [mode])

  // Main timer countdown logic
  useEffect(() => {
    if (isRunning && !isPaused && duration > 0) {
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev - 1
          
          // When timer reaches 0, handle phase/round switching
          if (newDuration <= 0) {
            handlePhaseChange()
            return 0
          }
          
          return newDuration
        })
      }, 1000)
    } else {
      // Clear interval when paused or stopped
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, duration, mode, currentRound, totalRounds, phaseLabel, workDuration, restDuration])

  // Handle phase changes (Work -> Rest, Rest -> Work, Round completion)
  const handlePhaseChange = () => {
    if (mode === "tabata" || mode === "interval" || mode === "hiit") {
      if (phaseLabel === "Work") {
        // Switch to Rest phase
        setPhaseLabel("Rest")
        setDuration(restDuration)
        setInitialDuration(restDuration)
      } else {
        // Switch to Work phase, next round
        setPhaseLabel("Work")
        setDuration(workDuration)
        setInitialDuration(workDuration)
        
        const nextRound = currentRound + 1
        if (nextRound > totalRounds) {
          // All rounds completed
          handleTimerComplete()
        } else {
          setCurrentRound(nextRound)
        }
      }
    } else if (mode === "emom") {
      // EMOM: Reset to full minute, next round
      const nextRound = currentRound + 1
      if (nextRound > totalRounds) {
        handleTimerComplete()
      } else {
        setCurrentRound(nextRound)
        setDuration(60)
        setInitialDuration(60)
        setPhaseLabel("Work")
      }
    } else if (mode === "countdown") {
      // Countdown completed
      handleTimerComplete()
    }
    // Stopwatch doesn't have phase changes
  }

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false)
    setIsPaused(false)
    // Could trigger completion sound/notification here
  }

  // Control handlers
  const handleTogglePlayPause = async () => {
    if (isRunning && !isPaused) {
      // Pause
      setIsPaused(true)
    } else if (isPaused) {
      // Resume
      setIsPaused(false)
    } else {
      // Start
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentRound(1)
    setPhaseLabel("Work")
    
    // Reset to initial values based on mode
    const defaults = MODE_DEFAULTS[mode]
    if (defaults.duration !== undefined) {
      setDuration(defaults.duration)
      setInitialDuration(defaults.duration)
    }
    if (defaults.workDuration !== undefined) {
      setWorkDuration(defaults.workDuration)
      setDuration(defaults.workDuration)
      setInitialDuration(defaults.workDuration)
    }
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
  }

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    handleReset()
  }

  const handleModeChangeWithDefaults = (newMode: TimerMode, defaults: typeof MODE_DEFAULTS[TimerMode]) => {
    setMode(newMode)
    if (defaults.duration !== undefined) {
      setDuration(defaults.duration)
      setInitialDuration(defaults.duration)
    }
    if (defaults.rounds !== undefined) {
      setTotalRounds(defaults.rounds)
      setCurrentRound(1)
    }
    if (defaults.workDuration !== undefined) {
      setWorkDuration(defaults.workDuration)
      setDuration(defaults.workDuration)
      setInitialDuration(defaults.workDuration)
    }
    if (defaults.restDuration !== undefined) {
      setRestDuration(defaults.restDuration)
    }
    setPhaseLabel("Work")
    setIsRunning(false)
    setIsPaused(false)
  }

  const handleDurationChange = (newDuration: number) => {
    if (!isRunning) {
      setDuration(newDuration)
      setInitialDuration(newDuration)
    }
  }

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8 min-w-0">
        <header className="text-center space-y-2 relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open settings menu"
              className="h-10 w-10"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
            <ModeToggle />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Timer Example</h1>
          <p className="text-muted-foreground">
            Complete timer implementation with countdown, phase switching, and pause/resume
          </p>
        </header>

        {/* Timer Controls */}
        <TimerControls
          isRunning={isRunning}
          isPaused={isPaused}
          mode={mode}
          onTogglePlayPause={handleTogglePlayPause}
          onReset={handleReset}
          onStop={handleStop}
          onModeChange={handleModeChange}
          onModeChangeWithDefaults={handleModeChangeWithDefaults}
          duration={duration}
          onDurationChange={handleDurationChange}
          minDuration={1}
          maxDuration={600}
          currentRound={currentRound}
          totalRounds={totalRounds}
          phaseLabel={phaseLabel}
          showModeSelector={true}
          showDurationSlider={mode === "countdown" || mode === "emom"}
          showTimerDisplay={true}
          initialDuration={initialDuration}
          warningThreshold={3}
          showPhaseWarnings={true}
          enableBeeps={true}
          beepVolume={0.3}
        />

        {/* Timer Status Display */}
        <div className="p-6 bg-card border border-border rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Timer Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Status</div>
              <div className="text-lg font-semibold text-foreground">
                {isRunning && !isPaused ? "Running" : isPaused ? "Paused" : "Stopped"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Mode</div>
              <div className="text-lg font-semibold text-foreground capitalize">{mode}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Round</div>
              <div className="text-lg font-semibold text-foreground">
                {currentRound} / {totalRounds}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Phase</div>
              <div className="text-lg font-semibold text-foreground">{phaseLabel}</div>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="p-8 bg-card border border-border rounded-lg shadow-lg text-center w-full min-w-0 overflow-visible">
          <div className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
            {phaseLabel} - Round {currentRound} of {totalRounds}
          </div>
          <div 
            className="font-mono font-bold text-primary mb-4 tabular-nums leading-none text-center whitespace-nowrap min-w-0"
            style={{
              fontSize: "clamp(3rem, 10vw, 10rem)", // Increased max to 10rem
              width: "auto",
              minWidth: "0",
              overflow: "visible",
              textOverflow: "clip",
            }}
          >
            {formatTime(duration)}
          </div>
          <div className="text-lg text-muted-foreground">
            {mode === "tabata" || mode === "interval" || mode === "hiit" ? (
              <>
                Work: {formatTime(workDuration)} | Rest: {formatTime(restDuration)}
              </>
            ) : (
              <>Total Duration: {formatTime(initialDuration)}</>
            )}
          </div>
        </div>

        {/* Debug Info (for development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-4 bg-muted/50 border border-border rounded-lg text-xs font-mono">
            <div className="font-semibold mb-2">Debug Info:</div>
            <div>isRunning: {String(isRunning)}</div>
            <div>isPaused: {String(isPaused)}</div>
            <div>duration: {duration}</div>
            <div>initialDuration: {initialDuration}</div>
            <div>currentRound: {currentRound}</div>
            <div>totalRounds: {totalRounds}</div>
            <div>phaseLabel: {phaseLabel}</div>
            <div>workDuration: {workDuration}</div>
            <div>restDuration: {restDuration}</div>
          </div>
        )}
      </div>
      
      {/* Settings Drawer */}
      <TimerSettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div className="space-y-4">
          <div>
            <a
              href="/"
              className="block px-4 py-2 text-primary hover:bg-accent rounded-md transition-colors"
            >
              Home
            </a>
            <a
              href="/countdown"
              className="block px-4 py-2 text-primary hover:bg-accent rounded-md transition-colors"
            >
              Countdown Timer
            </a>
          </div>
        </div>
      </TimerSettingsDrawer>
    </div>
  )
}
