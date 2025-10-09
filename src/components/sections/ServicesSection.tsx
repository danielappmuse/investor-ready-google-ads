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
            Two Products. One Mission.
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            From <span className="gradient-text">validation</span> to <span className="gradient-text">Investors ready</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Start smart with our Validation Exam, then build right with our Prototype + PRD Package starting from $10k. 
            The proven path from idea to reality.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 lg:mb-16">
          {products.map((product, index) => <div key={product.id} className={`card-glass p-4 sm:p-6 lg:p-8 relative ${product.popular ? 'ring-2 ring-primary' : ''}`}>
              {product.popular && <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white">
                    Start Here
                  </div>
                </div>}

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {product.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{product.title}</h3>
                    <p className="text-sm text-gray-400">{product.subtitle}</p>
                  </div>
                </div>
                
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-xl sm:text-2xl font-bold gradient-text">{product.price}</div>
                  <div className="text-xs sm:text-sm text-gray-400 line-through">{product.originalPrice}</div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">What's Included:</h4>
                <div className="space-y-2">
                  {product.features.map((feature, idx) => <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                    </div>)}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Deliverables:</h4>
                <div className="space-y-2">
                  {product.deliverables.map((deliverable, idx) => <div key={idx} className="flex items-start space-x-3">
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs sm:text-sm">{deliverable}</span>
                    </div>)}
                </div>
              </div>

              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">{product.guarantee}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  Timeline: {product.timeline}
                </div>
              </div>

              <Button onClick={product.id === 'validation-exam' ? onValidationClick : onPrototypeClick} className="btn-hero w-full text-xs sm:text-sm lg:text-base">
                <img src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" alt="StartWise Logo" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 filter drop-shadow-sm flex-shrink-0" style={{
              background: 'transparent'
            }} />
                Get Started - {product.price}
              </Button>
            </div>)}
        </div>

        {/* Process Flow */}
        

        {/* Trust Indicators */}
        
      </div>
    </section>;
};
export default ServicesSection;