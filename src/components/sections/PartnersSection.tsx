import React from 'react'

const PartnersSection = () => {
  const partners = [
    { src: '/media-logos/business-insider.png', alt: 'Business Insider', type: 'image' },
    { src: '/media-logos/forbes.png', alt: 'Forbes', type: 'image' },
    { src: '/media-logos/yahoo-finance.png', alt: 'Yahoo Finance', type: 'image' },
    { src: '/media-logos/globe-and-mail.png?v=5', alt: 'The Globe and Mail', type: 'image' },
    { src: '/media-logos/benzinga.png', alt: 'Benzinga', type: 'image' },
    { src: '/media-logos/barchart.png', alt: 'Barchart', type: 'image' }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            As Featured In
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recognized by leading media and financial publications
          </p>
        </div>

        <div className="flex justify-center">
          <div className="overflow-hidden max-w-6xl w-full">
            <div 
              className="flex animate-scroll-smooth"
              style={{ 
                width: 'calc(200% + 2rem)',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            >
              {/* First set of partners */}
               {partners.map((partner, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 flex items-center justify-center mx-8 transition-all duration-300 w-36"
                  >
                    <img
                      src={partner.src}
                      alt={partner.alt}
                      className={`h-28 w-auto object-contain grayscale opacity-70 hover:opacity-90 transition-all duration-300 ${partner.alt === 'The Globe and Mail' ? 'brightness-50 contrast-100' : partner.alt === 'Forbes' ? 'brightness-130 contrast-30' : 'brightness-150 contrast-75'}`}

                    />
                  </div>
               ))}
               {/* Duplicate set for seamless infinite scroll */}
               {partners.map((partner, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex-shrink-0 flex items-center justify-center mx-8 transition-all duration-300 w-36"
                  >
                    <img
                      src={partner.src}
                      alt={partner.alt}
                      className={`h-28 w-auto object-contain grayscale opacity-70 hover:opacity-90 transition-all duration-300 ${partner.alt === 'The Globe and Mail' ? 'brightness-50 contrast-100' : partner.alt === 'Forbes' ? 'brightness-130 contrast-30' : 'brightness-150 contrast-75'}`}
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

export default PartnersSection