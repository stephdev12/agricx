"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-9 h-9 text-neutral-500 rounded-xl"
        aria-label="Changer de thème"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-9 h-9 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer ${className || ""}`}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label="Basculer le mode sombre"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-700 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </Button>
  )
}
