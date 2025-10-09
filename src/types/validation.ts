// Validation onboarding data type for Stripe payment forms
export interface ValidationOnboardingData {
  name: string
  email: string
  phone: string
  projectDuration: string
  teamSize: string
  moneyInvested: string
  completedItems: string[]
}
