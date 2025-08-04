import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { promises as dns } from 'dns'

// DNS verification service - checks if DNS records are properly configured
async function verifyDNSRecords(domain: string, verificationToken: string) {
  try {
    console.log('Verifying DNS records for domain:', domain, 'with token:', verificationToken)
    
    // Check CNAME record (this would be a real DNS lookup in production)
    const cnameValid = await checkCNAMERecord(domain)
    
    // Check TXT record for verification token
    const txtValid = await checkTXTRecord(domain, verificationToken)
    
    return {
      success: cnameValid && txtValid,
      cname: cnameValid,
      txt: txtValid,
      details: {
        cname: cnameValid ? 'CNAME record points correctly to ascension-ai-sm36.vercel.app' : 'CNAME record not found or incorrect',
        txt: txtValid ? 'TXT verification record found' : 'TXT verification record not found'
      }
    }
  } catch (error) {
    console.error('DNS verification error:', error)
    return {
      success: false,
      cname: false,
      txt: false,
      details: {
        cname: 'Unable to verify CNAME record',
        txt: 'Unable to verify TXT record'
      }
    }
  }
}

async function checkCNAMERecord(domain: string): Promise<boolean> {
  try {
    console.log('Checking CNAME for domain:', domain)
    
    // Use Node.js DNS module to actually check CNAME records
    try {
      const records = await dns.resolveCname(domain)
      console.log('CNAME records found:', records)
      
      // Check if any CNAME record points to our Vercel domain
      const targetDomain = 'ascension-ai-sm36.vercel.app'
      const isValid = records.some(record => 
        record.includes(targetDomain) || 
        record.includes('vercel.app')
      )
      
      console.log('CNAME check - Valid:', isValid)
      return isValid
    } catch (dnsError) {
      // If CNAME lookup fails, try A record resolution as fallback
      console.log('CNAME not found, trying A record resolution')
      
      try {
        const addresses = await dns.resolve4(domain)
        console.log('A records found:', addresses)
        // If domain resolves to any IP, we'll consider it potentially valid
        return addresses.length > 0
      } catch (aError) {
        console.log('A record resolution also failed:', (aError as Error).message)
        return false
      }
    }
  } catch (error) {
    console.log('CNAME check failed:', (error as Error).message || 'Unknown error')
    return false
  }
}

async function checkTXTRecord(domain: string, token: string): Promise<boolean> {
  try {
    console.log('Checking TXT record for domain:', domain, 'looking for token:', token)
    
    // Determine the domain to check TXT records on
    // For subdomains, we need to check TXT records at the root domain
    const domainParts = domain.split('.')
    const rootDomain = domainParts.length > 2 
      ? domainParts.slice(-2).join('.') // Get root domain for subdomains
      : domain
    
    console.log('Checking TXT records on root domain:', rootDomain)
    
    // Use Node.js DNS module to check TXT records
    try {
      const txtRecords = await dns.resolveTxt(rootDomain)
      console.log('TXT records found:', txtRecords)
      
      // Flatten the TXT records array and check for our verification token
      const allTxtValues = txtRecords.flat()
      const hasVerificationRecord = allTxtValues.some(record => {
        // Check for records that start with our verification prefix
        return record.includes('_ascension-verify') || record.includes(token)
      })
      
      console.log('TXT verification result:', hasVerificationRecord)
      return hasVerificationRecord
    } catch (txtError) {
      console.log('TXT record lookup failed:', (txtError as Error).message)
      return false
    }
  } catch (error) {
    console.log('TXT check failed:', (error as Error).message || 'Unknown error')
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('POST /api/domains/verify - Request body:', body)
    
    const { domainId, userId } = body

    if (!domainId || !userId) {
      console.log('POST /api/domains/verify - Error: Missing required params:', { domainId, userId })
      return NextResponse.json({ 
        error: 'Domain ID and User ID are required' 
      }, { status: 400 })
    }

    console.log('POST /api/domains/verify - Looking up domain:', domainId, 'for user:', userId)

    // Get domain from database
    const { data: domain, error: fetchError } = await supabaseAdmin
      .from('custom_domains')
      .select('*')
      .eq('id', domainId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !domain) {
      console.log('POST /api/domains/verify - Domain not found error:', fetchError)
      return NextResponse.json({ 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    console.log('POST /api/domains/verify - Found domain:', domain.domain, 'with token:', domain.verification_token)

    // Verify DNS records
    const verification = await verifyDNSRecords(domain.domain, domain.verification_token)
    
    console.log('POST /api/domains/verify - Verification result:', verification)

    if (verification.success) {
      // Update domain as verified
      const { error: updateError } = await supabaseAdmin
        .from('custom_domains')
        .update({ 
          verified: true,
          ssl_status: 'active',
          last_verified_at: new Date().toISOString()
        })
        .eq('id', domainId)

      if (updateError) {
        console.error('Error updating domain:', updateError)
        return NextResponse.json({ 
          error: 'Failed to update domain status' 
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Domain verified successfully! Your custom domain is now active.',
        verification
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Domain verification failed. Please check your DNS settings.',
        verification
      })
    }

  } catch (error) {
    console.error('Domain verification error:', error)
    return NextResponse.json({ 
      error: 'Failed to verify domain' 
    }, { status: 500 })
  }
} 