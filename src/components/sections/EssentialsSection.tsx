import React, { useState } from 'react'
import { CheckCircle, Target, Code, Shield, Star, ArrowRight, FileText, Users, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/custom-tabs'
import ErrorBoundary from '@/components/ErrorBoundary'

interface EssentialsSectionProps {
  onValidationClick?: () => void
}

const EssentialsSection = ({ onValidationClick }: EssentialsSectionProps) => {
  const [activeTab, setActiveTab] = useState('validation')

  const essentials = {
    validation: {
      icon: <Target />,
      title: 'Validation Essentials',
      subtitle: 'Validate Smart, Build Right',
      description: 'Everything you need to know about our Validation Exam and why it\'s the smart first step for any startup.',
      benefits: [
        'Save $10K+ by avoiding bad ideas',
        'Get market-validated insights',
        'Understand your competition',
        'Identify revenue opportunities',
        'Reduce investment risk',
        'Get professional analysis'
      ],
      process: [
        'Submit your startup idea (NDA protected)',
        'Our experts conduct market research',
        'Competitive analysis performed',
        'Customer validation interviews',
        'Financial projections created',
        'Comprehensive report delivered'
      ],
      outcomes: [
        'Clear Go/No-Go recommendation',
        'Market size and opportunity data',
        'Competitive landscape analysis',
        'Revenue model validation',
        'Risk assessment and mitigation',
        'Strategic next steps'
      ]
    },
    prototype: {
      icon: <Code />,
      title: 'Prototype + PRD',
      subtitle: 'From Validated Idea to Reality',
      description: 'Transform your validated startup idea into a functional prototype with complete product requirements documentation.',
      benefits: [
        'Interactive clickable prototype',
        'Complete technical specifications',
        'Professional design system',
        'Development-ready documentation',
        'Quality assurance planning',
        'Investor-ready presentation'
      ],
      process: [
        'Requirements gathering session',
        'User experience design',
        'Interactive prototype creation',
        'Technical architecture planning',
        'PRD documentation writing',
        'Quality assurance review'
      ],
      outcomes: [
        'Fully functional prototype',
        'Comprehensive PRD document',
        'Technical specifications',
        'UI/UX design files',
        'Development roadmap',
        'Testing protocols'
      ]
    }
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-sm font-medium text-white mb-6">
            <Star className="w-4 h-4 mr-2" />
            Product Deep Dive
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Our <span className="gradient-text">Two-Product</span> System Works
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Most startups fail because they skip validation or build without proper planning. 
            Our proven system eliminates both risks.
          </p>
        </div>

        {/* Tabbed Interface */}
        <div className="max-w-6xl mx-auto">
          <ErrorBoundary fallback={
            <div className="p-8 bg-card/20 rounded-lg border border-border/50 text-center">
              <p className="text-gray-300 mb-4">Product comparison temporarily unavailable.</p>
              <Button onClick={scrollToContact} className="btn-hero">
                Contact Us Directly
              </Button>
            </div>
          }>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12 bg-white/5 backdrop-blur-sm h-12 p-1 rounded-lg">
                {Object.entries(essentials).map(([key, essential]) => (
                  <TabsTrigger 
                    key={key} 
                    value={key}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white h-full rounded-md transition-all duration-200 flex items-center justify-center"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {essential.icon}
                      </div>
                      <span className="text-sm font-medium leading-none">{essential.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(essentials).map(([key, essential]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Content */}
                    <div className="space-y-8">
                      {/* NDA Protection Badges for Validation */}
                      {key === 'validation' && (
                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-card/20 rounded-lg border border-green-500/20">
                          <div className="flex items-center space-x-2 text-green-400">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs font-medium">NDA Protected</span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-xs font-medium">100% Confidential</span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-400">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-medium">Secure Ideas</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white">
                            <div className="w-8 h-8 flex items-center justify-center text-current">
                              {essential.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{essential.title}</h3>
                            <p className="text-gray-400">{essential.subtitle}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {essential.description}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Key Benefits:</h4>
                        <div className="space-y-3">
                          {essential.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Process */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Our Process:</h4>
                        <div className="space-y-3">
                          {essential.process.map((step, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <span className="text-gray-300">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Outcomes & CTA */}
                    <div className="space-y-6">
                      <div className="card-glass p-8">
                        <h4 className="text-xl font-bold text-white mb-6 text-center">
                          What You'll Get
                        </h4>
                        
                        <div className="space-y-3 mb-6">
                          {essential.outcomes.map((outcome, idx) => (
                            <div key={idx} className="flex items-start space-x-3">
                              <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300 text-sm">{outcome}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-center mb-6">
                          <div className="text-3xl font-bold gradient-text mb-2">
                            {key === 'validation' ? 'Complete Exam' : 'from $10k'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {key === 'validation' ? '48 hours' : '4-6 weeks delivery'}
                          </div>
                        </div>

                        <Button 
                          onClick={key === 'validation' ? onValidationClick : scrollToContact}
                          className="btn-hero w-full"
                        >
                          {key === 'validation' ? 'Get Started - Complete Exam' : 'Get Started'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>

                      {/* Guarantee */}
                      <div className="card-glass p-6 text-center">
                        <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h5 className="text-lg font-semibold text-white mb-2">
                          100% Money-Back Guarantee
                        </h5>
                        <p className="text-gray-300 text-sm">
                          {key === 'validation' 
                            ? "If we can't validate your concept with actionable insights, full refund."
                            : "If the prototype doesn't meet specifications, we'll fix it or refund."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  )
}

export default EssentialsSection