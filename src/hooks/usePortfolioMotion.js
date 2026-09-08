import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePortfolioMotion() {
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const cleanups = []
    const context = gsap.context(() => {
      gsap.to('.scroll-progress__bar', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } })

      gsap.utils.toArray('.section-shell').forEach((section) => {
        const heading = section.querySelector('[data-reveal-heading]')
        if (heading) gsap.from(heading.children, { y: 28, opacity: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 86%', once: true } })
        const cards = section.querySelectorAll('article')
        if (cards.length) gsap.from(cards, { y: 34, opacity: 0, scale: 0.975, rotateX: 3, transformOrigin: 'center bottom', duration: 0.72, stagger: 0.08, ease: 'power3.out', clearProps: 'transform,transformOrigin', scrollTrigger: { trigger: cards[0], start: 'top 88%', once: true } })
      })

      const portrait = document.querySelector('.portrait-frame')
      if (portrait && window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) {
        const moveX = gsap.quickTo(portrait, 'x', { duration: 0.7, ease: 'power3.out' })
        const moveY = gsap.quickTo(portrait, 'y', { duration: 0.7, ease: 'power3.out' })
        const move = (event) => { moveX((event.clientX / innerWidth - 0.5) * 10); moveY((event.clientY / innerHeight - 0.5) * 8) }
        window.addEventListener('pointermove', move, { passive: true })
        cleanups.push(() => window.removeEventListener('pointermove', move))
      }

      if (window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) {
        document.querySelectorAll('[data-magnetic]').forEach((element) => {
          const move = (event) => {
            const rect = element.getBoundingClientRect()
            gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * 0.13, y: (event.clientY - rect.top - rect.height / 2) * 0.13, duration: 0.25, overwrite: true })
          }
          const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.45, ease: 'power3.out', overwrite: true })
          element.addEventListener('pointermove', move)
          element.addEventListener('pointerleave', leave)
          cleanups.push(() => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave) })
        })
      }
    })

    return () => { cleanups.forEach((cleanup) => cleanup()); context.revert() }
  }, [])
}
