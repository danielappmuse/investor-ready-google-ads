export interface ContactFormData {
  full_name: string
  email: string
  phone: string
  consent: boolean
  project_type: string
  budget_range: string
  project_description: string
  nda_agreement: boolean
  session_id: string
  form_location: 'top' | 'bottom'
  gclid?: string
  keyword?: string
  match_type?: string
  city?: string
  device?: string
  landing_page: string
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
  ip?: string
}

export interface FormStep {
  id: number
  title: string
  fields: string[]
}

export const projectTypes = [
  { id: 'website', name: 'Website' },
  { id: 'mobile_app', name: 'Mobile App' },
  { id: 'saas', name: 'SaaS Product' },
  { id: 'physical_product', name: 'Physical Product' },
  { id: 'other', name: 'Other' }
]

export const budgetRanges = [
  { id: '<10k', name: '<$10k' },
  { id: '10k-25k', name: '$10k – $25k' },
  { id: '25k-50k', name: '$25k – $50k' },
  { id: '50k-100k', name: '$50k – $100k' },
  { id: '100k-250k', name: '$100k – $250k' },
  { id: '250k-500k', name: '$250k – $500k' },
  { id: '500k+', name: '$500k+' }
]

export const timelines = [
  '1-3 months',
  '3-6 months',
  '6-12 months',
  '12+ months'
]