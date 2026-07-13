'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { X, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Dropzone } from './Dropzone'

interface MediaPickerProps {
  onSelect: (storagePath: string) => void
  onClose: () => void
}

interface MediaAsset {
  id: string
  storage_path: string
  type: string
  width: number | null
  height: number | null
  alt_text: string
  created_at: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

  const loadAssets = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('media_assets')
      .select('*')
      .eq('type', 'image')
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
      type: 'image',
      width,
      height,
    })
    loadAssets()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-white/[0.08] bg-ink-soft p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Select Image</h2>
          <button onClick={onClose} className="text-white/30 transition-colors hover:text-white/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload */}
        <Dropzone onUpload={handleUpload} />

        {/* Gallery */}
        <div className="mt-6">
          {loading ? (
            <p className="py-8 text-center text-sm text-white/30">Loading...</p>
          ) : assets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.08] px-8 py-12 text-center">
              <ImageIcon className="mx-auto mb-2 h-8 w-8 text-white/10" />
              <p className="text-sm text-white/30">No images yet. Upload your first one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset.storage_path)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.06] transition-all hover:border-amber hover:ring-2 hover:ring-amber/20"
                >
                  <Image
                    src={`${SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`}
                    alt={asset.alt_text || ''}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="150px"
                  />
                  <div className="absolute inset-0 bg-amber/0 transition-colors group-hover:bg-amber/10" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
