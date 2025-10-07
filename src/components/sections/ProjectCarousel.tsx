import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Star, TrendingUp, Target, Code, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ProjectCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const successStories = [{
    id: 1,
    title: 'Safe Range - Electric Vehicle Companion',
    category: 'Mobile App Development',
    type: 'prototype',
    description: 'Building an Electric Vehicle Companion App with real-time charging station finder, battery monitoring, and trip optimization.',
    image: '/lovable-uploads/12eb2ee4-ed84-47e9-ab2e-42d51295470a.png',
    outcome: 'Launched Successfully',
    timeline: '8 weeks',
    price: '$25,000',
    results: ['Real-time charging station finder', 'Battery health monitoring', 'Trip optimization algorithms', 'User-friendly interface design'],
    testimonial: 'Start-wise delivered exactly what we needed - a professional EV companion that our users love.',
    client: 'Safe Range Team'
  }, {
    id: 2,
    title: 'JOB2DAY - Job Matching Platform',
    category: 'Marketplace Development',
    type: 'both',
    description: 'Developing an Application for Streamlined Job Searching with AI-powered matching and real-time notifications.',
    image: '/lovable-uploads/e3c3c871-5edb-4a12-b913-23d8be24ff87.png',
    outcome: '500+ Active Users',
    timeline: '12 weeks',
    price: '$35,000',
    results: ['AI-powered job matching', 'Real-time notifications', 'Advanced search filters', 'Multi-language support'],
    testimonial: 'The platform exceeded our expectations. The job matching feature is incredibly accurate.',
    client: 'JOB2DAY Founders'
  }, {
    id: 3,
    title: 'DREAM Cybersecurity Platform',
    category: 'Enterprise Security',
    type: 'prototype',
    description: 'Building a Website for a Largest Cybersecurity Company in Israel with AI-powered threat detection and prevention.',
    image: '/lovable-uploads/aac38dca-545d-4278-914c-16f5948da7fe.png',
    outcome: 'Enterprise Ready',
    timeline: '16 weeks',
    price: '$45,000',
    results: ['AI threat detection system', 'Real-time security monitoring', 'Compliance dashboard', 'Advanced reporting tools'],
    testimonial: 'Start-wise built us an enterprise-grade security platform that rivals industry leaders.',
    client: 'DREAM Cybersecurity Team'
  }, {
    id: 4,
    title: 'Get-Fit AI - Fitness & Nutrition',
    category: 'Health & Fitness',
    type: 'both',
    description: 'Developing a Fitness and Nutrition App Powered by AI with personalized workout plans and meal recommendations.',
    image: '/lovable-uploads/aba1b2e7-e1c3-41bc-bdf8-21210712df47.png',
    outcome: '1000+ Downloads',
    timeline: '10 weeks',
    price: '$28,000',
    results: ['AI workout generation', 'Personalized nutrition plans', 'Progress tracking system', 'Social fitness challenges'],
    testimonial: 'The AI coaching feels like having a personal trainer. Users are amazed by the personalization.',
    client: 'Get-Fit AI Startup'
  }, {
    id: 5,
    title: 'LEGOS Marketing Platform',
    category: 'Marketing Automation',
    type: 'prototype',
    description: 'Developing an App to Manage Marketing Campaigns with automated workflows and performance analytics.',
    image: '/lovable-uploads/77a57e21-2fbf-4b9c-901b-43545bf33030.png',
    outcome: '300% ROI Increase',
    timeline: '14 weeks',
    price: '$40,000',
    results: ['Campaign automation', 'Performance analytics', 'Multi-channel management', 'Lead generation tools'],
    testimonial: 'Our marketing ROI increased by 300% within the first quarter using this platform.',
    client: 'LEGOS Marketing Agency'
  }, {
    id: 6,
    title: 'Eventify - Event Management',
    category: 'Event Platform',
    type: 'both',
    description: 'Building an Event Management Platform with powerful filters, 5000+ events database, and stress-free booking.',
    image: '/lovable-uploads/22f5a434-8864-46c4-8290-f999797d9f6d.png',
    outcome: '50+ Events Managed',
    timeline: '12 weeks',
    price: '$32,000',
    results: ['Advanced filtering system', '5000+ events database', 'Automated booking process', 'Real-time availability'],
    testimonial: 'Managing events has never been easier. The platform handles everything seamlessly.',
    client: 'Eventify Event Organizers'
  }, {
    id: 7,
    title: 'Spacemize - Remote Workspaces',
    category: 'PropTech Solution',
    type: 'prototype',
    description: 'Building a Platform for Managing Remote Workspaces with space booking, availability tracking, and optimization.',
    image: '/lovable-uploads/bd130669-36f5-48d9-8854-66570a7af6a4.png',
    outcome: '40% Space Efficiency',
    timeline: '18 weeks',
    price: '$50,000',
    results: ['Space booking system', 'Real-time availability', 'Usage optimization', 'Location management'],
    testimonial: 'Spacemize helped us optimize our workspace usage and reduce costs by 40%. Incredible results.',
    client: 'Spacemize Commercial Team'
  }];
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % successStories.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + successStories.length) % successStories.length);
  };
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000); // Auto-advance every 8 seconds
    return () => clearInterval(timer);
  }, []);
  return <section id="portfolio" className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-sm font-medium text-white mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Real Success Stories
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From <span className="gradient-text">Validation</span> to <span className="gradient-text">Success</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Our clients and work</p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-500 ease-out" style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}>
              {successStories.map((story, index) => <div key={story.id} className="w-full flex-shrink-0 px-3 md:px-6">
                  <div className="card-glass p-4 md:p-8 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-fit">
                      {/* Story Image */}
                      <div className="relative order-1 lg:order-none">
                        <div className="aspect-square overflow-hidden rounded-xl min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
                          <img src={story.image} alt={story.title} className="w-full h-full object-contain" loading="lazy" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 md:px-4 md:py-2 bg-black/70 backdrop-blur-sm text-white text-xs md:text-sm rounded-full font-medium">
                            {story.category}
                          </span>
                        </div>
                      </div>

                      {/* Story Details */}
                      <div className="space-y-4 md:space-y-6 order-2 lg:order-none pl-4 pr-2 md:px-0 h-full flex flex-col justify-center">
                        <div className="space-y-3 md:space-y-4">
                          <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 lg:mb-4 leading-tight break-words hyphens-auto">
                            {story.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg break-words overflow-wrap-anywhere hyphens-auto">
                            {story.description}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevSlide} className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 z-10">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button onClick={nextSlide} className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 z-10">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6 lg:mt-8 px-4">
            {successStories.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-primary' : 'bg-gray-600 hover:bg-gray-500'}`} />)}
          </div>
        </div>
      </div>
    </section>;
};
export default ProjectCarousel;