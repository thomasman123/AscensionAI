'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, ArrowLeft, User, Target, Lightbulb, Settings } from 'lucide-react'

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
  
  // Legacy fields for compatibility
  activationPoints: string[]
  mechanism: string
}

const avatarFields = [
  { id: 'niche', label: 'Niche', placeholder: 'e.g., Small business owners in service-based industries' },
  { id: 'income', label: 'Income', placeholder: 'e.g., $50K-$200K annually' },
  { id: 'age', label: 'Age', placeholder: 'e.g., 35-50 years old' },
  { id: 'traits', label: 'Traits', placeholder: 'e.g., Ambitious, overwhelmed, tech-hesitant' },
  { id: 'primaryGoal1', label: 'Primary Goal 1', placeholder: 'e.g., Increase monthly revenue by 50%' },
  { id: 'primaryGoal2', label: 'Primary Goal 2', placeholder: 'e.g., Build a predictable sales pipeline' },
  { id: 'primaryGoal3', label: 'Primary Goal 3', placeholder: 'e.g., Scale without working more hours' },
  { id: 'secondaryGoal1', label: 'Secondary Goal 1', placeholder: 'e.g., Improve work-life balance' },
  { id: 'secondaryGoal2', label: 'Secondary Goal 2', placeholder: 'e.g., Build a strong team' },
  { id: 'secondaryGoal3', label: 'Secondary Goal 3', placeholder: 'e.g., Establish thought leadership' },
  { id: 'complaint1', label: 'Complaint 1', placeholder: 'e.g., Marketing feels like throwing money away' },
  { id: 'complaint2', label: 'Complaint 2', placeholder: 'e.g., Too many low-quality leads' },
  { id: 'complaint3', label: 'Complaint 3', placeholder: 'e.g., Inconsistent monthly revenue' },
  { id: 'fear', label: 'Fear', placeholder: 'e.g., Being stuck at current income level forever' },
  { id: 'falseSolution', label: 'False Solution', placeholder: 'e.g., Believing more hours equals more money' },
  { id: 'mistakenBelief', label: 'Mistaken Belief', placeholder: 'e.g., Good work automatically leads to success' },
  { id: 'objection1', label: 'Objection 1', placeholder: 'e.g., "I don\'t have time for this right now"' },
  { id: 'objection2', label: 'Objection 2', placeholder: 'e.g., "This probably won\'t work for my industry"' },
  { id: 'objection3', label: 'Objection 3', placeholder: 'e.g., "I\'ve tried similar things before"' },
  { id: 'expensiveAlternative1', label: 'Expensive Alternative 1', placeholder: 'e.g., Hiring a full-time marketing team ($120K/year)' },
  { id: 'expensiveAlternative2', label: 'Expensive Alternative 2', placeholder: 'e.g., Big agency retainer ($5K/month)' },
  { id: 'expensiveAlternative3', label: 'Expensive Alternative 3', placeholder: 'e.g., MBA or expensive courses ($50K+)' }
]

const transformationFields = [
  { id: 'who', label: 'WHO', placeholder: 'e.g., Service-based business owners making $50K-$200K' },
  { id: 'outcome', label: 'OUTCOME', placeholder: 'e.g., Predictable $50K months within 90 days' },
  { id: 'method', label: 'METHOD', placeholder: 'e.g., Our proven 5-step S.C.A.L.E. system' },
  { id: 'timeframe', label: 'TIMEFRAME', placeholder: 'e.g., 90 days with 1-hour daily implementation' },
  { id: 'guarantee', label: 'GUARANTEE', placeholder: 'e.g., 2x your monthly revenue or full refund' }
]

const sections = [
  {
    id: 'avatar',
    title: 'Avatar Profile',
    subtitle: 'Define your ideal customer in detail',
    icon: User,
    fields: avatarFields
  },
  {
    id: 'avatarStory',
    title: 'Avatar Story',
    subtitle: 'Tell the story of your ideal customer',
    icon: User,
    fields: [{ id: 'avatarStory', label: 'Avatar Story', placeholder: 'Write a detailed story about your ideal customer - their daily struggles, what keeps them up at night, their journey to finding your solution...' }]
  },
  {
    id: 'transformation',
    title: 'Transformation & Core Offer',
    subtitle: 'Define what transformation you provide',
    icon: Target,
    fields: transformationFields
  }
]

export default function OfferInputPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  
  const [currentSection, setCurrentSection] = useState(0)
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
    
    // Legacy fields
    activationPoints: ['', '', ''],
    mechanism: ''
  })

  useEffect(() => {
    if (!funnelType) {
      router.push('/funnels/create')
    }
  }, [funnelType, router])

  const currentSectionData = sections[currentSection]
  const isLastSection = currentSection === sections.length - 1

  // Check if current section is complete (at least 80% of fields filled)
  const getSectionCompleteness = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return 0
    
    const filledFields = section.fields.filter(field => 
      offerData[field.id as keyof OfferData] && 
      String(offerData[field.id as keyof OfferData]).trim() !== ''
    ).length
    
    return filledFields / section.fields.length
  }

  const canContinue = getSectionCompleteness(currentSectionData.id) >= 0.8

  const handleNext = () => {
    if (isLastSection) {
      // Navigate to activation points step
      router.push(`/funnels/create/activation?type=${funnelType}&data=${encodeURIComponent(JSON.stringify(offerData))}`)
    } else {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection === 0) {
      router.push(`/funnels/create?type=${funnelType}`)
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

  if (!funnelType) {
    return null
  }

  const completeness = getSectionCompleteness(currentSectionData.id)
  const progress = ((currentSection + completeness) / sections.length) * 100

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            {/* Progress */}
            <div className="text-center mb-8">
              <div className="text-sm text-tier-400 mb-2">
                Step {currentSection + 1} of {sections.length} - {currentSectionData.title}
              </div>
              <div className="w-full bg-tier-800 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-tier-500 mt-2">
                {Math.round(completeness * 100)}% complete in this section
              </div>
            </div>

            {/* Section Card */}
            <Card className="bg-tier-900 border-tier-800 mb-8">
              <CardContent className="p-8">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <currentSectionData.icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-tier-50 mb-2">
                    {currentSectionData.title}
                  </h1>
                  <p className="text-tier-300">
                    {currentSectionData.subtitle}
                  </p>
                </div>

                {/* Fields */}
                <div className="space-y-6">
                  {currentSectionData.fields.map((field, index) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-sm font-medium text-tier-200">
                        {field.label}
                      </label>
                      {field.id === 'avatarStory' ? (
                        <Textarea
                          placeholder={field.placeholder}
                          value={offerData[field.id as keyof OfferData] as string}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="min-h-[120px] bg-tier-800 border-tier-700 text-tier-50 placeholder:text-tier-500 resize-none"
                          autoFocus={index === 0}
                        />
                      ) : (
                        <Input
                          placeholder={field.placeholder}
                          value={offerData[field.id as keyof OfferData] as string}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="bg-tier-800 border-tier-700 text-tier-50 placeholder:text-tier-500"
                          autoFocus={index === 0}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="text-xs text-tier-500 mt-4">
                    Complete at least 80% of the fields to continue to the next section.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-tier-400 mb-1">
                  {funnelType === 'trigger' ? 'Trigger' : 'Gateway'} Funnel
                </div>
                <div className="text-xs text-tier-500">
                  Section {currentSection + 1} of {sections.length}
                </div>
              </div>
              
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
                onClick={handleNext}
                disabled={!canContinue}
              >
                {isLastSection ? 'Continue to Activation Points' : 'Next Section'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 