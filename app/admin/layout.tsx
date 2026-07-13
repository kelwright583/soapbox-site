import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from './AdminSidebar'

export const metadata = {
  title: 'The Desk | In the Absence of a Soapbox',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div className="admin-shell">{children}</div>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <div className="admin-shell" style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
