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
    console.log('🔍 Loading: pathname:', pathname)
    console.log('🔍 Loading: extracted funnelPath:', funnelPath)
    
    // Fetch the logo
    const fetchLogo = async () => {
      try {
        const url = `/api/funnels/logo?path=${encodeURIComponent(funnelPath)}`
        console.log('🔍 Loading: Fetching from:', url)
        
        const response = await fetch(url)
        const data = await response.json()
        
        console.log('🔍 Loading: API response:', data)
        
        if (data.logoUrl) {
          console.log('✅ Loading: Setting logo URL:', data.logoUrl)
          setLogoUrl(data.logoUrl)
        } else {
          console.log('❌ Loading: No logo URL in response')
        }
      } catch (error) {
        console.error('❌ Loading: Failed to fetch funnel logo:', error)
      }
    }
    
    if (funnelPath) {
      fetchLogo()
    }
  }, [pathname])
  
  console.log('🔍 Loading: Current logoUrl state:', logoUrl)
  
  return <PremiumSpinner logoUrl={logoUrl} />
} 