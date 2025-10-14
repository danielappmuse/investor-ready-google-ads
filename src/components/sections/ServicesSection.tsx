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
        {/* CTA Section */}
        <div className="text-center">
          <Button onClick={onValidationClick} className="btn-hero text-base px-8 py-6">
            <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-4 h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{ background: 'transparent' }} />
            Become Investment Ready Today!
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>;
};
export default ServicesSection;