import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { name, email, phone, leadId } = await req.json();

    if (!name || !email || !phone) {
      throw new Error('Name, email, and phone are required');
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing agent lead:', { name, email, phone, leadId });

    if (leadId) {
      // Update existing lead
      const { data: agentLead, error: agentLeadError } = await supabase
        .from('agent_leads')
        .update({
          name,
          email,
          phone
        })
        .eq('id', leadId)
        .select()
        .single();

      if (agentLeadError) {
        console.error('Error updating agent lead:', agentLeadError);
        throw new Error(`Failed to update agent lead: ${agentLeadError.message}`);
      }

      console.log('Agent lead updated successfully:', agentLead);

      return new Response(JSON.stringify({ 
        success: true,
        leadId: agentLead.id,
        message: 'Agent lead updated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Insert new agent lead into database
      const { data: agentLead, error: agentLeadError } = await supabase
        .from('agent_leads')
        .insert({
          name,
          email,
          phone
        })
        .select()
        .single();

      if (agentLeadError) {
        console.error('Error inserting agent lead:', agentLeadError);
        throw new Error(`Failed to save agent lead: ${agentLeadError.message}`);
      }

      console.log('Agent lead saved successfully:', agentLead);

      return new Response(JSON.stringify({ 
        success: true,
        leadId: agentLead.id,
        message: 'Agent lead saved successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in save-agent-lead function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message || 'Failed to save agent lead' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});