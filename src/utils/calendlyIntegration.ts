// Calendly integration utilities

export interface CalendlyParams {
  name: string
  last_name: string
  email: string
  phone: string
  project_type: string
  budget_range: string
  project_description: string
}

export const generateCalendlyUrl = (params: CalendlyParams): string => {
  // Split full name into first and last name for Calendly
  const nameParts = params.name.trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  
  // Clean phone number (remove +1 prefix for Calendly format)
  const phoneClean = params.phone.replace(/^\+1/, '')
  
  const calendlyUrl = 'https://calendly.com/startnow-start-wise/30min?' +
    'name=' + encodeURIComponent(firstName) +
    '&last_name=' + encodeURIComponent(lastName) +
    '&email=' + encodeURIComponent(params.email) +
    '&a1=' + encodeURIComponent('1' + phoneClean) +
    '&a2=' + encodeURIComponent(params.project_type) +
    '&a3=' + encodeURIComponent(params.budget_range) +
    '&a4=' + encodeURIComponent(params.project_description) +
    '&hide_gdpr_banner=1'
  
  return calendlyUrl
}
