// Form validation utilities for landing page

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  // US phone number validation - accepts both raw and formatted numbers
  if (!phone) return false
  
  // Remove all non-numeric characters to get just digits
  const digits = phone.replace(/\D/g, '')
  
  // Must be exactly 11 digits (1 + 10 digit US number)
  if (digits.length !== 11) return false
  
  // Must start with 1 (US country code)
  if (!digits.startsWith('1')) return false
  
  // Area code (2nd-4th digits) must not start with 0 or 1
  const areaCode = digits.substring(1, 4)
  if (areaCode[0] === '0' || areaCode[0] === '1') return false
  
  // Exchange code (5th-7th digits) must not start with 0 or 1
  const exchangeCode = digits.substring(4, 7)
  if (exchangeCode[0] === '0' || exchangeCode[0] === '1') return false
  
  return true
}

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '')
  
  // If empty, return empty
  if (cleaned.length === 0) return ''
  
  // Handle different input scenarios
  let digits = cleaned
  
  // If starts with '1' and has more than 10 digits, keep as is
  // If doesn't start with '1' but has 10 digits, add '1' prefix
  if (digits.length === 10 && !digits.startsWith('1')) {
    digits = '1' + digits
  }
  
  // Limit to 11 digits maximum (1 + 10 digit US number)
  if (digits.length > 11) {
    digits = digits.substring(0, 11)
  }
  
  // Format based on length
  if (digits.length >= 11) {
    // Full format: +1 (555) 123-4567
    const countryCode = digits.substring(0, 1)
    const areaCode = digits.substring(1, 4)
    const firstPart = digits.substring(4, 7)
    const secondPart = digits.substring(7, 11)
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`
  } else if (digits.length >= 7) {
    // Partial format with area code
    const countryCode = digits.substring(0, 1)
    const areaCode = digits.substring(1, 4)
    const firstPart = digits.substring(4, 7)
    const secondPart = digits.substring(7)
    return `+${countryCode} (${areaCode}) ${firstPart}${secondPart ? '-' + secondPart : ''}`
  } else if (digits.length >= 4) {
    // Partial format
    const countryCode = digits.substring(0, 1)
    const areaCode = digits.substring(1)
    return `+${countryCode} (${areaCode}`
  } else if (digits.length >= 1) {
    // Just country code
    return `+${digits}`
  }
  
  return value
}

// Generate a unique session ID for tracking form submissions
export const generateSessionId = (): string => {
  return crypto.randomUUID()
}

// Get or create session ID from localStorage
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('form_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('form_session_id', sessionId)
  }
  return sessionId
}