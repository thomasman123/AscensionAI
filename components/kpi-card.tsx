import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/loading'

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
          return 'text-green-500'
        case 'down':
          return 'text-red-500'
        case 'neutral':
        default:
          return 'text-muted-foreground'
      }
    }

    const getVariantStyles = () => {
      switch (variant) {
        case 'highlight':
          return 'bg-primary/5 border-primary/20'
        case 'warning':
          return 'bg-orange-500/5 border-orange-500/20'
        case 'success':
          return 'bg-green-500/5 border-green-500/20'
        default:
          return ''
      }
    }

    const TrendIcon = getTrendIcon()

    if (loading) {
      return (
        <Card
          ref={ref}
          className={cn(getVariantStyles(), className)}
          {...props}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              {Icon && <Skeleton className="h-5 w-5 rounded" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              {subtitle && <Skeleton className="h-3 w-16" />}
            </div>
            {trend && (
              <div className="flex items-center gap-1 mt-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-12" />
              </div>
            )}
          </CardContent>
        </Card>
      )
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-200 hover:shadow-lg",
          getVariantStyles(),
          className
        )}
        {...props}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span className="text-muted-foreground">{title}</span>
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {typeof metric === 'number' ? metric.toLocaleString() : metric}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-1 mt-4">
              <TrendIcon className={cn("h-4 w-4", getTrendColor())} />
              <span className={cn("text-xs font-medium", getTrendColor())}>
                {trend.value}
              </span>
              {trend.period && (
                <span className="text-xs text-muted-foreground">
                  {trend.period}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

KPICard.displayName = 'KPICard'

export { KPICard } 