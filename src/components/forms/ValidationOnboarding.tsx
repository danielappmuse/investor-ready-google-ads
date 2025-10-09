import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { formatPhoneNumber } from '@/utils/formValidation'

const validationSchema = z.object({
  name: z.string().min(2, 'Please enter your full name').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters'),
  phone: z.string().min(1, 'Phone number is required').refine((phone) => {
    if (!phone) return false
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 11) return false
    if (!digits.startsWith('1')) return false
    const areaCode = digits.substring(1, 4)
    if (areaCode[0] === '0' || areaCode[0] === '1') return false
    const exchangeCode = digits.substring(4, 7)
    if (exchangeCode[0] === '0' || exchangeCode[0] === '1') return false
    return true
  }, 'Please enter a valid US phone number'),
  projectDuration: z.string().min(1, 'Please tell us how long you have been working on this project'),
  teamSize: z.string().min(1, 'Please tell us your team size'),
  moneyInvested: z.string().min(1, 'Please tell us how much money was invested'),
  completedItems: z.array(z.string()).min(1, 'Please select at least one completed item')
})

export interface ValidationOnboardingData {
  name: string
  email: string
  phone: string
  projectDuration: string
  teamSize: string
  moneyInvested: string
  completedItems: string[]
}

interface ValidationOnboardingProps {
  onComplete: (data: ValidationOnboardingData) => void
  onBack: () => void
}

const ValidationOnboarding: React.FC<ValidationOnboardingProps> = ({ onComplete, onBack }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const totalSteps = 3

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
    trigger
  } = useForm<ValidationOnboardingData>({
    resolver: zodResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      completedItems: []
    }
  })

  const watchedFields = watch()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted)
    trigger('phone')
  }

  // Auto-save to localStorage
  useEffect(() => {
    const formData = JSON.stringify({ ...watchedFields, currentStep })
    localStorage.setItem('validation_onboarding_state', formData)
  }, [watchedFields, currentStep])

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem('validation_onboarding_state')
    if (savedState) {
      try {
        const { currentStep: savedStep, ...savedData } = JSON.parse(savedState)
        Object.keys(savedData).forEach(key => {
          if (savedData[key] !== undefined) {
            setValue(key as keyof ValidationOnboardingData, savedData[key])
          }
        })
        setCurrentStep(savedStep || 1)
      } catch (error) {
        console.error('Failed to load saved state:', error)
      }
    }
  }, [setValue])

  const advanceStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setIsTransitioning(false)
      }, 220)
    }
  }, [currentStep, totalSteps])

  const toggleCompletedItem = (value: string) => {
    const currentArray = watchedFields.completedItems || []
    
    if (currentArray.includes(value)) {
      setValue('completedItems', currentArray.filter(item => item !== value))
    } else {
      setValue('completedItems', [...currentArray, value])
    }
    trigger('completedItems')
  }

  const onSubmit = async (data: ValidationOnboardingData) => {
    console.log('Form submitted:', data)
    const isValid = await trigger()
    if (isValid) {
      onComplete(getValues())
    }
  }

  const completedItemsList = [
    'Marketing Research',
    'Business Plan',
    'Business Model',
    'Product Requirements Document (PRD)',
    'UI/UX/Prototype',
    'MVP',
    'One Pager',
    'Pitch Deck',
    'Deal Terms',
    'Legal'
  ]

  const renderStep = () => {
    const containerClass = `
      relative w-full flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12
      transition-all duration-220 ease-out transform
      ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
    `

    switch (currentStep) {
      case 1:
        return (
          <div className={containerClass}>
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="w-full max-w-xl mx-auto text-center space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Let's Get Started
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  First, we need your basic details
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Input
                    {...register('name')}
                    placeholder="Full Name"
                    className="text-base py-3 bg-card/50 border-2 border-border/50 focus:border-primary rounded-xl"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-2">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Email Address"
                    className="text-base py-3 bg-card/50 border-2 border-border/50 focus:border-primary rounded-xl"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-2">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    type="tel"
                    onChange={handlePhoneChange}
                    value={watchedFields.phone || ''}
                    placeholder="Phone Number: +1 (555) 123-4567"
                    className="text-base py-3 bg-card/50 border-2 border-border/50 focus:border-primary rounded-xl"
                    maxLength={17}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-2">{errors.phone.message}</p>
                  )}
                </div>
                
                {watchedFields.name && watchedFields.email && watchedFields.phone && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={async () => {
                        const isValid = await trigger(['name', 'email', 'phone'])
                        if (isValid) {
                          advanceStep()
                        }
                      }} 
                      size="lg"
                      className="px-8 py-3 text-base font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all"
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className={containerClass}>
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="w-full max-w-xl mx-auto text-center space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                  About Your Project
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Tell us about your startup journey
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Input
                    {...register('projectDuration')}
                    placeholder="How long have you been working on this project?"
                    className="text-base py-3 bg-card/50 border-2 border-border/50 focus:border-primary rounded-xl"
                  />
                  {errors.projectDuration && (
                    <p className="text-destructive text-sm mt-2">{errors.projectDuration.message}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    {...register('teamSize')}
                    placeholder="What is the size of your current team?"
                    className="text-base py-3 bg-card/50 border-2 border-border/50 focus:border-primary rounded-xl"
                  />
                  {errors.teamSize && (
                    <p className="text-destructive text-sm mt-2">{errors.teamSize.message}</p>
                  )}
                </div>
                
                <div>
                  <Input
                    {...register('moneyInvested')}
                    placeholder="How much money was invested so far? (overall)"
                    className="text-base py-3 bg-card/50 border-2 border-border/50 focus:border-primary rounded-xl"
                  />
                  {errors.moneyInvested && (
                    <p className="text-destructive text-sm mt-2">{errors.moneyInvested.message}</p>
                  )}
                </div>
                
                {watchedFields.projectDuration && watchedFields.teamSize && watchedFields.moneyInvested && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={async () => {
                        const isValid = await trigger(['projectDuration', 'teamSize', 'moneyInvested'])
                        if (isValid) {
                          advanceStep()
                        }
                      }} 
                      size="lg"
                      className="px-8 py-3 text-base font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all"
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className={containerClass}>
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={() => setCurrentStep(prev => prev - 1)}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            
            <div className="w-full max-w-2xl mx-auto text-center space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                  What Have You Completed?
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-6">
                  Select all that apply (you can select multiple options)
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedItemsList.map((item) => (
                  <div
                    key={item}
                    onClick={() => toggleCompletedItem(item)}
                    className={`
                      flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${watchedFields.completedItems?.includes(item)
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card/50 border-border/50 hover:border-primary/50'
                      }
                    `}
                  >
                    <Checkbox
                      checked={watchedFields.completedItems?.includes(item)}
                      onCheckedChange={() => toggleCompletedItem(item)}
                      className="pointer-events-none"
                    />
                    <label className="text-sm font-medium cursor-pointer flex-1 text-left">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              
              {errors.completedItems && (
                <p className="text-destructive text-sm mt-2">{errors.completedItems.message}</p>
              )}
              
              {watchedFields.completedItems && watchedFields.completedItems.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={async () => {
                      const isValid = await trigger()
                      if (isValid) {
                        onSubmit(getValues())
                      }
                    }} 
                    size="lg"
                    className="px-8 py-3 text-base font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all"
                  >
                    Submit & Continue to Payment
                  </Button>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-32 sm:pt-36">
        {renderStep()}
      </form>
    </div>
  )
}

export default ValidationOnboarding
