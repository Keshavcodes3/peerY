import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300"
  
  const variants: Record<string, string> = {
    default: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    secondary: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    destructive: "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
    outline: "border-zinc-800 text-zinc-100",
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  )
}

export { Badge }
