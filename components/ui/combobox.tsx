"use client"

import * as React from "react"
import { Check, X, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComboboxContextType {
  selectedValues: string[]
  toggleValue: (value: string) => void
  removeValue: (value: string) => void
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  filterQuery: string
  setFilterQuery: React.Dispatch<React.SetStateAction<string>>
}

const ComboboxContext = React.createContext<ComboboxContextType | null>(null)

export function useComboboxAnchor() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  return ref
}

export interface ComboboxProps {
  multiple?: boolean
  autoHighlight?: boolean
  items?: readonly string[] | string[]
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (values: string[]) => void
  children: React.ReactNode
}

export function Combobox({
  defaultValue = [],
  value,
  onValueChange,
  children,
}: ComboboxProps) {
  const [internalValues, setInternalValues] = React.useState<string[]>(
    value || defaultValue
  )
  const [isOpen, setIsOpen] = React.useState(false)
  const [filterQuery, setFilterQuery] = React.useState("")

  const selectedValues = value !== undefined ? value : internalValues

  const toggleValue = React.useCallback(
    (val: string) => {
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val]
      if (value === undefined) setInternalValues(next)
      onValueChange?.(next)
    },
    [selectedValues, value, onValueChange]
  )

  const removeValue = React.useCallback(
    (val: string) => {
      const next = selectedValues.filter((v) => v !== val)
      if (value === undefined) setInternalValues(next)
      onValueChange?.(next)
    },
    [selectedValues, value, onValueChange]
  )

  return (
    <ComboboxContext.Provider
      value={{
        selectedValues,
        toggleValue,
        removeValue,
        isOpen,
        setIsOpen,
        filterQuery,
        setFilterQuery,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </ComboboxContext.Provider>
  )
}

export const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(ComboboxContext)
  return (
    <div
      ref={ref}
      onClick={() => context?.setIsOpen((prev) => !prev)}
      className={cn(
        "flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card/90 px-3 py-1.5 text-sm shadow-xs transition-colors hover:border-border/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-60" />
    </div>
  )
})
ComboboxChips.displayName = "ComboboxChips"

export function ComboboxValue({
  children,
}: {
  children: (values: string[]) => React.ReactNode
}) {
  const context = React.useContext(ComboboxContext)
  if (!context) return null
  return <>{children(context.selectedValues)}</>
}

export function ComboboxChip({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const context = React.useContext(ComboboxContext)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
        className
      )}
    >
      {children}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          context?.removeValue(children)
        }}
        className="rounded-xs hover:bg-emerald-500/30 p-0.5 text-emerald-700 dark:text-emerald-300"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

export function ComboboxChipsInput({
  className,
  placeholder = "Filtrer...",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const context = React.useContext(ComboboxContext)
  return (
    <input
      type="text"
      value={context?.filterQuery || ""}
      onChange={(e) => context?.setFilterQuery(e.target.value)}
      placeholder={context?.selectedValues.length === 0 ? placeholder : ""}
      className={cn(
        "min-w-[80px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function ComboboxContent({
  children,
  className,
}: {
  anchor?: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(ComboboxContext)
  if (!context?.isOpen) return null

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-card p-1 text-foreground shadow-xl animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ComboboxEmpty({ children }: { children: React.ReactNode }) {
  return <div className="py-6 text-center text-xs text-muted-foreground">{children}</div>
}

export function ComboboxList({
  children,
}: {
  children: (item: string) => React.ReactNode
}) {
  const context = React.useContext(ComboboxContext)
  if (!context) return null
  return <div className="space-y-0.5">{children(context.filterQuery)}</div>
}

export function ComboboxItem({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const context = React.useContext(ComboboxContext)
  if (!context) return null

  if (
    context.filterQuery &&
    !value.toLowerCase().includes(context.filterQuery.toLowerCase())
  ) {
    return null
  }

  const isSelected = context.selectedValues.includes(value)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        context.toggleValue(value)
      }}
      className={cn(
        "relative flex cursor-pointer select-none items-center justify-between rounded-lg px-2.5 py-1.5 text-xs sm:text-sm outline-none transition-colors",
        isSelected
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
          : "text-foreground hover:bg-muted",
        className
      )}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />}
    </div>
  )
}
