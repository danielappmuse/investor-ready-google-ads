import React, { useState, useCallback, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OpenAIVoiceAgentProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const OpenAIVoiceAgent = ({ onSpeakingChange }: OpenAIVoiceAgentProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  const initializeAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
        onSpeakingChange?.(false);
        // Continue conversation after AI finishes speaking
        setTimeout(() => {
          if (!isProcessing) {
            startRecording();
          }
        }, 1000);
      };
    }
  }, [isProcessing, onSpeakingChange]);

  const startConversation = useCallback(async () => {
    try {
      initializeAudio();
      
      // Welcome message
      toast({
        title: "Voice Agent Ready",
        description: "Hi! I'm StartWise AI. Tell me about your startup idea!",
      });

      // Generate and play welcome message
      const welcomeText = "Hi! I'm StartWise AI, your voice-powered startup consultant. I'm here to help you validate your idea or plan your prototype. What's your startup concept, and how can I help you today?";
      
      setIsProcessing(true);
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('openai-text-to-speech', {
        body: { 
          text: welcomeText,
          voice: 'nova' // Female voice
        }
      });

      if (voiceError || !voiceData?.audioContent) {
        throw new Error('Failed to generate welcome message');
      }

      // Play welcome message
      if (audioRef.current) {
        audioRef.current.src = `data:audio/mp3;base64,${voiceData.audioContent}`;
        setIsPlaying(true);
        onSpeakingChange?.(true);
        await audioRef.current.play();
      }

      setIsProcessing(false);

    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsProcessing(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize voice agent. Please try again.",
        variant: "destructive",
      });
    }
  }, [initializeAudio, onSpeakingChange]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Listening",
        description: "I'm listening... Speak your question!",
      });

      // Auto-stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone. Please allow microphone permissions.",
        variant: "destructive",
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Audio = btoa(String.fromCharCode(...uint8Array));

      console.log('Converting speech to text...');

      // Convert speech to text using OpenAI Whisper
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (transcriptionError || !transcriptionData?.text) {
        throw new Error('Failed to transcribe audio');
      }

      const userText = transcriptionData.text;
      console.log('Transcribed text:', userText);

      if (!userText.trim()) {
        toast({
          title: "No speech detected",
          description: "Please try speaking more clearly. Starting new recording...",
        });
        
        setTimeout(() => startRecording(), 1000);
        return;
      }

      // Add user message to conversation history
      const newHistory = [...conversationHistory, { role: 'user', content: userText }];
      setConversationHistory(newHistory);

      // Get AI response via chat agent
      console.log('Getting AI response...');
      const { data: chatData, error: chatError } = await supabase.functions.invoke('chat-agent', {
        body: { 
          message: userText,
          conversationHistory: conversationHistory
        }
      });

      if (chatError || !chatData?.response) {
        throw new Error('Failed to get AI response');
      }

      const aiResponse = chatData.response;
      console.log('AI response:', aiResponse);

      // Add AI response to conversation history
      const updatedHistory = [...newHistory, { role: 'assistant', content: aiResponse }];
      setConversationHistory(updatedHistory);

      // Convert AI response to speech using OpenAI TTS
      console.log('Converting text to speech with OpenAI...');
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('openai-text-to-speech', {
        body: { 
          text: aiResponse,
          voice: 'nova' // Female voice
        }
      });

      if (voiceError || !voiceData?.audioContent) {
        throw new Error('Failed to generate speech');
      }

      // Play the audio response
      if (audioRef.current) {
        audioRef.current.src = `data:audio/mp3;base64,${voiceData.audioContent}`;
        setIsPlaying(true);
        onSpeakingChange?.(true);
        await audioRef.current.play();
      }

      toast({
        title: "AI Response Ready",
        description: "I'm speaking my answer...",
      });

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your voice. Let's try again!",
        variant: "destructive",
      });
      
      // Try to continue conversation
      setTimeout(() => {
        if (!isPlaying) {
          startRecording();
        }
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const endConversation = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsRecording(false);
    setIsProcessing(false);
    setIsPlaying(false);
    setConversationHistory([]);
    onSpeakingChange?.(false);
    
    toast({
      title: "Conversation Ended",
      description: "Thanks for chatting with StartWise AI!",
    });
  }, [onSpeakingChange]);

  const handleButtonClick = () => {
    if (isRecording || isProcessing || isPlaying) {
      endConversation();
    } else {
      startConversation();
    }
  };

  const getButtonIcon = () => {
    if (isPlaying) return <Volume2 className="w-6 h-6 text-white animate-pulse" />;
    if (isProcessing) return <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />;
    if (isRecording) return <MicOff className="w-6 h-6 text-white" />;
    return <Phone className="w-6 h-6 text-white" />;
  };

  const getButtonClass = () => {
    if (isPlaying) return 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse';
    if (isRecording) return 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse';
    if (isProcessing) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    if (isRecording || isProcessing || isPlaying) return 'bg-gradient-to-br from-red-500 to-red-600 hover:scale-110';
    return 'bg-gradient-to-br from-primary to-secondary hover:scale-110';
  };

  const getStatusText = () => {
    if (isPlaying) return 'AI is speaking... (tap to end)';
    if (isProcessing) return 'Processing your voice...';
    if (isRecording) return 'Listening... (tap to end or wait 10s)';
    return 'Start voice consultation';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
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
            {isRecording || isProcessing || isPlaying
              ? 'Live conversation with StartWise AI'
              : 'Natural voice conversation powered by OpenAI'
            }
          </p>
        </div>
      </div>

      <div className="text-center max-w-xs">
        <p className="text-sm text-gray-300">
          Get instant voice consultation about validation and prototype development
        </p>
      </div>
    </div>
  );
};

export default OpenAIVoiceAgent;