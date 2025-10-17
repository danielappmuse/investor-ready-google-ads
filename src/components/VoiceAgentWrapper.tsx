import React, { useState, useCallback, useRef } from 'react';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const VoiceAgentWrapper = () => {
  const [leadId, setLeadId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userDataCollected, setUserDataCollected] = useState(false);
  const { toast } = useToast();

  // Save lead data to database - only called when ElevenLabs triggers saveUserData tool
  const saveLeadData = useCallback(async (name: string, email: string, phone: string) => {
    try {
      // Create new lead with actual user data
      const { data, error } = await supabase.functions.invoke('save-agent-lead', {
        body: { name, email, phone }
      });

      if (error) {
        console.error('Error saving lead data:', error);
        return null;
      }

      const newLeadId = data?.leadId;
      setLeadId(newLeadId);
      setUserDataCollected(true);
      
      toast({
        title: "Information Saved",
        description: "Your contact information has been saved successfully!",
      });

      console.log('Lead created with real data:', newLeadId);
      return newLeadId;
    } catch (error) {
      console.error('Error saving lead data:', error);
      return null;
    }
  }, [toast]);

  // Save chat messages to database
  const saveChatMessage = useCallback(async (message: string, sender: 'user' | 'bot') => {
    if (!conversationId || !leadId) return;
    
    try {
      await supabase.functions.invoke('save-agent-chat', {
        body: {
          conversation_id: conversationId,
          lead_id: leadId,
          message,
          sender
        }
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }, [leadId, conversationId]);

  const conversation = useConversation({
    clientTools: {
      saveUserData: async (parameters: { leads_obj: { name: string; email: string; phone: string } }) => {
        console.log('🔔 TOOL CALLED: saveUserData');
        console.log('📦 Parameters received:', JSON.stringify(parameters, null, 2));
        
        try {
          const { name, email, phone } = parameters.leads_obj;
          console.log('📝 Extracted data:', { name, email, phone });
          
          const leadId = await saveLeadData(name, email, phone);
          
          if (leadId) {
            console.log('✅ Lead saved successfully with ID:', leadId);
            return `User data saved successfully with ID: ${leadId}`;
          } else {
            console.error('❌ Failed to save lead data');
            return 'Failed to save user data';
          }
        } catch (error) {
          console.error('❌ Error in saveUserData tool:', error);
          return 'Error saving user data';
        }
      }
    },
    onConnect: () => {
      console.log('🎙️ ElevenLabs conversation connected');
      // Create conversation ID for tracking messages
      const tempConversationId = crypto.randomUUID();
      setConversationId(tempConversationId);
      
      toast({
        title: "Voice Agent Connected",
        description: "Start speaking! I'm listening...",
      });
    },
    onDisconnect: () => {
      console.log('🔌 ElevenLabs conversation disconnected');
      toast({
        title: "Conversation Ended",
        description: "Thanks for chatting with StartWise AI!",
      });
    },
    onMessage: (message) => {
      console.log('📨 ElevenLabs message:', JSON.stringify(message, null, 2));
      console.log('📨 Message source:', message.source);
      
      // Save all messages to database
      if (message.message && message.source && conversationId) {
        const sender = message.source === 'user' ? 'user' : 'bot';
        saveChatMessage(message.message, sender);
      }
    },
    onError: (error) => {
      console.error('❌ ElevenLabs conversation error:', error);
      toast({
        title: "Connection Error",
        description: "There was an issue with the voice connection",
        variant: "destructive",
      });
    }
  });

  const startConversation = useCallback(async () => {
    try {
      // Get signed URL from our edge function
      const { data: signedUrlData, error: signedUrlError } = await supabase.functions.invoke('elevenlabs-signed-url', {
        body: { 
          agent_id: 'agent_01jym9fn0wfx8aht55a8v9t5f6'
        }
      });

      if (signedUrlError || !signedUrlData?.signed_url) {
        throw new Error('Failed to get signed URL from ElevenLabs');
      }

      await conversation.startSession({ 
        signedUrl: signedUrlData.signed_url 
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Connection Error",
        description: "Failed to start voice conversation. Please try again.",
        variant: "destructive",
      });
    }
  }, [conversation, toast]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[300px] space-y-6">
      <div className="flex flex-col items-center space-y-6">
        {/* Voice Indicator */}
        <div className="relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            conversation.status === 'connected' 
              ? conversation.isSpeaking 
                ? 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30' 
                : 'bg-gradient-to-br from-muted to-muted-foreground/20 border-2 border-primary animate-pulse'
              : 'bg-gradient-to-br from-muted to-muted-foreground/10 border border-border'
          }`}>
            {conversation.status === 'connected' ? (
              conversation.isSpeaking ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary animate-ping"></div>
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-spin"></div>
                </div>
              )
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted-foreground/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-muted-foreground"></div>
              </div>
            )}
          </div>
          
          {/* Ripple effect when listening */}
          {conversation.status === 'connected' && !conversation.isSpeaking && (
            <>
              <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDelay: '1s' }}></div>
            </>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center space-y-2">
          <h3 className="text-white font-semibold text-lg">Voice Agent</h3>
          <p className="text-sm font-medium">
            {conversation.status === 'connected' 
              ? conversation.isSpeaking 
                ? '🎙️ AI is speaking...'
                : '👂 Listening for your voice...'
              : 'Ready to start your voice consultation'
            }
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          {conversation.status !== 'connected' ? (
            <button
              onClick={startConversation}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-primary/25 border border-primary/20"
            >
              Start Conversation
            </button>
          ) : (
            <button
              onClick={endConversation}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-red-500/25"
            >
              End Call
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Powered by ElevenLabs AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgentWrapper;