import * as React from "react"
import { cn } from "@/lib/utils"

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end"
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, align = "start", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full gap-3",
        align === "end" ? "flex-row-reverse" : "flex-row",
        className
      )}
      {...props}
    />
  )
)
Message.displayName = "Message"

const MessageAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-8 w-8 shrink-0 select-none items-center justify-center mt-0.5", className)}
    {...props}
  />
))
MessageAvatar.displayName = "MessageAvatar"

const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%]", className)}
    {...props}
  />
))
MessageContent.displayName = "MessageContent"

export { Message, MessageAvatar, MessageContent }
