'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createPost, updatePost, deletePost, type PostState } from './actions'
import { SaveBar } from '@/components/admin/SaveBar'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Trash2 } from 'lucide-react'

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
    setTags(tags.filter((t) => t !== tag))
  }

  async function handleDelete() {
    if (!post) return
    if (!confirm('Delete this opinion permanently?')) return
    await deletePost(post.id)
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="cover_image" value={coverImage} />
      <input type="hidden" name="tags_json" value={JSON.stringify(tags)} />

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Title *
        </label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
          placeholder="The one about..."
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Slug *
        </label>
        <div className="flex gap-2">
          <input
            name="slug"
            defaultValue={post?.slug ?? slugify(title)}
            key={isEdit ? post.slug : title}
            required
            className="flex-1 rounded-lg border border-white/10 bg-ink px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
            placeholder="the-one-about"
          />
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Cover Image
        </label>
        {coverImage ? (
          <div className="relative mb-3 aspect-[16/9] max-w-md overflow-hidden rounded-lg">
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
              className="absolute right-2 top-2 rounded bg-ink/80 px-2 py-1 text-xs text-white hover:bg-red-500"
            >
              Remove
            </button>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setShowMediaPicker(true)}
          className="rounded border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/60 hover:border-amber/30 hover:text-white"
        >
          {coverImage ? 'Change image' : 'Select image'}
        </button>
      </div>

      {/* Excerpt */}
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
          placeholder="A short summary..."
        />
      </div>

      {/* Body */}
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Body (Markdown supported)
        </label>
        <textarea
          name="body"
          defaultValue={post?.body}
          rows={20}
          className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 font-mono text-sm leading-relaxed text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
          placeholder="Write your opinion here...

# Heading
## Sub-heading
**bold** *italic* ~~strikethrough~~"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Tags
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-amber/60 hover:text-red-400"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
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
            className="flex-1 rounded-lg border border-white/10 bg-ink px-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-amber focus:outline-none"
            placeholder="Add tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 hover:border-amber/30 hover:text-white"
          >
            Add
          </button>
        </div>
      </div>

      {/* Publish controls */}
      <div className="flex flex-wrap items-center gap-6 rounded-lg border border-white/10 bg-ink-soft p-4">
        <label className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post?.published}
            className="h-4 w-4 rounded border-white/20 accent-amber"
          />
          Published
        </label>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/40">
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
            className="rounded border border-white/10 bg-ink px-3 py-1.5 text-sm text-white focus:border-amber focus:outline-none"
          />
        </div>
      </div>

      {/* Save + Delete bar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <SaveBar pending={pending} message={state.message} ok={state.ok} />
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-red-400/60 transition-colors hover:text-red-400"
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
