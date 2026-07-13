import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Opinions | The Desk' }

function formatDate(iso: string | null) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function OpinionsAdminPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, published, published_at, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 className="admin-page-title">Unsolicited Opinions</h1>
          <p className="admin-page-desc">Your blog posts. Click any to edit.</p>
        </div>
        <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus style={{ width: 16, height: 16 }} /> New Opinion
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 24px', padding: '12px 20px', borderBottom: '1px solid #f0f0ee' }}>
            <span className="admin-section-title" style={{ marginBottom: 0 }}>Title</span>
            <span className="admin-section-title" style={{ marginBottom: 0 }}>Status</span>
            <span className="admin-section-title admin-hide-mobile" style={{ marginBottom: 0 }}>Date</span>
            <span />
          </div>

          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/admin/opinions/${post.id}`}
              className="admin-row"
              style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px 24px', borderTop: '1px solid #f5f5f3', gap: 8 }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.title || '(untitled)'}
              </span>
              <span className={`admin-badge ${post.published ? 'admin-badge-live' : 'admin-badge-draft'}`}>
                {post.published ? 'Live' : 'Draft'}
              </span>
              <span className="admin-hide-mobile" style={{ fontSize: 13, color: '#aaa' }}>
                {formatDate(post.published_at ?? post.updated_at)}
              </span>
              <ArrowRight style={{ width: 14, height: 14, color: '#ccc' }} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="admin-card" style={{ textAlign: 'center', padding: '56px 24px' }}>
          <p style={{ fontSize: 15, color: '#aaa', marginBottom: 20 }}>
            No opinions yet. Share your first thought with the world.
          </p>
          <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} /> Write Your First Opinion
          </Link>
        </div>
      )}
    </div>
  )
}
