import type { Metadata } from 'next'
import { NewsletterForm } from '@/components/public/NewsletterForm'

export const metadata: Metadata = {
  title: 'Correspondence',
  description: 'Say hello. I read everything.',
}

const groundRules = [
  {
    num: '01',
    text: 'No unsolicited anatomy. (Unsolicited opinions are my entire brand, so I appreciate the irony of that rule \u2014 but what you\u2019re packing is your business, not mine.)',
  },
  {
    num: '02',
    text: 'Be kind, or be quiet. Cruelty is boring and I have a delete key.',
  },
  {
    num: '03',
    text: 'Profanity is allowed. So are strong opinions. Both are taken seriously here.',
  },
  {
    num: '04',
    text: 'If you\u2019ve got something to say, say it directly. I\u2019m not easily offended \u2014 I\u2019ve written about things considerably more embarrassing than whatever you\u2019re holding back.',
  },
  {
    num: '05',
    text: 'Take what resonates. Leave what doesn\u2019t exactly where you found it.',
  },
]

export default function CorrespondencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink" style={{ paddingTop: 64 }}>
        <div className="mx-auto max-w-[1140px] px-6 py-24">
          <span className="hero-animate-kicker mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Correspondence
          </span>
          <h1 className="hero-animate-headline font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-white">
            Say hello.
            <br />
            <span className="text-amber italic">I read everything.</span>
          </h1>
          <p className="hero-animate-body mt-5 max-w-lg text-[15px] leading-[1.8] text-white/60">
            I don&apos;t always reply immediately. I have a life, a child, and strong opinions about
            avocado pricing. But I read everything. Eventually.
          </p>
        </div>
      </section>

      {/* Contact body */}
      <section className="py-28">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="grid gap-20 md:grid-cols-2">
            {/* Contact form */}
            <div>
              <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
                Send a letter
              </span>
              <p
                className="scroll-reveal mb-8 text-[15px] leading-[1.8] text-muted"
                style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
              >
                Say what you came to say. There&apos;s no wrong answer, unless
                the answer is unsolicited anatomy.
              </p>
              <form
                className="scroll-reveal space-y-5"
                style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
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

              {/* Direct contact */}
              <div className="mt-14">
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
              </div>
            </div>

            {/* Ground rules */}
            <div>
              <span
                className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber"
              >
                Ground rules
              </span>
              <h2
                className="scroll-reveal font-display mb-10 text-[clamp(1.4rem,2vw,1.8rem)] font-extrabold text-ink"
                style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
              >
                Before you say hello.
              </h2>
              <div className="space-y-8">
                {groundRules.map((rule, i) => (
                  <div
                    key={rule.num}
                    className="scroll-reveal ground-rule"
                    style={{ '--reveal-delay': `${(i + 2) * 80}ms` } as React.CSSProperties}
                  >
                    <span className="ground-rule-num">{rule.num}</span>
                    <p className="text-[15px] leading-[1.8] text-muted">{rule.text}</p>
                  </div>
                ))}
              </div>

              {/* Quote accent */}
              <div
                className="scroll-reveal mt-14 border-t border-border pt-10"
                style={{ '--reveal-delay': '600ms' } as React.CSSProperties}
              >
                <blockquote className="font-display amber-left-accent text-base font-bold italic text-ink/60">
                  &ldquo;I write because someone needs to say the thing out loud. The uncomfortable
                  thing. The embarrassing thing.&rdquo;
                </blockquote>
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
