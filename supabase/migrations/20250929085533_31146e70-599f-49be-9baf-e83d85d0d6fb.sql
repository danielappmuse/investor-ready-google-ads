-- Fix security vulnerability: Block public access to agent_chat and agent_leads tables
-- These tables contain sensitive customer data that should not be publicly accessible

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Service role has full access to agent chat" ON public.agent_chat;
DROP POLICY IF EXISTS "Service role has full access to agent leads" ON public.agent_leads;

-- Add restrictive policies to block public access for agent_chat
CREATE POLICY "agent_chat_no_public_access" 
ON public.agent_chat 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Add service role access policy for agent_chat
CREATE POLICY "agent_chat_service_role_access" 
ON public.agent_chat 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add restrictive policies to block public access for agent_leads  
CREATE POLICY "agent_leads_no_public_access" 
ON public.agent_leads 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Add service role access policy for agent_leads
CREATE POLICY "agent_leads_service_role_access" 
ON public.agent_leads 
FOR ALL 
USING (true)
WITH CHECK (true);