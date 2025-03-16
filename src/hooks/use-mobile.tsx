
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value based on window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener with debounce for performance
    let timeoutId: number | undefined
    const debouncedResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(handleResize, 100)
    }
    
    window.addEventListener("resize", debouncedResize)
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return isMobile
}
