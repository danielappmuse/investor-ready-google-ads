import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { ValidationOnboardingData } from '@/types/validation';

interface StripePaymentFormProps {
  onboardingData: ValidationOnboardingData;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CardForm = ({ onboardingData, onSuccess, onError }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: onboardingData.name || '',
    email: onboardingData.email || '',
    phone: onboardingData.phone || '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe not loaded. Please refresh the page.');
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      onError('Card information not found. Please refresh the page.');
      return;
    }

    if (!cardComplete.cardNumber || !cardComplete.cardExpiry || !cardComplete.cardCvc) {
      onError('Please complete all card information.');
      return;
    }

    if (!billingDetails.name.trim()) {
      onError('Please enter the cardholder name.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          email: billingDetails.email,
          firstName: billingDetails.name.split(' ')[0] || billingDetails.name,
          lastName: billingDetails.name.split(' ').slice(1).join(' ') || '',
          onboardingData: onboardingData
        }
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Failed to create payment');
      }

      if (!paymentData?.clientSecret) {
        throw new Error('No payment client secret received');
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone || undefined,
              address: {
                line1: billingDetails.address.line1 || undefined,
                city: billingDetails.address.city || undefined,
                state: billingDetails.address.state || undefined,
                postal_code: billingDetails.address.postal_code || undefined,
                country: billingDetails.address.country,
              }
            }
          }
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Save lead data
        const { error: saveError } = await supabase.functions.invoke('save-lead-data', {
          body: {
            onboardingData: onboardingData,
            paymentIntentId: paymentIntent.id
          }
        });

        if (saveError) {
          console.error('Error saving lead data:', saveError);
          // Payment succeeded but data save failed
          onError('Payment successful but failed to save data. Please contact support.');
          return;
        }

        onSuccess();
      } else {
        throw new Error('Payment was not completed successfully');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        padding: '12px',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  const handleCardElementChange = (elementType: string) => (event: any) => {
    setCardErrors(prev => ({
      ...prev,
      [elementType]: event.error ? event.error.message : ''
    }));
    setCardComplete(prev => ({
      ...prev,
      [elementType]: event.complete
    }));
  };

  const isFormValid = cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc && billingDetails.name.trim();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-gray-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl text-gray-900">
            <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
            Payment Information
          </CardTitle>
          <p className="text-sm text-gray-600">Enter your card details to complete your purchase</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Billing Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    type="text"
                    value={billingDetails.name}
                    onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name on card"
                    required
                    className="mt-1"
                    autoComplete="cc-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingDetails.email}
                    onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="mt-1"
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={billingDetails.phone}
                  onChange={(e) => setBillingDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Card Information</h3>
              
              <div>
                <Label>Card Number *</Label>
                <div className="mt-1 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <CardNumberElement 
                    options={cardElementOptions}
                    onChange={handleCardElementChange('cardNumber')}
                  />
                </div>
                {cardErrors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{cardErrors.cardNumber}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry Date *</Label>
                  <div className="mt-1 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <CardExpiryElement 
                      options={cardElementOptions}
                      onChange={handleCardElementChange('cardExpiry')}
                    />
                  </div>
                  {cardErrors.cardExpiry && (
                    <p className="mt-1 text-sm text-red-600">{cardErrors.cardExpiry}</p>
                  )}
                </div>
                
                <div>
                  <Label>CVC *</Label>
                  <div className="mt-1 p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <CardCvcElement 
                      options={cardElementOptions}
                      onChange={handleCardElementChange('cardCvc')}
                    />
                  </div>
                  {cardErrors.cardCvc && (
                    <p className="mt-1 text-sm text-red-600">{cardErrors.cardCvc}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
              
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={billingDetails.address.line1}
                  onChange={(e) => setBillingDetails(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line1: e.target.value }
                  }))}
                  placeholder="123 Main Street"
                  className="mt-1"
                  autoComplete="address-line1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={billingDetails.address.city}
                    onChange={(e) => setBillingDetails(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="New York"
                    className="mt-1"
                    autoComplete="address-level2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    value={billingDetails.address.state}
                    onChange={(e) => setBillingDetails(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    placeholder="NY"
                    className="mt-1"
                    autoComplete="address-level1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    type="text"
                    value={billingDetails.address.postal_code}
                    onChange={(e) => setBillingDetails(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, postal_code: e.target.value }
                    }))}
                    placeholder="10001"
                    className="mt-1"
                    autoComplete="postal-code"
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Secure Payment</p>
                <p className="text-sm text-green-700">Your payment information is encrypted and secure.</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900">$78.00</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">One-time payment • Risk free, money back guarantee if no results</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing || !isFormValid}
              className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay $78.00 Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const StripePaymentForm = ({ onboardingData, onSuccess, onError }: StripePaymentFormProps) => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Get the publishable key from the payment intent creation
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: {
            email: onboardingData.email,
            firstName: onboardingData.name.split(' ')[0] || onboardingData.name,
            lastName: onboardingData.name.split(' ').slice(1).join(' ') || '',
            onboardingData: onboardingData
          }
        });

        if (error || !data?.publishableKey) {
          throw new Error('Failed to get Stripe configuration');
        }

        setPublishableKey(data.publishableKey);
        setStripePromise(loadStripe(data.publishableKey));
      } catch (error: any) {
        console.error('Stripe initialization error:', error);
        onError('Failed to initialize payment system. Please refresh and try again.');
      }
    };

    initializeStripe();
  }, [onboardingData, onError]);

  if (!stripePromise || !publishableKey) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Initializing secure payment system...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CardForm 
        onboardingData={onboardingData}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};