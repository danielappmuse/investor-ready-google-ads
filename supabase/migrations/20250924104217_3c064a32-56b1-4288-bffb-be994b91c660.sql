-- Create agent_leads table to store chat user information
CREATE TABLE public.agent_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agent_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for agent_leads
CREATE POLICY "Users can insert their own agent leads" 
ON public.agent_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role has full access to agent leads" 
ON public.agent_leads 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_agent_leads_updated_at
BEFORE UPDATE ON public.agent_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();