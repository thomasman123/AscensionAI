'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardNav } from '@/components/dashboard-nav'
import { ArrowRight, ArrowLeft, Check, Zap, Calendar, Eye, Star } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: 'trigger' | 'gateway' | 'both'
  features: string[]
  recommended?: boolean
  pages: Array<{
    name: string
    description: string
    elements: string[]
  }>
}

const templates: Template[] = [
  {
    id: 'trigger-template-1',
    name: 'Trigger Funnel Template #1',
    description: 'High-converting two-page funnel with VSL landing page and booking page for immediate action',
    preview: '/templates/trigger-template-1.jpg',
    category: 'trigger',
    features: [
      'VSL-optimized landing page',
      'Integrated case studies section', 
      'Booking page with calendar embed',
      'Mobile-responsive design',
      'Fast loading & conversion optimized'
    ],
    recommended: true,
    pages: [
      {
        name: 'Landing Page',
        description: 'VSL-focused page with social proof and clear CTA',
        elements: [
          'Centered logo',
          'Bold headline & subheading',
          'VSL embed (video or Canva)',
          'Primary CTA button',
          'Case studies showcase',
          'Standard footer'
        ]
      },
      {
        name: 'Booking Page', 
        description: 'Streamlined booking with calendar integration',
        elements: [
          'Consistent branding',
          'Compelling headline',
          'Brief offer description',
          'Calendar embed',
          'Case studies (repeated)',
          'Standard footer'
        ]
      }
    ]
  }
]

export default function TemplateSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const funnelType = searchParams.get('type') as 'trigger' | 'gateway'
  const dataParam = searchParams.get('data')
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!funnelType || !dataParam) {
      router.push('/funnels/create')
    }
  }, [funnelType, dataParam, router])

  const filteredTemplates = templates.filter(template => 
    template.category === funnelType || template.category === 'both'
  )

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleGenerateWithAI = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    
    try {
      const funnelData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : {}
      
      const combinedData = {
        ...funnelData,
        templateId: selectedTemplate,
        timestamp: new Date().toISOString(),
        userId: 'current-user-id',
      }

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Navigate to customization with generated content
      router.push(`/funnels/create/customize?type=${funnelType}&data=${encodeURIComponent(JSON.stringify(combinedData))}`)
    } catch (error) {
      console.error('Error generating funnel:', error)
      setIsGenerating(false)
    }
  }

  const handlePrevious = () => {
    router.push(`/funnels/create/case-studies?type=${funnelType}&data=${dataParam}`)
  }

  if (!funnelType || !dataParam) {
    return null
  }

  if (isGenerating) {
    return (
      <DashboardNav>
        <div className="h-full overflow-auto bg-tier-950">
          <div className="min-h-full flex items-center justify-center p-8">
            <div className="max-w-2xl w-full text-center">
              <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-tier-50 mb-4">
                Generating Your AI-Powered Funnel
              </h1>
              <p className="text-tier-300 mb-6">
                Our AI is analyzing your offer data and creating personalized copy, headlines, and content optimized for your target audience...
              </p>
              <div className="bg-tier-900 rounded-lg p-6 border border-tier-800">
                <div className="space-y-3 text-left">
                  {[
                    'Analyzing avatar and offer data',
                    'Generating compelling headlines',
                    'Creating persuasive copy',
                    'Optimizing for conversions',
                    'Finalizing your funnel'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-tier-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardNav>
    )
  }

  return (
    <DashboardNav>
      <div className="h-full overflow-auto bg-tier-950">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="max-w-6xl w-full">
            {/* Progress */}
            <div className="text-center mb-8">
              <div className="text-sm text-tier-400 mb-2">
                Step 6 of 6 - Template Selection
              </div>
              <div className="w-full bg-tier-800 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-tier-50 mb-2">
                Choose Your Funnel Template
              </h1>
              <p className="text-lg text-tier-300">
                Select a proven template optimized for {funnelType} funnels
              </p>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-8 lg:grid-cols-1 mb-8">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`bg-tier-900 border-2 transition-all cursor-pointer ${
                    selectedTemplate === template.id 
                      ? 'border-accent-500 ring-2 ring-accent-500/20' 
                      : 'border-tier-800 hover:border-tier-700'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      {/* Template Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-accent-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-tier-50 flex items-center gap-2">
                              {template.name}
                              {template.recommended && (
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              )}
                            </h3>
                            <div className="text-sm text-tier-400 capitalize">{template.category} funnel</div>
                          </div>
                        </div>
                        
                        <p className="text-tier-300 mb-4">{template.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-tier-200 mb-2">Key Features:</h4>
                            <div className="grid gap-2">
                              {template.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-tier-300">
                                  <Check className="w-4 h-4 text-accent-400" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Page Structure */}
                      <div>
                        <h4 className="font-semibold text-tier-200 mb-4">Funnel Structure:</h4>
                        <div className="space-y-4">
                          {template.pages.map((page, index) => (
                            <div key={index} className="bg-tier-800 rounded-lg p-4 border border-tier-700">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-6 h-6 bg-accent-500/20 rounded-full flex items-center justify-center text-xs font-bold text-accent-400">
                                  {index + 1}
                                </div>
                                <h5 className="font-medium text-tier-50">{page.name}</h5>
                              </div>
                              <p className="text-sm text-tier-400 mb-3">{page.description}</p>
                              <div className="grid gap-1">
                                {page.elements.map((element, elemIndex) => (
                                  <div key={elemIndex} className="text-xs text-tier-500 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-tier-500 rounded-full"></div>
                                    {element}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedTemplate === template.id && (
                      <div className="mt-4 p-3 bg-accent-500/10 rounded-lg border border-accent-500/20">
                        <div className="flex items-center gap-2 text-accent-400">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Template Selected</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

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
                  {selectedTemplate ? 'Template selected' : 'Choose a template to continue'}
                </div>
              </div>
              
              <Button 
                className="bg-accent-500 hover:bg-accent-600 text-white disabled:opacity-50"
                onClick={handleGenerateWithAI}
                disabled={!selectedTemplate}
              >
                Generate with AI
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Template Preview Info */}
            {selectedTemplate && (
              <Card className="bg-tier-900/50 border-tier-800 mt-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-tier-50 mb-3">🚀 What happens next?</h3>
                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div className="text-tier-300">
                      <strong className="text-tier-200">1. AI Generation:</strong> Our AI will analyze all your offer data and generate personalized copy, headlines, and content.
                    </div>
                    <div className="text-tier-300">
                      <strong className="text-tier-200">2. Customization:</strong> Review and fine-tune the generated content to match your brand perfectly.
                    </div>
                    <div className="text-tier-300">
                      <strong className="text-tier-200">3. Launch:</strong> Deploy your high-converting funnel on your custom domain instantly.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardNav>
  )
} 