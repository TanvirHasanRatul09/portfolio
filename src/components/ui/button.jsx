import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva('inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      primary: 'bg-zinc-50 text-zinc-950 hover:bg-white',
      outline: 'border border-white/15 bg-white/[0.03] text-white hover:border-white/30 hover:bg-white/[0.07]',
      ghost: 'text-zinc-300 hover:bg-white/[0.06] hover:text-white',
    },
  },
  defaultVariants: { variant: 'primary' },
})

export function Button({ className, variant, asChild = false, ...props }) {
  const Component = asChild ? Slot : 'button'
  return <Component data-magnetic className={cn(buttonVariants({ variant }), className)} {...props} />
}
