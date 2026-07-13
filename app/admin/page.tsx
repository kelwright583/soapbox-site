import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [postsRes, publishedRes, mediaRes] = await Promise.allSettled([
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('media_assets').select('id', { count: 'exact', head: true }),
  ])

  const totalPosts = postsRes.status === 'fulfilled' ? (postsRes.value.count ?? 0) : 0
  const publishedPosts = publishedRes.status === 'fulfilled' ? (publishedRes.value.count ?? 0) : 0
  const totalMedia = mediaRes.status === 'fulfilled' ? (mediaRes.value.count ?? 0) : 0

  const stats = [
    { label: 'Total Opinions', value: totalPosts, href: '/admin/opinions' },
    { label: 'Published', value: publishedPosts, href: '/admin/opinions' },
    { label: 'Drafts', value: totalPosts - publishedPosts, href: '/admin/opinions' },
    { label: 'Photos', value: totalMedia, href: '/admin/photos' },
  ]

  return (
    <div>
      <div className="mb-8">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
          The Desk
        </span>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          Dashboard
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border border-white/10 bg-ink-soft p-6 transition-colors hover:border-amber/30"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {label}
            </p>
            <p className="font-display mt-2 text-3xl font-extrabold text-white">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/admin/opinions/new"
          className="inline-block rounded border border-amber px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber transition-colors hover:bg-amber hover:text-white"
        >
          + New Opinion
        </Link>
      </div>
    </div>
  )
}
