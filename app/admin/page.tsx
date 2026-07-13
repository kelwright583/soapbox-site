import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  FileText,
  ImageIcon,
  Video,
  Podcast,
  Eye,
  PenLine,
  Plus,
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
    { label: 'Opinions', value: totalPosts, icon: FileText, color: '#C07B2A', href: '/admin/opinions' },
    { label: 'Published', value: publishedPosts, icon: Eye, color: '#4ade80', href: '/admin/opinions' },
    { label: 'Drafts', value: totalPosts - publishedPosts, icon: PenLine, color: 'rgba(255,255,255,0.4)', href: '/admin/opinions' },
    { label: 'Images', value: totalImages, icon: ImageIcon, color: '#60a5fa', href: '/admin/media' },
    { label: 'Videos', value: totalVideos, icon: Video, color: '#a78bfa', href: '/admin/media?tab=videos' },
    { label: 'Podcasts', value: totalPodcasts, icon: Podcast, color: '#fb923c', href: '/admin/media?tab=podcasts' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#C07B2A', marginBottom: '0.25rem' }}>
          The Desk
        </p>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
          Welcome back. Here is an overview of your content.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', marginBottom: '2.5rem' }}>
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="admin-card"
            style={{ textDecoration: 'none', transition: 'border-color 0.15s' }}
          >
            <Icon style={{ width: 20, height: 20, color, marginBottom: '0.75rem' }} strokeWidth={1.8} />
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{value}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '0.125rem' }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="admin-section-title">Quick Actions</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} />
            New Opinion
          </Link>
          <Link href="/admin/media" className="admin-btn-outline" style={{ textDecoration: 'none' }}>
            <ImageIcon style={{ width: 16, height: 16 }} />
            Media Library
          </Link>
        </div>
      </div>

      {/* Recent opinions */}
      {recentPosts && recentPosts.length > 0 && (
        <div>
          <p className="admin-section-title">Recent Opinions</p>
          <div style={{ borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            {recentPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/admin/opinions/${post.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1.25rem',
                  textDecoration: 'none',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  transition: 'background 0.15s',
                }}
                className="hover:bg-white/[0.02]"
              >
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                  {post.title || '(untitled)'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      padding: '0.125rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: post.published ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                      color: post.published ? '#4ade80' : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {post.published ? 'Live' : 'Draft'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
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
      )}
    </div>
  )
}
