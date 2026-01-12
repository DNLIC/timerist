"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
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
import { X } from "lucide-react"

export interface TimerSettingsDrawerProps {
  /** Whether drawer is open */
  open: boolean
  /** Callback when drawer open state changes */
  onOpenChange: (open: boolean) => void
  /** Drawer title */
  title?: string
  /** Settings sections */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

export function TimerSettingsDrawer({
  open,
  onOpenChange,
  title = "Settings",
  children,
  className,
}: TimerSettingsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={className || "max-h-[85vh]"}>
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl sm:text-2xl">{title}</DrawerTitle>
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
        <div className="px-4 sm:px-6 pb-6 overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
