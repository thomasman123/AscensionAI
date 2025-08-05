'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { User, Mail, Zap, Shuffle, Megaphone } from 'lucide-react'
import { PageLoading } from '@/components/ui/loading'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <PageLoading text="Loading dashboard..." />
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto">
        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.email?.split('@')[0]}
              </h1>
              <p className="text-lg text-muted-foreground">
                Your AI-powered marketing command center is ready.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Shuffle className="w-4 h-4 text-primary" />
                    Active Funnels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No funnels created yet</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Megaphone className="w-4 h-4 text-primary" />
                    Ad Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Zap className="w-4 h-4 text-primary" />
                    Total Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Start building to track results</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => router.push('/funnels/create')}
                    className="w-full justify-start"
                    variant="default"
                  >
                    <Shuffle className="mr-2 h-4 w-4" />
                    Create New Funnel
                  </Button>
                  <Button 
                    onClick={() => router.push('/ads')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Megaphone className="mr-2 h-4 w-4" />
                    Generate Ad Copy
                  </Button>
                  <Button 
                    onClick={() => router.push('/offer-profiles')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Manage Offer Profiles
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start by creating your first funnel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Preview */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Email Sequences</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered email sequences that nurture leads automatically
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Analytics Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Track conversions, ROI, and campaign performance
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">A/B Testing</h3>
                      <p className="text-sm text-muted-foreground">
                        Optimize your funnels with intelligent split testing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 