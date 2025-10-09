import React from 'react';

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100
  const progressPercent = Math.round(progress)

  return (
    <div className="fixed top-14 sm:top-16 lg:top-20 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2 sm:gap-4">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground break-words">
            Investor-Readiness Assessment
          </h2>
          <span className="text-xs sm:text-sm font-medium text-foreground bg-card/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-border/50 whitespace-nowrap self-start sm:self-auto">
            Step {currentStep} of {totalSteps} • {progressPercent}%
          </span>
        </div>
        
        <div className="relative h-2 sm:h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out glow"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}