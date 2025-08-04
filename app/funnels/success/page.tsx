'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DashboardNav } from '@/components/dashboard-nav'
import { 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Share2, 
  Edit, 
  BarChart3,
  Rocket,
  Globe,
  Eye,
  Settings
} from 'lucide-react'

function FunnelSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dataParam = searchParams.get('data')
  const [copied, setCopied] = useState(false)
  const [funnelData, setFunnelData] = useState<any>(null)

  useEffect(() => {
    if (dataParam) {
      try {
        let data
        try {
          data = JSON.parse(decodeURIComponent(dataParam))
        } catch (decodeError) {
          console.error('Error decoding funnel data:', decodeError)
          // Try to parse without URI decoding as fallback
          try {
            data = JSON.parse(dataParam)
          } catch (parseError) {
            console.error('Error parsing funnel data:', parseError)
            // If all parsing fails, redirect to funnels list
            alert('There was an issue loading your funnel data.')
            router.push('/funnels')
            return
          }
        }
        setFunnelData(data)
      } catch (error) {
        console.error('Error processing funnel data:', error)
        router.push('/funnels')
      }
    } else {
      router.push('/funnels')
    }
  }, [dataParam, router])

  const handleCopyUrl = async () => {
    if (funnelData?.funnelUrl) {
      try {
        await navigator.clipboard.writeText(funnelData.funnelUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = funnelData.funnelUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  if (!funnelData) {
    return (
      <div className="h-full overflow-auto bg-tier-950">
        <div className="min-h-full flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-tier-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-tier-950">
      <div className="min-h-full p-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-tier-50 mb-4">
              🎉 Funnel Launched Successfully!
            </h1>
            <p className="text-xl text-tier-300 max-w-2xl mx-auto">
              Your {funnelData.type} funnel is now live and ready to convert visitors into customers. 
              Share it with your audience and start driving traffic!
            </p>
          </div>

          {/* Funnel Details Card */}
          <Card className="bg-tier-900 border-tier-800 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-tier-50 text-xl mb-2">
                    {funnelData.customization?.headline || 'Your Funnel'}
                  </CardTitle>
                  <Badge variant={funnelData.type === 'trigger' ? 'warning' : 'accent'} className="capitalize">
                    {funnelData.type} Funnel
                  </Badge>
                </div>
                <Badge variant="success" className="bg-green-600 text-white">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Funnel URL */}
              <div>
                <label className="text-label-medium text-tier-200 block mb-2">
                  Funnel URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-tier-800 border border-tier-700 rounded-md px-3 py-2 text-tier-300 font-mono text-sm">
                    {funnelData.funnelUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="border-tier-600 text-tier-300 hover:border-tier-500"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-tier-600 text-tier-300 hover:border-tier-500"
                    onClick={() => window.open(funnelData.funnelUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-tier-800/50 rounded-lg p-4 text-center">
                  <div className="text-number-medium text-tier-50">0</div>
                  <div className="text-caption text-tier-400">Visitors</div>
                </div>
                <div className="bg-tier-800/50 rounded-lg p-4 text-center">
                  <div className="text-number-medium text-tier-50">0</div>
                  <div className="text-caption text-tier-400">Conversions</div>
                </div>
                <div className="bg-tier-800/50 rounded-lg p-4 text-center">
                  <div className="text-number-medium text-tier-50">0%</div>
                  <div className="text-caption text-tier-400">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="bg-tier-900 border-tier-800">
              <CardHeader>
                <CardTitle className="text-tier-50 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white"
                  onClick={() => window.open(funnelData.funnelUrl, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Your Funnel
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-tier-600 text-tier-300 hover:border-tier-500"
                  onClick={handleCopyUrl}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Funnel URL
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-tier-600 text-tier-300 hover:border-tier-500"
                  onClick={() => router.push(`/funnels/edit/${funnelData.id || 'new'}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Funnel
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-tier-900 border-tier-800">
              <CardHeader>
                <CardTitle className="text-tier-50 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Tracking & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-tier-300 text-sm">
                  Your funnel is automatically tracked. Monitor performance in real-time:
                </div>
                <ul className="space-y-2 text-tier-400 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                    Visitor analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                    Conversion tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                    A/B testing ready
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-accent-400 rounded-full"></div>
                    Lead collection
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="w-full border-tier-600 text-tier-300 hover:border-tier-500"
                  disabled
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Funnel Summary */}
          <Card className="bg-tier-900 border-tier-800 mb-8">
            <CardHeader>
              <CardTitle className="text-tier-50">Funnel Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-label-medium text-tier-200 mb-3">Target Audience</h4>
                  <p className="text-tier-400 text-sm">
                    {funnelData.avatar || 'Business owners and entrepreneurs'}
                  </p>
                </div>
                <div>
                  <h4 className="text-label-medium text-tier-200 mb-3">Core Transformation</h4>
                  <p className="text-tier-400 text-sm">
                    {funnelData.transformation || 'Transform your business results'}
                  </p>
                </div>
                <div>
                  <h4 className="text-label-medium text-tier-200 mb-3">Template Used</h4>
                  <p className="text-tier-400 text-sm">
                    {funnelData.templateId || 'Modern Sales Template'}
                  </p>
                </div>
                <div>
                  <h4 className="text-label-medium text-tier-200 mb-3">Case Studies</h4>
                  <p className="text-tier-400 text-sm">
                    {funnelData.caseStudies?.length || 0} case studies included
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/funnels')}
              className="border-tier-600 text-tier-300 hover:border-tier-500"
            >
              Back to Funnels
            </Button>
            <Button 
              className="bg-accent-500 hover:bg-accent-600 text-white"
              onClick={() => router.push('/funnels/create')}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Create Another Funnel
            </Button>
          </div>

          {/* Tips Card */}
          <Card className="bg-accent-500/5 border-accent-500/20 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-tier-50 mb-3">💡 Pro Tips for Success</h3>
              <div className="grid gap-3 text-sm">
                <div className="text-tier-300">
                  <strong className="text-tier-200">Drive traffic:</strong> Share your funnel URL on social media, email campaigns, and paid ads
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Test and optimize:</strong> Monitor conversion rates and A/B test different headlines
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Follow up:</strong> Set up email sequences to nurture leads who don't convert immediately
                </div>
                <div className="text-tier-300">
                  <strong className="text-tier-200">Custom domain:</strong> Consider connecting a custom domain for better branding
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

export default function FunnelSuccessPage() {
  return (
    <DashboardNav>
      <Suspense fallback={<LoadingFallback />}>
        <FunnelSuccessContent />
      </Suspense>
    </DashboardNav>
  )
} 