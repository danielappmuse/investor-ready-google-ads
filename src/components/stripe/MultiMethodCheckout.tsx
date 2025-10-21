import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Building2, Banknote, ShoppingCart, Timer, Apple, Chrome, Zap } from 'lucide-react';
import type { ValidationOnboardingData } from '@/types/validation';
import EmbeddedStripeCheckout from './EmbeddedStripeCheckout';

interface PaymentMethodOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  type: string;
}

const paymentMethods: PaymentMethodOption[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Visa, Mastercard, American Express',
    type: 'card'
  },
  {
    id: 'link',
    name: 'Link',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Pay with Link for faster checkout',
    type: 'link'
  },
  {
    id: 'us_bank_account',
    name: 'Bank Account',
    icon: <Building2 className="h-5 w-5" />,
    description: 'Direct bank transfer (ACH)',
    type: 'us_bank_account'
  },
  {
    id: 'cashapp',
    name: 'Cash App Pay',
    icon: <Banknote className="h-5 w-5" />,
    description: 'Pay with Cash App',
    type: 'cashapp'
  },
  {
    id: 'affirm',
    name: 'Affirm',
    icon: <Timer className="h-5 w-5" />,
    description: 'Buy now, pay later',
    type: 'affirm'
  },
  {
    id: 'klarna',
    name: 'Klarna',
    icon: <ShoppingCart className="h-5 w-5" />,
    description: 'Flexible payment options',
    type: 'klarna'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: <Apple className="h-5 w-5" />,
    description: 'Quick and secure payment',
    type: 'apple_pay'
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    icon: <Chrome className="h-5 w-5" />,
    description: 'Fast and easy checkout',
    type: 'google_pay'
  }
];

interface MultiMethodCheckoutProps {
  onboardingData: ValidationOnboardingData;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const MultiMethodCheckout: React.FC<MultiMethodCheckoutProps> = ({
  onboardingData,
  onSuccess,
  onError
}) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  console.log('🚀 MultiMethodCheckout - Component mounted with data:', onboardingData);

  const handleStartPayment = () => {
    console.log('🛒 Opening embedded Stripe checkout...');
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    console.log('❌ Closing embedded checkout');
    setIsCheckoutOpen(false);
  };

  const handlePaymentSuccess = () => {
    console.log('✅ Payment completed successfully');
    setIsCheckoutOpen(false);
    onSuccess();
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('❌ Payment error in MultiMethodCheckout:', errorMessage);
    // Don't close checkout automatically - let the modal handle the error display
    onError(errorMessage);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Payment Summary */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/50">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total Amount</span>
          <span className="text-2xl sm:text-3xl font-bold text-foreground">$78.00</span>
        </div>
        <div className="text-xs text-muted-foreground">One-time payment • Risk free, money back guarantee if no results</div>
      </div>

      {/* Payment Methods Preview */}
      <div className="space-y-3 sm:space-y-4">
        <h4 className="text-sm sm:text-base font-semibold text-foreground">
          Accepted Payment Methods
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {paymentMethods.slice(0, 8).map((method) => (
            <div
              key={method.id}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30"
            >
              <div className="text-primary flex-shrink-0">{method.icon}</div>
              <span className="text-xs sm:text-sm font-medium text-foreground truncate">{method.name}</span>
              {method.id === 'card' && (
                <Badge variant="secondary" className="ml-auto text-[9px] sm:text-[10px] px-1.5 sm:px-2">Popular</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Button
        onClick={handleStartPayment}
        className="w-full h-12 sm:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all px-4 sm:px-6 py-3 sm:py-4"
        size="lg"
      >
        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
        <span className="truncate">Continue to Secure Payment</span>
      </Button>

      {/* Security Features */}
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-muted/20 rounded-lg">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-green-500 text-xs sm:text-sm">🔒</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground">256-bit SSL Encryption</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Your payment is fully secured</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-muted/20 rounded-lg">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-xs sm:text-sm">💳</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground">All Payment Methods</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Apple Pay, Google Pay & more</p>
          </div>
        </div>
      </div>

      {/* Embedded Stripe Checkout Modal */}
      <EmbeddedStripeCheckout
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onboardingData={onboardingData}
      />
    </div>
  );
};

export default MultiMethodCheckout;