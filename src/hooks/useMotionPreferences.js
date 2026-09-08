import { useEffect, useState } from 'react'

function readQuery(query) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

export function useMotionPreferences() {
  const [preferences, setPreferences] = useState(() => ({
    reduced: readQuery('(prefers-reduced-motion: reduce)'),
    mobile: readQuery('(max-width: 767px)'),
  }))

  useEffect(() => {
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const update = () => setPreferences({ reduced: reducedQuery.matches, mobile: mobileQuery.matches })
    reducedQuery.addEventListener('change', update)
    mobileQuery.addEventListener('change', update)
    return () => {
      reducedQuery.removeEventListener('change', update)
      mobileQuery.removeEventListener('change', update)
    }
  }, [])

  return preferences
}
