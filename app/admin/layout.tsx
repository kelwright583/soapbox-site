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

  // Allow login page through without auth
  if (!user) {
    return <>{children}</>
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
    <div className="min-h-screen bg-ink lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
