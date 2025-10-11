import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Shield, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvestmentReadinessForm from '@/components/forms/InvestmentReadinessForm';
import CalendlyWidget from '@/components/CalendlyWidget';
import { ContactFormData } from '@/types/form';
import FuturisticBackground from '@/components/tech/FuturisticBackground';

interface HeroSectionCROProps {
  startWithPrototype?: boolean;
}

const HeroSectionCRO = ({ startWithPrototype = false }: HeroSectionCROProps) => {
  const [currentView, setCurrentView] = useState<'hero' | 'form' | 'calendly'>(
    startWithPrototype ? 'form' : 'hero'
  );
  const [formData, setFormData] = useState<ContactFormData | null>(null);

  const handleFormSuccess = (data: ContactFormData) => {
    setFormData(data);
    setCurrentView('calendly');
  };

  const handleBackToHero = () => {
    setCurrentView('hero');
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
      <FuturisticBackground />
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        {currentView === 'hero' && (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              From Startup Idea to{' '}
              <span className="gradient-text">Funded in 90 Days</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl lg:text-2xl text-gray-300 font-medium max-w-3xl mx-auto">
              YC-level strategy, pitch training, and direct investor connections
            </p>

            {/* Three Bullet Points */}
            <div className="space-y-4 max-w-2xl mx-auto text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg lg:text-xl text-white">
                  Get assessed by ex-VCs and funded founders
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg lg:text-xl text-white">
                  Investor-ready pitch deck, financials, and materials
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg lg:text-xl text-white">
                  Direct introductions to our investor network
                </p>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => setCurrentView('form')}
                className="h-16 px-12 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-xl group w-full max-w-md mx-auto shadow-2xl"
              >
                <span className="flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Start Free Assessment
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>

              {/* Micro-copy */}
              <p className="text-sm text-gray-400">
                Takes 3 minutes • No credit card • 100% confidential
              </p>
            </div>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-medium text-blue-300">
                <Shield className="w-4 h-4 mr-2" />
                NDA Protected
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-sm font-medium text-green-300">
                <CheckCircle className="w-4 h-4 mr-2" />
                100% Risk FREE
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm font-medium text-purple-300">
                <Star className="w-4 h-4 mr-2" />
                YC-Level Backing
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary">
                <CheckCircle className="w-4 h-4 mr-2" />
                500+ Founders Backed
              </div>
            </div>

            {/* Media Logos Section - Simplified */}
            <div className="pt-12">
              <p className="text-base sm:text-lg font-semibold text-white mb-6">
                As Featured In
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
                <img
                  src="/media-logos/forbes.png"
                  alt="Forbes"
                  className="h-8 sm:h-10 w-auto object-contain grayscale brightness-150"
                />
                <img
                  src="/media-logos/business-insider.png"
                  alt="Business Insider"
                  className="h-8 sm:h-10 w-auto object-contain grayscale brightness-200"
                />
                <img
                  src="/media-logos/yahoo-finance.png"
                  alt="Yahoo Finance"
                  className="h-8 sm:h-10 w-auto object-contain grayscale brightness-200"
                />
                <img
                  src="/media-logos/globe-and-mail.png"
                  alt="The Globe and Mail"
                  className="h-8 sm:h-10 w-auto object-contain grayscale brightness-75"
                />
              </div>
            </div>
          </div>
        )}

        {currentView === 'form' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                90-Day Investment Readiness Program
              </h2>
              <p className="text-gray-300">
                Tell us about your startup and we'll schedule a strategy call
              </p>
            </div>
            
            <InvestmentReadinessForm 
              onSuccess={handleFormSuccess} 
              formLocation="top" 
              onBack={handleBackToHero} 
            />
          </div>
        )}

        {currentView === 'calendly' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm font-medium text-green-400 mb-4">
                <CheckCircle className="w-4 h-4 mr-2" />
                Form Submitted Successfully!
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Schedule Your Free Consultation
              </h2>
              <p className="text-gray-300">
                Thank you {formData?.full_name}! Now let's schedule a time to discuss your startup.
              </p>
            </div>
            
            <CalendlyWidget formData={formData!} />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSectionCRO;
