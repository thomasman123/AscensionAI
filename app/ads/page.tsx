'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { Megaphone, Calendar, Target, TrendingUp } from 'lucide-react'

export default function AdsPage() {
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
    return null
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2 flex items-center gap-3">
                <Megaphone className="w-8 h-8 text-accent-400" />
                Ascension Ads
              </h1>
              <p className="text-lg text-tier-300">
                AI-powered advertising platform for maximum ROI across all channels.
              </p>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-tier-900 border-tier-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-tier-50 mb-4">
                  🚀 Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-tier-300 text-center mb-8 text-lg">
                  We're building the most advanced AI advertising platform to help you maximize your ad spend ROI.
                </p>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-6 bg-tier-800/50 rounded-lg border border-tier-700 text-center">
                    <Target className="w-8 h-8 text-accent-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-tier-50 mb-3">Smart Targeting</h3>
                    <p className="text-tier-400 text-sm">
                      AI-powered audience targeting across Facebook, Google, and TikTok with automatic optimization.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-tier-800/50 rounded-lg border border-tier-700 text-center">
                    <Calendar className="w-8 h-8 text-accent-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-tier-50 mb-3">Campaign Automation</h3>
                    <p className="text-tier-400 text-sm">
                      Set up complete ad campaigns with automated A/B testing, budget allocation, and creative rotation.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-tier-800/50 rounded-lg border border-tier-700 text-center">
                    <TrendingUp className="w-8 h-8 text-accent-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-tier-50 mb-3">Performance Analytics</h3>
                    <p className="text-tier-400 text-sm">
                      Real-time analytics and insights with AI-powered recommendations for campaign optimization.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-accent-500/5 border border-accent-500/20 rounded-lg">
                  <h4 className="font-semibold text-tier-50 mb-2">Want early access?</h4>
                  <p className="text-tier-300 text-sm">
                    Join our waitlist to be the first to experience Ascension Ads when it launches. We'll notify you as soon as it's available.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 