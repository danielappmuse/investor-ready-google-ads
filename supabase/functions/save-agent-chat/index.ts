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
    const { conversation_id, lead_id, message, sender } = await req.json();

    if (!conversation_id || !lead_id || !message || !sender) {
      throw new Error('conversation_id, lead_id, message, and sender are required');
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Saving agent chat message:', { conversation_id, lead_id, message, sender });

    // Insert chat message into database
    const { data: chatMessage, error: chatError } = await supabase
      .from('agent_chat')
      .insert({
        conversation_id,
        lead_id,
        message,
        sender
      })
      .select()
      .single();

    if (chatError) {
      console.error('Error inserting chat message:', chatError);
      throw new Error(`Failed to save chat message: ${chatError.message}`);
    }

    console.log('Chat message saved successfully:', chatMessage);

    return new Response(JSON.stringify({ 
      success: true,
      chatId: chatMessage.id,
      message: 'Chat message saved successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in save-agent-chat function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message || 'Failed to save chat message' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});