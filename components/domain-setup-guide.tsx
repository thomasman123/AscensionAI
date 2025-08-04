'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Check, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  RefreshCw,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock
} from 'lucide-react'

interface DomainSetupGuideProps {
  funnelId: string
  funnelName: string
  userId?: string
  onClose: () => void
  onDomainConnected?: (domain: string) => void
  existingDomain?: string
}

interface CustomDomain {
  id: string
  userId: string
  funnelId: string
  domain: string
  verified: boolean
  verificationToken: string
  dnsRecords?: any
  sslStatus: 'pending' | 'active' | 'error'
  createdAt: string
  updatedAt: string
  lastVerifiedAt?: string
}

export function DomainSetupGuide({ 
  funnelId, 
  funnelName,
  userId = '00000000-0000-0000-0000-000000000000',
  onClose,
  onDomainConnected,
  existingDomain
}: DomainSetupGuideProps) {
  const [step, setStep] = useState(existingDomain ? 2 : 1) // Skip domain entry if already exists
  const [domainData, setDomainData] = useState<CustomDomain | null>(null)
  const [newDomain, setNewDomain] = useState(existingDomain || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    if (existingDomain) {
      loadExistingDomain()
    }
  }, [existingDomain])

  const loadExistingDomain = async () => {
    try {
      const response = await fetch(`/api/domains?userId=${userId}&funnelId=${funnelId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.domains.length > 0) {
          setDomainData(data.domains[0])
          setNewDomain(data.domains[0].domain)
          setStep(data.domains[0].verified ? 4 : 2)
        }
      }
    } catch (error) {
      console.error('Error loading domain:', error)
    }
  }

  const steps = [
    {
      id: 1,
      title: 'Enter Your Domain',
      description: 'Add the custom domain you want to connect to this funnel'
    },
    {
      id: 2,
      title: 'Configure DNS',
      description: 'Add the required DNS records to your domain provider'
    },
    {
      id: 3,
      title: 'Verify Connection',
      description: 'Test that your domain is properly configured'
    },
    {
      id: 4,
      title: 'All Set!',
      description: 'Your custom domain is connected and ready to use'
    }
  ]

  const addDomain = async () => {
    if (!newDomain.trim()) return

    setIsLoading(true)
    setError('')
    
    try {
      // Remove existing domain first if it exists
      if (domainData) {
        await fetch(`/api/domains?userId=${userId}&domainId=${domainData.id}`, {
          method: 'DELETE'
        })
      }

      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          funnelId,
          domain: newDomain.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        setDomainData(data.domain)
        setStep(2)
        onDomainConnected?.(newDomain.trim())
      } else {
        setError(data.error || 'Failed to add domain')
      }
    } catch (error) {
      console.error('Error adding domain:', error)
      setError('Failed to add domain')
    }
    setIsLoading(false)
  }

  const verifyDomain = async () => {
    if (!domainData) return

    setIsVerifying(true)
    try {
      const response = await fetch('/api/domains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          domainId: domainData.id,
          action: 'verify'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setDomainData({ ...domainData, verified: true, sslStatus: 'active' })
        setStep(4)
      } else {
        setError(data.error || 'Domain verification failed')
      }
    } catch (error) {
      console.error('Error verifying domain:', error)
      setError('Failed to verify domain')
    }
    setIsVerifying(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-tier-900 border-tier-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-tier-50 flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent-400" />
                Connect Custom Domain
              </CardTitle>
              <p className="text-tier-400 text-sm mt-1">
                Connect your domain to: <span className="text-tier-200 font-medium">{funnelName}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-tier-400 hover:text-tier-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step > stepItem.id ? 'bg-green-500 text-white' :
                  step === stepItem.id ? 'bg-accent-500 text-white' :
                  'bg-tier-700 text-tier-400'
                }`}>
                  {step > stepItem.id ? <Check className="w-4 h-4" /> : stepItem.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    step > stepItem.id ? 'bg-green-500' : 'bg-tier-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {error}
              </p>
            </div>
          )}

          {/* Step 1: Enter Domain */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-tier-50 mb-2">
                  {steps[0].title}
                </h3>
                <p className="text-tier-400 mb-4">
                  {domainData ? 'Change your custom domain for this funnel' : steps[0].description}
                </p>
              </div>

              {domainData && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                  <p className="text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Changing your domain will remove the current domain ({domainData.domain}) and you'll need to reconfigure DNS records.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-tier-300 mb-2">Domain Name</label>
                  <Input
                    placeholder="e.g., mycooloffers.com or sub.mycooloffers.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="bg-tier-800 border-tier-700 text-tier-100"
                    onKeyPress={(e) => e.key === 'Enter' && addDomain()}
                  />
                  <p className="text-tier-500 text-sm mt-1">
                    Enter your domain or subdomain without "https://" or "www". Both root domains and subdomains are supported.
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">Requirements:</h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• You must own this domain</li>
                    <li>• You need access to your domain's DNS settings</li>
                    <li>• Domain should not be used for other websites</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configure DNS */}
          {step === 2 && domainData && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-tier-50 mb-2">
                  {steps[1].title}
                </h3>
                <p className="text-tier-400 mb-4">
                  Add these DNS records to your domain provider's control panel
                </p>
                
                {/* Domain Info with Change/Delete Options */}
                <div className="flex items-center justify-between mb-4 p-3 bg-tier-800 rounded-lg border border-tier-700">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-accent-400" />
                    <div>
                      <p className="text-tier-100 font-medium">{domainData.domain}</p>
                      <p className="text-tier-500 text-sm">Custom domain for this funnel</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-tier-600 text-tier-300 hover:border-tier-500"
                    >
                      Change Domain
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this domain? This action cannot be undone.')) return
                        try {
                          const response = await fetch(`/api/domains?userId=${userId}&domainId=${domainData.id}`, {
                            method: 'DELETE'
                          })
                          if (response.ok) {
                            onClose()
                          } else {
                            const data = await response.json()
                            setError(data.error || 'Failed to delete domain')
                          }
                        } catch (error) {
                          setError('Failed to delete domain')
                        }
                      }}
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      Delete Domain
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* CNAME Record */}
                <div className="bg-tier-800 p-4 rounded-lg border border-tier-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-tier-200 font-medium">CNAME Record</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(domainData.dnsRecords?.cname?.value || '')}
                      className="text-tier-400 hover:text-tier-200"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-tier-500">Type:</span>
                      <p className="text-tier-100 font-mono">CNAME</p>
                    </div>
                    <div>
                      <span className="text-tier-500">Name:</span>
                      <p className="text-tier-100 font-mono">{domainData.dnsRecords?.cname?.name || '@'}</p>
                    </div>
                    <div>
                      <span className="text-tier-500">Value:</span>
                      <p className="text-tier-100 font-mono break-all">
                        {domainData.dnsRecords?.cname?.value || 'ascension-ai-sm36.vercel.app'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                    <div></div>
                    <div>
                      <span className="text-tier-500">TTL:</span>
                      <p className="text-tier-100 font-mono">{domainData.dnsRecords?.cname?.ttl || '3600'}</p>
                    </div>
                    <div></div>
                  </div>
                  {/* Subdomain-specific instructions */}
                  {domainData.domain && domainData.domain.split('.').length > 2 && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                      <p className="text-blue-400 text-sm">
                        💡 <strong>Subdomain Setup:</strong> Add these records in your DNS panel for the root domain ({domainData.domain.split('.').slice(-2).join('.')}). 
                        The name "{domainData.dnsRecords?.cname?.name}" will point your subdomain {domainData.domain} to our servers.
                      </p>
                    </div>
                  )}
                </div>

                {/* TXT Record */}
                <div className="bg-tier-800 p-4 rounded-lg border border-tier-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-tier-200 font-medium">TXT Record (Verification)</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(domainData.verificationToken)}
                      className="text-tier-400 hover:text-tier-200"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-tier-500">Type:</span>
                      <p className="text-tier-100 font-mono">TXT</p>
                    </div>
                    <div>
                      <span className="text-tier-500">Name:</span>
                      <p className="text-tier-100 font-mono break-all">
                        {domainData.dnsRecords?.txt?.name || '_ascension-verify'}
                      </p>
                    </div>
                    <div>
                      <span className="text-tier-500">Value:</span>
                      <p className="text-tier-100 font-mono break-all">
                        {domainData.dnsRecords?.txt?.value || domainData.verificationToken || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                    <div></div>
                    <div>
                      <span className="text-tier-500">TTL:</span>
                      <p className="text-tier-100 font-mono">{domainData.dnsRecords?.txt?.ttl || '3600'}</p>
                    </div>
                    <div></div>
                  </div>
                  {/* Simplified instructions for both subdomains and root domains */}
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                    <p className="text-blue-400 text-sm">
                      📝 <strong>Instructions:</strong> 
                      {domainData.domain.split('.').length > 2 ? (
                        <>
                          Add this TXT record in your DNS panel for the root domain ({domainData.domain.split('.').slice(-2).join('.')}).
                          <span className="block mt-1">
                            💡 The name "{domainData.dnsRecords?.txt?.name}" will create a TXT record specifically for your subdomain {domainData.domain}.
                          </span>
                        </>
                      ) : (
                        <>Add this TXT record to your domain ({domainData.domain}) in your DNS provider.</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  DNS changes can take up to 24 hours to propagate. Most changes take effect within a few minutes.
                </p>
                <div className="mt-3">
                  <a 
                    href={`https://dnschecker.org/all-dns-records-of-domain.php?query=${domainData.domain}&rtype=TXT&dns=google`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    🔍 Check DNS propagation status for {domainData.domain}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verify */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-tier-50 mb-2">
                  {steps[2].title}
                </h3>
                <p className="text-tier-400 mb-4">
                  Click the button below to check if your DNS records are configured correctly
                </p>
              </div>

              <div className="text-center py-8">
                <Button
                  onClick={verifyDomain}
                  disabled={isVerifying}
                  className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Domain
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-tier-800 rounded-lg border border-tier-700">
                <h4 className="text-tier-200 font-medium mb-2">Troubleshooting:</h4>
                <ul className="text-tier-400 text-sm space-y-1">
                  <li>• Make sure both DNS records are added correctly</li>
                  <li>• Wait for DNS propagation (can take up to 24 hours)</li>
                  <li>• Check with your domain provider for specific instructions</li>
                  <li>• Use a DNS checker tool to verify your records</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-tier-50 mb-2">
                  Domain Connected Successfully!
                </h3>
                <p className="text-tier-400 mb-6">
                  Your funnel is now accessible on your custom domain
                </p>
                
                <div className="flex items-center justify-center gap-2 p-4 bg-tier-800 rounded-lg border border-tier-700 mb-6">
                  <ExternalLink className="w-4 h-4 text-accent-400" />
                  <a 
                    href={`https://${newDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-400 hover:text-accent-300 font-medium"
                  >
                    {newDomain}
                  </a>
                </div>

                <div className="space-y-2 text-sm text-tier-400">
                  <p>✅ DNS records configured</p>
                  <p>✅ SSL certificate active</p>
                  <p>✅ Domain verified and ready</p>
                </div>
                
                {/* Domain Management Options */}
                <div className="mt-6 p-4 bg-tier-800 rounded-lg border border-tier-700">
                  <h4 className="text-tier-200 font-medium mb-3">Domain Management</h4>
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="border-tier-600 text-tier-300 hover:border-tier-500"
                    >
                      Change Domain
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete this domain? This will disconnect your custom domain from this funnel.')) return
                        try {
                          const response = await fetch(`/api/domains?userId=${userId}&domainId=${domainData?.id}`, {
                            method: 'DELETE'
                          })
                          if (response.ok) {
                            onClose()
                          } else {
                            const data = await response.json()
                            setError(data.error || 'Failed to delete domain')
                          }
                        } catch (error) {
                          setError('Failed to delete domain')
                        }
                      }}
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      Delete Domain
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-tier-800">
            <Button
              variant="outline"
              onClick={() => {
                if (step === 1) {
                  onClose()
                } else if (step === 2) {
                  setStep(1)
                } else if (step === 4) {
                  onClose()
                }
              }}
              className="border-tier-600 text-tier-300 hover:border-tier-500"
            >
              {step === 1 || step === 4 ? (
                'Close'
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </>
              )}
            </Button>

            <div className="flex gap-2">
              {step === 1 && (
                <Button
                  onClick={addDomain}
                  disabled={isLoading || !newDomain.trim()}
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {domainData ? 'Changing...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      {domainData ? 'Change Domain' : 'Next Step'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}

              {step === 2 && (
                <Button
                  onClick={() => setStep(3)}
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                >
                  I've Added DNS Records
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {step === 4 && (
                <Button
                  onClick={onClose}
                  className="bg-accent-500 hover:bg-accent-600 text-white"
                >
                  Done
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 