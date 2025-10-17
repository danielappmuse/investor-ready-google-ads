import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('=== Checkout Session Function Started ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables with detailed logging
    console.log('Checking environment variables...');
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePublishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    
    console.log('Environment check:');
    console.log('- STRIPE_SECRET_KEY exists:', !!stripeSecretKey);
    console.log('- STRIPE_SECRET_KEY length:', (stripeSecretKey || '').length);
    console.log('- STRIPE_PUBLISHABLE_KEY exists:', !!stripePublishableKey);
    console.log('- STRIPE_PUBLISHABLE_KEY length:', (stripePublishableKey || '').length);
    
    if (!stripeSecretKey || stripeSecretKey.trim() === '') {
      console.error('ERROR: STRIPE_SECRET_KEY is missing or empty');
      return new Response(JSON.stringify({ 
        error: 'Configuration Error',
        message: 'Stripe secret key is not configured. Please check your environment variables.',
        code: 'MISSING_SECRET_KEY'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!stripePublishableKey || stripePublishableKey.trim() === '') {
      console.error('ERROR: STRIPE_PUBLISHABLE_KEY is missing or empty');
      return new Response(JSON.stringify({ 
        error: 'Configuration Error',
        message: 'Stripe publishable key is not configured. Please check your environment variables.',
        code: 'MISSING_PUBLISHABLE_KEY'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Environment variables validated successfully');

    // Parse request body
    console.log('Parsing request body...');
    let body;
    try {
      body = await req.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid Request',
        message: 'Request body must be valid JSON',
        code: 'INVALID_JSON'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { email, firstName = '', lastName = '', origin } = body;
    console.log('Request data:', { email, firstName, lastName, origin });

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error('Invalid email provided:', email);
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Valid email address is required',
        code: 'INVALID_EMAIL'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Use origin from request or default
    const baseUrl = origin || req.headers.get("origin") || "https://7ac1fd06-55fe-4940-8a95-42773a8d6ae0.lovableproject.com";

    // Search for existing customer
    console.log('Searching for existing Stripe customer...');
    let customerId;
    
    try {
      const searchResponse = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      });

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.error('Customer search failed:', searchResponse.status, errorText);
        throw new Error(`Customer search failed: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      if (searchData.data && searchData.data.length > 0) {
        customerId = searchData.data[0].id;
        console.log('Found existing customer:', customerId);
      } else {
        console.log('No existing customer found');
      }
    } catch (searchError) {
      console.error('Error during customer search:', searchError);
      return new Response(JSON.stringify({ 
        error: 'Customer Lookup Failed',
        message: 'Unable to search for existing customer',
        code: 'CUSTOMER_SEARCH_ERROR'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Create customer if not found
    if (!customerId) {
      console.log('Creating new Stripe customer...');
      
      try {
        const createCustomerBody = new URLSearchParams({
          email: email,
          name: `${firstName} ${lastName}`.trim(),
          'metadata[source]': 'startwise-validation'
        });

        const createResponse = await fetch('https://api.stripe.com/v1/customers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stripeSecretKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: createCustomerBody,
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('Customer creation failed:', createResponse.status, errorText);
          
          try {
            const errorJson = JSON.parse(errorText);
            return new Response(JSON.stringify({ 
              error: 'Customer Creation Failed',
              message: errorJson.error?.message || 'Unable to create customer account',
              code: 'CUSTOMER_CREATION_ERROR'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            });
          } catch {
            return new Response(JSON.stringify({ 
              error: 'Customer Creation Failed',
              message: 'Unable to create customer account',
              code: 'CUSTOMER_CREATION_ERROR'
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500,
            });
          }
        }

        const customerData = await createResponse.json();
        customerId = customerData.id;
        console.log('Created new customer:', customerId);
      } catch (createError) {
        console.error('Error during customer creation:', createError);
        return new Response(JSON.stringify({ 
          error: 'Customer Creation Failed',
          message: 'Unable to create customer account',
          code: 'CUSTOMER_CREATION_ERROR'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
    }

    // Create checkout session
    console.log('Creating checkout session...');
    
    try {
      const checkoutSessionBody = new URLSearchParams();
      checkoutSessionBody.append('payment_method_types[]', 'card');
      checkoutSessionBody.append('payment_method_types[]', 'link');
      checkoutSessionBody.append('payment_method_types[]', 'us_bank_account');
      checkoutSessionBody.append('payment_method_types[]', 'cashapp');
      checkoutSessionBody.append('payment_method_types[]', 'affirm');
      checkoutSessionBody.append('payment_method_types[]', 'klarna');
      checkoutSessionBody.append('mode', 'payment');
      checkoutSessionBody.append('customer', customerId);
      checkoutSessionBody.append('line_items[0][price_data][currency]', 'usd');
      checkoutSessionBody.append('line_items[0][price_data][product_data][name]', 'Startup Validation Exam');
      checkoutSessionBody.append('line_items[0][price_data][product_data][description]', 'Complete feasibility analysis + 1-hour strategy session');
      checkoutSessionBody.append('line_items[0][price_data][unit_amount]', '7800'); // $78.00
      checkoutSessionBody.append('line_items[0][quantity]', '1');
      checkoutSessionBody.append('success_url', `${baseUrl}/?payment=success&session_id={CHECKOUT_SESSION_ID}`);
      checkoutSessionBody.append('cancel_url', `${baseUrl}/?payment=cancelled`);
      checkoutSessionBody.append('metadata[email]', email);
      checkoutSessionBody.append('metadata[source]', 'startwise-validation');
      checkoutSessionBody.append('metadata[customer_name]', `${firstName} ${lastName}`.trim());
      checkoutSessionBody.append('ui_mode', 'embedded');
      checkoutSessionBody.append('redirect_on_completion', 'never');

      const checkoutResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: checkoutSessionBody,
      });

      if (!checkoutResponse.ok) {
        const errorText = await checkoutResponse.text();
        console.error('Checkout session creation failed:', checkoutResponse.status, errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          return new Response(JSON.stringify({ 
            error: 'Checkout Setup Failed',
            message: errorJson.error?.message || 'Unable to initialize checkout',
            code: 'CHECKOUT_SESSION_ERROR'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          });
        } catch {
          return new Response(JSON.stringify({ 
            error: 'Checkout Setup Failed',
            message: 'Unable to initialize checkout',
            code: 'CHECKOUT_SESSION_ERROR'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
        }
      }

      const checkoutSession = await checkoutResponse.json();
      console.log('Checkout session created successfully:', checkoutSession.id);
      
      const response = {
        clientSecret: checkoutSession.client_secret,
        publishableKey: stripePublishableKey,
        sessionId: checkoutSession.id,
        url: checkoutSession.url // For fallback redirect if embedded fails
      };
      
      console.log('Returning successful response');
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
      
    } catch (checkoutError) {
      console.error('Error during checkout session creation:', checkoutError);
      return new Response(JSON.stringify({ 
        error: 'Checkout Setup Failed',
        message: 'Unable to initialize checkout',
        code: 'CHECKOUT_SESSION_ERROR'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error) {
    console.error('Unexpected error in checkout function:', error);
    const errorObj = error as Error;
    console.error('Error details:', {
      name: errorObj?.constructor?.name,
      message: errorObj?.message,
      stack: errorObj?.stack
    });
    
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request',
      code: 'INTERNAL_ERROR'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});