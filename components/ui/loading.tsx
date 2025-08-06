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

// Premium Spinner for funnel pages - optimized for cold traffic retention
interface PremiumSpinnerProps {
  text?: string
  className?: string
}

const PremiumSpinner: React.FC<PremiumSpinnerProps> = ({ className }) => {
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950", className)}>
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 -m-16">
          <div className="h-32 w-32 rounded-full bg-blue-400/20 animate-ping" />
        </div>
        
        {/* Middle rotating ring */}
        <div className="absolute inset-0 -m-8">
          <div className="h-16 w-16 rounded-full border-4 border-blue-300/30 border-t-blue-500/50 animate-spin" 
               style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Inner morphing shape */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-600 animate-pulse shadow-lg shadow-blue-500/50" 
               style={{ 
                 animationDuration: '2s',
                 animation: 'morph 8s ease-in-out infinite, pulse 2s ease-in-out infinite'
               }} />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 animate-pulse"
               style={{ 
                 animationDelay: '1s',
                 animationDuration: '2s'
               }} />
        </div>
        
        {/* Progress dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 60% 50% / 60% 50% 50% 60%; }
          75% { border-radius: 60% 40% 60% 50% / 70% 50% 40% 60%; }
        }
      `}</style>
    </div>
  )
}

export { Spinner, LoadingOverlay, Skeleton, PageLoading, PremiumSpinner } 