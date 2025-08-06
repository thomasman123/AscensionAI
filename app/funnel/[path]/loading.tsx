'use client'

import { PremiumSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Loading() {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined)
  const pathname = usePathname()
  
  useEffect(() => {
    // Extract the funnel path from the URL
    const funnelPath = pathname.replace('/funnel/', '')
    
    // Fetch the logo
    const fetchLogo = async () => {
      try {
        const response = await fetch(`/api/funnels/logo?path=${encodeURIComponent(funnelPath)}`)
        const data = await response.json()
        
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl)
        }
      } catch (error) {
        console.error('Failed to fetch funnel logo:', error)
      }
    }
    
    if (funnelPath) {
      fetchLogo()
    }
  }, [pathname])
  
  return <PremiumSpinner logoUrl={logoUrl} />
} 