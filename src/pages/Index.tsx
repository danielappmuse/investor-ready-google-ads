import React, { useEffect, useState } from 'react'
import HeroSection from '@/components/sections/HeroSection'
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

const Index = () => {
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null)
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false)
  const [startWithValidation, setStartWithValidation] = useState(false)
  const [startWithPrototype, setStartWithPrototype] = useState(false)

  const handleValidationClick = () => {
    setStartWithValidation(true)
    setStartWithPrototype(false)
    // Scroll to hero section to show validation onboarding
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handlePrototypeClick = () => {
    setStartWithPrototype(true)
    setStartWithValidation(false)
    // Scroll to hero section to show prototype consultation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const payment = urlParams.get('payment')
    const sessionId = urlParams.get('session_id')
    
    console.log('Index useEffect - Full URL:', window.location.href)
    console.log('Index useEffect - URL search params:', window.location.search)
    console.log('Index useEffect - All URL params:', Object.fromEntries(urlParams.entries()))
    console.log('Index useEffect - payment status:', payment)
    console.log('Index useEffect - session_id:', sessionId)
    
    if (payment === 'success') {
      console.log('Payment success detected, setting status and handling...')
      setPaymentStatus('success')
      handlePaymentSuccess()
    } else if (payment === 'cancelled') {
      console.log('Payment cancelled detected')
      setPaymentStatus('cancelled')
    }
  }, [])

  const handlePaymentSuccess = async () => {
    console.log('handlePaymentSuccess called - starting processing...')
    setIsProcessingSuccess(true)
    
    try {
      // Get the saved onboarding data from localStorage
      const savedState = localStorage.getItem('validation_onboarding_state')
      console.log('Saved state from localStorage:', savedState)
      
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        console.log('Parsed state:', parsedState)
        const { currentStep, ...onboardingData } = parsedState
        console.log('Extracted onboarding data:', onboardingData)
        
        // Get the session_id from URL (Stripe adds this parameter)
        const urlParams = new URLSearchParams(window.location.search)
        const sessionId = urlParams.get('session_id')
        console.log('Session ID from URL:', sessionId)
        
        if (sessionId) {
          console.log('Both data and session ID found - calling save-lead-data function...')
          
          // Call save-lead-data function with session ID
          const { data, error } = await supabase.functions.invoke('save-lead-data', {
            body: {
              onboardingData: onboardingData,
              sessionId: sessionId
            }
          })

          console.log('save-lead-data response:', { data, error })

          if (error) {
            console.error('Error saving lead data:', error)
          } else {
            console.log('Lead data saved successfully:', data)
            // Clear the saved onboarding data
            localStorage.removeItem('validation_onboarding_state')
          }
        } else {
          console.error('No session ID found in URL parameters')
        }
      } else {
        console.error('No saved onboarding data found in localStorage')
      }
    } catch (error) {
      console.error('Error processing payment success:', error)
    } finally {
      setIsProcessingSuccess(false)
    }
  }

  const dismissPaymentStatus = () => {
    setPaymentStatus(null)
    // Clean up URL parameters
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
      <HeroSection 
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

export default Index
