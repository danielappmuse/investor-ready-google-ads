import React from 'react';
import { ArrowRight, Search, Target, Code, Rocket } from 'lucide-react'

const ProcessSection = () => {
  const steps = [
    {
      number: '01',
      icon: <Search className="w-8 h-8" />,
      title: 'Get Assessed',
      description: 'We evaluate your startup, team, materials, and pitch to determine if you\'re investor-ready.',
      details: [
        'Submit your pitch deck and materials',
        'Share your traction and metrics',
        'Tell us about your team',
        'Review call with our team'
      ],
      timeline: '48 hours',
      product: 'validation'
    },
    {
      number: '02',
      icon: <Target className="w-8 h-8" />,
      title: 'Get Ready or Get Connected',
      description: 'Ready? We connect you to investors. Not ready? We\'ll refine your materials and prep you in 90 days.',
      details: [
        'Investor introductions (if ready)',
        'Gap analysis and roadmap (if not)',
        'Materials refinement',
        'Pitch training and prep'
      ],
      timeline: '1-90 days',
      product: 'both'
    },
    {
      number: '03',
      icon: <Rocket className="w-8 h-8" />,
      title: 'Raise Capital',
      description: 'Meet with investors, deliver your pitch, and close your funding round with confidence.',
      details: [
        'Investor meeting preparation',
        'Pitch delivery coaching',
        'Due diligence support',
        'Term sheet negotiation guidance'
      ],
      timeline: 'Ongoing',
      product: 'both'
    }
  ]

  return (
    <section id="process" className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Streamlined <span className="gradient-text">Process</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From assessment to investor meetings - our proven process 
            gets you funded faster with expert guidance every step of the way.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-px bg-gradient-to-r from-primary to-secondary transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative flex justify-center">
                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
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
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">{step.description}</p>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start text-sm text-gray-400">
                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                        <span className="text-left">{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="inline-flex items-center px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-sm font-medium text-primary mb-4">
                    {step.timeline}
                  </div>

                  {/* Product Tag */}
                  <div>
                    <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                      step.product === 'validation' ? 'bg-green-500/20 text-green-400 border border-green-400/20' :
                      step.product === 'prototype' ? 'bg-blue-500/20 text-blue-400 border border-blue-400/20' :
                      'bg-purple-500/20 text-purple-400 border border-purple-400/20'
                    }`}>
                    {step.product === 'validation' ? 'Assessment' :
                     step.product === 'prototype' ? '90-Day Program' :
                     'Full Journey'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection