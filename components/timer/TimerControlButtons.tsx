"use client"

import * as React from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TimerControlButtonsProps {
  /** Whether timer is running */
  isRunning: boolean
  /** Whether timer is paused */
  isPaused: boolean
  /** Callback when start is clicked */
  onStart: () => void
  /** Callback when pause is clicked */
  onPause: () => void
  /** Callback when resume is clicked */
  onResume: () => void
  /** Callback when reset is clicked */
  onReset: () => void
  /** Additional className */
  className?: string
  /** Show text labels (default: true on sm+) */
  showLabels?: boolean
}

export function TimerControlButtons({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  className,
  showLabels = true,
}: TimerControlButtonsProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center",
        "gap-3 sm:gap-4 md:gap-6 lg:gap-8",
        "mt-4 sm:mt-6 md:mt-8 lg:mt-10",
        // Reduce margin and gap in landscape to keep buttons visible
        "timer-buttons-landscape",
        "w-full",
        // Ensure buttons stay visible in landscape
        "flex-shrink-0",
        // Prevent buttons from wrapping too early
        "flex-wrap sm:flex-nowrap",
        // Ensure buttons are clickable
        "relative z-20",
        className
      )}
    >
      {!isRunning && !isPaused && (
        <Button
          size="lg"
          className="h-12 w-32 sm:h-14 sm:w-40 md:h-16 md:w-48 lg:h-20 lg:w-64 text-base sm:text-lg md:text-xl font-semibold"
          onClick={onStart}
          aria-label="Start timer"
        >
          <Play
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2"
            aria-hidden="true"
          />
          {showLabels && <span className="hidden sm:inline">Start</span>}
        </Button>
      )}
      {isRunning && !isPaused && (
        <Button
          size="lg"
          variant="secondary"
          className="h-12 w-32 sm:h-14 sm:w-40 md:h-16 md:w-48 lg:h-20 lg:w-64 text-base sm:text-lg md:text-xl font-semibold"
          onClick={onPause}
          aria-label="Pause timer"
        >
          <Pause
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2"
            aria-hidden="true"
          />
          {showLabels && <span className="hidden sm:inline">Pause</span>}
        </Button>
      )}
      {isPaused && (
        <Button
          size="lg"
          className="h-12 w-32 sm:h-14 sm:w-40 md:h-16 md:w-48 lg:h-20 lg:w-64 text-base sm:text-lg md:text-xl font-semibold"
          onClick={onResume}
          aria-label="Resume timer"
        >
          <Play
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2"
            aria-hidden="true"
          />
          {showLabels && <span className="hidden sm:inline">Resume</span>}
        </Button>
      )}
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-44 lg:h-20 lg:w-60 text-base sm:text-lg md:text-xl font-semibold"
        onClick={onReset}
        aria-label="Reset timer"
      >
        <RotateCcw
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2"
          aria-hidden="true"
        />
        {showLabels && <span className="hidden sm:inline">Reset</span>}
      </Button>
    </div>
  )
}
