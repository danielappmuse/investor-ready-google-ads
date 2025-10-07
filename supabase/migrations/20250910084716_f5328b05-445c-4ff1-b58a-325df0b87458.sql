-- Fix critical security vulnerability: restrict access to sensitive customer and payment data
-- Currently both leads and stripe_transactions tables are publicly readable

-- Drop existing overly permissive policies for leads table
DROP POLICY IF EXISTS leads_select_policy ON public.leads;
DROP POLICY IF EXISTS leads_insert_policy ON public.leads;
DROP POLICY IF EXISTS leads_update_policy ON public.leads;

-- Drop existing overly permissive policies for stripe_transactions table  
DROP POLICY IF EXISTS stripe_transactions_select_policy ON public.stripe_transactions;
DROP POLICY IF EXISTS stripe_transactions_insert_policy ON public.stripe_transactions;
DROP POLICY IF EXISTS stripe_transactions_update_policy ON public.stripe_transactions;

-- Create restrictive policies for leads table
-- Only allow service role access (edge functions will still work)
CREATE POLICY "Restrict leads access to service role only" 
ON public.leads 
FOR ALL
USING (false)
WITH CHECK (false);

-- Create restrictive policies for stripe_transactions table
-- Only allow service role access (edge functions will still work)
CREATE POLICY "Restrict transactions access to service role only" 
ON public.stripe_transactions 
FOR ALL
USING (false)
WITH CHECK (false);

-- Note: Edge functions using SUPABASE_SERVICE_ROLE_KEY will bypass RLS and continue to work
-- This protects against direct database access while maintaining functionality