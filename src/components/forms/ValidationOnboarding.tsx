import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const {
    register,
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

  // Load saved state on mount
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
        if (savedStep) setCurrentStep(savedStep)
      } catch (error) {
        console.error('Failed to load saved state:', error)
      }
    }
  }, [setValue])

  const toggleCompletedItem = (value: string) => {
    const currentArray = watchedFields.completedItems || []
    if (currentArray.includes(value)) {
      setValue('completedItems', currentArray.filter(item => item !== value))
    } else {
      setValue('completedItems', [...currentArray, value])
    }
    trigger('completedItems')
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

  const handleContinueStep1 = async () => {
    const isValid = await trigger(['name', 'email', 'phone'])
    if (isValid) setCurrentStep(2)
  }

  const handleContinueStep2 = async () => {
    const isValid = await trigger(['projectDuration', 'teamSize', 'moneyInvested'])
    if (isValid) setCurrentStep(3)
  }

  const handleSubmitFinal = async () => {
    const isValid = await trigger()
    if (isValid) {
      onComplete(getValues())
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="w-full pt-24 sm:pt-28 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
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
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={handleContinueStep1}
                    size="lg"
                    className="px-8 py-3 text-base font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
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
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={handleContinueStep2}
                    size="lg"
                    className="px-8 py-3 text-base font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Completed Items */}
          {currentStep === 3 && (
            <div className="space-y-4">
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
                <p className="text-destructive text-sm mt-2 text-center">{errors.completedItems.message}</p>
              )}
              
              {watchedFields.completedItems && watchedFields.completedItems.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={handleSubmitFinal}
                    size="lg"
                    className="px-8 py-3 text-base font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all"
                  >
                    Submit & Continue to Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidationOnboarding
