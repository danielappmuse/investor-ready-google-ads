import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Star, CheckCircle, ArrowRight, Sparkles, Cpu, Zap, Database, Shield, Code2, Rocket, Users, Briefcase, Target, BadgeCheck, FileText, Code, PresentationIcon, Handshake } from 'lucide-react';
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
                <div className={`inline-flex items-center justify-center px-3 sm:px-3 2xl:px-4 3xl:px-5 py-1 2xl:py-1.5 3xl:py-2 bg-primary/20 border border-primary/30 rounded-full ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white mb-6 sm:mb-8 mt-6 sm:mt-8 w-[280px] sm:w-auto`}>
                  <Star className={`${isSmallScreen ? 'w-3 h-3' : 'w-3.5 h-3.5'} 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 mr-1.5 sm:mr-2 text-primary animate-pulse flex-shrink-0`} />
                  <span className="hidden sm:inline whitespace-nowrap">YC-Level Backing. Investor-Ready Results.</span>
                  <span className={`sm:hidden font-bold ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} whitespace-nowrap`}>
                    <span className="text-white">Investor Ready</span> <span className="text-white font-bold">Under 90 Days</span>
                  </span>
                </div>
                
                
                
                <p className={`${isSmallScreen ? 'text-[12.5px]' : 'text-[15.5px]'} sm:text-[15px] lg:text-[17px] 2xl:text-[19px] 3xl:text-[23px] text-white leading-snug animate-fade-in stagger-2 max-w-2xl 2xl:max-w-3xl 3xl:max-w-4xl mt-1.5`}>
                  <strong>Why Serious Founders Choose StartWise?</strong>
                  <span className="block h-2" />
                  At <strong>StartWise</strong>, we turn serious founders into <strong>fundable founders under 90 days.</strong>
                  <span className="block h-2" />
                  <strong>✅ YC-level strategy & implementation</strong>
                  <br />
                  <strong>📈 Market research, business plan/modeling</strong>
                  <br />
                  <strong>💼 Pitch-ready materials & investor network</strong>
                  <span className="block h-2" />
                  → <strong>Ready to raise?</strong> We'll connect you.
                  <br />
                  → <strong>Still building?</strong> We'll get you ready.
                </p>
              </div>
            </div>

            {/* Right Column - CTA */}
            <div className="space-y-1 sm:space-y-3 lg:space-y-4 2xl:space-y-6 3xl:space-y-8 animate-slide-in-right mt-0.5 xl:mt-0 max-w-lg 2xl:max-w-xl 3xl:max-w-2xl mx-auto xl:mx-0 w-full px-2 flex flex-col items-center xl:items-start">
              <div className="animate-fade-in stagger-4 w-full text-center xl:text-left flex flex-col items-center xl:items-start">
                <div className="space-y-2 sm:space-y-3 2xl:space-y-4 3xl:space-y-5">
                  <div className="group w-full max-w-full overflow-hidden box-border p-3 sm:p-5 lg:p-6 2xl:p-8 3xl:p-10 border-2 border-white/20 rounded-lg card-glass mt-3">
                    <div className="mb-2 sm:mb-4 2xl:mb-5 3xl:mb-6">
                      <h3 className={`${isSmallScreen ? 'text-[15.5px]' : 'text-[17.5px]'} sm:text-xl lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white transition-all leading-tight`}>
                        Investor-Readiness Assessment
                      </h3>
                    </div>
                    <p className={`${isSmallScreen ? 'text-[13px]' : 'text-[15.5px]'} sm:text-[17.5px] 2xl:text-lg 3xl:text-xl text-white mb-3 sm:mb-6 2xl:mb-7 3xl:mb-8 leading-tight sm:leading-snug`}>Your path to investment starts here. Take a quick quiz, get interviewed by ex-VCs and founders who've raised before multiple times.</p>
                    
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
                  <div className="flex flex-nowrap gap-1 sm:gap-2 mt-[6px] sm:mt-[14px] mb-[5px] justify-center xl:justify-start">
                    <div className={`inline-flex items-center px-1.5 sm:px-2.5 2xl:px-3 3xl:px-3.5 py-0.5 sm:py-1.5 2xl:py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-[9px] xs:text-[10px] min-[450px]:text-xs sm:text-sm 2xl:text-base 3xl:text-lg font-medium text-white whitespace-nowrap`}>
                      <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                      NDA Protected
                    </div>
                    <div className={`inline-flex items-center px-1.5 sm:px-2.5 2xl:px-3 3xl:px-3.5 py-0.5 sm:py-1.5 2xl:py-2 bg-green-500/20 border border-green-400/30 rounded-full text-[9px] xs:text-[10px] min-[450px]:text-xs sm:text-sm 2xl:text-base 3xl:text-lg font-medium text-white whitespace-nowrap`}>
                      <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                      100% Risk FREE
                    </div>
                    <div className={`inline-flex items-center px-1.5 sm:px-2.5 2xl:px-3 3xl:px-3.5 py-0.5 sm:py-1.5 2xl:py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-[9px] xs:text-[10px] min-[450px]:text-xs sm:text-sm 2xl:text-base 3xl:text-lg font-medium text-white whitespace-nowrap`}>
                      <Star className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 2xl:w-3.5 2xl:h-3.5 3xl:w-4 3xl:h-4 mr-0.5 sm:mr-1 flex-shrink-0" />
                      YC-Level Backing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {/* As Featured In */}
        {currentView === 'products' && <div className="mt-[26px] sm:mt-12 lg:mt-14 2xl:mt-[18.5rem] 3xl:mt-[23rem] animate-fade-in stagger-5">
            <div className="text-center mb-3 sm:mb-4 mt-6 sm:mt-8">
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className={`inline-flex items-center justify-center px-3 sm:px-3 2xl:px-4 3xl:px-5 py-1 2xl:py-1.5 3xl:py-2 bg-primary/20 border border-primary/30 rounded-full ${isSmallScreen ? 'text-[14px]' : 'text-[16px]'} sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white w-[280px] sm:w-auto`}>
                  <Star className={`${isSmallScreen ? 'w-3 h-3' : 'w-3.5 h-3.5'} 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6 mr-1.5 sm:mr-2 text-primary animate-pulse flex-shrink-0`} />
                  <span className="whitespace-nowrap">As Featured In</span>
                </div>
              </div>
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
            <div className="text-center mt-6 sm:mt-8">
              <p className={`${isSmallScreen ? 'text-[11px]' : 'text-sm'} sm:text-[1.3rem] 2xl:text-[1.4375rem] 3xl:text-[1.725rem] text-white`}>Recognized by leading media and financial publications</p>
            </div>
          </div>}

        {/* Why Choose Us */}
        {currentView === 'products' && <div className="mt-16 lg:mt-20">
            <div className="max-w-4xl mx-auto">
              <div className="card-glass p-6 sm:p-8 lg:p-10 text-center">
                <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
                  Why Serious Founders Choose <span className="gradient-text">StartWise</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm sm:text-base text-gray-300">
                      <strong>Built by founders, not consultants</strong> We've raised millions ourselves, we know what actually gets funded. Now we help other founders avoid mistakes and move faster.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm sm:text-base text-gray-300">
                      <strong>Full-stack startup support under one roof</strong> From market research and business plan/modeling to PRDs, design, MVP development and investor materials. Every piece is built in-house for consistency and speed.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm sm:text-base text-gray-300">
                      <strong>Structured, YC-level process</strong> Our frameworks mirror what top accelerators use to evaluate startups. Ensuring your business meets investor standards in 90 days or less. However, we also help you build the core of the business.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm sm:text-base text-gray-300">
                      <strong>Investor-ready, not theory-ready</strong> Every deliverable is built with one goal: to make real investors say "yes." You'll walk away with a fundable, data-driven business — not a slide deck of ideas.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 md:col-span-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm sm:text-base text-gray-300">
                      <strong>Access to investors who actually invest</strong> We don't just "prepare" you — we connect you to real funds and angels looking for your exact stage and vertical, so your next step is traction, not chasing meetings.
                    </div>
                  </div>
                </div>
                
                {/* Icons Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-white">Founder to Founder</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Target className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-white">YC-level Process</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Briefcase className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-white">Full-stack Business Suite</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <BadgeCheck className="w-8 h-8 text-primary mb-2" />
                    <span className="text-sm font-medium text-white">Become Investor Ready</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-lg border border-primary/30 col-span-2 md:col-span-4">
                    <Handshake className="w-10 h-10 text-primary mb-2 animate-pulse" />
                    <span className="text-base font-bold text-white">Access to Real Investors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>}

        {currentView === 'products' && <section id="process" className="py-12">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-[18px] sm:text-[22px] lg:text-[24px] 2xl:text-[28px] 3xl:text-[32px] font-bold text-white mb-4">
                  The Path to <span className="gradient-text">Investment-Ready</span>
                </h2>
                <p className="text-[13.5px] sm:text-[15px] lg:text-[17px] 2xl:text-[19px] 3xl:text-[21px] text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Our proven 3-phase process transforms your startup into an investor-ready business 
                  under 90 days - from solid fundamentals to compelling investor materials.
                </p>
              </div>

              {/* Process Steps */}
              <div className="relative max-w-5xl mx-auto">
                {/* Connection Line */}
                <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-px bg-gradient-to-r from-primary to-secondary transform -translate-y-1/2 z-0" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                  {[
                    {
                      number: '01',
                      icon: <FileText className="w-8 h-8" />,
                      title: 'Business Fundamentals',
                      description: 'Build the foundation with comprehensive planning, market research, and business-model validation.',
                      details: [
                        'Market research & analysis',
                        'Business plan development',
                        'Business model design',
                        'Marketing strategy framework'
                      ],
                      timeline: '2–3 weeks',
                      product: 'business',
                      advantageTitle: 'What Makes This Phase Different',
                      advantageDescription: "We don't just write business plans — we build investment logic.",
                      advantages: [
                        {
                          name: 'Deal-Logic Map™',
                          description: 'translates your business model into the decision frameworks investors use, so your story makes instant sense.'
                        },
                        {
                          name: 'Traction Math Check™',
                          description: "pressure-tests your growth and revenue assumptions against real benchmarks, eliminating the \"too early\" excuse."
                        },
                        {
                          name: 'Market Narrative Engine™',
                          description: "transforms data into an investor thesis: why this market, why now, and why you're the one to win it."
                        }
                      ]
                    },
                    {
                      number: '02',
                      icon: <Code className="w-8 h-8" />,
                      title: 'Tech & Design',
                      description: 'Turn your validated idea into a tangible product with UI/UX, prototype, and technical documentation.',
                      details: [
                        'UI/UX design',
                        'Interactive prototype',
                        'MVP development',
                        'Product Requirements Document (PRD)'
                      ],
                      timeline: '6–8 weeks',
                      product: 'tech',
                      advantageTitle: 'Inside the StartWise Method™',
                      advantageDescription: "Our design & development phase is built to impress investors — not just users.",
                      advantages: [
                        {
                          name: 'PRD-to-Pitch Bridge™',
                          description: 'connects your roadmap directly to investor milestones, proving every dollar raised accelerates real traction.'
                        },
                        {
                          name: 'Signal-First UX™',
                          description: "prototypes are designed to highlight investor signals — activation, retention, and monetization potential — not just look pretty."
                        },
                        {
                          name: 'Risk-Slice MVP™',
                          description: 'we scope your MVP to prove the riskiest assumption first, turning uncertainty into early validation.'
                        }
                      ]
                    },
                    {
                      number: '03',
                      icon: <PresentationIcon className="w-8 h-8" />,
                      title: 'Investor Preparation',
                      description: 'Get investor-ready with professional pitch materials, outreach, and legal preparation.',
                      details: [
                        'Investor outreach strategy',
                        'One-pager & pitch deck',
                        'Investment terms preparation',
                        'Legal documentation'
                      ],
                      timeline: '2–3 weeks',
                      product: 'investor',
                      advantageTitle: 'The StartWise Advantage',
                      advantageDescription: "We bridge the gap between being \"ready\" and actually getting funded.",
                      advantages: [
                        {
                          name: 'IC Simulation™',
                          description: 'a real mock Investment Committee, where founders face authentic VC questions before stepping into the real room.'
                        },
                        {
                          name: 'Fund-Fit Map™',
                          description: 'a curated list of investors who align with your stage, sector, and check size — so you pitch fewer rooms and close faster.'
                        },
                        {
                          name: 'Data Room Lite™',
                          description: 'a clean, DD-ready folder with all your materials, cutting weeks off investor decision cycles.'
                        }
                      ]
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative flex justify-center">
                      {/* Mobile Connection Line */}
                      {index < 2 && (
                        <div className="lg:hidden absolute top-40 left-1/2 w-px h-16 bg-gradient-to-b from-primary to-secondary transform -translate-x-1/2 z-0" />
                      )}
                      
                      <div className="card-glass p-6 text-center relative w-full max-w-sm">
                        {/* Step Number */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {step.number}
                          </div>
                        </div>

                        {/* Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl flex items-center justify-center mx-auto mb-6 mt-4">
                          <div className="text-primary">
                            {step.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-[15px] sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-[13px] sm:text-[15px] lg:text-[17px] 2xl:text-[19px] 3xl:text-[21px] text-gray-300 mb-5 leading-relaxed">{step.description}</p>

                        {/* Details */}
                        <div className="space-y-3 mb-6">
                          {step.details.map((detail, idx) => (
                            <div key={idx} className="flex items-start text-xs sm:text-sm text-gray-400">
                              <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                              <span className="flex-1 text-left">{detail}</span>
                            </div>
                          ))}
                        </div>

                        {/* Advantage Section */}
                        <div className="border-t border-white/10 pt-6 text-left mb-4">
                          <h4 className="text-[14.5px] sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-white mb-3">{step.advantageTitle}</h4>
                          <p className="text-[13px] sm:text-[15px] lg:text-[17px] 2xl:text-[19px] 3xl:text-[21px] text-gray-300 mb-4 leading-relaxed">{step.advantageDescription}</p>
                          <div className="space-y-4">
                            {step.advantages.map((advantage, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="text-sm font-semibold text-primary">{advantage.name}</div>
                                <div className="text-xs text-gray-400 leading-relaxed">{advantage.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary mt-2.5 mb-1.5">
                          {step.timeline}
                        </div>

                        {/* Product Tag */}
                        <div>
                          <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                            step.product === 'business' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/20' :
                            step.product === 'tech' ? 'bg-purple-500/20 text-purple-400 border border-purple-400/20' :
                            'bg-green-500/20 text-green-400 border border-green-400/20'
                          }`}>
                          {step.product === 'business' ? 'Business Phase' :
                           step.product === 'tech' ? 'Tech & Design Phase' :
                           'Investor Phase'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>}

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