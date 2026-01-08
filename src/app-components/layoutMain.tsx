"use client"

import React from "react"
import { useSidebar } from "@/components/ui/sidebar"

export default function LayoutMain({ children }: { children: React.ReactNode }) {
  const { isMobile, state } = useSidebar()

  // Determine sidebar offset based on state
  const sidebarOffset = isMobile
    ? "0px"
    : state === "collapsed"
    ? "var(--sidebar-width-icon)"
    : "var(--sidebar-width)"

  return (
    <main
      style={{
        marginLeft: sidebarOffset,
        transition: "margin-left 200ms linear",
      }}
      className="flex-1 min-h-screen p-4"
    >
      {children}
    </main>
  )
}
