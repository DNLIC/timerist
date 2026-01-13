"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimerDisplayProps {
  /** Time in seconds to display */
  time: number
  /** Custom text color */
  textColor?: string
  /** Additional className */
  className?: string
  /** Minimum font size (default: 3rem) */
  minSize?: string
  /** Maximum font size (default: 10rem) */
  maxSize?: string
  /** Viewport-based scaling factor (default: 12vw) */
  scaleFactor?: string
}

export function TimerDisplay({
  time,
  textColor,
  className,
  minSize,
  maxSize,
  scaleFactor,
}: TimerDisplayProps) {
  // Format time as MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  // If custom scaling props are provided, use them; otherwise use responsive class
  const useCustomScaling = minSize && maxSize && scaleFactor
  const customStyle = useCustomScaling
    ? {
        fontSize: `clamp(${minSize}, ${scaleFactor}, ${maxSize})`,
      }
    : undefined

  return (
    <div
      className={cn(
        "text-center font-mono font-bold leading-none w-full overflow-visible px-2",
        "flex items-center justify-center",
        // Ensure minimum height for better vertical space usage on tablets
        "min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px]",
        // Reduce min-height in landscape to save space
        "timer-display-landscape",
        className
      )}
    >
      <span
        className={cn(
          "tabular-nums inline-block whitespace-nowrap",
          !useCustomScaling && "timer-display-text-responsive"
        )}
        style={{
          color: textColor,
          lineHeight: "1",
          ...customStyle,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(time)}
      </span>
    </div>
  )
}
