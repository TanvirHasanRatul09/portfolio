import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  const handlePointerMove = (event) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    event.currentTarget.dataset.pointerHover = 'true'
    event.currentTarget.style.setProperty('--pointer-x', `${x}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${y}px`)
    event.currentTarget.style.setProperty('--card-rotate-x', `${((rect.height / 2 - y) / rect.height) * 2.2}deg`)
    event.currentTarget.style.setProperty('--card-rotate-y', `${((x - rect.width / 2) / rect.width) * 2.2}deg`)
  }

  const handlePointerLeave = (event) => {
    delete event.currentTarget.dataset.pointerHover
    event.currentTarget.style.removeProperty('--card-rotate-x')
    event.currentTarget.style.removeProperty('--card-rotate-y')
  }

  return <article onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} className={cn('interactive-card rounded-xl border border-violet-200/[0.18] bg-[#24142d]/82 shadow-[0_24px_80px_-45px_rgba(0,0,0,.9)] backdrop-blur-[3px]', className)} {...props} />
}
