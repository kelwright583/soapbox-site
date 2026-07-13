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
      className="scroll-reveal group block overflow-hidden bg-white transition-all duration-300 hover:shadow-xl"
      style={{
        '--reveal-delay': `${index * 100}ms`,
        borderRadius: 2,
        border: '1px solid rgba(26,26,26,0.06)',
      } as React.CSSProperties}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-grey">
        {coverImage ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${coverImage}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 900px) 100vw, 420px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber/10 via-grey to-ink/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          {formatDate(publishedAt)}
        </p>
        <h2 className="font-display mb-3 text-lg font-bold leading-tight text-ink transition-colors duration-200 group-hover:text-amber">
          {title}
        </h2>
        {excerpt && (
          <p className="line-clamp-3 text-sm leading-[1.8] text-muted">{excerpt}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-ink/6 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted"
                style={{ borderRadius: 2 }}
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
