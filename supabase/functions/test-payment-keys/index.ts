import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("=== TEST PAYMENT KEYS FUNCTION ===");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get all environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePublishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log("=== ENVIRONMENT VARIABLES CHECK ===");
    console.log("STRIPE_SECRET_KEY exists:", !!stripeSecretKey);
    console.log("STRIPE_SECRET_KEY length:", stripeSecretKey?.length || 0);
    console.log("STRIPE_SECRET_KEY prefix:", stripeSecretKey?.substring(0, 7) || 'none');
    
    console.log("STRIPE_PUBLISHABLE_KEY exists:", !!stripePublishableKey);
    console.log("STRIPE_PUBLISHABLE_KEY length:", stripePublishableKey?.length || 0);
    console.log("STRIPE_PUBLISHABLE_KEY prefix:", stripePublishableKey?.substring(0, 7) || 'none');
    
    console.log("SUPABASE_URL exists:", !!supabaseUrl);
    console.log("SUPABASE_ANON_KEY exists:", !!supabaseAnonKey);
    console.log("SUPABASE_SERVICE_ROLE_KEY exists:", !!supabaseServiceKey);

    // Test Stripe API connection if keys are available
    if (stripeSecretKey) {
      console.log("=== TESTING STRIPE API ===");
      try {
        const testResponse = await fetch('https://api.stripe.com/v1/customers?limit=1', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
          },
        });
        
        console.log("Stripe API test status:", testResponse.status);
        
        if (testResponse.ok) {
          const data = await testResponse.json();
          console.log("Stripe API test success, customers found:", data.data?.length || 0);
        } else {
          const errorText = await testResponse.text();
          console.log("Stripe API test failed:", errorText);
        }
      } catch (stripeError) {
        console.log("Stripe API test error:", (stripeError as Error).message);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      environment: {
        hasStripeSecretKey: !!stripeSecretKey,
        hasStripePublishableKey: !!stripePublishableKey,
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseAnonKey: !!supabaseAnonKey,
        hasSupabaseServiceKey: !!supabaseServiceKey,
        stripeSecretKeyLength: stripeSecretKey?.length || 0,
        stripePublishableKeyLength: stripePublishableKey?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('=== ERROR IN TEST FUNCTION ===');
    const errorObj = error as Error;
    console.error('Error message:', errorObj.message);
    console.error('Error stack:', errorObj.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorObj.message,
      stack: errorObj.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});