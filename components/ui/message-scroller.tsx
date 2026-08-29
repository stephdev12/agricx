"use client"

import * as React from "react"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageScrollerContextType {
  viewportRef: React.RefObject<HTMLDivElement | null>
  isAtBottom: boolean
  scrollToBottom: () => void
}

const MessageScrollerContext =
  React.createContext<MessageScrollerContextType | null>(null)

export function useMessageScroller() {
  const context = React.useContext(MessageScrollerContext)
  if (!context) {
    throw new Error(
      "useMessageScroller must be used within MessageScrollerProvider"
    )
  }
  return context
}

export function MessageScrollerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)

  const scrollToBottom = React.useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [])

  const handleScroll = React.useCallback(() => {
    if (!viewportRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current
    const distanceToBottom = scrollHeight - scrollTop - clientHeight
    setIsAtBottom(distanceToBottom < 40)
  }, [])

  React.useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <MessageScrollerContext.Provider
      value={{ viewportRef, isAtBottom, scrollToBottom }}
    >
      {children}
    </MessageScrollerContext.Provider>
  )
}

export function MessageScroller({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative flex h-full flex-col", className)} {...props}>
      {children}
    </div>
  )
}

export function MessageScrollerViewport({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { viewportRef } = useMessageScroller()
  return (
    <div
      ref={viewportRef}
      className={cn("flex-1 overflow-y-auto overscroll-contain", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function MessageScrollerContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="log"
      aria-relevant="additions"
      className={cn("flex flex-col gap-4 p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function MessageScrollerButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isAtBottom, scrollToBottom } = useMessageScroller()

  if (isAtBottom) return null

  return (
    <button
      type="button"
      onClick={scrollToBottom}
      aria-label="Scroll to bottom"
      className={cn(
        "absolute bottom-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border text-foreground shadow-md transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-emerald-500",
        className
      )}
      {...props}
    >
      <ArrowDown className="h-4 w-4" />
    </button>
  )
}
