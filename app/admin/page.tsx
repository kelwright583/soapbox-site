import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  FileText, ImageIcon, Video, Podcast, Eye, PenLine,
  Plus, ArrowRight, Sparkles,
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
    { label: 'Total Posts', value: totalPosts, icon: FileText, color: '#C07B2A', bg: 'rgba(192,123,42,0.08)' },
    { label: 'Published', value: publishedPosts, icon: Eye, color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
    { label: 'Drafts', value: totalPosts - publishedPosts, icon: PenLine, color: '#8b8b8b', bg: 'rgba(139,139,139,0.08)' },
    { label: 'Images', value: totalImages, icon: ImageIcon, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
    { label: 'Videos', value: totalVideos, icon: Video, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
    { label: 'Podcasts', value: totalPodcasts, icon: Podcast, color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
  ]

  return (
    <div>
      {/* Welcome banner */}
      <div className="admin-welcome">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 32, fontWeight: 800, color: '#1a1a1a',
              lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.01em',
            }}>
              Good to see you.
            </h1>
            <p style={{ fontSize: 15, color: '#888', lineHeight: 1.5, maxWidth: 420 }}>
              Your creative space. Everything you need to write, curate and share your thoughts with the world.
            </p>
          </div>
          <Link
            href="/admin/opinions/new"
            className="admin-btn-primary"
            style={{ textDecoration: 'none', padding: '13px 28px', fontSize: 15 }}
          >
            <Sparkles style={{ width: 17, height: 17 }} />
            Start Writing
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 14, marginBottom: 36 }}>
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="admin-stat">
            <div className="admin-stat-icon" style={{ background: bg }}>
              <Icon style={{ width: 18, height: 18, color }} strokeWidth={1.8} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#1a1a1a', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 5, fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18, alignItems: 'start' }}>
        {/* Quick actions */}
        <div className="admin-card">
          <div className="admin-section-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none', padding: 14 }}>
              <Plus style={{ width: 17, height: 17 }} /> Write a New Opinion
            </Link>
            <Link href="/admin/media" className="admin-btn-secondary" style={{ textDecoration: 'none', padding: 14 }}>
              <ImageIcon style={{ width: 17, height: 17 }} /> Open Media Library
            </Link>
            <Link href="/admin/opinions" className="admin-btn-secondary" style={{ textDecoration: 'none', padding: 14 }}>
              <FileText style={{ width: 17, height: 17 }} /> View All Opinions
            </Link>
          </div>
        </div>

        {/* Recent posts */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div style={{ padding: '22px 24px 12px' }}>
            <div className="admin-section-title" style={{ marginBottom: 0 }}>Recent Work</div>
          </div>
          {recentPosts && recentPosts.length > 0 ? (
            <div>
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/opinions/${post.id}`}
                  className="admin-row"
                  style={{ borderTop: '1px solid #e5e5e5', padding: '14px 24px' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                    {post.title || '(untitled)'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span className={`admin-badge ${post.published ? 'admin-badge-live' : 'admin-badge-draft'}`}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                    <ArrowRight style={{ width: 14, height: 14, color: '#ccc' }} />
                  </div>
                </Link>
              ))}
              <div style={{ padding: '14px 24px', borderTop: '1px solid #e5e5e5', textAlign: 'center' }}>
                <Link href="/admin/opinions" style={{ fontSize: 13, color: '#C07B2A', fontWeight: 600, textDecoration: 'none' }}>
                  View all opinions &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: '36px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#bbb', fontStyle: 'italic' }}>
                Nothing here yet. Your first thought is waiting to be written.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
