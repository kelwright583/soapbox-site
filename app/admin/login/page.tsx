import { PenTool } from 'lucide-react'
import { AdminLoginForm } from './AdminLoginForm'

export const metadata = { title: 'Sign In | The Desk' }

export default function AdminLoginPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#f5f5f4' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#C07B2A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <PenTool style={{ width: 22, height: 22, color: '#fff' }} strokeWidth={2} />
          </div>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#999' }}>
            Sign in to The Desk to manage your site.
          </p>
        </div>
        <div className="admin-card" style={{ padding: 32 }}>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  )
}
