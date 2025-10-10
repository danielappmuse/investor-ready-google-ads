import React, { useEffect } from 'react'
import { ContactFormData } from '@/types/form'
import { trackCalendlyOpen, trackCalendlyConversion } from '@/utils/posthog'
import { trackCalendlyConversion as trackGoogleCalendlyConversion } from '@/utils/googleAds'

interface CalendlyWidgetProps {
  formData: ContactFormData
}

const CalendlyWidget = ({ formData }: CalendlyWidgetProps) => {
  const [isMobile, setIsMobile] = React.useState(false)

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    // Track Calendly widget load
    trackCalendlyOpen()

    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        if (e.data.event === 'calendly.event_scheduled') {
          trackCalendlyConversion()
          trackGoogleCalendlyConversion()
        }
      }
    }

    window.addEventListener('message', handleCalendlyEvent)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      window.removeEventListener('message', handleCalendlyEvent)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Build Calendly URL with prefilled data
  const nameParts = formData.full_name.split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  const phoneClean = formData.phone.replace(/^\+1/, '')
  
  const calendlyUrl = `https://calendly.com/startnow-start-wise/30min?` + 
    `name=${encodeURIComponent(firstName)}&` +
    `last_name=${encodeURIComponent(lastName)}&` +
    `email=${encodeURIComponent(formData.email)}&` +
    `a1=${encodeURIComponent('1' + phoneClean)}&` +
    `a2=${encodeURIComponent(formData.project_stage || '')}&` +
    `a3=${encodeURIComponent(formData.investment_readiness || '')}&` +
    `a4=${encodeURIComponent(formData.app_idea || '')}&` +
    `hide_gdpr_banner=1`

  return (
    <div className="card-glass p-3 sm:p-4 lg:p-6">
      <div 
        className="calendly-inline-widget w-full" 
        data-url={calendlyUrl}
        style={{ 
          minWidth: '100%', 
          width: '100%',
          height: isMobile ? '500px' : '630px'
        }}
      />
    </div>
  )
}

export default CalendlyWidget