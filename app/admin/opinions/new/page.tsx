import { PostEditor } from '../PostEditor'

export const metadata = { title: 'New Opinion | The Desk' }

export default function NewOpinionPage() {
  return (
    <div>
      <div className="mb-8">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
          The Desk
        </span>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          New Opinion
        </h1>
      </div>
      <PostEditor />
    </div>
  )
}
