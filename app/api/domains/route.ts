import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export interface CustomDomain {
  id: string
  userId: string
  funnelId: string
  domain: string
  verified: boolean
  verificationToken: string
  dnsRecords?: any
  sslStatus: 'pending' | 'active' | 'error'
  createdAt: string
  updatedAt: string
  lastVerifiedAt?: string
}

// GET - Retrieve domains for a user or funnel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    const funnelId = searchParams.get('funnelId')
    const domainId = searchParams.get('domainId')
    
    let query = supabaseAdmin
      .from('custom_domains')
      .select('*')
      .eq('user_id', userId)

    if (funnelId) {
      query = query.eq('funnel_id', funnelId)
    }

    if (domainId) {
      query = query.eq('id', domainId).single()
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to retrieve domains' }, { status: 500 })
    }

    return NextResponse.json({ 
      domains: domainId ? [data] : data || [],
      domain: domainId ? data : undefined
    })
  } catch (error) {
    console.error('Error retrieving domains:', error)
    return NextResponse.json({ error: 'Failed to retrieve domains' }, { status: 500 })
  }
}

// POST - Add custom domain to funnel
export async function POST(request: NextRequest) {
  try {
    const { 
      userId = '00000000-0000-0000-0000-000000000000',
      funnelId,
      domain
    } = await request.json()

    if (!funnelId || !domain) {
      return NextResponse.json({ 
        error: 'Funnel ID and domain are required' 
      }, { status: 400 })
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/
    if (!domainRegex.test(domain) || domain.length > 253) {
      return NextResponse.json({ 
        error: 'Invalid domain format' 
      }, { status: 400 })
    }

    // Check if domain already exists globally
    const { data: existing } = await supabaseAdmin
      .from('custom_domains')
      .select('id')
      .eq('domain', domain)
      .single()

    if (existing) {
      return NextResponse.json({ 
        error: 'Domain already exists' 
      }, { status: 409 })
    }

    // Remove any existing domain for this funnel (one domain per funnel)
    const { data: existingForFunnel } = await supabaseAdmin
      .from('custom_domains')
      .select('id')
      .eq('funnel_id', funnelId)
      .eq('user_id', userId)
    
    if (existingForFunnel && existingForFunnel.length > 0) {
      await supabaseAdmin
        .from('custom_domains')
        .delete()
        .eq('funnel_id', funnelId)
        .eq('user_id', userId)
    }

    // Generate verification token
    const verificationToken = `ascension-verify-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`

    // Create DNS records instructions
    const dnsRecords = {
      cname: {
        name: domain,
        value: process.env.NEXT_PUBLIC_VERCEL_DOMAIN || 'your-app.vercel.app',
        type: 'CNAME'
      },
      txt: {
        name: `_ascension-verify.${domain}`,
        value: verificationToken,
        type: 'TXT'
      }
    }

    const domainData = {
      user_id: userId,
      funnel_id: funnelId,
      domain: domain.toLowerCase(),
      verification_token: verificationToken,
      dns_records: dnsRecords
    }

    const { data: newDomain, error } = await supabaseAdmin
      .from('custom_domains')
      .insert(domainData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 })
    }

    // Also update the funnel with the custom domain
    await supabaseAdmin
      .from('saved_funnels')
      .update({ 
        custom_domain: domain.toLowerCase(),
        domain_verification_token: verificationToken
      })
      .eq('id', funnelId)
      .eq('user_id', userId)

    return NextResponse.json({ 
      domain: newDomain,
      message: 'Domain added successfully! Please configure DNS records to verify.',
      dnsInstructions: {
        message: 'Add these DNS records to your domain:',
        records: [
          {
            type: 'CNAME',
            name: domain,
            value: process.env.NEXT_PUBLIC_VERCEL_DOMAIN || 'your-app.vercel.app',
            description: 'Points your domain to our servers'
          },
          {
            type: 'TXT',
            name: `_ascension-verify.${domain}`,
            value: verificationToken,
            description: 'Verifies domain ownership'
          }
        ]
      }
    })
  } catch (error) {
    console.error('Error adding domain:', error)
    return NextResponse.json({ error: 'Failed to add domain' }, { status: 500 })
  }
}

// PUT - Verify domain
export async function PUT(request: NextRequest) {
  try {
    const { 
      userId = '00000000-0000-0000-0000-000000000000',
      domainId,
      action
    } = await request.json()

    if (!domainId) {
      return NextResponse.json({ 
        error: 'Domain ID is required' 
      }, { status: 400 })
    }

    if (action === 'verify') {
      // Get domain details
      const { data: domain, error: domainError } = await supabaseAdmin
        .from('custom_domains')
        .select('*')
        .eq('id', domainId)
        .eq('user_id', userId)
        .single()

      if (domainError || !domain) {
        return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
      }

      // In a real implementation, you would:
      // 1. Check DNS records using a DNS lookup service
      // 2. Verify the TXT record contains the verification token
      // 3. Check if CNAME is properly configured
      
      // For demo purposes, we'll simulate verification
      const isVerified = Math.random() > 0.3 // 70% success rate for demo

      if (isVerified) {
        // Update domain as verified
        const { data: updatedDomain, error: updateError } = await supabaseAdmin
          .from('custom_domains')
          .update({ 
            verified: true, 
            ssl_status: 'active',
            last_verified_at: new Date().toISOString()
          })
          .eq('id', domainId)
          .eq('user_id', userId)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating domain:', updateError)
          return NextResponse.json({ error: 'Failed to update domain' }, { status: 500 })
        }

        // Update funnel domain verification
        await supabaseAdmin
          .from('saved_funnels')
          .update({ domain_verified: true })
          .eq('id', domain.funnel_id)
          .eq('user_id', userId)

        return NextResponse.json({ 
          domain: updatedDomain,
          message: 'Domain verified successfully!' 
        })
      } else {
        return NextResponse.json({ 
          error: 'Domain verification failed. Please check your DNS records.',
          details: 'Make sure both CNAME and TXT records are properly configured and have propagated.'
        }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error verifying domain:', error)
    return NextResponse.json({ error: 'Failed to verify domain' }, { status: 500 })
  }
}

// DELETE - Remove custom domain
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || '00000000-0000-0000-0000-000000000000'
    const domainId = searchParams.get('domainId')

    if (!domainId) {
      return NextResponse.json({ error: 'Domain ID is required' }, { status: 400 })
    }

    // Get domain details first
    const { data: domain } = await supabaseAdmin
      .from('custom_domains')
      .select('funnel_id')
      .eq('id', domainId)
      .eq('user_id', userId)
      .single()

    // Delete the domain
    const { error } = await supabaseAdmin
      .from('custom_domains')
      .delete()
      .eq('id', domainId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete domain' }, { status: 500 })
    }

    // Remove custom domain from funnel
    if (domain) {
      await supabaseAdmin
        .from('saved_funnels')
        .update({ 
          custom_domain: null,
          domain_verified: false,
          domain_verification_token: null
        })
        .eq('id', domain.funnel_id)
        .eq('user_id', userId)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Domain removed successfully!' 
    })
  } catch (error) {
    console.error('Error deleting domain:', error)
    return NextResponse.json({ error: 'Failed to delete domain' }, { status: 500 })
  }
} 