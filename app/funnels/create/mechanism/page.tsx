'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, ArrowLeft, Settings } from 'lucide-react'

interface MechanismData {
  mechanismPoint1: string
  mechanismPoint2: string
  mechanismPoint3: string
  mechanismPoint4: string
  mechanismPoint5: string
}

const mechanismPoints = [
  {
    id: 'mechanismPoint1',
    activationPoint: 'Activation Point 1: World class offer',
    title: 'MECHANISM FOR ACTIVATION POINT #1',
    example: 'Create an offer creation workbook and help implement/consult'
  },
  {
    id: 'mechanismPoint2', 
    activationPoint: 'Activation Point 2: Paid ads funnel',
    title: 'MECHANISM FOR ACTIVATION POINT #2',
    example: 'DFY ads setup'
  },
  {
    id: 'mechanismPoint3',
    activationPoint: 'Activation Point 3: Sales system',
    title: 'MECHANISM FOR ACTIVATION POINT #3',
    example: 'Templatise GHL systems and help implement'
  },
  {
    id: 'mechanismPoint4',
    activationPoint: 'Activation Point 4: Sales team recruitment',
    title: 'MECHANISM FOR ACTIVATION POINT #4',
    example: 'Recruit sales reps DFY'
  },
  {
    id: 'mechanismPoint5',
    activationPoint: 'Activation Point 5: Sales training and management',
    title: 'MECHANISM FOR ACTIVATION POINT #5',
    example: 'Course on sales training and leadership + 1on1s'
  }
]

function MechanismContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [mechanismData, setMechanismData] = useState<MechanismData>({
    mechanismPoint1: '',
    mechanismPoint2: '',
    mechanismPoint3: '',
    mechanismPoint4: '',
    mechanismPoint5: ''
  })

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, router])

  const handlePointChange = (pointId: string, value: string) => {
    setMechanismData(prev => ({
      ...prev,
      [pointId]: value
    }))
  }

  const handleNext = () => {
    let offerData = {}
    
    // Safely parse the data parameter with proper error handling
    if (dataParam) {
      try {
        offerData = JSON.parse(decodeURIComponent(dataParam))
      } catch (decodeError) {
        console.error('Error decoding funnel data:', decodeError)
        // Try to parse without URI decoding as fallback
        try {
          offerData = JSON.parse(dataParam)
        } catch (parseError) {
          console.error('Error parsing funnel data:', parseError)
          // If all parsing fails, redirect to start
          alert('There was an issue with your funnel data. Please try starting over.')
          router.push('/funnels/create')
          return
        }
      }
    }
    
    const combinedData = {
      ...offerData,
      ...mechanismData
    }
    
    router.push(`/funnels/create/case-studies?type=${funnelType}&data=${encodeURIComponent(JSON.stringify(combinedData))}`)
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/activation?type=${funnelType}&data=${dataParam}`)
  }

  // Check if at least 80% of mechanism points are filled
  const filledPoints = Object.values(mechanismData).filter(point => point.trim() !== '').length
  const canContinue = filledPoints >= 4 // At least 4 out of 5 points

  if (!funnelType || !dataParam) {
    return null
  }

  return (
    <div className="h-full overflow-auto bg-tier-950">
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          {/* Progress */}
          <div className="text-center mb-8">
            <div className="text-sm text-tier-400 mb-2">
              Step 5 of 6 - Mechanism
            </div>
            <div className="w-full bg-tier-800 rounded-full h-2">
              <div 
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '83%' }}
              ></div>
            </div>
            <div className="text-xs text-tier-500 mt-2">
              {Math.round((filledPoints / 5) * 100)}% complete
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-tier-900 border-tier-800 mb-8">
            <CardContent className="p-8">
              {/* Question Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-accent-400" />
                </div>
                <h1 className="text-2xl font-bold text-tier-50 mb-2">
                  Define Your Mechanisms
                </h1>
                <p className="text-tier-300">
                  For each activation point, describe HOW you will deliver on it
                </p>
              </div>

              {/* Mechanism Points */}
              <div className="space-y-8">
                {mechanismPoints.map((point, index) => (
                  <div key={point.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent-500/10 rounded-full flex items-center justify-center mt-1">
                        <span className="text-accent-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-accent-400 font-medium mb-1">
                          {point.activationPoint}
                        </div>
                        <label className="text-sm font-medium text-tier-200 block mb-1">
                          {point.title}
                        </label>
                        <div className="text-xs text-tier-500 mb-3">
                          Example: {point.example}
                        </div>
                      </div>
                    </div>
                    <Textarea
                      placeholder={`Describe how you will deliver on activation point ${index + 1}...`}
                      value={mechanismData[point.id as keyof MechanismData]}
                      onChange={(e) => handlePointChange(point.id, e.target.value)}
                      className="min-h-[100px] bg-tier-800 border-tier-700 text-tier-50 placeholder:text-tier-500 resize-none ml-11"
                      autoFocus={index === 0}
                    />
                  </div>
                ))}
                
                <div className="text-xs text-tier-500 mt-6">
                  Complete at least 4 out of 5 mechanism points to continue.
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
                {filledPoints}/5 mechanism points completed
              </div>
            </div>
            
            <Button 
              className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
              onClick={handleNext}
              disabled={!canContinue}
            >
              Continue to Case Studies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-tier-900/50 border-tier-800 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-tier-50 mb-3">💡 Mechanism Guide</h3>
              <div className="grid gap-3 text-sm">
                <div className="text-tier-300">
                  <strong className="text-tier-200">Mechanism 1:</strong> How will you create and deliver your world-class offer?
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Mechanism 2:</strong> How will you set up and manage paid advertising funnels?
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Mechanism 3:</strong> How will you implement and optimize sales systems?
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Mechanism 4:</strong> How will you recruit and build sales teams?
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Mechanism 5:</strong> How will you provide sales training and leadership?
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="h-full overflow-auto bg-tier-950">
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default function MechanismPage() {
  return (
    <DashboardNav>
      <Suspense fallback={<LoadingFallback />}>
        <MechanismContent />
      </Suspense>
    </DashboardNav>
  )
} 