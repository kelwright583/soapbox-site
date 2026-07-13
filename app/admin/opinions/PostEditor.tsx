'use client'

import { useActionState, useState } from 'react'
import Image from 'next/image'
import { createPost, updatePost, deletePost, type PostState } from './actions'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Trash2, ImageIcon, Save } from 'lucide-react'

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
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
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
    <form action={formAction}>
      <input type="hidden" name="cover_image" value={coverImage} />
      <input type="hidden" name="tags_json" value={JSON.stringify(tags)} />

      {/* Title & Slug */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-section-title">The Basics</div>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="ed-title" className="admin-label">Title</label>
          <input id="ed-title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="admin-input" placeholder="Give your opinion a title..." />
        </div>
        <div>
          <label htmlFor="ed-slug" className="admin-label">URL Slug</label>
          <input id="ed-slug" name="slug" defaultValue={post?.slug ?? slugify(title)} key={isEdit ? post.slug : title} required className="admin-input" style={{ fontFamily: 'monospace', fontSize: 13 }} placeholder="auto-generated-from-title" />
          <p className="admin-hint">Your post will live at: <strong style={{ color: '#C07B2A' }}>intheabsence.co.za/opinions/{slugify(title) || 'your-slug'}</strong></p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-section-title">Cover Image</div>
        <p className="admin-hint" style={{ marginTop: -8, marginBottom: 16 }}>Appears at the top of your post and when shared on social media.</p>
        {coverImage ? (
          <div style={{ position: 'relative', aspectRatio: '16/9', maxWidth: 500, borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e5e5', marginBottom: 12 }}>
            <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${coverImage}`} alt="Cover" fill style={{ objectFit: 'cover' }} sizes="500px" />
            <button type="button" onClick={() => setCoverImage('')} style={{ position: 'absolute', top: 8, right: 8, padding: '4px 12px', borderRadius: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 12, border: 'none', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '16/9', maxWidth: 500, borderRadius: 10, border: '2px dashed #ddd', background: '#fafaf9', marginBottom: 12 }}>
            <div style={{ textAlign: 'center' }}>
              <ImageIcon style={{ width: 36, height: 36, color: '#ccc', margin: '0 auto 8px' }} strokeWidth={1.3} />
              <p style={{ fontSize: 13, color: '#bbb' }}>No image selected</p>
            </div>
          </div>
        )}
        <button type="button" onClick={() => setShowMediaPicker(true)} className="admin-btn-secondary">
          {coverImage ? 'Change Image' : 'Choose from Media Library'}
        </button>
      </div>

      {/* Content */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-section-title">Content</div>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="ed-excerpt" className="admin-label">Excerpt</label>
          <textarea id="ed-excerpt" name="excerpt" defaultValue={post?.excerpt} rows={3} className="admin-input" style={{ resize: 'vertical' }} placeholder="A short summary that appears in previews..." />
          <p className="admin-hint">1-2 sentences. This shows on the opinions page before people click through.</p>
        </div>
        <div>
          <label htmlFor="ed-body" className="admin-label">Full Post</label>
          <textarea id="ed-body" name="body" defaultValue={post?.body} rows={22} className="admin-input" style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, resize: 'vertical' }} placeholder={`Write your opinion here...\n\n## Use headings to structure your thoughts\n**bold** and *italic* for emphasis\n\nEach blank line starts a new paragraph.`} />
          <p className="admin-hint">Formatting: ## Heading, ### Subheading, **bold**, *italic*, blank lines for paragraphs.</p>
        </div>
      </div>

      {/* Tags */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-section-title">Tags</div>
        <p className="admin-hint" style={{ marginTop: -8, marginBottom: 16 }}>Help readers find related posts. Topics like "life", "writing", "honesty".</p>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {tags.map((tag) => (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: '#fef3e2', color: '#C07B2A', fontSize: 13, fontWeight: 500 }}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)} style={{ color: '#d4943f', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>&times;</button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} className="admin-input" style={{ flex: 1 }} placeholder="Type a tag and press Enter..." />
          <button type="button" onClick={addTag} className="admin-btn-secondary">Add</button>
        </div>
      </div>

      {/* Publishing */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-section-title">Publishing</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444', cursor: 'pointer' }}>
            <input type="checkbox" name="published" defaultChecked={post?.published} style={{ accentColor: '#C07B2A', width: 18, height: 18 }} />
            Make this post live on the site
          </label>
          <div>
            <label htmlFor="ed-date" className="admin-label">Publish Date</label>
            <input id="ed-date" type="date" name="published_at" defaultValue={post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} className="admin-input" style={{ width: 'auto' }} />
          </div>
        </div>
        <p className="admin-hint" style={{ marginTop: 12 }}>
          {isEdit ? 'Uncheck to save as draft. Only published posts appear on your site.' : 'Leave unchecked to save as draft. Publish when ready.'}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="submit" disabled={pending} className="admin-btn-primary">
            {pending ? 'Saving...' : (<><Save style={{ width: 16, height: 16 }} />{isEdit ? 'Save Changes' : 'Create Opinion'}</>)}
          </button>
          {state.message && (
            <span style={{ fontSize: 13, fontWeight: 500, color: state.ok ? '#16a34a' : '#dc2626' }}>{state.message}</span>
          )}
        </div>
        {isEdit && (
          <button type="button" onClick={handleDelete} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'none', border: 'none', color: '#ccc', fontSize: 13, cursor: 'pointer' }}>
            <Trash2 style={{ width: 14, height: 14 }} /> Delete
          </button>
        )}
      </div>

      {showMediaPicker && (
        <MediaPicker onSelect={(path) => { setCoverImage(path); setShowMediaPicker(false) }} onClose={() => setShowMediaPicker(false)} />
      )}
    </form>
  )
}
