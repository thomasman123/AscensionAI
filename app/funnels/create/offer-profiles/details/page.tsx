'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
    description: 'Define your ideal customer',
    fields: [
      { id: 'niche', label: 'Niche', placeholder: 'e.g., Digital Marketing Agency Owners', type: 'input' },
      { id: 'income', label: 'Income', placeholder: 'e.g., $50k-$200k annually', type: 'input' },
      { id: 'age', label: 'Age', placeholder: 'e.g., 30-45 years old', type: 'input' },
      { id: 'traits', label: 'Traits', placeholder: 'e.g., Ambitious, Tech-savvy, Time-poor', type: 'textarea' },
      { id: 'primaryGoal1', label: 'Primary Goal 1', placeholder: 'Main goal they want to achieve', type: 'input' },
      { id: 'primaryGoal2', label: 'Primary Goal 2', placeholder: 'Secondary important goal', type: 'input' },
      { id: 'primaryGoal3', label: 'Primary Goal 3', placeholder: 'Third important goal', type: 'input' },
      { id: 'secondaryGoal1', label: 'Secondary Goal 1', placeholder: 'Additional goal they have', type: 'input' },
      { id: 'secondaryGoal2', label: 'Secondary Goal 2', placeholder: 'Another secondary goal', type: 'input' },
      { id: 'secondaryGoal3', label: 'Secondary Goal 3', placeholder: 'Third secondary goal', type: 'input' },
      { id: 'complaint1', label: 'Complaint 1', placeholder: 'What frustrates them most', type: 'input' },
      { id: 'complaint2', label: 'Complaint 2', placeholder: 'Another major frustration', type: 'input' },
      { id: 'complaint3', label: 'Complaint 3', placeholder: 'Third major complaint', type: 'input' },
      { id: 'fear', label: 'Fear', placeholder: 'What keeps them up at night', type: 'textarea' },
      { id: 'falseSolution', label: 'False Solution', placeholder: 'What they think will solve their problem but won\'t', type: 'textarea' },
      { id: 'mistakenBelief', label: 'Mistaken Belief', placeholder: 'What they wrongly believe about their situation', type: 'textarea' },
      { id: 'objection1', label: 'Objection 1', placeholder: 'First objection they have to buying', type: 'input' },
      { id: 'objection2', label: 'Objection 2', placeholder: 'Second objection to buying', type: 'input' },
      { id: 'objection3', label: 'Objection 3', placeholder: 'Third objection to buying', type: 'input' },
      { id: 'expensiveAlternative1', label: 'Expensive Alternative 1', placeholder: 'Costly alternative they might consider', type: 'input' },
      { id: 'expensiveAlternative2', label: 'Expensive Alternative 2', placeholder: 'Another expensive alternative', type: 'input' },
      { id: 'expensiveAlternative3', label: 'Expensive Alternative 3', placeholder: 'Third expensive alternative', type: 'input' },
      { id: 'avatarStory', label: 'Avatar Story', placeholder: 'Tell their complete story and situation', type: 'textarea' }
    ]
  },
  {
    id: 'transformation',
    title: 'Transformation & Core Offer',
    description: 'Define your core value proposition',
    fields: [
      { id: 'who', label: 'WHO', placeholder: 'Who you help specifically', type: 'input' },
      { id: 'outcome', label: 'OUTCOME', placeholder: 'The result you deliver', type: 'input' },
      { id: 'method', label: 'METHOD', placeholder: 'Your unique method or approach', type: 'input' },
      { id: 'timeframe', label: 'TIMEFRAME', placeholder: 'How quickly you deliver results', type: 'input' },
      { id: 'guarantee', label: 'GUARANTEE', placeholder: 'Your guarantee or promise', type: 'textarea' }
    ]
  },
  {
    id: 'activation',
    title: 'Activation Points',
    description: 'Key activation points for your offer',
    fields: [
      { id: 'activationPoint1', label: '1', placeholder: 'First activation point', type: 'textarea' },
      { id: 'activationPoint2', label: '2', placeholder: 'Second activation point', type: 'textarea' },
      { id: 'activationPoint3', label: '3', placeholder: 'Third activation point', type: 'textarea' },
      { id: 'activationPoint4', label: '4', placeholder: 'Fourth activation point', type: 'textarea' },
      { id: 'activationPoint5', label: '5', placeholder: 'Fifth activation point', type: 'textarea' }
    ]
  },
  {
    id: 'mechanisms',
    title: 'Mechanisms',
    description: 'Mechanisms built off each activation point',
    fields: [
      { id: 'mechanismPoint1', label: 'COMPLETE ACTIVATION POINT #1 FIRST (DO NOT EDIT)', placeholder: 'Mechanism for activation point 1', type: 'textarea' },
      { id: 'mechanismPoint2', label: 'COMPLETE ACTIVATION POINT #2 FIRST (DO NOT EDIT)', placeholder: 'Mechanism for activation point 2', type: 'textarea' },
      { id: 'mechanismPoint3', label: 'COMPLETE ACTIVATION POINT #3 FIRST (DO NOT EDIT)', placeholder: 'Mechanism for activation point 3', type: 'textarea' },
      { id: 'mechanismPoint4', label: 'COMPLETE ACTIVATION POINT #4 FIRST (DO NOT EDIT)', placeholder: 'Mechanism for activation point 4', type: 'textarea' },
      { id: 'mechanismPoint5', label: 'COMPLETE ACTIVATION POINT #5 FIRST (DO NOT EDIT)', placeholder: 'Mechanism for activation point 5', type: 'textarea' }
    ]
  }
]

function CreateFunnelOfferProfileDetailsContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  
  const [currentSection, setCurrentSection] = useState(0)
  const [profileName, setProfileName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
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
      router.push(`/funnels/create/offer-profiles?type=${funnelType}`)
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '00000000-0000-0000-0000-000000000000',
          name: profileName,
          data: offerData
        })
      })

      if (response.ok) {
        // After saving, continue to template selection with the new profile data
        const dataParam = encodeURIComponent(JSON.stringify(offerData))
        router.push(`/funnels/create/template?type=${funnelType}&data=${dataParam}&fromProfile=true`)
      } else {
        alert('Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    }
    setIsSaving(false)
  }

  const completeness = getSectionCompleteness(currentSectionData.id)
  const progress = ((currentSection + completeness) / sections.length) * 100

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center gap-4 mb-4 justify-center">
                <div className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-medium">
                  Step 2 of 8
                </div>
                <div className="flex-1 max-w-md bg-tier-800 rounded-full h-2">
                  <div 
                    className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: '25%' }}
                  ></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Create New Offer Profile
              </h1>
              <p className="text-tier-300">
                Step {currentSection + 1} of {sections.length} • {Math.round(progress)}% complete
              </p>
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
                <CardTitle className="text-tier-50 text-2xl">
                  {currentSectionData.title}
                </CardTitle>
                <p className="text-tier-300">
                  {currentSectionData.description}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
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
                          className="bg-tier-800 border-tier-700 text-tier-100 min-h-[100px]"
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
                {currentSection === 0 ? 'Back to Profile Selection' : 'Previous'}
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
                {isSaving ? 'Saving...' : isLastSection ? 'Save & Continue' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
}

export default function CreateFunnelOfferProfileDetailsPage() {
  return (
    <Suspense fallback={
      <DashboardNav>
        <div className="h-full overflow-auto bg-tier-950 flex items-center justify-center">
          <div className="text-tier-300">Loading...</div>
        </div>
      </DashboardNav>
    }>
      <CreateFunnelOfferProfileDetailsContent />
    </Suspense>
  )
} 