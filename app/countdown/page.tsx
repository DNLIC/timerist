"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Menu, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  TimerLayout,
  TimerDisplay,
  TimerStatusLabel,
  TimerControlButtons,
  TimerProgressBar,
  TimerSettingsDrawer,
  type TimerPhase,
} from "@/components/timer"

// Main Countdown Timer Component
export default function CountdownTimerPage() {
  // Timer state
  const [duration, setDuration] = useState(60) // Total duration in seconds
  const [remaining, setRemaining] = useState(60) // Remaining time in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [phase, setPhase] = useState<TimerPhase>("idle")

  // Settings state
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [bgColor, setBgColor] = useState("#ffffff")
  const [textColor, setTextColor] = useState("#000000")
  const [progressColor, setProgressColor] = useState("#3b82f6")
  
  // Version and build info state
  const [appVersion, setAppVersion] = useState<string>("")
  const [buildTime, setBuildTime] = useState<string>("")
  const [buildDate, setBuildDate] = useState<string>("")

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

  // Load version and build info
  useEffect(() => {
    const loadVersionInfo = async () => {
      try {
        const response = await fetch('/version.json?t=' + Date.now())
        if (response.ok) {
          const data = await response.json()
          setAppVersion(data.version || "")
          setBuildTime(data.buildTime || "")
          setBuildDate(data.buildDate || "")
        }
      } catch (error) {
        console.warn("Could not load version info:", error)
      }
    }
    loadVersionInfo()
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

  // Calculate progress percentage
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0

  return (
    <TimerLayout
      maxWidth="6xl"
      leftHeaderContent={
        <Link href="/" className="text-4xl font-bold text-foreground hover:opacity-80 transition-opacity">
          Timerist
        </Link>
      }
      headerContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open settings menu"
          className="h-10 w-10"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      }
    >
      {/* Status label */}
      <TimerStatusLabel phase={phase} />

      {/* Timer display */}
      <TimerDisplay time={remaining} textColor={textColor} />

      {/* Progress bar */}
      <TimerProgressBar value={progress} progressColor={progressColor} />

      {/* Control buttons */}
      <TimerControlButtons
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
      />

      {/* Settings Drawer */}
      <TimerSettingsDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>

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
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Used in fitness for planks, stretches, recovery periods, or any
                      single-duration timing. Simple and distraction-free.
                    </p>
                    
                    {/* Version and Build Info */}
                    <div className="pt-4 border-t border-border space-y-3">
                      {appVersion && (
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Version
                          </Label>
                          <p className="text-sm font-mono text-foreground mt-1">
                            {appVersion}
                          </p>
                        </div>
                      )}
                      {buildDate && (
                        <div>
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Build Date & Time
                          </Label>
                          <p className="text-sm text-foreground mt-1">
                            {buildDate}
                          </p>
                          {buildTime && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              {new Date(buildTime).toISOString()}
                            </p>
                          )}
                        </div>
                      )}
                      {!appVersion && !buildDate && (
                        <p className="text-xs text-muted-foreground italic">
                          Version information not available
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
      </TimerSettingsDrawer>

      {/* Toast notifications */}
      <Toaster />
    </TimerLayout>
  )
}
