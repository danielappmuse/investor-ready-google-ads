import React from 'react'

const TechnologiesSection = () => {
  const techLogos = [
    { src: '/tech-logos/n8n.png', alt: 'N8n' },
    { src: '/tech-logos/openai.png', alt: 'OpenAI' },
    { src: '/tech-logos/slack.png', alt: 'Slack' },
    { src: '/tech-logos/claude.png', alt: 'Claude' },
    { src: '/tech-logos/supabase.png', alt: 'Supabase' }
  ]

  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-xl font-medium text-muted-foreground mb-2">
            Technologies we use
          </h3>
        </div>

        {/* Tech Logos Infinite Scroll - Compact Design */}
        <div className="flex justify-center">
          <div className="overflow-hidden max-w-4xl">
            <div 
              className="flex animate-scroll-smooth"
              style={{ 
                width: 'calc(200% + 2rem)',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            >
              {/* First set of logos */}
              {techLogos.map((logo, index) => (
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 mx-8 h-12 flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless infinite scroll */}
              {techLogos.map((logo, index) => (
                <div
                  key={`second-${index}`}
                  className="flex-shrink-0 mx-8 h-12 flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnologiesSection