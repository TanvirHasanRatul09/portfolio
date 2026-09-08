export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

export function isResourceConstrained() {
  const limitedMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4
  const limitedCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4
  const saveData = navigator.connection?.saveData === true
  return limitedMemory || limitedCpu || saveData
}

export function isHistoryRestore() {
  return performance.getEntriesByType('navigation')[0]?.type === 'back_forward'
}

export function hasSeenIntro() {
  try { return sessionStorage.getItem('ratul-intro-seen') === '1' } catch { return false }
}

export function markIntroSeen() {
  try { sessionStorage.setItem('ratul-intro-seen', '1') } catch { /* Storage can be unavailable. */ }
}
