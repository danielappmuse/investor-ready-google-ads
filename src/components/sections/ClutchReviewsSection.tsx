import React, { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import clutchBadge from '@/assets/clutch-badge.png'

const ClutchReviewsSection = () => {
  const isMobile = useIsMobile()
  
  useEffect(() => {
    const initClutch = () => {
      // Some builds need manual init for widgets already in DOM
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).CLUTCHCO?.Init?.()
    }

    const existing = document.querySelector(
      'script[src="https://widget.clutch.co/static/js/widget.js"]'
    ) as HTMLScriptElement | null

    if (existing) {
      initClutch()
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://widget.clutch.co/static/js/widget.js'
    script.async = true
    script.onload = initClutch
    document.head.appendChild(script)
  }, [])


  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Industry Recognition & Client Reviews
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Recognized as a top AI company by Clutch and trusted by clients worldwide
          </p>
        </div>
      </div>

        {/* Clutch Badge */}
        <div className="mb-16 flex justify-center">
          <img 
            src={clutchBadge} 
            alt="Top Clutch AI Consulting Company Florida 2025" 
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
          />
        </div>
        
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className={isMobile ? "w-full px-4 grid place-items-center" : "max-w-4xl w-full mx-auto"}>
            <div 
              className={isMobile ? "clutch-widget w-full max-w-sm mx-auto" : "clutch-widget w-full mx-auto"}
              data-url="https://widget.clutch.co" 
              data-widget-type={isMobile ? "12" : "4"} 
              data-height={isMobile ? "320" : "560"}
              data-nofollow="false" 
              data-expandifr="true" 
              data-scale="100"
              data-reviews="403733,403667,402821,400517" 
              data-clutchcompany-id="2552256"
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClutchReviewsSection