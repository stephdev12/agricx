import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90 shadow-xs",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline: "border border-border bg-card/80 text-foreground hover:bg-muted/80 backdrop-blur-xs",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        emerald: "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-xs",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
