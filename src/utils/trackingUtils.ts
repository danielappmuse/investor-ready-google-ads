// Tracking utilities for device detection, cookies, and analytics

export interface TrackingData {
  gclid?: string
  keyword?: string
  match_type?: string
  city?: string
  device_type?: string
  os?: string
  browser?: string
  user_agent?: string
  ip?: string
  landing_page: string
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
}

// Get URL parameters and cookies
export const getTrackingParameters = (): TrackingData => {
  const params = new URLSearchParams(window.location.search)
  const deviceInfo = detectDevice()
  
  // First try to get gclid from URL, then from cookie
  const gclidFromUrl = params.get('gclid')
  const gclidFromCookie = getCookie('gclid')
  
  console.log('🔍 GCLID Detection:', {
    fromUrl: gclidFromUrl,
    fromCookie: gclidFromCookie,
    allCookies: document.cookie
  })
  
  const trackingData = {
    gclid: gclidFromUrl || gclidFromCookie || undefined,
    keyword: params.get('keyword') || getCookie('keyword') || undefined,
    match_type: params.get('matchtype') || getCookie('matchtype') || undefined,
    utm_source: params.get('utm_source') || getCookie('utm_source') || undefined,
    utm_campaign: params.get('utm_campaign') || getCookie('utm_campaign') || undefined,
    utm_medium: params.get('utm_medium') || getCookie('utm_medium') || undefined,
    landing_page: 'startup-validation-landing',
    city: undefined, // Will be detected server-side via IP geolocation
    device_type: deviceInfo.device_type,
    os: deviceInfo.os,
    browser: deviceInfo.browser,
    user_agent: navigator.userAgent,
    ip: undefined // Will be detected server-side
  }
  
  // Debug logging to see what we're collecting
  console.log('Tracking parameters collected:', trackingData)
  console.log('Current URL parameters:', Object.fromEntries(params.entries()))
  
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
  const expires = date.toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
  console.log(`🍪 Cookie set: ${name}=${value}`)
}

// Store tracking parameters in cookies for future use
export const storeTrackingInCookies = (): void => {
  const params = new URLSearchParams(window.location.search)
  
  const trackingParams = ['gclid', 'keyword', 'matchtype', 'utm_source', 'utm_campaign', 'utm_medium']
  
  console.log('🍪 Storing tracking params in cookies...')
  trackingParams.forEach(param => {
    const value = params.get(param)
    if (value) {
      setCookie(param, value, 90) // Store for 90 days
      console.log(`✅ Stored ${param}:`, value)
    }
  })
}

// Device detection with detailed info
export const detectDevice = (): { device_type: string; os: string; browser: string } => {
  const ua = navigator.userAgent.toLowerCase()
  
  // Device type
  let device_type = 'desktop'
  if (/ipad|tablet/.test(ua)) {
    device_type = 'tablet'
  } else if (/mobile|iphone|android|phone/.test(ua)) {
    device_type = 'mobile'
  }
  
  // Operating System
  let os = 'Other'
  if (/windows/.test(ua)) os = 'Windows'
  else if (/mac os|macintosh/.test(ua)) os = 'macOS'
  else if (/android/.test(ua)) os = 'Android'
  else if (/iphone|ipad|ipod|ios/.test(ua)) os = 'iOS'
  else if (/linux/.test(ua)) os = 'Linux'
  
  // Browser
  let browser = 'Other'
  if (/edg\//.test(ua)) browser = 'Edge'
  else if (/chrome|crios/.test(ua)) browser = 'Chrome'
  else if (/safari/.test(ua) && !/chrome|crios|edg\//.test(ua)) browser = 'Safari'
  else if (/firefox/.test(ua)) browser = 'Firefox'
  
  return { device_type, os, browser }
}

// City detection (removed - will be done server-side via IP geolocation)
export const detectCity = (): string | undefined => {
  // City will be detected server-side using IP geolocation
  return undefined
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