'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Trash2, Video, Podcast, ImageIcon, Plus, Link2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Dropzone } from '@/components/admin/Dropzone'
import { cn } from '@/lib/utils'

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

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All', icon: ImageIcon },
  { key: 'images', label: 'Images', icon: ImageIcon },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'podcasts', label: 'Podcasts', icon: Podcast },
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber">
            The Desk
          </p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-white">
            Media Library
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal('video')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/50 transition-all hover:border-purple-400/30 hover:text-purple-400"
          >
            <Video className="h-3.5 w-3.5" /> Add Video
          </button>
          <button
            onClick={() => setShowAddModal('podcast')}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white/50 transition-all hover:border-orange-400/30 hover:text-orange-400"
          >
            <Podcast className="h-3.5 w-3.5" /> Add Podcast
          </button>
        </div>
      </div>

      {/* Upload zone */}
      <Dropzone onUpload={handleImageUpload} />

      {/* Tabs */}
      <div className="mt-8 mb-6 flex gap-1 border-b border-white/[0.06]">
        {tabs.map(({ key, label, icon: Icon }) => {
          const count = key === 'all'
            ? assets.length
            : assets.filter((a) =>
                key === 'images' ? a.type === 'image' :
                key === 'videos' ? a.type === 'video' :
                a.type === 'podcast'
              ).length
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors -mb-px',
                activeTab === key
                  ? 'border-amber text-amber'
                  : 'border-transparent text-white/30 hover:text-white/50',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span className="text-[10px] opacity-50">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="py-12 text-center text-sm text-white/30">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.08] px-8 py-16 text-center">
          <p className="text-sm text-white/30">
            {activeTab === 'all' ? 'No media yet. Upload images or add videos and podcasts.' :
             activeTab === 'images' ? 'No images yet. Drag and drop to upload.' :
             activeTab === 'videos' ? 'No videos yet. Click "Add Video" to get started.' :
             'No podcasts yet. Click "Add Podcast" to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-ink-soft transition-all hover:border-white/10"
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
                    <div className="flex h-full items-center justify-center bg-purple-500/5">
                      <Video className="h-10 w-10 text-purple-400/40" />
                    </div>
                  )}
                  <div className="absolute left-2 top-2 rounded-md bg-purple-500/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    Video
                  </div>
                </>
              ) : asset.type === 'podcast' ? (
                <>
                  <div className="flex h-full items-center justify-center bg-orange-500/5">
                    <Podcast className="h-10 w-10 text-orange-400/40" />
                  </div>
                  <div className="absolute left-2 top-2 rounded-md bg-orange-500/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    Podcast
                  </div>
                </>
              ) : null}

              {/* Hover overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="min-w-0 flex-1">
                  {asset.caption && (
                    <p className="truncate text-[11px] font-medium text-white/80">{asset.caption}</p>
                  )}
                  <span className="text-[10px] text-white/40">
                    {asset.type === 'image' && asset.width
                      ? `${asset.width}\u00d7${asset.height}`
                      : asset.type}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(asset.id, asset.storage_path, asset.type)}
                  className="ml-2 shrink-0 rounded-lg bg-red-500/80 p-1.5 text-white transition-colors hover:bg-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video/Podcast modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowAddModal(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-white/[0.08] bg-ink-soft p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">
                Add {showAddModal === 'video' ? 'Video' : 'Podcast'}
              </h2>
              <button
                onClick={() => setShowAddModal(null)}
                className="text-white/30 hover:text-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  {showAddModal === 'video' ? 'Video URL' : 'Podcast URL'}{' '}
                  <span className="text-amber">*</span>
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-ink px-4 py-3">
                  <Link2 className="h-4 w-4 shrink-0 text-white/20" />
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
                    placeholder={
                      showAddModal === 'video'
                        ? 'https://youtube.com/watch?v=...'
                        : 'https://open.spotify.com/episode/...'
                    }
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-white/20">
                  {showAddModal === 'video'
                    ? 'YouTube, Vimeo, or any video URL'
                    : 'Spotify, Apple Podcasts, SoundCloud, or any podcast URL'}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Caption / Title
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-ink px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber/60 focus:outline-none"
                  placeholder="Give it a name..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddExternal}
                  disabled={!externalUrl.trim() || saving}
                  className="flex-1 rounded-lg bg-amber px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-light disabled:opacity-40"
                >
                  {saving ? 'Adding...' : `Add ${showAddModal === 'video' ? 'Video' : 'Podcast'}`}
                </button>
                <button
                  onClick={() => setShowAddModal(null)}
                  className="rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm text-white/40 transition-all hover:text-white/60"
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
