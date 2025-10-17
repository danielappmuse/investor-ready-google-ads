import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadData {
  full_name: string
  email: string
  phone: string
  consent: boolean
  project_type?: string
  budget_range?: string
  project_description?: string
  session_id: string
  form_location: 'top' | 'bottom'
  step: number
  gclid?: string
  keyword?: string
  match_type?: string
  city?: string
  device?: string
  landing_page: string
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    })
  }

  try {
    const leadData: LeadData = await req.json()
    
    // Get client IP address
    const clientIP = req.headers.get('cf-connecting-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    // Prepare webhook payload
    const webhookPayload = {
      ...leadData,
      ip: clientIP,
      timestamp: new Date().toISOString(),
      user_agent: req.headers.get('user-agent') || 'unknown'
    }

    // Send to Make.com webhook
    const webhookUrl = Deno.env.get('MAKE_WEBHOOK_LEAD_URL')
    if (!webhookUrl) {
      throw new Error('MAKE_WEBHOOK_LEAD_URL not configured')
    }
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    })

    if (!webhookResponse.ok) {
      console.error('Webhook submission failed:', await webhookResponse.text())
      throw new Error('Webhook submission failed')
    }

    // Log all the data being sent to webhook for debugging
    console.log('Complete webhook payload:', JSON.stringify(webhookPayload, null, 2))
    
    console.log('Lead submitted successfully:', {
      session_id: leadData.session_id,
      step: leadData.step,
      email: leadData.email,
      form_location: leadData.form_location,
      gclid: leadData.gclid,
      keyword: leadData.keyword,
      match_type: leadData.match_type,
      city: leadData.city,
      device: leadData.device,
      landing_page: leadData.landing_page,
      utm_source: leadData.utm_source,
      utm_campaign: leadData.utm_campaign,
      utm_medium: leadData.utm_medium
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead submitted successfully',
        session_id: leadData.session_id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error processing lead submission:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})