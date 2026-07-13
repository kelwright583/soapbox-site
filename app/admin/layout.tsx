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

  // Not logged in: still wrap in dark shell (for login page)
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
    <div className="admin-shell lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-5xl p-5 lg:p-10">{children}</main>
      </div>
    </div>
  )
}
