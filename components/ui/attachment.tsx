import * as React from "react"
import { cn } from "@/lib/utils"

const AttachmentGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-wrap gap-3 items-center", className)}
    {...props}
  />
))
AttachmentGroup.displayName = "AttachmentGroup"

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  state?: "idle" | "uploading" | "error"
  variant?: "default" | "compact" | "card"
}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  ({ className, orientation = "horizontal", state = "idle", variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl border border-border bg-card/90 p-3 text-sm transition-all duration-200 hover:border-border/80 hover:shadow-xs",
          variant === "compact" && "p-2 gap-2 text-xs rounded-xl",
          variant === "card" && "flex-col items-start w-40 p-3 gap-2",
          orientation === "vertical" && "flex-col items-start w-36 p-2.5 gap-2",
          state === "uploading" && "border-emerald-500/40 bg-emerald-500/10",
          className
        )}
        {...props}
      />
    )
  }
)
Attachment.displayName = "Attachment"

export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "icon" | "image"
  src?: string
  alt?: string
}

const AttachmentMedia = React.forwardRef<HTMLDivElement, AttachmentMediaProps>(
  ({ className, variant = "icon", src, alt, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted border border-border text-muted-foreground [&_svg]:w-5 [&_svg]:h-5",
          variant === "image" && "w-full h-24 rounded-lg bg-muted",
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Media preview"}
            className="h-full w-full object-cover"
          />
        ) : (
          children
        )}
      </div>
    )
  }
)
AttachmentMedia.displayName = "AttachmentMedia"

const AttachmentContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 flex-1 flex-col justify-center", className)}
    {...props}
  />
))
AttachmentContent.displayName = "AttachmentContent"

const AttachmentTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "truncate text-xs font-semibold text-foreground leading-tight",
      className
    )}
    {...props}
  />
))
AttachmentTitle.displayName = "AttachmentTitle"

const AttachmentDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("truncate text-[11px] text-muted-foreground mt-0.5", className)}
    {...props}
  />
))
AttachmentDescription.displayName = "AttachmentDescription"

const AttachmentActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1 shrink-0 ml-auto", className)}
    {...props}
  />
))
AttachmentActions.displayName = "AttachmentActions"

export interface AttachmentActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const AttachmentAction = React.forwardRef<
  HTMLButtonElement,
  AttachmentActionProps
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:w-3.5 [&_svg]:h-3.5",
      className
    )}
    {...props}
  />
))
AttachmentAction.displayName = "AttachmentAction"

export {
  AttachmentGroup,
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
}
