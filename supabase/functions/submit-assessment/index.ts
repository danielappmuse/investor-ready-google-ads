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
  console.log('🟢 submit-assessment function invoked')
  console.log('📥 Request method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight - returning headers')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('📖 Parsing request body...')
    const payload: AssessmentPayload = await req.json()
    console.log('✅ Payload parsed successfully')
    console.log('📋 Session ID:', payload.session_id)
    console.log('📋 Email:', payload.email)
    console.log('📋 Event:', payload.event)
    
    // Get client IP from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               req.headers.get('x-real-ip') || 
               'unknown'
    console.log('🌐 Client IP:', ip)
    
    // Construct complete webhook payload
    const webhookPayload = {
      ...payload,
      ip_address: ip,
      server_timestamp: new Date().toISOString()
    }
    
    console.log('📤 Sending to webhook:', WEBHOOK_URL)
    console.log('📦 Webhook payload:', JSON.stringify(webhookPayload, null, 2))
    
    // Send to Make.com webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })
    
    console.log('📨 Webhook response status:', webhookResponse.status)
    console.log('📨 Webhook response ok:', webhookResponse.ok)
    
    if (!webhookResponse.ok) {
      const responseText = await webhookResponse.text()
      console.error('❌ Webhook failed with response:', responseText)
      throw new Error(`Webhook returned status ${webhookResponse.status}`)
    }
    
    console.log('✅ Successfully sent to webhook')
    
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
    console.error('❌ Error in submit-assessment function:', error)
    console.error('❌ Error type:', typeof error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
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
