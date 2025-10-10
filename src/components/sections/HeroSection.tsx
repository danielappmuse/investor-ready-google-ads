import React, { useState } from 'react';
import { Phone, Calendar, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvestmentReadinessForm from '@/components/forms/InvestmentReadinessForm';
import CalendlyWidget from '@/components/CalendlyWidget';
import { ContactFormData } from '@/types/form';
import AnimatedBackground from '@/components/tech/AnimatedBackground';
import FloatingStats from '@/components/tech/FloatingStats';
interface HeroSectionProps {
  startWithPrototype?: boolean;
}
const HeroSection = ({
  startWithPrototype = false
}: HeroSectionProps) => {
  const [currentView, setCurrentView] = useState<'products' | 'prototype-form' | 'calendly'>(startWithPrototype ? 'prototype-form' : 'products');
  React.useEffect(() => {
    if (startWithPrototype) {
      setCurrentView('prototype-form');
    }
  }, [startWithPrototype]);
  const [formData, setFormData] = useState<ContactFormData | null>(null);
  const handlePrototypeFormSuccess = (data: ContactFormData) => {
    setFormData(data);
    setCurrentView('calendly');
  };
  const handleBackToProducts = () => {
    setCurrentView('products');
  };
  return <section id="get-started" className="min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 lg:pb-8 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      {/* Floating Stats */}
      <FloatingStats />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 relative z-10">
        {currentView === 'products' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-center">
            {/* Hero Content */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 animate-fade-in-up">
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs font-medium text-white animate-pulse-glow">
                  <Star className="w-3 h-3 mr-1.5 text-yellow-400 animate-float flex-shrink-0" />
                  <span className="hidden sm:inline">YC-Level Backing. Investor-Ready Results.</span>
                  <span className="sm:hidden">Get Investor-Ready</span>
                </div>
                
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight animate-fade-in stagger-1">
                  From Idea to <span className="gradient-text relative">
                    Investment-Ready
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse-glow" />
                  </span>
                  <br />
                  in 90 Days or Less
                </h1>
                
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed animate-fade-in stagger-2 max-w-2xl">
                  AI made it easy to build ideas — and even easier to ignore them. Top investors back founders who are prepared, polished, and investor-ready.
                  <br /><br />
                  At StartWise, we turn serious founders into fundable founders in 90 days — with <span className="text-primary font-semibold">YC-level strategy, pitch training, and direct investor access.</span>
                  <br /><br />
                  ✅ Ready to raise? We'll connect you.
                  <br />
                  ⚙️ Still building? We'll get you ready.
                </p>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 animate-slide-in-right mt-3 xl:mt-0 max-w-lg mx-auto xl:mx-0">
              <div className="animate-fade-in stagger-4">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse flex-shrink-0" />
                  <span>Ready to Get Started?</span>
                </h2>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="group p-4 sm:p-5 lg:p-6 border-2 border-white/20 rounded-lg card-glass">
                    <div className="mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:gradient-text transition-all">
                        Investor-Readiness Assessment
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                      Get interviewed by founders who've raised capital multiple times and worked inside VC firms. They'll tell you where you stand—no fluff.
                    </p>
                    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                      <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-sm text-green-400 font-medium">
                        VC-Backed
                      </span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-sm text-blue-400 font-medium">
                        Founder Interviews
                      </span>
                      <span className="px-1.5 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-sm text-purple-400 font-medium">
                        Real Feedback
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4 sm:mb-6 font-medium">
                      Start the assessment, and estimate how close you are to investment
                    </p>
                    
                    <Button 
                      onClick={() => setCurrentView('prototype-form')}
                      className="btn-hero w-full text-xs sm:text-sm"
                    >
                      <span>Start Assessment Now & Become Investor Ready In 90 Days!</span>
                      <ArrowRight className="w-3 h-3 ml-2 flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {/* As Featured In */}
        {currentView === 'products' && <div className="mt-6 sm:mt-8 lg:mt-10 animate-fade-in stagger-5">
            <div className="text-center mb-4">
              <p className="text-lg sm:text-xl font-bold text-white">As Featured In</p>
              <p className="text-xs sm:text-sm text-gray-400">Recognized by leading media and financial publications</p>
            </div>
            <div className="flex justify-center">
              <div className="overflow-hidden max-w-5xl w-full">
                <div className="flex animate-scroll-smooth" style={{
              width: 'calc(200% + 2rem)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}>
                  {[{
                src: '/media-logos/business-insider.png',
                alt: 'Business Insider'
              }, {
                src: '/media-logos/forbes.png',
                alt: 'Forbes'
              }, {
                src: '/media-logos/yahoo-finance.png',
                alt: 'Yahoo Finance'
              }, {
                src: '/media-logos/globe-and-mail.png?v=5',
                alt: 'The Globe and Mail'
              }, {
                src: '/media-logos/benzinga.png',
                alt: 'Benzinga'
              }, {
                src: '/media-logos/barchart.png',
                alt: 'Barchart'
              }].map((logo, index) => <div key={`first-${index}`} className="flex-shrink-0 flex items-center justify-center mx-6 sm:mx-8 transition-all duration-300 w-32 sm:w-40">
                      <img src={logo.src} alt={logo.alt} className={`h-20 sm:h-24 w-auto object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-75 contrast-100' : logo.alt === 'Forbes' ? 'brightness-150 contrast-50' : 'brightness-200 contrast-90'}`} />
                    </div>)}
                  {[{
                src: '/media-logos/business-insider.png',
                alt: 'Business Insider'
              }, {
                src: '/media-logos/forbes.png',
                alt: 'Forbes'
              }, {
                src: '/media-logos/yahoo-finance.png',
                alt: 'Yahoo Finance'
              }, {
                src: '/media-logos/globe-and-mail.png?v=5',
                alt: 'The Globe and Mail'
              }, {
                src: '/media-logos/benzinga.png',
                alt: 'Benzinga'
              }, {
                src: '/media-logos/barchart.png',
                alt: 'Barchart'
              }].map((logo, index) => <div key={`second-${index}`} className="flex-shrink-0 flex items-center justify-center mx-6 sm:mx-8 transition-all duration-300 w-32 sm:w-40">
                      <img src={logo.src} alt={logo.alt} className={`h-20 sm:h-24 w-auto object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-75 contrast-100' : logo.alt === 'Forbes' ? 'brightness-150 contrast-50' : 'brightness-200 contrast-90'}`} />
                    </div>)}
                </div>
              </div>
            </div>
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
            
            <InvestmentReadinessForm onSuccess={handlePrototypeFormSuccess} formLocation="top" onBack={handleBackToProducts} />
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
      </div>
    </section>;
};
export default HeroSection;