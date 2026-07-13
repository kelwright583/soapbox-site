import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PostEditor } from '../PostEditor'

export const metadata = { title: 'New Opinion | The Desk' }

export default function NewOpinionPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <Link
        href="/admin/opinions"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, fontWeight: 500, color: '#999', textDecoration: 'none' }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} />
        All Opinions
      </Link>
      <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>
        New Opinion
      </h1>
      <p style={{ fontSize: 14, color: '#999', marginBottom: 32 }}>
        Write a new post for your Unsolicited Opinions section. Save as a draft or publish straight away.
      </p>
      <PostEditor />
    </div>
  )
}
