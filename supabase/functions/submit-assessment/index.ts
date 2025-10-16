import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const WEBHOOK_URL = 'https://hook.eu1.make.com/wupz8z02hj9jqjxkngm1foxed2aud1ya'

interface AssessmentPayload {
  event: string
  session_id: string
  timestamp: string
  full_name: string
  email: string
  phone: string
  consent: boolean
  assessment: {
    q1_project_stage: string
    q2_user_persona: string
    q3_differentiation: string
    q4_existing_materials: string[]
    q5_business_model: string
    q6_revenue_goal: string
    q7_build_strategy: string
    q8_help_needed: string[]
    q9_investment_readiness: string
    q10_investment_level: string
    investment_readiness_score: number
  }
  [key: string]: any // For tracking data
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: AssessmentPayload = await req.json()
    
    // Get client IP from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    // Construct complete webhook payload
    const webhookPayload = {
      ...payload,
      ip_address: ip,
      server_timestamp: new Date().toISOString()
    }
    
    console.log('Sending assessment to webhook:', {
      event: webhookPayload.event,
      session_id: webhookPayload.session_id,
      email: webhookPayload.email
    })
    
    // Send to Make.com webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })
    
    if (!webhookResponse.ok) {
      console.error('Webhook failed:', await webhookResponse.text())
      throw new Error(`Webhook returned status ${webhookResponse.status}`)
    }
    
    console.log('Successfully sent to webhook')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Assessment submitted successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in submit-assessment function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
