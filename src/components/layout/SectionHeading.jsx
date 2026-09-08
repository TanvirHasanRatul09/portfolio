export function SectionHeading({ eyebrow, title, description }) {
  return (
    <header data-reveal-heading className="mb-10 max-w-2xl sm:mb-14">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[.22em] text-rose-400">{eyebrow}</p>
      <h2 className="font-display text-[clamp(2rem,7vw,3.5rem)] font-bold leading-[1.05] tracking-[-.045em] text-white">{title}</h2>
      {description && <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">{description}</p>}
    </header>
  )
}
