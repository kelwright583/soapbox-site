import { cn } from '@/lib/utils'

interface SaveBarProps {
  pending: boolean
  message?: string
  ok?: boolean
  label?: string
}

export function SaveBar({ pending, message, ok, label = 'Save' }: SaveBarProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="submit"
        disabled={pending}
        className={cn(
          'rounded-lg border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all',
          pending
            ? 'cursor-not-allowed border-white/[0.06] text-white/20'
            : 'border-amber/60 text-amber hover:bg-amber hover:text-white',
        )}
      >
        {pending ? 'Saving\u2026' : label}
      </button>
      {message && (
        <p
          aria-live="polite"
          className={cn('text-xs font-medium', ok ? 'text-green-400' : 'text-red-400')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
