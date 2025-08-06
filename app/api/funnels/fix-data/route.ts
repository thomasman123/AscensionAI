import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { funnelId, userId } = await request.json()

    if (!funnelId || !userId) {
      return NextResponse.json({ error: 'Funnel ID and User ID are required' }, { status: 400 })
    }

    // Get the funnel with all its data
    const { data: funnel, error: fetchError } = await supabaseAdmin
      .from('saved_funnels')
      .select('*')
      .eq('id', funnelId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !funnel) {
      return NextResponse.json({ error: 'Funnel not found' }, { status: 404 })
    }

    // Rebuild the data column from individual columns
    const rebuiltData = {
      customization: {
        heading: funnel.headline || '',
        subheading: funnel.subheadline || '',
        heroText: funnel.hero_text || '',
        ctaText: funnel.cta_text || 'Get Started Now',
        caseStudiesHeading: funnel.case_studies_heading || 'Success Stories',
        caseStudiesSubtext: funnel.case_studies_subtext || 'See what others have achieved',
        bookingHeading: funnel.booking_heading || 'Book Your Strategy Call',
        offerDescription: funnel.offer_description || '',
        guaranteeText: funnel.guarantee_text || '',
        logoUrl: funnel.logo_url || '',
        footerText: '© 2024 Your Business. All rights reserved.',
        metaTitle: funnel.meta_title || '',
        metaDescription: funnel.meta_description || '',
        metaKeywords: funnel.meta_keywords || '',
        themeMode: funnel.theme_mode || 'light',
        funnelTheme: funnel.theme_mode || 'light',
        pixelCodes: {
          facebook: funnel.facebook_pixel_code || '',
          google: funnel.google_analytics_code || '',
          custom: funnel.custom_tracking_code || ''
        },
        media: {
          vslType: funnel.vsl_type || 'none',
          vslUrl: funnel.vsl_url || '',
          vslTitle: funnel.vsl_title || '',
          calendarEmbedCode: funnel.calendar_embed_code || '',
          calendarTitle: funnel.calendar_title || 'Book Your Call'
        },
        colors: {
          primary: funnel.primary_color || '#3b82f6',
          secondary: funnel.secondary_color || '#1e40af',
          accent: funnel.accent_color || '#059669',
          background: funnel.background_color || '#FFFFFF',
          text: funnel.text_color || '#1F2937'
        },
        // Preserve existing customization data if it exists
        textSizes: funnel.data?.customization?.textSizes || {
          desktop: {
            heading: 48,
            subheading: 24,
            caseStudiesHeading: 36,
            bookingHeading: 48
          },
          mobile: {
            heading: 36,
            subheading: 20,
            caseStudiesHeading: 28,
            bookingHeading: 36
          }
        },
        logoSize: funnel.data?.customization?.logoSize || {
          desktop: 48,
          mobile: 36
        },
        buttonSizes: funnel.data?.customization?.buttonSizes || {
          desktop: { ctaText: 100 },
          mobile: { ctaText: 100 }
        },
        sectionSpacing: funnel.data?.customization?.sectionSpacing || {},
        universalSpacers: funnel.data?.customization?.universalSpacers || {}
      },
      templateId: funnel.template_id,
      offerData: funnel.data?.offerData || {},
      caseStudies: funnel.data?.caseStudies || [],
      media: {
        vslType: funnel.vsl_type || 'none',
        vslUrl: funnel.vsl_url || '',
        vslTitle: funnel.vsl_title || '',
        calendarEmbedCode: funnel.calendar_embed_code || '',
        calendarTitle: funnel.calendar_title || 'Book Your Call',
        logoUrl: funnel.logo_url || ''
      }
    }

    // Update the funnel with rebuilt data
    const { error: updateError } = await supabaseAdmin
      .from('saved_funnels')
      .update({ 
        data: rebuiltData,
        updated_at: new Date().toISOString()
      })
      .eq('id', funnelId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating funnel:', updateError)
      return NextResponse.json({ error: 'Failed to update funnel' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Funnel data restored successfully',
      data: rebuiltData
    })

  } catch (error) {
    console.error('Error fixing funnel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 