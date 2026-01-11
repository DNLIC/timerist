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
        className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Header with menu button */}
        <header className="flex justify-end p-1 sm:p-2 md:p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
            aria-label="Open settings menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" aria-hidden="true" />
          </Button>
        </header>

        {/* Main timer display - takes 60-70% of screen height */}
        <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden">
          {/* Phase indicator */}
          <div className="mb-1 sm:mb-2 md:mb-4">
            <span
              className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-muted-foreground uppercase tracking-wide"
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
            </span>
          </div>

          {/* Timer display - huge scalable font with proper width constraints */}
          <div className="relative w-full max-w-full flex items-center justify-center mb-2 sm:mb-4 md:mb-6 lg:mb-8 overflow-hidden">
            <div
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-bold font-mono tabular-nums leading-none select-none whitespace-nowrap"
              style={{ color: textColor }}
              aria-live="polite"
              aria-atomic="true"
            >
              {formatTime(remaining)}
            </div>

            {/* Progress ring (SVG) */}
            <svg
              className="absolute inset-0 w-full h-full max-w-full -z-10 overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-secondary opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={progressColor}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
            </svg>
          </div>

          {/* Progress bar (alternative) */}
          <div className="w-full max-w-md mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-2">
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>

          {/* Control buttons - smaller and side-by-side on mobile */}
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full max-w-md sm:max-w-lg md:max-w-2xl px-2">
            {!isRunning && !isPaused && (
              <Button
                onClick={handleStart}
                size="lg"
                className="h-12 flex-1 sm:h-14 sm:flex-initial sm:w-32 md:h-16 md:w-40 text-base sm:text-lg md:text-xl font-semibold active:scale-95 transition-transform"
                aria-label="Start countdown timer"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Start</span>
                <span className="sm:hidden">▷</span>
              </Button>
            )}

            {isRunning && !isPaused && (
              <Button
                onClick={handlePause}
                size="lg"
                variant="secondary"
                className="h-12 flex-1 sm:h-14 sm:flex-initial sm:w-32 md:h-16 md:w-40 text-base sm:text-lg md:text-xl font-semibold active:scale-95 transition-transform"
                aria-label="Pause countdown timer"
              >
                <Pause className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Pause</span>
                <span className="sm:hidden">⏸</span>
              </Button>
            )}

            {isPaused && (
              <Button
                onClick={handleResume}
                size="lg"
                className="h-12 flex-1 sm:h-14 sm:flex-initial sm:w-32 md:h-16 md:w-40 text-base sm:text-lg md:text-xl font-semibold active:scale-95 transition-transform"
                aria-label="Resume countdown timer"
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Resume</span>
                <span className="sm:hidden">▷</span>
              </Button>
            )}

            <Button
              onClick={handleReset}
              size="lg"
              variant="outline"
              className="h-12 flex-1 sm:h-14 sm:flex-initial sm:w-32 md:h-16 md:w-40 text-base sm:text-lg md:text-xl font-semibold active:scale-95 transition-transform"
              aria-label="Reset countdown timer"
            >
              <RotateCcw
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Reset</span>
              <span className="sm:hidden">↻</span>
            </Button>
          </div>
        </main>

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
