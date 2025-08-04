'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Trash2,
  RefreshCw
} from 'lucide-react'

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

interface DomainManagerProps {
  funnelId: string
  userId?: string
  onDomainAdded?: (domain: CustomDomain) => void
  onDomainRemoved?: (domainId: string) => void
}

export function DomainManager({ 
  funnelId, 
  userId = '00000000-0000-0000-0000-000000000000',
  onDomainAdded,
  onDomainRemoved 
}: DomainManagerProps) {
  const [domains, setDomains] = useState<CustomDomain[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isVerifying, setIsVerifying] = useState<string | null>(null)
  const [showDnsInstructions, setShowDnsInstructions] = useState<string | null>(null)

  useEffect(() => {
    loadDomains()
  }, [funnelId])

  const loadDomains = async () => {
    try {
      const response = await fetch(`/api/domains?userId=${userId}&funnelId=${funnelId}`)
      if (response.ok) {
        const data = await response.json()
        setDomains(data.domains || [])
      }
    } catch (error) {
      console.error('Error loading domains:', error)
    }
    setIsLoading(false)
  }

  const addDomain = async () => {
    if (!newDomain.trim()) return

    setIsAdding(true)
    try {
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
        setDomains([data.domain, ...domains])
        setNewDomain('')
        setShowDnsInstructions(data.domain.id)
        onDomainAdded?.(data.domain)
      } else {
        alert(data.error || 'Failed to add domain')
      }
    } catch (error) {
      console.error('Error adding domain:', error)
      alert('Failed to add domain')
    }
    setIsAdding(false)
  }

  const verifyDomain = async (domainId: string) => {
    setIsVerifying(domainId)
    try {
      const response = await fetch('/api/domains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          domainId,
          action: 'verify'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setDomains(domains.map(d => 
          d.id === domainId ? { ...d, verified: true, sslStatus: 'active' } : d
        ))
        alert(data.message)
      } else {
        alert(data.error || 'Domain verification failed')
      }
    } catch (error) {
      console.error('Error verifying domain:', error)
      alert('Failed to verify domain')
    }
    setIsVerifying(null)
  }

  const removeDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to remove this domain?')) return

    try {
      const response = await fetch(`/api/domains?userId=${userId}&domainId=${domainId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDomains(domains.filter(d => d.id !== domainId))
        onDomainRemoved?.(domainId)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to remove domain')
      }
    } catch (error) {
      console.error('Error removing domain:', error)
      alert('Failed to remove domain')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add a toast notification here
  }

  if (isLoading) {
    return (
      <Card className="bg-tier-900 border-tier-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-tier-300">Loading domains...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-tier-900 border-tier-800">
        <CardHeader>
          <CardTitle className="text-tier-50 flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent-400" />
            Custom Domain
          </CardTitle>
          <p className="text-tier-400 text-sm">
            Connect your own domain to this funnel for better branding and SEO.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Domain */}
          <div className="flex gap-2">
            <Input
              placeholder="yourdomain.com or sub.yourdomain.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="bg-tier-800 border-tier-700 text-tier-100"
              onKeyPress={(e) => e.key === 'Enter' && addDomain()}
            />
            <Button 
              onClick={addDomain}
              disabled={isAdding || !newDomain.trim()}
              className="bg-accent-500 hover:bg-accent-600 text-white"
            >
              {isAdding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Domain List */}
          {domains.length > 0 && (
            <div className="space-y-3">
              {domains.map((domain) => (
                <div key={domain.id} className="border border-tier-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-tier-100 font-medium">{domain.domain}</span>
                      <Badge 
                        variant={domain.verified ? "default" : "secondary"}
                        className={domain.verified 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-yellow-500/20 text-yellow-400"
                        }
                      >
                        {domain.verified ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                      {domain.sslStatus === 'active' && (
                        <Badge className="bg-blue-500/20 text-blue-400">
                          SSL Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!domain.verified && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verifyDomain(domain.id)}
                          disabled={isVerifying === domain.id}
                          className="border-tier-600 text-tier-300 hover:border-tier-500"
                        >
                          {isVerifying === domain.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            'Verify'
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowDnsInstructions(
                          showDnsInstructions === domain.id ? null : domain.id
                        )}
                        className="border-tier-600 text-tier-300 hover:border-tier-500"
                      >
                        DNS
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeDomain(domain.id)}
                        className="border-red-600 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {domain.verified && (
                    <div className="flex items-center gap-2 text-sm text-tier-400">
                      <ExternalLink className="w-4 h-4" />
                      <a 
                        href={`https://${domain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-400 transition-colors"
                      >
                        Visit your funnel
                      </a>
                    </div>
                  )}

                  {/* DNS Instructions */}
                  {showDnsInstructions === domain.id && domain.dnsRecords && (
                    <div className="mt-4 p-4 bg-tier-800 rounded-lg border border-tier-700">
                      <h4 className="text-tier-100 font-medium mb-3">DNS Configuration</h4>
                      <p className="text-tier-400 text-sm mb-4">
                        Add these DNS records to your domain registrar:
                      </p>
                      
                      <div className="space-y-3">
                        {/* CNAME Record */}
                        <div className="bg-tier-900 p-3 rounded border border-tier-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-tier-300 font-medium">CNAME Record</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(domain.dnsRecords.cname.value)}
                              className="text-tier-400 hover:text-tier-200"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-tier-400 space-y-1">
                            <div><strong>Name:</strong> {domain.dnsRecords?.cname?.name || '@'}</div>
                            <div><strong>Value:</strong> {domain.dnsRecords.cname.value}</div>
                            <div><strong>TTL:</strong> {domain.dnsRecords?.cname?.ttl || '3600'} (or Auto)</div>
                          </div>
                          {/* Subdomain-specific note */}
                          {domain.domain.split('.').length > 2 && (
                            <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
                              <p className="text-blue-400">
                                💡 <strong>Subdomain:</strong> Use "{domain.dnsRecords?.cname?.name}" as the name (not the full domain)
                              </p>
                            </div>
                          )}
                        </div>

                        {/* TXT Record */}
                        <div className="bg-tier-900 p-3 rounded border border-tier-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-tier-300 font-medium">TXT Record (Verification)</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(domain.verificationToken)}
                              className="text-tier-400 hover:text-tier-200"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-sm text-tier-400 space-y-1">
                            <div><strong>Name:</strong> {domain.dnsRecords?.txt?.name || '_ascension-verify'}</div>
                            <div><strong>Value:</strong> {domain.dnsRecords?.txt?.value || domain.verificationToken}</div>
                            <div><strong>TTL:</strong> {domain.dnsRecords?.txt?.ttl || '3600'} (or Auto)</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                        <p className="text-blue-400 text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          DNS propagation can take up to 24 hours. Once configured, click "Verify" to check your setup.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {domains.length === 0 && (
            <div className="text-center py-8 text-tier-500">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No custom domains configured</p>
              <p className="text-sm">Add a domain above to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 