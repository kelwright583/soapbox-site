import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/public/NewsletterForm'

export const metadata: Metadata = {
  title: 'Correspondence',
  description: 'Say hello. I read everything.',
}

export default function CorrespondencePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-[1140px] px-6">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            Correspondence
          </span>
          <h1 className="font-display text-4xl font-extrabold text-ink md:text-5xl">
            Say hello.
            <br />
            <span className="text-amber italic">I read everything.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
            I don&apos;t always reply immediately. I have a life, a child, and strong opinions about
            avocado pricing. But I read everything. Eventually.
          </p>
        </div>
      </section>

      {/* Contact body */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact form */}
            <div>
              <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
                Send a letter
              </span>
              <form className="space-y-4" action="https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID" method="POST">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-border bg-grey px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg border border-border bg-grey px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                />
                <textarea
                  name="message"
                  rows={7}
                  placeholder="Say what you came to say."
                  className="w-full rounded-lg border border-border bg-grey px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white hover:bg-amber-light"
                >
                  Send it
                </button>
              </form>
            </div>

            {/* Direct contact + house rules */}
            <div>
              <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                Or, more directly
              </span>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">General</span>
                  <a href="mailto:hello@intheabsence.co.za" className="text-sm text-ink hover:text-amber">
                    hello@intheabsence.co.za
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Book enquiries</span>
                  <a href="mailto:purchases@intheabsence.co.za" className="text-sm text-ink hover:text-amber">
                    purchases@intheabsence.co.za
                  </a>
                </div>
              </div>

              <div className="mt-10">
                <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
                  Ground rules
                </span>
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted">
                  <li>
                    No unsolicited anatomy. (Unsolicited opinions are my entire brand, so I appreciate
                    the irony of that rule — but what you&apos;re packing is your business, not mine.)
                  </li>
                  <li>Be kind, or be quiet. Cruelty is boring and I have a delete key.</li>
                  <li>Profanity is allowed. So are strong opinions. Both are taken seriously here.</li>
                  <li>
                    If you&apos;ve got something to say, say it directly. I&apos;m not easily offended — I&apos;ve
                    written about things considerably more embarrassing than whatever you&apos;re holding back.
                  </li>
                  <li>Take what resonates. Leave what doesn&apos;t exactly where you found it.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notify */}
      <section className="bg-ink py-16">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white">The book is coming.</h2>
          <p className="mt-3 text-sm text-white/60">Be the first to know when it&apos;s available.</p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-[11px] text-white/40">
            No newsletters. No nonsense. One email when it&apos;s available. Promise.
          </p>
        </div>
      </section>
    </>
  )
}
