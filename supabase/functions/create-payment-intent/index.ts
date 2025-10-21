import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 create-payment-intent function called');
    
    // Get Stripe keys from environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripePublishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
    
    console.log('🔑 Checking environment variables:', {
      hasStripeSecret: !!stripeSecretKey,
      hasStripePublishable: !!stripePublishableKey,
      secretKeyLength: stripeSecretKey?.length || 0
    });
    
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY is missing');
      return new Response(JSON.stringify({ 
        error: 'Configuration Error',
        message: 'Stripe secret key is not configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!stripePublishableKey) {
      console.error('❌ STRIPE_PUBLISHABLE_KEY is missing');
      return new Response(JSON.stringify({ 
        error: 'Configuration Error',
        message: 'Stripe publishable key is not configured'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    console.log('✅ Stripe initialized successfully');

    // Parse request body
    const body = await req.json();
    const { email, firstName = '', lastName = '', amount = 7800 } = body;
    
    console.log('📝 Request data:', {
      email,
      firstName,
      lastName,
      amount
    });

    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email provided');
      return new Response(JSON.stringify({ 
        error: 'Validation Error',
        message: 'Valid email address is required'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Search for existing customer or create new one
    let customerId;
    
    try {
      console.log('🔍 Searching for existing customer...');
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log('✅ Found existing customer:', customerId);
      } else {
        console.log('➕ Creating new customer...');
        const customer = await stripe.customers.create({
          email: email,
          name: `${firstName} ${lastName}`.trim()
        });
        customerId = customer.id;
        console.log('✅ Created new customer:', customerId);
      }
    } catch (customerError) {
      console.error('❌ Customer error:', customerError);
      return new Response(JSON.stringify({ 
        error: 'Customer Error',
        message: 'Unable to handle customer'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Create payment intent with automatic payment methods enabled
    try {
      console.log('💳 Creating payment intent...');
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          email: email,
          firstName: firstName,
          lastName: lastName
        }
      });

      console.log('✅ Payment intent created successfully:', paymentIntent.id);
      
      // Return both clientSecret and publishableKey
      return new Response(JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        publishableKey: stripePublishableKey,
        paymentIntentId: paymentIntent.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
      
    } catch (paymentError) {
      console.error('❌ Payment intent error:', paymentError);
      return new Response(JSON.stringify({ 
        error: 'Payment Setup Failed',
        message: (paymentError as Error).message || 'Unable to initialize payment'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});