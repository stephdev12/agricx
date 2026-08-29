import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all",
      className
    )}
    {...props}
  />
))
InputGroup.displayName = "InputGroup"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "block-start" | "block-end" }
>(({ className, align = "block-end", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 px-3 py-2 border-t border-neutral-100",
      align === "block-start" && "border-t-0 border-b",
      className
    )}
    {...props}
  />
))
InputGroupAddon.displayName = "InputGroupAddon"

export interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "icon" | "icon-sm" | "default"
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, variant = "ghost", size = "icon-sm", ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
      size === "icon-sm" && "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
      size === "icon" && "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
      variant === "ghost" && "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
      variant === "outline" && "border border-neutral-200 text-neutral-700 hover:bg-neutral-50",
      variant === "default" && "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs",
      className
    )}
    {...props}
  />
))
InputGroupButton.displayName = "InputGroupButton"

export { InputGroup, InputGroupAddon, InputGroupButton }
