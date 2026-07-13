'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Trash2, Video, Podcast, ImageIcon, Link2, X, Plus } from 'lucide-react'
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
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
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

  useEffect(() => { loadAssets() }, [loadAssets])

  async function handleImageUpload(path: string, width: number, height: number) {
    const supabase = createClient()
    await supabase.from('media_assets').insert({ storage_path: path, type: 'image', width, height })
    loadAssets()
  }

  async function handleAddExternal() {
    if (!showAddModal || !externalUrl.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('media_assets').insert({ storage_path: '', type: showAddModal, external_url: externalUrl.trim(), caption: caption.trim() })
    setExternalUrl(''); setCaption(''); setShowAddModal(null); setSaving(false)
    loadAssets()
  }

  async function handleDelete(id: string, storagePath: string, type: string) {
    if (!confirm('Delete this media?')) return
    const supabase = createClient()
    if (type === 'image' && storagePath) await supabase.storage.from('media').remove([storagePath])
    await supabase.from('media_assets').delete().eq('id', id)
    loadAssets()
  }

  const filtered = assets.filter((a) =>
    activeTab === 'all' ? true :
    activeTab === 'images' ? a.type === 'image' :
    activeTab === 'videos' ? a.type === 'video' :
    a.type === 'podcast'
  )

  const count = (type: string) => assets.filter((a) => a.type === type).length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', marginBottom: 6 }}>
            Media Library
          </h1>
          <p style={{ fontSize: 14, color: '#999' }}>
            Upload images, add video and podcast links. Use them in your posts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowAddModal('video')} className="admin-btn-secondary">
            <Video style={{ width: 15, height: 15 }} /> Add Video
          </button>
          <button onClick={() => setShowAddModal('podcast')} className="admin-btn-secondary">
            <Podcast style={{ width: 15, height: 15 }} /> Add Podcast
          </button>
        </div>
      </div>

      {/* Upload zone */}
      <Dropzone onUpload={handleImageUpload} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e8e8e6', marginTop: 32, marginBottom: 24 }}>
        {tabs.map(({ key, label }) => {
          const active = activeTab === key
          const c = key === 'all' ? assets.length : count(key === 'images' ? 'image' : key === 'videos' ? 'video' : 'podcast')
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${active ? '#C07B2A' : 'transparent'}`,
                marginBottom: -1,
                color: active ? '#C07B2A' : '#aaa',
                cursor: 'pointer',
              }}
            >
              {label} <span style={{ color: '#ccc', fontWeight: 400 }}>({c})</span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ padding: '48px 0', textAlign: 'center', fontSize: 14, color: '#aaa' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '56px 24px' }}>
          <p style={{ fontSize: 14, color: '#aaa' }}>
            {activeTab === 'all' ? 'Your media library is empty. Upload images or add video and podcast links above.' :
             activeTab === 'images' ? 'No images yet. Drag and drop files above to upload.' :
             activeTab === 'videos' ? 'No videos yet. Click "Add Video" to paste a YouTube or Vimeo link.' :
             'No podcasts yet. Click "Add Podcast" to paste a Spotify or Apple Podcasts link.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group"
              style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e8e6', background: '#fff', transition: 'box-shadow 0.15s' }}
            >
              {asset.type === 'image' && asset.storage_path ? (
                <Image src={`${SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`} alt={asset.alt_text || ''} fill className="object-cover" sizes="200px" />
              ) : asset.type === 'video' && asset.external_url ? (
                <>
                  {getVideoThumbnail(asset.external_url) ? (
                    <Image src={getVideoThumbnail(asset.external_url)!} alt={asset.caption || 'Video'} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff' }}>
                      <Video style={{ width: 40, height: 40, color: '#c4b5fd' }} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 4, background: '#8b5cf6', fontSize: 10, fontWeight: 700, color: '#fff' }}>VIDEO</div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#fff7ed' }}>
                    <Podcast style={{ width: 40, height: 40, color: '#fdba74' }} />
                  </div>
                  <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', borderRadius: 4, background: '#f97316', fontSize: 10, fontWeight: 700, color: '#fff' }}>PODCAST</div>
                </>
              )}

              {/* Hover overlay */}
              <div className="opacity-0 group-hover:opacity-100" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)', transition: 'opacity 0.15s' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
                  {asset.caption || (asset.type === 'image' && asset.width ? `${asset.width}\u00d7${asset.height}` : asset.type)}
                </span>
                <button
                  onClick={() => handleDelete(asset.id, asset.storage_path, asset.type)}
                  style={{ padding: 6, borderRadius: 6, background: 'rgba(220,38,38,0.8)', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <Trash2 style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', padding: 16 }}
          onClick={() => setShowAddModal(null)}
        >
          <div className="admin-card" style={{ width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
                Add {showAddModal === 'video' ? 'Video' : 'Podcast'}
              </h2>
              <button onClick={() => setShowAddModal(null)} style={{ color: '#bbb', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="admin-label">{showAddModal === 'video' ? 'Video URL' : 'Podcast URL'}</label>
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="admin-input"
                  placeholder={showAddModal === 'video' ? 'https://youtube.com/watch?v=...' : 'https://open.spotify.com/episode/...'}
                  autoFocus
                />
                <p className="admin-hint">
                  {showAddModal === 'video' ? 'Paste a YouTube, Vimeo, or any video URL.' : 'Paste a Spotify, Apple Podcasts, or SoundCloud URL.'}
                </p>
              </div>
              <div>
                <label className="admin-label">Caption / Title</label>
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="admin-input" placeholder="Give it a name..." />
              </div>
              <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
                <button onClick={handleAddExternal} disabled={!externalUrl.trim() || saving} className="admin-btn-primary" style={{ flex: 1 }}>
                  {saving ? 'Adding...' : `Add ${showAddModal === 'video' ? 'Video' : 'Podcast'}`}
                </button>
                <button onClick={() => setShowAddModal(null)} className="admin-btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
