"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, User, Home, ChevronRight, Sun, Moon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
      <nav className="flex items-center text-sm text-card-foreground/70">
        <SidebarTrigger />
        {/* <Link href="/" className="flex items-center text-sm text-foreground hover:underline">
          <Home className="w-4 h-4 mr-2" />
          <span>Home</span>
        </Link> */}
        {segments.map((seg, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          const label = decodeURIComponent(seg).replace(/-/g, " ");
          return (
            <div key={idx} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
              <Link
                href={href}
                className="capitalize text-sm text-foreground hover:underline"
              >
                {label}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="group p-2 rounded-md transition-colors
                    hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {currentTheme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
          ) : (
            <Moon
              className="w-5 h-5 text-gray-800 dark:text-gray-200
                            group-hover:text-gray-900 dark:group-hover:text-white"
            />
          )}
        </button>

        <button
          aria-label="Notifications"
          className="group p-2 rounded-md transition-colors hover:bg-gray-100"
        >
          <Bell className="w-5 h-5 dark:text-white dark:group-hover:text-gray-900" />
        </button>
        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center overflow-hidden">
          <User className="w-5 h-5 text-sidebar-accent-foreground" />
        </div>
      </div>
    </div>
  );
}
