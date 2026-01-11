"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Menu, Play, Pause, RotateCcw, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// Main Countdown Timer Component
export default function CountdownTimerPage() {
  // Timer state
  const [duration, setDuration] = useState(60) // Total duration in seconds
  const [remaining, setRemaining] = useState(60) // Remaining time in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phase, setPhase] = useState<"idle" | "running" | "paused" | "complete">(
    "idle"
  )

  // Settings state
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [bgColor, setBgColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [progressColor, setProgressColor] = useState("#3b82f6")

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const { theme, setTheme } = useTheme()

  // Load from localStorage on mount
  useEffect(() => {
    const savedDuration = localStorage.getItem("countdown-duration")
    const savedRemaining = localStorage.getItem("countdown-remaining")
    const savedAudio = localStorage.getItem("countdown-audio-enabled")

    if (savedDuration) {
      const total = parseInt(savedDuration, 10)
      setDuration(total)
      setMinutes(Math.floor(total / 60))
      setSeconds(total % 60)
    }
    if (savedRemaining) {
      setRemaining(parseInt(savedRemaining, 10))
    }
    if (savedAudio !== null) {
      setAudioEnabled(savedAudio === "true")
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("countdown-duration", duration.toString())
    localStorage.setItem("countdown-remaining", remaining.toString())
    localStorage.setItem("countdown-audio-enabled", audioEnabled.toString())
  }, [duration, remaining, audioEnabled])

  // Initialize audio context
  const initAudioContext = useCallback(async () => {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }
      return audioContextRef.current
    }

    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContextClass()
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }
      return audioContextRef.current
    } catch (error) {
      console.warn("Failed to create audio context:", error)
      return null
    }
  }, [])

  // Play beep sound
  const playBeep = useCallback(async () => {
    if (!audioEnabled) return

    const ctx = await initAudioContext()
    if (!ctx) return

    try {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 880
      gainNode.gain.value = 0.3

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.2)
    } catch (error) {
      console.warn("Failed to play beep:", error)
    }
  }, [audioEnabled, initAudioContext])

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          const newRemaining = prev - 1
          if (newRemaining <= 0) {
            setIsRunning(false)
            setPhase("complete")
            playBeep()
            if (navigator.vibrate) {
              navigator.vibrate(200)
            }
            toast("Time's up!", {
              description: "Countdown completed",
            })
            // Flash effect
            document.body.style.backgroundColor = progressColor
            setTimeout(() => {
              document.body.style.backgroundColor = ""
            }, 300)
            return 0
          }
          return newRemaining
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
  }, [isRunning, isPaused, remaining, playBeep, progressColor])

  // Update phase based on state
  useEffect(() => {
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

  // Handlers
  const handleStart = () => {
    if (remaining === 0) {
      setRemaining(duration)
    }
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleResume = () => {
    setIsPaused(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setRemaining(duration)
    setPhase("idle")
  }

  const handleMinutesChange = (value: number) => {
    const newMinutes = Math.max(0, Math.min(59, value))
    setMinutes(newMinutes)
    const total = newMinutes * 60 + seconds
    setDuration(total)
    if (!isRunning && !isPaused) {
      setRemaining(total)
    }
  }

  const handleSecondsChange = (value: number) => {
    const newSeconds = Math.max(0, Math.min(59, value))
    setSeconds(newSeconds)
    const total = minutes * 60 + newSeconds
    setDuration(total)
    if (!isRunning && !isPaused) {
      setRemaining(total)
    }
  }

  const handlePreset = (totalSeconds: number) => {
    setMinutes(Math.floor(totalSeconds / 60))
    setSeconds(totalSeconds % 60)
    setDuration(totalSeconds)
    if (!isRunning && !isPaused) {
      setRemaining(totalSeconds)
    }
  }

  // Format time as MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0

  return (
      <div
        className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 sm:px-8 md:px-12 py-2 md:py-6 relative"
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 0.5rem)`,
          paddingBottom: `calc(env(safe-area-inset-bottom) + 0.5rem)`,
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Header with hamburger (tight top padding) */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open settings menu"
            className="h-10 w-10"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>

        {/* Content wrapper - centered, constrained width with more padding */}
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center space-y-3 md:space-y-6 px-2 -mt-8 sm:-mt-6">
          {/* Status label (READY/COMPLETE) - smaller font, tight margin */}
          <h2
            className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide"
            aria-live="polite"
            aria-atomic="true"
          >
            {phase === "running"
              ? "Running"
              : phase === "paused"
                ? "Paused"
                : phase === "complete"
                  ? "Complete"
                  : "Ready"}
          </h2>

          {/* Prominent timer digits - smaller on mobile to prevent overflow */}
          <div className="text-center font-mono font-bold leading-none w-full overflow-hidden">
            <span
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] tabular-nums inline-block"
              style={{ color: textColor }}
              aria-live="polite"
              aria-atomic="true"
            >
              {formatTime(remaining)}
            </span>
          </div>

          {/* Progress bar - constrained width */}
          <Progress value={progress} className="w-full max-w-[280px] sm:max-w-xs h-2 md:h-3" />

          {/* Controls - Start on left, Reset on right */}
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-2 md:mt-4 w-full">
            {!isRunning && !isPaused && (
              <Button
                size="lg"
                className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-56 text-base sm:text-lg"
                onClick={handleStart}
                aria-label="Start countdown timer"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Start</span>
              </Button>
            )}
            {isRunning && !isPaused && (
              <Button
                size="lg"
                variant="secondary"
                className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-56 text-base sm:text-lg"
                onClick={handlePause}
                aria-label="Pause countdown timer"
              >
                <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Pause</span>
              </Button>
            )}
            {isPaused && (
              <Button
                size="lg"
                className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-56 text-base sm:text-lg"
                onClick={handleResume}
                aria-label="Resume countdown timer"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Resume</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-24 sm:h-14 sm:w-28 md:h-16 md:w-40 text-base sm:text-lg"
              onClick={handleReset}
              aria-label="Reset countdown timer"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>

        {/* Settings Drawer */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="text-left">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-xl sm:text-2xl">Settings</DrawerTitle>
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close settings"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="px-4 sm:px-6 pb-6 overflow-y-auto">

            {/* Accordion for settings sections */}
            <Accordion type="single" collapsible className="space-y-2">
              {/* Timer Setup */}
              <AccordionItem value="setup">
                <AccordionTrigger className="text-left">
                  Setup Content
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minutes">Minutes</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) =>
                            handleMinutesChange(parseInt(e.target.value) || 0)
                          }
                          disabled={isRunning || isPaused}
                          aria-label="Minutes input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seconds">Seconds</Label>
                        <Input
                          id="seconds"
                          type="number"
                          min="0"
                          max="59"
                          value={seconds}
                          onChange={(e) =>
                            handleSecondsChange(parseInt(e.target.value) || 0)
                          }
                          disabled={isRunning || isPaused}
                          aria-label="Seconds input"
                        />
                      </div>
                    </div>

                    {/* Preset buttons */}
                    <div className="space-y-2">
                      <Label>Quick Presets</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: "30s", value: 30 },
                          { label: "1min", value: 60 },
                          { label: "2min", value: 120 },
                          { label: "5min", value: 300 },
                        ].map((preset) => (
                          <Button
                            key={preset.value}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreset(preset.value)}
                            disabled={isRunning || isPaused}
                            className="text-sm"
                            aria-label={`Set timer to ${preset.label}`}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Audio toggle */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audio-toggle">Audio Feedback</Label>
                      <Button
                        id="audio-toggle"
                        variant={audioEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        aria-label={`Audio feedback ${audioEnabled ? "enabled" : "disabled"}`}
                      >
                        {audioEnabled ? "On" : "Off"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Color Setup */}
              <AccordionItem value="colors">
                <AccordionTrigger className="text-left">
                  Setup Colors
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between">
                      <Label>Dark Mode</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Moon className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>

                    {/* Color presets */}
                    <div className="space-y-2">
                      <Label>Timer Text Color</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          "#000000",
                          "#ffffff",
                          "#3b82f6",
                          "#ef4444",
                        ].map((color) => (
                          <button
                            key={color}
                            className={cn(
                              "h-10 w-full rounded border-2 transition-all",
                              textColor === color
                                ? "border-primary ring-2 ring-ring"
                                : "border-border"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setTextColor(color)}
                            aria-label={`Set text color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Progress Color</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          "#3b82f6",
                          "#10b981",
                          "#f59e0b",
                          "#ef4444",
                        ].map((color) => (
                          <button
                            key={color}
                            className={cn(
                              "h-10 w-full rounded border-2 transition-all",
                              progressColor === color
                                ? "border-primary ring-2 ring-ring"
                                : "border-border"
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setProgressColor(color)}
                            aria-label={`Set progress color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* About This Timer */}
              <AccordionItem value="about">
                <AccordionTrigger className="text-left">
                  About This Timer
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Basic countdown for timed holds, rests, warm-ups. Set duration,
                    start, pause anytime. Beeps at end.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* General Info */}
              <AccordionItem value="info">
                <AccordionTrigger className="text-left">
                  General Info
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Used in fitness for planks, stretches, recovery periods, or any
                    single-duration timing. Simple and distraction-free.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Toast notifications */}
        <Toaster />
      </div>
  )
}
