import { useEffect, useState } from 'react'
import { useMotionPreferences } from '../../hooks/useMotionPreferences'
import { isHistoryRestore, isResourceConstrained } from '../../lib/capabilities'

const messages = ['Establishing secure connection', 'Loading engineering profile', 'Mapping selected work', 'Portfolio ready']

function shouldSkipIntro({ mobile, reduced, webglAvailable }) {
  return reduced || (mobile && (!webglAvailable || isResourceConstrained())) || isHistoryRestore()
}

export function CinematicIntro({ webglAvailable }) {
  const { mobile, reduced } = useMotionPreferences()
  const [visible, setVisible] = useState(() => !shouldSkipIntro({ mobile, reduced, webglAvailable }))

  useEffect(() => {
    if (!visible) return undefined
    const failSafe = window.setTimeout(() => setVisible(false), mobile ? 2000 : 4600)
    return () => window.clearTimeout(failSafe)
  }, [mobile, visible])

  if (!visible) return null

  return (
    <div className={`intro-overlay ${mobile ? 'intro-overlay--mobile' : ''}`} role="status" aria-label="Opening portfolio" onAnimationEnd={(event) => { if (event.target === event.currentTarget) setVisible(false) }}>
      <button type="button" className="intro-skip" onClick={() => setVisible(false)}>Skip intro</button>
      <div className="intro-stage">
        <div className="intro-orbital" aria-hidden="true">
          <div className="intro-orbital__glow" />
          <div className="intro-orbital__ring intro-orbital__ring--one" />
          <div className="intro-orbital__ring intro-orbital__ring--two" />
          <div className="intro-orbital__ring intro-orbital__ring--three" />
          <div className="intro-orbital__core"><span>THR</span></div>
          <i className="intro-orbital__node intro-orbital__node--one" />
          <i className="intro-orbital__node intro-orbital__node--two" />
        </div>
        <div className="intro-terminal">
          <div className="intro-mark" aria-hidden="true" />
          <p className="intro-kicker">Backend systems · data · APIs</p>
          <div className="mt-5 space-y-2.5 font-mono text-xs text-zinc-400 sm:text-sm">
            {messages.map((message, index) => <p key={message} className={`intro-line ${index === messages.length - 1 ? 'text-emerald-300' : ''}`}><span className="mr-3 text-rose-400">{index === messages.length - 1 ? '✓' : '›'}</span>{message}</p>)}
          </div>
          <div className="mt-7 overflow-hidden sm:mt-10"><p className="intro-name font-display text-[clamp(2.25rem,8vw,5.5rem)] font-extrabold leading-none tracking-[-.055em] text-white">Tanvir Hasan <span>Ratul</span></p></div>
        </div>
      </div>
    </div>
  )
}
