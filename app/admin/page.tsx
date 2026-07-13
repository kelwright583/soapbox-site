import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  FileText,
  ImageIcon,
  Video,
  Podcast,
  Eye,
  PenLine,
} from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [postsRes, publishedRes, imagesRes, videosRes, podcastsRes] = await Promise.allSettled([
    supabase.from('posts').select('id', { count: 'exact', head: true }),
    supabase.from('posts').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('media_assets').select('id', { count: 'exact', head: true }).eq('type', 'image'),
    supabase.from('media_assets').select('id', { count: 'exact', head: true }).eq('type', 'video'),
    supabase.from('media_assets').select('id', { count: 'exact', head: true }).eq('type', 'podcast'),
  ])

  const totalPosts = postsRes.status === 'fulfilled' ? (postsRes.value.count ?? 0) : 0
  const publishedPosts = publishedRes.status === 'fulfilled' ? (publishedRes.value.count ?? 0) : 0
  const totalImages = imagesRes.status === 'fulfilled' ? (imagesRes.value.count ?? 0) : 0
  const totalVideos = videosRes.status === 'fulfilled' ? (videosRes.value.count ?? 0) : 0
  const totalPodcasts = podcastsRes.status === 'fulfilled' ? (podcastsRes.value.count ?? 0) : 0

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, published, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Opinions', value: totalPosts, icon: FileText, color: 'text-amber', href: '/admin/opinions' },
    { label: 'Published', value: publishedPosts, icon: Eye, color: 'text-green-400', href: '/admin/opinions' },
    { label: 'Drafts', value: totalPosts - publishedPosts, icon: PenLine, color: 'text-white/40', href: '/admin/opinions' },
    { label: 'Images', value: totalImages, icon: ImageIcon, color: 'text-blue-400', href: '/admin/media' },
    { label: 'Videos', value: totalVideos, icon: Video, color: 'text-purple-400', href: '/admin/media?tab=videos' },
    { label: 'Podcasts', value: totalPodcasts, icon: Podcast, color: 'text-orange-400', href: '/admin/media?tab=podcasts' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber">
          The Desk
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">
          Dashboard
        </h1>
      </div>

      {/* Stat cards */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-white/[0.06] bg-ink-soft p-5 transition-all hover:border-amber/20 hover:bg-ink-soft/80"
          >
            <Icon className={`mb-3 h-5 w-5 ${color}`} strokeWidth={1.8} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="mt-0.5 text-[11px] font-medium text-white/30">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/opinions/new"
            className="rounded-lg border border-amber/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber transition-all hover:bg-amber hover:text-white"
          >
            + New Opinion
          </Link>
          <Link
            href="/admin/media"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 transition-all hover:border-white/20 hover:text-white"
          >
            Upload Media
          </Link>
        </div>
      </div>

      {/* Recent opinions */}
      {recentPosts && recentPosts.length > 0 && (
        <div>
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Recent Opinions
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <div className="divide-y divide-white/[0.04]">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/opinions/${post.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-medium text-white/80 transition-colors hover:text-amber">
                    {post.title || '(untitled)'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        post.published
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/[0.04] text-white/30'
                      }`}
                    >
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-white/20">
                      {new Date(post.updated_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
