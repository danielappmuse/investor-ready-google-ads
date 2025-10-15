import React from 'react'
import { CheckCircle, Phone, Mail, MapPin, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactSectionProps {
  onAssessmentClick?: () => void
}

const ContactSection = ({ onAssessmentClick }: ContactSectionProps) => {


  return (
    <section id="contact" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 tech-grid opacity-5" />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
              90-Day Investment Readiness Program
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get <span className="gradient-text">Investment-Ready?</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8">
              Start your journey to securing funding. Complete our assessment and get a personalized roadmap tailored to your startup.
            </p>

            {/* CTA Button */}
            <Button 
              onClick={onAssessmentClick}
              className="btn-hero w-full max-w-2xl mx-auto text-[15.5px] sm:text-[21.5px] font-extrabold py-3.5 sm:py-6 rounded-xl animate-cta-pulse group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-3 leading-tight">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse flex-shrink-0" />
                <span className="text-center">Start Your Assessment Now!</span>
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </span>
            </Button>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 mt-8">
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-lg sm:text-base">+1 (786) 829-1382</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-lg sm:text-base">support@start-wise.io</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-lg sm:text-base">1001 Brickell Bay Dr 33131</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection