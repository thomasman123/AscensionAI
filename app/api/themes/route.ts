import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Fetching public themes...')
    // Fetch all public themes
    const { data: themes, error } = await supabaseAdmin
      .from('themes')
      .select('*')
      .eq('is_public', true)
      .order('name')
    
    if (error) {
      console.error('Error fetching themes:', error)
      return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 })
    }
    
    console.log('Found themes:', themes?.length || 0, themes?.map(t => t.name))
    return NextResponse.json({ themes: themes || [] })
  } catch (error) {
    console.error('Error in themes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 