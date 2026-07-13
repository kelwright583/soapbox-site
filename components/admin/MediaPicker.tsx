'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Dropzone } from './Dropzone'

interface MediaPickerProps {
  onSelect: (storagePath: string) => void
  onClose: () => void
}

interface MediaAsset {
  id: string
  storage_path: string
  width: number | null
  height: number | null
  alt_text: string
  created_at: string
}

export function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-ink p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Select Image</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Dropzone onUpload={handleUpload} />

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-white/40">Loading...</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-white/40">No images yet. Upload your first one above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset.storage_path)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 transition-colors hover:border-amber"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`}
                    alt={asset.alt_text || ''}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                  <div className="absolute inset-0 bg-amber/0 transition-colors group-hover:bg-amber/20" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
