import { AdminLoginForm } from './AdminLoginForm'

export const metadata = { title: 'Sign In | The Desk' }

export default function AdminLoginPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#C07B2A', marginBottom: '0.5rem' }}>
            The Desk
          </span>
          <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            Sign In
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
            Welcome back. Enter your credentials below.
          </p>
        </div>
        <div className="admin-card" style={{ padding: '2rem' }}>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
