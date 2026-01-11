"use client"

import React, { useState, useEffect } from "react"
import { TimerControls, type TimerMode, MODE_DEFAULTS } from "@/components/TimerControls"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [mode, setMode] = useState<TimerMode>("tabata")
  const [duration, setDuration] = useState(20)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(8)
  const [phaseLabel, setPhaseLabel] = useState<"Work" | "Rest">("Work")
  const [initialDuration, setInitialDuration] = useState(20)

  const handleTogglePlayPause = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true)
    } else if (isPaused) {
      setIsPaused(false)
    } else {
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setCurrentRound(1)
    setPhaseLabel("Work")
    setDuration(20)
    setInitialDuration(20)
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
    // Update duration and rounds based on mode defaults
    if (defaults.duration !== undefined) {
      setDuration(defaults.duration)
      setInitialDuration(defaults.duration)
    }
    if (defaults.rounds !== undefined) {
      setTotalRounds(defaults.rounds)
      setCurrentRound(1)
    }
    setPhaseLabel("Work")
    setIsRunning(false)
    setIsPaused(false)
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
  }

  // Simulate timer progression
  React.useEffect(() => {
    if (isRunning && !isPaused && duration > 0) {
      const interval = setInterval(() => {
        setDuration((prev) => {
          if (prev <= 1) {
            // Switch phase or round
            if (phaseLabel === "Work") {
              setPhaseLabel("Rest")
              setInitialDuration(10)
              return 10 // Rest duration
            } else {
              setPhaseLabel("Work")
              setInitialDuration(20)
              setCurrentRound((prev) => {
                if (prev >= totalRounds) {
                  setIsRunning(false)
                  setIsPaused(false)
                  return 1
                }
                return prev + 1
              })
              return 20 // Work duration
            }
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRunning, isPaused, duration, phaseLabel, totalRounds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2 relative">
          <div className="absolute top-0 right-0">
            <ModeToggle />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Timerist</h1>
          <p className="text-muted-foreground">Timer Controls Component Demo</p>
          
          {/* Navigation Links */}
          <nav className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="/countdown"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Countdown Timer
            </a>
            <a
              href="/timer-example"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
            >
              Timer Example
            </a>
          </nav>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Full Featured Example */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Full Featured
            </h2>
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
              maxDuration={300}
              currentRound={currentRound}
              totalRounds={totalRounds}
              phaseLabel={phaseLabel}
              showModeSelector={true}
              showDurationSlider={true}
              showTimerDisplay={true}
              initialDuration={initialDuration}
              warningThreshold={3}
              showPhaseWarnings={true}
              enableBeeps={true}
              beepVolume={0.3}
            />
          </div>

          {/* Timer Display */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Timer Display
            </h2>
            <div className="p-8 bg-card border border-border rounded-lg shadow-lg text-center">
              <div className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
                {phaseLabel}
              </div>
              <div className="text-7xl md:text-8xl font-mono font-bold text-primary mb-4 tabular-nums">
                {formatTime(duration)}
              </div>
              <div className="text-lg text-muted-foreground">
                Round {currentRound} of {totalRounds}
              </div>
              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    isRunning && !isPaused
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : isPaused
                      ? "bg-muted text-muted-foreground"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {isRunning && !isPaused
                    ? "Running"
                    : isPaused
                    ? "Paused"
                    : "Stopped"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Minimal Example
          </h2>
          <TimerControls
            isRunning={false}
            mode="countdown"
            onTogglePlayPause={() => {}}
            onReset={() => {}}
            showModeSelector={false}
            showDurationSlider={false}
            showTimerDisplay={true}
            duration={60}
            initialDuration={60}
          />
        </div>

      </div>
    </div>
  )
}
