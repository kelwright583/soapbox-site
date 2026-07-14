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
      <section className="relative bg-ink" style={{ paddingTop: 64 }}>
        <div className="mx-auto max-w-[1140px] px-6 py-24">
          <span className="hero-animate-kicker mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Unsolicited Opinions
          </span>
          <h1 className="hero-animate-headline font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            I&apos;m still talking.
          </h1>
          <p className="hero-animate-body mt-2 font-display text-lg font-bold italic text-amber">
            The book ended. The opinions didn&apos;t.
          </p>
          <p className="hero-animate-body mt-5 max-w-lg text-[15px] leading-[1.8] text-white/60">
            What happened after, what changed, what I&apos;d undo &mdash; and what I absolutely would not.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-28">
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
            <div className="scroll-reveal mx-auto max-w-[600px] py-20 text-center">
              <div className="pullquote-mark pt-6">
                <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold text-ink">
                  Nothing here yet.
                </p>
                <p className="mt-4 text-[15px] leading-[1.8] text-muted">
                  The opinions are forming. They&apos;re circling. They have strong feelings and
                  very little patience. It&apos;s only a matter of time before they make themselves
                  heard.
                </p>
                <div className="mx-auto mt-8 h-[3px] w-16 bg-amber" />
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {['Bodies', 'Dating', 'Motherhood', 'Relationships', 'Growing Up', 'Uncomfortable Thoughts'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink/10 px-3.5 py-1.5 text-[11px] font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
