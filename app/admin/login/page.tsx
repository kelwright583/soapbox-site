import { AdminLoginForm } from './AdminLoginForm'

export const metadata = { title: 'Sign In | The Desk' }

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber">
            The Desk
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-white/30">
            Welcome back. Enter your credentials below.
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-ink-soft p-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
