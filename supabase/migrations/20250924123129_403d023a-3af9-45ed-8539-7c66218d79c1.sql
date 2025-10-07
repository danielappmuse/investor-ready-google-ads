-- Create agent_chat table to store all chat conversations
CREATE TABLE public.agent_chat (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  lead_id UUID NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agent_chat ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only
CREATE POLICY "Service role has full access to agent chat" 
ON public.agent_chat 
FOR ALL 
USING (true);

-- Create index for better query performance
CREATE INDEX idx_agent_chat_conversation_id ON public.agent_chat(conversation_id);
CREATE INDEX idx_agent_chat_lead_id ON public.agent_chat(lead_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agent_chat_updated_at
BEFORE UPDATE ON public.agent_chat
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();