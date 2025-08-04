'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomizePage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to funnels since customize step is removed
    router.push('/funnels')
  }, [router])

  return (
    <div className="h-full flex items-center justify-center bg-tier-950">
      <div className="text-tier-300">Redirecting...</div>
    </div>
  )
} 