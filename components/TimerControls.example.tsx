"use client"

import * as React from "react"
import { TimerControls, type TimerMode } from "./TimerControls"

/**
 * Example usage of TimerControls component
 * 
 * This demonstrates how to integrate TimerControls with timer state management
 */
export function TimerControlsExample() {
  const [isRunning, setIsRunning] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [mode, setMode] = React.useState<TimerMode>("tabata")
  const [duration, setDuration] = React.useState(20)
  const [currentRound, setCurrentRound] = React.useState(1)
  const [totalRounds] = React.useState(8)
  const [phaseLabel, setPhaseLabel] = React.useState<"Work" | "Rest">("Work")

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
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
  }

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode)
    handleReset() // Reset when mode changes
  }

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Timer Controls Example</h1>
      
      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        mode={mode}
        onTogglePlayPause={handleTogglePlayPause}
        onReset={handleReset}
        onStop={handleStop}
        onModeChange={handleModeChange}
        duration={duration}
        onDurationChange={handleDurationChange}
        minDuration={1}
        maxDuration={300}
        currentRound={currentRound}
        totalRounds={totalRounds}
        phaseLabel={phaseLabel}
        showModeSelector={true}
        showDurationSlider={true}
      />

      {/* Timer Display (separate component) */}
      <div className="mt-8 p-6 bg-card border border-border rounded-lg text-center">
        <div className="text-6xl font-mono font-bold text-primary mb-4">
          {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
        </div>
        <div className="text-lg text-muted-foreground">
          Status: {isRunning && !isPaused ? "Running" : isPaused ? "Paused" : "Stopped"}
        </div>
      </div>
    </div>
  )
}

/**
 * Minimal example - just the controls without mode selector or duration slider
 */
export function TimerControlsMinimal() {
  const [isRunning, setIsRunning] = React.useState(false)

  return (
    <TimerControls
      isRunning={isRunning}
      mode="countdown"
      onTogglePlayPause={() => setIsRunning(!isRunning)}
      onReset={() => setIsRunning(false)}
      showModeSelector={false}
      showDurationSlider={false}
    />
  )
}

/**
 * Tabata-specific example with phase tracking
 */
export function TabataTimerExample() {
  const [isRunning, setIsRunning] = React.useState(false)
  const [currentRound, setCurrentRound] = React.useState(1)
  const [phaseLabel, setPhaseLabel] = React.useState<"Work" | "Rest">("Work")

  return (
    <TimerControls
      isRunning={isRunning}
      mode="tabata"
      onTogglePlayPause={() => setIsRunning(!isRunning)}
      onReset={() => {
        setIsRunning(false)
        setCurrentRound(1)
        setPhaseLabel("Work")
      }}
      currentRound={currentRound}
      totalRounds={8}
      phaseLabel={phaseLabel}
      showModeSelector={false}
      showDurationSlider={false}
    />
  )
}
