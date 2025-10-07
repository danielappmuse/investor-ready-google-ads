import React, { useState, useCallback, useRef } from 'react';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import InlineLeadForm from './InlineLeadForm';

interface ElevenLabsVoiceAgentProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const ElevenLabsVoiceAgent = ({ onSpeakingChange }: ElevenLabsVoiceAgentProps) => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState<boolean>(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { toast } = useToast();

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  }, [onSpeakingChange]);

  // Handle lead form success
  const handleLeadFormSuccess = useCallback((newLeadId?: string) => {
    setLeadFormSubmitted(true);
    setLeadId(newLeadId || null);
    // Generate a new conversation ID
    setConversationId(crypto.randomUUID());
    
    toast({
      title: "Information Saved",
      description: "Great! Now let's start your voice consultation.",
    });
  }, [toast]);

  // Save chat messages to database
  const saveChatMessage = useCallback(async (message: string, sender: 'user' | 'agent') => {
    if (!leadId || !conversationId) return;
    
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

  const startConversation = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    
    try {
      // ElevenLabs Conversational AI agent ID
      const ELEVENLABS_AGENT_ID = 'agent_01jym9fn0wfx8aht55a8v9t5f6';

      // Get signed URL from ElevenLabs
      const { data: signedUrlData, error: signedUrlError } = await supabase.functions.invoke('elevenlabs-signed-url', {
        body: { 
          agent_id: ELEVENLABS_AGENT_ID
        }
      });

      if (signedUrlError || !signedUrlData?.signed_url) {
        throw new Error('Failed to get signed URL from ElevenLabs');
      }

      // Initialize audio context and microphone
      audioContextRef.current = new AudioContext();
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Connect to ElevenLabs WebSocket
      wsRef.current = new WebSocket(signedUrlData.signed_url);
      
      wsRef.current.onopen = () => {
        console.log('Connected to ElevenLabs');
        setIsConnected(true);
        setIsConnecting(false);
        onSpeakingChange?.(false);
        
        toast({
          title: "Voice Agent Connected",
          description: "Start speaking! I'm listening...",
        });
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'audio') {
          // Play audio response
          playAudioResponse(message.audio_event.audio_base_64);
        } else if (message.type === 'agent_response') {
          console.log('Agent response:', message.agent_response);
          // Save agent message to database
          if (message.agent_response) {
            saveChatMessage(message.agent_response, 'agent');
          }
        } else if (message.type === 'user_transcript') {
          console.log('User transcript:', message.user_transcript);
          // Save user message to database
          if (message.user_transcript) {
            saveChatMessage(message.user_transcript, 'user');
          }
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Lost connection to voice agent",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        cleanup();
      };

      // Start streaming audio to WebSocket
      if (mediaStreamRef.current && wsRef.current) {
        startAudioStreaming();
      }

    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to voice agent. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  }, [isConnecting, isConnected, onSpeakingChange, cleanup]);

  const startAudioStreaming = useCallback(() => {
    if (!audioContextRef.current || !mediaStreamRef.current || !wsRef.current) return;

    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
    
    // Create a script processor to capture audio data
    const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (event) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const inputBuffer = event.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputBuffer.length);
        
        // Convert float32 to int16
        for (let i = 0; i < inputBuffer.length; i++) {
          pcmData[i] = Math.max(-32768, Math.min(32767, inputBuffer[i] * 32768));
        }
        
        // Send audio data to ElevenLabs
        wsRef.current.send(JSON.stringify({
          user_audio_chunk: Array.from(new Uint8Array(pcmData.buffer))
        }));
      }
    };
    
    source.connect(processor);
    processor.connect(audioContextRef.current.destination);
  }, []);

  const playAudioResponse = useCallback(async (audioBase64: string) => {
    if (!audioContextRef.current) return;
    
    try {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      
      // Decode base64 audio
      const audioData = atob(audioBase64);
      const arrayBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }
      
      // Decode and play audio
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };
      
      source.start();
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  }, [onSpeakingChange]);

  const endConversation = useCallback(() => {
    cleanup();
    
    toast({
      title: "Conversation Ended",
      description: "Thanks for chatting with StartWise AI!",
    });
  }, [cleanup]);


  const handleButtonClick = () => {
    if (isConnected || isConnecting) {
      endConversation();
    } else {
      startConversation();
    }
  };

  const getButtonIcon = () => {
    if (isSpeaking) return <Volume2 className="w-6 h-6 text-white animate-pulse" />;
    if (isConnecting) return <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />;
    if (isConnected) return <PhoneOff className="w-6 h-6 text-white" />;
    return <Phone className="w-6 h-6 text-white" />;
  };

  const getButtonClass = () => {
    if (isSpeaking) return 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse';
    if (isConnected) return 'bg-gradient-to-br from-red-500 to-red-600 hover:scale-110';
    if (isConnecting) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-br from-primary to-secondary hover:scale-110';
  };

  const getStatusText = () => {
    if (isSpeaking) return 'AI is speaking... (tap to end)';
    if (isConnecting) return 'Connecting to voice agent...';
    if (isConnected) return 'Live conversation active (tap to end)';
    return 'Start live voice consultation';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!termsAccepted ? (
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and conditions</h3>
          <p className="text-sm text-gray-700 mb-6 text-left">
            By clicking "Agree," and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as described in the Privacy Policy. If you do not wish to have your conversations recorded, please refrain from using this service.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button variant="outline" className="text-gray-600">
              Cancel
            </Button>
            <Button 
              onClick={() => setTermsAccepted(true)}
              className="bg-black text-white hover:bg-gray-800"
            >
              Accept
            </Button>
          </div>
        </div>
      ) : !leadFormSubmitted ? (
        <div className="flex justify-center">
          <InlineLeadForm onSuccess={handleLeadFormSuccess} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-3">
            <Button
              onClick={handleButtonClick}
              className={`w-16 h-16 rounded-full transition-all duration-300 shadow-lg ${getButtonClass()}`}
            >
              {getButtonIcon()}
            </Button>

            <div className="text-center">
              <p className="text-sm text-white font-medium">
                {getStatusText()}
              </p>
              <p className="text-xs text-gray-400">
                {isConnected || isConnecting || isSpeaking
                  ? 'Live conversation with StartWise AI'
                  : 'Natural voice conversation powered by ElevenLabs'
                }
              </p>
            </div>
          </div>

          <div className="text-center max-w-xs">
            <p className="text-sm text-gray-300">
              Real-time voice consultation with AI-powered startup advisor
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ElevenLabsVoiceAgent;