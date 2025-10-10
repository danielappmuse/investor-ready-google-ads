import * as React from "react"

const SMALL_HEIGHT_BREAKPOINT = 700 // iPhone 8: 667px, iPhone X: 812px

export function useIsSmallScreen() {
  const [isSmallScreen, setIsSmallScreen] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkHeight = () => {
      setIsSmallScreen(window.innerHeight < SMALL_HEIGHT_BREAKPOINT)
    }
    
    checkHeight()
    window.addEventListener("resize", checkHeight)
    return () => window.removeEventListener("resize", checkHeight)
  }, [])

  return isSmallScreen
}
