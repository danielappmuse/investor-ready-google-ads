-- Create leads table to store validation exam onboarding data
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  alternatives TEXT NOT NULL,
  outcome TEXT[] NOT NULL,
  budget TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create stripe table to store transaction data
CREATE TABLE public.stripe_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for leads table
CREATE POLICY "leads_select_policy" ON public.leads
  FOR SELECT
  USING (true);

CREATE POLICY "leads_insert_policy" ON public.leads
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "leads_update_policy" ON public.leads
  FOR UPDATE
  USING (true);

-- Create policies for stripe_transactions table
CREATE POLICY "stripe_transactions_select_policy" ON public.stripe_transactions
  FOR SELECT
  USING (true);

CREATE POLICY "stripe_transactions_insert_policy" ON public.stripe_transactions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "stripe_transactions_update_policy" ON public.stripe_transactions
  FOR UPDATE
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_stripe_transactions_lead_id ON public.stripe_transactions(lead_id);
CREATE INDEX idx_stripe_transactions_payment_intent_id ON public.stripe_transactions(stripe_payment_intent_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_transactions_updated_at
  BEFORE UPDATE ON public.stripe_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();