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
  const [activeTab, setActiveTab] = useState('business');
  const essentials = {
    business: {
      icon: <FileText />,
      title: 'Business Essentials',
      subtitle: 'Build Your Foundation',
      description: 'Everything your business must have to prove viability and attract investors - from market research to product development.',
      benefits: ['Validated market opportunity', 'Clear business strategy', 'Professional documentation', 'Technical roadmap', 'Competitive advantage', 'Investor confidence'],
      process: ['Market research & analysis', 'Business plan development', 'Business model design', 'PRD creation', 'UI/UX & prototype design', 'Marketing strategy framework'],
      outcomes: ['Market Research Report', 'Business Plan', 'Business Model Canvas', 'Product Requirement Document', 'UI/UX/Prototype/MVP', 'Marketing Strategy']
    },
    investor: {
      icon: <Target />,
      title: 'Investor Preparation',
      subtitle: 'Get Investment-Ready',
      description: 'Complete investor preparation package to present your startup professionally and secure funding.',
      benefits: ['Professional pitch materials', 'Strategic investor targeting', 'Legal readiness', 'Negotiation preparation', 'Investment terms clarity', 'Funding confidence'],
      process: ['Investor profile analysis', 'Outreach strategy development', 'One pager creation', 'Pitch deck design', 'Investment terms preparation', 'Legal documentation'],
      outcomes: ['Investor Outreach Strategy', 'Investor Preparation Guide', 'One Pager', 'Pitch Deck', 'Investment Terms Sheet', 'Legal Documentation']
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
          <h2 className="text-4xl font-bold text-white mb-4">Everything Your Business Must Have</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Two critical pillars for investment readiness
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="business">Business Essentials</TabsTrigger>
            <TabsTrigger value="investor">Investor Preparation</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-8">
            <div className="card-glass p-8 rounded-xl text-center">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  {essentials.business.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{essentials.business.title}</h3>
                  <p className="text-primary font-semibold">{essentials.business.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8">{essentials.business.description}</p>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Benefits
                  </h4>
                  <ul className="space-y-3">
                    {essentials.business.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="flex-1 text-center">{benefit}</span>
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
                    {essentials.business.process.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="font-bold text-primary">{index + 1}.</span>
                        <span className="flex-1 text-center">{step}</span>
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
                    {essentials.business.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="flex-1 text-center">{outcome}</span>
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

          <TabsContent value="investor" className="space-y-8">
            <div className="card-glass p-8 rounded-xl text-center">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  {essentials.investor.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{essentials.investor.title}</h3>
                  <p className="text-primary font-semibold">{essentials.investor.subtitle}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8">{essentials.investor.description}</p>

              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Benefits
                  </h4>
                  <ul className="space-y-3">
                    {essentials.investor.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="flex-1 text-center">{benefit}</span>
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
                    {essentials.investor.process.map((step, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="font-bold text-primary">{index + 1}.</span>
                        <span className="flex-1 text-center">{step}</span>
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
                    {essentials.investor.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="flex-1 text-center">{outcome}</span>
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
        </Tabs>
      </div>
    </section>
  );
};

export default EssentialsSection;