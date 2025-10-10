import React, { useState, useEffect } from 'react'
import { Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onPrototypeClick?: () => void
}

const Header = ({ onPrototypeClick }: HeaderProps = {}) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    console.log(`Attempting to scroll to section: ${id}`)
    
    // Wait for the DOM to be ready
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        console.log(`Found element with id '${id}', scrolling...`)
        // Add offset to account for fixed header
        const headerHeight = 100
        const elementPosition = element.offsetTop - headerHeight
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
        
        console.log(`Scrolled to position: ${elementPosition}`)
      } else {
        console.log(`Element with id '${id}' not found`)
        // Try scrolling to top as fallback
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })
            }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" 
                alt="StartWise Logo" 
                className="w-full h-full object-contain filter drop-shadow-lg"
                style={{ background: 'transparent' }}
              />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">StartWise</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <button 
              onClick={() => scrollToSection('services')}
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors font-medium"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('portfolio')}
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors font-medium"
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-sm lg:text-base text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Phone Number & CTA */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <a 
              href="tel:+17868291382" 
              className="hidden lg:flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+1 (786) 829-1382</span>
            </a>
            <Button 
              onClick={onPrototypeClick || (() => scrollToSection('contact'))}
              className="btn-hero text-xs sm:text-sm px-3 py-2 lg:px-4 lg:py-3"
            >
              <img 
                src="/lovable-uploads/8b2a4c58-718e-474a-b6f2-dbdb39fd77b5.png" 
                alt="StartWise Logo" 
                className="w-4 h-4 mr-2 filter drop-shadow-sm"
                style={{ background: 'transparent' }}
              />
              Get Started
              <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Call Button */}
          <a
            href="tel:+17868291382"
            className="md:hidden p-1.5 bg-gradient-to-br from-primary to-secondary rounded-full hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label="Call us now"
          >
            <Phone className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header