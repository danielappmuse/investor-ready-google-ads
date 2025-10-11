import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvestmentReadinessForm from '@/components/forms/InvestmentReadinessForm';
import CalendlyWidget from '@/components/CalendlyWidget';
import { ContactFormData } from '@/types/form';
import FuturisticBackground from '@/components/tech/FuturisticBackground';
import FloatingStats from '@/components/tech/FloatingStats';
import { useIsSmallScreen } from '@/hooks/use-small-screen';
interface HeroSectionProps {
  startWithPrototype?: boolean;
  onAnimationComplete?: (complete: boolean) => void;
}
const HeroSection = ({
  startWithPrototype = false
}: HeroSectionProps) => {
  const isSmallScreen = useIsSmallScreen();
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
  return <section id="get-started" className="min-h-screen flex items-start sm:items-center pt-[61px] sm:pt-24 lg:pt-28 pb-1 sm:pb-6 lg:pb-8 relative overflow-hidden">
      {/* Futuristic Background */}
      <FuturisticBackground />
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      {/* Floating Stats */}
      <FloatingStats />
      
      <div className="container mx-auto px-4 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 3xl:px-16 relative z-10">
        {currentView === 'products' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-center">
            {/* Hero Content */}
            <div className="space-y-0.5 sm:space-y-3 lg:space-y-4 2xl:space-y-6 3xl:space-y-8 animate-fade-in-up text-center xl:text-left flex flex-col items-center xl:items-start">
              <div className="space-y-0.5 sm:space-y-2 lg:space-y-3 2xl:space-y-4 3xl:space-y-6">
                <div className={`inline-flex items-center justify-center px-3 sm:px-3 2xl:px-4 3xl:px-5 py-1 2xl:py-1.5 3xl:py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white mb-[6px] sm:mb-3 mt-6 sm:mt-8 w-[280px] sm:w-auto`}>
                  <Star className={`${isSmallScreen ? 'w-3 h-3' : 'w-3.5 h-3.5'} 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 mr-1.5 sm:mr-2 text-primary animate-pulse flex-shrink-0`} />
                  <span className="hidden sm:inline whitespace-nowrap">YC-Level Backing. Investor-Ready Results.</span>
                  <span className={`sm:hidden font-bold ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} whitespace-nowrap`}>
                    <span className="text-white">Investor Ready</span> <span className="gradient-text">Under 90 Days</span>
                  </span>
                </div>
                
                
                
                <p className={`${isSmallScreen ? 'text-[13.5px]' : 'text-[16.5px]'} sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl text-gray-300 leading-snug animate-fade-in stagger-2 max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl mt-1.5`}>
                  At StartWise, we turn serious founders into fundable founders <span className="gradient-text font-bold">under 90 days</span> — with <span className="gradient-text font-bold">YC-level business strategy, pitch training, materials creation/improvement and investor access.</span>
                  <span className="block h-2" />
                  ✅ Ready to raise? We'll connect you.
                  <br />
                  ⚙️ Still building? We'll get you ready.
                </p>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div className="space-y-1 sm:space-y-3 lg:space-y-4 2xl:space-y-6 3xl:space-y-8 animate-slide-in-right mt-0.5 xl:mt-0 max-w-lg 2xl:max-w-xl 3xl:max-w-2xl mx-auto xl:mx-0 w-full px-2 flex flex-col items-center xl:items-start">
              <div className="animate-fade-in stagger-4 w-full text-center xl:text-left flex flex-col items-center xl:items-start">
                <div className={`inline-flex items-center justify-center px-3 sm:px-3 2xl:px-4 3xl:px-5 py-1 2xl:py-1.5 3xl:py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white mb-[6px] sm:mb-4 mt-4 sm:mt-6 w-[280px] sm:w-auto`}>
                  <Star className={`${isSmallScreen ? 'w-3 h-3' : 'w-3.5 h-3.5'} 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 mr-1.5 sm:mr-2 text-primary animate-pulse flex-shrink-0`} />
                  <span className="whitespace-nowrap">Ready to Get Started?</span>
                </div>
                <div className="space-y-1 sm:space-y-3 2xl:space-y-4 3xl:space-y-5 mt-[8px]">
                  <div className="group w-full max-w-full overflow-hidden box-border p-3 sm:p-5 lg:p-6 2xl:p-8 3xl:p-10 border-2 border-white/20 rounded-lg card-glass">
                    <div className="mb-2 sm:mb-4 2xl:mb-5 3xl:mb-6">
                      <h3 className={`${isSmallScreen ? 'text-[15.5px]' : 'text-[17.5px]'} sm:text-xl lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white group-hover:gradient-text transition-all leading-tight`}>
                        Investor-Readiness Assessment
                      </h3>
                    </div>
                    <p className={`${isSmallScreen ? 'text-[13px]' : 'text-[15.5px]'} sm:text-[17.5px] 2xl:text-lg 3xl:text-xl text-gray-300 mb-3 sm:mb-6 2xl:mb-7 3xl:mb-8 leading-tight sm:leading-snug`}>Your path to investment starts here. Take a quick quiz, get interviewed by ex-VCs and founders who've raised before multiple times. Pass the interview to get connected, or become investor-ready under 90 days.</p>
                    
                    {/* Urgency Badge */}
                    
                    
                    <Button onClick={() => setCurrentView('prototype-form')} className="btn-hero w-full text-[14px] sm:text-[20px] font-extrabold py-3.5 sm:py-6 rounded-xl animate-cta-pulse group relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-3 leading-tight">
                        <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse flex-shrink-0" />
                        <span className="text-center">Become Investor Ready Under 90 Days</span>
                        <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </span>
                    </Button>
                    
                    {/* Social Proof Below Button */}
                    <div className="mt-2 sm:mt-3 text-center">
                      
                    </div>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-nowrap gap-1 sm:gap-2 mt-4 sm:mt-6 justify-center xl:justify-start">
                    <div className={`inline-flex items-center px-1.5 sm:px-2.5 2xl:px-3 3xl:px-3.5 py-0.5 sm:py-1.5 2xl:py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-[9px] xs:text-[10px] min-[450px]:text-xs sm:text-sm 2xl:text-base 3xl:text-lg font-medium text-blue-300 whitespace-nowrap`}>
                      <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                      NDA Protected
                    </div>
                    <div className={`inline-flex items-center px-1.5 sm:px-2.5 2xl:px-3 3xl:px-3.5 py-0.5 sm:py-1.5 2xl:py-2 bg-green-500/20 border border-green-400/30 rounded-full text-[9px] xs:text-[10px] min-[450px]:text-xs sm:text-sm 2xl:text-base 3xl:text-lg font-medium text-green-300 whitespace-nowrap`}>
                      <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                      100% Risk FREE
                    </div>
                    <div className={`inline-flex items-center px-1.5 sm:px-2.5 2xl:px-3 3xl:px-3.5 py-0.5 sm:py-1.5 2xl:py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-[9px] xs:text-[10px] min-[450px]:text-xs sm:text-sm 2xl:text-base 3xl:text-lg font-medium text-purple-300 whitespace-nowrap`}>
                      <Star className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                      YC-Level Backing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {/* As Featured In */}
        {currentView === 'products' && <div className="mt-3.5 sm:mt-12 lg:mt-14 2xl:mt-[18.5rem] 3xl:mt-[23rem] animate-fade-in stagger-5">
            <div className="text-center mb-6 sm:mb-10 2xl:mb-12 3xl:mb-14">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className={`inline-flex items-center justify-center px-3 sm:px-3 2xl:px-4 3xl:px-5 py-1 2xl:py-1.5 3xl:py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white w-[280px] sm:w-auto`}>
                  <Star className={`${isSmallScreen ? 'w-3 h-3' : 'w-3.5 h-3.5'} 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 mr-1.5 sm:mr-2 text-primary animate-pulse flex-shrink-0`} />
                  <span className="whitespace-nowrap">As Featured In</span>
                </div>
              </div>
              <p className={`${isSmallScreen ? 'text-[11px]' : 'text-sm'} sm:text-[1.3rem] 2xl:text-[1.4375rem] 3xl:text-[1.725rem] text-gray-400`}>Recognized by leading media and financial publications</p>
            </div>
            <div className="flex justify-center mt-4 sm:mt-6">
              <div className="overflow-hidden max-w-[69rem] w-full">
                <div className="flex animate-scroll-smooth" style={{
              width: 'calc(200% + 2.3rem)',
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
              }].map((logo, index) => <div key={`first-${index}`} className="flex-shrink-0 flex items-center justify-center mx-5 sm:mx-12 transition-all duration-300 w-[9.5rem] sm:w-[17.25rem]">
                      <img src={logo.src} alt={logo.alt} className={`h-[5.45rem] sm:h-[12.4rem] 2xl:h-[13.915rem] 3xl:h-[15.31rem] w-auto object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-75 contrast-100' : logo.alt === 'Forbes' ? 'brightness-150 contrast-50' : 'brightness-200 contrast-90'}`} />
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
              }].map((logo, index) => <div key={`second-${index}`} className="flex-shrink-0 flex items-center justify-center mx-5 sm:mx-12 transition-all duration-300 w-[9.5rem] sm:w-[17.25rem]">
                      <img src={logo.src} alt={logo.alt} className={`h-[5.45rem] sm:h-[12.4rem] 2xl:h-[13.915rem] 3xl:h-[15.31rem] w-auto object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-75 contrast-100' : logo.alt === 'Forbes' ? 'brightness-150 contrast-50' : 'brightness-200 contrast-90'}`} />
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