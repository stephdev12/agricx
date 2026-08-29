import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    default: "w-4 h-4",
    lg: "w-6 h-6",
  }

  return (
    <div
      role="status"
      aria-label="Chargement..."
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-emerald-600", sizeClasses[size])} />
      <span className="sr-only">Chargement...</span>
    </div>
  )
}
