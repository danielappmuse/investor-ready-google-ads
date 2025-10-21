import React, { useEffect, useState } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/utils/errorLogger';
import type { ValidationOnboardingData } from '@/types/validation';
import { CheckoutErrorBoundary } from '@/components/CheckoutErrorBoundary';

interface EnhancedWalletPaymentButtonsProps {
  onboardingData: ValidationOnboardingData;
  onSuccess: () => void;
  onError: (error: string) => void;
  clientSecret?: string;
}

const EnhancedWalletPaymentButtons: React.FC<EnhancedWalletPaymentButtonsProps> = ({
  onboardingData,
  onSuccess,
  onError,
  clientSecret
}) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [componentError, setComponentError] = useState<string | null>(null);

  useEffect(() => {
    const initializeWalletPayment = async () => {
      try {
        errorLogger.info('WalletPaymentButtons component mounted', {
          hasStripe: !!stripe,
          hasClientSecret: !!clientSecret,
          userAgent: navigator.userAgent
        });

        // Log iPhone 15 Pro Max specific initialization
        errorLogger.logIPhone15ProMaxIssue('WalletPaymentButtons Initialization', {
          hasStripe: !!stripe,
          hasClientSecret: !!clientSecret
        });

        if (!stripe) {
          setIsLoading(false);
          return;
        }

        if (!clientSecret) {
          errorLogger.error('WalletPaymentButtons: No client secret provided');
          setComponentError('Payment setup not ready');
          setIsLoading(false);
          return;
        }

        // Enhanced browser detection
        const isChrome = /Chrome/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !isChrome;
        const isIOS = /iPhone|iPad/.test(navigator.userAgent);
        const isMac = /Mac/.test(navigator.userAgent) && !isIOS;
        const isIPhone15ProMax = /iPhone16,1/.test(navigator.userAgent) || 
          (window.screen.height === 2796 && window.screen.width === 1290);
        
        if (isIPhone15ProMax) {
          errorLogger.logIPhone15ProMaxIssue('Device Detection', {
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: navigator.userAgent
          });
        }

        // Check for Apple Pay API availability
        const applePaySession = (window as any).ApplePaySession;

        // Create payment request
        const pr = stripe.paymentRequest({
          country: 'US',
          currency: 'usd',
          total: {
            label: 'Validation Session',
            amount: 7800, // $78.00 in cents
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        // Initialize Apple Pay detection with comprehensive error handling
        try {
          await initializeApplePay(pr, applePaySession, {
            isIPhone15ProMax,
            isIOS,
            isMac,
            isSafari,
            isChrome
          });
        } catch (applePayError) {
          errorLogger.error('Apple Pay initialization failed', applePayError);
          
          if (isIPhone15ProMax) {
            errorLogger.logIPhone15ProMaxIssue('Apple Pay Initialization Failed', {
              error: applePayError.message,
              stack: applePayError.stack
            });
          }
        }

        // Set up payment method handler with extensive error handling
        pr.on('paymentmethod', async (ev) => {
          try {
            console.log('💳 Processing wallet payment...');
            
            if (!clientSecret) {
              ev.complete('fail');
              const errorMsg = 'Payment setup not ready';
              errorLogger.error(errorMsg);
              onError(errorMsg);
              return;
            }
            
            // Confirm the PaymentIntent with the PaymentMethod
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
              clientSecret,
              {
                payment_method: ev.paymentMethod.id
              }
            );

            if (confirmError) {
              ev.complete('fail');
              const errorMsg = confirmError.message || 'Wallet payment failed';
              errorLogger.error('Payment confirmation failed', confirmError);
              
              if (isIPhone15ProMax) {
                errorLogger.logIPhone15ProMaxIssue('Payment Confirmation Failed', confirmError);
              }
              
              onError(errorMsg);
              return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
              ev.complete('success');
              await handleSuccessfulPayment(paymentIntent.id);
            } else {
              ev.complete('fail');
              const errorMsg = 'Payment could not be completed';
              errorLogger.error(errorMsg, { paymentIntent });
              onError(errorMsg);
            }
          } catch (error) {
            ev.complete('fail');
            console.error('❌ Wallet payment error:', error);
            errorLogger.error('Wallet payment processing error', error);
            
            if (isIPhone15ProMax) {
              errorLogger.logIPhone15ProMaxIssue('Wallet Payment Processing Error', error);
            }
            
            onError(error instanceof Error ? error.message : 'Wallet payment failed');
          }
        });

        setIsLoading(false);

      } catch (error) {
        console.error('❌ WalletPaymentButtons initialization error:', error);
        errorLogger.error('WalletPaymentButtons initialization failed', error);
        
        const isIPhone15ProMax = /iPhone16,1/.test(navigator.userAgent) || 
          (window.screen.height === 2796 && window.screen.width === 1290);
        
        if (isIPhone15ProMax) {
          errorLogger.logIPhone15ProMaxIssue('Component Initialization Failed', error);
        }
        
        setComponentError(error instanceof Error ? error.message : 'Failed to initialize payment');
        setIsLoading(false);
      }
    };

    initializeWalletPayment();
  }, [stripe, clientSecret, onboardingData, onSuccess, onError]);

  const initializeApplePay = async (pr: any, applePaySession: any, deviceInfo: any) => {
    const { isIPhone15ProMax, isIOS, isMac, isSafari, isChrome } = deviceInfo;
    
    let stripeCheckPassed = false;
    
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Stripe API timeout')), 8000);
      });
      
      const result = await Promise.race([pr.canMakePayment(), timeoutPromise]);
      
      if (result && (result as any).applePay) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
        stripeCheckPassed = true;
        return;
      }
      
    } catch (error) {
      errorLogger.error('Stripe canMakePayment API error', error);
      
      if (isIPhone15ProMax) {
        errorLogger.logIPhone15ProMaxIssue('Stripe API Failed', {
          error: error.message,
          reason: 'canMakePayment() call failed - known issue on iPhone 15 Pro Max'
        });
      }
    }
    
    // Enhanced fallback logic - runs for BOTH null results AND errors
    if (!stripeCheckPassed) {
      if (applePaySession && (isIOS || isMac) && isSafari && window.isSecureContext) {
        try {
          const nativeCanMakePayments = applePaySession.canMakePayments();
          
          if (nativeCanMakePayments) {
            // For iPhone 15 Pro Max, enable immediately
            if (isIPhone15ProMax) {
              errorLogger.logIPhone15ProMaxIssue('Fallback Apple Pay Enable', {
                nativeCanMakePayments,
                reason: 'Stripe API returned null, using native API confirmation'
              });
              setPaymentRequest(pr);
              setCanMakePayment(true);
              return;
            }
            
            // For macOS Safari, enable immediately  
            if (isMac) {
              setPaymentRequest(pr);
              setCanMakePayment(true);
              return;
            }
            
            // For standard iOS devices
            if (isIOS) {
              setPaymentRequest(pr);
              setCanMakePayment(true);
              return;
            }
          }
        } catch (nativeError) {
          errorLogger.error('Native Apple Pay API error', nativeError);
        }
      }
    }
  };

  const handleSuccessfulPayment = async (paymentIntentId: string) => {
    try {
      console.log('✅ Wallet payment successful, saving lead data...');
      errorLogger.info('Wallet payment successful', { paymentIntentId });
      
      // Save lead data after successful payment
      const leadResponse = await supabase.functions.invoke('save-lead-data', {
        body: {
          onboardingData,
          paymentIntentId,
          sessionType: 'validation'
        }
      });

      console.log('💾 Lead data save response:', leadResponse);
      
      if (leadResponse.error) {
        console.error('⚠️ Failed to save lead data:', leadResponse.error);
        errorLogger.warn('Failed to save lead data after successful payment', leadResponse.error);
      } else {
        errorLogger.info('Lead data saved successfully after payment');
      }

      onSuccess();
    } catch (leadError) {
      console.error('❌ Error saving lead data:', leadError);
      errorLogger.error('Error saving lead data after payment', leadError);
      // Still call success since payment went through
      onSuccess();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted rounded-lg h-12 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading payment options...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (componentError) {
    return (
      <div className="space-y-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-sm text-destructive">
            Payment initialization failed: {componentError}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            This error has been logged for debugging.
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Pay with card instead
            </span>
          </div>
        </div>
      </div>
    );
  }

  const isIPhone = /iPhone/.test(navigator.userAgent);
  const isIPhone15ProMax = /iPhone16,1/.test(navigator.userAgent) || 
    (window.screen.height === 2796 && window.screen.width === 1290);
  const shouldShowWalletButtons = (canMakePayment && clientSecret) || isIPhone;

  return (
    <CheckoutErrorBoundary>
      <div className="space-y-4">
        {/* Show wallet buttons only if canMakePayment check is complete */}
        {shouldShowWalletButtons && (
          <>
            {canMakePayment && clientSecret && paymentRequest ? (
              <div className="wallet-buttons">
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest,
                    style: {
                      paymentRequestButton: {
                        type: 'default',
                        theme: 'dark',
                        height: '48px',
                      },
                    },
                  }}
                />
              </div>
            ) : isIPhone ? (
              <div className="space-y-2">
                <div className="wallet-buttons">
                  <div className="bg-muted/50 border border-border rounded-lg p-3 h-12 flex items-center justify-center opacity-50 cursor-not-allowed">
                    <span className="text-sm text-muted-foreground">🍎 Apple Pay</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Apple Pay not available on this device. Please use card instead.
                </p>
              </div>
            ) : null}
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {isIPhone ? "Or pay with card" : "Pay with card"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </CheckoutErrorBoundary>
  );
};

export default EnhancedWalletPaymentButtons;