import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const themeId = params.id
    
    if (!themeId) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 })
    }
    
    // Fetch the theme by ID
    const { data: theme, error } = await supabase
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single()
    
    if (error) {
      console.error('Error fetching theme:', error)
      return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 })
    }
    
    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }
    
    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error in theme API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 