import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Fetch case studies for a funnel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const funnelId = searchParams.get('funnelId')
    
    if (!funnelId) {
      return NextResponse.json({ error: 'Funnel ID is required' }, { status: 400 })
    }
    
    const { data: caseStudies, error } = await supabaseAdmin
      .from('case_studies')
      .select('*')
      .eq('funnel_id', funnelId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching case studies:', error)
      return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 })
    }
    
    return NextResponse.json({ caseStudies })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Save case studies for a funnel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { funnelId, caseStudies, userId } = body
    
    if (!funnelId || !userId) {
      return NextResponse.json({ error: 'Funnel ID and User ID are required' }, { status: 400 })
    }
    
    // First, delete existing case studies for this funnel
    await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('funnel_id', funnelId)
      .eq('user_id', userId)
    
    // Insert new case studies if any
    if (caseStudies && caseStudies.length > 0) {
      const caseStudyData = caseStudies.map((cs: any) => ({
        user_id: userId,
        funnel_id: funnelId,
        name: cs.name,
        description: cs.description,
        result: cs.result,
        media_url: cs.mediaUrl,
        media_type: cs.mediaType
      }))
      
      const { error } = await supabaseAdmin
        .from('case_studies')
        .insert(caseStudyData)
      
      if (error) {
        console.error('Error saving case studies:', error)
        return NextResponse.json({ error: 'Failed to save case studies' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove a specific case study
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const caseStudyId = searchParams.get('id')
    const userId = searchParams.get('userId')
    
    if (!caseStudyId || !userId) {
      return NextResponse.json({ error: 'Case study ID and User ID are required' }, { status: 400 })
    }
    
    const { error } = await supabaseAdmin
      .from('case_studies')
      .delete()
      .eq('id', caseStudyId)
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting case study:', error)
      return NextResponse.json({ error: 'Failed to delete case study' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 