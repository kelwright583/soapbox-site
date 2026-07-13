import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostEditor } from '../PostEditor'

export const metadata = { title: 'Edit Opinion | The Desk' }

export default async function EditOpinionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()

  if (!post) notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/opinions"
          className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-white/30 transition-colors hover:text-white/60"
        >
          &larr; All Opinions
        </Link>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
          {post.title || 'Edit Opinion'}
        </h1>
      </div>
      <PostEditor post={post} />
    </div>
  )
}
