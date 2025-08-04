import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border border-tier-700 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-tier-300 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-tier-900 text-tier-100 border-tier-700",
        destructive: "border-red-500/50 text-red-100 dark:border-red-500 [&>svg]:text-red-100 bg-red-950/50",
        warning: "border-orange-500/50 text-orange-100 dark:border-orange-500 [&>svg]:text-orange-100 bg-orange-950/50",
        success: "border-green-500/50 text-green-100 dark:border-green-500 [&>svg]:text-green-100 bg-green-950/50",
        info: "border-accent-500/50 text-accent-100 dark:border-accent-500 [&>svg]:text-accent-100 bg-accent-950/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 