import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, ArrowLeft, CheckCircle, User, Phone, Briefcase, Check, Shield, Lock, FileText, Home } from 'lucide-react'
import { ContactFormData, projectTypes, budgetRanges } from '@/types/form'
import { validateEmail, validatePhoneNumber, formatPhoneNumber, getSessionId } from '@/utils/formValidation'
import { getTrackingParameters, initializeTracking, fireGoogleAdsConversion } from '@/utils/trackingUtils'
import { supabase } from '@/integrations/supabase/client'

const formSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().refine(validateEmail, 'Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').refine(validatePhoneNumber, 'Please enter a valid US phone number'),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  project_type: z.string().min(1, 'Please select a project type'),
  budget_range: z.string().min(1, 'Please select a budget range'),
  project_description: z.string().min(10, 'Please provide at least 10 characters'),
  nda_agreement: z.boolean().refine(val => val === true, 'You must agree to the NDA protection'),
})

interface EnhancedMultiStepFormProps {
  onSuccess: (data: ContactFormData) => void
  formLocation: 'top' | 'bottom'
  onBack?: () => void
}

const EnhancedMultiStepForm = ({ onSuccess, formLocation, onBack }: EnhancedMultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionId] = useState(() => getSessionId())
  const [trackingData] = useState(() => getTrackingParameters())

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { phone: '+1 ' }
  })

  const watchedFields = watch()

  useEffect(() => {
    initializeTracking()
  }, [])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted)
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate as any)
    
    if (isStepValid && currentStep === 1) {
      // Submit initial lead data after step 1 validation
      await submitLeadData(1)
      
      // Fire Google Ads conversion
      fireGoogleAdsConversion()
    }
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['full_name', 'email', 'phone', 'consent']
      case 2:
        return ['project_type', 'budget_range']
      case 3:
        return ['project_description', 'nda_agreement']
      default:
        return []
    }
  }

  const submitLeadData = async (step: number) => {
    const leadData: ContactFormData = {
      full_name: watchedFields.full_name || '',
      email: watchedFields.email || '',
      phone: watchedFields.phone || '',
      consent: watchedFields.consent || false,
      app_idea: watchedFields.project_description || '',
      project_stage: watchedFields.project_type || '',
      user_persona: '',
      differentiation: '',
      existing_materials: [],
      business_model: watchedFields.budget_range || '',
      revenue_goal: '',
      build_strategy: '',
      help_needed: [],
      investment_readiness: '',
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
      const completeData: ContactFormData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        consent: data.consent,
        app_idea: data.project_description,
        project_stage: data.project_type,
        user_persona: '',
        differentiation: '',
        existing_materials: [],
        business_model: data.budget_range,
        revenue_goal: '',
        build_strategy: '',
        help_needed: [],
        investment_readiness: '',
        session_id: sessionId,
        form_location: formLocation,
        ...trackingData
      }

      // Submit final complete data
      await submitLeadData(3)

      onSuccess(completeData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="w-5 h-5" />
      case 2: return <Briefcase className="w-5 h-5" />
      case 3: return <Phone className="w-5 h-5" />
      default: return null
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Get Started</h3>
              <p className="text-gray-400">Let's capture your lead information</p>
            </div>
            
            <div>
              <Label htmlFor="full_name" className="text-white">Full Name *</Label>
              <Input
                {...register('full_name')}
                className="form-input"
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {errors.full_name && (
                <p className="text-destructive text-sm mt-1">{errors.full_name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email" className="text-white">Email Address *</Label>
              <Input
                {...register('email')}
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-white">Phone Number *</Label>
              <Input
                {...register('phone')}
                type="tel"
                onChange={handlePhoneChange}
                value={watchedFields.phone || ''}
                className="form-input"
                placeholder="+1 (555) 123-4567"
                maxLength={17}
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">US phone numbers only</p>
            </div>

            <div className="flex items-start space-x-3">
              <div 
                onClick={() => setValue('consent', !watchedFields.consent)}
                className={`
                  w-8 h-8 border-2 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0
                  ${watchedFields.consent 
                    ? 'bg-primary border-primary text-white shadow-lg' 
                    : 'bg-white/10 border-gray-300 hover:border-primary hover:bg-white/20'
                  }
                `}
              >
                {watchedFields.consent && (
                  <Check className="w-5 h-5 text-white font-bold stroke-[3]" />
                )}
              </div>
              <Label 
                onClick={() => setValue('consent', !watchedFields.consent)}
                className="text-sm text-gray-300 leading-relaxed cursor-pointer hover:text-white transition-colors"
              >
                I agree to receive communications and understand that my information will be used in accordance with privacy policies. I consent to be contacted about startup services. *
              </Label>
            </div>
            {errors.consent && (
              <p className="text-destructive text-sm mt-1">{errors.consent.message}</p>
            )}
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Project Details</h3>
              <p className="text-gray-400">Tell us about your project</p>
            </div>
            
            <div>
              <Label htmlFor="project_type" className="text-white">Project Type *</Label>
              <Select
                value={watchedFields.project_type || ''}
                onValueChange={(value) => setValue('project_type', value)}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Select your project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project_type && (
                <p className="text-destructive text-sm mt-1">{errors.project_type.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="budget_range" className="text-white">Budget Range *</Label>
              <Select
                value={watchedFields.budget_range || ''}
                onValueChange={(value) => setValue('budget_range', value)}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budget_range && (
                <p className="text-destructive text-sm mt-1">{errors.budget_range.message}</p>
              )}
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 p-4 bg-card/20 rounded-lg border border-green-500/20">
              <div className="flex items-center space-x-2 text-green-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">NDA Protected</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-medium">100% Confidential</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium">Secure Ideas</span>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Project Description</h3>
              <p className="text-gray-400">Describe your startup idea - it's fully protected</p>
            </div>
            
            <div>
              <Label htmlFor="project_description" className="text-white">Tell us about your startup idea *</Label>
              <Textarea
                {...register('project_description')}
                className="form-input min-h-[120px]"
                placeholder="Describe your startup idea, target market, and what you're looking to achieve..."
              />
              {errors.project_description && (
                <p className="text-destructive text-sm mt-1">{errors.project_description.message}</p>
              )}
            </div>

            {/* NDA Agreement Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div 
                onClick={() => setValue('nda_agreement', !watchedFields.nda_agreement)}
                className={`
                  w-8 h-8 border-2 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-center flex-shrink-0
                  ${watchedFields.nda_agreement 
                    ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                    : 'bg-white/10 border-gray-300 hover:border-green-500 hover:bg-white/20'
                  }
                `}
              >
                {watchedFields.nda_agreement && (
                  <Check className="w-5 h-5 text-white font-bold stroke-[3]" />
                )}
              </div>
              <div className="flex-1">
                <Label 
                  onClick={() => setValue('nda_agreement', !watchedFields.nda_agreement)}
                  className="text-sm text-gray-300 leading-relaxed cursor-pointer hover:text-white transition-colors block"
                >
                  <span className="flex items-center mb-1">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    <span className="font-semibold text-green-400">NDA Protection Agreement</span>
                  </span>
                  I understand that my startup idea and all shared information will be protected under a Non-Disclosure Agreement (NDA). StartWise guarantees complete confidentiality and will not share, use, or discuss my idea without explicit written permission. *
                </Label>
              </div>
            </div>
            {errors.nda_agreement && (
              <p className="text-destructive text-sm mt-1">{errors.nda_agreement.message}</p>
            )}

            <div className="p-4 bg-card/30 rounded-lg border border-white/10">
              <h4 className="font-semibold text-white mb-2">Next Steps</h4>
              <p className="text-gray-300 text-sm mb-2">
                After submitting, we'll schedule a call to discuss your project in detail.
              </p>
              <p className="text-gray-400 text-xs">
                Our AI agent will contact you at: <span className="text-primary">+1 (616) 896-2290</span>
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="card-glass p-6 lg:p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : getStepIcon(step)}
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStep()}
        
        <div className="flex justify-between items-center mt-4 gap-4">
          <div className="flex gap-3">
            {onBack && currentStep === 1 && (
              <Button
                type="button"
                onClick={() => {
                  console.log('EnhancedMultiStepForm: Back to Home clicked');
                  onBack();
                }}
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={() => {
                  console.log('EnhancedMultiStepForm: Previous button clicked');
                  prevStep();
                }}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div>
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="btn-hero"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-hero"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Schedule Call'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default EnhancedMultiStepForm