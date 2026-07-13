import { AdminLoginForm } from './AdminLoginForm'

export const metadata = { title: 'Sign In | The Desk' }

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.25em] text-amber">
            The Desk
          </span>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">
            Sign In
          </h1>
        </div>
        <div className="rounded-lg border border-white/10 bg-ink-soft p-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
