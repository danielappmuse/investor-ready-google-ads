// Legacy form - kept for backwards compatibility
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, ArrowLeft, CheckCircle, User, Mail, Phone, Briefcase, Shield, Lock, FileText, Check } from 'lucide-react'
import { ContactFormData, projectTypes, budgetRanges } from '@/types/form'
import { trackFormSubmission, trackConversion } from '@/utils/posthog'
import { trackFormConversion } from '@/utils/googleAds'

const formSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+1\d{10}$/, 'Please enter a valid US phone number'),
  project_type: z.string().min(1, 'Please select a project type'),
  project_description: z.string().min(10, 'Please provide at least 10 characters'),
  nda_agreement: z.boolean().refine(val => val === true, 'You must agree to the NDA protection'),
})

interface LegacyMultiStepFormProps {
  onSuccess: (data: ContactFormData) => void
}

const LegacyMultiStepForm = ({ onSuccess }: LegacyMultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  })

  const watchedFields = watch()

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length === 0) return ''
    
    let formatted = cleaned
    if (!formatted.startsWith('1') && formatted.length <= 10) {
      formatted = '1' + formatted
    }
    
    if (formatted.length > 11) {
      formatted = formatted.substring(0, 11)
    }
    
    return '+' + formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phone', formatted)
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate as any)
    
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
        return ['full_name', 'email']
      case 2:
        return ['phone']
      case 3:
        return ['project_type', 'project_description', 'nda_agreement']
      default:
        return []
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      // Add UTM parameters
      const params = new URLSearchParams(window.location.search)
      const formDataWithUTM: ContactFormData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        consent: true, // Legacy form assumes consent
        project_type: data.project_type,
        budget_range: '', // Not collected in legacy form
        project_description: data.project_description,
        nda_agreement: true, // Legacy form assumes NDA agreement
        session_id: crypto.randomUUID(),
        form_location: 'bottom',
        landing_page: 'startup-validation-landing',
        utm_source: params.get('utm_source') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_medium: params.get('utm_medium') || '',
        gclid: params.get('gclid') || '',
        keyword: params.get('keyword') || ''
      }

      // Submit to Make.com webhook
      await fetch('https://hook.eu1.make.com/nthlsd5ijwk2g9pu835fpptkj36kswqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataWithUTM)
      })

      // Track conversions
      trackFormSubmission(formDataWithUTM)
      trackConversion()
      trackFormConversion()

      onSuccess(formDataWithUTM)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="w-5 h-5" />
      case 2: return <Phone className="w-5 h-5" />
      case 3: return <Briefcase className="w-5 h-5" />
      default: return null
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
              <p className="text-gray-400">Let's start with your basic details</p>
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
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Contact Details</h3>
              <p className="text-gray-400">How can we reach you?</p>
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-white">Phone Number *</Label>
              <Input
                {...register('phone')}
                onChange={handlePhoneChange}
                value={watchedFields.phone || ''}
                className="form-input"
                placeholder="+1 (555) 123-4567"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
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
              <h3 className="text-xl font-semibold text-white mb-2">Project Details</h3>
              <p className="text-gray-400">Tell us about your project - it's fully protected</p>
            </div>
            
            <div>
              <Label htmlFor="project_type" className="text-white">Project Type *</Label>
              <select
                {...register('project_type')}
                className="form-input"
              >
                <option value="">Select your project type</option>
                {projectTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.project_type && (
                <p className="text-destructive text-sm mt-1">{errors.project_type.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="project_description" className="text-white">Tell us about your startup idea *</Label>
              <Textarea
                {...register('project_description')}
                className="form-input min-h-[100px]"
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
        
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={() => {
                console.log('LegacyMultiStepForm: Previous button clicked');
                prevStep();
              }}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="btn-hero ml-auto"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-hero ml-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default LegacyMultiStepForm