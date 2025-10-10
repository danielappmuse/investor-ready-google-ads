import * as React from "react"

const SMALL_HEIGHT_BREAKPOINT = 750 // iPhone 8: 667px, iPhone X: 812px, iPhone 11: 896px

export function useIsSmallScreen() {
  const [isSmallScreen, setIsSmallScreen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkHeight = () => {
      const isSmall = window.innerHeight < SMALL_HEIGHT_BREAKPOINT
      console.log('Screen height check:', {
        height: window.innerHeight,
        isSmall,
        breakpoint: SMALL_HEIGHT_BREAKPOINT
      })
      setIsSmallScreen(isSmall)
    }
    
    checkHeight()
    window.addEventListener("resize", checkHeight)
    return () => window.removeEventListener("resize", checkHeight)
  }, [])

  return isSmallScreen
}
