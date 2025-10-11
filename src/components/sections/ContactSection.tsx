import React, { useState } from 'react'
import { CheckCircle, Phone, Mail, MapPin } from 'lucide-react'
import InvestmentReadinessForm from '@/components/forms/InvestmentReadinessForm'
import CalendlyWidget from '@/components/CalendlyWidget'
import { ContactFormData } from '@/types/form'

const ContactSection = () => {
  const [showCalendly, setShowCalendly] = useState(false)
  const [formData, setFormData] = useState<ContactFormData | null>(null)

  const handleFormSuccess = (data: ContactFormData) => {
    setFormData(data)
    setShowCalendly(true)
  }


  return (
    <section id="contact" className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {!showCalendly ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 sm:mb-8 text-center">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-xs sm:text-sm font-medium text-white mb-4 sm:mb-6">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                90-Day Investment Readiness Program
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Get <span className="gradient-text">Investment-Ready</span> under 90 Days
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                Complete our Investment Readiness Assessment to get a personalized roadmap 
                and discover exactly what you need to secure funding.
              </p>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8 mb-6 sm:mb-8">
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base">+1 (786) 829-1382</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base">support@start-wise.io</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base">1001 Brickell Bay Dr 33131</span>
                </div>
              </div>
            </div>

            <InvestmentReadinessForm onSuccess={handleFormSuccess} formLocation="bottom" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-xs sm:text-sm font-medium text-green-400 mb-3 sm:mb-4">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                Form Submitted Successfully!
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                Schedule Your Free Consultation
              </h2>
              <p className="text-sm sm:text-base text-gray-300">
                Thank you {formData?.full_name}! Let's discuss your startup and 
                create a roadmap for success.
              </p>
            </div>
            
            <CalendlyWidget formData={formData!} />
          </div>
        )}
      </div>
    </section>
  )
}

export default ContactSection