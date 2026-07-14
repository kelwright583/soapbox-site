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
    <>
      {/* Hero */}
      <section className="border-b border-border bg-grey" style={{ paddingTop: 64 }}>
        <div className="mx-auto max-w-[1140px] px-6 py-20">
          <span className="hero-animate-kicker mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Unsolicited Opinions
          </span>
          <h1 className="hero-animate-headline font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
            I&apos;m still talking.
          </h1>
          <p className="hero-animate-body mt-5 max-w-lg text-[15px] leading-[1.8] text-muted">
            The book ended. The opinions didn&apos;t. What happened after, what changed, what I&apos;d
            undo — and what I absolutely would not.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-24">
        <div className="mx-auto max-w-[1140px] px-6">
          {posts && posts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="scroll-reveal py-20 text-center">
              <p className="font-display text-xl font-bold text-ink">Nothing here yet.</p>
              <p className="mt-3 text-[15px] text-muted">
                The opinions are coming. They always do.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
