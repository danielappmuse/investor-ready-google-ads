-- First, drop existing ineffective RLS policies
DROP POLICY IF EXISTS "Block direct access to transactions" ON public.stripe_transactions;
DROP POLICY IF EXISTS "Restrict transactions access to service role only" ON public.stripe_transactions;

-- Ensure RLS is enabled (it should be, but let's be explicit)
ALTER TABLE public.stripe_transactions ENABLE ROW LEVEL SECURITY;

-- Create a restrictive policy that blocks ALL direct public access
-- Only service role operations will bypass this due to SUPABASE_SERVICE_ROLE_KEY usage
CREATE POLICY "stripe_transactions_no_public_access" 
ON public.stripe_transactions 
AS RESTRICTIVE 
FOR ALL 
TO public
USING (false)
WITH CHECK (false);

-- Create a policy specifically for authenticated service operations
-- This allows edge functions using service role key to perform operations
CREATE POLICY "stripe_transactions_service_role_access" 
ON public.stripe_transactions 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Also fix the leads table RLS policies for comprehensive security
DROP POLICY IF EXISTS "Block direct access to leads" ON public.leads;
DROP POLICY IF EXISTS "Restrict leads access to service role only" ON public.leads;

-- Ensure RLS is enabled for leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for leads table
CREATE POLICY "leads_no_public_access" 
ON public.leads 
AS RESTRICTIVE 
FOR ALL 
TO public
USING (false)
WITH CHECK (false);

-- Service role access for leads
CREATE POLICY "leads_service_role_access" 
ON public.leads 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Fix client_error_logs table as well
ALTER TABLE public.client_error_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can manage error logs" ON public.client_error_logs;

-- Create restrictive policy for error logs
CREATE POLICY "client_error_logs_no_public_access" 
ON public.client_error_logs 
AS RESTRICTIVE 
FOR ALL 
TO public
USING (false)
WITH CHECK (false);

-- Service role access for error logs
CREATE POLICY "client_error_logs_service_role_access" 
ON public.client_error_logs 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);