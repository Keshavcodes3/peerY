import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"

    const variants: Record<string, string> = {
      default:
        "bg-zinc-950 text-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:bg-zinc-900 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]",

      primary:
        `
        relative overflow-hidden
        bg-blue-600
        text-white
        shadow-[0_10px_30px_rgba(37,99,235,0.18)]
        hover:-translate-y-0.5
        hover:bg-blue-700
        hover:shadow-[0_15px_40px_rgba(37,99,235,0.28)]

        before:absolute
        before:inset-0
        before:rounded-xl
        before:bg-gradient-to-r
        before:from-white/10
        before:to-transparent
        before:opacity-0
        hover:before:opacity-100
        before:transition-opacity
        before:duration-300
        `,

      destructive:
        "bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.18)]",

      outline:
        `
        border
        border-zinc-200
        bg-white
        text-zinc-900
        shadow-sm
        hover:-translate-y-0.5
        hover:border-zinc-300
        hover:bg-zinc-50
        hover:shadow-md
        `,

      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",

      ghost:
        "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",

      link:
        "text-zinc-900 underline-offset-4 hover:underline",
    }

    const sizes: Record<string, string> = {
      default: "h-11 px-5",
      sm: "h-9 px-4 text-xs",
      lg: "h-12 px-7 text-base",
      icon: "h-11 w-11 p-0",
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export default Button