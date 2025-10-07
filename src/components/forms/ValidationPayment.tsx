import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Phone, Mail, ArrowLeft, Zap, FileText, Calendar, AlertCircle } from 'lucide-react';
import type { ValidationOnboardingData } from './ValidationOnboarding';
import MultiMethodCheckout from '@/components/stripe/MultiMethodCheckout';

interface ValidationPaymentProps {
  onboardingData: ValidationOnboardingData;
  onBack?: () => void;
  onSuccess: () => void;
}

const ValidationPayment: React.FC<ValidationPaymentProps> = ({ onboardingData, onBack, onSuccess }) => {
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    console.log('Back button clicked');
    if (onBack && typeof onBack === 'function') {
      console.log('Calling onBack function');
      onBack();
    } else {
      console.log('Using browser history to go back');
      window.history.back();
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment error:', errorMessage);
    setError(errorMessage);
  };

  const handlePaymentSuccess = () => {
    setError(null);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        
        {/* Left Column - What You Get */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader className="pb-4 sm:pb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              What's Included
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-muted-foreground">
              Everything you need to validate your startup idea
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Complete Feasibility Analysis</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Detailed market research, competitive analysis, and financial projections</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Go/No-Go Recommendation</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Clear verdict with detailed reasoning and risk assessment</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">1-Hour Strategy Session</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Personal consultation with experienced entrepreneurs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Next Steps Roadmap</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">Actionable plan for your startup journey</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-foreground">Total Investment</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">One-time payment • Risk free, money back guarantee if no results</p>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary">$78</div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-base sm:text-lg font-semibold text-foreground">Your Information</h4>
              <div className="p-3 sm:p-4 bg-muted/30 rounded-xl border border-border/50 space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-medium break-all">{onboardingData.email}</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-medium">{onboardingData.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-muted/20 rounded-lg">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">Report delivered within 48 hours</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-muted/20 rounded-lg">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">Strategy session scheduled within 48 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Payment */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Complete Your Order
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">
                Secure payment powered by Stripe
              </CardDescription>
            </CardHeader>

            <CardContent>
              <MultiMethodCheckout
                onboardingData={onboardingData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base text-destructive font-medium">Payment Error</p>
                  <p className="text-xs sm:text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationPayment;