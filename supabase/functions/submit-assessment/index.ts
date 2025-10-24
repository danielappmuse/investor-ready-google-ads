import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation schema
const assessmentSchema = z.object({
  event: z.string().max(100),
  session_id: z.string().uuid(),
  timestamp: z.string(),
  full_name: z.string().trim().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().regex(/^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/),
  consent: z.boolean(),
  assessment: z.object({
    q0_startup_type: z.string().max(500),
    q1_app_idea: z.string().max(1000),
    q2_project_stage: z.string().max(500),
    q3_user_persona: z.string().max(1000),
    q4_differentiation: z.string().max(1000),
    q5_existing_materials: z.array(z.string()).max(20),
    q6_business_model: z.string().max(500),
    q7_revenue_goal: z.string().max(500),
    q8_build_strategy: z.string().max(500),
    q9_help_needed: z.array(z.string()).max(20),
    q10_investment_level: z.string().max(500),
    investment_readiness_score: z.number().min(0).max(100),
    segment: z.string().max(100)
  })
}).passthrough() // Allow additional tracking fields

interface AssessmentPayload extends z.infer<typeof assessmentSchema> {
  [key: string]: any
}

// Rate limiting map (in-memory, simple IP-based)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS = 5 // Max 5 submissions per minute per IP

serve(async (req) => {
  console.log('🟢 submit-assessment function invoked')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'unknown'
    
    // Rate limiting check
    const now = Date.now()
    const limitData = rateLimitMap.get(ip)
    
    if (limitData) {
      if (now < limitData.resetAt) {
        if (limitData.count >= MAX_REQUESTS) {
          console.warn('⚠️ Rate limit exceeded for IP')
          return new Response(
            JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        limitData.count++
      } else {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    }

    const rawPayload = await req.json()
    
    // Validate input
    const payload = assessmentSchema.parse(rawPayload)
    
    console.log('✅ Payload validated - Session:', payload.session_id)

    // Capture user agent
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Detect city from IP with fallback providers
    let city = 'Unknown'
    let country = 'Unknown'
    let region = 'Unknown'
    
    if (ip && ip !== 'unknown') {
      try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
        if (geoResponse.ok) {
          const geoData = await geoResponse.json()
          city = geoData.city || 'Unknown'
          region = geoData.region || geoData.region_code || 'Unknown'
          country = geoData.country_name || geoData.country || 'Unknown'
        } else {
          throw new Error(`ipapi status ${geoResponse.status}`)
        }
      } catch (geoError) {
        try {
          const alt = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,city,regionName,country`)
          if (alt.ok) {
            const altData = await alt.json()
            if (altData.status === 'success') {
              city = altData.city || city
              region = altData.regionName || region
              country = altData.country || country
            }
          }
        } catch (e2) {
          console.error('❌ Geolocation failed')
        }
      }
    }

    // Miami local timestamp for NDA consent
    const MIAMI_TZ = 'America/New_York'
    const consentIso = (payload as any).nda_consent_timestamp || new Date().toISOString()
    const consentLocal = new Intl.DateTimeFormat('en-US', {
      timeZone: MIAMI_TZ,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date(consentIso))
    
    // Get webhook URL from environment
    const webhookUrl = Deno.env.get('MAKE_WEBHOOK_ASSESSMENT_URL')
    
    // Construct complete webhook payload
    const webhookPayload = {
      ...payload,
      ip_address: ip,
      user_agent: userAgent,
      city,
      region,
      country,
      server_timestamp: new Date().toISOString(),
      nda_consent_timestamp_local: consentLocal,
      nda_consent_timezone: MIAMI_TZ
    }
    
    // Send webhook in background (non-blocking)
    if (webhookUrl) {
      console.log('📤 Submitting to webhook')
      
      // Run webhook in background without blocking response
      const backgroundWebhook = async () => {
        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
          })
          
          if (!webhookResponse.ok) {
            console.error('❌ Webhook failed')
          } else {
            console.log('✅ Webhook sent')
          }
        } catch (error) {
          console.error('❌ Webhook error')
        }
      }
      
      // Start background task without waiting
      backgroundWebhook()
    } else {
      console.warn('⚠️ Webhook not configured')
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Assessment submitted successfully',
        city,
        region,
        country
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('❌ Submission error:', error)
    
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid input data',
          details: error.errors
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Submission failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
