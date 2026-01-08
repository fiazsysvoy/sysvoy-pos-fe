"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, User, Home, ChevronRight, Sun, Moon } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"

export default function Navbar() {
  const pathname = usePathname() || "/"
  const segments = pathname.split("/").filter(Boolean)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme

  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
      <nav className="flex items-center text-sm text-card-foreground/70">
                <SidebarTrigger />
        {/* <Link href="/" className="flex items-center text-sm text-foreground hover:underline">
          <Home className="w-4 h-4 mr-2" />
          <span>Home</span>
        </Link> */}
        {segments.map((seg, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/")
          const label = decodeURIComponent(seg).replace(/-/g, " ")
          return (
            <div key={idx} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
              <Link href={href} className="capitalize text-sm text-foreground hover:underline">
                {label}
              </Link>
            </div>
          )
        })}
      </nav>

      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {currentTheme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <button aria-label="Notifications" className="p-2 rounded-md hover:bg-gray-100">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center overflow-hidden">
          <User className="w-5 h-5 text-sidebar-accent-foreground" />
        </div>
      </div>
    </div>
  )
}
