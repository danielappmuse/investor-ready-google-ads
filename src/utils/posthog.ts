import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init('phc_6mWMkst2KyrZzrCqmRZihwkYGJOm8EY4f5T05he7Ywb', {
      api_host: 'https://app.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }
}

export const trackPageView = () => {
  const params = new URLSearchParams(window.location.search)
  posthog.capture('$pageview', {
    utm_source: params.get('utm_source'),
    utm_campaign: params.get('utm_campaign'),
    utm_medium: params.get('utm_medium'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
    gclid: params.get('gclid'),
    keyword: params.get('keyword'),
    path: window.location.pathname
  })
}

export const trackFormSubmission = (formData: any) => {
  posthog.capture('form_submitted', {
    form_type: 'contact_form',
    project_type: formData.projectType,
    budget_range: formData.budgetRange,
    ...getUtmParams()
  })
}

export const trackCalendlyOpen = () => {
  posthog.capture('calendly_opened', getUtmParams())
}

export const trackCalendlyConversion = () => {
  posthog.capture('calendly_booking_completed', getUtmParams())
}

export const trackConversion = () => {
  posthog.capture('conversion', {
    conversion_type: 'lead_form',
    ...getUtmParams()
  })
}

const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_campaign: params.get('utm_campaign'),
    utm_medium: params.get('utm_medium'),
    gclid: params.get('gclid'),
    keyword: params.get('keyword')
  }
}