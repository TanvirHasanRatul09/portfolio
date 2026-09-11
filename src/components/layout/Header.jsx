import { useMemo, useState } from 'react'
import { FileText, Menu } from 'lucide-react'
import { navigation } from '../../data/portfolio'
import { useActiveSection } from '../../hooks/useActiveSection'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'

export function Header() {
  const [open, setOpen] = useState(false)
  const sectionIds = useMemo(() => ['hero', ...navigation.map(({ id }) => id)], [])
  const active = useActiveSection(sectionIds)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-violet-200/[0.08] bg-[#1c0c23]/65 shadow-[0_10px_35px_-28px_rgba(0,0,0,.9)] backdrop-blur-md">
      <div className="site-container flex h-16 items-center justify-between pt-[env(safe-area-inset-top)] sm:h-[4.5rem]">
        <a href="#hero" className="group inline-flex min-h-11 items-center font-display text-xl font-extrabold tracking-[-.04em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
          RATUL<span className="ml-1 text-rose-600 transition-transform group-hover:translate-x-0.5">/</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.id} href={item.href} aria-current={active === item.id ? 'location' : undefined} className={cn('relative rounded-md px-3 py-3 text-sm font-medium text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500', active === item.id && 'text-white after:absolute after:inset-x-3 after:-bottom-px after:h-px after:bg-rose-500')}>
              {item.label}
            </a>
          ))}
          <a href="/Tanvir-Hasan-Ratul-Resume.pdf" target="_blank" rel="noreferrer" className="ml-1 inline-flex min-h-11 items-center gap-2 rounded-md border border-rose-400/25 bg-rose-500/[0.08] px-3 text-sm font-semibold text-rose-200 transition-colors hover:border-rose-300/45 hover:bg-rose-500/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
            <FileText size={16} aria-hidden="true" /> Resume
          </a>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="size-11 px-0 lg:hidden" aria-label="Open navigation menu" aria-expanded={open} aria-controls="mobile-navigation">
              <Menu aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent id="mobile-navigation">
            <div className="mt-16 font-mono text-xs uppercase tracking-[.2em] text-rose-400">Navigate</div>
            <nav className="mt-6 flex flex-col" aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <SheetClose asChild key={item.id}>
                  <a href={item.href} aria-current={active === item.id ? 'location' : undefined} className={cn('flex min-h-14 items-center border-b border-white/[0.08] text-lg font-semibold text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500', active === item.id && 'text-white')}>
                    <span className="mr-4 font-mono text-xs text-rose-500">0{index + 1}</span>{item.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a href="/Tanvir-Hasan-Ratul-Resume.pdf" target="_blank" rel="noreferrer" className="flex min-h-14 items-center border-b border-white/[0.08] text-lg font-semibold text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500">
                  <span className="mr-4 font-mono text-xs text-rose-500">07</span><FileText className="mr-2" size={18} aria-hidden="true" /> Resume
                </a>
              </SheetClose>
            </nav>
            <p className="mt-auto text-sm leading-6 text-zinc-500">Backend systems, APIs, and data-driven applications.</p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
