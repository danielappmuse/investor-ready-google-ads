declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const initGoogleAds = () => {
  // Google Ads Global Site Tag (gtag.js)
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16893733356'
  document.head.appendChild(script1)

  const script2 = document.createElement('script')
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-16893733356');
  `
  document.head.appendChild(script2)
}

export const trackConversion = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-16893733356/33kJCOvWv6waEOzTx_c-'
    })
  }
}

export const trackFormConversion = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-16893733356/form_submit'
    })
  }
}

export const trackCalendlyConversion = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-16893733356/calendly_booking'
    })
  }
}