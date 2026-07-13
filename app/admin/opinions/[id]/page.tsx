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
    <div>
      <div className="mb-8">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
          The Desk
        </span>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          {post.title || 'Edit Opinion'}
        </h1>
      </div>
      <PostEditor post={post} />
    </div>
  )
}
