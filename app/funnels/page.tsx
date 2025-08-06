'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { 
  Shuffle, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2
} from 'lucide-react'

interface SavedFunnel {
  id: string
  name: string
  type: 'trigger' | 'gateway'
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  domain: string
  custom_domain?: string
  domain_verified?: boolean
  data: any
}

export default function FunnelsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [funnels, setFunnels] = useState<SavedFunnel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const loadFunnels = async (retryCount = 0) => {
    const maxRetries = 3
    const timeout = 10000 // 10 seconds
    
    try {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      console.log(`Loading funnels for user ${userId} (attempt ${retryCount + 1}/${maxRetries + 1})`)
      
      const response = await fetch(`/api/funnels/save?userId=${userId}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setFunnels(data.funnels || [])
        console.log(`Successfully loaded ${data.funnels?.length || 0} funnels`)
      } else {
        console.error('Failed to load funnels:', response.status, response.statusText)
        
        // If it's a server error and we have retries left, try again
        if (response.status >= 500 && retryCount < maxRetries) {
          console.log(`Server error, retrying in ${(retryCount + 1) * 1000}ms...`)
          setTimeout(() => loadFunnels(retryCount + 1), (retryCount + 1) * 1000)
          return
        }
        
        // Show user-friendly error for non-server errors
        if (response.status === 404) {
          setFunnels([]) // No funnels found, that's okay
        }
      }
    } catch (error) {
      console.error('Error loading funnels:', error)
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timed out after', timeout, 'ms')
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          console.error('Network error detected')
        }
        
        // Retry on network errors if we have retries left
        if (retryCount < maxRetries && 
            (error.name === 'AbortError' || 
             error.message.includes('NetworkError') || 
             error.message.includes('fetch'))) {
          console.log(`Network error, retrying in ${(retryCount + 1) * 2000}ms...`)
          setTimeout(() => loadFunnels(retryCount + 1), (retryCount + 1) * 2000)
          return
        }
      }
      
      // If all retries failed, show empty state but don't crash
      if (retryCount >= maxRetries) {
        console.error('All retry attempts failed. Showing empty state.')
        setFunnels([])
      }
    }
    
    setIsLoading(false)
  }

  const handleDelete = async (funnelId: string) => {
    if (!confirm('Are you sure you want to delete this funnel?')) {
      return
    }

    setDeletingId(funnelId)
    try {
      const response = await fetch(`/api/funnels/save?userId=${user?.id}&funnelId=${funnelId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFunnels(funnels.filter(f => f.id !== funnelId))
      } else {
        alert('Failed to delete funnel')
      }
    } catch (error) {
      console.error('Error deleting funnel:', error)
      alert('Failed to delete funnel')
    }
    setDeletingId(null)
  }

  const getFunnelUrl = (funnel: SavedFunnel) => {
    if (funnel.custom_domain && funnel.domain_verified) {
      return `https://${funnel.custom_domain}`
    }
    return funnel.domain.includes('.ascension-ai-sm36.vercel.app') 
      ? `https://${funnel.domain}`
      : `https://${funnel.domain}.ascension-ai-sm36.vercel.app`
  }

  if (!user) {
    return null
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-tier-50 mb-2 flex items-center gap-3">
                  <Shuffle className="w-8 h-8 text-accent-400" />
                  Your Funnels
                </h1>
                <p className="text-lg text-tier-300">
                  Manage and optimize your marketing funnels
                </p>
              </div>
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white"
                onClick={() => router.push('/funnels/create')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Funnel
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && funnels.length === 0 && (
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

            {/* Funnels List */}
            {!isLoading && funnels.length > 0 && (
              <Card className="bg-tier-900 border-tier-800">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-tier-800">
                        <th className="text-left p-4 text-tier-400 font-medium">Name</th>
                        <th className="text-left p-4 text-tier-400 font-medium">Type</th>
                        <th className="text-left p-4 text-tier-400 font-medium">Status</th>
                        <th className="text-left p-4 text-tier-400 font-medium">Created</th>
                        <th className="text-right p-4 text-tier-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {funnels.map((funnel) => (
                        <tr key={funnel.id} className="border-b border-tier-800 hover:bg-tier-800/50 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-tier-50">{funnel.name}</div>
                            <div className="text-sm text-tier-500 mt-1">
                              {funnel.data?.templateId || 'Custom Template'}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-tier-300 capitalize">
                              {funnel.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={funnel.status === 'published' ? 'default' : 'secondary'}
                              className={`${
                                funnel.status === 'published' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}
                            >
                              {funnel.status === 'published' ? 'Live' : 'Draft'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-tier-400">
                              {new Date(funnel.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-tier-400 hover:text-tier-200"
                                onClick={() => window.open(getFunnelUrl(funnel), '_blank')}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-tier-400 hover:text-tier-200"
                                onClick={() => router.push(`/funnels/edit/${funnel.id}`)}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDelete(funnel.id)}
                                disabled={deletingId === funnel.id}
                              >
                                {deletingId === funnel.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            {!isLoading && funnels.length > 0 && (
              <div className="grid gap-4 md:grid-cols-3 mt-8">
                <Card className="bg-tier-900 border-tier-800">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-tier-50">{funnels.length}</div>
                    <div className="text-tier-400 text-sm">Total Funnels</div>
                  </CardContent>
                </Card>
                <Card className="bg-tier-900 border-tier-800">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-green-400">
                      {funnels.filter(f => f.status === 'published').length}
                    </div>
                    <div className="text-tier-400 text-sm">Live Funnels</div>
                  </CardContent>
                </Card>
                <Card className="bg-tier-900 border-tier-800">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-yellow-400">
                      {funnels.filter(f => f.status === 'draft').length}
                    </div>
                    <div className="text-tier-400 text-sm">Draft Funnels</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 