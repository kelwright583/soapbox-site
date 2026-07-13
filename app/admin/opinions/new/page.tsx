import Link from 'next/link'
import { PostEditor } from '../PostEditor'

export const metadata = { title: 'New Opinion | The Desk' }

export default function NewOpinionPage() {
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
        New Opinion
      </h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '2rem' }}>
        Write a new post for your Unsolicited Opinions section. Fill in what you need and save - you can always come back to edit.
      </p>
      <PostEditor />
    </div>
  )
}
