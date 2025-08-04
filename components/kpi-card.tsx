import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'

interface TrendData {
  direction: 'up' | 'down' | 'neutral'
  value: string
  period?: string
}

export interface KPICardProps {
  title: string
  metric: string | number
  trend?: TrendData
  subtitle?: string
  icon?: LucideIcon
  className?: string
  variant?: 'default' | 'highlight' | 'warning' | 'success'
  loading?: boolean
}

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ 
    title, 
    metric, 
    trend, 
    subtitle, 
    icon: Icon, 
    className, 
    variant = 'default',
    loading = false,
    ...props 
  }, ref) => {
    const getTrendIcon = () => {
      switch (trend?.direction) {
        case 'up':
          return TrendingUp
        case 'down':
          return TrendingDown
        case 'neutral':
        default:
          return Minus
      }
    }

    const getTrendColor = () => {
      switch (trend?.direction) {
        case 'up':
          return 'text-green-400'
        case 'down':
          return 'text-red-400'
        case 'neutral':
        default:
          return 'text-tier-400'
      }
    }

    const getVariantStyles = () => {
      switch (variant) {
        case 'highlight':
          return 'bg-accent-500/5 border-accent-500/20'
        case 'warning':
          return 'bg-orange-500/5 border-orange-500/20'
        case 'success':
          return 'bg-green-500/5 border-green-500/20'
        default:
          return 'bg-tier-900 border-tier-800'
      }
    }

    const TrendIcon = getTrendIcon()

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "card-base p-6 space-y-4",
            getVariantStyles(),
            className
          )}
          {...props}
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-tier-700 rounded animate-pulse w-20"></div>
            {Icon && (
              <div className="h-5 w-5 bg-tier-700 rounded animate-pulse"></div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="h-8 bg-tier-700 rounded animate-pulse w-24"></div>
            {subtitle && (
              <div className="h-3 bg-tier-700 rounded animate-pulse w-16"></div>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-tier-700 rounded animate-pulse"></div>
              <div className="h-4 bg-tier-700 rounded animate-pulse w-12"></div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "card-base p-6 space-y-4 hover:shadow-lg transition-all duration-300",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-label-medium text-tier-300 font-medium">
            {title}
          </h3>
          {Icon && (
            <Icon className="h-5 w-5 text-tier-400" />
          )}
        </div>
        
        {/* Metric */}
        <div className="space-y-1">
          <div className="text-number-large text-tier-50">
            {typeof metric === 'number' ? metric.toLocaleString() : metric}
          </div>
          {subtitle && (
            <p className="text-caption text-tier-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1">
            <TrendIcon className={cn("h-4 w-4", getTrendColor())} />
            <span className={cn("text-caption font-medium", getTrendColor())}>
              {trend.value}
            </span>
            {trend.period && (
              <span className="text-caption text-tier-500">
                {trend.period}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

KPICard.displayName = 'KPICard'

export { KPICard } 