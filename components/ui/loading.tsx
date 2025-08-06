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

const PremiumSpinner: React.FC<PremiumSpinnerProps> = ({ className }) => {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
      <div className="flex flex-col items-center space-y-6">
        <div className="loader" />
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-loading-bar" />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        .animate-loading-bar {
          animation: loading-bar 2s ease-out infinite;
        }
      `}</style>
    </div>
  )
}

export { Spinner, LoadingOverlay, Skeleton, PageLoading, PremiumSpinner } 