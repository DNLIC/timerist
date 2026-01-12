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
        "flex flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mt-2 md:mt-4 lg:mt-6 w-full",
        className
      )}
    >
      {!isRunning && !isPaused && (
        <Button
          size="lg"
          className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-56 lg:h-20 lg:w-72 text-base sm:text-lg md:text-xl"
          onClick={onStart}
          aria-label="Start timer"
        >
          <Play
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2"
            aria-hidden="true"
          />
          {showLabels && <span className="hidden sm:inline">Start</span>}
        </Button>
      )}
      {isRunning && !isPaused && (
        <Button
          size="lg"
          variant="secondary"
          className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-56 lg:h-20 lg:w-72 text-base sm:text-lg md:text-xl"
          onClick={onPause}
          aria-label="Pause timer"
        >
          <Pause
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2"
            aria-hidden="true"
          />
          {showLabels && <span className="hidden sm:inline">Pause</span>}
        </Button>
      )}
      {isPaused && (
        <Button
          size="lg"
          className="h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-56 lg:h-20 lg:w-72 text-base sm:text-lg md:text-xl"
          onClick={onResume}
          aria-label="Resume timer"
        >
          <Play
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2"
            aria-hidden="true"
          />
          {showLabels && <span className="hidden sm:inline">Resume</span>}
        </Button>
      )}
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-24 sm:h-14 sm:w-28 md:h-16 md:w-40 lg:h-20 lg:w-56 text-base sm:text-lg md:text-xl"
        onClick={onReset}
        aria-label="Reset timer"
      >
        <RotateCcw
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-1.5 sm:mr-2"
          aria-hidden="true"
        />
        {showLabels && <span className="hidden sm:inline">Reset</span>}
      </Button>
    </div>
  )
}
