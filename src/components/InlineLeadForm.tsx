import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Bot } from 'lucide-react'

interface InlineLeadFormProps {
  onSuccess: (leadId?: string) => void
}

const InlineLeadForm: React.FC<InlineLeadFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      })
      return false
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return false
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('save-agent-lead', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim()
        }
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Thank you! Your information has been saved. You can now continue chatting.",
      })
      
      onSuccess(data.leadId)
    } catch (error) {
      console.error('Error saving agent lead:', error)
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-3 h-3 text-white" />
      </div>
      
      <div className="max-w-[280px] bg-white/10 rounded-lg p-2">
        <div className="mb-2">
          <h4 className="text-white font-medium text-xs mb-1">Connect with Our AI Agent</h4>
          <p className="text-gray-400 text-xs">
            Please provide your contact information to continue chatting.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-xs h-7"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-xs h-7"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-xs h-7"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="pt-1">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue Chat'
              )}
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-gray-500 mt-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default InlineLeadForm