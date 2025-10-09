import React, { useState } from 'react';
import { Phone, Calendar, Star, CheckCircle, ArrowRight, Sparkles, MessageCircle, Zap, TrendingUp, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs';
import EnhancedMultiStepForm from '@/components/forms/EnhancedMultiStepForm';
import ValidationOnboarding from '@/components/forms/ValidationOnboarding';
import ValidationPayment from '@/components/forms/ValidationPayment';
import CalendlyWidget from '@/components/CalendlyWidget';
import ChatAgent from '@/components/ChatAgent';
import OpenAIVoiceAgent from '@/components/OpenAIVoiceAgent';
import ElevenLabsVoiceAgent from '@/components/ElevenLabsVoiceAgent';
import VoiceAgentWrapper from '@/components/VoiceAgentWrapper';
import { ContactFormData } from '@/types/form';
import { ValidationOnboardingData } from '@/components/forms/ValidationOnboarding';
import AnimatedBackground from '@/components/tech/AnimatedBackground';
import DataVisualization from '@/components/tech/DataVisualization';
import TechElements from '@/components/tech/TechElements';
import FloatingStats from '@/components/tech/FloatingStats';
import { supabase } from '@/integrations/supabase/client';
import ErrorBoundary from '@/components/ErrorBoundary';
interface HeroSectionProps {
  startWithValidation?: boolean
  startWithPrototype?: boolean
  onValidationComplete?: () => void
}

const HeroSection = ({ startWithValidation = false, startWithPrototype = false, onValidationComplete }: HeroSectionProps) => {
  const [currentView, setCurrentView] = useState<'products' | 'validation-onboarding' | 'validation-payment' | 'prototype-form' | 'calendly' | 'success'>(
    startWithValidation ? 'validation-onboarding' : startWithPrototype ? 'prototype-form' : 'products'
  );

  // Update view when props change
  React.useEffect(() => {
    if (startWithValidation) {
      setCurrentView('validation-onboarding')
    } else if (startWithPrototype) {
      setCurrentView('prototype-form')
    }
  }, [startWithValidation, startWithPrototype])
  const [formData, setFormData] = useState<ContactFormData | null>(null);
  const [validationData, setValidationData] = useState<ValidationOnboardingData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const handlePrototypeFormSuccess = (data: ContactFormData) => {
    setFormData(data);
    setCurrentView('calendly');
  };
  const handleValidationStart = () => {
    setCurrentView('validation-onboarding');
  };
  const handleValidationOnboardingComplete = (data: ValidationOnboardingData) => {
    console.log('HeroSection: Validation onboarding complete - moving to payment');
    setValidationData(data);
    setCurrentView('validation-payment');
  };
  const handleValidationPaymentBack = () => {
    console.log('HeroSection: ValidationPayment back button clicked - clearing validation data and returning to questions');
    setValidationData(null); // Clear validation data to prevent auto-progression
    setCurrentView('validation-onboarding');
  };
  const handleValidationPaymentSuccess = () => {
    setCurrentView('success');
  };
  const handleBackToProducts = () => {
    console.log('HeroSection: Back to products clicked');
    setCurrentView('products');
  };
  const openAICall = async () => {
    try {
      // First, try to get AI voice greeting
      const {
        data,
        error
      } = await supabase.functions.invoke('voice-agent', {
        body: {
          voice: 'alloy'
        }
      });
      if (data && data.audioContent) {
        // Play the AI voice greeting
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audio.play().catch(console.error);

        // Show a message about the AI call capability
        alert('🎉 AI Voice Agent is ready! In a production environment, this would initiate a full voice conversation. For now, you can call us directly at +1 (616) 896-2290');
      }
    } catch (error) {
      console.error('Voice agent error:', error);
    }

    // Fallback to phone call
    window.open('tel:+16168962290', '_self');
  };
  return <section id="get-started" className="min-h-screen flex items-center pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-12 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      {/* Floating Stats */}
      <FloatingStats />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 relative z-10">
        {currentView === 'products' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* Hero Content & Form */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-5 animate-fade-in-up">
              {/* Hero Content */}
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs font-medium text-white animate-pulse-glow">
                  <Star className="w-3 h-3 mr-1.5 text-yellow-400 animate-float flex-shrink-0" />
                  <span className="hidden sm:inline">YC-Level Backing. Investor-Ready Results.</span>
                  <span className="sm:hidden">Get Investor-Ready</span>
                </div>
                
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight animate-fade-in stagger-1">
                  From Startup to <span className="gradient-text relative">
                    Investment-Ready
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse-glow" />
                  </span>
                  <br />
                  in 90 Days or Less
                </h1>
                
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed animate-fade-in stagger-2 max-w-2xl">
                  AI made ideas cheap. Investors see thousands of "next big things" weekly, and fund almost none—because they only back founders who've invested in themselves.
                  <br /><br />
                  At StartWise, we give serious founders YC-level backing with <span className="text-primary font-semibold">product strategists, business model experts, pitch coaches,</span> and investors who only listen when you look investor-ready.
                  <br /><br />
                  💼 Ready? We'll connect you. ⚙️ Not yet? We'll make you <span className="text-secondary font-semibold">investment-ready in 90 days.</span>
                 </p>

                 {/* Trust Indicators */}
                 
               </div>

               {/* As Featured In */}
               <div className="mt-8 pt-6 border-t border-white/10">
                 <p className="text-xs text-gray-400 mb-4 text-center">As Featured In</p>
                 <div className="flex justify-center">
                   <div className="overflow-hidden max-w-3xl w-full">
                     <div 
                       className="flex animate-scroll-smooth"
                       style={{ 
                         width: 'calc(200% + 2rem)',
                         transform: 'translateZ(0)',
                         backfaceVisibility: 'hidden',
                         perspective: '1000px'
                       }}
                     >
                       {/* First set of media logos */}
                       {[
                         { src: '/media-logos/business-insider.png', alt: 'Business Insider' },
                         { src: '/media-logos/forbes.png', alt: 'Forbes' },
                         { src: '/media-logos/yahoo-finance.png', alt: 'Yahoo Finance' },
                         { src: '/media-logos/globe-and-mail.png?v=5', alt: 'The Globe and Mail' },
                         { src: '/media-logos/benzinga.png', alt: 'Benzinga' },
                         { src: '/media-logos/barchart.png', alt: 'Barchart' }
                       ].map((logo, index) => (
                         <div
                           key={`first-${index}`}
                           className="flex-shrink-0 flex items-center justify-center mx-4 transition-all duration-300 w-24"
                         >
                           <img
                             src={logo.src}
                             alt={logo.alt}
                             className={`h-16 w-auto object-contain grayscale opacity-60 hover:opacity-80 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-50 contrast-100' : logo.alt === 'Forbes' ? 'brightness-130 contrast-30' : 'brightness-150 contrast-75'}`}
                           />
                         </div>
                       ))}
                       {/* Duplicate set for seamless infinite scroll */}
                       {[
                         { src: '/media-logos/business-insider.png', alt: 'Business Insider' },
                         { src: '/media-logos/forbes.png', alt: 'Forbes' },
                         { src: '/media-logos/yahoo-finance.png', alt: 'Yahoo Finance' },
                         { src: '/media-logos/globe-and-mail.png?v=5', alt: 'The Globe and Mail' },
                         { src: '/media-logos/benzinga.png', alt: 'Benzinga' },
                         { src: '/media-logos/barchart.png', alt: 'Barchart' }
                       ].map((logo, index) => (
                         <div
                           key={`second-${index}`}
                           className="flex-shrink-0 flex items-center justify-center mx-4 transition-all duration-300 w-24"
                         >
                           <img
                             src={logo.src}
                             alt={logo.alt}
                             className={`h-16 w-auto object-contain grayscale opacity-60 hover:opacity-80 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-50 contrast-100' : logo.alt === 'Forbes' ? 'brightness-130 contrast-30' : 'brightness-150 contrast-75'}`}
                           />
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

             </div>

            {/* Right Column - Product Selection */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-5 animate-slide-in-right mt-4 xl:mt-0">
              <div className="animate-fade-in stagger-4">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 flex items-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary animate-pulse flex-shrink-0" />
                  <span className="hidden sm:inline">Apply for Your Investor-Readiness Review</span>
                  <span className="sm:hidden">Apply Now</span>
                </h2>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="group p-4 sm:p-6 lg:p-8 border-2 border-white/20 rounded-lg cursor-pointer transition-all duration-500 hover:border-primary hover:bg-primary/10 hover:scale-[1.02] card-glass flex flex-col justify-between min-h-[400px]" onClick={handleValidationStart}>
                    <div>
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:gradient-text transition-all">Investor-Readiness Assessment</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 group-hover:text-white transition-colors">
                        Get interviewed by founders who've raised capital multiple times and worked inside VC firms. They'll tell you where you stand—no fluff.
                      </p>
                      
                      {/* Trust Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                        <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 font-medium">
                          VC-Backed
                        </span>
                        <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400 font-medium">
                          Founder Interviews
                        </span>
                        <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400 font-medium">
                          Real Feedback
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-400 mb-4 sm:mb-6 font-medium">
                        For founders who've put time, capital, and heart into their startup.
                      </p>
                    </div>
                    
                    <Button className="btn-hero w-full group-hover:animate-pulse text-xs sm:text-sm" onClick={handleValidationStart}>
                      <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-3 h-3 mr-2 filter drop-shadow-sm flex-shrink-0" style={{
                    background: 'transparent'
                  }} />
                      <span className="hidden sm:inline">Start Assessment</span>
                      <span className="sm:hidden">Apply</span>
                      <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Data Visualization - Hidden on Mobile */}
              <div className="hidden lg:block">
                <DataVisualization />
              </div>
              
              {/* Tech Elements - Hidden on Mobile */}
              <div className="hidden lg:block">
                <TechElements />
              </div>
            </div>
          </div>}

        {currentView === 'validation-onboarding' && <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Investor-Readiness Assessment
              </h2>
              <p className="text-gray-300">
                Tell us about your startup so our expert founders can assess where you stand and what you need to become investment-ready
              </p>
            </div>
            
            <ValidationOnboarding 
              onComplete={handleValidationOnboardingComplete} 
              onBack={handleBackToProducts}
            />
          </div>}

        {currentView === 'validation-payment' && validationData && <div className="max-w-6xl mx-auto">
            <ValidationPayment 
              onboardingData={validationData} 
              onBack={() => {
                console.log('HeroSection: ValidationPayment onBack prop called');
                handleValidationPaymentBack();
              }} 
              onSuccess={handleValidationPaymentSuccess} 
            />
          </div>}

        {currentView === 'prototype-form' && <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                90-Day Investment Readiness Program
              </h2>
              <p className="text-gray-300">
                Tell us about your startup and we'll schedule a strategy call to discuss how we'll make you investor-ready
              </p>
            </div>
            
            <EnhancedMultiStepForm onSuccess={handlePrototypeFormSuccess} formLocation="top" onBack={handleBackToProducts} />
          </div>}

        {currentView === 'calendly' && <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm font-medium text-green-400 mb-4">
                <CheckCircle className="w-4 h-4 mr-2" />
                Form Submitted Successfully!
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Schedule Your Free Consultation
              </h2>
              <p className="text-gray-300">
                Thank you {formData?.full_name}! Now let's schedule a time to discuss your startup and get you started with the right product.
              </p>
            </div>
            
            <CalendlyWidget formData={formData!} />
          </div>}

        {currentView === 'success' && <div className="max-w-4xl mx-auto text-center">
            <div className="card-glass p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Assessment Confirmed!
              </h2>
              
              <p className="text-gray-300 text-lg mb-6">
                Thank you for applying! Our team of VC-backed founders and investors will review your startup and contact you within 48 hours to schedule your investor-readiness interview.
              </p>
              
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Confirmation email sent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Expert review in progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Interview to be scheduled</span>
                </div>
              </div>
              
              <Button onClick={handleBackToProducts} className="btn-secondary mt-8">
                Return to Homepage
              </Button>
            </div>
          </div>}
      </div>
    </section>;
};
export default HeroSection;