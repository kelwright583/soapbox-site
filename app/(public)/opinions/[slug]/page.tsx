import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { renderBody } from '@/lib/render-body'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || undefined,
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function OpinionDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  return (
    <article className="mx-auto max-w-[780px] px-6 pb-20 pt-32">
      <Link
        href="/opinions"
        className="mb-8 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
      >
        &larr; Unsolicited Opinions
      </Link>

      {post.cover_image && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${post.cover_image}`}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 780px) 100vw, 780px"
          />
        </div>
      )}

      <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
        Unsolicited Opinion
      </span>
      <h1 className="font-display mb-4 text-3xl font-extrabold leading-tight text-ink md:text-4xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mb-6 text-base leading-relaxed text-muted">{post.excerpt}</p>
      )}
      <p className="mb-10 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
        {formatDate(post.published_at)}
      </p>

      {post.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-grey px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.body && (
        <div className="prose-soapbox text-sm leading-[1.85] text-muted">
          {renderBody(post.body)}
        </div>
      )}

      <div className="mt-16 border-t border-border pt-8 text-center">
        <Link
          href="/opinions"
          className="text-sm font-semibold text-amber hover:text-amber-light"
        >
          &larr; Back to all opinions
        </Link>
      </div>
    </article>
  )
}
