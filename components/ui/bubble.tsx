import * as React from "react"
import { cn } from "@/lib/utils"

const BubbleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
))
BubbleGroup.displayName = "BubbleGroup"

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "primary"
}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-prose shadow-xs",
        variant === "default" && "bg-emerald-600 text-white rounded-br-xs",
        variant === "muted" && "bg-card/90 text-foreground rounded-bl-xs border border-border/80 backdrop-blur-md",
        variant === "primary" && "bg-foreground text-background",
        className
      )}
      {...props}
    />
  )
)
Bubble.displayName = "Bubble"

const BubbleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("whitespace-pre-wrap", className)} {...props} />
))
BubbleContent.displayName = "BubbleContent"

export { Bubble, BubbleContent, BubbleGroup }
