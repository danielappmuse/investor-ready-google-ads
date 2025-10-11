import React, { useEffect, useState } from 'react'
import HeroSectionCRO from '@/components/sections/HeroSectionCRO'
import ProjectCarousel from '@/components/sections/ProjectCarousel'
import ServicesSection from '@/components/sections/ServicesSection'
import NDASection from '@/components/sections/NDASection'
import EssentialsSection from '@/components/sections/EssentialsSection'
import ProcessSection from '@/components/sections/ProcessSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import ClutchReviewsSection from '@/components/sections/ClutchReviewsSection'
import TechnologiesSection from '@/components/sections/TechnologiesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import Layout from '@/components/layout/Layout'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'

const CROIndex = () => {
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null)
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false)
  const [startWithValidation, setStartWithValidation] = useState(false)
  const [startWithPrototype, setStartWithPrototype] = useState(false)

  const handleValidationClick = () => {
    setStartWithValidation(true)
    setStartWithPrototype(false)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handlePrototypeClick = () => {
    setStartWithPrototype(true)
    setStartWithValidation(false)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const payment = urlParams.get('payment')
    
    if (payment === 'success') {
      setPaymentStatus('success')
      handlePaymentSuccess()
    } else if (payment === 'cancelled') {
      setPaymentStatus('cancelled')
    }
  }, [])

  const handlePaymentSuccess = async () => {
    setIsProcessingSuccess(true)
    
    try {
      const savedState = localStorage.getItem('validation_onboarding_state')
      
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        const { currentStep, ...onboardingData } = parsedState
        
        const urlParams = new URLSearchParams(window.location.search)
        const sessionId = urlParams.get('session_id')
        
        if (sessionId) {
          const { data, error } = await supabase.functions.invoke('save-lead-data', {
            body: {
              onboardingData: onboardingData,
              sessionId: sessionId
            }
          })

          if (!error) {
            localStorage.removeItem('validation_onboarding_state')
          }
        }
      }
    } catch (error) {
      console.error('Error processing payment success:', error)
    } finally {
      setIsProcessingSuccess(false)
    }
  }

  const dismissPaymentStatus = () => {
    setPaymentStatus(null)
    const url = new URL(window.location.href)
    url.searchParams.delete('payment')
    url.searchParams.delete('session_id')
    window.history.replaceState({}, '', url.toString())
  }

  if (paymentStatus) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-card/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-border/50">
            {paymentStatus === 'success' ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Assessment Confirmed!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for applying! Our team of VC-backed founders and investors will review your startup and contact you within 48 hours to schedule your investor-readiness interview.
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Payment Cancelled
                </h1>
                <p className="text-muted-foreground mb-6">
                  Your payment was cancelled. No charges were made to your account.
                </p>
              </>
            )}
            
            <Button 
              onClick={dismissPaymentStatus}
              disabled={isProcessingSuccess}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onPrototypeClick={handlePrototypeClick}>
      <HeroSectionCRO 
        startWithPrototype={startWithPrototype}
      />
      <PartnersSection />
      <ProjectCarousel />
      <TechnologiesSection />
      <AboutSection />
      <ServicesSection 
        onValidationClick={handleValidationClick} 
        onPrototypeClick={handlePrototypeClick}
      />
      <NDASection />
      <ProcessSection />
      <EssentialsSection onValidationClick={handleValidationClick} />
      <ClutchReviewsSection />
      <ContactSection />
    </Layout>
  )
}

export default CROIndex
