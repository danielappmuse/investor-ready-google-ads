import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { ValidationOnboardingData } from '@/types/validation';
import EnhancedWalletPaymentButtons from './EnhancedWalletPaymentButtons';

interface PaymentFormProps {
  onboardingData: ValidationOnboardingData;
  onSuccess: () => void;
  onError: (error: string) => void;
  clientSecret?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onboardingData, onSuccess, onError, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      console.error('❌ Stripe not loaded');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💳 Confirming payment...');
      
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/?payment=success`,
        },
      });

      console.log('📋 Payment confirmation result:', result);

      if (result.error) {
        console.error('❌ Payment failed:', result.error);
        onError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        console.log('✅ Payment successful:', result.paymentIntent.id);
        setPaymentCompleted(true);
        
        // Save lead data after successful payment
        try {
          const leadResponse = await supabase.functions.invoke('save-lead-data', {
            body: {
              onboardingData,
              paymentIntentId: result.paymentIntent.id,
              sessionType: 'validation'
            }
          });

          console.log('💾 Lead data save response:', leadResponse);
          
          if (leadResponse.error) {
            console.error('⚠️ Failed to save lead data:', leadResponse.error);
          }
        } catch (leadError) {
          console.error('❌ Error saving lead data:', leadError);
        }

        // Brief delay to show success state, then trigger success callback
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('💥 Payment processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-3 sm:space-y-4 px-4">
        <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
        <div className="text-center space-y-1 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-green-600">Payment Successful!</h3>
          <p className="text-sm sm:text-base text-muted-foreground">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Wallet Payment Buttons - Always render container */}
      <div className="mb-6">
        <EnhancedWalletPaymentButtons 
          onboardingData={onboardingData}
          onSuccess={onSuccess}
          onError={onError}
          clientSecret={clientSecret}
        />
      </div>
      
      {/* Card Payment Form - Always visible */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <PaymentElement
            options={{
              fields: {
                billingDetails: 'auto'
              },
              layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: false,
                spacedAccordionItems: false
              },
              wallets: {
                applePay: 'auto',
                googlePay: 'auto'
              },
              paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
              defaultValues: {
                billingDetails: {
                  name: onboardingData.name,
                  email: onboardingData.email
                }
              }
            }}
          />
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between text-sm border-t pt-3 sm:pt-4">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-semibold text-base sm:text-lg">$78.00</span>
          </div>
          
          <Button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                <span className="text-xs sm:text-sm">Processing Payment...</span>
              </>
            ) : (
              <>
                Complete Payment • $78.00
              </>
            )}
          </Button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            🔒 Your payment is protected by 256-bit SSL encryption
          </p>
          <p className="text-xs text-muted-foreground">
            All major payment methods supported including Apple Pay & Google Pay
          </p>
        </div>
      </form>
    </div>
  );
};

interface ModalPaymentFormProps {
  stripe: any;
  clientSecret: string;
  onboardingData: ValidationOnboardingData;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const ModalPaymentForm: React.FC<ModalPaymentFormProps> = ({
  stripe,
  clientSecret,
  onboardingData,
  onSuccess,
  onError
}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorDanger: 'hsl(var(--destructive))',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      }
    }
  };

  return (
    <Elements stripe={stripe} options={options}>
      <PaymentForm
        onboardingData={onboardingData}
        onSuccess={onSuccess}
        onError={onError}
        clientSecret={clientSecret}
      />
    </Elements>
  );
};

export default ModalPaymentForm;