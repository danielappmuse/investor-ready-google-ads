// Tracking utilities for device detection, cookies, and analytics

export interface TrackingData {
  gclid?: string
  keyword?: string
  match_type?: string
  city?: string
  device?: string
  ip?: string
  landing_page: string
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
}

// Get URL parameters and cookies
export const getTrackingParameters = (): TrackingData => {
  const params = new URLSearchParams(window.location.search)
  
  const trackingData = {
    gclid: params.get('gclid') || getCookie('gclid') || undefined,
    keyword: params.get('keyword') || getCookie('keyword') || undefined,
    match_type: params.get('matchtype') || getCookie('matchtype') || undefined,
    utm_source: params.get('utm_source') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    landing_page: 'startup-validation-landing',
    city: detectCity(),
    device: detectDevice(),
    ip: undefined // Will be detected server-side
  }
  
  // Debug logging to see what we're collecting
  console.log('Tracking parameters collected:', trackingData)
  console.log('Current URL parameters:', Object.fromEntries(params.entries()))
  console.log('Available cookies:', document.cookie)
  
  return trackingData
}

// Cookie utility functions
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  console.log(`Looking for cookie '${name}':`, { 
    fullCookieString: document.cookie,
    searchValue: value,
    parts: parts,
    found: parts.length === 2
  })
  if (parts.length === 2) {
    const result = parts.pop()?.split(';').shift() || null
    console.log(`Cookie '${name}' result:`, result)
    return result
  }
  return null
}

export const setCookie = (name: string, value: string, days: number = 30): void => {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

// Store tracking parameters in cookies for future use
export const storeTrackingInCookies = (): void => {
  const params = new URLSearchParams(window.location.search)
  
  const trackingParams = ['gclid', 'keyword', 'matchtype', 'utm_source', 'utm_campaign', 'utm_medium']
  
  trackingParams.forEach(param => {
    const value = params.get(param)
    if (value) {
      setCookie(param, value, 30)
    }
  })
}

// Device detection
export const detectDevice = (): string => {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    if (/ipad/i.test(userAgent)) return 'tablet'
    return 'mobile'
  }
  
  if (/tablet/i.test(userAgent)) return 'tablet'
  
  return 'desktop'
}

// City detection (basic implementation - can be enhanced with IP geolocation service)
export const detectCity = (): string => {
  // This is a basic implementation
  // In production, you would use a geolocation service or IP-based detection
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const city = timezone.split('/').pop()?.replace(/_/g, ' ') || 'Unknown'
  return city
}

// Google Ads conversion tracking function
export const fireGoogleAdsConversion = (callback?: () => void): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      'send_to': 'AW-16893733356/33kJCOvWv6waEOzTx_c-',
      'event_callback': callback || (() => {})
    })
  }
}

// Initialize tracking on page load
export const initializeTracking = (): void => {
  storeTrackingInCookies()
}