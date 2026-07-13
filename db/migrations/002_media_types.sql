-- Add media type support (image, video, podcast)
ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video', 'podcast')),
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS caption text DEFAULT '',
  ADD COLUMN IF NOT EXISTS duration integer;
