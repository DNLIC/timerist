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

  const labelRef = React.useRef<HTMLHeadingElement>(null)
  const [marginBottom, setMarginBottom] = React.useState<string>("0")

  React.useEffect(() => {
    const updateSpacing = () => {
      if (labelRef.current) {
        // Get the actual rendered height of the status label
        const height = labelRef.current.getBoundingClientRect().height
        // Set margin-bottom to equal the height
        setMarginBottom(`${height}px`)
      }
    }

    // Update on mount and when label changes
    updateSpacing()

    // Update on window resize
    window.addEventListener("resize", updateSpacing)
    
    // Use ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(updateSpacing)
    if (labelRef.current) {
      resizeObserver.observe(labelRef.current)
    }

    return () => {
      window.removeEventListener("resize", updateSpacing)
      resizeObserver.disconnect()
    }
  }, [displayLabel])

  return (
    <h2
      ref={labelRef}
      className={cn(
        "font-semibold tracking-wide text-center w-full",
        "timer-status-label-responsive",
        // Prevent from touching top of screen
        "mt-8 sm:mt-12 md:mt-16",
        // Reduce top margin in landscape on mobile
        "timer-status-landscape-mobile",
        // Remove default margins to ensure precise spacing
        "m-0 p-0",
        // Ensure it doesn't block pointer events - make it non-interactive
        "pointer-events-none",
        // Ensure it's below interactive elements
        "relative z-0",
        className
      )}
      style={{
        // Margin bottom equals the actual rendered height of the status text
        marginBottom: marginBottom,
        // Ensure line-height is exactly 1 so height equals font-size
        lineHeight: "1",
        // Remove any default display margins
        display: "block",
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="pointer-events-none">{displayLabel}</span>
    </h2>
  )
}
