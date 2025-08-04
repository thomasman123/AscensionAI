'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight, ArrowLeft, Save, Loader2 } from 'lucide-react'

interface OfferData {
  // Avatar fields
  niche: string
  income: string
  age: string
  traits: string
  primaryGoal1: string
  primaryGoal2: string
  primaryGoal3: string
  secondaryGoal1: string
  secondaryGoal2: string
  secondaryGoal3: string
  complaint1: string
  complaint2: string
  complaint3: string
  fear: string
  falseSolution: string
  mistakenBelief: string
  objection1: string
  objection2: string
  objection3: string
  expensiveAlternative1: string
  expensiveAlternative2: string
  expensiveAlternative3: string
  avatarStory: string
  
  // Transformation and core offer
  who: string
  outcome: string
  method: string
  timeframe: string
  guarantee: string
  
  // Activation points
  activationPoint1: string
  activationPoint2: string
  activationPoint3: string
  activationPoint4: string
  activationPoint5: string
  
  // Mechanisms
  mechanismPoint1: string
  mechanismPoint2: string
  mechanismPoint3: string
  mechanismPoint4: string
  mechanismPoint5: string
}

const sections = [
  {
    id: 'avatar',
    title: 'Target Avatar',
    subtitle: 'Define your ideal customer',
    fields: [
      { id: 'niche', label: 'Niche', type: 'input', placeholder: 'e.g., Real estate agents, Digital agency owners' },
      { id: 'income', label: 'Income Level', type: 'input', placeholder: 'e.g., $100k-$500k annually' },
      { id: 'age', label: 'Age Range', type: 'input', placeholder: 'e.g., 35-55 years old' },
      { id: 'traits', label: 'Key Traits', type: 'textarea', placeholder: 'Describe their personality, work style, and characteristics...' },
      { id: 'avatarStory', label: 'Avatar Story', type: 'textarea', placeholder: 'Tell the story of your ideal customer. What does their day look like? What challenges do they face?...' }
    ]
  },
  {
    id: 'problems',
    title: 'Problems & Pain Points',
    subtitle: 'What keeps them up at night?',
    fields: [
      { id: 'primaryGoal1', label: 'Primary Goal #1', type: 'input', placeholder: 'What is their #1 most important goal?' },
      { id: 'primaryGoal2', label: 'Primary Goal #2', type: 'input', placeholder: 'What is their #2 most important goal?' },
      { id: 'primaryGoal3', label: 'Primary Goal #3', type: 'input', placeholder: 'What is their #3 most important goal?' },
      { id: 'secondaryGoal1', label: 'Secondary Goal #1', type: 'input', placeholder: 'What other goals do they have?' },
      { id: 'secondaryGoal2', label: 'Secondary Goal #2', type: 'input', placeholder: 'What other goals do they have?' },
      { id: 'secondaryGoal3', label: 'Secondary Goal #3', type: 'input', placeholder: 'What other goals do they have?' },
      { id: 'complaint1', label: 'Main Complaint #1', type: 'input', placeholder: 'What do they complain about most?' },
      { id: 'complaint2', label: 'Main Complaint #2', type: 'input', placeholder: 'What else frustrates them?' },
      { id: 'complaint3', label: 'Main Complaint #3', type: 'input', placeholder: 'What other pain points do they have?' }
    ]
  },
  {
    id: 'psychology',
    title: 'Psychology & Beliefs',
    subtitle: 'Understand their mindset',
    fields: [
      { id: 'fear', label: 'Biggest Fear', type: 'textarea', placeholder: 'What is their biggest fear related to their problem?' },
      { id: 'falseSolution', label: 'False Solution', type: 'textarea', placeholder: 'What wrong solutions are they currently trying?' },
      { id: 'mistakenBelief', label: 'Mistaken Belief', type: 'textarea', placeholder: 'What do they wrongly believe about solving their problem?' },
      { id: 'objection1', label: 'Main Objection #1', type: 'input', placeholder: 'What will they object to about your offer?' },
      { id: 'objection2', label: 'Main Objection #2', type: 'input', placeholder: 'What other objections will they have?' },
      { id: 'objection3', label: 'Main Objection #3', type: 'input', placeholder: 'What other concerns will they raise?' },
      { id: 'expensiveAlternative1', label: 'Expensive Alternative #1', type: 'input', placeholder: 'What expensive solution could they choose instead?' },
      { id: 'expensiveAlternative2', label: 'Expensive Alternative #2', type: 'input', placeholder: 'What other costly alternatives exist?' },
      { id: 'expensiveAlternative3', label: 'Expensive Alternative #3', type: 'input', placeholder: 'What other high-priced options are available?' }
    ]
  },
  {
    id: 'transformation',
    title: 'Transformation & Offer',
    subtitle: 'Your core offer details',
    fields: [
      { id: 'who', label: 'Who (Target)', type: 'input', placeholder: 'e.g., Real estate agents who want to scale' },
      { id: 'outcome', label: 'Outcome', type: 'input', placeholder: 'e.g., Generate 20+ qualified leads per month' },
      { id: 'method', label: 'Method', type: 'input', placeholder: 'e.g., Facebook ads and landing page system' },
      { id: 'timeframe', label: 'Timeframe', type: 'input', placeholder: 'e.g., In the next 90 days' },
      { id: 'guarantee', label: 'Guarantee', type: 'textarea', placeholder: 'What guarantee or promise do you make?' }
    ]
  },
  {
    id: 'activation',
    title: 'Activation Points',
    subtitle: 'Key benefits and features',
    fields: [
      { id: 'activationPoint1', label: 'Activation Point #1', type: 'textarea', placeholder: 'First key benefit or feature...' },
      { id: 'activationPoint2', label: 'Activation Point #2', type: 'textarea', placeholder: 'Second key benefit or feature...' },
      { id: 'activationPoint3', label: 'Activation Point #3', type: 'textarea', placeholder: 'Third key benefit or feature...' },
      { id: 'activationPoint4', label: 'Activation Point #4', type: 'textarea', placeholder: 'Fourth key benefit or feature...' },
      { id: 'activationPoint5', label: 'Activation Point #5', type: 'textarea', placeholder: 'Fifth key benefit or feature...' }
    ]
  },
  {
    id: 'mechanism',
    title: 'Mechanism Points',
    subtitle: 'How it works and deliverables',
    fields: [
      { id: 'mechanismPoint1', label: 'Mechanism Point #1', type: 'textarea', placeholder: 'First part of your method or system...' },
      { id: 'mechanismPoint2', label: 'Mechanism Point #2', type: 'textarea', placeholder: 'Second part of your method or system...' },
      { id: 'mechanismPoint3', label: 'Mechanism Point #3', type: 'textarea', placeholder: 'Third part of your method or system...' },
      { id: 'mechanismPoint4', label: 'Mechanism Point #4', type: 'textarea', placeholder: 'Fourth part of your method or system...' },
      { id: 'mechanismPoint5', label: 'Mechanism Point #5', type: 'textarea', placeholder: 'Fifth part of your method or system...' }
    ]
  }
]

function EditOfferProfileContent() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const profileId = params.id as string
  
  const [currentSection, setCurrentSection] = useState(0)
  const [profileName, setProfileName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [offerData, setOfferData] = useState<OfferData>({
    // Avatar fields
    niche: '',
    income: '',
    age: '',
    traits: '',
    primaryGoal1: '',
    primaryGoal2: '',
    primaryGoal3: '',
    secondaryGoal1: '',
    secondaryGoal2: '',
    secondaryGoal3: '',
    complaint1: '',
    complaint2: '',
    complaint3: '',
    fear: '',
    falseSolution: '',
    mistakenBelief: '',
    objection1: '',
    objection2: '',
    objection3: '',
    expensiveAlternative1: '',
    expensiveAlternative2: '',
    expensiveAlternative3: '',
    avatarStory: '',
    
    // Transformation and core offer
    who: '',
    outcome: '',
    method: '',
    timeframe: '',
    guarantee: '',
    
    // Activation points
    activationPoint1: '',
    activationPoint2: '',
    activationPoint3: '',
    activationPoint4: '',
    activationPoint5: '',
    
    // Mechanisms
    mechanismPoint1: '',
    mechanismPoint2: '',
    mechanismPoint3: '',
    mechanismPoint4: '',
    mechanismPoint5: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (profileId) {
      loadProfile()
    }
  }, [user, profileId, router])

  const loadProfile = async () => {
    try {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      const response = await fetch(`/api/user/profile?userId=${userId}&profileId=${profileId}`)
      
      if (response.ok) {
        const data = await response.json()
        const profile = data.profile
        
        if (profile) {
          setProfileName(profile.name)
          // Pre-fill the form with existing data, keeping empty strings for missing fields
          setOfferData({
            niche: profile.data?.niche || '',
            income: profile.data?.income || '',
            age: profile.data?.age || '',
            traits: profile.data?.traits || '',
            primaryGoal1: profile.data?.primaryGoal1 || '',
            primaryGoal2: profile.data?.primaryGoal2 || '',
            primaryGoal3: profile.data?.primaryGoal3 || '',
            secondaryGoal1: profile.data?.secondaryGoal1 || '',
            secondaryGoal2: profile.data?.secondaryGoal2 || '',
            secondaryGoal3: profile.data?.secondaryGoal3 || '',
            complaint1: profile.data?.complaint1 || '',
            complaint2: profile.data?.complaint2 || '',
            complaint3: profile.data?.complaint3 || '',
            fear: profile.data?.fear || '',
            falseSolution: profile.data?.falseSolution || '',
            mistakenBelief: profile.data?.mistakenBelief || '',
            objection1: profile.data?.objection1 || '',
            objection2: profile.data?.objection2 || '',
            objection3: profile.data?.objection3 || '',
            expensiveAlternative1: profile.data?.expensiveAlternative1 || '',
            expensiveAlternative2: profile.data?.expensiveAlternative2 || '',
            expensiveAlternative3: profile.data?.expensiveAlternative3 || '',
            avatarStory: profile.data?.avatarStory || '',
            who: profile.data?.who || '',
            outcome: profile.data?.outcome || '',
            method: profile.data?.method || '',
            timeframe: profile.data?.timeframe || '',
            guarantee: profile.data?.guarantee || '',
            activationPoint1: profile.data?.activationPoint1 || '',
            activationPoint2: profile.data?.activationPoint2 || '',
            activationPoint3: profile.data?.activationPoint3 || '',
            activationPoint4: profile.data?.activationPoint4 || '',
            activationPoint5: profile.data?.activationPoint5 || '',
            mechanismPoint1: profile.data?.mechanismPoint1 || '',
            mechanismPoint2: profile.data?.mechanismPoint2 || '',
            mechanismPoint3: profile.data?.mechanismPoint3 || '',
            mechanismPoint4: profile.data?.mechanismPoint4 || '',
            mechanismPoint5: profile.data?.mechanismPoint5 || ''
          })
        } else {
          alert('Profile not found')
          router.push('/offer-profiles')
        }
      } else {
        alert('Failed to load profile')
        router.push('/offer-profiles')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      alert('Failed to load profile')
      router.push('/offer-profiles')
    }
    setIsLoading(false)
  }

  const currentSectionData = sections[currentSection]
  const isLastSection = currentSection === sections.length - 1

  const getSectionCompleteness = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return 0
    
    const filledFields = section.fields.filter(field => 
      offerData[field.id as keyof OfferData] && 
      String(offerData[field.id as keyof OfferData]).trim() !== ''
    ).length
    
    return filledFields / section.fields.length
  }

  const canContinue = getSectionCompleteness(currentSectionData.id) >= 0.6

  const handleNext = () => {
    if (isLastSection) {
      handleSave()
    } else {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection === 0) {
      router.push('/offer-profiles')
    } else {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setOfferData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSave = async () => {
    if (!profileName.trim()) {
      alert('Please enter a profile name')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT', // Use PUT for updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '00000000-0000-0000-0000-000000000000',
          profileId: profileId,
          name: profileName,
          data: offerData
        })
      })

      if (response.ok) {
        router.push('/offer-profiles')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
    setIsSaving(false)
  }

  const completeness = getSectionCompleteness(currentSectionData.id)
  const progress = ((currentSection + completeness) / sections.length) * 100

  if (isLoading) {
    return (
      <DashboardNav>
        <div className="h-full overflow-auto bg-tier-950 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent-500" />
            <div className="text-tier-300">Loading profile...</div>
          </div>
        </div>
      </DashboardNav>
    )
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Edit Offer Profile
              </h1>
              <p className="text-tier-300">
                Step {currentSection + 1} of {sections.length}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="w-full bg-tier-800 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-tier-500 mt-2 text-center">
                {Math.round(progress)}% complete
              </div>
            </div>

            {/* Profile Name */}
            {currentSection === 0 && (
              <Card className="bg-tier-900 border-tier-800 mb-6">
                <CardContent className="p-6">
                  <label className="block text-sm font-medium text-tier-300 mb-2">
                    Profile Name
                  </label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g., Digital Agency Owners - Scale to $50k"
                    className="bg-tier-800 border-tier-700 text-tier-100"
                  />
                  <p className="text-xs text-tier-500 mt-2">
                    Give your offer profile a descriptive name
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Section Card */}
            <Card className="bg-tier-900 border-tier-800">
              <CardHeader>
                <CardTitle className="text-tier-50 text-xl">
                  {currentSectionData.title}
                </CardTitle>
                <p className="text-tier-400">
                  {currentSectionData.subtitle}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {currentSectionData.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-tier-300 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          value={offerData[field.id as keyof OfferData] as string}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="bg-tier-800 border-tier-700 text-tier-100 min-h-[100px] resize-none"
                        />
                      ) : (
                        <Input
                          value={offerData[field.id as keyof OfferData] as string}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="bg-tier-800 border-tier-700 text-tier-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline"
                onClick={handlePrevious}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentSection === 0 ? 'Back to Profiles' : 'Previous'}
              </Button>

              <div className="text-center">
                <div className="text-sm text-tier-300 mb-1">
                  {Math.round(completeness * 100)}% of section complete
                </div>
                <div className="text-xs text-tier-500">
                  {canContinue ? 'Ready to continue' : 'Fill out more fields to continue'}
                </div>
              </div>
              
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
                onClick={handleNext}
                disabled={!canContinue || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isLastSection ? (
                  <Save className="w-4 h-4 mr-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : isLastSection ? 'Update Profile' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
}

function LoadingFallback() {
  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950 flex items-center justify-center">
        <div className="text-tier-300">Loading...</div>
      </div>
    </DashboardNav>
  )
}

export default function EditOfferProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditOfferProfileContent />
    </Suspense>
  )
} 