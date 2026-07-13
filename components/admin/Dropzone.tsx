'use client'

import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface DropzoneProps {
  onUpload: (path: string, width: number, height: number) => void
}

export function Dropzone({ onUpload }: DropzoneProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      setUploading(true)
      setError('')

      for (const file of Array.from(files)) {
        try {
          // Compress if larger than 1MB
          const compressed =
            file.size > 1_000_000
              ? await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 2400,
                  useWebWorker: true,
                })
              : file

          // Get signed upload URL
          const urlRes = await fetch('/api/media/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              contentType: compressed.type,
            }),
          })
          if (!urlRes.ok) throw new Error('Failed to get upload URL')
          const { signedUrl, path } = await urlRes.json()

          // Upload to Supabase Storage
          const uploadRes = await fetch(signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': compressed.type },
            body: compressed,
          })
          if (!uploadRes.ok) throw new Error('Upload failed')

          // Get dimensions
          const img = new window.Image()
          const dims = await new Promise<{ w: number; h: number }>((resolve) => {
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
            img.src = URL.createObjectURL(compressed)
          })

          onUpload(path, dims.w, dims.h)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed')
        }
      }

      setUploading(false)
    },
    [onUpload],
  )

  return (
    <div
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 p-8 text-center transition-colors hover:border-amber/30"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.multiple = true
        input.onchange = () => handleFiles(input.files)
        input.click()
      }}
    >
      <Upload className="mb-3 h-8 w-8 text-white/20" />
      <p className="text-sm text-white/40">
        {uploading ? 'Uploading\u2026' : 'Drop images here or click to browse'}
      </p>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
