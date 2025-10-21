export interface ContactFormData {
  full_name: string
  email: string
  phone: string
  consent: boolean
  
  // Q0: Startup Type
  startup_type?: string
  
  // Q1: App Idea & Problem Statement
  app_idea: string
  
  // Q2: Project Journey Stage
  project_stage: string
  project_stage_other?: string
  
  // Q3: User Persona Understanding
  user_persona: string
  user_persona_other?: string
  
  // Q4: Idea Differentiation
  differentiation: string
  differentiation_other?: string
  
  // Q5: Existing Materials (multi-select)
  existing_materials: string[]
  
  // Q6: Business Model
  business_model: string
  
  // Q7: Revenue Goal
  revenue_goal: string
  current_revenue?: string
  
  // Q8: Build Strategy
  build_strategy: string
  build_strategy_other?: string
  
  // Q9: Areas of Help Needed (multi-select)
  help_needed: string[]
  help_needed_other?: string
  
  // Q10: Investment Readiness
  investment_readiness: string
  
  // Scoring Results
  score?: number
  segment?: string
  
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

// Q0: Startup Type Options
export const startupTypes = [
  { id: 'technology', name: 'Technology-Based Startups' },
  { id: 'physical', name: 'Physical Product Startups' },
  { id: 'service', name: 'Service-Based Startups (Tech-enabled or not)' },
  { id: 'combination', name: 'A Combination Between Technology to a Physical Product' }
]

// Q2: Project Journey Stage Options - Dynamic based on startup type
export const getProjectStages = (startupType: string) => {
  if (startupType === 'physical') {
    return [
      { id: 'just_idea', name: 'Just an idea' },
      { id: 'business_figured', name: 'I have figured the business oriented stuff, but haven\'t started on the product yet.' },
      { id: 'business_and_tech_planned', name: 'I figured the business side, and planned the product, but didn\'t get started with a prototype.' },
      { id: 'mvp_development', name: 'Prototype in Development' },
      { id: 'launching_soon', name: 'Launching soon (next 90 days)' },
      { id: 'already_live', name: 'Already available for purchase' },
      { id: 'other', name: 'Other' }
    ]
  } else if (startupType === 'service') {
    return [
      { id: 'just_idea', name: 'Just an idea' },
      { id: 'business_figured', name: 'I have figured the business model, but haven\'t structured the service delivery yet.' },
      { id: 'business_and_tech_planned', name: 'I figured the business side and service structure, but need to operationalize it.' },
      { id: 'mvp_development', name: 'Service Pilot in Progress' },
      { id: 'launching_soon', name: 'Launching soon (next 90 days)' },
      { id: 'already_live', name: 'Already serving clients' },
      { id: 'other', name: 'Other' }
    ]
  } else {
    return [
      { id: 'just_idea', name: 'Just an idea' },
      { id: 'business_figured', name: 'I have figured the business oriented stuff, but not the tech yet.' },
      { id: 'business_and_tech_planned', name: 'I figured the business side, and planned the tech, but have no development skills/knowledge.' },
      { id: 'mvp_development', name: 'MVP in Development' },
      { id: 'launching_soon', name: 'Launching soon (next 90 days)' },
      { id: 'already_live', name: 'Already live in the app stores' },
      { id: 'other', name: 'Other' }
    ]
  }
}

// Legacy export for backwards compatibility
export const projectStages = getProjectStages('technology')

// Q3: User Persona Understanding Options
export const userPersonaOptions = [
  { id: 'assumptions', name: "I've written down assumptions but haven't validated yet" },
  { id: 'think_know', name: "I think I know, but haven't talked to users" },
  { id: 'i_am_user', name: 'I am the user — I built this to solve my own problem' },
  { id: 'validated', name: "I've done surveys and know their pain deeply" },
  { id: 'other', name: 'Other' }
]

// Q4: Idea Differentiation Options - Dynamic based on startup type
export const getDifferentiationOptions = (startupType: string) => {
  if (startupType === 'physical') {
    return [
      { id: 'better', name: "It's way better quality than what's out there" },
      { id: 'user_friendly', name: "It's more user-friendly and beautifully designed" },
      { id: 'different_problem', name: 'It solves a totally different problem than competitors' },
      { id: 'working_on_it', name: "I'm still working on figuring that out" },
      { id: 'mashup', name: "It combines features from existing products in a new way" },
      { id: 'other', name: 'Other' }
    ]
  } else if (startupType === 'service') {
    return [
      { id: 'better', name: "We deliver better results than what's available" },
      { id: 'user_friendly', name: "Our service experience is more streamlined and customer-focused" },
      { id: 'different_problem', name: 'We address a totally different need than competitors' },
      { id: 'working_on_it', name: "I'm still working on figuring that out" },
      { id: 'mashup', name: "We combine multiple service offerings in a unique way" },
      { id: 'other', name: 'Other' }
    ]
  } else {
    return [
      { id: 'better', name: "It's way better than what's out there" },
      { id: 'user_friendly', name: "It's more user-friendly and beautifully designed" },
      { id: 'different_problem', name: 'It solves a totally different problem than competitors' },
      { id: 'working_on_it', name: "I'm still working on figuring that out" },
      { id: 'mashup', name: "It's a mash-up of existing products" },
      { id: 'other', name: 'Other' }
    ]
  }
}

// Legacy export
export const differentiationOptions = getDifferentiationOptions('technology')

// Q5: Existing Materials Options - Dynamic based on startup type
export const getExistingMaterials = (startupType: string) => {
  if (startupType === 'physical') {
    return [
      { id: 'marketing_research', name: 'Market Research' },
      { id: 'business_plan', name: 'Business Plan' },
      { id: 'business_model', name: 'Business Model' },
      { id: 'ui_ux', name: 'Product Design / CAD files' },
      { id: 'prd', name: 'Product Specifications Document' },
      { id: 'mvp_prototype', name: 'Physical Prototype' },
      { id: 'pitch_deck', name: 'One Pager and Pitch Deck' },
      { id: 'legal', name: 'Legal (patents, trademarks, etc.)' }
    ]
  } else if (startupType === 'service') {
    return [
      { id: 'marketing_research', name: 'Market Research' },
      { id: 'business_plan', name: 'Business Plan' },
      { id: 'business_model', name: 'Business Model / Service Structure' },
      { id: 'ui_ux', name: 'Service Blueprint / Customer Journey Map' },
      { id: 'prd', name: 'Service Operations Manual' },
      { id: 'mvp_prototype', name: 'Pilot Program Results' },
      { id: 'pitch_deck', name: 'One Pager and Pitch Deck' },
      { id: 'legal', name: 'Legal (contracts, terms of service)' }
    ]
  } else {
    return [
      { id: 'marketing_research', name: 'Marketing Research' },
      { id: 'business_plan', name: 'Business Plan' },
      { id: 'business_model', name: 'Business Model' },
      { id: 'ui_ux', name: 'UI/UX' },
      { id: 'prd', name: 'Product Requirements Document (PRD)' },
      { id: 'mvp_prototype', name: 'MVP or Prototype' },
      { id: 'pitch_deck', name: 'One Pager and Pitch Deck' },
      { id: 'legal', name: 'Legal' }
    ]
  }
}

// Legacy export
export const existingMaterials = getExistingMaterials('technology')

// Q6: Business Model Options - Dynamic based on startup type
export const getBusinessModels = (startupType: string) => {
  if (startupType === 'physical') {
    return [
      { id: 'recurring', name: 'Subscription box / Recurring orders' },
      { id: 'one_time', name: 'One-time purchase' },
      { id: 'white_label', name: 'White label / B2B wholesale' },
      { id: 'ad_based', name: 'Direct-to-consumer with retail partnerships' },
      { id: 'mix', name: 'A mix of sales channels' },
      { id: 'other', name: 'Another strategy' }
    ]
  } else if (startupType === 'service') {
    return [
      { id: 'recurring', name: 'Retainer / Recurring contracts' },
      { id: 'one_time', name: 'Project-based pricing' },
      { id: 'white_label', name: 'White label / Partner reseller' },
      { id: 'ad_based', name: 'Commission-based / Performance fees' },
      { id: 'mix', name: 'Hybrid pricing model' },
      { id: 'other', name: 'Another strategy' }
    ]
  } else {
    return [
      { id: 'recurring', name: 'Recurring revenue (subscription)' },
      { id: 'one_time', name: 'One time payment' },
      { id: 'white_label', name: 'White label' },
      { id: 'ad_based', name: 'Ad-based/Freemium' },
      { id: 'mix', name: 'A mix between them' },
      { id: 'other', name: 'Another strategy' }
    ]
  }
}

// Legacy export
export const businessModels = getBusinessModels('technology')

// Q7: Revenue Goal Options
export const revenueGoals = [
  { id: '0-1k', name: '$0–$1K' },
  { id: '1k-5k', name: '$1K–$5K' },
  { id: '5k-25k', name: '$5K–$25K' },
  { id: '25k+', name: '$25K+' },
  { id: 'already_creating', name: 'I am already creating revenue' }
]

// Q8: Build Strategy Options - Dynamic based on startup type
export const getBuildStrategies = (startupType: string) => {
  if (startupType === 'physical') {
    return [
      { id: 'outsource', name: "I'll work with manufacturers and manage production" },
      { id: 'cofounder', name: "I'm working with a product development partner" },
      { id: 'no_code', name: 'I plan to start with small-batch production myself' },
      { id: 'need_find', name: 'I need to find a manufacturer or production partner' },
      { id: 'have_team', name: 'I already have a manufacturer or supplier in mind' },
      { id: 'other', name: 'Other' }
    ]
  } else if (startupType === 'service') {
    return [
      { id: 'outsource', name: "I'll hire contractors and manage service delivery" },
      { id: 'cofounder', name: "I'm working with operational partners" },
      { id: 'no_code', name: 'I plan to deliver the service myself initially' },
      { id: 'need_find', name: 'I need to find service delivery partners or team members' },
      { id: 'have_team', name: 'I already have a team or partners in mind' },
      { id: 'other', name: 'Other' }
    ]
  } else {
    return [
      { id: 'outsource', name: "I'll outsource it and manage the process" },
      { id: 'cofounder', name: "I'm working with a technical cofounder" },
      { id: 'no_code', name: 'I plan to use a no-code tool myself' },
      { id: 'need_find', name: 'I need to find someone to build it' },
      { id: 'have_team', name: 'I already have a dev team or agency in mind' },
      { id: 'other', name: 'Other' }
    ]
  }
}

// Legacy export
export const buildStrategies = getBuildStrategies('technology')

// Q9: Areas of Help Needed Options - Dynamic based on startup type
export const getHelpNeededAreas = (startupType: string) => {
  if (startupType === 'physical') {
    return [
      { id: 'business_materials', name: 'Business planning and go-to-market strategy' },
      { id: 'design_build', name: 'Product design and prototype development' },
      { id: 'figma_dev', name: 'Manufacturing and supply chain setup' },
      { id: 'code_takeover', name: 'Quality control and production scaling' },
      { id: 'marketing', name: 'Marketing and customer acquisition' },
      { id: 'fundraising', name: 'Fundraising for my first round' },
      { id: 'other', name: 'Other' }
    ]
  } else if (startupType === 'service') {
    return [
      { id: 'business_materials', name: 'Business model and service structure' },
      { id: 'design_build', name: 'Service design and customer experience' },
      { id: 'figma_dev', name: 'Operations and delivery process setup' },
      { id: 'code_takeover', name: 'Team building and hiring' },
      { id: 'marketing', name: 'Client acquisition and marketing' },
      { id: 'fundraising', name: 'Fundraising for my first round' },
      { id: 'other', name: 'Other' }
    ]
  } else {
    return [
      { id: 'business_materials', name: 'Solving/creating business related questions or materials' },
      { id: 'design_build', name: 'Designing and building from scratch' },
      { id: 'figma_dev', name: 'Developing my existing Figma Design' },
      { id: 'code_takeover', name: 'Need a new developer (Code Takeover)' },
      { id: 'marketing', name: 'Getting users and Marketing my existing app' },
      { id: 'fundraising', name: 'Fundraising for my first round' },
      { id: 'other', name: 'Other' }
    ]
  }
}

// Legacy export
export const helpNeededAreas = getHelpNeededAreas('technology')

// Q10: Investment Readiness Options
export const investmentLevels = [
  { id: 'under_5k', name: 'Less than $5000', note: 'Best to start with outside resources before working with us, and peruse a Bootstrap.' },
  { id: '5k-10k', name: '$5000 - $10,000', note: 'Entry point for Founders looking to start with StartWise 90 Days Investor Ready Program and are looking only for materials refinement & connections' },
  { id: '10k-30k', name: '$10,000 - $30,000', note: 'Minimum entry point for Founders who needs significant business oriented support' },
  { id: '30k-50k', name: '$30,000 - $50,000', note: 'Common entry point for serious Founders looking to start MVP development' },
  { id: '50k-100k', name: '$50,000 - $100,000', note: 'Founders who are looking to both launch and scale users rapidly' },
  { id: '100k+', name: '$100k+', note: 'Full business suit & unlocks our highest level of partnership and access to exclusive opportunities' }
]

// Legacy exports for backwards compatibility
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