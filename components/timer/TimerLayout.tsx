"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimerLayoutProps {
  children: React.ReactNode
  className?: string
  /** Maximum width constraints for responsive layout */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full"
  /** Additional header content (e.g., menu button) */
  headerContent?: React.ReactNode
}

export function TimerLayout({
  children,
  className,
  maxWidth = "6xl",
  headerContent,
}: TimerLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground flex flex-col items-center",
        // In landscape, use justify-between to ensure buttons stay visible
        "justify-center",
        "px-6 sm:px-8 md:px-12 lg:px-16",
        "py-4 md:py-8 lg:py-12",
        "timer-layout-landscape",
        "relative",
        className
      )}
      style={{
        paddingTop: `calc(env(safe-area-inset-top) + 1rem)`,
        paddingBottom: `calc(env(safe-area-inset-bottom) + 1rem)`,
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {/* Header content (e.g., menu button) */}
      {headerContent && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4 lg:top-6 lg:right-6 z-10">
          {headerContent}
        </div>
      )}

      {/* Content wrapper - responsive width constraints with better vertical spacing */}
      <div
        className={cn(
          "w-full flex flex-col items-center",
          // Use justify-start in landscape to ensure buttons stay at bottom
          "justify-center",
          // Reduce spacing in landscape mode via CSS class
          "space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10",
          "timer-content-landscape",
          "px-2 overflow-visible",
          "min-h-0 flex-1", // Allow flex to grow and fill space
          maxWidthClasses[maxWidth]
        )}
        style={{
          // Use viewport height for better vertical utilization on tablets
          // In landscape, ensure we don't exceed viewport height
          minHeight: "min(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 4rem, 600px)",
        }}
      >
        {children}
      </div>
    </div>
  )
}
