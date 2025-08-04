import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Spinner component
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "accent" | "white"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8"
    }

    const variantClasses = {
      default: "text-tier-400",
      accent: "text-accent-500",
      white: "text-white"
    }

    return (
      <div
        ref={ref}
        className={cn("animate-spin", className)}
        {...props}
      >
        <Loader2 className={cn(sizeClasses[size], variantClasses[variant])} />
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  text?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className,
  text = "Loading..."
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-tier-950/80 backdrop-blur-sm flex-col-center z-50 rounded-lg">
          <Spinner size="lg" variant="accent" />
          {text && (
            <p className="text-tier-300 text-sm mt-3 font-medium">{text}</p>
          )}
        </div>
      )}
    </div>
  )
}

// Skeleton component for loading states
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "rounded" | "circle"
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "rounded-md",
      rounded: "rounded-lg", 
      circle: "rounded-full"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-tier-700",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Loading button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  children: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "btn-base inline-flex items-center justify-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" />}
        {children}
      </button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { Spinner, LoadingOverlay, Skeleton, LoadingButton } 