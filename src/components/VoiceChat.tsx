import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceChatProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceChat = ({ onSpeakingChange }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const { toast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for playback
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlaying(false);
      onSpeakingChange?.(false);
    };

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [onSpeakingChange]);

  const startRecording = async () => {
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
        title: "Recording",
        description: "Speak your question or tell me about your startup idea",
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Audio = btoa(String.fromCharCode(...uint8Array));

      console.log('Converting speech to text...');

      // Convert speech to text
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
          description: "Please try speaking more clearly",
          variant: "destructive",
        });
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

      // Convert AI response to speech using ElevenLabs
      console.log('Converting text to speech with ElevenLabs...');
      const { data: voiceData, error: voiceError } = await supabase.functions.invoke('elevenlabs-voice', {
        body: { 
          text: aiResponse, 
          voice_id: 'EXAVITQu4vr4xnSDxMaL' // Sarah - professional female voice
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
        title: "Response Ready",
        description: "AI is speaking your answer",
      });

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process your voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing && !isPlaying) {
      startRecording();
    }
  };

  const getButtonIcon = () => {
    if (isPlaying) return <Volume2 className="w-6 h-6 text-white" />;
    if (isProcessing) return <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />;
    if (isRecording) return <MicOff className="w-6 h-6 text-white" />;
    return <Phone className="w-6 h-6 text-white" />;
  };

  const getButtonClass = () => {
    if (isPlaying) return 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse';
    if (isRecording) return 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse';
    if (isProcessing) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-br from-primary to-secondary hover:scale-110';
  };

  const getStatusText = () => {
    if (isPlaying) return 'AI is speaking...';
    if (isProcessing) return 'Processing your voice...';
    if (isRecording) return 'Listening... (tap to stop)';
    return 'Tap to start voice chat';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center space-y-3">
        <Button
          onClick={handleClick}
          disabled={isProcessing}
          className={`w-16 h-16 rounded-full transition-all duration-300 shadow-lg ${getButtonClass()}`}
        >
          {getButtonIcon()}
        </Button>

        <div className="text-center">
          <p className="text-sm text-white font-medium">
            {getStatusText()}
          </p>
          <p className="text-xs text-gray-400">
            Voice-powered startup consultation
          </p>
        </div>
      </div>

      <div className="text-center max-w-xs">
        <p className="text-sm text-gray-300">
          Ask about our validation exam or prototype development
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;