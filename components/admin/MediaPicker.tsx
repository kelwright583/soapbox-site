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
  width: number | null
  height: number | null
  alt_text: string
  created_at: string
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const loadAssets = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('media_assets').select('*').eq('type', 'image').order('created_at', { ascending: false })
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
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', fontFamily: 'var(--font-display)' }}>Choose an Image</h2>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset.storage_path)}
                  onMouseEnter={() => setHoveredId(asset.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: hoveredId === asset.id ? '2px solid #C07B2A' : '2px solid transparent',
                    boxShadow: hoveredId === asset.id ? '0 0 0 2px rgba(192,123,42,0.2)' : 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                >
                  <Image src={`${SUPABASE_URL}/storage/v1/object/public/media/${asset.storage_path}`} alt={asset.alt_text || ''} fill style={{ objectFit: 'cover' }} sizes="120px" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
