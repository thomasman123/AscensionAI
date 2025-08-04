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
    
    let data, error

    if (domainId) {
      // Single domain query
      const result = await supabaseAdmin
        .from('custom_domains')
        .select('*')
        .eq('user_id', userId)
        .eq('id', domainId)
        .single()
      
      data = result.data
      error = result.error
    } else {
      // Multiple domains query
      let query = supabaseAdmin
        .from('custom_domains')
        .select('*')
        .eq('user_id', userId)

      if (funnelId) {
        query = query.eq('funnel_id', funnelId)
      }

      const result = await query.order('created_at', { ascending: false })
      
      data = result.data
      error = result.error
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to retrieve domains' }, { status: 500 })
    }

    // Transform snake_case to camelCase for frontend compatibility
    const transformDomain = (domain: any) => {
      if (!domain) return domain
      return {
        ...domain,
        userId: domain.user_id,
        funnelId: domain.funnel_id,
        verificationToken: domain.verification_token,
        dnsRecords: domain.dns_records,
        sslStatus: domain.ssl_status || 'pending',
        createdAt: domain.created_at,
        updatedAt: domain.updated_at,
        lastVerifiedAt: domain.last_verified_at
      }
    }

    return NextResponse.json({ 
      domains: domainId ? [transformDomain(data)] : (data || []).map(transformDomain),
      domain: domainId ? transformDomain(data) : undefined
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
    // For production, this should point to your actual deployment URL
    const productionDomain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || 
                            process.env.VERCEL_URL || 
                            'ascension-ai-sm36.vercel.app'
    
    const dnsRecords = {
      cname: {
        name: '@', // Root domain or subdomain name
        value: productionDomain,
        type: 'CNAME',
        ttl: 3600
      },
      txt: {
        name: '_ascension-verify',
        value: verificationToken,
        type: 'TXT',
        ttl: 3600
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

    // Transform for frontend compatibility
    const transformedDomain = {
      ...newDomain,
      userId: newDomain.user_id,
      funnelId: newDomain.funnel_id,
      verificationToken: newDomain.verification_token,
      dnsRecords: newDomain.dns_records,
      sslStatus: newDomain.ssl_status || 'pending',
      createdAt: newDomain.created_at,
      updatedAt: newDomain.updated_at,
      lastVerifiedAt: newDomain.last_verified_at
    }

    return NextResponse.json({ 
      domain: transformedDomain,
      message: 'Domain added successfully! Please configure DNS records to verify.',
      dnsInstructions: {
        message: 'Add these DNS records to your domain provider:',
        records: [
          {
            type: 'CNAME',
            name: '@',
            value: productionDomain,
            description: 'Points your domain to our servers',
            ttl: 3600
          },
          {
            type: 'TXT',
            name: '_ascension-verify',
            value: verificationToken,
            description: 'Verifies domain ownership',
            ttl: 3600
          }
        ],
        notes: [
          'If your provider does not support @ for the root domain, use your domain name instead',
          'TTL can be set to Auto if your provider supports it',
          'DNS changes may take up to 24 hours to propagate globally'
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

      // Use the dedicated verification service
      try {
        const verifyResponse = await fetch(`${request.nextUrl.origin}/api/domains/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domainId,
            userId
          })
        })

        const verifyData = await verifyResponse.json()

        if (verifyResponse.ok && verifyData.success) {
          // Transform for frontend compatibility
          const transformedDomain = {
            ...domain,
            verified: true,
            ssl_status: 'active',
            userId: domain.user_id,
            funnelId: domain.funnel_id,
            verificationToken: domain.verification_token,
            dnsRecords: domain.dns_records,
            sslStatus: 'active',
            createdAt: domain.created_at,
            updatedAt: domain.updated_at,
            lastVerifiedAt: new Date().toISOString()
          }

          return NextResponse.json({ 
            domain: transformedDomain,
            message: verifyData.message,
            verification: verifyData.verification
          })
        } else {
          return NextResponse.json({ 
            error: verifyData.message || 'Domain verification failed. Please check your DNS records.',
            details: verifyData.verification?.details || 'Make sure both CNAME and TXT records are properly configured and have propagated.',
            verification: verifyData.verification
          }, { status: 400 })
        }
      } catch (verifyError) {
        console.error('Error calling verification service:', verifyError)
        return NextResponse.json({ 
          error: 'Domain verification failed. Please check your DNS records.',
          details: 'Unable to verify DNS configuration. Please try again later.'
        }, { status: 500 })
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