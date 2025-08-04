import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-tier-700 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-tier-800 text-tier-100 hover:bg-tier-700",
        secondary: "border-transparent bg-tier-700 text-tier-100 hover:bg-tier-600",
        destructive: "border-transparent bg-red-600 text-tier-50 hover:bg-red-700",
        outline: "text-tier-300 border-tier-600 hover:bg-tier-800",
        success: "border-transparent bg-green-600 text-tier-50 hover:bg-green-700",
        warning: "border-transparent bg-orange-600 text-tier-50 hover:bg-orange-700",
        accent: "border-transparent bg-accent-600 text-tier-50 hover:bg-accent-700",
        purple: "border-transparent bg-purple-600 text-tier-50 hover:bg-purple-700",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 