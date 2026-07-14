import Link from 'next/link'
import { OpinionCard } from './OpinionCard'

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  cover_image: string | null
  published_at: string | null
  tags: string[]
}

export function OpinionsPreview({ posts }: { posts: Post[] }) {
  return (
    <section className="border-t border-border bg-grey py-28">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mb-14">
          <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Unsolicited Opinions
          </span>
          <h2
            className="scroll-reveal font-display text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-ink"
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            I&apos;m still talking.
          </h2>
          <p
            className="scroll-reveal mt-2 font-display text-base font-bold italic text-amber"
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            The book ended. The opinions didn&apos;t.
          </p>
          <p
            className="scroll-reveal mt-4 max-w-lg text-[15px] leading-[1.8] text-muted"
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            What happened after, what changed, what
            I&apos;d undo &mdash; and what I absolutely would not.
          </p>
        </div>

        {posts.length > 0 ? (
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
          <div
            className="scroll-reveal border border-border bg-white px-8 py-14 text-center"
            style={{ borderRadius: 2, '--reveal-delay': '200ms' } as React.CSSProperties}
          >
            <p className="font-display text-lg font-bold text-ink">
              Nothing here yet.
            </p>
            <p className="mt-3 text-[15px] leading-[1.8] text-muted">
              The opinions are forming. They&apos;re circling.
              It&apos;s only a matter of time.
            </p>
          </div>
        )}

        <div className="scroll-reveal mt-12 text-center">
          <Link
            href="/opinions"
            className="link-hover inline-block text-sm font-semibold text-amber"
          >
            All Unsolicited Opinions &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
