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
      <section className="border-b border-border bg-grey" style={{ paddingTop: 64 }}>
        <div className="mx-auto max-w-[1140px] px-6 py-20">
          <span className="hero-animate-kicker mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Correspondence
          </span>
          <h1 className="hero-animate-headline font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
            Say hello.
            <br />
            <span className="text-amber italic">I read everything.</span>
          </h1>
          <p className="hero-animate-body mt-5 max-w-lg text-[15px] leading-[1.8] text-muted">
            I don&apos;t always reply immediately. I have a life, a child, and strong opinions about
            avocado pricing. But I read everything. Eventually.
          </p>
        </div>
      </section>

      {/* Contact body */}
      <section className="py-24">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid gap-16 md:grid-cols-2">
            {/* Contact form */}
            <div>
              <span className="scroll-reveal mb-5 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
                Send a letter
              </span>
              <form
                className="scroll-reveal space-y-5"
                style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
                action="https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID"
                method="POST"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  className="w-full border border-border bg-grey px-5 py-3.5 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                  style={{ borderRadius: 2 }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="w-full border border-border bg-grey px-5 py-3.5 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                  style={{ borderRadius: 2 }}
                />
                <textarea
                  name="message"
                  rows={7}
                  placeholder="Say what you came to say."
                  className="w-full border border-border bg-grey px-5 py-3.5 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                  style={{ borderRadius: 2 }}
                />
                <button
                  type="submit"
                  className="btn-lift bg-amber px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
                  style={{ borderRadius: 2 }}
                >
                  Send it
                </button>
              </form>
            </div>

            {/* Direct contact + house rules */}
            <div>
              <span className="scroll-reveal mb-5 block text-[10px] font-semibold uppercase tracking-[0.26em] text-muted">
                Or, more directly
              </span>
              <div
                className="scroll-reveal space-y-4"
                style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">General</span>
                  <a href="mailto:hello@intheabsence.co.za" className="link-hover text-sm font-medium text-ink">
                    hello@intheabsence.co.za
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Book enquiries</span>
                  <a href="mailto:purchases@intheabsence.co.za" className="link-hover text-sm font-medium text-ink">
                    purchases@intheabsence.co.za
                  </a>
                </div>
              </div>

              <div className="mt-14">
                <span
                  className="scroll-reveal mb-5 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber"
                  style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
                >
                  Ground rules
                </span>
                <ol
                  className="scroll-reveal list-decimal space-y-4 pl-5 text-[15px] leading-[1.8] text-muted"
                  style={{ '--reveal-delay': '240ms' } as React.CSSProperties}
                >
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
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <h2 className="scroll-reveal font-display text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-white">
            The book is coming.
          </h2>
          <p
            className="scroll-reveal mt-4 text-sm leading-relaxed text-white/50"
            style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
          >
            Be the first to know when it&apos;s available.
          </p>
          <div className="scroll-reveal mt-10" style={{ '--reveal-delay': '200ms' } as React.CSSProperties}>
            <NewsletterForm />
          </div>
          <p
            className="scroll-reveal mt-5 text-[11px] text-white/30"
            style={{ '--reveal-delay': '300ms' } as React.CSSProperties}
          >
            No newsletters. No nonsense. One email when it&apos;s available. Promise.
          </p>
        </div>
      </section>
    </>
  )
}
