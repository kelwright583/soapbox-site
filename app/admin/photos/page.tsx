'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Dropzone } from '@/components/admin/Dropzone'

interface MediaAsset {
  id: string
  storage_path: string
  width: number | null
  height: number | null
  alt_text: string
  created_at: string
}

export default function PhotosPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

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

  async function handleUpload(path: string, width: number, height: number) {
    const supabase = createClient()
    await supabase.from('media_assets').insert({
      storage_path: path,
      width,
      height,
    })
    loadAssets()
  }

  async function handleDelete(id: string, storagePath: string) {
    if (!confirm('Delete this image?')) return
    const supabase = createClient()
    await supabase.storage.from('media').remove([storagePath])
    await supabase.from('media_assets').delete().eq('id', id)
    loadAssets()
  }

  return (
    <div>
      <div className="mb-8">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
          The Desk
        </span>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
          Photos
        </h1>
      </div>

      <Dropzone onUpload={handleUpload} />

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-white/40">Loading...</p>
        ) : assets.length === 0 ? (
          <p className="text-sm text-white/40">No images yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-white/10"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`}
                  alt={asset.alt_text || ''}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-[10px] text-white/60">
                    {asset.width}&times;{asset.height}
                  </span>
                  <button
                    onClick={() => handleDelete(asset.id, asset.storage_path)}
                    className="rounded bg-red-500/80 p-1 text-white hover:bg-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
