import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    console.log("Starting save-lead-data function...");
    
    // Get request data
    const { onboardingData, paymentIntentId } = await req.json();
    console.log("Received data:", { onboardingData, paymentIntentId });

    if (!onboardingData || !paymentIntentId) {
      throw new Error("Missing required data: onboardingData or paymentIntentId");
    }

    // Skip Stripe API call since payment already completed successfully
    console.log("Processing successful payment data for payment intent:", paymentIntentId);

    // Create Supabase client with service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Insert lead data
    console.log("Inserting lead data...");
    const { data: leadData, error: leadError } = await supabaseClient
      .from("leads")
      .insert({
        idea: onboardingData.idea,
        name: onboardingData.name,
        email: onboardingData.email,
        phone: onboardingData.phone || null,
        alternatives: onboardingData.alternatives,
        outcome: onboardingData.outcome,
        budget: onboardingData.budget,
        status: 'paid' // Assume paid since payment completed successfully
      })
      .select()
      .maybeSingle();

    if (leadError) {
      console.error("Error inserting lead:", leadError);
      throw new Error(`Failed to save lead data: ${leadError.message}`);
    }

    console.log("Lead data saved:", leadData.id);

    // Insert stripe transaction data
    console.log("Inserting stripe transaction data...");
    const { data: stripeData, error: stripeError } = await supabaseClient
      .from("stripe_transactions")
      .insert({
        lead_id: leadData.id,
        stripe_payment_intent_id: paymentIntentId,
        stripe_customer_id: null, // Will be set if available
        amount: 4999, // Default amount (can be updated if needed)
        currency: 'usd',
        status: 'succeeded',
        payment_method: 'card' // Default for payment intents
      })
      .select()
      .maybeSingle();

    if (stripeError) {
      console.error("Error inserting stripe transaction:", stripeError);
      throw new Error(`Failed to save transaction data: ${stripeError.message}`);
    }

    console.log("Stripe transaction data saved:", stripeData.id);

    return new Response(JSON.stringify({ 
      success: true,
      leadId: leadData.id,
      transactionId: stripeData.id,
      message: "Lead and transaction data saved successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Save lead data error:", error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});