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
    <div style={{ maxWidth: '720px' }}>
      <Link
        href="/admin/opinions"
        style={{ display: 'inline-block', marginBottom: '1rem', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.15s' }}
        className="hover:!text-white/60"
      >
        &larr; Back to all opinions
      </Link>
      <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
        {post.title || 'Edit Opinion'}
      </h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem' }}>
        {post.published
          ? 'This post is live on the site. Changes will appear after saving.'
          : 'This post is saved as a draft. Publish it when you are ready.'}
      </p>
      <PostEditor post={post} />
    </div>
  )
}
