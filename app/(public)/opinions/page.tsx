import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { OpinionCard } from '@/components/public/OpinionCard'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Unsolicited Opinions',
  description: 'The book ended. The opinions didn\u2019t.',
}

export default async function OpinionsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="mx-auto max-w-[1140px] px-6 pb-20 pt-32">
      <div className="mb-12">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
          Unsolicited Opinions
        </span>
        <h1 className="font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
          I&apos;m still talking.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          The book ended. The opinions didn&apos;t. What happened after, what changed, what I&apos;d
          undo — and what I absolutely would not.
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <OpinionCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.cover_image}
              publishedAt={post.published_at}
              tags={post.tags}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="font-display text-xl font-bold text-ink">Nothing here yet.</p>
          <p className="mt-2 text-sm text-muted">
            The opinions are coming. They always do.
          </p>
        </div>
      )}
    </div>
  )
}
