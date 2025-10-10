import React, { useState } from 'react';
import { Phone, Calendar, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvestmentReadinessForm from '@/components/forms/InvestmentReadinessForm';
import CalendlyWidget from '@/components/CalendlyWidget';
import { ContactFormData } from '@/types/form';
import AnimatedBackground from '@/components/tech/AnimatedBackground';
import FloatingStats from '@/components/tech/FloatingStats';
import { useIsSmallScreen } from '@/hooks/use-small-screen';
interface HeroSectionProps {
  startWithPrototype?: boolean;
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
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      {/* Floating Stats */}
      <FloatingStats />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 3xl:px-16 relative z-10">
        {currentView === 'products' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-center">
            {/* Hero Content */}
            <div className="space-y-0.5 sm:space-y-3 lg:space-y-4 2xl:space-y-6 3xl:space-y-8 animate-fade-in-up">
              <div className="space-y-0.5 sm:space-y-2 lg:space-y-3 2xl:space-y-4 3xl:space-y-6">
                <div className={`inline-flex items-center px-2 sm:px-3 2xl:px-4 3xl:px-5 py-1 pb-[3px] sm:pb-1 2xl:py-1.5 3xl:py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full ${isSmallScreen ? 'text-[10px]' : 'text-[13px]'} sm:text-xs 2xl:text-sm 3xl:text-base font-medium text-white animate-pulse-glow mb-0.5 mt-1`}>
                  <Star className={`${isSmallScreen ? 'w-2.5 h-2.5' : 'w-3 h-3'} 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5 mr-1.5 text-yellow-400 animate-float flex-shrink-0`} />
                  <span className="hidden sm:inline">YC-Level Backing. Investor-Ready Results.</span>
                  <span className="sm:hidden">Get Investor-Ready</span>
                </div>
                
                <h1 className={`${isSmallScreen ? 'text-[18px]' : 'text-[22px]'} sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-bold text-white leading-tight tracking-tight animate-fade-in stagger-1`}>
                  From Idea to{' '}
                  <span className="gradient-text relative whitespace-nowrap">
                    Investment‑Ready
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 animate-pulse-glow" />
                  </span>
                  <br className="sm:hidden" />
                  <span className="hidden sm:inline"><br /></span>
                  in 90 Days or Less
                </h1>
                
                <p className={`${isSmallScreen ? 'text-[12px]' : 'text-[15px]'} sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl text-gray-300 leading-snug animate-fade-in stagger-2 max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl`}>
                  AI made it easy to build ideas — and even easier to ignore them. Top investors back founders who are prepared, polished, and investor-ready.
                  <br /><br />
                  At StartWise, we turn serious founders into fundable founders in 90 days — with <span className="text-primary font-semibold">YC-level strategy, pitch training, and direct investor access.</span>
                  <br />
                  ✅ Ready to raise? We'll connect you.
                  <br />
                  ⚙️ Still building? We'll get you ready.
                </p>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div className="space-y-1 sm:space-y-3 lg:space-y-4 2xl:space-y-6 3xl:space-y-8 animate-slide-in-right mt-2 xl:mt-0 max-w-lg 2xl:max-w-xl 3xl:max-w-2xl mx-auto xl:mx-0">
              <div className="animate-fade-in stagger-4">
                <h2 className={`${isSmallScreen ? 'text-[15px]' : 'text-[18px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white mb-1 sm:mb-3 flex items-center leading-tight`}>
                  <Sparkles className={`${isSmallScreen ? 'w-3 h-3' : 'w-4 h-4'} 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 mr-2 text-primary animate-pulse flex-shrink-0`} />
                  <span>Ready to Get Started?</span>
                </h2>
                
                <div className="space-y-1 sm:space-y-3 2xl:space-y-4 3xl:space-y-5">
                  <div className="group w-full max-w-full overflow-hidden p-2.5 sm:p-5 lg:p-6 2xl:p-8 3xl:p-10 border-2 border-white/20 rounded-lg card-glass">
                    <div className="mb-1 sm:mb-4 2xl:mb-5 3xl:mb-6">
                      <h3 className={`${isSmallScreen ? 'text-[13px]' : 'text-[15px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white group-hover:gradient-text transition-all leading-tight`}>
                        Investor-Readiness Assessment
                      </h3>
                    </div>
                    <p className={`${isSmallScreen ? 'text-[11px]' : 'text-[14px]'} sm:text-base 2xl:text-lg 3xl:text-xl text-gray-300 mb-2 sm:mb-5 2xl:mb-6 3xl:mb-7 leading-tight sm:leading-snug`}>Get interviewed by professionals who worked inside VC's & founders who've raised capital multiple times.</p>
                    
                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-0.5 sm:gap-1.5 2xl:gap-2 3xl:gap-2.5 mb-1 sm:mb-4 2xl:mb-5 3xl:mb-6">
                      <span className="px-1 sm:px-1.5 2xl:px-2 3xl:px-2.5 py-0.5 2xl:py-1 3xl:py-1.5 bg-green-500/20 border border-green-500/30 rounded text-[10px] sm:text-sm 2xl:text-base 3xl:text-lg text-green-400 font-medium">
                        VC-Backed
                      </span>
                      
                      <span className="px-1 sm:px-1.5 2xl:px-2 3xl:px-2.5 py-0.5 2xl:py-1 3xl:py-1.5 bg-purple-500/20 border border-purple-500/30 rounded text-[10px] sm:text-sm 2xl:text-base 3xl:text-lg text-purple-400 font-medium">
                        Real Feedback
                      </span>
                      <span className="px-1 sm:px-1.5 2xl:px-2 3xl:px-2.5 py-0.5 2xl:py-1 3xl:py-1.5 bg-amber-500/20 border border-amber-500/30 rounded text-[10px] sm:text-sm 2xl:text-base 3xl:text-lg text-amber-400 font-medium">
                        Founder to Founder
                      </span>
                    </div>
                    
                    
                    
                    <Button onClick={() => setCurrentView('prototype-form')} className="btn-hero w-full text-xs sm:text-sm">
                      <span>Become Investor Ready in 90 days!</span>
                      <ArrowRight className="w-3 h-3 2xl:w-4 2xl:h-4 3xl:w-5 3xl:h-5 ml-2 flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {/* As Featured In */}
        {currentView === 'products' && <div className="mt-3.5 sm:mt-12 lg:mt-14 2xl:mt-[18.5rem] 3xl:mt-[23rem] animate-fade-in stagger-5">
            <div className="text-center mb-2.5 sm:mb-7 2xl:mb-9 3xl:mb-12">
              <p className={`${isSmallScreen ? 'text-sm' : 'text-base'} sm:text-[1.725rem] 2xl:text-[2.15rem] 3xl:text-[2.875rem] font-bold text-white`}>As Featured In</p>
              <p className={`${isSmallScreen ? 'text-[11px]' : 'text-sm'} sm:text-[1.3rem] 2xl:text-[1.4375rem] 3xl:text-[1.725rem] text-gray-400`}>Recognized by leading media and financial publications</p>
            </div>
            <div className="flex justify-center">
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
                      <img src={logo.src} alt={logo.alt} className={`h-[4.5rem] sm:h-[10.25rem] 2xl:h-[11.5rem] 3xl:h-[12.65rem] w-auto object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-75 contrast-100' : logo.alt === 'Forbes' ? 'brightness-150 contrast-50' : 'brightness-200 contrast-90'}`} />
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
                      <img src={logo.src} alt={logo.alt} className={`h-[4.5rem] sm:h-[10.25rem] 2xl:h-[11.5rem] 3xl:h-[12.65rem] w-auto object-contain grayscale opacity-80 hover:opacity-100 transition-all duration-300 ${logo.alt === 'The Globe and Mail' ? 'brightness-75 contrast-100' : logo.alt === 'Forbes' ? 'brightness-150 contrast-50' : 'brightness-200 contrast-90'}`} />
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