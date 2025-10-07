import React, { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const ClutchReviewsSection = () => {
  const isMobile = useIsMobile()
  
  useEffect(() => {
    // Load Clutch widget script if not already loaded
    if (!document.querySelector('script[src="https://widget.clutch.co/static/js/widget.js"]')) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://widget.clutch.co/static/js/widget.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  const clutchBadges = [
    { 
      iframe: `<iframe width="360" height="360" src="https://clutch.co/share/badges/2552256/52366?utm_source=clutch_top_company_badge&utm_medium=ima" title="Top Clutch Ai Consulting Company Florida 2025"></iframe>`,
      title: 'Top AI Consulting Company'
    },
    { 
      iframe: `<iframe width="360" height="360" src="https://clutch.co/share/badges/2552256/68802?utm_source=clutch_top_company_badge&utm_medium=ima" title="Top Clutch Ai Deployment Company Florida 2025"></iframe>`,
      title: 'Top AI Deployment Company'
    },
    { 
      iframe: `<iframe width="360" height="360" src="https://clutch.co/share/badges/2552256/122482?utm_source=clutch_top_company_badge&utm_medium=im" title="Top Clutch Voice And Speech Recognition Company Florida 2025"></iframe>`,
      title: 'Top Voice and Speech Recognition Company'
    },
    { 
      iframe: `<iframe width="360" height="360" src="https://clutch.co/share/badges/2552256/76253?utm_source=clutch_top_company_badge&utm_medium=ima" title="Top Clutch Ai Security Management Company Florida 2025"></iframe>`,
      title: 'Top AI Security Management Company'
    }
  ]

  // Repeat badges to ensure each half of the track exceeds viewport width
  const scrollBadges = [...clutchBadges, ...clutchBadges]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Industry Recognition & Client Reviews
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recognized as a top AI company by Clutch and trusted by clients worldwide
          </p>
        </div>
      </div>

        {/* Clutch Awards Carousel - Full Width */}
        <div className="mb-16 w-full overflow-hidden">
          <div
            className="flex animate-scroll-smooth"
            style={{ 
              width: 'calc(200% + 2rem)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px',
              willChange: 'transform'
            }}
          >
            {/* First set of badges */}
            {scrollBadges.map((badge, index) => (
              <div
                key={`first-${index}`}
                className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shrink-0 mx-8 md:mx-12"
              >
                <div
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: badge.iframe }}
                />
              </div>
            ))}

            {/* Duplicate set for seamless infinite scroll */}
            {scrollBadges.map((badge, index) => (
              <div
                key={`second-${index}`}
                aria-hidden
                className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 shrink-0 mx-8 md:mx-12"
              >
                <div
                  className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:pointer-events-none"
                  dangerouslySetInnerHTML={{ __html: badge.iframe }}
                />
              </div>
            ))}
          </div>
        </div>
        
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className={isMobile ? "w-full px-4 grid place-items-center" : "max-w-4xl w-full mx-auto"}>
            <div 
              className={isMobile ? "clutch-widget w-full max-w-sm mx-auto" : "clutch-widget w-full mx-auto"}
              data-url="https://widget.clutch.co" 
              data-widget-type={isMobile ? "12" : "4"} 
              data-height={isMobile ? "320" : "auto"}
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