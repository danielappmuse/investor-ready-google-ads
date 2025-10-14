import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { ContactFormData, projectStages, userPersonaOptions, differentiationOptions, existingMaterials, businessModels, revenueGoals, buildStrategies, helpNeededAreas, investmentLevels } from '@/types/form'
import { validateEmail, validatePhoneNumber, formatPhoneNumber, getSessionId } from '@/utils/formValidation'
import { getTrackingParameters, initializeTracking, fireGoogleAdsConversion } from '@/utils/trackingUtils'
import { supabase } from '@/integrations/supabase/client'

const formSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().refine(validateEmail, 'Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').refine(validatePhoneNumber, 'Please enter a valid US phone number'),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  app_idea: z.string().min(20, 'Please provide at least 20 characters describing your app idea'),
  project_stage: z.string().min(1, 'Please select your project stage'),
  user_persona: z.string().min(1, 'Please select your user persona understanding'),
  differentiation: z.string().min(1, 'Please select what makes your idea stand out'),
  existing_materials: z.array(z.string()).min(0),
  business_model: z.string().min(1, 'Please select your business model'),
  revenue_goal: z.string().min(1, 'Please select your revenue goal'),
  build_strategy: z.string().min(1, 'Please select your build strategy'),
  help_needed: z.array(z.string()).min(1, 'Please select at least one area where you need help'),
  investment_readiness: z.string().min(1, 'Please select your investment readiness level'),
})

interface InvestmentReadinessFormProps {
  onSuccess: (data: ContactFormData) => void
  formLocation: 'top' | 'bottom'
  onBack?: () => void
}

const InvestmentReadinessForm = ({ onSuccess, formLocation, onBack }: InvestmentReadinessFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [sessionId] = useState(() => getSessionId())
  const [trackingData] = useState(() => getTrackingParameters())

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      existing_materials: [],
      help_needed: []
    }
  })

  const watchedFields = watch()

  useEffect(() => {
    initializeTracking()
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted)
  }

  const toggleArrayValue = (field: 'existing_materials' | 'help_needed', value: string) => {
    const currentValues = watchedFields[field] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    setValue(field, newValues)
  }

  const calculateScore = () => {
    let totalScore = 0

    // Q3: User Persona (10% weight)
    const userPersonaScores: Record<string, number> = {
      'assumptions': 0,
      'think_know': 2,
      'i_am_user': 5,
      'validated': 10
    }
    totalScore += userPersonaScores[watchedFields.user_persona || ''] || 0

    // Q4: Differentiation (10% weight)
    const differentiationScores: Record<string, number> = {
      'better': 4,
      'user_friendly': 7,
      'different_problem': 10,
      'working_on_it': 0,
      'mashup': 5
    }
    totalScore += differentiationScores[watchedFields.differentiation || ''] || 0

    // Main Readiness Score (80% weight combined)
    // Q1: App Idea (4 points max - based on text length)
    const appIdeaLength = (watchedFields.app_idea || '').length
    totalScore += Math.min(4, (appIdeaLength / 50) * 4)

    // Q2: Project Stage (8 points max)
    const projectStageScores: Record<string, number> = {
      'just_idea': 2,
      'business_figured': 4,
      'business_and_tech_planned': 5,
      'mvp_development': 6,
      'launching_soon': 7,
      'already_live': 8
    }
    totalScore += projectStageScores[watchedFields.project_stage || ''] || 0

    // Q5: Existing Materials (28 points max - MOST IMPORTANT)
    const materialsCount = (watchedFields.existing_materials || []).length
    const materialsPoints = Math.min(28, (materialsCount / 9) * 28)
    totalScore += materialsPoints

    // Q6: Business Model (6.4 points max)
    const businessModelScores: Record<string, number> = {
      'recurring': 6.4,
      'one_time': 4.8,
      'white_label': 5.6,
      'ad_based': 4.0,
      'mix': 6.0,
      'other': 3.0
    }
    totalScore += businessModelScores[watchedFields.business_model || ''] || 0

    // Q7: Revenue Goal (6.4 points max)
    const revenueGoalScores: Record<string, number> = {
      '0-1k': 2.0,
      '1k-5k': 4.0,
      '5k-25k': 5.5,
      '25k+': 6.4
    }
    totalScore += revenueGoalScores[watchedFields.revenue_goal || ''] || 0

    // Q8: Build Strategy (6.4 points max)
    const buildStrategyScores: Record<string, number> = {
      'outsource': 5.5,
      'cofounder': 6.4,
      'no_code': 4.0,
      'need_find': 2.0,
      'have_team': 6.4
    }
    totalScore += buildStrategyScores[watchedFields.build_strategy || ''] || 0

    // Q9: Help Needed (6.4 points max - fewer areas = more ready)
    const helpNeededCount = (watchedFields.help_needed || []).length
    const helpNeededPoints = Math.max(0, 6.4 - (helpNeededCount * 1.0))
    totalScore += helpNeededPoints

    // Q10: Investment Readiness (14.4 points max)
    const investmentScores: Record<string, number> = {
      'under_2k': 2.0,
      '3k-5k': 5.0,
      '8k-15k': 8.0,
      '20k-40k': 11.0,
      '50k-90k': 13.0,
      '100k+': 14.4
    }
    totalScore += investmentScores[watchedFields.investment_readiness || ''] || 0

    return Math.round(totalScore)
  }

  const getSegment = (score: number) => {
    if (score >= 0 && score <= 25) return { name: 'Feasibility', color: 'text-orange-400' }
    if (score >= 26 && score <= 50) return { name: 'Business Logic', color: 'text-yellow-400' }
    if (score >= 51 && score <= 75) return { name: 'Design & Tech', color: 'text-blue-400' }
    return { name: 'Investors', color: 'text-green-400' }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate as any)
    
    if (isStepValid && currentStep === 1) {
      await submitLeadData(1)
      fireGoogleAdsConversion()
    }
    
    if (isStepValid) {
      if (currentStep === 10) {
        // Show score after Q10, before contact info
        setShowScore(true)
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 11))
      }
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1: return ['app_idea']
      case 2: return ['project_stage']
      case 3: return ['user_persona']
      case 4: return ['differentiation']
      case 5: return ['existing_materials']
      case 6: return ['business_model']
      case 7: return ['revenue_goal']
      case 8: return ['build_strategy']
      case 9: return ['help_needed']
      case 10: return ['investment_readiness']
      case 11: return ['full_name', 'email', 'phone', 'consent']
      default: return []
    }
  }

  const submitLeadData = async (step: number) => {
    const leadData: ContactFormData = {
      full_name: watchedFields.full_name || '',
      email: watchedFields.email || '',
      phone: watchedFields.phone || '',
      consent: watchedFields.consent || false,
      app_idea: watchedFields.app_idea || '',
      project_stage: watchedFields.project_stage || '',
      user_persona: watchedFields.user_persona || '',
      differentiation: watchedFields.differentiation || '',
      existing_materials: watchedFields.existing_materials || [],
      business_model: watchedFields.business_model || '',
      revenue_goal: watchedFields.revenue_goal || '',
      build_strategy: watchedFields.build_strategy || '',
      help_needed: watchedFields.help_needed || [],
      investment_readiness: watchedFields.investment_readiness || '',
      session_id: sessionId,
      form_location: formLocation,
      ...trackingData
    }

    try {
      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: { ...leadData, step }
      })

      if (error) throw error
      
      console.log('Lead data submitted for step:', step)
    } catch (error) {
      console.error('Error submitting lead data:', error)
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      const score = calculateScore()
      const segment = getSegment(score)
      
      const completeData: ContactFormData = {
        ...data,
        session_id: sessionId,
        form_location: formLocation,
        score: score,
        segment: segment.name,
        ...trackingData
      }

      await submitLeadData(11)
      onSuccess(completeData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-2">
            <p className="text-sm text-primary font-semibold mb-2">Every idea protected. NDA, guaranteed.</p>
            <Label htmlFor="app_idea" className="text-white text-lg mb-0.5 block">
              Briefly describe your app idea and the problem it solves
            </Label>
            <p className="text-base text-gray-400 mb-1">
              We have <span className="relative inline-block">limited capacity<span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600/40 to-red-600" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }}></span></span> and prioritize Founders solving real human problems with potential to scale.
            </p>
            <Textarea
              {...register('app_idea')}
              className="form-input min-h-[80px] text-lg"
              placeholder="Describe the problem your app solves..."
            />
            {errors.app_idea && (
              <p className="text-destructive text-base mt-0.5">{errors.app_idea.message}</p>
            )}
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-2">
            <Label htmlFor="project_stage" className="text-white text-lg mb-0.5 block">
              Where are you in your project journey?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              Select the stage that best describes where you are right now.
            </p>
            <Select
              value={watchedFields.project_stage || ''}
              onValueChange={(value) => setValue('project_stage', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select your stage" />
              </SelectTrigger>
              <SelectContent>
                {projectStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_stage && (
              <p className="text-destructive text-lg mt-1">{errors.project_stage.message}</p>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="user_persona" className="text-white text-lg mb-0.5 block">
              How well do you know your user persona?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              The more you know your user, the better your chances of building something investors believe in.
            </p>
            <Select
              value={watchedFields.user_persona || ''}
              onValueChange={(value) => setValue('user_persona', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select your understanding level" />
              </SelectTrigger>
              <SelectContent>
                {userPersonaOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.user_persona && (
              <p className="text-destructive text-lg mt-1">{errors.user_persona.message}</p>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-2">
            <Label htmlFor="differentiation" className="text-white text-lg mb-0.5 block">
              What makes your idea stand out?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              This helps us understand your competitive edge and positioning.
            </p>
            <Select
              value={watchedFields.differentiation || ''}
              onValueChange={(value) => setValue('differentiation', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select what makes you different" />
              </SelectTrigger>
              <SelectContent>
                {differentiationOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.differentiation && (
              <p className="text-destructive text-lg mt-1">{errors.differentiation.message}</p>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-2">
            <Label className="text-white text-lg mb-0.5 block">
              Which materials have you already completed professionally?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              Select everything you've completed so far.
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {existingMaterials.map((material) => (
                <div 
                  key={material.id}
                  onClick={() => toggleArrayValue('existing_materials', material.id)}
                  className="flex items-center space-x-2 p-2 rounded border border-white/10 hover:border-primary/50 cursor-pointer transition-all bg-white/5"
                >
                  <div 
                    className={`
                      w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0
                      ${(watchedFields.existing_materials || []).includes(material.id)
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-white/10 border-gray-300'
                      }
                    `}
                  >
                    {(watchedFields.existing_materials || []).includes(material.id) && (
                      <Check className="w-3 h-3 text-white font-bold stroke-[3]" />
                    )}
                  </div>
                  <Label className="text-base text-gray-300 cursor-pointer flex-1">
                    {material.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-2">
            <Label htmlFor="business_model" className="text-white text-lg mb-0.5 block">
              What is the app business model?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              This gives us insight into your revenue strategy.
            </p>
            <Select
              value={watchedFields.business_model || ''}
              onValueChange={(value) => setValue('business_model', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select your business model" />
              </SelectTrigger>
              <SelectContent>
                {businessModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.business_model && (
              <p className="text-destructive text-lg mt-1">{errors.business_model.message}</p>
            )}
          </div>
        )

      case 7:
        return (
          <div className="space-y-2">
            <Label htmlFor="revenue_goal" className="text-white text-lg mb-0.5 block">
              What's your monthly revenue goal 90 days after launch?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              This helps us understand your short-term growth expectations.
            </p>
            <Select
              value={watchedFields.revenue_goal || ''}
              onValueChange={(value) => setValue('revenue_goal', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select your revenue goal" />
              </SelectTrigger>
              <SelectContent>
                {revenueGoals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.revenue_goal && (
              <p className="text-destructive text-lg mt-1">{errors.revenue_goal.message}</p>
            )}
          </div>
        )

      case 8:
        return (
          <div className="space-y-2">
            <Label htmlFor="build_strategy" className="text-white text-lg mb-0.5 block">
              How do you plan to build the product?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              This tells us what kind of team or structure you'll need.
            </p>
            <Select
              value={watchedFields.build_strategy || ''}
              onValueChange={(value) => setValue('build_strategy', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select your build strategy" />
              </SelectTrigger>
              <SelectContent>
                {buildStrategies.map((strategy) => (
                  <SelectItem key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.build_strategy && (
              <p className="text-destructive text-lg mt-1">{errors.build_strategy.message}</p>
            )}
          </div>
        )

      case 9:
        return (
          <div className="space-y-2">
            <Label className="text-white text-lg mb-0.5 block">
              What areas do you need help with most?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              Select the areas where you need the most support to move forward.
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {helpNeededAreas.map((area) => (
                <div 
                  key={area.id}
                  onClick={() => toggleArrayValue('help_needed', area.id)}
                  className="flex items-center space-x-2 p-2 rounded border border-white/10 hover:border-primary/50 cursor-pointer transition-all bg-white/5"
                >
                  <div 
                    className={`
                      w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0
                      ${(watchedFields.help_needed || []).includes(area.id)
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-white/10 border-gray-300'
                      }
                    `}
                  >
                    {(watchedFields.help_needed || []).includes(area.id) && (
                      <Check className="w-3 h-3 text-white font-bold stroke-[3]" />
                    )}
                  </div>
                  <Label className="text-base text-gray-300 cursor-pointer flex-1">
                    {area.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.help_needed && (
              <p className="text-destructive text-lg mt-1">{errors.help_needed.message}</p>
            )}
          </div>
        )

      case 10:
        return (
          <div className="space-y-2">
            <Label htmlFor="investment_readiness" className="text-white text-lg mb-0.5 block">
              How much are you prepared to personally invest?
            </Label>
            <p className="text-base text-gray-400 mb-1">
              Your answer helps us guide you to the right program.
            </p>
            <Select
              value={watchedFields.investment_readiness || ''}
              onValueChange={(value) => setValue('investment_readiness', value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select your investment level" />
              </SelectTrigger>
              <SelectContent>
                {investmentLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    <div className="flex flex-col">
                      <span>{level.name}</span>
                      {level.note && (
                        <span className="text-base text-muted-foreground">{level.note}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.investment_readiness && (
              <p className="text-destructive text-lg mt-1">{errors.investment_readiness.message}</p>
            )}
          </div>
        )

      case 11:
        return (
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-white text-lg">Full Name</Label>
            <Input
              {...register('full_name')}
              className="form-input text-lg"
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.full_name && (
              <p className="text-destructive text-base mt-0.5">{errors.full_name.message}</p>
            )}
            
            <Label htmlFor="email" className="text-white text-lg">Email</Label>
            <Input
              {...register('email')}
              type="email"
              className="form-input text-lg"
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-destructive text-base mt-0.5">{errors.email.message}</p>
            )}

            <Label htmlFor="phone" className="text-white text-lg">Phone Number</Label>
            <Input
              {...register('phone')}
              type="tel"
              onChange={handlePhoneChange}
              value={watchedFields.phone || ''}
              className="form-input text-lg"
              placeholder="+1 (555) 123-4567"
              maxLength={17}
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-destructive text-base mt-0.5">{errors.phone.message}</p>
            )}

            <div className="flex items-start space-x-2 pt-2">
              <div 
                onClick={() => setValue('consent', !watchedFields.consent)}
                className={`
                  w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0
                  ${watchedFields.consent 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white/10 border-gray-300'
                  }
                `}
              >
                {watchedFields.consent && (
                  <Check className="w-3 h-3 text-white font-bold stroke-[3]" />
                )}
              </div>
              <Label 
                onClick={() => setValue('consent', !watchedFields.consent)}
                className="text-base text-gray-300 cursor-pointer"
              >
                I agree to receive communications
              </Label>
            </div>
            {errors.consent && (
              <p className="text-destructive text-base mt-0.5">{errors.consent.message}</p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  const score = calculateScore()
  const segment = getSegment(score)

  if (showScore) {
    return (
      <div className="card-glass p-4 lg:p-6 text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-3">Your Investment Readiness Score</h2>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${(score / 100) * 439.6} 439.6`}
                className="text-primary transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-4xl font-bold text-white">{score}</div>
                <div className="text-xs text-gray-400">out of 100</div>
              </div>
            </div>
          </div>
          <div className={`text-xl font-bold ${segment.color} mb-1`}>
            {segment.name}
          </div>
          <p className="text-lg text-gray-300">
            {segment.name === 'Feasibility' && "Let's validate your idea before you waste time & money"}
            {segment.name === 'Business Logic' && "Turn your idea into a fundable plan"}
            {segment.name === 'Design & Tech' && "Build the product investors fund"}
            {segment.name === 'Investors' && "You're ready to scale — let's get you funded"}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setShowScore(false)
            setCurrentStep(11)
          }}
          className="btn-hero text-lg"
        >
          Continue to Get Your Personalized Plan
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  return (
    <div className="card-glass p-3 lg:p-4">
      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-center mb-1.5">
          <div className="text-center">
            <div className="text-base font-bold text-white">
              {currentStep} / 11
            </div>
            <p className="text-[13px] text-gray-400">Questions Complete</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-1">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 11) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}
        
        <div className="flex flex-col gap-3 mt-2">
          {currentStep < 10 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="btn-hero w-full animate-cta-pulse shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : currentStep === 10 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="btn-hero w-full animate-cta-pulse shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 transition-all"
            >
              See My Score
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-hero w-full animate-cta-pulse shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Get Your Personalized Plan'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="w-full text-[15.5px] sm:text-[21.5px] font-extrabold py-3.5 sm:py-6 rounded-xl text-white border-white/20 hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default InvestmentReadinessForm
