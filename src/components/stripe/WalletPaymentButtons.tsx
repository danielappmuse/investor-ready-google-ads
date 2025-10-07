import React, { useEffect, useState } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/utils/errorLogger';
import type { ValidationOnboardingData } from '@/components/forms/ValidationOnboarding';

interface WalletPaymentButtonsProps {
  onboardingData: ValidationOnboardingData;
  onSuccess: () => void;
  onError: (error: string) => void;
  clientSecret?: string;
}

const WalletPaymentButtons: React.FC<WalletPaymentButtonsProps> = ({
  onboardingData,
  onSuccess,
  onError,
  clientSecret
}) => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);

  useEffect(() => {
    const addDebugLog = (message: string) => {
      setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    if (stripe) {
      addDebugLog('🔄 Stripe loaded, checking Apple Pay availability...');
      addDebugLog(`📱 Device: ${navigator.userAgent}`);
      addDebugLog(`🌐 Protocol: ${window.location.protocol}`);
      
      // Enhanced browser detection
      const isChrome = /Chrome/.test(navigator.userAgent);
      const isSafari = /Safari/.test(navigator.userAgent) && !isChrome;
      const isMac = /Mac/.test(navigator.userAgent);
      const isIOS = /iPhone|iPad/.test(navigator.userAgent);
      
      addDebugLog(`🖥️ Browser: ${isChrome ? 'Chrome' : isSafari ? 'Safari' : 'Other'}`);
      addDebugLog(`💻 Platform: ${isMac ? 'macOS' : isIOS ? 'iOS' : 'Other'}`);
      addDebugLog(`📍 URL: ${window.location.href}`);
      addDebugLog(`🔑 Client Secret: ${clientSecret ? 'Present' : 'Missing'}`);
      
      // Enhanced device capability checks
      addDebugLog(`🔍 iOS Version: ${navigator.userAgent.match(/OS (\d+_\d+)/)?.[1] || 'Unknown'}`);
      addDebugLog(`🎯 Safari Version: ${navigator.userAgent.match(/Version\/([\d.]+)/)?.[1] || 'Unknown'}`);
      addDebugLog(`💻 Touch Support: ${'ontouchstart' in window ? 'Yes' : 'No'}`);
      addDebugLog(`🔐 Secure Context: ${window.isSecureContext ? 'Yes' : 'No'}`);
      
      // Check for Apple Pay API availability
      const applePaySession = (window as any).ApplePaySession;
      if (applePaySession) {
        addDebugLog(`🍎 ApplePaySession API: Available`);
        addDebugLog(`🍎 ApplePaySession Version: ${applePaySession.version || 'Unknown'}`);
        addDebugLog(`🍎 Can Make Payments Check: ${applePaySession.canMakePayments ? 'Supported' : 'Not Supported'}`);
        if (applePaySession.canMakePayments) {
          addDebugLog(`🍎 Can Make Active Payments: ${applePaySession.canMakePaymentsWithActiveCard ? 'Yes' : 'No'}`);
        }
      } else {
        addDebugLog(`❌ ApplePaySession API: Not Available`);
        
        // Provide specific guidance based on current environment
        if (isChrome && isMac) {
          addDebugLog(`💡 Chrome on macOS: Apple Pay not supported in Chrome`);
          addDebugLog(`💡 To test Apple Pay: Use Safari on macOS or iOS device`);
        } else if (!isIOS && !isMac) {
          addDebugLog(`💡 Non-Apple device: Apple Pay only works on iOS/macOS`);
        }
      }

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

      addDebugLog('🔧 Asad Here!! Payment Request created, checking capabilities...');

      // Enhanced Apple Pay detection - ALWAYS calls pr.canMakePayment() first
      const initializeApplePay = async () => {
        const iosVersion = navigator.userAgent.match(/OS (\d+)_/)?.[1] ? parseInt(navigator.userAgent.match(/OS (\d+)_/)?.[1]) : 0;
        const isNewerIOS = iosVersion >= 17; // iPhone 15 Pro Max runs iOS 17+
        const isIPhone = /iPhone/.test(navigator.userAgent);
        const isMac = /Mac/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        
        addDebugLog(`🔍 iOS Version: ${iosVersion}`);
        addDebugLog(`📱 Device: ${isIPhone ? 'iPhone' : isMac ? 'Mac' : 'Other'}`);
        addDebugLog(`🌐 Browser: ${isSafari ? 'Safari' : 'Other'}`);
        addDebugLog(`🔧 Domain ID: pmd_1S5lu3GXA6RAFpIKTDeDQ3hZ (configured)`);
        
        try {
          // ALWAYS check Stripe API first - this is required
          addDebugLog('🔄 Checking Stripe canMakePayment() - REQUIRED before mounting element');
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Stripe API timeout')), 8000);
          });
          
          const result = await Promise.race([pr.canMakePayment(), timeoutPromise]);
          addDebugLog(`🍎 Stripe API result: ${JSON.stringify(result)}`);
          
          if (result && (result as any).applePay) {
            addDebugLog('✅ Stripe API confirmed Apple Pay availability');
            setPaymentRequest(pr);
            setCanMakePayment(true);
            setIsCheckingAvailability(false);
            return;
          } else {
            addDebugLog('❌ Stripe API: Apple Pay not available via standard check');
          }
          
        } catch (error) {
          addDebugLog(`❌ Stripe API error: ${error.message}`);
        }
        
        // Enhanced fallback logic for Apple devices with native API support
        addDebugLog('🔍 Checking fallback conditions...');
        addDebugLog(`  - applePaySession exists: ${!!applePaySession}`);
        addDebugLog(`  - isIPhone: ${isIPhone}`);
        addDebugLog(`  - isMac: ${isMac}`);
        addDebugLog(`  - isSafari: ${isSafari}`);
        addDebugLog(`  - isSecureContext: ${window.isSecureContext}`);
        
        if (applePaySession && (isIPhone || isMac) && isSafari && window.isSecureContext) {
          addDebugLog('✅ Fallback conditions met - proceeding with native API check');
          
          try {
            const nativeCanMakePayments = applePaySession.canMakePayments();
            addDebugLog(`🍎 Native canMakePayments: ${nativeCanMakePayments}`);
            
            if (nativeCanMakePayments) {
              // macOS Safari - enable immediately
              if (isMac) {
                addDebugLog('✅ FALLBACK ENABLE: macOS Safari with native Apple Pay API');
                addDebugLog('📋 Enabling Apple Pay based on native API confirmation');
                setPaymentRequest(pr);
                setCanMakePayment(true);
                setIsCheckingAvailability(false);
                return;
              }
              
              // For iPhone 15 Pro Max and newer iOS, be more aggressive
              if (isNewerIOS && isIPhone) {
                addDebugLog('✅ FALLBACK ENABLE: iPhone 15 Pro Max/newer iOS with native Apple Pay API');
                addDebugLog('📋 Using fallback due to known Stripe API issues on newer iOS');
                setPaymentRequest(pr);
                setCanMakePayment(true);
                setIsCheckingAvailability(false);
                return;
              }
              
              // Standard iOS devices
              if (isIPhone) {
                addDebugLog('✅ FALLBACK ENABLE: iOS Safari with native Apple Pay API');
                setPaymentRequest(pr);
                setCanMakePayment(true);
                setIsCheckingAvailability(false);
                return;
              }
            } else {
              addDebugLog('❌ Native canMakePayments returned false - no cards configured');
            }
          } catch (nativeError) {
            addDebugLog(`❌ Native Apple Pay API error: ${nativeError.message}`);
          }
        } else {
          addDebugLog('❌ Fallback conditions not met:');
          if (!applePaySession) addDebugLog('  - ApplePaySession API not available');
          if (!isIPhone && !isMac) addDebugLog('  - Not an Apple device');
          if (!isSafari) addDebugLog('  - Not Safari browser');  
          if (!window.isSecureContext) addDebugLog('  - Not secure context (HTTPS)');
        }
        
        addDebugLog('❌ Apple Pay initialization complete - not available');
        setIsCheckingAvailability(false);
      };
      
      // Initialize Apple Pay detection
      initializeApplePay();

      pr.on('paymentmethod', async (ev) => {
        try {
          console.log('💳 Processing wallet payment...');
          addDebugLog('💳 Processing wallet payment...');
          
          if (!clientSecret) {
            ev.complete('fail');
            onError('Payment setup not ready');
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
            onError(confirmError.message || 'Wallet payment failed');
            return;
          }

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            ev.complete('success');
            await handleSuccessfulPayment(paymentIntent.id);
          } else {
            ev.complete('fail');
            onError('Payment could not be completed');
          }
        } catch (error) {
          ev.complete('fail');
          console.error('❌ Wallet payment error:', error);
          onError(error instanceof Error ? error.message : 'Wallet payment failed');
        }
      });
    } else {
      addDebugLog('⏳ Waiting for Stripe to load...');
    }
  }, [stripe, clientSecret, onboardingData, onSuccess, onError]);

  const handleSuccessfulPayment = async (paymentIntentId: string) => {
    try {
      console.log('✅ Wallet payment successful, saving lead data...');
      
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
      }

      onSuccess();
    } catch (leadError) {
      console.error('❌ Error saving lead data:', leadError);
      // Still call success since payment went through
      onSuccess();
    }
  };

  const isIPhone = /iPhone/.test(navigator.userAgent);
  const shouldShowWalletButtons = (canMakePayment && clientSecret) || isIPhone;

  // Show loading state while checking Apple Pay availability
  if (isCheckingAvailability) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted/30 rounded-lg h-12 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Checking payment options...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Debug Information */}
      {debugInfo.length > 0 && (
        <div className="bg-muted/30 border border-border rounded-lg p-3 max-h-40 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Apple Pay Debug Logs:</div>
          <div className="space-y-1">
            {debugInfo.map((log, index) => (
              <div key={index} className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Show wallet buttons only after availability check is complete */}
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
  );
};

export default WalletPaymentButtons;