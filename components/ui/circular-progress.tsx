"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface CircularProgressProps {
  /** Current value (0-100) */
  value: number
  /** Maximum value (for calculating percentage) */
  max?: number
  /** Current value (alternative to percentage) */
  current?: number
  /** Size of the circle in pixels */
  size?: number
  /** Stroke width of the progress ring */
  strokeWidth?: number
  /** Color for Work phase */
  workColor?: string
  /** Color for Rest phase */
  restColor?: string
  /** Current phase (Work or Rest) */
  phase?: "Work" | "Rest" | string
  /** Additional className */
  className?: string
  /** Whether to show animated transition */
  animated?: boolean
}

export function CircularProgress({
  value,
  max = 100,
  current,
  size = 200,
  strokeWidth = 10,
  workColor,
  restColor,
  phase,
  className,
  animated = true,
}: CircularProgressProps) {
  // Calculate percentage - show elapsed progress (how much time has passed)
  const percentage = current !== undefined && max !== undefined && max > 0
    ? Math.min(100, Math.max(0, ((max - current) / max) * 100))
    : Math.min(100, Math.max(0, value))

  // Determine color based on phase - red for Work, green for Rest
  const progressColor = React.useMemo(() => {
    if (phase) {
      const phaseLower = phase.toLowerCase()
      if (phaseLower === "work") {
        return workColor || "hsl(var(--destructive))" // Red (destructive color)
      } else if (phaseLower === "rest") {
        return restColor || "hsl(var(--secondary))" // Green (secondary color)
      }
    }
    return workColor || "hsl(var(--primary))"
  }, [phase, workColor, restColor])

  // SVG circle calculations
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center flex-shrink-0", className)}
      style={{ 
        width: "100%", 
        height: "100%",
        aspectRatio: "1",
        minWidth: 0,
        minHeight: 0
      }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={current !== undefined ? current : value}
      aria-label={`Progress: ${Math.round(percentage)}%`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted) / 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            animated 
              ? "transition-all duration-1000 ease-linear" 
              : "transition-all duration-300 ease-out"
          )}
          style={{
            strokeDashoffset: offset,
          }}
        />
      </svg>
    </div>
  )
}
