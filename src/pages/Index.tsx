import React, { useState } from 'react'
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

const Index = () => {
  const [startWithValidation, setStartWithValidation] = useState(false)
  const [startWithPrototype, setStartWithPrototype] = useState(false)
  const [currentView, setCurrentView] = useState<'products' | 'prototype-form' | 'calendly'>('products')

  const handleValidationClick = () => {
    setStartWithValidation(true)
    setStartWithPrototype(false)
  }

  const handlePrototypeClick = () => {
    setStartWithPrototype(true)
    setStartWithValidation(false)
    setCurrentView('prototype-form')
  }

  return (
    <Layout onPrototypeClick={handlePrototypeClick}>
      <HeroSection 
        startWithPrototype={startWithPrototype}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {currentView === 'products' && (
        <>
          <ClutchReviewsSection />
          <PartnersSection />
          <ProjectCarousel />
          <TechnologiesSection />
          <AboutSection />
          <ServicesSection 
            onValidationClick={handleValidationClick} 
            onPrototypeClick={handlePrototypeClick}
          />
          <NDASection onAssessmentClick={handlePrototypeClick} />
          <ProcessSection />
          <EssentialsSection onValidationClick={handlePrototypeClick} />
          <ContactSection onAssessmentClick={handlePrototypeClick} />
        </>
      )}
    </Layout>
  )
}

export default Index
