"use client"

/**
 * Example usage of Timer UI Skeleton Components
 * 
 * This demonstrates how to use the extracted timer components
 * to build a complete timer page.
 */

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import {
  TimerLayout,
  TimerDisplay,
  TimerStatusLabel,
  TimerControlButtons,
  TimerProgressBar,
  TimerSettingsDrawer,
  type TimerPhase,
} from "@/components/timer"

export function TimerExample() {
  const [phase, setPhase] = React.useState<TimerPhase>("idle")
  const [remaining, setRemaining] = React.useState(60)
  const [isRunning, setIsRunning] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [textColor, setTextColor] = React.useState("#000000")
  const [progressColor, setProgressColor] = React.useState("#3b82f6")

  // Timer logic
  React.useEffect(() => {
    if (isRunning && !isPaused && remaining > 0) {
      const interval = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setPhase("complete")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRunning, isPaused, remaining])

  // Update phase
  React.useEffect(() => {
    if (isRunning && !isPaused) {
      setPhase("running")
    } else if (isPaused) {
      setPhase("paused")
    } else if (remaining === 0) {
      setPhase("complete")
    } else {
      setPhase("idle")
    }
  }, [isRunning, isPaused, remaining])

  const progress = 60 > 0 ? ((60 - remaining) / 60) * 100 : 0

  return (
    <TimerLayout
      maxWidth="6xl"
      headerContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open settings"
          className="h-10 w-10"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      }
    >
      <TimerStatusLabel phase={phase} />

      <TimerDisplay time={remaining} textColor={textColor} />

      <TimerProgressBar value={progress} progressColor={progressColor} />

      <TimerControlButtons
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={() => {
          setIsRunning(true)
          setIsPaused(false)
        }}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        onReset={() => {
          setIsRunning(false)
          setIsPaused(false)
          setRemaining(60)
          setPhase("idle")
        }}
      />

      <TimerSettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Example settings drawer. Add your timer configuration here.
          </p>
        </div>
      </TimerSettingsDrawer>
    </TimerLayout>
  )
}
