'use client'

import { useCallback, useState } from 'react'
import { Upload, Check, Loader2, AlertCircle } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface DropzoneProps {
  onUpload: (path: string, width: number, height: number) => void
}

interface UploadItem {
  name: string
  status: 'compressing' | 'uploading' | 'done' | 'error'
  error?: string
}

export function Dropzone({ onUpload }: DropzoneProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [dragging, setDragging] = useState(false)

  const updateUpload = (name: string, update: Partial<UploadItem>) =>
    setUploads((prev) => prev.map((u) => (u.name === name ? { ...u, ...update } : u)))

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const newItems: UploadItem[] = Array.from(files).map((f) => ({ name: f.name, status: 'compressing' as const }))
      setUploads((prev) => [...newItems, ...prev])

      for (const file of Array.from(files)) {
        try {
          const compressed = file.size > 1_000_000
            ? await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 2400, useWebWorker: true })
            : file

          updateUpload(file.name, { status: 'uploading' })

          const urlRes = await fetch('/api/media/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: compressed.type }),
          })
          if (!urlRes.ok) throw new Error('Failed to get upload URL')
          const { signedUrl, path } = await urlRes.json()

          const uploadRes = await fetch(signedUrl, { method: 'PUT', headers: { 'Content-Type': compressed.type }, body: compressed })
          if (!uploadRes.ok) throw new Error('Upload failed')

          const img = new window.Image()
          const dims = await new Promise<{ w: number; h: number }>((resolve) => {
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
            img.src = URL.createObjectURL(compressed)
          })

          updateUpload(file.name, { status: 'done' })
          onUpload(path, dims.w, dims.h)
        } catch (err) {
          updateUpload(file.name, { status: 'error', error: err instanceof Error ? err.message : 'Upload failed' })
        }
      }

      setTimeout(() => setUploads((prev) => prev.filter((u) => u.status !== 'done')), 3000)
    },
    [onUpload],
  )

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.multiple = true
          input.onchange = () => handleFiles(input.files)
          input.click()
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          width: '100%',
          padding: '36px 20px',
          borderRadius: 12,
          border: `2px dashed ${dragging ? '#C07B2A' : '#ddd'}`,
          background: dragging ? 'rgba(192,123,42,0.04)' : '#fafaf9',
          color: dragging ? '#C07B2A' : '#aaa',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'center',
        }}
      >
        <Upload style={{ width: 28, height: 28 }} strokeWidth={1.5} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>Drop images here or click to browse</p>
          <p style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>JPG, PNG, WebP - auto-compressed to 1MB</p>
        </div>
      </button>

      {uploads.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
          {uploads.map((item) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 8,
                background: '#fff',
                border: '1px solid #e8e8e6',
                fontSize: 13,
              }}
            >
              {item.status === 'done' ? (
                <Check style={{ width: 16, height: 16, color: '#16a34a', flexShrink: 0 }} />
              ) : item.status === 'error' ? (
                <AlertCircle style={{ width: 16, height: 16, color: '#dc2626', flexShrink: 0 }} />
              ) : (
                <Loader2 style={{ width: 16, height: 16, color: '#C07B2A', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              )}
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#555' }}>
                {item.name}
              </span>
              <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 500, color: item.status === 'done' ? '#16a34a' : item.status === 'error' ? '#dc2626' : '#999' }}>
                {item.status === 'error' ? item.error : item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
