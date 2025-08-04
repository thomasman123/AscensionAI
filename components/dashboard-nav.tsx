'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import {
  Home,
  Zap,
  Shuffle,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react'

interface NavigationItem {
  icon: React.ComponentType<any>
  label: string
  href: string
  badge?: string
  disabled?: boolean
}

const navigationItems: NavigationItem[] = [
  { 
    icon: Home, 
    label: "Dashboard", 
    href: "/dashboard" 
  },
  { 
    icon: Shuffle, 
    label: "Ascension Funnels", 
    href: "/funnels" 
  },
  { 
    icon: BookOpen, 
    label: "AI Training", 
    href: "/training" 
  },
  { 
    icon: Megaphone, 
    label: "Ascension Ads", 
    href: "/ads",
    disabled: true
  },
]

interface DashboardNavProps {
  children: React.ReactNode
}

export function DashboardNav({ children }: DashboardNavProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <div className="min-h-screen bg-tier-950 text-tier-50">
      {/* Layout Grid */}
      <div className="grid grid-cols-[auto_1fr] h-screen">
        
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-tier-900 border-r border-tier-800 transition-all duration-300",
            "flex flex-col h-full relative",
            sidebarExpanded ? "w-[280px]" : "w-[72px]"
          )}
        >
          {/* Logo */}
          <div className="p-4 border-b border-tier-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              {sidebarExpanded && (
                <h1 className="text-lg font-bold tracking-wide text-tier-50">
                  Ascension AI
                </h1>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              const isDisabled = item.disabled
              
              return (
                <button
                  key={item.href}
                  onClick={() => !isDisabled && router.push(item.href)}
                  disabled={isDisabled}
                  className={cn(
                    "w-full flex items-center rounded-lg transition-all duration-200",
                    "hover:bg-tier-800/60 disabled:hover:bg-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    sidebarExpanded ? "gap-3 px-3 py-2.5" : "justify-center p-3",
                    isActive && !isDisabled && "bg-accent-500/10 border border-accent-500/20"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-accent-400" : "text-tier-400",
                    isDisabled && "text-tier-600"
                  )} />
                  {sidebarExpanded && (
                    <div className="flex-1 flex items-center justify-between text-left">
                      <span className={cn(
                        "text-sm font-medium",
                        isActive ? "text-accent-300" : "text-tier-300",
                        isDisabled && "text-tier-600"
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-accent-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isDisabled && (
                        <span className="px-2 py-0.5 text-xs bg-tier-700 text-tier-400 rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Toggle Button */}
          <div className="p-3 border-t border-tier-800">
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="sm"
              className="w-full justify-center text-tier-400 hover:text-tier-200 hover:bg-tier-800/60"
            >
              {sidebarExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Sign Out */}
          <div className="p-3 border-t border-tier-800">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full text-tier-400 hover:text-tier-200 hover:bg-tier-800/60",
                sidebarExpanded ? "justify-start gap-3" : "justify-center"
              )}
            >
              <LogOut className="w-4 h-4" />
              {sidebarExpanded && "Sign out"}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
} 