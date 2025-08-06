import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    
    // Fetch the default theme
    const { data: theme, error } = await supabase
      .from('themes')
      .select('*')
      .eq('is_default', true)
      .eq('name', 'Clean Light')
      .single()
    
    if (error) {
      console.error('Error fetching default theme:', error)
      return NextResponse.json({ error: 'Failed to fetch default theme' }, { status: 500 })
    }
    
    if (!theme) {
      return NextResponse.json({ error: 'Default theme not found' }, { status: 404 })
    }
    
    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error in default theme API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 