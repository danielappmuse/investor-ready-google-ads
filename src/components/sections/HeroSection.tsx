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
                  <span className="hidden sm:inline">Two Products. One Mission. Your Success.</span>
                  <span className="sm:hidden">Your Success Starts Here</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight animate-fade-in stagger-1">
                  Validate & Build Your <span className="gradient-text relative">
                    Startup
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse-glow" />
                  </span>
                  <br />
                  The Right Way
                </h1>
                
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed animate-fade-in stagger-2 max-w-2xl">
                  Got an idea? Let's see if it's got legs.<br className="hidden sm:block" />
                  <span className="block sm:inline">Start with our <span className="text-primary font-semibold">Validation Exam</span> — it's like a vibe check, but for startups.</span><br className="hidden sm:block" />
                  <span className="block sm:inline">Pass? Sweet. Time to build with our <span className="text-secondary font-semibold">Prototype Package</span> — fast, focused, and founder-friendly.</span>
                  <br />
                  🔬 <span className="text-primary font-semibold">MIT backs this up:</span> <span className="block sm:inline">In a study of 652 ventures, better‑rated ideas had way higher odds of success and funding — sometimes just from the pitch.</span>
                  <br />
                   🚀 <span className="block sm:inline">Complete both steps and you're in: pitch to our <span className="text-secondary font-semibold">investor network</span> this December.</span>
                 </p>

                {/* Trust Indicators */}
                
              </div>

              {/* Product Selection */}
              <div className="animate-fade-in stagger-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 text-primary animate-pulse flex-shrink-0" />
                  <span className="hidden sm:inline">Choose Your Product & Get Started</span>
                  <span className="sm:hidden">Get Started</span>
                </h2>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="group p-4 sm:p-6 lg:p-8 border-2 border-white/20 rounded-lg cursor-pointer transition-all duration-500 hover:border-primary hover:bg-primary/10 hover:scale-[1.02] card-glass" onClick={handleValidationStart}>
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:gradient-text transition-all">Startup Validation Exam</h3>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-300 mb-3 sm:mb-4 group-hover:text-white transition-colors">
                      AI-powered feasibility analysis and market validation report + strategy session with experienced entrepreneurs and business analysts
                    </p>
                    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                      <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 font-medium">
                        NDA Protected
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400 font-medium">
                        100% Confidential
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400 font-medium">
                        Secure Ideas
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-3 sm:mb-4 font-medium">
                      Not working out? Full refund. Zero risk.
                    </p>
                    <Button className="btn-hero w-full group-hover:animate-pulse text-xs sm:text-sm lg:text-base" onClick={handleValidationStart}>
                      <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{
                    background: 'transparent'
                  }} />
                      <span className="hidden sm:inline">Perfect first step to validate your idea & save money</span>
                      <span className="sm:hidden">Validate Your Idea</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </Button>
                  </div>
                  
                  <div className="group p-4 sm:p-6 lg:p-8 border-2 border-white/20 rounded-lg transition-all duration-500 hover:border-secondary hover:bg-secondary/10 hover:scale-[1.02] card-glass">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:gradient-text transition-all">Prototype + PRD Package</h3>
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text animate-pulse-glow">from $10k</span>
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-300 mb-3 sm:mb-4 group-hover:text-white transition-colors">
                      Full prototype development with detailed product requirements document
                    </p>
                    <Button className="btn-secondary w-full group-hover:animate-pulse text-xs sm:text-sm lg:text-base" onClick={() => setCurrentView('prototype-form')}>
                      <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{
                    background: 'transparent'
                  }} />
                      Schedule Consultation
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:scale-110 transition-transform flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - AI Agent Options */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-slide-in-right mt-6 xl:mt-0">
              <div className="card-glass p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="text-center mb-3 sm:mb-4 md:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                    Connect with Our AI Agent
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 px-2">
                    Get instant answers about your project and connect with specialists
                  </p>
                </div>

                <ErrorBoundary fallback={
                  <div className="p-3 sm:p-4 bg-card/20 rounded-lg border border-border/50">
                    <p className="text-center text-gray-300 text-xs sm:text-sm">Chat interface temporarily unavailable. Please contact us directly.</p>
                  </div>
                }>
                  <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 md:mb-6 h-9 sm:h-10 md:h-12 bg-white/5 backdrop-blur-sm">
                      <TabsTrigger 
                        value="chat" 
                        className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-white transition-all duration-300 rounded-md"
                      >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden xs:inline sm:hidden md:inline">Chat Agent</span>
                        <span className="xs:hidden sm:inline md:hidden">Chat</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="call" 
                        className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 data-[state=active]:text-white transition-all duration-300 rounded-md"
                      >
                        <Mic className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden xs:inline sm:hidden md:inline">Voice Agent</span>
                        <span className="xs:hidden sm:inline md:hidden">Voice</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="chat" className="mt-0 focus:outline-none">
                      <div className="h-[300px] xs:h-[320px] sm:h-[340px] md:h-[380px] lg:h-[420px] xl:h-[450px] overflow-hidden rounded-lg">
                        <ChatAgent />
                      </div>
                    </TabsContent>

                    <TabsContent 
                      value="call" 
                      className="flex justify-center items-center h-[300px] xs:h-[320px] sm:h-[340px] md:h-[380px] lg:h-[420px] xl:h-[450px] mt-0 focus:outline-none bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-white/10"
                    >
                      <VoiceAgentWrapper />
                    </TabsContent>
                  </Tabs>
                </ErrorBoundary>
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
                Startup Validation Assessment
              </h2>
              <p className="text-gray-300">
                Help us understand your idea so we can provide the most comprehensive validation report
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
                Prototype Development Consultation
              </h2>
              <p className="text-gray-300">
                Tell us about your project and we'll schedule a consultation to discuss your prototype development
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
                Payment Successful!
              </h2>
              
              <p className="text-gray-300 text-lg mb-6">
                Thank you for your purchase! You'll receive your validation report within 48 hours, and we'll contact you within 24 hours to schedule your strategy session with our experienced entrepreneurs and business analysts.
              </p>
              
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Payment confirmation email sent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Validation report in progress</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">Strategy session to be scheduled</span>
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