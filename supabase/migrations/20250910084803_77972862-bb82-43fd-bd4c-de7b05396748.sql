-- Fix critical security vulnerability: restrict access to sensitive customer and payment data
-- Replace overly permissive RLS policies with restrictive ones

-- Update leads table policies
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;

-- Update stripe_transactions table policies
DROP POLICY IF EXISTS "stripe_transactions_select_policy" ON public.stripe_transactions;
DROP POLICY IF EXISTS "stripe_transactions_insert_policy" ON public.stripe_transactions;
DROP POLICY IF EXISTS "stripe_transactions_update_policy" ON public.stripe_transactions;

-- Create secure policies that block all direct access
-- Edge functions using service role key will bypass these policies
CREATE POLICY "Block direct access to leads" 
ON public.leads FOR ALL 
USING (false) WITH CHECK (false);

CREATE POLICY "Block direct access to transactions" 
ON public.stripe_transactions FOR ALL 
USING (false) WITH CHECK (false);