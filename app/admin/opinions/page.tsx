import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber">
            The Desk
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
            Unsolicited Opinions
          </h1>
        </div>
        <Link
          href="/admin/opinions/new"
          className="inline-flex rounded-lg border border-amber/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber transition-all hover:bg-amber hover:text-white"
        >
          + New Opinion
        </Link>
      </div>

      {/* Table */}
      {posts && posts.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                  Title
                </th>
                <th className="hidden px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 md:table-cell">
                  Slug
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
                  Status
                </th>
                <th className="hidden px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {posts.map((post) => (
                <tr key={post.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/opinions/${post.id}`}
                      className="font-medium text-white/80 transition-colors group-hover:text-amber"
                    >
                      {post.title || '(untitled)'}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3.5 font-mono text-xs text-white/25 md:table-cell">
                    {post.slug}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        post.published
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/[0.04] text-white/30'
                      }`}
                    >
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3.5 text-xs text-white/25 sm:table-cell">
                    {formatDate(post.published_at ?? post.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/[0.08] px-8 py-16 text-center">
          <p className="text-sm text-white/30">No opinions yet. Write your first one.</p>
          <Link
            href="/admin/opinions/new"
            className="mt-4 inline-block text-xs font-semibold text-amber hover:text-amber-light"
          >
            + Create Opinion
          </Link>
        </div>
      )}
    </div>
  )
}
