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
  ArrowRight,
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
    { label: 'Total Posts', value: totalPosts, icon: FileText, color: '#C07B2A' },
    { label: 'Published', value: publishedPosts, icon: Eye, color: '#16a34a' },
    { label: 'Drafts', value: totalPosts - publishedPosts, icon: PenLine, color: '#9ca3af' },
    { label: 'Images', value: totalImages, icon: ImageIcon, color: '#3b82f6' },
    { label: 'Videos', value: totalVideos, icon: Video, color: '#8b5cf6' },
    { label: 'Podcasts', value: totalPodcasts, icon: Podcast, color: '#f97316' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>
          Good to see you.
        </h1>
        <p style={{ fontSize: 15, color: '#888' }}>
          Here is what is happening with your site.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-card" style={{ padding: '20px 18px' }}>
            <Icon style={{ width: 20, height: 20, color, marginBottom: 12 }} strokeWidth={1.7} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="max-sm:!grid-cols-1">
        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-section-title">Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
              <Plus style={{ width: 16, height: 16 }} />
              Write a New Opinion
            </Link>
            <Link href="/admin/media" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
              <ImageIcon style={{ width: 16, height: 16 }} />
              Open Media Library
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="admin-card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 20px 12px' }}>
            <div className="admin-section-title" style={{ marginBottom: 0 }}>Recent Opinions</div>
          </div>
          {recentPosts && recentPosts.length > 0 ? (
            <div>
              {recentPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/admin/opinions/${post.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    textDecoration: 'none',
                    borderTop: '1px solid #f0f0ee',
                    transition: 'background 0.1s',
                  }}
                  className="hover:!bg-stone-50"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title || '(untitled)'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span className={post.published ? 'admin-badge admin-badge-live' : 'admin-badge admin-badge-draft'}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                    <ArrowRight style={{ width: 14, height: 14, color: '#ccc' }} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#aaa' }}>No posts yet. Write your first one above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
