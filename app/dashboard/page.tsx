'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { User, Mail, Zap, Shuffle, Megaphone } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-tier-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-tier-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        {/* Main Content */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Welcome back, {user.email?.split('@')[0]}
              </h1>
              <p className="text-lg text-tier-300">
                Your AI-powered marketing command center is ready.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-tier-50 text-sm font-medium">
                    <Shuffle className="w-4 h-4 text-accent-400" />
                    Active Funnels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tier-50">0</div>
                  <p className="text-xs text-tier-400">No funnels created yet</p>
                </CardContent>
              </Card>

              <Card className="bg-tier-900 border-tier-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-tier-50 text-sm font-medium">
                    <Megaphone className="w-4 h-4 text-accent-400" />
                    Ad Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tier-50">0</div>
                  <p className="text-xs text-tier-400">Coming soon</p>
                </CardContent>
              </Card>

              <Card className="bg-tier-900 border-tier-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-tier-50 text-sm font-medium">
                    <Zap className="w-4 h-4 text-accent-400" />
                    Total Conversions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-tier-50">0</div>
                  <p className="text-xs text-tier-400">Start building to track results</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quick Actions */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="text-tier-50">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-accent-500 hover:bg-accent-600 text-white" 
                    onClick={() => router.push('/funnels/create')}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Create Your First Funnel
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-tier-600 hover:border-tier-500 text-tier-300" 
                    disabled
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    Launch Ad Campaign (Coming Soon)
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card className="bg-tier-900 border-tier-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-tier-50">
                    <User className="w-5 h-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-tier-300">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="text-sm text-tier-400 space-y-1">
                    <p>Account created: {new Date(user.created_at).toLocaleDateString()}</p>
                    <p>Plan: Free Tier</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            <Card className="bg-tier-900 border-tier-800 mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-tier-50">
                  🚀 Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tier-300 mb-6">
                  Build high-converting funnels with AI-powered personalization and optimization.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-tier-800/50 rounded-lg border border-tier-700">
                    <h3 className="font-semibold text-tier-50 mb-2">Ascension Funnels</h3>
                    <p className="text-tier-400 text-sm mb-3">
                      Create complete marketing funnels with AI-generated copy, case studies, and optimization.
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-accent-500 hover:bg-accent-600"
                      onClick={() => router.push('/funnels')}
                    >
                      Get Started
                    </Button>
                  </div>
                  <div className="p-4 bg-tier-800/30 rounded-lg border border-tier-700 opacity-60">
                    <h3 className="font-semibold text-tier-50 mb-2">Ascension Ads</h3>
                    <p className="text-tier-400 text-sm mb-3">
                      Launch and optimize ad campaigns across multiple platforms with AI insights.
                    </p>
                    <Button size="sm" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 