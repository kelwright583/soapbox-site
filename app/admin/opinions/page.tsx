import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'

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
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#C07B2A', marginBottom: '0.25rem' }}>
            The Desk
          </p>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Unsolicited Opinions
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
            Manage your blog posts. Click any title to edit.
          </p>
        </div>
        <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          <Plus style={{ width: 16, height: 16 }} />
          New Opinion
        </Link>
      </div>

      {/* Table */}
      {posts && posts.length > 0 ? (
        <div style={{ borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>
                  Title
                </th>
                <th className="hidden md:table-cell" style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>
                  URL
                </th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>
                  Status
                </th>
                <th className="hidden sm:table-cell" style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id}
                  className="group hover:bg-white/[0.02]"
                  style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                >
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <Link
                      href={`/admin/opinions/${post.id}`}
                      style={{ fontWeight: 500, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                      className="group-hover:!text-amber"
                    >
                      {post.title || '(untitled)'}
                    </Link>
                  </td>
                  <td className="hidden md:table-cell" style={{ padding: '0.875rem 1.25rem', fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
                    /opinions/{post.slug}
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
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
                  </td>
                  <td className="hidden sm:table-cell" style={{ padding: '0.875rem 1.25rem', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
                    {formatDate(post.published_at ?? post.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ borderRadius: '0.75rem', border: '2px dashed rgba(255,255,255,0.08)', padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
            No opinions yet. Write your first one and share your thoughts with the world.
          </p>
          <Link href="/admin/opinions/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
            <Plus style={{ width: 16, height: 16 }} />
            Create Your First Opinion
          </Link>
        </div>
      )}
    </div>
  )
}
