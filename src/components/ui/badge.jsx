import { cn } from '../../lib/utils'

export function Badge({ className, children }) {
  return <span className={cn('inline-flex min-h-7 items-center rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-xs text-zinc-300', className)}>{children}</span>
}
