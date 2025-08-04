import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KPICard } from '../components/kpi-card'
import {
  Home,
  BarChart3,
  CreditCard,
  Shield,
  Settings,
  Zap,
  ChevronRight,
  Bell,
  Search,
  Filter,
  Plus
} from 'lucide-react'

// Complete dashboard layout example showing the Promethean design system in action
export function DashboardLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: CreditCard, label: "Appointments", href: "/appointments", badge: "5" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Shield, label: "Security", href: "/security" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <div className="min-h-screen bg-tier-900 text-tier-50">
      {/* Layout Grid */}
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
        
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-tier-950 border-r border-tier-800 transition-all duration-300",
            "flex flex-col h-full",
            sidebarExpanded ? "w-[280px]" : "w-[72px]"
          )}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {/* Logo */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-tier-700 to-tier-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-tier-100" strokeWidth={2} />
              </div>
              {sidebarExpanded && (
                <h1 className="text-base font-semibold tracking-wide text-tier-100">
                  PROMETHEAN
                </h1>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200",
                    "hover:bg-tier-800/30",
                    sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center p-3",
                    item.active && "bg-tier-800/60"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5",
                    item.active ? "text-tier-100" : "text-tier-400"
                  )} />
                  {sidebarExpanded && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className={cn(
                        "text-sm font-medium",
                        item.active ? "text-tier-100" : "text-tier-400"
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Header */}
        <header className="bg-tier-900 border-b border-tier-800 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1 text-sm">
              <span className="text-tier-400 hover:text-tier-200 cursor-pointer">
                Dashboard
              </span>
              <ChevronRight className="h-4 w-4 text-tier-600" />
              <span className="text-tier-100 font-medium">Overview</span>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-tier-400 hover:text-tier-200">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-tier-400 hover:text-tier-200">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-tier-400 hover:text-tier-200">
                <Bell className="h-4 w-4" />
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Item
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-tier-900 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-display text-tier-50 mb-2">Dashboard Overview</h1>
              <p className="text-body text-tier-300">Welcome back! Here's what's happening with your business today.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Revenue"
                metric="$124,590"
                trend={{ direction: "up", value: "+12.5%" }}
                subtitle="vs last month"
              />
              <KPICard
                title="Active Users"
                metric="2,350"
                trend={{ direction: "up", value: "+5.2%" }}
                subtitle="this week"
              />
              <KPICard
                title="Conversion Rate"
                metric="3.2%"
                trend={{ direction: "down", value: "-0.5%" }}
                subtitle="vs last week"
              />
              <KPICard
                title="Support Tickets"
                metric="23"
                trend={{ direction: "neutral", value: "No change" }}
                subtitle="open tickets"
              />
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-title text-tier-100">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] bg-tier-700/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-tier-500 mx-auto mb-4" />
                      <p className="text-body text-tier-400">Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 