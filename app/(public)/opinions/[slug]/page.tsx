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
    <article style={{ paddingTop: 64 }}>
      <div className="mx-auto max-w-[780px] px-6 pb-24 pt-12">
        <Link
          href="/opinions"
          className="link-hover mb-10 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
        >
          &larr; Unsolicited Opinions
        </Link>

        {post.cover_image && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden" style={{ borderRadius: 2 }}>
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

        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
          Unsolicited Opinion
        </span>
        <h1 className="font-display mb-5 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.12] text-ink">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mb-6 max-w-xl text-[15px] leading-[1.8] text-muted">{post.excerpt}</p>
        )}
        <p className="mb-12 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          {formatDate(post.published_at)}
        </p>

        {post.tags.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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

        {post.body && (
          <div className="prose-soapbox text-[15px] leading-[1.85] text-muted">
            {renderBody(post.body)}
          </div>
        )}

        <div className="mt-20 border-t border-border pt-10 text-center">
          <Link
            href="/opinions"
            className="link-hover text-sm font-semibold text-amber"
          >
            &larr; Back to all opinions
          </Link>
        </div>
      </div>
    </article>
  )
}
