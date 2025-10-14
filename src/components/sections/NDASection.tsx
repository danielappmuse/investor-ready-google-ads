import React from 'react';
import { Shield, Lock, FileText, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NDASectionProps {
  onAssessmentClick?: () => void;
}

const NDASection = ({ onAssessmentClick }: NDASectionProps) => {
  const securityFeatures = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Signed NDA Before We Start",
      description: "Every client engagement begins with a comprehensive Non-Disclosure Agreement to protect your intellectual property."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Encrypted Data Storage",
      description: "All your sensitive information is stored using enterprise-grade encryption and secure cloud infrastructure."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Vetted Team Only",
      description: "Only our core team of trusted professionals with signed confidentiality agreements will work on your project."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Zero Information Sharing",
      description: "We never discuss, reference, or share any details about your project with other clients or third parties."
    }
  ];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full text-sm font-medium text-white mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Your Ideas Are Safe With Us
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            <span className="gradient-text">Ironclad Confidentiality</span> Guaranteed
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We understand your startup idea is your most valuable asset. That's why we've built enterprise-level 
            security measures to protect every detail you share with us.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - NDA Promise */}
          <div className="relative z-10">
            <div className="card-glass p-8 lg:p-10 text-center">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">NDA Signed Before Discovery</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-300">100% Legal Protection</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-300">Comprehensive Non-Disclosure Agreement covering all aspects of your business</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-300">Legal enforceability with substantial penalty clauses for any breaches</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-300">Mutual protection ensuring both parties are legally bound</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-sm sm:text-base lg:text-lg text-gray-300">Immediate destruction of all materials upon project completion (if requested)</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center text-green-400 mb-3">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Our Promise to You</span>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                  "Your intellectual property is treated with the same level of security as our own. 
                  We've never had a single breach in over 5 years of operation, and we're committed to maintaining that perfect record."
                </p>
                <p className="text-gray-400 text-xs mt-3 italic">
                  - StartWise Security Team
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Security Features */}
          <div className="space-y-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="card-glass p-6 hover:border-primary/40 transition-all duration-150 text-center">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2">{feature.title}</h4>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center card-glass p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">0</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-400">Security Breaches</div>
            <div className="text-xs sm:text-sm text-green-400 mt-1">In 5+ Years</div>
          </div>
          <div className="text-center card-glass p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-400">NDA Compliance</div>
            <div className="text-xs sm:text-sm text-green-400 mt-1">Every Project</div>
          </div>
          <div className="text-center card-glass p-6">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">24hrs</div>
            <div className="text-sm sm:text-base lg:text-lg text-gray-400">Data Deletion</div>
            <div className="text-xs sm:text-sm text-green-400 mt-1">Upon Request</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={onAssessmentClick}
            size="lg"
            className="btn-hero px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold w-full sm:w-auto"
          >
            <img 
              src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" 
              alt="StartWise Logo" 
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 filter drop-shadow-sm"
              style={{ background: 'transparent' }}
            />
            <span className="truncate">Start With Complete Confidentiality</span>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 flex-shrink-0" />
          </Button>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mt-4">
            NDA signed within 24 hours • No idea is too early or too sensitive
          </p>
        </div>
      </div>
    </section>
  );
};

export default NDASection;