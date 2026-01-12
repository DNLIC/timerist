"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface TimerProgressBarProps {
  /** Current progress value (0-100) */
  value: number
  /** Custom progress color */
  progressColor?: string
  /** Additional className */
  className?: string
  /** Height of progress bar */
  height?: "sm" | "md" | "lg"
}

export function TimerProgressBar({
  value,
  progressColor,
  className,
  height = "md",
}: TimerProgressBarProps) {
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2 md:h-3 lg:h-4",
    lg: "h-3 md:h-4 lg:h-5",
  }

  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-primary/20",
        "max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-xl xl:max-w-2xl",
        heightClasses[height],
        className
      )}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: progressColor || undefined,
        }}
      />
    </ProgressPrimitive.Root>
  )
}
