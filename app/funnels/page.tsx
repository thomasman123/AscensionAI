'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { Shuffle, Plus, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'

interface SavedFunnel {
  id: string
  name: string
  type: 'trigger' | 'gateway'
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  domain: string
  data: any
}

export default function FunnelsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [funnels, setFunnels] = useState<SavedFunnel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && !loading) {
      loadFunnels()
    }
  }, [user, loading])

  const loadFunnels = async () => {
    try {
      const response = await fetch('/api/funnels/save?userId=00000000-0000-0000-0000-000000000000')
      if (response.ok) {
        const data = await response.json()
        setFunnels(data.funnels || [])
      }
    } catch (error) {
      console.error('Error loading funnels:', error)
    }
    setIsLoading(false)
  }

  if (loading || isLoading) {
    return (
      <DashboardNav>
        <div className="h-full flex items-center justify-center bg-tier-950">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-tier-300">Loading funnels...</p>
          </div>
        </div>
      </DashboardNav>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-tier-50 mb-2 flex items-center gap-3">
                  <Shuffle className="w-8 h-8 text-accent-400" />
                  Ascension Funnels
                </h1>
                <p className="text-lg text-tier-300">
                  Build high-converting marketing funnels with AI-powered optimization.
                </p>
              </div>
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white"
                onClick={() => router.push('/funnels/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Funnel
              </Button>
            </div>

            {/* Empty State */}
            {funnels.length === 0 && (
              <Card className="bg-tier-900 border-tier-800">
                <CardContent className="py-16 text-center">
                  <Shuffle className="w-16 h-16 text-tier-600 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-tier-50 mb-3">
                    No funnels created yet
                  </h3>
                  <p className="text-tier-400 mb-8 max-w-md mx-auto">
                    Create your first marketing funnel to start converting visitors into customers with AI-powered optimization.
                  </p>
                  <Button 
                    className="bg-accent-500 hover:bg-accent-600 text-white"
                    onClick={() => router.push('/funnels/create')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Funnel
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Funnels Grid - Will show when funnels exist */}
            {funnels.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {funnels.map((funnel) => (
                  <Card key={funnel.id} className="bg-tier-900 border-tier-800 hover:border-accent-500/30 transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-tier-50 text-lg">{funnel.name}</CardTitle>
                        <Button variant="ghost" size="sm" className="text-tier-400 hover:text-tier-200">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-tier-400 text-sm capitalize">{funnel.type} Funnel</p>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          funnel.status === 'published' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {funnel.status}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-tier-500">Domain:</span>
                          <span className="text-tier-300 text-right truncate ml-2">{funnel.domain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-tier-500">Created:</span>
                          <span className="text-tier-300">
                            {new Date(funnel.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-tier-500">Template:</span>
                          <span className="text-tier-300">{funnel.data?.templateId || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 border-tier-600 text-tier-300 hover:border-tier-500">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-tier-600 text-tier-300 hover:border-tier-500">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Quick Start Guide */}
            <Card className="bg-tier-900 border-tier-800 mt-8">
              <CardHeader>
                <CardTitle className="text-xl text-tier-50">
                  📋 How Funnel Creation Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-400 font-bold text-lg">1</span>
                    </div>
                    <h4 className="font-semibold text-tier-50 mb-2">Choose Type</h4>
                    <p className="text-tier-400 text-sm">Select between Trigger or Gateway funnel based on your goals.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-400 font-bold text-lg">2</span>
                    </div>
                    <h4 className="font-semibold text-tier-50 mb-2">Input Details</h4>
                    <p className="text-tier-400 text-sm">Provide your offer details, avatar, and transformation through our guided process.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-400 font-bold text-lg">3</span>
                    </div>
                    <h4 className="font-semibold text-tier-50 mb-2">AI Generation</h4>
                    <p className="text-tier-400 text-sm">Our AI creates personalized copy and selects the perfect template.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <span className="text-accent-400 font-bold text-lg">4</span>
                    </div>
                    <h4 className="font-semibold text-tier-50 mb-2">Customize</h4>
                    <p className="text-tier-400 text-sm">Review, edit, and launch your high-converting funnel.</p>
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