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

  useEffect(() => { loadAssets() }, [loadAssets])

  async function handleUpload(path: string, width: number, height: number) {
    const supabase = createClient()
    await supabase.from('media_assets').insert({ storage_path: path, type: 'image', width, height })
    loadAssets()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 720, maxHeight: '80vh', overflowY: 'auto', borderRadius: 14, background: '#fff', border: '1px solid #e8e8e6', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', padding: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Choose an Image</h2>
            <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>Select from your library or upload a new one.</p>
          </div>
          <button onClick={onClose} style={{ color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <Dropzone onUpload={handleUpload} />

        <div style={{ marginTop: 24 }}>
          {loading ? (
            <p style={{ padding: '32px 0', textAlign: 'center', fontSize: 14, color: '#aaa' }}>Loading...</p>
          ) : assets.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <ImageIcon style={{ width: 36, height: 36, color: '#ddd', margin: '0 auto 8px' }} strokeWidth={1.3} />
              <p style={{ fontSize: 14, color: '#bbb' }}>No images yet. Upload your first one above.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset.storage_path)}
                  style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '2px solid transparent', background: 'none', padding: 0, cursor: 'pointer', transition: 'border-color 0.12s, box-shadow 0.12s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C07B2A'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(192,123,42,0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <Image
                    src={`${SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`}
                    alt={asset.alt_text || ''}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
