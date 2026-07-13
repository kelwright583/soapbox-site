import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Opinions | The Desk' }

function formatDate(iso: string | null) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function OpinionsAdminPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, published, published_at, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>
            Unsolicited Opinions
          </h1>
          <p style={{ fontSize: 14, color: '#999' }}>
            Your blog posts. Click any row to edit.
          </p>
        </div>
        <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus style={{ width: 16, height: 16 }} />
          New Opinion
        </Link>
      </div>

      {/* Posts list */}
      {posts && posts.length > 0 ? (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 100px',
              padding: '12px 20px',
              borderBottom: '1px solid #f0f0ee',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#bbb',
            }}
            className="max-sm:hidden"
          >
            <span>Title</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {/* Rows */}
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/admin/opinions/${post.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                textDecoration: 'none',
                borderTop: i > 0 ? '1px solid #f5f5f3' : 'none',
                transition: 'background 0.1s',
              }}
              className="hover:!bg-stone-50 sm:!grid-cols-[1fr_120px_100px_24px]"
            >
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#333', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title || '(untitled)'}
                </span>
                <span className="sm:hidden" style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>
                  {formatDate(post.published_at ?? post.updated_at)}
                </span>
              </div>
              <span className={post.published ? 'admin-badge admin-badge-live' : 'admin-badge admin-badge-draft'}>
                {post.published ? 'Live' : 'Draft'}
              </span>
              <span className="max-sm:hidden" style={{ fontSize: 13, color: '#aaa' }}>
                {formatDate(post.published_at ?? post.updated_at)}
              </span>
              <ArrowRight className="max-sm:hidden" style={{ width: 14, height: 14, color: '#ccc' }} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="admin-card" style={{ textAlign: 'center', padding: '56px 24px' }}>
          <p style={{ fontSize: 15, color: '#aaa', marginBottom: 20 }}>
            No opinions yet. Share your first thought with the world.
          </p>
          <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} />
            Write Your First Opinion
          </Link>
        </div>
      )}
    </div>
  )
}
