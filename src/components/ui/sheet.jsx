import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

export function SheetContent({ children, className, ...props }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=closed]:animate-none" />
      <Dialog.Content
        className={cn('fixed inset-y-0 right-0 z-50 flex w-[min(86vw,22rem)] flex-col border-l border-violet-200/15 bg-[#1d1027] p-6 shadow-2xl focus:outline-none', className)}
        {...props}
      >
        <Dialog.Title className="sr-only">Portfolio navigation</Dialog.Title>
        <Dialog.Description className="sr-only">Navigate to a section of the portfolio.</Dialog.Description>
        <Dialog.Close className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] grid size-11 place-items-center rounded-md text-zinc-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500" aria-label="Close menu">
          <X aria-hidden="true" />
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}
