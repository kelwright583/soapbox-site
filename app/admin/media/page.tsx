'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Trash2, Video, Podcast, ImageIcon, Link2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Dropzone } from '@/components/admin/Dropzone'

interface MediaAsset {
  id: string
  storage_path: string
  type: 'image' | 'video' | 'podcast'
  external_url: string | null
  caption: string
  width: number | null
  height: number | null
  alt_text: string
  created_at: string
}

type TabKey = 'all' | 'images' | 'videos' | 'podcasts'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'images', label: 'Images' },
  { key: 'videos', label: 'Videos' },
  { key: 'podcasts', label: 'Podcasts' },
]

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

function getVideoThumbnail(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
  return null
}

export default function MediaPage() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as TabKey) || 'all'

  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab)
  const [showAddModal, setShowAddModal] = useState<'video' | 'podcast' | null>(null)
  const [externalUrl, setExternalUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [saving, setSaving] = useState(false)

  const loadAssets = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
    setAssets((data as MediaAsset[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  async function handleImageUpload(path: string, width: number, height: number) {
    const supabase = createClient()
    await supabase.from('media_assets').insert({
      storage_path: path,
      type: 'image',
      width,
      height,
    })
    loadAssets()
  }

  async function handleAddExternal() {
    if (!showAddModal || !externalUrl.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('media_assets').insert({
      storage_path: '',
      type: showAddModal,
      external_url: externalUrl.trim(),
      caption: caption.trim(),
    })
    setExternalUrl('')
    setCaption('')
    setShowAddModal(null)
    setSaving(false)
    loadAssets()
  }

  async function handleDelete(id: string, storagePath: string, type: string) {
    if (!confirm('Delete this media?')) return
    const supabase = createClient()
    if (type === 'image' && storagePath) {
      await supabase.storage.from('media').remove([storagePath])
    }
    await supabase.from('media_assets').delete().eq('id', id)
    loadAssets()
  }

  const filtered = assets.filter((a) => {
    if (activeTab === 'all') return true
    if (activeTab === 'images') return a.type === 'image'
    if (activeTab === 'videos') return a.type === 'video'
    if (activeTab === 'podcasts') return a.type === 'podcast'
    return true
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#C07B2A', marginBottom: '0.25rem' }}>
            The Desk
          </p>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            Media Library
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
            Upload images, add videos and podcasts. Use them in your posts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowAddModal('video')} className="admin-btn-outline">
            <Video style={{ width: 14, height: 14 }} /> Add Video
          </button>
          <button onClick={() => setShowAddModal('podcast')} className="admin-btn-outline">
            <Podcast style={{ width: 14, height: 14 }} /> Add Podcast
          </button>
        </div>
      </div>

      {/* Upload zone */}
      <Dropzone onUpload={handleImageUpload} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginTop: '2rem', marginBottom: '1.5rem' }}>
        {tabs.map(({ key, label }) => {
          const count = key === 'all'
            ? assets.length
            : assets.filter((a) =>
                key === 'images' ? a.type === 'image' :
                key === 'videos' ? a.type === 'video' :
                a.type === 'podcast'
              ).length
          const active = activeTab === key
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '0.625rem 1rem',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${active ? '#C07B2A' : 'transparent'}`,
                marginBottom: '-1px',
                color: active ? '#C07B2A' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
            >
              {label} <span style={{ opacity: 0.5 }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ padding: '3rem 0', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
          Loading...
        </p>
      ) : filtered.length === 0 ? (
        <div style={{ borderRadius: '0.75rem', border: '2px dashed rgba(255,255,255,0.08)', padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
            {activeTab === 'all' ? 'No media yet. Upload images or add videos and podcasts above.' :
             activeTab === 'images' ? 'No images yet. Drag and drop files above to upload.' :
             activeTab === 'videos' ? 'No videos yet. Click "Add Video" to paste a YouTube or Vimeo link.' :
             'No podcasts yet. Click "Add Podcast" to paste a Spotify or Apple Podcasts link.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group"
              style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)', background: '#242424', transition: 'border-color 0.15s' }}
            >
              {asset.type === 'image' && asset.storage_path ? (
                <Image
                  src={`${SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`}
                  alt={asset.alt_text || ''}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : asset.type === 'video' && asset.external_url ? (
                <>
                  {getVideoThumbnail(asset.external_url) ? (
                    <Image
                      src={getVideoThumbnail(asset.external_url)!}
                      alt={asset.caption || 'Video'}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'rgba(167,139,250,0.05)' }}>
                      <Video style={{ width: 40, height: 40, color: 'rgba(167,139,250,0.3)' }} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', background: 'rgba(167,139,250,0.8)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#fff' }}>
                    Video
                  </div>
                </>
              ) : asset.type === 'podcast' ? (
                <>
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'rgba(251,146,60,0.05)' }}>
                    <Podcast style={{ width: 40, height: 40, color: 'rgba(251,146,60,0.3)' }} />
                  </div>
                  <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', background: 'rgba(251,146,60,0.8)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', color: '#fff' }}>
                    Podcast
                  </div>
                </>
              ) : null}

              {/* Hover overlay */}
              <div
                className="opacity-0 group-hover:opacity-100"
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0.75rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', transition: 'opacity 0.15s' }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  {asset.caption && (
                    <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.caption}</p>
                  )}
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                    {asset.type === 'image' && asset.width
                      ? `${asset.width}\u00d7${asset.height}`
                      : asset.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(asset.id, asset.storage_path, asset.type)}
                  style={{ marginLeft: '0.5rem', flexShrink: 0, padding: '0.375rem', borderRadius: '0.375rem', background: 'rgba(239,68,68,0.8)', border: 'none', color: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}
                >
                  <Trash2 style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video/Podcast modal */}
      {showAddModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', padding: '1rem', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAddModal(null)}
        >
          <div
            className="admin-card"
            style={{ width: '100%', maxWidth: '28rem', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                Add {showAddModal === 'video' ? 'Video' : 'Podcast'}
              </h2>
              <button onClick={() => setShowAddModal(null)} style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">
                  {showAddModal === 'video' ? 'Video URL' : 'Podcast URL'}{' '}
                  <span style={{ color: '#C07B2A' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a1a', padding: '0.75rem 1rem' }}>
                  <Link2 style={{ width: 16, height: 16, flexShrink: 0, color: 'rgba(255,255,255,0.2)' }} />
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '14px', color: '#fff', outline: 'none' }}
                    placeholder={
                      showAddModal === 'video'
                        ? 'https://youtube.com/watch?v=...'
                        : 'https://open.spotify.com/episode/...'
                    }
                    autoFocus
                  />
                </div>
                <p className="admin-hint">
                  {showAddModal === 'video'
                    ? 'Paste a YouTube, Vimeo, or any video URL'
                    : 'Paste a Spotify, Apple Podcasts, SoundCloud, or any podcast URL'}
                </p>
              </div>

              <div>
                <label className="admin-label">Caption / Title</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="admin-input"
                  placeholder="Give it a name..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={handleAddExternal}
                  disabled={!externalUrl.trim() || saving}
                  className="admin-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {saving ? 'Adding...' : `Add ${showAddModal === 'video' ? 'Video' : 'Podcast'}`}
                </button>
                <button
                  onClick={() => setShowAddModal(null)}
                  className="admin-btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
