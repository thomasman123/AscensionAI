import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all public themes
    const { data: themes, error } = await supabase
      .from('themes')
      .select('*')
      .eq('is_public', true)
      .order('name')
    
    if (error) {
      console.error('Error fetching themes:', error)
      return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 })
    }
    
    return NextResponse.json({ themes: themes || [] })
  } catch (error) {
    console.error('Error in themes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 