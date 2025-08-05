'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { Megaphone, Calendar, Target, TrendingUp } from 'lucide-react'
import { PageLoading } from '@/components/ui/loading'

export default function AdsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <PageLoading text="Loading ads platform..." />
  }

  if (!user) {
    return null
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Megaphone className="w-8 h-8 text-primary" />
                Ascension Ads
              </h1>
              <p className="text-lg text-muted-foreground">
                AI-powered advertising platform for maximum ROI across all channels.
              </p>
            </div>

            {/* Coming Soon Card */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">
                  🚀 Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-8 text-lg">
                  We're building the most advanced AI advertising platform to help you maximize your ad spend ROI.
                </p>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="p-6 bg-card rounded-lg border text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-3">Smart Targeting</h3>
                    <p className="text-muted-foreground text-sm">
                      AI-powered audience targeting across Facebook, Google, and TikTok with automatic optimization.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-card rounded-lg border text-center">
                    <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-3">Campaign Automation</h3>
                    <p className="text-muted-foreground text-sm">
                      Set up complete ad campaigns with automated A/B testing, budget allocation, and creative rotation.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-card rounded-lg border text-center">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-3">Performance Analytics</h3>
                    <p className="text-muted-foreground text-sm">
                      Real-time analytics and insights with AI-powered recommendations for campaign optimization.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <h4 className="font-semibold mb-2">Want early access?</h4>
                  <p className="text-muted-foreground text-sm">
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