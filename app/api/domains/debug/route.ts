import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '39bf120f-c485-445d-911b-34223d06ee69' // Your user ID from the logs
    
    console.log('🔍 Debug - Looking up domains for user:', userId)
    
    // Get all domains for this user
    const { data: domains, error } = await supabaseAdmin
      .from('custom_domains')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Debug - Error fetching domains:', error)
      return NextResponse.json({ error: 'Failed to fetch domains', details: error }, { status: 500 })
    }

    console.log('🔍 Debug - Found domains:', domains)

    // Also check funnel records
    const { data: funnels, error: funnelError } = await supabaseAdmin
      .from('saved_funnels')
      .select('id, name, custom_domain, domain_verified')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (funnelError) {
      console.error('Debug - Error fetching funnels:', funnelError)
    }

    return NextResponse.json({ 
      success: true,
      userId,
      domains: domains || [],
      funnels: funnels || [],
      totalDomains: domains?.length || 0,
      totalFunnels: funnels?.length || 0
    })
  } catch (error) {
    console.error('Debug - Error:', error)
    return NextResponse.json({ error: 'Debug failed', details: error }, { status: 500 })
  }
} 