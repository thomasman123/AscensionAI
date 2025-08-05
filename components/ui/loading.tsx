import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

// Spinner component
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "white"
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6", 
      lg: "h-8 w-8"
    }

    const variantClasses = {
      default: "text-muted-foreground",
      primary: "text-primary",
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
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          "absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
          className
        )}
      >
        <Spinner size="lg" variant="primary" />
        {text && (
          <p className="mt-4 text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  )
}

// Skeleton component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "avatar"
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "h-4 w-full",
      card: "h-32 w-full",
      text: "h-4 w-3/4",
      avatar: "h-10 w-10 rounded-full"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-muted",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Page loading component
interface PageLoadingProps {
  text?: string
}

const PageLoading: React.FC<PageLoadingProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" variant="primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

// Premium Spinner for funnel pages
interface PremiumSpinnerProps {
  text?: string
  className?: string
}

const PremiumSpinner: React.FC<PremiumSpinnerProps> = ({ text = "Loading...", className }) => {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20" />
        
        {/* Inner spinning gradient */}
        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" 
             style={{ animationDuration: '1s', animationTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }} />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
        
        {/* Text below */}
        {text && (
          <p className="mt-6 text-center text-sm text-muted-foreground animate-fade-in">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export { Spinner, LoadingOverlay, Skeleton, PageLoading, PremiumSpinner } 