'use client'

import { useCallback, useState } from 'react'
import { Upload, Check, Loader2 } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { cn } from '@/lib/utils'

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

  const updateUpload = (name: string, update: Partial<UploadItem>) => {
    setUploads((prev) =>
      prev.map((u) => (u.name === name ? { ...u, ...update } : u)),
    )
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const newItems: UploadItem[] = Array.from(files).map((f) => ({
        name: f.name,
        status: 'compressing' as const,
      }))
      setUploads((prev) => [...newItems, ...prev])

      for (const file of Array.from(files)) {
        try {
          const compressed =
            file.size > 1_000_000
              ? await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 2400,
                  useWebWorker: true,
                })
              : file

          updateUpload(file.name, { status: 'uploading' })

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

          const uploadRes = await fetch(signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': compressed.type },
            body: compressed,
          })
          if (!uploadRes.ok) throw new Error('Upload failed')

          const img = new window.Image()
          const dims = await new Promise<{ w: number; h: number }>((resolve) => {
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight })
            img.src = URL.createObjectURL(compressed)
          })

          updateUpload(file.name, { status: 'done' })
          onUpload(path, dims.w, dims.h)
        } catch (err) {
          updateUpload(file.name, {
            status: 'error',
            error: err instanceof Error ? err.message : 'Upload failed',
          })
        }
      }

      // Clear completed uploads after delay
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.status !== 'done'))
      }, 3000)
    },
    [onUpload],
  )

  return (
    <div className="space-y-3">
      <button
        type="button"
        className={cn(
          'flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 text-center transition-all',
          dragging
            ? 'border-amber/50 bg-amber/5 text-amber'
            : 'border-white/[0.08] text-white/25 hover:border-amber/30 hover:text-white/40',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
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
        <Upload className="h-8 w-8" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium">Drop images here or click to browse</p>
          <p className="mt-1 text-[11px] opacity-50">JPG, PNG, WebP - auto-compressed</p>
        </div>
      </button>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="space-y-1.5">
          {uploads.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-ink-soft px-4 py-2.5 text-sm"
            >
              {item.status === 'done' ? (
                <Check className="h-4 w-4 shrink-0 text-green-400" />
              ) : item.status === 'error' ? (
                <span className="text-xs text-red-400">!</span>
              ) : (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber" />
              )}
              <span className="min-w-0 flex-1 truncate text-white/60">{item.name}</span>
              <span
                className={cn(
                  'shrink-0 text-[10px] uppercase tracking-wider',
                  item.status === 'done'
                    ? 'text-green-400'
                    : item.status === 'error'
                      ? 'text-red-400'
                      : 'text-white/30',
                )}
              >
                {item.status === 'error' ? item.error : item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
