'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Save, 
  Trash2, 
  User, 
  Target, 
  Clock,
  Search,
  FileText
} from 'lucide-react'

interface UserOfferProfile {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  data: any
}

function OfferProfilesContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  
  const [profiles, setProfiles] = useState<UserOfferProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user, router])

  useEffect(() => {
    if (!funnelType) {
      router.push('/funnels/create')
      return
    }
    
    if (user) {
      loadProfiles()
    }
  }, [funnelType, router, user])

  const loadProfiles = async () => {
    try {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      const response = await fetch(`/api/user/profile?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    }
    setIsLoading(false)
  }

  const handleSelectProfile = (profile: UserOfferProfile) => {
    // Encode the profile data and continue to template selection
    const dataParam = encodeURIComponent(JSON.stringify(profile.data))
    router.push(`/funnels/create/template?type=${funnelType}&data=${dataParam}`)
  }

  const handleCreateNew = () => {
    router.push(`/funnels/create/offer-profiles/details?type=${funnelType}`)
  }

  const handleDeleteProfile = async (profileId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    
    if (confirm('Are you sure you want to delete this offer profile?')) {
      try {
        const userId = user?.id || '00000000-0000-0000-0000-000000000000'
        const response = await fetch(`/api/user/profile?userId=${userId}&profileId=${profileId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setProfiles(profiles.filter(p => p.id !== profileId))
        }
      } catch (error) {
        console.error('Error deleting profile:', error)
        alert('Failed to delete profile')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.data.niche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.data.who?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-tier-950">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-tier-950">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                Step 1 of 8
              </div>
              <div className="flex-1 bg-tier-800 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '12.5%' }}
                ></div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-tier-50 mb-2">
              Choose Your Offer Profile
            </h1>
            <p className="text-lg text-tier-300">
              Start with a saved offer profile or create a new one from scratch
            </p>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tier-500" />
              <Input
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-tier-800 border-tier-700 text-tier-100"
              />
            </div>
            
            <Button
              onClick={handleCreateNew}
              className="bg-accent-500 hover:bg-accent-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Profile
            </Button>
          </div>

          {/* Profiles Grid */}
          {filteredProfiles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {filteredProfiles.map((profile) => (
                <Card 
                  key={profile.id}
                  className="bg-tier-900 border-tier-800 hover:border-tier-700 transition-all cursor-pointer group"
                  onClick={() => handleSelectProfile(profile)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-tier-50 text-lg mb-1 group-hover:text-accent-400 transition-colors">
                          {profile.name}
                        </CardTitle>
                        <div className="text-sm text-tier-500">
                          {formatDate(profile.createdAt)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteProfile(profile.id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-tier-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Key Info */}
                      <div className="space-y-2">
                        {profile.data.niche && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-accent-400" />
                            <span className="text-sm text-tier-300 truncate">{profile.data.niche}</span>
                          </div>
                        )}
                        {profile.data.who && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-accent-400" />
                            <span className="text-sm text-tier-300 truncate">{profile.data.who}</span>
                          </div>
                        )}
                        {profile.data.outcome && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-accent-400" />
                            <span className="text-sm text-tier-300 truncate">{profile.data.outcome}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-2 border-t border-tier-800">
                        <div className="flex gap-2">
                          {profile.data.activationPoint1 && (
                            <Badge variant="secondary" className="text-xs bg-tier-800 text-tier-400">
                              Activation
                            </Badge>
                          )}
                          {profile.data.caseStudies?.length > 0 && (
                            <Badge variant="secondary" className="text-xs bg-tier-800 text-tier-400">
                              {profile.data.caseStudies.length} Cases
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-tier-600 group-hover:text-accent-400 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-tier-900 border-tier-800 text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-tier-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-tier-300 mb-2">
                  {searchTerm ? 'No matching profiles found' : 'No saved offer profiles'}
                </h3>
                <p className="text-tier-500 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search or create a new profile'
                    : 'Create your first offer profile to reuse across multiple funnels'
                  }
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Profile
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/funnels/create')}
              className="border-tier-600 text-tier-300 hover:border-tier-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Funnel Type
            </Button>
            
            {/* Skip button for quick creation */}
            <Button
              variant="ghost"
              onClick={handleCreateNew}
              className="text-tier-500 hover:text-tier-300"
            >
              Skip & Create New
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="h-full overflow-auto bg-tier-950">
      <div className="p-8">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}

export default function OfferProfilesPage() {
  return (
    <DashboardNav>
      <Suspense fallback={<LoadingFallback />}>
        <OfferProfilesContent />
      </Suspense>
    </DashboardNav>
  )
} 