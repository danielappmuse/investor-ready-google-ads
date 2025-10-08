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
  return <section id="get-started" className="min-h-screen flex items-center pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      {/* Floating Stats */}
      <FloatingStats />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 relative z-10">
        {currentView === 'products' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Hero Content & Form */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in-up">
              {/* Hero Content */}
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-white animate-pulse-glow">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-yellow-400 animate-float flex-shrink-0" />
                  <span className="hidden sm:inline">YC-Level Backing. Investor-Ready Results.</span>
                  <span className="sm:hidden">Get Investor-Ready</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight animate-fade-in stagger-1">
                  From Startup to <span className="gradient-text relative">
                    Investment-Ready
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse-glow" />
                  </span>
                  <br />
                  in 90 Days or Less
                </h1>
                
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed animate-fade-in stagger-2 max-w-2xl">
                  AI made ideas cheap. Every week, investors see a thousand "next big things", and fund almost none.<br className="hidden sm:block" />
                  <span className="block sm:inline">Because now, they only back founders who've already invested in themselves.</span>
                  <br /><br />
                  At StartWise, we give serious founders YC–level backing. <span className="block sm:inline">We bring together <span className="text-primary font-semibold">product strategists, business model experts, pitch coaches,</span> and a network of investors who only listen when your startup looks investor-ready.</span>
                  <br /><br />
                  💼 <span className="block sm:inline">If you're ready, we'll connect you.</span><br />
                  ⚙️ <span className="block sm:inline">If not, we'll make you <span className="text-secondary font-semibold">investment-ready in 90 days or less.</span></span>
                 </p>

                {/* Trust Indicators */}
                
              </div>

            </div>

            {/* Right Column - Product Selection */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-slide-in-right mt-6 xl:mt-0">
              <div className="animate-fade-in stagger-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 text-primary animate-pulse flex-shrink-0" />
                  <span className="hidden sm:inline">Apply for Your Investor-Readiness Review</span>
                  <span className="sm:hidden">Apply Now</span>
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="group p-4 sm:p-6 lg:p-8 border-2 border-white/20 rounded-lg cursor-pointer transition-all duration-500 hover:border-primary hover:bg-primary/10 hover:scale-[1.02] card-glass" onClick={handleValidationStart}>
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:gradient-text transition-all">Investor-Readiness Assessment</h3>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-300 mb-3 sm:mb-4 group-hover:text-white transition-colors">
                      Get interviewed by founders who've raised capital multiple times, worked inside VC firms, and invested in startups like yours. They'll tell you exactly where you stand and what you're missing — straight, no fluff.
                    </p>
                    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                      <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 font-medium">
                        VC-Backed Experts
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400 font-medium">
                        Founder Interviews
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400 font-medium">
                        Real Feedback
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-3 sm:mb-4 font-medium">
                      This isn't for idea-stage dreamers. It's for founders who've already put time, significant capital, and heart into their startup.
                    </p>
                    <Button className="btn-hero w-full group-hover:animate-pulse text-xs sm:text-sm lg:text-base" onClick={handleValidationStart}>
                      <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{
                    background: 'transparent'
                  }} />
                      <span className="hidden sm:inline">Start Your Assessment — No Fluff, Just Facts</span>
                      <span className="sm:hidden">Apply for Review</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Button>
                  </div>
                  
                  <div className="group p-4 sm:p-6 lg:p-8 border-2 border-white/20 rounded-lg transition-all duration-500 hover:border-secondary hover:bg-secondary/10 hover:scale-[1.02] card-glass">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:gradient-text transition-all">90-Day Investment Readiness Program</h3>
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text animate-pulse-glow">Custom Quote</span>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-300 mb-3 sm:mb-4 group-hover:text-white transition-colors">
                      We'll refine your model, perfect your deck, pressure-test your numbers, and shape your story until investors can't look away. Ready to look like you belong in the boardroom?
                    </p>
                    <Button className="btn-secondary w-full group-hover:animate-pulse text-xs sm:text-sm lg:text-base" onClick={() => setCurrentView('prototype-form')}>
                      <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{
                    background: 'transparent'
                  }} />
                      Schedule Strategy Call
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:scale-110 transition-transform flex-shrink-0" />
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