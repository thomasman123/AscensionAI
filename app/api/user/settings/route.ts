import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export interface UserSettings {
  id: string
  userId: string
  logoUrl?: string
  companyName?: string
  websiteUrl?: string
  defaultColors: {
    primary: string
    secondary: string
    accent: string
  }
  createdAt: string
  updatedAt: string
}

// GET - Retrieve user settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'

    const { data: settings, error } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return default
        const defaultSettings: UserSettings = {
          id: '',
          userId,
          logoUrl: '',
          companyName: '',
          websiteUrl: '',
          defaultColors: {
            primary: '#3B82F6',
            secondary: '#1E40AF',
            accent: '#F59E0B'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return NextResponse.json({ settings: defaultSettings })
      }
      
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 })
    }

    // Transform to interface format
    const transformedSettings: UserSettings = {
      id: settings.id,
      userId: settings.user_id,
      logoUrl: settings.logo_url || '',
      companyName: settings.company_name || '',
      websiteUrl: settings.website_url || '',
      defaultColors: settings.default_colors || {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B'
      },
      createdAt: settings.created_at,
      updatedAt: settings.updated_at
    }

    return NextResponse.json({ settings: transformedSettings })
  } catch (error) {
    console.error('Error retrieving settings:', error)
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 })
  }
}

// POST - Create user settings
export async function POST(request: NextRequest) {
  try {
    const { userId, logoUrl, companyName, websiteUrl, defaultColors } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const dbData = {
      user_id: userId,
      logo_url: logoUrl,
      company_name: companyName,
      website_url: websiteUrl,
      default_colors: defaultColors || {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#F59E0B'
      }
    }

    const { data: settings, error } = await supabaseAdmin
      .from('user_settings')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const { userId, logoUrl, companyName, websiteUrl, defaultColors } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updateData = {
      logo_url: logoUrl,
      company_name: companyName,
      website_url: websiteUrl,
      default_colors: defaultColors,
      updated_at: new Date().toISOString()
    }

    // Try to update existing settings first
    const { data: existingSettings } = await supabaseAdmin
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single()

    let settings
    let error

    if (existingSettings) {
      // Update existing settings
      const result = await supabaseAdmin
        .from('user_settings')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()
      
      settings = result.data
      error = result.error
    } else {
      // Create new settings
      const result = await supabaseAdmin
        .from('user_settings')
        .insert({
          user_id: userId,
          ...updateData
        })
        .select()
        .single()
      
      settings = result.data
      error = result.error
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
} 