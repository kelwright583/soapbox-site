import Link from 'next/link'
import { PostEditor } from '../PostEditor'

export const metadata = { title: 'New Opinion | The Desk' }

export default function NewOpinionPage() {
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
          New Opinion
        </h1>
      </div>
      <PostEditor />
    </div>
  )
}
