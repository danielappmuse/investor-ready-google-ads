import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== CREATE PAYMENT FUNCTION STARTED ===");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Origin:", req.headers.get("origin"));
    console.log("User-Agent:", req.headers.get("user-agent"));
    console.log("Timestamp:", new Date().toISOString());
    
    console.log("Creating payment intent...");
    
    // Get request data
    const { email, firstName, lastName, onboardingData } = await req.json();
    console.log("Payment request data:", { email, firstName, lastName });

    // Initialize Stripe with detailed validation
    console.log("=== STRIPE KEY VALIDATION ===");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("Stripe key exists:", !!stripeKey);
    console.log("Stripe key length:", stripeKey?.length || 0);
    console.log("Stripe key prefix:", stripeKey?.substring(0, 7) || "none");
    console.log("Is test key:", stripeKey?.startsWith("sk_test_") || false);
    console.log("Is live key:", stripeKey?.startsWith("sk_live_") || false);
    
    if (!stripeKey) {
      console.error("ERROR: STRIPE_SECRET_KEY is not configured");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    if (!stripeKey.startsWith("sk_")) {
      console.error("ERROR: Invalid Stripe key format. Should start with 'sk_'");
      throw new Error("Invalid Stripe secret key format");
    }
    
    console.log("=== INITIALIZING STRIPE CLIENT ===");
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    
    // Test Stripe connection by retrieving account info
    console.log("=== TESTING STRIPE CONNECTION ===");
    let accountInfo;
    try {
      accountInfo = await stripe.accounts.retrieve();
      console.log("Stripe account verified successfully");
      console.log("Account ID:", accountInfo.id);
      console.log("Account country:", accountInfo.country);
      console.log("Account created:", new Date(accountInfo.created * 1000).toISOString());
      console.log("Charges enabled:", accountInfo.charges_enabled);
      console.log("Details submitted:", accountInfo.details_submitted);
      console.log("Payouts enabled:", accountInfo.payouts_enabled);
      console.log("Account type:", accountInfo.type);
    } catch (accountError) {
      console.error("STRIPE ACCOUNT ERROR:", accountError);
      const errorObj = accountError as any;
      console.error("Account error details:", {
        type: errorObj.type,
        code: errorObj.code,
        message: errorObj.message,
        decline_code: errorObj.decline_code,
        param: errorObj.param
      });
      throw new Error(`Stripe account verification failed: ${errorObj.message}`);
    }

    // Check if a Stripe customer record exists for this email
    console.log("=== CUSTOMER LOOKUP ===");
    console.log("Searching for customer with email:", email);
    
    let customers;
    try {
      customers = await stripe.customers.list({ email: email, limit: 1 });
      console.log("Customer search successful");
      console.log("Customers found:", customers.data.length);
    } catch (customerSearchError) {
      console.error("CUSTOMER SEARCH ERROR:", customerSearchError);
      const errorObj = customerSearchError as any;
      console.error("Customer search error details:", {
        type: errorObj.type,
        code: errorObj.code,
        message: errorObj.message,
        decline_code: errorObj.decline_code,
        param: errorObj.param
      });
      throw new Error(`Customer search failed: ${errorObj.message}`);
    }
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
      console.log("Customer country:", customers.data[0].address?.country || "not set");
      console.log("Customer created:", new Date(customers.data[0].created * 1000).toISOString());
    } else {
      // Create new customer
      console.log("=== CREATING NEW CUSTOMER ===");
      console.log("Customer name:", `${firstName} ${lastName}`);
      console.log("Customer email:", email);
      
      try {
        const customer = await stripe.customers.create({
          email: email,
          name: `${firstName} ${lastName}`,
          metadata: {
            source: "validation_onboarding",
            created_from: "pakistan_integration"
          }
        });
        customerId = customer.id;
        console.log("Created new customer successfully:", customerId);
        console.log("New customer country:", customer.address?.country || "not set");
      } catch (customerCreateError) {
        console.error("CUSTOMER CREATION ERROR:", customerCreateError);
        const errorObj = customerCreateError as any;
        console.error("Customer creation error details:", {
          type: errorObj.type,
          code: errorObj.code,
          message: errorObj.message,
          decline_code: errorObj.decline_code,
          param: errorObj.param
        });
        throw new Error(`Customer creation failed: ${errorObj.message}`);
      }
    }

    // Create a checkout session for redirect to Stripe
    console.log("=== CREATING CHECKOUT SESSION ===");
    console.log("Customer ID:", customerId);
    console.log("Customer email:", customerId ? undefined : email);
    console.log("Origin for URLs:", req.headers.get("origin"));
    
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: "Validation Exam",
                description: "Complete startup feasibility analysis + 1-hour strategy session"
              },
              unit_amount: 7800, // $78.00 in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/?payment=cancelled`,
        metadata: {
          firstName,
          lastName,
          email,
          product: "validation_exam",
          onboarding_data: JSON.stringify(onboardingData),
          integration_source: "pakistan_client"
        },
      });
      
      console.log("Checkout session created successfully:", session.id);
      console.log("Session URL:", session.url);
      console.log("Session status:", session.status);
      console.log("Session mode:", session.mode);
      console.log("Session currency:", session.currency);
      console.log("Session amount_total:", session.amount_total);
      
    } catch (sessionError) {
      console.error("CHECKOUT SESSION CREATION ERROR:", sessionError);
      const errorObj = sessionError as any;
      console.error("Checkout session error details:", {
        type: errorObj.type,
        code: errorObj.code,
        message: errorObj.message,
        decline_code: errorObj.decline_code,
        param: errorObj.param,
        request_log_url: errorObj.request_log_url
      });
      throw new Error(`Checkout session creation failed: ${errorObj.message}`);
    }

    console.log("=== RETURNING SUCCESS RESPONSE ===");
    console.log("Session URL:", session.url);
    console.log("Session ID:", session.id);
    
    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("=== PAYMENT FUNCTION ERROR ===");
    const err = error as any;
    console.error("Error type:", err?.constructor?.name);
    console.error("Error message:", err?.message);
    console.error("Error stack:", err?.stack);
    
    // Log Stripe-specific error details if available
    if (err.type) {
      console.error("Stripe error type:", err.type);
      console.error("Stripe error code:", err.code);
      console.error("Stripe decline code:", err.decline_code);
      console.error("Stripe param:", err.param);
      console.error("Stripe request ID:", err.request?.id);
      console.error("Stripe request log URL:", err.request_log_url);
    }
    
    // Provide more specific error messages based on common live key issues
    let errorMessage = err.message;
    if (err.code === 'api_key_expired') {
      errorMessage = "Stripe API key has expired. Please update your live keys.";
    } else if (err.code === 'invalid_api_key') {
      errorMessage = "Invalid Stripe API key. Please verify your live keys are correct.";
    } else if (err.code === 'restricted_key') {
      errorMessage = "Stripe key has restricted permissions. Please check your key permissions.";
    } else if (err.code === 'account_country_invalid_for_key') {
      errorMessage = "Account country restriction. This may be due to using USA keys from Pakistan.";
    } else if (err.message?.includes('country')) {
      errorMessage = "Country-related restriction detected. Please check Stripe account settings.";
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: {
        type: err.type || 'unknown',
        code: err.code || 'unknown',
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});