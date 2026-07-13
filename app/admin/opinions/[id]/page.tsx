import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
    <div style={{ maxWidth: 720 }}>
      <Link
        href="/admin/opinions"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, fontWeight: 500, color: '#999', textDecoration: 'none' }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} />
        All Opinions
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a' }}>
          {post.title || 'Edit Opinion'}
        </h1>
        <span className={post.published ? 'admin-badge admin-badge-live' : 'admin-badge admin-badge-draft'}>
          {post.published ? 'Live' : 'Draft'}
        </span>
      </div>
      <p style={{ fontSize: 14, color: '#999', marginBottom: 32 }}>
        {post.published
          ? 'This post is live. Changes appear on your site after saving.'
          : 'This is a draft. Publish it when you are ready.'}
      </p>
      <PostEditor post={post} />
    </div>
  )
}
