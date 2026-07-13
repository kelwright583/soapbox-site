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
      <Link href="/admin" className="admin-nav-link" style={{ display: 'inline-flex', marginBottom: 16, color: '#aaa', fontSize: 13 }}>
        <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Dashboard
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>{post.title || 'Edit Opinion'}</h1>
        <span className={`admin-badge ${post.published ? 'admin-badge-live' : 'admin-badge-draft'}`}>
          {post.published ? 'Live' : 'Draft'}
        </span>
      </div>
      <p className="admin-page-desc" style={{ marginBottom: 32 }}>
        {post.published ? 'This post is live. Changes appear after saving.' : 'This is a draft. Publish when ready.'}
      </p>
      <PostEditor post={post} />
    </div>
  )
}
