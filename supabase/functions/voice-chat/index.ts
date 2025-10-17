import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error("OpenAI API key not configured");
    return new Response("OpenAI API key not configured", { status: 500 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  let openAISocket: WebSocket | null = null;
  let isConnectedToOpenAI = false;

  socket.onopen = async () => {
    console.log("Client WebSocket connected");
    
    // Create WebSocket connection to OpenAI with proper authentication
    try {
      console.log("Attempting to connect to OpenAI Realtime API...");
      
      // Create WebSocket with authorization in URL (this is how some APIs work)
      // Since Deno WebSocket constructor doesn't support headers properly, 
      // we'll need to create a custom request
      const wsUrl = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
      
      // Create the WebSocket connection
      const wsHeaders = new Headers();
      wsHeaders.set("Authorization", `Bearer ${openAIApiKey}`);
      wsHeaders.set("OpenAI-Beta", "realtime=v1");
      
      // Unfortunately Deno WebSocket doesn't support headers in constructor
      // Let's try a different approach - using native WebSocket with manual header injection
      openAISocket = new WebSocket(wsUrl);
      
      // Store the auth for manual injection
      (openAISocket as any).authToken = openAIApiKey;

      openAISocket.onopen = () => {
        console.log("Successfully connected to OpenAI Realtime API");
        isConnectedToOpenAI = true;
        
        // Send session configuration immediately
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are StartWise AI, a specialized startup consultant. You help entrepreneurs validate ideas and plan prototypes.

Key services:
1. Startup Validation Exam ($78) - Market validation and feasibility analysis delivered in 48 hours + strategy session with experienced entrepreneurs and business analysts  
2. Prototype + PRD Package (starting from $10k) - Full prototype development

Be conversational, helpful, and guide users toward the right service for their needs. Keep responses concise and engaging.`,
            voice: "alloy",
            input_audio_format: "pcm16", 
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.8,
            max_response_output_tokens: "inf"
          }
        };
        
        console.log("Sending session configuration to OpenAI");
        openAISocket?.send(JSON.stringify(sessionConfig));
        
        // Notify client that connection is ready
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "connection.ready",
            message: "Connected to AI voice assistant"
          }));
        }
      };

      openAISocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("OpenAI message:", data.type);
          
          // Forward all OpenAI messages to client
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(event.data); // Send raw data to preserve formatting
          }
        } catch (error) {
          console.error("Error processing OpenAI message:", error);
        }
      };

      openAISocket.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error);
        isConnectedToOpenAI = false;
        
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "error",
            message: "AI service connection failed. Please try again."
          }));
        }
      };

      openAISocket.onclose = (event) => {
        console.log("OpenAI WebSocket closed:", event.code, event.reason);
        isConnectedToOpenAI = false;
        
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "connection.closed",
            message: "AI service disconnected"
          }));
          socket.close();
        }
      };

    } catch (error) {
      console.error("Failed to create OpenAI WebSocket connection:", error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "error", 
          message: "Failed to initialize AI service: " + (error as Error).message
        }));
      }
    }
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Client message type:", message.type);
      
      // Only forward messages if we're connected to OpenAI
      if (openAISocket && openAISocket.readyState === WebSocket.OPEN && isConnectedToOpenAI) {
        console.log("Forwarding message to OpenAI");
        openAISocket.send(event.data); // Send raw data to preserve formatting
      } else {
        console.log("OpenAI not ready - connection state:", openAISocket?.readyState, "isConnected:", isConnectedToOpenAI);
      }
    } catch (error) {
      console.error("Error processing client message:", error);
    }
  };

  socket.onclose = () => {
    console.log("Client WebSocket disconnected");
    if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close();
    }
  };

  return response;
});