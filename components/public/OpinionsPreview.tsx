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
  if (posts.length === 0) return null

  return (
    <section className="bg-grey py-20">
      <div className="mx-auto max-w-[1140px] px-6">
        <div className="mb-10">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            Unsolicited Opinions
          </span>
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
            I&apos;m still talking.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
            The book ended. The opinions didn&apos;t. What happened after, what changed, what
            I&apos;d undo — and what I absolutely would not.
          </p>
        </div>

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

        <div className="mt-10 text-center">
          <Link
            href="/opinions"
            className="inline-block text-sm font-semibold text-amber hover:text-amber-light"
          >
            All Unsolicited Opinions &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
