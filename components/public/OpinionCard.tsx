import Link from 'next/link'
import Image from 'next/image'

interface OpinionCardProps {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  publishedAt: string | null
  tags: string[]
  index?: number
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function OpinionCard({
  slug,
  title,
  excerpt,
  coverImage,
  publishedAt,
  tags,
  index = 0,
}: OpinionCardProps) {
  return (
    <Link
      href={`/opinions/${slug}`}
      className="scroll-reveal group block overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-amber/40 hover:shadow-md"
      style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-[16/9] bg-grey">
        {coverImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${coverImage}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 900px) 100vw, 420px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber/10 to-grey" />
        )}
      </div>
      <div className="p-5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
          {formatDate(publishedAt)}
        </p>
        <h2 className="font-display mb-2 text-lg font-bold leading-tight text-ink group-hover:text-amber">
          {title}
        </h2>
        {excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{excerpt}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-grey px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
