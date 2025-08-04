'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, Target, Users, Zap, TrendingUp } from 'lucide-react'

export default function CreateOfferProfilePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'conversion' | 'nurture' | 'premium' | null>(null)

  const handleContinue = () => {
    if (selectedType) {
      router.push(`/offer-profiles/create/details?type=${selectedType}`)
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
                Create Your Offer Profile
              </h1>
              <p className="text-lg text-tier-300">
                Choose the type of offer profile that best fits your target audience
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-tier-50 font-medium">Profile Type</span>
                </div>
                <div className="w-16 h-0.5 bg-tier-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-tier-700 rounded-full flex items-center justify-center text-tier-400 text-sm font-semibold">
                    2
                  </div>
                  <span className="ml-2 text-tier-400">Target Avatar</span>
                </div>
                <div className="w-16 h-0.5 bg-tier-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-tier-700 rounded-full flex items-center justify-center text-tier-400 text-sm font-semibold">
                    3
                  </div>
                  <span className="ml-2 text-tier-400">Transformation</span>
                </div>
                <div className="w-16 h-0.5 bg-tier-700"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-tier-700 rounded-full flex items-center justify-center text-tier-400 text-sm font-semibold">
                    4
                  </div>
                  <span className="ml-2 text-tier-400">Save Profile</span>
                </div>
              </div>
            </div>

            {/* Profile Type Selection */}
            <div className="grid gap-6 md:grid-cols-3 mb-12">
              {/* Conversion Profile */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedType === 'conversion'
                    ? 'bg-accent-500/10 border-accent-500/50 shadow-lg'
                    : 'bg-tier-900 border-tier-800 hover:border-accent-500/30'
                }`}
                onClick={() => setSelectedType('conversion')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-tier-50">
                    Conversion Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-tier-300">
                    For audiences ready to buy and looking for quick results
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-tier-400">
                      <Target className="w-4 h-4 text-accent-400" />
                      High-intent prospects
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Zap className="w-4 h-4 text-accent-400" />
                      Immediate solution focus
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <TrendingUp className="w-4 h-4 text-accent-400" />
                      Results-driven messaging
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-tier-500 text-xs">
                      Best for: Problem-aware customers, competitive markets, quick wins
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Nurture Profile */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedType === 'nurture'
                    ? 'bg-accent-500/10 border-accent-500/50 shadow-lg'
                    : 'bg-tier-900 border-tier-800 hover:border-accent-500/30'
                }`}
                onClick={() => setSelectedType('nurture')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-tier-50">
                    Nurture Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-tier-300">
                    For building relationships and educating your audience
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-tier-400">
                      <Users className="w-4 h-4 text-accent-400" />
                      Trust-building focus
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Target className="w-4 h-4 text-accent-400" />
                      Educational approach
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <TrendingUp className="w-4 h-4 text-accent-400" />
                      Long-term value
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-tier-500 text-xs">
                      Best for: Cold audiences, complex solutions, relationship building
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Profile */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedType === 'premium'
                    ? 'bg-accent-500/10 border-accent-500/50 shadow-lg'
                    : 'bg-tier-900 border-tier-800 hover:border-accent-500/30'
                }`}
                onClick={() => setSelectedType('premium')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-tier-50">
                    Premium Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-tier-300">
                    For high-value offers and affluent target markets
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-tier-400">
                      <TrendingUp className="w-4 h-4 text-accent-400" />
                      Luxury positioning
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Target className="w-4 h-4 text-accent-400" />
                      Exclusive messaging
                    </div>
                    <div className="flex items-center gap-2 text-tier-400">
                      <Users className="w-4 h-4 text-accent-400" />
                      Quality over quantity
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-tier-500 text-xs">
                      Best for: High-ticket services, luxury products, executive coaching
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push('/offer-profiles')}
                className="border-tier-600 text-tier-300 hover:border-tier-500"
              >
                Back to Profiles
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
                <strong>Conversion Profiles</strong> work best for audiences that already understand their problem and are actively seeking solutions. 
                <strong className="ml-2">Nurture Profiles</strong> are perfect for cold audiences that need education and trust-building.
                <strong className="ml-2">Premium Profiles</strong> target affluent customers who value exclusivity and quality over price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 