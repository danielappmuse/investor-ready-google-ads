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
      title: 'Assessment Program',
      subtitle: 'Are You Investor-Ready?',
      description: 'Our comprehensive assessment evaluates your startup and determines if you\'re ready to meet investors or need more preparation.',
      benefits: [
        'Honest investor-readiness score',
        'Clear roadmap to funding',
        'Investor introductions (if ready)',
        'Gap analysis and recommendations',
        'Materials review and feedback',
        'Access to VC-backed founders'
      ],
      process: [
        'Submit your materials (NDA protected)',
        'Pitch deck and business review',
        'Team and traction evaluation',
        'Market and competitive analysis',
        'Interview with our team',
        'Detailed feedback delivered'
      ],
      outcomes: [
        'Investor-readiness score',
        'Ready? Investor introductions',
        'Not ready? 90-day program access',
        'Materials feedback report',
        'Strategic action plan',
        'Ongoing support and guidance'
      ]
    },
    prototype: {
      icon: <Code />,
      title: '90-Day Program',
      subtitle: 'Get Investor-Ready Fast',
      description: 'Not ready yet? We\'ll work with you to refine your pitch, complete missing materials, and train you for investor meetings in 90 days or less.',
      benefits: [
        'Pitch deck refinement',
        'Materials completion support',
        'Investor presentation training',
        'Q&A preparation coaching',
        'Financial model review',
        'Guaranteed investor-readiness'
      ],
      process: [
        'Gap analysis and planning',
        'Materials development',
        'Pitch coaching sessions',
        'Mock investor presentations',
        'Feedback and iteration',
        'Final readiness check'
      ],
      outcomes: [
        'Polished pitch deck',
        'Complete investor materials',
        'Presentation confidence',
        'Investor Q&A preparation',
        'Warm investor introductions',
        'Fundraising support'
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
            Why Our <span className="gradient-text">Two-Path</span> Approach Works
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Most startups waste time pitching before they're ready. We assess first, 
            then either connect you to investors or get you ready in 90 days.
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
                            {key === 'validation' ? 'Complete Assessment' : '90-Day Program'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {key === 'validation' ? '48 hour turnaround' : 'Investor-ready guarantee'}
                          </div>
                        </div>

                        <Button 
                          onClick={key === 'validation' ? onValidationClick : scrollToContact}
                          className="btn-hero w-full"
                        >
                          {key === 'validation' ? 'Get Assessed Now' : 'Join 90-Day Program'}
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
                            ? "Clear assessment and roadmap to funding or your money back."
                            : "Investor-ready in 90 days or we'll work until you are."
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