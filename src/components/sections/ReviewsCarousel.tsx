import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

const ReviewsCarousel = () => {
  const [currentReview, setCurrentReview] = useState(0)

  const reviews = [
    {
      company: "StartWise",
      rating: 5,
      totalReviews: 4,
      testimonial: "They were highly responsive to our needs.",
      author: "CEO, Advertising Company",
      details: "Their professionalism made the process seamless and reliable."
    },
    {
      company: "TechFlow",
      rating: 5,
      totalReviews: 8,
      testimonial: "Exceptional AI solutions that transformed our business operations.",
      author: "CTO, SaaS Company",
      details: "The team delivered beyond our expectations with innovative approaches."
    },
    {
      company: "InnovateLab",
      rating: 5,
      totalReviews: 6,
      testimonial: "Outstanding voice technology implementation and support.",
      author: "Founder, Healthcare Startup",
      details: "They've been delivering everything on time with perfect quality."
    },
    {
      company: "DataSync",
      rating: 5,
      totalReviews: 12,
      testimonial: "Perfect solution for every problem we encountered.",
      author: "CEO, Analytics Platform",
      details: "Their expertise in AI deployment is unmatched in the industry."
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [reviews.length])

  const currentReviewData = reviews[currentReview]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Client Success Stories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our clients say about working with us
          </p>
        </div>

        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-8 transition-all duration-500 hover:shadow-xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-lg mb-4">
                  Clutch
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {currentReviewData.company}
                </h3>
                
                {/* Stars and Reviews */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentReviewData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-primary font-medium">
                    {currentReviewData.totalReviews} reviews
                  </span>
                </div>
              </div>

              {/* Main Testimonial */}
              <div className="space-y-4 text-center">
                <blockquote className="text-lg font-medium text-foreground leading-relaxed">
                  "{currentReviewData.testimonial}"
                </blockquote>
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">{currentReviewData.author}</p>
                </div>

                <blockquote className="text-base text-muted-foreground italic">
                  "{currentReviewData.details}"
                </blockquote>
              </div>

              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentReview
                        ? 'bg-primary scale-110'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewsCarousel