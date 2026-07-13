'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { createPost, updatePost, deletePost, type PostState } from './actions'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Trash2, ImageIcon, Check } from 'lucide-react'

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
  const isEdit = !!post

  const action = isEdit ? updatePost.bind(null, post.id) : createPost

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
    if (!confirm('Delete this opinion permanently? This cannot be undone.')) return
    await deletePost(post.id)
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="cover_image" value={coverImage} />
      <input type="hidden" name="tags_json" value={JSON.stringify(tags)} />

      {/* ── SECTION: The Basics ── */}
      <div className="admin-card">
        <p className="admin-section-title">The Basics</p>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="admin-label">
              Title <span style={{ color: '#C07B2A' }}>*</span>
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="admin-input"
              placeholder="Give your opinion a name..."
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="admin-label">
              URL Slug <span style={{ color: '#C07B2A' }}>*</span>
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={post?.slug ?? slugify(title)}
              key={isEdit ? post.slug : title}
              required
              className="admin-input"
              style={{ fontFamily: 'monospace' }}
              placeholder="auto-generated-from-title"
            />
            <p className="admin-hint">
              This becomes the URL: intheabsence.co.za/opinions/<strong>{slugify(title) || 'your-slug'}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION: Cover Image ── */}
      <div className="admin-card">
        <p className="admin-section-title">Cover Image</p>
        <p className="admin-hint" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          This appears at the top of your post and in social media previews.
        </p>

        {coverImage ? (
          <div style={{ position: 'relative', aspectRatio: '16/9', maxWidth: '480px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '0.75rem' }}>
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${coverImage}`}
              alt="Cover"
              fill
              className="object-cover"
              sizes="480px"
            />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '12px', border: 'none', cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '16/9', maxWidth: '480px', borderRadius: '0.5rem', border: '2px dashed rgba(255,255,255,0.08)', marginBottom: '0.75rem' }}>
            <div style={{ textAlign: 'center' }}>
              <ImageIcon style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.1)', margin: '0 auto 0.5rem' }} strokeWidth={1.5} />
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>No image selected</p>
            </div>
          </div>
        )}
        <button type="button" onClick={() => setShowMediaPicker(true)} className="admin-btn-outline">
          {coverImage ? 'Change Image' : 'Choose from Media Library'}
        </button>
      </div>

      {/* ── SECTION: Content ── */}
      <div className="admin-card">
        <p className="admin-section-title">Content</p>

        <div className="space-y-5">
          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="admin-label">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={post?.excerpt}
              rows={3}
              className="admin-input"
              placeholder="A short summary that appears in previews and on the opinions listing page..."
            />
            <p className="admin-hint">
              Keep it to 1-2 sentences. This shows on the opinions page before people click through.
            </p>
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="admin-label">
              Full Post
            </label>
            <textarea
              id="body"
              name="body"
              defaultValue={post?.body}
              rows={20}
              className="admin-input"
              style={{ fontFamily: 'monospace', lineHeight: '1.7' }}
              placeholder={`Write your opinion here...

You can use simple formatting:
## Heading
### Subheading
**bold text**
*italic text*`}
            />
            <p className="admin-hint">
              Supports Markdown: use ## for headings, **bold**, *italic*, and blank lines for paragraphs.
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION: Tags ── */}
      <div className="admin-card">
        <p className="admin-section-title">Tags</p>
        <p className="admin-hint" style={{ marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Help readers find related posts. Add topics like "life", "writing", "growth", etc.
        </p>

        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(192,123,42,0.12)', color: '#C07B2A', fontSize: '13px', fontWeight: 500 }}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={{ color: 'rgba(192,123,42,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            className="admin-input"
            style={{ flex: 1 }}
            placeholder="Type a tag and press Enter..."
          />
          <button type="button" onClick={addTag} className="admin-btn-outline">
            Add
          </button>
        </div>
      </div>

      {/* ── SECTION: Publishing ── */}
      <div className="admin-card">
        <p className="admin-section-title">Publishing</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published}
              style={{ accentColor: '#C07B2A', width: '18px', height: '18px' }}
            />
            Make this post live on the site
          </label>

          <div>
            <label htmlFor="published_at" className="admin-label">
              Publish Date
            </label>
            <input
              id="published_at"
              type="date"
              name="published_at"
              defaultValue={
                post?.published_at
                  ? new Date(post.published_at).toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              className="admin-input"
              style={{ width: 'auto' }}
            />
          </div>
        </div>

        <p className="admin-hint" style={{ marginTop: '0.75rem' }}>
          {isEdit
            ? 'Uncheck to save as a draft. Only published posts appear on the public site.'
            : 'Leave unchecked to save as a draft. You can publish it later.'}
        </p>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" disabled={pending} className="admin-btn-primary">
            {pending ? (
              'Saving...'
            ) : (
              <>
                <Check style={{ width: 16, height: 16 }} />
                {isEdit ? 'Save Changes' : 'Create Opinion'}
              </>
            )}
          </button>
          {state.message && (
            <p style={{ fontSize: '13px', fontWeight: 500, color: state.ok ? '#4ade80' : '#f87171' }}>
              {state.message}
            </p>
          )}
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'transparent', border: 'none', color: 'rgba(248,113,113,0.5)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,113,113,0.5)')}
          >
            <Trash2 style={{ width: 14, height: 14 }} />
            Delete Post
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
