import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Home } from 'lucide-react'
import { ProgressBar } from './ProgressBar'
import { formatPhoneNumber } from '@/utils/formValidation'
import ValidationPayment from './ValidationPayment'

const validationSchema = z.object({
  idea: z.string().min(10, 'minimum 10 characters to help us tailor this'),
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
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
  problemStatement: z.string().min(5, 'Please describe the problem (minimum 5 characters).'),
  audience: z.array(z.string()).min(1, 'Please select at least one option.'),
  alternatives: z.string().min(1, 'Please select an option.'),
  outcome: z.array(z.string()).min(1, 'Please select at least one option.').max(2, 'Please select maximum 2 options.'),
  budget: z.string().min(1, 'Please select your budget range.')
})

export interface ValidationOnboardingData {
  idea: string
  name: string
  email: string
  phone: string
  problemStatement: string
  audience: string[]
  alternatives: string
  outcome: string[]
  budget: string
}

interface ValidationOnboardingProps {
  onComplete: (data: ValidationOnboardingData) => void
  onBack: () => void
}

const ValidationOnboarding: React.FC<ValidationOnboardingProps> = ({ onComplete, onBack }) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [multiSelectTimer, setMultiSelectTimer] = useState<NodeJS.Timeout | null>(null)
  const [showNextButton, setShowNextButton] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const totalSteps = 8

  const goBackHome = () => {
    navigate('/')
  }

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
      audience: [],
      outcome: []
    }
  })

  const watchedFields = watch()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted)
    // Trigger validation to show errors immediately
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
        console.log('ValidationOnboarding: Loaded saved state, step:', savedStep || 1);
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
        setShowNextButton(false)
      }, 220)
    }
  }, [currentStep, totalSteps])

  // Remove auto-advance for text inputs - steps 1 & 2 now use manual buttons

  // Auto-advance for single select - immediate (removed step 7 auto-advance)
  useEffect(() => {
    if (currentStep === 5 && watchedFields.alternatives) {
      setTimeout(advanceStep, 150)
    }
    // Step 7 auto-advance removed - now requires manual continue
  }, [watchedFields.alternatives, currentStep, advanceStep])

  // Multi-select timer logic
  useEffect(() => {
    if (multiSelectTimer) {
      clearTimeout(multiSelectTimer)
    }

    if (currentStep === 4 && watchedFields.audience?.length > 0) {
      setShowNextButton(true)
      const timer = setTimeout(advanceStep, 2000)
      setMultiSelectTimer(timer)
    } else if (currentStep === 6 && watchedFields.outcome?.length > 0) {
      setShowNextButton(true)
      const timer = setTimeout(advanceStep, 2000)
      setMultiSelectTimer(timer)
    } else {
      setShowNextButton(false)
    }

    return () => {
      if (multiSelectTimer) {
        clearTimeout(multiSelectTimer)
      }
    }
  }, [watchedFields.audience, watchedFields.outcome, currentStep, advanceStep])

  const toggleArrayValue = (field: 'audience' | 'outcome', value: string) => {
    const currentArray = watchedFields[field] || []
    const maxItems = field === 'outcome' ? 2 : Infinity
    
    if (currentArray.includes(value)) {
      setValue(field, currentArray.filter(item => item !== value))
    } else if (currentArray.length < maxItems) {
      setValue(field, [...currentArray, value])
    }
  }

  const onSubmit = (data: ValidationOnboardingData) => {
    console.log('Form submitted:', data)
    // Form completion handled by step 6 payment success
  }

  const handlePaymentSuccess = () => {
    localStorage.removeItem('validation_onboarding_state')
    onComplete(getValues())
  }

  // Keyboard navigation - only active on selection steps (4-7)
  useEffect(() => {
    // Only enable keyboard shortcuts on selection steps, not on input steps
    if (currentStep < 4) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = parseInt(e.key)
      if (key >= 1 && key <= 9) {
        e.preventDefault()
        
        // Handle keyboard selection based on current step
        switch (currentStep) {
          case 4: // Target Audience
            const audienceOptions = ['Consumers', 'SMB', 'Enterprise', 'Creator', 'Non-profit', 'Other']
            if (key <= audienceOptions.length) {
              toggleArrayValue('audience', audienceOptions[key - 1])
            }
            break
          case 5: // Alternatives
            const altOptions = ['Competitors', 'DIY/manual', 'Not solved', 'Other']
            if (key <= altOptions.length) {
              setValue('alternatives', altOptions[key - 1])
            }
            break
          case 6: // Outcome
            const outcomeOptions = ['Validate demand', 'Define MVP scope', 'Price & business model', 'Tech feasibility', 'Funding readiness', 'Other']
            if (key <= outcomeOptions.length) {
              toggleArrayValue('outcome', outcomeOptions[key - 1])
            }
            break
          case 7: // Budget
            const budgetOptions = ['$1k–$10k', '$10k–$25k', '$25k–$50k', '$50k+', 'Not Sure', 'Other']
            if (key <= budgetOptions.length) {
              setValue('budget', budgetOptions[key - 1])
            }
            break
        }
      }

      if (e.key === 'Enter' && showNextButton) {
        advanceStep()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentStep, showNextButton, advanceStep, setValue, toggleArrayValue])

  const SelectionChip = ({ 
    label, 
    selected, 
    onClick, 
    disabled = false,
    keyNumber
  }: { 
    label: string
    selected: boolean
    onClick: () => void
    disabled?: boolean
    keyNumber?: number
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative min-h-[48px] sm:min-h-[52px] px-4 sm:px-6 py-3 sm:py-4 rounded-xl 
        text-sm sm:text-base font-medium transition-all duration-220 ease-out transform
        ${selected 
          ? 'bg-primary text-primary-foreground scale-105 shadow-lg glow' 
          : disabled 
            ? 'bg-muted/20 text-muted-foreground cursor-not-allowed'
            : 'bg-card/50 text-card-foreground hover:bg-card hover:scale-105 border border-border/50 hover:border-primary/50'
        }
      `}
    >
      {keyNumber && (
        <span className="absolute -top-2 -left-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
          {keyNumber}
        </span>
      )}
      {label}
    </button>
  )

  const renderStep = () => {
    const containerClass = `
      relative w-full flex flex-col justify-center items-center px-4 py-12 sm:px-6 sm:py-16 md:py-20
      transition-all duration-220 ease-out transform
      ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
    `

    switch (currentStep) {
      case 1:
        return (
          <div className={containerClass}>
            {/* Go Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 1: Go Back clicked');
                  onBack();
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            <div className="w-full max-w-2xl mx-auto text-center space-y-3">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                  Validation Exam Onboarding
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">2 minutes. Big clarity.</p>
                <p className="text-xl sm:text-2xl font-medium text-foreground mb-6 sm:mb-8">
                  In one sentence or short paragraph, describe your idea.
                </p>
              </div>
              
              <div className="relative">
                <Textarea
                  {...register('idea')}
                  placeholder="An app that..."
                  className="min-h-[160px] text-lg resize-none bg-card/50 border-2 border-border/50 focus:border-primary text-center rounded-2xl backdrop-blur-sm"
                />
                
                {errors.idea && (
                  <p className="text-destructive text-base mt-4">{errors.idea.message}</p>
                )}
                
                {/* Manual continue button */}
                {watchedFields.idea && watchedFields.idea.length >= 10 && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={async () => {
                        const isValid = await trigger(['idea'])
                        if (isValid) {
                          advanceStep()
                        }
                      }} 
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all duration-220"
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
            {/* Go Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 2: Go Back clicked');
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            <div className="w-full max-w-2xl mx-auto text-center space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Let's connect!
                </h1>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Input
                    {...register('name')}
                    placeholder="Your name"
                    className="text-lg py-4 bg-card/50 border-2 border-border/50 focus:border-primary text-center rounded-xl backdrop-blur-sm"
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
                    placeholder="Your email"
                    className="text-lg py-4 bg-card/50 border-2 border-border/50 focus:border-primary text-center rounded-xl backdrop-blur-sm"
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
                    placeholder="+1 (555) 123-4567"
                    className="text-lg py-4 bg-card/50 border-2 border-border/50 focus:border-primary text-center rounded-xl backdrop-blur-sm"
                    maxLength={17}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-2">{errors.phone.message}</p>
                  )}
                </div>
                
                {/* Manual continue button */}
                {watchedFields.name && watchedFields.email && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={async () => {
                        console.log('Validating step 2 fields...')
                        const isValid = await trigger(['name', 'email', 'phone'])
                        console.log('Step 2 validation result:', isValid)
                        if (isValid) {
                          advanceStep()
                        } else {
                          console.log('Validation failed, not advancing')
                        }
                      }} 
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all duration-220"
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
            {/* Go Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 3: Go Back clicked');
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            <div className="w-full max-w-2xl mx-auto text-center space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                  What pain or goal does it solve?
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">What's annoying/expensive/slow today?</p>
              </div>
              
              <div className="relative">
                <Textarea
                  {...register('problemStatement')}
                  placeholder="Describe the problem your idea solves..."
                  className="min-h-[160px] text-lg resize-none bg-card/50 border-2 border-border/50 focus:border-primary text-center rounded-2xl backdrop-blur-sm"
                />
                
                {errors.problemStatement && (
                  <p className="text-destructive text-base mt-4">{errors.problemStatement.message}</p>
                )}
                
                {/* Manual continue button */}
                {watchedFields.problemStatement && watchedFields.problemStatement.length >= 5 && (
                  <div className="flex justify-center mt-6">
                    <Button 
                      onClick={async () => {
                        const isValid = await trigger(['problemStatement'])
                        if (isValid) {
                          advanceStep()
                        }
                      }} 
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all duration-220"
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className={containerClass}>
            {/* Go Back Button */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 4: Go Back clicked');
                  // Clear any active timers
                  if (multiSelectTimer) {
                    clearTimeout(multiSelectTimer);
                    setMultiSelectTimer(null);
                  }
                  setShowNextButton(false);
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Go Back</span>
                <span className="xs:hidden">Back</span>
              </Button>
            </div>
            <div className="w-full max-w-4xl mx-auto text-center space-y-12">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                  Who is your target audience?
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground">Select all that apply</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
                {[
                  'Consumers',
                  'SMB',
                  'Enterprise',
                  'Creator',
                  'Non-profit',
                  'Other'
                ].map((option, index) => (
                  <SelectionChip
                    key={option}
                    label={option}
                    selected={watchedFields.audience?.includes(option) || false}
                    onClick={() => toggleArrayValue('audience', option)}
                    keyNumber={index + 1}
                  />
                ))}
              </div>

              {showNextButton && (
                <div className="flex justify-center">
                  <Button 
                    onClick={advanceStep} 
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all duration-220"
                  >
                    Next
                  </Button>
                </div>
              )}
              
              {errors.audience && (
                <p className="text-destructive text-base">{errors.audience.message}</p>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className={containerClass}>
            {/* Go Back Button */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 5: Go Back clicked');
                  // Clear any active timers and reset button state
                  if (multiSelectTimer) {
                    clearTimeout(multiSelectTimer);
                    setMultiSelectTimer(null);
                  }
                  setShowNextButton(false);
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Go Back</span>
                <span className="xs:hidden">Back</span>
              </Button>
            </div>
            <div className="w-full max-w-4xl mx-auto text-center space-y-12">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                  How is this solved today?
                </h1>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
                {[
                  'Competitors',
                  'DIY/manual',
                  'Not solved',
                  'Other'
                ].map((option, index) => (
                  <SelectionChip
                    key={option}
                    label={option}
                    selected={watchedFields.alternatives === option}
                    onClick={() => setValue('alternatives', option)}
                    keyNumber={index + 1}
                  />
                ))}
              </div>
              
              {errors.alternatives && (
                <p className="text-destructive text-base">{errors.alternatives.message}</p>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className={containerClass}>
            {/* Go Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 6: Go Back clicked');
                  // Clear any active timers
                  if (multiSelectTimer) {
                    clearTimeout(multiSelectTimer);
                    setMultiSelectTimer(null);
                  }
                  setShowNextButton(false);
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
            <div className="w-full max-w-5xl mx-auto text-center space-y-12">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                  What matters most right now?
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground">Select up to 2 options</p>
              </div>
              
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">
                {[
                  'Validate demand',
                  'Define MVP scope',
                  'Price & business model',
                  'Tech feasibility',
                  'Funding readiness',
                  'Other'
                ].map((option, index) => (
                  <SelectionChip
                    key={option}
                    label={option}
                    selected={watchedFields.outcome?.includes(option) || false}
                    disabled={!watchedFields.outcome?.includes(option) && (watchedFields.outcome?.length || 0) >= 2}
                    onClick={() => toggleArrayValue('outcome', option)}
                    keyNumber={index + 1}
                  />
                ))}
              </div>

              {showNextButton && (
                <div className="flex justify-center">
                  <Button 
                    onClick={advanceStep} 
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all duration-220"
                  >
                    Next
                  </Button>
                </div>
              )}
              
              {errors.outcome && (
                <p className="text-destructive text-base">{errors.outcome.message}</p>
              )}
            </div>
          </div>
        )

      case 7:
        return (
          <div className={containerClass}>
            {/* Go Back Button */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 7: Go Back clicked');
                  // Clear any active timers and reset button state
                  if (multiSelectTimer) {
                    clearTimeout(multiSelectTimer);
                    setMultiSelectTimer(null);
                  }
                  setShowNextButton(false);
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Go Back</span>
                <span className="xs:hidden">Back</span>
              </Button>
            </div>
            <div className="w-full max-w-4xl mx-auto text-center space-y-12">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
                  If the Validation Exam fits, what's your budget?
                </h1>
              </div>
              
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
                {[
                  '$1k–$10k',
                  '$10k–$25k',
                  '$25k–$50k',
                  '$50k+',
                  'Not Sure'
                ].map((option, index) => (
                  <SelectionChip
                    key={option}
                    label={option}
                    selected={watchedFields.budget === option}
                    onClick={() => setValue('budget', option)}
                    keyNumber={index + 1}
                  />
                ))}
              </div>

              {/* Manual Continue button for step 7 */}
              {watchedFields.budget && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={async () => {
                      console.log('Step 7: Continue button clicked');
                      const isValid = await trigger(['budget']);
                      if (isValid) {
                        advanceStep();
                      }
                    }} 
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:scale-105 transition-all duration-220"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}
              
              {errors.budget && (
                <p className="text-destructive text-base">{errors.budget.message}</p>
              )}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="relative w-full min-h-screen flex flex-col px-4 pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
            {/* Go Back Button */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <Button
                onClick={() => {
                  console.log('ValidationOnboarding Step 8: Go Back clicked');
                  // Clear any active timers and reset button state
                  if (multiSelectTimer) {
                    clearTimeout(multiSelectTimer);
                    setMultiSelectTimer(null);
                  }
                  setShowNextButton(false);
                  setCurrentStep(prev => prev - 1);
                }}
                variant="outline"
                size="sm"
                className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 text-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Go Back</span>
                <span className="xs:hidden">Back</span>
              </Button>
            </div>
            <div className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center">
              <div className="w-full">
                <ValidationPayment
                  onboardingData={getValues()}
                  onBack={() => {
                    console.log('ValidationOnboarding: Back button clicked, going to step 7');
                    setCurrentStep(7);
                  }}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative py-8 px-4" style={{ background: 'linear-gradient(135deg, hsl(220, 50%, 10%) 0%, hsl(230, 40%, 8%) 100%)' }}>
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      {renderStep()}
    </div>
  )
}

export default ValidationOnboarding