-- Remove the overly permissive INSERT policy that allows public access
DROP POLICY IF EXISTS "Users can insert their own agent leads" ON public.agent_leads;

-- The service role policy remains, allowing only the edge function to insert data
-- This ensures lead submissions go through proper validation in the save-agent-lead function