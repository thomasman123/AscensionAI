import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Image from "next/image"

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
  isContentReady?: boolean
  logoUrl?: string
}

const PremiumSpinner: React.FC<PremiumSpinnerProps> = ({ className, isContentReady = false, logoUrl }) => {
  const [progress, setProgress] = React.useState(0)
  
  React.useEffect(() => {
    // Super fast initial progress
    const timer1 = setTimeout(() => setProgress(75), 50)
    // Quick to near completion
    const timer2 = setTimeout(() => setProgress(90), 200)
    // Hold at 90% until content is ready
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])
  
  // Complete to 100% when content is ready
  React.useEffect(() => {
    if (isContentReady) {
      setProgress(100)
    }
  }, [isContentReady])
  
  return (
    <div className={cn("flex min-h-screen items-center justify-center bg-background", className)}>
      <div className="flex flex-col items-center space-y-6">
        {/* Logo or default branding */}
        <div className="h-24 w-full max-w-xs flex items-center justify-center">
          {logoUrl ? (
            <Image
              src={logoUrl} 
              alt="Loading..." 
              width={200}
              height={96}
              priority
              className="object-contain animate-fade-in"
              style={{ maxHeight: '96px', width: 'auto' }}
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLElement
                target.style.display = 'none'
                const fallback = target.nextSibling as HTMLElement
                if (fallback) fallback.style.display = 'block'
              }}
            />
          ) : (
            <div className="text-3xl font-bold text-purple-600 animate-fade-in">
              Loading...
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
            style={{ 
              width: `${progress}%`,
              transitionDuration: progress === 100 ? '150ms' : progress > 80 ? '400ms' : '200ms',
              transitionTimingFunction: progress === 100 ? 'ease-out' : progress > 80 ? 'cubic-bezier(0.8, 0.0, 0.2, 1)' : 'cubic-bezier(0.0, 0.0, 0.2, 1)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export { Spinner, LoadingOverlay, Skeleton, PageLoading, PremiumSpinner } 