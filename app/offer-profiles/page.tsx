'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Target,
  Loader2,
  Eye
} from 'lucide-react'

interface UserOfferProfile {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  data: any
}

export default function OfferProfilesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profiles, setProfiles] = useState<UserOfferProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      loadProfiles()
    }
  }, [user, loading, router])

  const loadProfiles = async () => {
    try {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      const response = await fetch(`/api/user/profile?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      } else {
        console.error('Failed to load profiles')
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    }
    setIsLoading(false)
  }

  const handleCreateNew = () => {
    router.push('/offer-profiles/create')
  }

  const handleEdit = (profileId: string) => {
    router.push(`/offer-profiles/edit/${profileId}`)
  }

  const handleView = (profile: UserOfferProfile) => {
    router.push(`/offer-profiles/view/${profile.id}`)
  }

  const handleDelete = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this offer profile? This action cannot be undone.')) {
      return
    }

    setIsDeleting(profileId)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id,
          profileId 
        })
      })

      if (response.ok) {
        // Remove from local state
        setProfiles(prev => prev.filter(p => p.id !== profileId))
      } else {
        alert('Failed to delete profile')
      }
    } catch (error) {
      console.error('Error deleting profile:', error)
      alert('Failed to delete profile')
    }
    setIsDeleting(null)
  }

  const handleCreateFunnel = (profile: UserOfferProfile) => {
    // Create funnel using this profile
    const dataParam = encodeURIComponent(JSON.stringify(profile.data))
    router.push(`/funnels/create/template?type=trigger&data=${dataParam}&fromProfile=true`)
  }

  const handleCreateAd = (profile: UserOfferProfile) => {
    // Create ad using this profile (when ads feature is implemented)
    alert('Ad creation feature coming soon!')
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.data?.niche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.data?.who?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading || isLoading) {
    return (
      <DashboardNav>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-500" />
            <p className="text-tier-300">Loading offer profiles...</p>
          </div>
        </div>
      </DashboardNav>
    )
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-tier-50 mb-2">
                  Offer Profiles
                </h1>
                <p className="text-lg text-tier-300">
                  Manage your offer profiles for funnels and ads
                </p>
              </div>
              <Button 
                onClick={handleCreateNew}
                className="bg-accent-500 hover:bg-accent-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Profile
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tier-400 w-4 h-4" />
              <Input
                placeholder="Search profiles by name, niche, or target audience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-tier-900 border-tier-800 text-tier-100 placeholder-tier-400"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-tier-900 border-tier-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-tier-50">{profiles.length}</p>
                      <p className="text-sm text-tier-400">Total Profiles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-tier-900 border-tier-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-tier-50">
                        {new Set(profiles.map(p => p.data?.niche).filter(Boolean)).size}
                      </p>
                      <p className="text-sm text-tier-400">Unique Niches</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-tier-900 border-tier-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-tier-50">
                        {profiles.filter(p => {
                          const created = new Date(p.createdAt)
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return created > weekAgo
                        }).length}
                      </p>
                      <p className="text-sm text-tier-400">Created This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profiles Grid */}
            {filteredProfiles.length === 0 ? (
              <Card className="bg-tier-900 border-tier-800">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-tier-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-tier-50 mb-2">
                    {profiles.length === 0 ? 'No offer profiles yet' : 'No profiles match your search'}
                  </h3>
                  <p className="text-tier-400 mb-6">
                    {profiles.length === 0 
                      ? 'Create your first offer profile to get started with building targeted funnels and ads.'
                      : 'Try adjusting your search terms or create a new profile.'
                    }
                  </p>
                  <Button 
                    onClick={handleCreateNew}
                    className="bg-accent-500 hover:bg-accent-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Profile
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProfiles.map((profile) => (
                  <Card key={profile.id} className="bg-tier-900 border-tier-800 hover:border-tier-700 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-tier-50 text-lg">
                        {profile.name}
                      </CardTitle>
                      <div className="text-sm text-tier-400">
                        Created {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {profile.data?.niche && (
                          <div>
                            <span className="text-xs font-medium text-tier-400 uppercase tracking-wide">Niche</span>
                            <p className="text-sm text-tier-200">{profile.data.niche}</p>
                          </div>
                        )}
                        {profile.data?.who && (
                          <div>
                            <span className="text-xs font-medium text-tier-400 uppercase tracking-wide">Target</span>
                            <p className="text-sm text-tier-200">{profile.data.who}</p>
                          </div>
                        )}
                        {profile.data?.outcome && (
                          <div>
                            <span className="text-xs font-medium text-tier-400 uppercase tracking-wide">Outcome</span>
                            <p className="text-sm text-tier-200">{profile.data.outcome}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(profile)}
                            className="flex-1 border-tier-600 text-tier-300 hover:border-tier-500"
                          >
                            <Eye className="w-3 h-3 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(profile.id)}
                            className="flex-1 border-tier-600 text-tier-300 hover:border-tier-500"
                          >
                            <Edit className="w-3 h-3 mr-2" />
                            Edit
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCreateFunnel(profile)}
                            className="flex-1 bg-accent-500 hover:bg-accent-600 text-white"
                          >
                            Create Funnel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCreateAd(profile)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled
                          >
                            Create Ad
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(profile.id)}
                          disabled={isDeleting === profile.id}
                          className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          {isDeleting === profile.id ? (
                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3 mr-2" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 