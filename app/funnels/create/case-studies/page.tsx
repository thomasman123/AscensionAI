'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DashboardNav } from '@/components/dashboard-nav'
import { CaseStudyForm, type CaseStudy } from '@/components/case-study-form'
import { ArrowRight, ArrowLeft } from 'lucide-react'

function CaseStudiesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    {
      id: '1',
      name: '',
      description: '',
      result: ''
    }
  ])

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, router])

  const handleNext = () => {
    let existingData = {}
    if (dataParam) {
      try {
        existingData = JSON.parse(decodeURIComponent(dataParam))
      } catch (error) {
        console.error('Error parsing existing data:', error)
      }
    }

    const processedCaseStudies = caseStudies.map(cs => ({
      ...cs,
      // Ensure both field names are present for compatibility
      mediaUrl: cs.mediaUrl || cs.media_url,
      media_url: cs.mediaUrl || cs.media_url,
      mediaType: cs.mediaType || cs.media_type,
      media_type: cs.mediaType || cs.media_type
    }))

    const dataWithCaseStudies = {
      ...existingData,
      caseStudies: processedCaseStudies,
      funnelType
    }

    const encodedData = encodeURIComponent(JSON.stringify(dataWithCaseStudies))
    router.push(`/funnels/create/media-collection?type=${funnelType}&data=${encodedData}`)
  }

  const handleBack = () => {
    router.back()
  }

  const handleSkip = () => {
    let existingData = {}
    if (dataParam) {
      try {
        existingData = JSON.parse(decodeURIComponent(dataParam))
      } catch (error) {
        console.error('Error parsing existing data:', error)
      }
    }

    const dataWithCaseStudies = {
      ...existingData,
      caseStudies: [],
      funnelType
    }

    const encodedData = encodeURIComponent(JSON.stringify(dataWithCaseStudies))
    router.push(`/funnels/create/media-collection?type=${funnelType}&data=${encodedData}`)
  }

  return (
    <div className="min-h-screen bg-tier-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-tier-50 mb-4">
            Add Case Studies
          </h1>
          <p className="text-tier-300">
            Showcase real results from your customers to build trust and credibility
          </p>
        </div>

        <CaseStudyForm 
          caseStudies={caseStudies}
          onChange={setCaseStudies}
          showMetric={false}
        />

        <div className="flex items-center justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="border-tier-600 text-tier-300 hover:border-tier-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-tier-400 hover:text-tier-300"
            >
              Skip for now
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-accent-500 hover:bg-accent-600 text-white"
            >
              Continue
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
    <div className="min-h-screen bg-tier-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-tier-400">Loading...</p>
      </div>
    </div>
  )
}

export default function CaseStudiesPage() {
  return (
    <DashboardNav>
      <Suspense fallback={<LoadingFallback />}>
        <CaseStudiesContent />
      </Suspense>
    </DashboardNav>
  )
} 