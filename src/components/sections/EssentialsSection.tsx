import React, { useState } from 'react';
import { CheckCircle, Target, Code, Shield, Star, ArrowRight, FileText, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs';
import ErrorBoundary from '@/components/ErrorBoundary';
interface EssentialsSectionProps {
  onValidationClick?: () => void;
}
const EssentialsSection = ({
  onValidationClick
}: EssentialsSectionProps) => {
  const [activeTab, setActiveTab] = useState('validation');
  const essentials = {
    validation: {
      icon: <Target />,
      title: 'Validation Essentials',
      subtitle: 'Validate Smart, Build Right',
      description: 'Everything you need to know about our Validation Exam and why it\'s the smart first step for any startup.',
      benefits: ['Save $10K+ by avoiding bad ideas', 'Get market-validated insights', 'Understand your competition', 'Identify revenue opportunities', 'Reduce investment risk', 'Get professional analysis'],
      process: ['Submit your startup idea (NDA protected)', 'Our experts conduct market research', 'Competitive analysis performed', 'Customer validation interviews', 'Financial projections created', 'Comprehensive report delivered'],
      outcomes: ['Clear Go/No-Go recommendation', 'Market size and opportunity data', 'Competitive landscape analysis', 'Revenue model validation', 'Risk assessment and mitigation', 'Strategic next steps']
    },
    prototype: {
      icon: <Code />,
      title: 'Prototype + PRD',
      subtitle: 'From Validated Idea to Reality',
      description: 'Transform your validated startup idea into a functional prototype with complete product requirements documentation.',
      benefits: ['Interactive clickable prototype', 'Complete technical specifications', 'Professional design system', 'Development-ready documentation', 'Quality assurance planning', 'Investor-ready presentation'],
      process: ['Requirements gathering session', 'User experience design', 'Interactive prototype creation', 'Technical architecture planning', 'PRD documentation writing', 'Quality assurance review'],
      outcomes: ['Fully functional prototype', 'Comprehensive PRD document', 'Technical specifications', 'UI/UX design files', 'Development roadmap', 'Testing protocols']
    }
  };
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section id="essentials" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose the right service for your startup stage
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="validation">Validation Exam</TabsTrigger>
            <TabsTrigger value="prototype">Prototype + PRD</TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="space-y-8">
            <div className="card-glass p-8 rounded-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  {essentials.validation.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{essentials.validation.title}</h3>
                  <p className="text-primary font-semibold">{essentials.validation.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8">{essentials.validation.description}</p>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Benefits
                  </h4>
                  <ul className="space-y-3">
                    {essentials.validation.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Process
                  </h4>
                  <ul className="space-y-3">
                    {essentials.validation.process.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="font-bold text-primary">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Outcomes
                  </h4>
                  <ul className="space-y-3">
                    {essentials.validation.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button onClick={onValidationClick} className="btn-hero">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={scrollToContact} variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prototype" className="space-y-8">
            <div className="card-glass p-8 rounded-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  {essentials.prototype.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{essentials.prototype.title}</h3>
                  <p className="text-primary font-semibold">{essentials.prototype.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8">{essentials.prototype.description}</p>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Benefits
                  </h4>
                  <ul className="space-y-3">
                    {essentials.prototype.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Process
                  </h4>
                  <ul className="space-y-3">
                    {essentials.prototype.process.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="font-bold text-primary">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Outcomes
                  </h4>
                  <ul className="space-y-3">
                    {essentials.prototype.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button onClick={scrollToContact} className="btn-hero">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={scrollToContact} variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default EssentialsSection;