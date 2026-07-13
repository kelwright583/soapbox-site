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
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-[800px] px-6 text-center">
          <blockquote className="scroll-reveal font-display text-xl font-bold italic leading-relaxed text-white md:text-2xl">
            &ldquo;I wasn&apos;t a failure. I was fabulous. Or I was failing fabulously.
            <br />
            <span className="text-amber">
              Turns out those two things are not mutually exclusive.
            </span>
            &rdquo;
          </blockquote>
          <Link
            href="/about"
            className="scroll-reveal mt-6 inline-block text-sm font-semibold text-amber hover:text-amber-light"
          >
            Meet Kel &rarr;
          </Link>
        </div>
      </section>

      {/* Book journey */}
      <section className="py-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
                The Book
              </span>
              <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
                It starts at sixteen. It takes a while from there.
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
                <p>
                  I was pregnant before I was old enough to drive myself to the appointment. A
                  mother before I knew how to change a nappy. Single before I&apos;d figured out how
                  to be a couple.
                </p>
                <p>This is the book that came out of all of that.</p>
                <p>
                  Just an honest account of what it looks like when life doesn&apos;t follow the
                  order it was supposed to — and you have to grow up in public, out of sequence,
                  with everyone watching, and no real idea what you&apos;re doing.
                </p>
                <p>Told with enough distance to be funny about it.</p>
                <p>And enough honesty to know it wasn&apos;t, at the time.</p>
              </div>
              <Link
                href="/book"
                className="mt-6 inline-block text-sm font-semibold text-amber hover:text-amber-light"
              >
                About the book &rarr;
              </Link>
            </div>
            <div className="flex flex-col items-center gap-6">
              <Image
                src="/images/BookMockup.png"
                alt="In the Absence of a Soapbox - book mockup"
                width={400}
                height={500}
                className="rounded-lg"
              />
              <div className="flex gap-3">
                <Link
                  href="/book"
                  className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white hover:bg-amber-light"
                >
                  About the book
                </Link>
                <Link
                  href="/correspondence"
                  className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink hover:bg-ink hover:text-white"
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
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h2 className="scroll-reveal font-display text-3xl font-bold text-white">
            The book is coming.
          </h2>
          <p className="scroll-reveal mt-3 text-sm text-white/60">
            Be the first to know when it&apos;s available.
          </p>
          <div className="scroll-reveal mt-8">
            <NewsletterForm />
          </div>
          <p className="scroll-reveal mt-4 text-[11px] text-white/40">
            No newsletters. No nonsense. One email when it&apos;s available. Promise.
          </p>
        </div>
      </section>
    </>
  )
}
