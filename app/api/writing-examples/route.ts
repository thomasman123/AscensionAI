import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Retrieve writing examples
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    
    const { data: examples, error } = await supabaseAdmin
      .from('writing_style_examples')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to retrieve writing examples' }, { status: 500 })
    }

    // Transform database rows to match the interface
    const transformedExamples = examples?.map(example => ({
      id: example.id,
      title: example.title,
      content: example.content,
      type: example.type,
      createdAt: example.created_at
    })) || []

    return NextResponse.json({ examples: transformedExamples })
  } catch (error) {
    console.error('Error retrieving writing examples:', error)
    return NextResponse.json({ error: 'Failed to retrieve writing examples' }, { status: 500 })
  }
}

// POST - Save writing example
export async function POST(request: NextRequest) {
  try {
    const { userId = '00000000-0000-0000-0000-000000000000', title, content, type } = await request.json()

    if (!title || !content || !type) {
      return NextResponse.json({ error: 'Title, content, and type are required' }, { status: 400 })
    }

    const { data: example, error } = await supabaseAdmin
      .from('writing_style_examples')
      .insert({
        user_id: userId,
        title,
        content,
        type
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save writing example' }, { status: 500 })
    }

    // Transform back to interface format
    const transformedExample = {
      id: example.id,
      title: example.title,
      content: example.content,
      type: example.type,
      createdAt: example.created_at
    }

    return NextResponse.json({ example: transformedExample })
  } catch (error) {
    console.error('Error saving writing example:', error)
    return NextResponse.json({ error: 'Failed to save writing example' }, { status: 500 })
  }
}

// DELETE - Delete writing example
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    const exampleId = searchParams.get('exampleId')

    if (!exampleId) {
      return NextResponse.json({ error: 'Example ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('writing_style_examples')
      .delete()
      .eq('id', exampleId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete writing example' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting writing example:', error)
    return NextResponse.json({ error: 'Failed to delete writing example' }, { status: 500 })
  }
} 