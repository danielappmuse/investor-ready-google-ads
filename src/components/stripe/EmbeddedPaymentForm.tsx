import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ValidationOnboardingData } from '@/types/validation';

interface EmbeddedPaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  onboardingData: ValidationOnboardingData;
}

export const EmbeddedPaymentForm = ({ 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing,
  onboardingData 
}: EmbeddedPaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isReady, setIsReady] = useState(false);
  const [paymentElementError, setPaymentElementError] = useState<string | null>(null);
  const [elementComplete, setElementComplete] = useState(false);

  useEffect(() => {
    console.log('Stripe Elements Status:', { stripe: !!stripe, elements: !!elements });
    if (stripe && elements) {
      console.log('Stripe and Elements are ready');
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      onError('Payment system not ready. Please refresh and try again.');
      return;
    }

    if (!elementComplete) {
      onError('Please complete all payment details.');
      return;
    }

    setIsProcessing(true);
    setPaymentElementError(null);

    try {
      console.log('Confirming payment...');
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/?payment=success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment failed:', error);
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded, saving lead data...');
        
        // Save lead and transaction data to database
        try {
          const { data, error: saveError } = await supabase.functions.invoke('save-lead-data', {
            body: {
              onboardingData: onboardingData,
              paymentIntentId: paymentIntent.id
            }
          });

          if (saveError) {
            console.error('Error saving lead data:', saveError);
            // Payment succeeded but data save failed - still call onSuccess
            // but log the error for monitoring
            onError('Payment successful but failed to save data. Please contact support.');
            return;
          }

          console.log('Lead data saved successfully:', data);
          onSuccess();
        } catch (saveErr) {
          console.error('Save data error:', saveErr);
          onError('Payment successful but failed to save data. Please contact support.');
        }
      } else {
        console.log('Payment succeeded but status not confirmed');
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      onError('An unexpected error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentElementChange = (event: any) => {
    console.log('Payment element changed:', event);
    if (event.error) {
      setPaymentElementError(event.error.message);
      setElementComplete(false);
    } else {
      setPaymentElementError(null);
      setElementComplete(event.complete);
    }
  };

  if (!isReady) {
    return (
      <div className="space-y-6">
        <div className="p-8 bg-white/5 rounded-lg border border-white/10 text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80">Initializing secure payment...</p>
          <p className="text-xs text-white/60 mt-2">Powered by Stripe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-center space-x-2 text-sm text-white/80">
          <CreditCard className="w-4 h-4" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Information
            </label>
            <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary min-h-[80px]">
              <PaymentElement 
                options={{
                  layout: {
                    type: 'accordion',
                    defaultCollapsed: false,
                    radios: false,
                    spacedAccordionItems: true
                  },
                  paymentMethodOrder: ['card', 'link', 'us_bank_account', 'cashapp', 'affirm', 'klarna'],
                  wallets: {
                    applePay: 'auto',
                    googlePay: 'auto'
                  }
                }}
                onChange={handlePaymentElementChange}
                onReady={() => console.log('PaymentElement ready - available payment methods should now be visible')}
              />
            </div>
            
            {/* Fallback manual card fields if PaymentElement doesn't load */}
            <div className="mt-4 space-y-4 opacity-0 pointer-events-none">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 1234 1234 1234"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  maxLength={19}
                  autoComplete="cc-number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    maxLength={5}
                    autoComplete="cc-exp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    maxLength={4}
                    autoComplete="cc-csc"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {paymentElementError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{paymentElementError}</span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="text-lg font-bold text-gray-900">$78.00</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">One-time payment • Risk free, money back guarantee if no results</p>
        </div>
        
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="btn-hero w-full"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay $78 Now
            </>
          )}
        </Button>
      </form>
    </div>
  );
};