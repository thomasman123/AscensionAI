import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Font functionality removed - will rebuild design system from scratch

export interface SavedFunnel {
  id: string
  name: string
  type: 'trigger' | 'gateway'
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  domain: string
  data: {
    // Offer data
    offerData: any
    
    // Case studies
    caseStudies: any[]
    
    // Media
    media: {
      vslType: 'video' | 'canva' | 'none'
      vslUrl: string
      vslTitle: string
      calendarEmbedCode: string
      calendarTitle: string
    }
    
    // Template
    templateId: string
    
    // Customization
    customization: {
      headline: string
      subheadline: string
      heroText: string
      ctaText: string
      offerDescription: string
      guaranteeText: string
      colors: {
        primary: string
        secondary: string
        accent: string
      }
      logoUrl?: string
      domain: string
    }
  }
}

// POST - Save/Launch funnel
export async function POST(request: NextRequest) {
  try {
    const { 
      userId,
      name,
      type,
      status = 'draft',
      domain,
      offerData,
      caseStudies,
      media,
      templateId,
      customization
    } = await request.json()

    if (!userId || !name || !type || !templateId) {
      return NextResponse.json({ 
        error: 'User ID, name, type, and template ID are required' 
      }, { status: 400 })
    }

    // Generate domain if not provided - use path-based routing for default domains
    const generateUrlSafePath = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '')      // Remove leading/trailing hyphens
        .substring(0, 50)             // Limit length for DNS compatibility
    }
    
    // Use path-based routing for default domains instead of subdomains
    const defaultPath = generateUrlSafePath(name)
    const funnelDomain = domain || `ascension-ai-sm36.vercel.app/funnel/${defaultPath}`
    
    console.log('🔧 Funnel Creation:', {
      originalName: name,
      generatedDomain: funnelDomain,
      providedDomain: domain,
      isDefaultPath: !domain
    })

    // Check for duplicate domains/paths and auto-resolve conflicts
    let finalDomain = funnelDomain
    if (!domain) {
      // For default domains, check if the path already exists
      const { data: existingFunnel } = await supabaseAdmin
        .from('saved_funnels')
        .select('id, name')
        .eq('domain', funnelDomain)
        .single()

      if (existingFunnel) {
        // Generate a unique path by appending a random suffix
        const uniqueSuffix = Math.random().toString(36).substring(2, 8)
        finalDomain = `ascension-ai-sm36.vercel.app/funnel/${defaultPath}-${uniqueSuffix}`
        
        console.log('🔄 Domain conflict detected, using unique domain:', finalDomain)
      }
    }

    // Prepare data for database
    const dbData = {
      user_id: userId,
      name,
      type,
      status,
      domain: finalDomain,
      template_id: templateId,
      
      // Media fields
      vsl_type: media?.vslType || 'none',
      vsl_url: media?.vslUrl || '',
      vsl_title: media?.vslTitle || '',
      calendar_embed_code: media?.calendarEmbedCode || '',
      calendar_title: media?.calendarTitle || 'Book Your Call',
      
      // Customization fields
      headline: customization?.heading || customization?.headline || '',
      subheadline: customization?.subheading || customization?.subheadline || '',
      hero_text: customization?.heroText || '',
      cta_text: customization?.ctaText || customization?.cta_text || 'Get Started Now',
      case_studies_heading: customization?.caseStudiesHeading || 'Success Stories',
      case_studies_subtext: customization?.caseStudiesSubtext || 'See what others have achieved',
      booking_heading: customization?.bookingHeading || 'Book Your Strategy Call',
      offer_description: customization?.offerDescription || '',
      guarantee_text: customization?.guaranteeText || '',
      // Colors are now hardcoded to defaults
      primary_color: '#3b82f6',
      secondary_color: '#1e40af',
      accent_color: '#059669',
      background_color: '#FFFFFF',
      text_color: '#1F2937',
      logo_url: customization?.logoUrl || null,
      // Font removed - will rebuild design system from scratch
      font_family: null,
      theme_style: 'clean', // Always use clean theme
      theme_mode: customization?.themeMode || 'light',
      
      // Tracking fields
      facebook_pixel_id: customization?.pixelIds?.facebook || null,
      google_analytics_id: customization?.pixelIds?.google || null,
      facebook_pixel_code: customization?.pixelCodes?.facebook || null,
      google_analytics_code: customization?.pixelCodes?.google || null,
      custom_tracking_code: customization?.pixelCodes?.custom || null,
      
      // Metadata fields
      meta_title: customization?.metaTitle || null,
      meta_description: customization?.metaDescription || null,
      meta_keywords: customization?.metaKeywords || null,
      
      // Store text sizes and other customization data in JSON
      data: {
        offerData,
        caseStudies: caseStudies || [],
        media: media || {
          vslType: 'none',
          vslUrl: '',
          vslTitle: '',
          calendarEmbedCode: '',
          calendarTitle: 'Book Your Call'
        },
        templateId,
        customization: {
          ...customization,
          textSizes: customization?.textSizes || {
            desktop: {
              heading: 100,
              subheading: 100,
              caseStudiesHeading: 100,
              bookingHeading: 100
            },
            mobile: {
              heading: 100,
              subheading: 100,
              caseStudiesHeading: 100,
              bookingHeading: 100
            }
          },
          logoSize: customization?.logoSize || {
            desktop: 48,
            mobile: 36
          },
          buttonSizes: customization?.buttonSizes || {
            desktop: {
              ctaText: 100
            },
            mobile: {
              ctaText: 100
            }
          }
        }
      }
    }

    const { data: funnel, error } = await supabaseAdmin
      .from('saved_funnels')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save funnel' }, { status: 500 })
    }

    // Save case studies if any
    if (caseStudies && caseStudies.length > 0) {
      const caseStudyData = caseStudies.map((cs: any) => ({
        user_id: userId,
        funnel_id: funnel.id,
        name: cs.name,
        description: cs.description,
        result: cs.result,
        media_url: cs.mediaUrl,
        media_type: cs.mediaType
      }))

      const { error: caseStudyError } = await supabaseAdmin
        .from('case_studies')
        .insert(caseStudyData)

      if (caseStudyError) {
        console.error('Case study save error:', caseStudyError)
        // Don't fail the funnel save if case studies fail
      }
    }

    // If launching, also save the offer profile for reuse
    if (status === 'published' && offerData) {
      try {
        // Save offer profile directly to database instead of making HTTP request
        const profileData = {
          user_id: userId,
          name: `${name} - Offer Profile`,
          niche: offerData.niche || '',
          income: offerData.income || '',
          age: offerData.age || '',
          traits: offerData.traits || '',
          primary_goal_1: offerData.primaryGoal1 || '',
          primary_goal_2: offerData.primaryGoal2 || '',
          primary_goal_3: offerData.primaryGoal3 || '',
          secondary_goal_1: offerData.secondaryGoal1 || '',
          secondary_goal_2: offerData.secondaryGoal2 || '',
          secondary_goal_3: offerData.secondaryGoal3 || '',
          complaint_1: offerData.complaint1 || '',
          complaint_2: offerData.complaint2 || '',
          complaint_3: offerData.complaint3 || '',
          fear: offerData.fear || '',
          false_solution: offerData.falseSolution || '',
          mistaken_belief: offerData.mistakenBelief || '',
          objection_1: offerData.objection1 || '',
          objection_2: offerData.objection2 || '',
          objection_3: offerData.objection3 || '',
          expensive_alternative_1: offerData.expensiveAlternative1 || '',
          expensive_alternative_2: offerData.expensiveAlternative2 || '',
          expensive_alternative_3: offerData.expensiveAlternative3 || '',
          avatar_story: offerData.avatarStory || '',
          who: offerData.who || '',
          outcome: offerData.outcome || '',
          method: offerData.method || '',
          timeframe: offerData.timeframe || '',
          guarantee: offerData.guarantee || '',
          activation_point_1: offerData.activationPoint1 || '',
          activation_point_2: offerData.activationPoint2 || '',
          activation_point_3: offerData.activationPoint3 || '',
          activation_point_4: offerData.activationPoint4 || '',
          activation_point_5: offerData.activationPoint5 || '',
          mechanism_point_1: offerData.mechanismPoint1 || '',
          mechanism_point_2: offerData.mechanismPoint2 || '',
          mechanism_point_3: offerData.mechanismPoint3 || '',
          mechanism_point_4: offerData.mechanismPoint4 || '',
          mechanism_point_5: offerData.mechanismPoint5 || '',
        }

        await supabaseAdmin
          .from('user_offer_profiles')
          .insert(profileData)
      } catch (error) {
        console.error('Error saving offer profile:', error)
        // Don't fail the funnel save if profile save fails
      }
    }

    // Transform back to interface format
    const transformedFunnel = {
      id: funnel.id,
      name: funnel.name,
      type: funnel.type,
      status: funnel.status,
      createdAt: funnel.created_at,
      updatedAt: funnel.updated_at,
      domain: funnel.domain,
      data: {
        offerData,
        caseStudies: caseStudies || [],
        media: media || {
          vslType: 'none',
          vslUrl: '',
          vslTitle: '',
          calendarEmbedCode: '',
          calendarTitle: 'Book Your Call'
        },
        templateId,
        customization
      }
    }

    return NextResponse.json({ 
      funnel: transformedFunnel,
      message: status === 'published' ? 'Funnel launched successfully!' : 'Funnel saved successfully!'
    })
  } catch (error) {
    console.error('Error saving funnel:', error)
    return NextResponse.json({ error: 'Failed to save funnel' }, { status: 500 })
  }
}

// GET - Retrieve saved funnels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    const funnelId = searchParams.get('funnelId')
    
    console.log(`Loading funnels for user: ${userId}${funnelId ? ` (specific funnel: ${funnelId})` : ''}`)
    
    if (funnelId) {
      // Get specific funnel with case studies
      const { data: funnel, error } = await supabaseAdmin
        .from('saved_funnels')
        .select(`
          *,
          case_studies (*)
        `)
        .eq('id', funnelId)
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Supabase error for specific funnel:', error)
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
        }
        return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 })
      }
      
      if (!funnel) {
        return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
      }
      
      // Transform to interface format
      const transformedFunnel = {
        id: funnel.id,
        name: funnel.name,
        type: funnel.type,
        status: funnel.status,
        createdAt: funnel.created_at,
        updatedAt: funnel.updated_at,
        domain: funnel.domain,
        data: {
          offerData: {}, // This would need to be reconstructed or stored separately
          caseStudies: funnel.case_studies || [],
          media: {
            vslType: funnel.vsl_type,
            vslUrl: funnel.vsl_url,
            vslTitle: funnel.vsl_title,
            calendarEmbedCode: funnel.calendar_embed_code,
            calendarTitle: funnel.calendar_title
          },
          templateId: funnel.template_id,
          customization: {
            heading: funnel.headline,
            subheading: funnel.subheadline,
            heroText: funnel.hero_text,
            ctaText: funnel.cta_text,
            caseStudiesHeading: funnel.case_studies_heading,
            caseStudiesSubtext: funnel.case_studies_subtext,
            bookingHeading: funnel.booking_heading,
            offerDescription: funnel.offer_description,
            guaranteeText: funnel.guarantee_text,
            colors: {
              primary: funnel.primary_color,
              secondary: funnel.secondary_color,
              accent: funnel.accent_color,
              background: funnel.background_color,
              text: funnel.text_color
            },
            logoUrl: funnel.logo_url,
            domain: funnel.domain,
            font: funnel.font_family,
            theme: funnel.theme_style,
            themeMode: funnel.theme_mode,
            pixelIds: {
              facebook: funnel.facebook_pixel_id || '',
              google: funnel.google_analytics_id || ''
            },
            pixelCodes: {
              facebook: funnel.facebook_pixel_code || '',
              google: funnel.google_analytics_code || '',
              custom: funnel.custom_tracking_code || ''
            },
            // Load text sizes from data column
            textSizes: funnel.data?.customization?.textSizes || {
              heading: 100,
              subheading: 100,
              caseStudiesHeading: 100,
              bookingHeading: 100
            },
            logoSize: funnel.data?.customization?.logoSize || {
              desktop: 48,
              mobile: 36
            },
            buttonSizes: funnel.data?.customization?.buttonSizes || {
              desktop: {
                ctaText: 100
              },
              mobile: {
                ctaText: 100
              }
            }
          }
        }
      }
      
      return NextResponse.json({ funnel: transformedFunnel })
    } else {
      // Get all funnels for user with timeout protection
      const queryPromise = supabaseAdmin
        .from('saved_funnels')
        .select(`
          *,
          custom_domains (
            id,
            domain,
            verified,
            ssl_status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 15000)
      )
      
      const { data: funnels, error } = await Promise.race([queryPromise, timeoutPromise]) as any
        
      if (error) {
        console.error('Supabase error for all funnels:', error)
        if (error.message === 'Database query timeout') {
          return NextResponse.json({ error: 'Request timeout', details: 'Database query took too long' }, { status: 504 })
        }
        return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 })
      }
      
      console.log(`Found ${funnels?.length || 0} funnels for user ${userId}`)
      
      // Transform to interface format
      const transformedFunnels = funnels?.map((funnel: any) => ({
        id: funnel.id,
        name: funnel.name,
        type: funnel.type,
        status: funnel.status,
        createdAt: funnel.created_at,
        updatedAt: funnel.updated_at,
        domain: funnel.domain,
        custom_domain: funnel.custom_domains?.[0]?.domain || null,
        domain_verified: funnel.custom_domains?.[0]?.verified || false,
        data: {
          templateId: funnel.template_id,
          media: {
            vslType: funnel.vsl_type,
            vslUrl: funnel.vsl_url,
            vslTitle: funnel.vsl_title,
            calendarEmbedCode: funnel.calendar_embed_code,
            calendarTitle: funnel.calendar_title
          },
          customization: {
            headline: funnel.headline,
            subheadline: funnel.subheadline,
            heroText: funnel.hero_text,
            ctaText: funnel.cta_text,
            offerDescription: funnel.offer_description,
            guaranteeText: funnel.guarantee_text,
            colors: {
              primary: funnel.primary_color,
              secondary: funnel.secondary_color,
              accent: funnel.accent_color
            },
            logoUrl: funnel.logo_url,
            domain: funnel.domain
          }
        }
      })) || []
      
      return NextResponse.json({ 
        funnels: transformedFunnels,
        count: transformedFunnels.length 
      })
    }
  } catch (error) {
    console.error('Error retrieving funnels:', error)
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message === 'Database query timeout') {
        return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
      }
      if (error.message.includes('network') || error.message.includes('connection')) {
        return NextResponse.json({ error: 'Database connection error' }, { status: 503 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to retrieve funnels', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT - Update funnel
export async function PUT(request: NextRequest) {
  try {
    const { 
      userId,
      funnelId,
      name,
      status,
      domain,
      customization,
      media,
      ...updateData
    } = await request.json()

    if (!userId || !funnelId) {
      return NextResponse.json({ error: 'User ID and Funnel ID are required' }, { status: 400 })
    }

    const updates: any = {}

    if (name) updates.name = name
    if (status) updates.status = status
    if (domain) updates.domain = domain

    if (media) {
      updates.vsl_type = media.vslType
      updates.vsl_url = media.vslUrl
      updates.vsl_title = media.vslTitle
      updates.calendar_embed_code = media.calendarEmbedCode
      updates.calendar_title = media.calendarTitle
    }

    if (customization) {
      // Basic customization fields that definitely exist
      updates.headline = customization.heading || customization.headline
      updates.subheadline = customization.subheading || customization.subheadline
      updates.hero_text = customization.heroText
      updates.cta_text = customization.ctaText || customization.cta_text
      updates.case_studies_heading = customization.caseStudiesHeading
      updates.case_studies_subtext = customization.caseStudiesSubtext
      updates.booking_heading = customization.bookingHeading
      updates.offer_description = customization.offerDescription
      
      // Logo handling
      if (customization.logoUrl !== undefined) {
        updates.logo_url = customization.logoUrl
      }
      updates.guarantee_text = customization.guaranteeText
      // Colors are now hardcoded to defaults
      updates.primary_color = '#3b82f6'
      updates.secondary_color = '#1e40af'
      updates.accent_color = '#059669'
      updates.background_color = '#FFFFFF'
      updates.text_color = '#1F2937'
      
      // Only add new fields if they exist (check if migration was run)
      try {
        // Font removed - will rebuild design system from scratch
        updates.font_family = null
        updates.theme_style = 'clean' // Always use clean theme
        if (customization.themeMode) updates.theme_mode = customization.themeMode
        if (customization.pixelIds?.facebook) updates.facebook_pixel_id = customization.pixelIds.facebook
        if (customization.pixelIds?.google) updates.google_analytics_id = customization.pixelIds.google
        if (customization.pixelCodes?.facebook) updates.facebook_pixel_code = customization.pixelCodes.facebook
        if (customization.pixelCodes?.google) updates.google_analytics_code = customization.pixelCodes.google
        if (customization.pixelCodes?.custom) updates.custom_tracking_code = customization.pixelCodes.custom
        // Metadata fields
        if (customization.metaTitle !== undefined) updates.meta_title = customization.metaTitle
        if (customization.metaDescription !== undefined) updates.meta_description = customization.metaDescription
        if (customization.metaKeywords !== undefined) updates.meta_keywords = customization.metaKeywords
      } catch (fieldError) {
        console.log('Some new fields may not exist in database yet:', fieldError)
      }
    }

    console.log('Updating funnel with data:', updates)
    
    const { data: funnel, error } = await supabaseAdmin
      .from('saved_funnels')
      .update(updates)
      .eq('id', funnelId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error || !funnel) {
      console.error('Supabase error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to update funnel', 
        details: error?.message || 'Unknown error',
        code: error?.code
      }, { status: 500 })
    }

    return NextResponse.json({ 
      funnel,
      message: 'Funnel updated successfully!'
    })
  } catch (error) {
    console.error('Error updating funnel:', error)
    return NextResponse.json({ error: 'Failed to update funnel' }, { status: 500 })
  }
}

// DELETE - Delete funnel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    const funnelId = searchParams.get('funnelId')

    if (!funnelId) {
      return NextResponse.json({ error: 'Funnel ID is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('saved_funnels')
      .delete()
      .eq('id', funnelId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete funnel' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Funnel deleted successfully!' })
  } catch (error) {
    console.error('Error deleting funnel:', error)
    return NextResponse.json({ error: 'Failed to delete funnel' }, { status: 500 })
  }
} 