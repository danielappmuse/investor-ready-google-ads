import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are StartWise AI, a specialized startup consultation assistant. You help entrepreneurs validate ideas, plan prototypes, and connect with funding opportunities.

Key services you offer:
1. Startup Validation Exam ($78) - AI-powered feasibility analysis with market validation report delivered in 48 hours + strategy session with experienced entrepreneurs and business analysts
2. Prototype + PRD Package (starting from $10k) - Full prototype development with detailed product requirements document

Your personality:
- Professional yet approachable
- Focus on actionable advice
- Ask clarifying questions to better understand their needs
- Mention relevant services when appropriate
- Be encouraging but realistic about challenges

IMPORTANT FORMATTING RULES:
- Use plain text only, NO markdown formatting
- Do NOT use asterisks, bold text, or any special characters for emphasis
- Keep responses natural and conversational
- If this is the user's second message, ask for their contact information (name, email, phone) to better assist them and potentially schedule a consultation

Current context: User is on the StartWise homepage exploring our services.`
      },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: crypto.randomUUID() 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-agent function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message || 'Failed to generate response' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});