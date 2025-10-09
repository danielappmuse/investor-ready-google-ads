import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/utils/errorLogger';
import { CheckoutErrorBoundary } from '@/components/CheckoutErrorBoundary';
import type { ValidationOnboardingData } from '@/types/validation';
import ModalPaymentForm from './ModalPaymentForm';

interface EmbeddedStripeCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
  onboardingData: ValidationOnboardingData;
}

const EmbeddedStripeCheckout: React.FC<EmbeddedStripeCheckoutProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  onboardingData
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string, details?: any) => {
    const logMessage = `${new Date().toLocaleTimeString()}: ${message}`;
    setDebugLogs(prev => [...prev, logMessage]);
    errorLogger.debug(`[EmbeddedStripeCheckout] ${message}`, details);
  };

  useEffect(() => {
    // Log component mount with device detection
    errorLogger.info('EmbeddedStripeCheckout mounted', {
      isOpen,
      hasOnboardingData: !!onboardingData,
      userAgent: navigator.userAgent
    });

    // Special logging for iPhone 15 Pro Max
    errorLogger.logIPhone15ProMaxIssue('EmbeddedStripeCheckout Opened', {
      isOpen,
      onboardingData: onboardingData ? Object.keys(onboardingData) : []
    });

    if (!isOpen) {
      addDebugLog('⚠️ Modal not open, skipping initialization');
      return;
    }

    const initializePayment = async () => {
      addDebugLog('🚀 Initializing modal payment system...');
      addDebugLog('📋 Onboarding data present', { hasData: !!onboardingData });
      
      setIsLoading(true);
      setError(null);

      try {
        // Validate onboarding data first
        if (!onboardingData?.email) {
          throw new Error('Email is required for payment processing');
        }

        if (!onboardingData?.name) {
          throw new Error('Name is required for payment processing');
        }

        addDebugLog('✅ Onboarding data validation passed');

        // Get payment intent from our existing working edge function
        addDebugLog('📞 Creating payment intent...');
        
        const requestBody = {
          email: onboardingData.email,
          firstName: onboardingData.name,
          lastName: '',
          amount: 7800, // $78.00
          onboardingData
        };
        
        addDebugLog('📋 Request body prepared', requestBody);
        
        const { data, error: intentError } = await supabase.functions.invoke('create-payment-intent', {
          body: requestBody
        });

        addDebugLog('📨 Payment intent response received', { 
          hasData: !!data, 
          hasError: !!intentError,
          dataKeys: data ? Object.keys(data) : [],
          errorDetails: intentError
        });

        if (intentError) {
          addDebugLog('❌ Payment intent error detected', intentError);
          errorLogger.error('Payment intent creation failed', intentError);
          
          // Special logging for iPhone 15 Pro Max
          errorLogger.logIPhone15ProMaxIssue('Payment Intent Error', intentError);
          
          throw new Error(intentError.message || 'Failed to create payment intent');
        }

        if (!data?.clientSecret || !data?.publishableKey) {
          addDebugLog('❌ Invalid payment intent response', data);
          errorLogger.error('Invalid payment intent response', data);
          
          // Check if it's a configuration error
          if (typeof data === 'object' && data.error) {
            throw new Error(data.message || 'Payment configuration error');
          }
          
          throw new Error('Invalid payment intent response - missing client secret or publishable key');
        }

        addDebugLog('✅ Payment intent created successfully');

        // Initialize Stripe with retry mechanism
        addDebugLog('🔑 Loading Stripe...');
        let stripeInstance;
        let retries = 3;
        
        while (retries > 0 && !stripeInstance) {
          try {
            stripeInstance = await loadStripe(data.publishableKey, {
              stripeAccount: undefined,
              locale: 'auto'
            });
            if (!stripeInstance) {
              throw new Error('Stripe instance is null');
            }
            break;
          } catch (stripeError) {
            addDebugLog(`Stripe loading attempt failed (${4 - retries}/3)`, stripeError);
            retries--;
            if (retries === 0) {
              throw new Error(`Failed to load Stripe after 3 attempts: ${stripeError.message}`);
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        addDebugLog('✅ Stripe loaded successfully');
        setStripe(stripeInstance);
        setClientSecret(data.clientSecret);
        setIsLoading(false);
        setRetryCount(0); // Reset retry count on success

        addDebugLog('✅ Payment system initialized successfully');
        errorLogger.info('Payment system initialized successfully');

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        
        addDebugLog('💥 Payment initialization failed', { error: errorMessage });
        errorLogger.error('Payment initialization failed', {
          error: errorMessage,
          stack: err instanceof Error ? err.stack : 'No stack trace',
          retryCount,
          onboardingData: onboardingData ? Object.keys(onboardingData) : []
        });

        // Special logging for iPhone 15 Pro Max
        errorLogger.logIPhone15ProMaxIssue('Payment Initialization Failed', {
          error: errorMessage,
          retryCount
        });
        
        setError(errorMessage);
        onError(errorMessage);
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [isOpen, onboardingData, onError, retryCount]);

  const handleClose = () => {
    addDebugLog('🚪 Modal closing...');
    errorLogger.info('EmbeddedStripeCheckout closed by user');
    onClose();
  };

  const handlePaymentSuccess = () => {
    addDebugLog('✅ Payment success in modal, closing...');
    errorLogger.info('Payment completed successfully in modal');
    
    // Special logging for iPhone 15 Pro Max
    errorLogger.logIPhone15ProMaxIssue('Payment Success', {
      timestamp: new Date().toISOString()
    });
    
    onClose();
    onSuccess();
  };

  const handlePaymentErrorInModal = (errorMessage: string) => {
    addDebugLog('❌ Payment error in modal', { error: errorMessage });
    errorLogger.error('Payment error in modal', { error: errorMessage });
    
    // Special logging for iPhone 15 Pro Max
    errorLogger.logIPhone15ProMaxIssue('Payment Error in Modal', { error: errorMessage });
    
    setError(errorMessage);
    // Don't close modal on payment errors, let user retry
  };

  const handleRetry = () => {
    addDebugLog('🔄 User requested retry');
    errorLogger.info('User requested payment retry', { retryCount });
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  // Special handling for iPhone 15 Pro Max
  const isIPhone15ProMax = /iPhone16,1/.test(navigator.userAgent) || 
    (window.screen.height === 2796 && window.screen.width === 1290);

  return (
    <CheckoutErrorBoundary>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className={`max-w-4xl w-[calc(100vw-2rem)] sm:w-full max-h-[90vh] flex flex-col p-0 mr-4 sm:mr-6 ${
            isIPhone15ProMax ? 'iPhone15ProMax-modal' : ''
          }`}
        >
          <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Complete Your Payment
              {isIPhone15ProMax && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                  iPhone 15 Pro Max
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Debug Logs for iPhone 15 Pro Max */}
            {isIPhone15ProMax && debugLogs.length > 0 && (
              <div className="p-4 bg-muted/30 border-b">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Debug Logs (iPhone 15 Pro Max):
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {debugLogs.slice(-10).map((log, index) => (
                    <div key={index} className="text-xs font-mono text-muted-foreground">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <div className="text-center space-y-1">
                    <p className="text-sm sm:text-base text-muted-foreground">Loading secure checkout...</p>
                    <p className="text-xs text-muted-foreground">Setting up your payment options</p>
                    {retryCount > 0 && (
                      <p className="text-xs text-yellow-600">Retry attempt {retryCount}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center p-4 sm:p-6">
                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-md">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-destructive">Payment Setup Error</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm px-2">{error}</p>
                    {isIPhone15ProMax && (
                      <p className="text-xs text-yellow-600 px-2">
                        This error has been specially logged for iPhone 15 Pro Max debugging.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRetry} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                    <Button onClick={handleClose} variant="outline" size="sm">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !error && stripe && clientSecret && (
              <div className="p-4 sm:p-6 md:p-8">
                <ModalPaymentForm
                  stripe={stripe}
                  clientSecret={clientSecret}
                  onboardingData={onboardingData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentErrorInModal}
                />
              </div>
            )}

            {!isLoading && !error && (!stripe || !clientSecret) && (
              <div className="flex items-center justify-center p-4 sm:p-6">
                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-yellow-600">Waiting for Payment Setup</h3>
                    <p className="text-muted-foreground max-w-md text-xs sm:text-sm px-2">
                      Payment system is initializing. This should complete shortly.
                    </p>
                  </div>
                  <Button onClick={handleRetry} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </CheckoutErrorBoundary>
  );
};

export default EmbeddedStripeCheckout;