import React from 'react';
import { CheckCircle, Users, Award, Target, Zap, Cpu, Database, Shield, Code2, Rocket } from 'lucide-react';
const AboutSection = () => {
  const teamMembers = [{
    name: 'Alon Krupitsky',
    role: 'CTO & CMO',
    image: '/lovable-uploads/37822371-b0e5-425f-b7e0-34af530ed61d.png',
    bio: '10+ years of experince with marketing and launched over 100 projects'
  }, {
    name: 'Daniel Koren',
    role: 'CEO',
    image: '/lovable-uploads/7b791841-8b4b-4242-acc3-1b478ffed2b8.png',
    bio: 'Helped raise millions of dollars and made over $20M+ in sales'
  }];
  const achievements = [{
    icon: <Award className="w-6 h-6" />,
    title: 'Forbes Agency Council',
    description: '2025 Official Member',
    highlight: true
  }, {
    icon: <Users className="w-6 h-6" />,
    title: '200+ Startups',
    description: 'Successfully validated and launched',
    highlight: false
  }, {
    icon: <Target className="w-6 h-6" />,
    title: '99% Accuracy',
    description: 'Market validation success rate',
    highlight: false
  }, {
    icon: <Zap className="w-6 h-6" />,
    title: '$50M+ Raised',
    description: 'By our portfolio companies',
    highlight: false
  }];
  return <section id="about" className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            Meet Our Team
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            The <span className="gradient-text">Team</span> Behind StartWise
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're not just consultants — we're founders who've been in your shoes. 
            Our team combines real startup experience with proven methodologies to guide your success.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Team Photo & Forbes Badge */}
          <div className="space-y-6 sm:space-y-8">
            {/* Team Photo */}
            <div className="relative">
              <img src="/lovable-uploads/1050e5f3-ee51-4974-8552-2c1005e0691f.png" alt="StartWise team collaborating in the office" className="w-full rounded-2xl shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>

            {/* Forbes Badge */}
            <div className="flex justify-center">
              <div className="card-glass p-4 sm:p-6 inline-flex items-center space-x-4 rounded-xl">
                <img src="/lovable-uploads/7104bb15-7ae8-41a9-a71b-b8b04037b57f.png" alt="Forbes Agency Council 2025 Official Member" className="h-24 sm:h-16 lg:h-32 w-auto" />
                <div>
                  <div className="text-sm sm:text-base font-semibold text-white">Forbes Recognition</div>
                  <div className="text-xs sm:text-sm text-gray-400">Agency Council Member 2025</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Team Members */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-white text-center xl:text-left">
              Meet the Founders
            </h3>
            
            {teamMembers.map((member, index) => <div key={index} className="card-glass p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <img src={member.image} alt={member.name} className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full object-cover flex-shrink-0 border-4 border-primary/20" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">{member.name}</h4>
                    <p className="text-primary font-semibold mb-3">{member.role}</p>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {/* Office Section */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Miami Office</span>
            </h3>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Located in the heart of Miami's business district, our office reflects our commitment to innovation and excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <img src="/lovable-uploads/d94d8748-2a47-41e1-84eb-9614ad4f90e3.png" alt="Miami skyline view from StartWise office" className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl" />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <img src="/lovable-uploads/b1fb67df-159c-45b8-862f-8655fa99dfae.png" alt="StartWise office building exterior" className="w-full h-30 sm:h-36 lg:h-44 object-cover rounded-2xl shadow-xl" />
              <img src="/lovable-uploads/d6e0eeb6-0ae7-40a9-8a65-235ceb2eb0ee.png" alt="Modern Miami office building with palm trees" className="w-full h-30 sm:h-36 lg:h-44 object-cover rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 lg:mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="card-glass p-6 sm:p-8 lg:p-10">
              <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
                Why Choose <span className="gradient-text">StartWise?</span>
              </h4>
              
              {/* TechElements Content */}
              <div className="relative mb-8">
                {/* Tech Grid Background */}
                <div className="absolute inset-0 tech-grid opacity-20" />
                
                {/* Holographic Border Effect */}
                <div className="absolute inset-0 holographic-border rounded-2xl" />
                
                {/* Content */}
                <div className="relative p-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Powered by Advanced Technology
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Cutting-edge tools for startup success
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Cpu, label: 'AI Analysis', description: 'Advanced machine learning algorithms' },
                      { icon: Zap, label: 'Real-time Processing', description: 'Instant market validation' },
                      { icon: Database, label: 'Big Data Insights', description: 'Comprehensive market data' },
                      { icon: Shield, label: 'Secure Infrastructure', description: 'Enterprise-grade security' },
                      { icon: Code2, label: 'Custom Development', description: 'Tailored solutions' },
                      { icon: Rocket, label: 'Fast Deployment', description: 'Rapid prototype delivery' }
                    ].map((feature, index) => (
                      <div 
                        key={feature.label}
                        className={`group p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 animate-fade-in stagger-${index % 3 + 1} text-center`}
                      >
                        <div className="flex items-center space-x-2">
                          <feature.icon className="w-4 h-4 text-primary group-hover:animate-pulse" />
                          <div>
                            <div className="text-white text-xs font-medium">{feature.label}</div>
                            <div className="text-gray-400 text-xs">{feature.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Data Streams */}
                  <div className="space-y-2">
                    <div className="data-stream" />
                    <div className="data-stream" style={{ animationDelay: '1s' }} />
                    <div className="data-stream" style={{ animationDelay: '2s' }} />
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="particle"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + i * 10}%`,
                          animationDelay: `${i * 1.2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-300">Real founders who understand the startup journey</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-300">Proven track record with 200+ successful validations</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-300">Forbes-recognized expertise in startup development</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-300">100% money-back guarantee on all services</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;