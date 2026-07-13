import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Opinions | The Desk' }

function formatDate(iso: string | null) {
  if (!iso) return '\u2014'
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
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            The Desk
          </span>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
            Unsolicited Opinions
          </h1>
        </div>
        <Link
          href="/admin/opinions/new"
          className="rounded border border-amber px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber transition-colors hover:bg-amber hover:text-white"
        >
          + New Opinion
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-ink-soft">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                  Title
                </th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 md:table-cell">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="group transition-colors hover:bg-ink-soft">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/opinions/${post.id}`}
                      className="font-medium text-white transition-colors group-hover:text-amber"
                    >
                      {post.title || '(untitled)'}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-white/40 md:table-cell">
                    {post.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        post.published
                          ? 'bg-amber/20 text-amber'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-white/40 sm:table-cell">
                    {formatDate(post.published_at ?? post.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-white/40">No opinions yet. Create your first one.</p>
      )}
    </div>
  )
}
