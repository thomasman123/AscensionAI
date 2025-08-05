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
  BookOpen,
  Users
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
    icon: Users, 
    label: "Offer Profiles", 
    href: "/offer-profiles" 
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Layout Grid */}
      <div className="grid grid-cols-[auto_1fr] h-screen">
        
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-card border-r border-border transition-all duration-300",
            "flex flex-col h-full relative",
            sidebarExpanded ? "w-64" : "w-20"
          )}
        >
          {/* Logo & Brand */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className={cn(
                "flex items-center gap-3 transition-opacity duration-300",
                !sidebarExpanded && "opacity-0 invisible"
              )}>
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">AscensionAI</span>
              </div>
              <div className={cn(
                "w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-opacity duration-300",
                sidebarExpanded && "opacity-0 invisible absolute left-6"
              )}>
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <li key={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        !sidebarExpanded && "px-3"
                      )}
                      onClick={() => !item.disabled && router.push(item.href)}
                      disabled={item.disabled}
                    >
                      <Icon className={cn(
                        "h-5 w-5",
                        sidebarExpanded && "mr-3"
                      )} />
                      {sidebarExpanded && (
                        <span className="flex-1 text-left">{item.label}</span>
                      )}
                      {sidebarExpanded && item.disabled && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          Soon
                        </span>
                      )}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Training Section */}
          {sidebarExpanded && (
            <div className="p-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/training')}
              >
                <BookOpen className="mr-3 h-5 w-5" />
                <span className="flex-1 text-left">Training</span>
              </Button>
            </div>
          )}

          {/* User Actions */}
          <div className="p-4 border-t border-border mt-auto">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-muted-foreground hover:text-foreground",
                !sidebarExpanded && "px-3"
              )}
              onClick={handleSignOut}
            >
              <LogOut className={cn(
                "h-5 w-5",
                sidebarExpanded && "mr-3"
              )} />
              {sidebarExpanded && <span>Sign Out</span>}
            </Button>
          </div>

          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-card border border-border shadow-sm hover:shadow-md"
            onClick={toggleSidebar}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
} 