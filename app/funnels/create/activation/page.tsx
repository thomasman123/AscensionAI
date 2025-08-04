'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, ArrowLeft, Target } from 'lucide-react'

interface ActivationData {
  activationPoint1: string
  activationPoint2: string
  activationPoint3: string
  activationPoint4: string
  activationPoint5: string
}

const activationPoints = [
  {
    id: 'activationPoint1',
    title: 'Activation Point 1',
    example: 'World class offer'
  },
  {
    id: 'activationPoint2',
    title: 'Activation Point 2',
    example: 'Paid ads funnel'
  },
  {
    id: 'activationPoint3',
    title: 'Activation Point 3',
    example: 'Sales system'
  },
  {
    id: 'activationPoint4',
    title: 'Activation Point 4',
    example: 'Sales team recruitment'
  },
  {
    id: 'activationPoint5',
    title: 'Activation Point 5',
    example: 'Sales training and management'
  }
]

function ActivationPointsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [activationData, setActivationData] = useState<ActivationData>({
    activationPoint1: '',
    activationPoint2: '',
    activationPoint3: '',
    activationPoint4: '',
    activationPoint5: ''
  })

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, router])

  const handlePointChange = (pointId: string, value: string) => {
    setActivationData(prev => ({
      ...prev,
      [pointId]: value
    }))
  }

  const handleNext = () => {
    const offerData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : {}
    const combinedData = {
      ...offerData,
      ...activationData
    }
    
    router.push(`/funnels/create/mechanism?type=${funnelType}&data=${encodeURIComponent(JSON.stringify(combinedData))}`)
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/offer?type=${funnelType}`)
  }

  // Check if at least 80% of activation points are filled
  const filledPoints = Object.values(activationData).filter(point => point.trim() !== '').length
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
              Step 4 of 6 - Activation Points
            </div>
            <div className="w-full bg-tier-800 rounded-full h-2">
              <div 
                className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: '67%' }}
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
                  <Target className="w-8 h-8 text-accent-400" />
                </div>
                <h1 className="text-2xl font-bold text-tier-50 mb-2">
                  Define Your Activation Points
                </h1>
                <p className="text-tier-300">
                  Describe the specific activation points for your business development
                </p>
              </div>

              {/* Activation Points */}
              <div className="space-y-6">
                {activationPoints.map((point, index) => (
                  <div key={point.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent-500/10 rounded-full flex items-center justify-center">
                        <span className="text-accent-400 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium text-tier-200 block mb-1">
                          {point.title}
                        </label>
                        <div className="text-xs text-tier-500 mb-2">
                          Example: {point.example}
                        </div>
                      </div>
                    </div>
                    <Input
                      placeholder={`Describe your ${point.title.toLowerCase()}...`}
                      value={activationData[point.id as keyof ActivationData]}
                      onChange={(e) => handlePointChange(point.id, e.target.value)}
                      className="bg-tier-800 border-tier-700 text-tier-50 placeholder:text-tier-500 ml-11"
                      autoFocus={index === 0}
                    />
                  </div>
                ))}
                
                <div className="text-xs text-tier-500 mt-6">
                  Complete at least 4 out of 5 activation points to continue.
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
                {filledPoints}/5 activation points completed
              </div>
            </div>
            
            <Button 
              className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
              onClick={handleNext}
              disabled={!canContinue}
            >
              Continue to Mechanism
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Info Card */}
          <Card className="bg-tier-900/50 border-tier-800 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-tier-50 mb-3">💡 Activation Points Guide</h3>
              <div className="grid gap-3 text-sm">
                <div className="text-tier-300">
                  <strong className="text-tier-200">Activation Point 1:</strong> Focus on creating a world-class, irresistible offer
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Activation Point 2:</strong> Develop a high-converting paid advertising funnel
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Activation Point 3:</strong> Implement an effective sales system and process
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Activation Point 4:</strong> Build and recruit a high-performing sales team
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Activation Point 5:</strong> Establish sales training, management, and leadership
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

export default function ActivationPointsPage() {
  return (
    <DashboardNav>
      <Suspense fallback={<LoadingFallback />}>
        <ActivationPointsContent />
      </Suspense>
    </DashboardNav>
  )
} 