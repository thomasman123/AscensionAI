import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { promises as dns } from 'dns'

// Add domain to Vercel project automatically
async function addDomainToVercel(domain: string) {
  try {
    const vercelToken = process.env.VERCEL_TOKEN
    const vercelProjectId = process.env.VERCEL_PROJECT_ID
    
    if (!vercelToken || !vercelProjectId) {
      console.error('Missing Vercel credentials. Set VERCEL_TOKEN and VERCEL_PROJECT_ID environment variables')
      return false
    }

    console.log(`Adding domain ${domain} to Vercel project ${vercelProjectId}`)

    const response = await fetch(`https://api.vercel.com/v10/projects/${vercelProjectId}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: domain,
        // Optional: can set up redirects or other config here
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log(`Successfully added domain ${domain} to Vercel:`, result)
      return true
    } else {
      console.error(`Failed to add domain ${domain} to Vercel:`, result)
      // Don't fail verification if domain addition fails - it might already exist
      return result.error?.code === 'domain_already_in_use'
    }
  } catch (error) {
    console.error('Error adding domain to Vercel:', error)
    return false
  }
}

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
      const targetDomains = [
        'ascension-ai-sm36.vercel.app',  // Primary stable domain
        'ascension-ai-sm36-hp3v9pqg5-thomas-8419s-projects.vercel.app', // Current deployment (temporary)
        'ascension-ai-sm36-oimmnv92k-thomas-8419s-projects.vercel.app'  // Previous deployment (temporary)
      ]
      
      const isValid = records.some(record => 
        targetDomains.some(target => record.includes(target)) ||
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
    
    // Check TXT records on the actual domain being used
    // For man.heliosscale.com → check man.heliosscale.com
    // For heliosscale.com → check heliosscale.com
    const domainToCheck = domain
    
    console.log('Checking TXT records on domain:', domainToCheck)
    
    // Use Node.js DNS module to check TXT records
    try {
      const txtRecords = await dns.resolveTxt(domainToCheck)
      console.log('TXT records found:', txtRecords)
      
      // Flatten the TXT records array and check for our verification token
      const allTxtValues = txtRecords.flat()
      console.log('All TXT values:', allTxtValues)
      
      // Check for the exact token
      let hasExactToken = false
      let hasVerifyPrefix = false
      
      allTxtValues.forEach(record => {
        console.log(`Checking TXT record: "${record}"`)
        
        // Check for exact token match
        if (record.includes(token)) {
          hasExactToken = true
          console.log(`✅ Found exact token match in: "${record}"`)
        }
        
        // Check for _ascension-verify prefix (in case record format is different)
        if (record.includes('_ascension-verify') || record.includes('ascension-verify')) {
          hasVerifyPrefix = true
          console.log(`🔍 Found verification prefix in: "${record}"`)
        }
      })
      
      console.log('TXT verification results:', {
        hasExactToken,
        hasVerifyPrefix,
        totalRecords: allTxtValues.length,
        expectedToken: token,
        checkedDomain: domainToCheck
      })
      
      return hasExactToken
    } catch (txtError) {
      console.log('TXT record lookup failed:', (txtError as Error).message)
      
      // Try alternative lookup methods
      console.log('Trying alternative TXT lookup methods...')
      
      // Try looking for the _ascension-verify subdomain specifically
      try {
        const verifySubdomain = `_ascension-verify.${domainToCheck}`
        console.log('Checking _ascension-verify subdomain:', verifySubdomain)
        const verifyRecords = await dns.resolveTxt(verifySubdomain)
        console.log('_ascension-verify subdomain records:', verifyRecords)
        
        const verifyValues = verifyRecords.flat()
        return verifyValues.some(record => record.includes(token))
      } catch (verifyError) {
        console.log('_ascension-verify subdomain lookup failed:', (verifyError as Error).message)
      }
      
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
    console.log('POST /api/domains/verify - Domain details:', {
      domain: domain.domain,
      token: domain.verification_token,
      domainId: domain.id
    })

    if (verification.success) {
      // Add domain to Vercel project automatically
      const vercelAdded = await addDomainToVercel(domain.domain)
      console.log(`Vercel domain addition result for ${domain.domain}:`, vercelAdded)

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
        message: vercelAdded 
          ? 'Domain verified and automatically configured! Your custom domain is now active.'
          : 'Domain verified successfully! Your custom domain is now active.',
        verification,
        vercelConfigured: vercelAdded
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