import React from 'react';
import { CheckCircle, Shield, Target, Code, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ServicesSectionProps {
  onValidationClick?: () => void;
  onPrototypeClick?: () => void;
}
const ServicesSection = ({
  onValidationClick,
  onPrototypeClick
}: ServicesSectionProps) => {
  const products = [{
    id: 'validation-exam',
    icon: <Target className="w-8 h-8" />,
    title: 'Startup Validation Exam',
    subtitle: 'Test Your Idea Before You Build',
    price: 'Complete Exam',
    originalPrice: '$997',
    description: 'Comprehensive market analysis and feasibility study to validate your startup idea with data-driven insights.',
    features: ['Market size and opportunity analysis', 'Competitive landscape deep-dive', 'Customer validation interviews', 'Revenue model assessment', 'Technical feasibility review', 'Go-to-market strategy framework', 'Risk assessment and mitigation plan', 'Investment recommendation (Go/No-Go)'],
    deliverables: ['10-15 pages report', 'Market analysis dashboard', 'Competitor comparison matrix', 'Customer persona profiles', 'Revenue projections', 'Strategy session with experienced entrepreneurs & business analysts'],
    guarantee: 'Money-back guarantee if we can\'t validate your concept',
    timeline: '48 hours',
    popular: true
  }, {
    id: 'prototype-prd',
    icon: <Code className="w-8 h-8" />,
    title: 'Prototype + PRD Package',
    subtitle: 'Build Your MVP The Right Way',
    price: 'from $10,000',
    originalPrice: '$35,000',
    description: 'Complete prototype development with detailed PRD to transform your validated idea into a market-ready product.',
    features: ['Interactive clickable prototype', 'Comprehensive PRD documentation', 'User experience design', 'Technical architecture planning', 'Database schema design', 'API specification document', 'Quality assurance testing plan', 'Deployment and scaling strategy'],
    deliverables: ['Fully interactive prototype', '50-100 page PRD document', 'Figma UI/UX design files', 'Technical specifications', 'Testing protocols', 'Development roadmap', 'Weekly progress calls'],
    guarantee: 'Launch-ready guarantee with 90-day support',
    timeline: '4-6 weeks'
  }];
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section id="services" className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            Investment Readiness Requirements
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            What Your Business <span className="gradient-text">Must Have</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Two critical pillars every investor-ready startup needs: solid business fundamentals and compelling investor materials.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 lg:mb-16">
          {/* Left Column - Business Essentials */}
          <div className="card-glass p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Business Essentials
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Core requirements to prove your business is viable and ready for investment
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Marketing Research',
                'Business Plan',
                'Business Model',
                'Product Requirement Document',
                'UI/UX/Prototype/MVP',
                'Marketing Strategy'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white text-base sm:text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Investor Preparation */}
          <div className="card-glass p-6 sm:p-8 lg:p-10">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary to-primary rounded-xl mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Investor Preparation
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Essential materials and strategies to secure funding and close deals
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Investor Outreach Strategy',
                'Investor Preparation',
                'One Pager',
                'Pitch Deck',
                'Investment Terms',
                'Legal'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-white text-base sm:text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button onClick={onValidationClick} className="btn-hero text-sm sm:text-base lg:text-lg px-8 py-6">
            <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-4 h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{ background: 'transparent' }} />
            Get Your Business Investment-Ready
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>;
};
export default ServicesSection;