'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, Zap, Shield, Target, Users } from 'lucide-react'

export default function CreateFunnelPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'trigger' | 'gateway' | null>(null)

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/funnels/create/offer-profiles?type=${selectedType}`)
    }
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-tier-50 mb-4">
                Create Your Funnel
              </h1>
              <p className="text-lg text-tier-300">
                Choose the type of funnel that best fits your marketing goals
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-tier-50 font-medium">Funnel Type</span>
                </div>
                <div className="w-16 h-0.5 bg-tier-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-tier-700 rounded-full flex items-center justify-center text-tier-400 text-sm font-semibold">
                    2
                  </div>
                  <span className="ml-2 text-tier-400">Offer Details</span>
                </div>
                <div className="w-16 h-0.5 bg-tier-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-tier-700 rounded-full flex items-center justify-center text-tier-400 text-sm font-semibold">
                    3
                  </div>
                  <span className="ml-2 text-tier-400">Case Studies</span>
                </div>
                <div className="w-16 h-0.5 bg-tier-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-tier-700 rounded-full flex items-center justify-center text-tier-400 text-sm font-semibold">
                    4
                  </div>
                  <span className="ml-2 text-tier-400">Template & Launch</span>
                </div>
              </div>
            </div>

            {/* Funnel Type Selection */}
            <div className="grid gap-8 md:grid-cols-2 mb-12">
              {/* Trigger Funnel */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedType === 'trigger'
                    ? 'bg-accent-500/10 border-accent-500/50 shadow-lg'
                    : 'bg-tier-900 border-tier-800 hover:border-accent-500/30'
                }`}
                onClick={() => setSelectedType('trigger')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-tier-50">
                    Trigger Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-tier-300 text-lg">
                    Perfect for urgent offers and time-sensitive promotions
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-tier-400">
                      <Target className="w-4 h-4 text-accent-400" />
                      High-urgency messaging
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Users className="w-4 h-4 text-accent-400" />
                      Problem-agitation focus
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Zap className="w-4 h-4 text-accent-400" />
                      Scarcity-driven conversion
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-tier-500 text-xs">
                      Best for: Limited-time offers, product launches, event promotions
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Gateway Funnel */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedType === 'gateway'
                    ? 'bg-accent-500/10 border-accent-500/50 shadow-lg'
                    : 'bg-tier-900 border-tier-800 hover:border-accent-500/30'
                }`}
                onClick={() => setSelectedType('gateway')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-tier-50">
                    Gateway Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-tier-300 text-lg">
                    Ideal for building trust and nurturing relationships
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-tier-400">
                      <Shield className="w-4 h-4 text-accent-400" />
                      Trust-building approach
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Users className="w-4 h-4 text-accent-400" />
                      Value-first messaging
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Target className="w-4 h-4 text-accent-400" />
                      Long-term relationship focus
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-tier-500 text-xs">
                      Best for: Course sales, high-ticket services, subscription products
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push('/funnels')}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                Back to Funnels
              </Button>
              
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
                onClick={handleContinue}
                disabled={!selectedType}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-6 bg-tier-900/50 rounded-lg border border-tier-800">
              <h3 className="font-semibold text-tier-50 mb-2">Need help choosing?</h3>
              <p className="text-tier-400 text-sm">
                <strong>Trigger Funnels</strong> work best when your audience already knows they have a problem and need a solution quickly. 
                <strong className="ml-2">Gateway Funnels</strong> are perfect when you need to educate your audience and build trust before they're ready to buy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 