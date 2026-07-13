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
          'rounded border px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors',
          pending
            ? 'cursor-not-allowed border-white/10 text-white/30'
            : 'border-amber text-amber hover:bg-amber hover:text-white',
        )}
      >
        {pending ? 'Saving\u2026' : label}
      </button>
      {message && (
        <p
          aria-live="polite"
          className={cn('text-xs', ok ? 'text-green-400' : 'text-red-400')}
        >
          {message}
        </p>
      )}
    </div>
  )
}
