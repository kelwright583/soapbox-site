import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/public/Hero'
import { OpinionsPreview } from '@/components/public/OpinionsPreview'
import { NewsletterForm } from '@/components/public/NewsletterForm'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Home | In the Absence of a Soapbox',
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Brownie strip quote */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <blockquote className="scroll-reveal font-display text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold italic leading-[1.5] text-white">
            &ldquo;I wasn&apos;t a failure. I was fabulous. Or I was failing fabulously.
            <br />
            <span className="text-amber">
              Turns out those two things are not mutually exclusive.
            </span>
            &rdquo;
          </blockquote>
          <div className="scroll-reveal mt-8" style={{ '--reveal-delay': '150ms' } as React.CSSProperties}>
            <Link
              href="/about"
              className="link-hover inline-block text-sm font-semibold text-amber"
            >
              Meet Kel &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Book journey */}
      <section className="py-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span
                className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber"
              >
                The Book
              </span>
              <h2
                className="scroll-reveal font-display text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold leading-[1.12] text-ink"
                style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
              >
                It starts at sixteen. It takes a while from there.
              </h2>
              <div
                className="scroll-reveal mt-8 space-y-5 text-[15px] leading-[1.85] text-muted"
                style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
              >
                <p>
                  I was pregnant before I was old enough to drive myself to the appointment. A
                  mother before I knew how to change a nappy. Single before I&apos;d figured out how
                  to be a couple.
                </p>
                <p>This is the book that came out of all of that.</p>
                <p>
                  Just an honest account of what it looks like when life doesn&apos;t follow the
                  order it was supposed to &mdash; and you have to grow up in public, out of sequence,
                  with everyone watching, and no real idea what you&apos;re doing.
                </p>
                <p>Told with enough distance to be funny about it.</p>
                <p>And enough honesty to know it wasn&apos;t, at the time.</p>
              </div>
              <div className="scroll-reveal mt-8" style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
                <Link
                  href="/book"
                  className="link-hover inline-block text-sm font-semibold text-amber"
                >
                  About the book &rarr;
                </Link>
              </div>
            </div>
            <div className="scroll-reveal-scale flex flex-col items-center gap-8">
              <Image
                src="/images/BookMockup.png"
                alt="In the Absence of a Soapbox - book mockup"
                width={420}
                height={520}
                className="transition-transform duration-500 hover:scale-[1.02]"
              />
              <div className="flex gap-4">
                <Link
                  href="/book"
                  className="btn-lift inline-block bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber"
                  style={{ borderRadius: 2 }}
                >
                  About the book
                </Link>
                <Link
                  href="/correspondence"
                  className="btn-lift inline-block border-2 border-ink px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-ink hover:text-white"
                  style={{ borderRadius: 2 }}
                >
                  Put me on the list
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opinions preview */}
      <OpinionsPreview posts={posts ?? []} />

      {/* Notify strip */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h2 className="scroll-reveal font-display text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-white">
            The book is coming.
          </h2>
          <p className="scroll-reveal mt-4 text-sm leading-relaxed text-white/50" style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
            Be the first to know when it&apos;s available.
          </p>
          <div className="scroll-reveal mt-10" style={{ '--reveal-delay': '200ms' } as React.CSSProperties}>
            <NewsletterForm />
          </div>
          <p className="scroll-reveal mt-5 text-[11px] text-white/30" style={{ '--reveal-delay': '300ms' } as React.CSSProperties}>
            No newsletters. No nonsense. One email when it&apos;s available. Promise.
          </p>
        </div>
      </section>
    </>
  )
}
