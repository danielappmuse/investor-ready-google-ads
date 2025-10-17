import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import React, { ReactNode, useEffect, useState } from 'react';

interface StripeProviderProps {
  clientSecret: string;
  publishableKey: string;
  children: ReactNode;
}

export const StripeProvider = ({ clientSecret, publishableKey, children }: StripeProviderProps) => {
  console.log('StripeProvider initialized with:', { 
    hasClientSecret: !!clientSecret, 
    hasPublishableKey: !!publishableKey,
    publishableKeyPrefix: publishableKey?.substring(0, 10) 
  });
  
  const [stripePromise] = useState(() => loadStripe(publishableKey));
  
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px',
      fontSizeBase: '16px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': {
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        color: '#1f2937',
        padding: '12px 16px',
        fontSize: '16px',
        lineHeight: '24px',
      },
      '.Input:focus': {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        outline: 'none',
      },
      '.Input::placeholder': {
        color: '#9ca3af',
      },
      '.Label': {
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '6px',
        display: 'block',
      },
      '.Tab': {
        backgroundColor: '#f9fafb',
        border: '1px solid #d1d5db',
        color: '#6b7280',
        padding: '12px 16px',
        borderRadius: '8px 8px 0 0',
      },
      '.Tab:hover': {
        backgroundColor: '#f3f4f6',
        color: '#374151',
      },
      '.Tab--selected': {
        backgroundColor: '#ffffff',
        borderBottomColor: '#ffffff',
        color: '#1f2937',
        fontWeight: '500',
      },
      '.TabIcon': {
        fill: 'currentColor',
      }
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      {children}
    </Elements>
  );
};