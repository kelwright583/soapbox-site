'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createPost, updatePost, deletePost, type PostState } from './actions'
import { SaveBar } from '@/components/admin/SaveBar'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Trash2, ImageIcon } from 'lucide-react'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  cover_image: string | null
  tags: string[]
  published: boolean
  published_at: string | null
}

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter()
  const isEdit = !!post

  const action = isEdit
    ? updatePost.bind(null, post.id)
    : createPost

  const [state, formAction, pending] = useActionState<PostState, FormData>(
    action,
    { message: '', ok: false },
  )

  const [coverImage, setCoverImage] = useState(post?.cover_image ?? '')
  const [tags, setTags] = useState(post?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [title, setTitle] = useState(post?.title ?? '')

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter((tt) => tt !== tag))
  }

  async function handleDelete() {
    if (!post) return
    if (!confirm('Delete this opinion permanently?')) return
    await deletePost(post.id)
  }

  const inputClass =
    'w-full rounded-lg border border-white/[0.08] bg-ink px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber/60 focus:outline-none focus:ring-1 focus:ring-amber/20 transition-colors'

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden fields */}
      <input type="hidden" name="cover_image" value={coverImage} />
      <input type="hidden" name="tags_json" value={JSON.stringify(tags)} />

      {/* Title */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Title <span className="text-amber">*</span>
        </label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
          placeholder="The one about..."
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Slug <span className="text-amber">*</span>
        </label>
        <input
          name="slug"
          defaultValue={post?.slug ?? slugify(title)}
          key={isEdit ? post.slug : title}
          required
          className={`${inputClass} font-mono`}
          placeholder="the-one-about"
        />
      </div>

      {/* Cover image */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Cover Image
        </label>
        {coverImage ? (
          <div className="relative mb-3 aspect-[16/9] max-w-md overflow-hidden rounded-xl border border-white/[0.06]">
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${coverImage}`}
              alt="Cover"
              fill
              className="object-cover"
              sizes="400px"
            />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute right-2 top-2 rounded-lg bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="mb-3 flex aspect-[16/9] max-w-md items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01]">
            <div className="text-center">
              <ImageIcon className="mx-auto mb-2 h-8 w-8 text-white/10" strokeWidth={1.5} />
              <p className="text-xs text-white/20">No cover image</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowMediaPicker(true)}
          className="rounded-lg border border-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/40 transition-all hover:border-amber/30 hover:text-white/70"
        >
          {coverImage ? 'Change image' : 'Select image'}
        </button>
      </div>

      {/* Excerpt */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={3}
          className={inputClass}
          placeholder="A short summary..."
        />
      </div>

      {/* Body */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Body <span className="text-white/15">(Markdown supported)</span>
        </label>
        <textarea
          name="body"
          defaultValue={post?.body}
          rows={24}
          className={`${inputClass} font-mono leading-relaxed`}
          placeholder={`Write your opinion here...

## Heading
**bold** *italic* ~~strikethrough~~`}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Tags
        </label>
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-amber/50 transition-colors hover:text-red-400"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            className={`flex-1 ${inputClass}`}
            placeholder="Add tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="shrink-0 rounded-lg border border-white/[0.08] px-4 py-2 text-xs font-semibold text-white/40 transition-all hover:border-amber/30 hover:text-white/70"
          >
            Add
          </button>
        </div>
      </div>

      {/* Publish controls */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published}
              className="h-4 w-4 rounded border-white/20 accent-amber"
            />
            Published
          </label>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Publish date
            </label>
            <input
              type="date"
              name="published_at"
              defaultValue={
                post?.published_at
                  ? new Date(post.published_at).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              className="rounded-lg border border-white/[0.08] bg-ink px-3 py-2 text-sm text-white focus:border-amber/60 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-6">
        <SaveBar pending={pending} message={state.message} ok={state.ok} />
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-red-400/50 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        )}
      </div>

      {/* Media picker modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(path) => {
            setCoverImage(path)
            setShowMediaPicker(false)
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </form>
  )
}
