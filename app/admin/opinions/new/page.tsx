import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PostEditor } from '../PostEditor'

export const metadata = { title: 'New Opinion | The Desk' }

export default function NewOpinionPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <Link href="/admin/opinions" className="admin-nav-link" style={{ display: 'inline-flex', marginBottom: 16, color: '#aaa', fontSize: 13 }}>
        <ArrowLeft style={{ width: 14, height: 14 }} /> All Opinions
      </Link>
      <h1 className="admin-page-title">New Opinion</h1>
      <p className="admin-page-desc" style={{ marginBottom: 32 }}>
        Start writing. Save as a draft or publish when you are ready.
      </p>
      <PostEditor />
    </div>
  )
}
