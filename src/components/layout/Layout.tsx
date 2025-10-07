import React, { useEffect } from 'react'
import Header from './Header'
import { Toaster } from '@/components/ui/toaster'
import { initPostHog, trackPageView } from '@/utils/posthog'
import { initGoogleAds } from '@/utils/googleAds'

interface LayoutProps {
  children: React.ReactNode
  onPrototypeClick?: () => void
}

const Layout = ({ children, onPrototypeClick }: LayoutProps) => {
  useEffect(() => {
    // Initialize tracking
    initPostHog()
    initGoogleAds()
    trackPageView()

    // Keyword highlighting
    const params = new URLSearchParams(window.location.search)
    const keyword = params.get('keyword')?.toLowerCase()
    
    if (keyword) {
      const serviceMap: { [key: string]: string } = {
        'feasibility': 'service-feasibility-exam',
        'business plan': 'service-business-logic', 
        'ui ux': 'service-uiux',
        'mvp development': 'service-mvp-dev'
      }
      
      // Delay to ensure DOM is ready
      setTimeout(() => {
        Object.entries(serviceMap).forEach(([key, serviceId]) => {
          if (keyword.includes(key)) {
            const element = document.getElementById(serviceId)
            element?.classList.add('highlight')
          }
        })
      }, 1000)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onPrototypeClick={onPrototypeClick} />
      
      <main className="relative">
        {children}
      </main>
      
      <Toaster />
    </div>
  )
}

export default Layout