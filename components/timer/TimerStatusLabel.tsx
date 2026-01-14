"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type TimerPhase = "idle" | "running" | "paused" | "complete"

export interface TimerStatusLabelProps {
  phase: TimerPhase
  /** Custom status labels */
  labels?: {
    idle?: string
    running?: string
    paused?: string
    complete?: string
  }
  className?: string
}

export function TimerStatusLabel({
  phase,
  labels,
  className,
}: TimerStatusLabelProps) {
  const defaultLabels = {
    idle: "Ready",
    running: "Running",
    paused: "Paused",
    complete: "Complete",
  }

  const displayLabel =
    labels?.[phase] ?? defaultLabels[phase] ?? defaultLabels.idle

  return (
    <h2
      className={cn(
        "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide",
        "text-center w-full",
        // Prevent from touching top of screen
        "mt-8 sm:mt-12 md:mt-16",
        className
      )}
      style={{
        // Margin bottom equals the line height (which matches the font size)
        // This ensures spacing equals the height of the status text
        marginBottom: "1lh", // 1 line-height unit = height of the text
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {displayLabel}
    </h2>
  )
}
