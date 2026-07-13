-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

-- Helper: check admin/editor role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'editor')
  );
$$;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email), 'editor');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Site Settings
CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  hero_line1 text,
  hero_line2 text,
  hero_subtitle text,
  hero_image text,
  socials jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update settings" ON public.site_settings FOR UPDATE USING (public.is_admin());

INSERT INTO public.site_settings (id, hero_line1, hero_line2, hero_subtitle)
VALUES (true, 'I don''t have it figured out.', 'I''m not sure I ever will.', 'Turns out that might be the whole point.');

-- Media Assets
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  width integer,
  height integer,
  alt_text text DEFAULT '',
  tags text[] DEFAULT '{}'::text[],
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admin insert media" ON public.media_assets FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update media" ON public.media_assets FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete media" ON public.media_assets FOR DELETE USING (public.is_admin());

-- Posts (Unsolicited Opinions)
CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  body text DEFAULT '',
  cover_image text,
  tags text[] DEFAULT '{}'::text[],
  author_id uuid REFERENCES public.profiles(id),
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON public.posts FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admin insert posts" ON public.posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin update posts" ON public.posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete posts" ON public.posts FOR DELETE USING (public.is_admin());

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Subscribers
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  source text DEFAULT 'website',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  confirm_token uuid DEFAULT gen_random_uuid(),
  consent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role access subscribers" ON public.subscribers FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER subscribers_updated_at BEFORE UPDATE ON public.subscribers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admin update media files" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admin delete media files" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND public.is_admin());
