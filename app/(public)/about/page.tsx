import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Kel Wright is a writer, a mother, and the holder of a very prestigious position at an insurance company.',
}

const timeline = [
  { year: '2008', text: 'Baby arrived. Matric written, under circumstances that could generously be described as suboptimal. Passed with distinction. Got all As, since you\u2019re asking, and nobody was. We don\u2019t talk about Afrikaans.' },
  { year: '2009\u20132011', text: 'Single. Fucking it up enthusiastically. Running \u2014 figuratively, obviously, never literally \u2014 from responsibility, from reality, and anything that looked like it might require sustained effort. Somehow also studying. Got a BA in Marketing, which is the thing you study when you have absolutely no idea what to study.' },
  { year: '2012\u20132017', text: 'Still single. Landed a very prestigious, ultra-important, super-adventurous, not-boring-at-all position at an insurance firm. Got stable. Met Tinder Guy. Became considerably less stable.' },
  { year: '2018', text: 'More Tinder Guy. Lost myself entirely, which was particularly frustrating given that I\u2019d only just found myself. Navigated what I now correctly identify as a narcissist. Moved out. Got into significant debt acquiring very impressive crockery. Worth it.' },
  { year: '2019', text: 'Moved back home. Cap in hand. Started writing.' },
  { year: '2020', text: 'Met a Capetonian. Immediately decided I would marry him and have his children. Turned 30 in the shittest of shit years, completely alone, in a pandemic. Did not marry the Capetonian.' },
  { year: '2021', text: 'Did not have his children either. Or anyone else\u2019s.' },
  { year: '2022\u20132024', text: 'Wrote and finished the manuscript. Telling the stories that needed breathing room was its own kind of healing. Closed some chapters for good.' },
  { year: '2025', text: 'Met my current boyfriend. Stable, sturdy, beautifully dorky, wise, kind. Feels like home. Did not see this coming. Delighted to report it anyway.' },
  { year: '2026', text: 'The book. Finally.' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink" style={{ paddingTop: 64 }}>
        <div className="mx-auto grid max-w-[1140px] items-center gap-0 lg:grid-cols-2">
          <div className="hero-animate-image relative aspect-[3/4] overflow-hidden lg:aspect-auto lg:h-[620px]">
            <Image
              src="/images/AuthorPicture.jpeg"
              alt="Kel Wright"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent lg:bg-gradient-to-l lg:from-ink/30 lg:via-transparent lg:to-transparent" />
          </div>
          <div className="px-6 py-16 lg:py-20 lg:pl-14 lg:pr-6">
            <span className="hero-animate-kicker mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
              The author
            </span>
            <h1 className="hero-animate-headline font-display text-[clamp(2rem,3.5vw,3rem)] font-extrabold leading-[1.1] text-white">
              She&apos;s Thirty-Something.
              <br />
              She has a lot
              <br />
              <span className="text-amber italic">to say about it.</span>
            </h1>
            <p className="hero-animate-body mt-4 text-[15px] leading-[1.8] text-white/60">
              And she&apos;s been collecting material since she was 16.
            </p>
            <p className="hero-animate-body mt-5 text-[15px] leading-[1.8] text-white/80">
              Kel Wright is a writer, a mother, and the holder of a very prestigious,
              ultra-important, super-adventurous, not-boring-at-all position at an insurance
              company. She has been collecting material since she was sixteen.
            </p>
            <div className="hero-animate-ctas mt-10 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="btn-lift inline-block border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-ink"
                style={{ borderRadius: 2 }}
              >
                Read the Book
              </Link>
              <Link
                href="/opinions"
                className="btn-lift inline-block bg-amber px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
                style={{ borderRadius: 2 }}
              >
                Read the Opinions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="py-24">
        <div className="mx-auto max-w-[720px] px-6">
          <span
            className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber"
          >
            Who she actually is
          </span>
          <h2
            className="scroll-reveal font-display mb-10 text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold text-ink"
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            Not the polished version.
          </h2>
          <div
            className="scroll-reveal space-y-5 text-[15px] leading-[1.85] text-muted"
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            <p>
              I am, first and most importantly, a mother. A teenage mother, as it happens, who spent a considerable number of years wearing &ldquo;single&rdquo; alongside it like it was part of the official job title. What I have come to understand, recently, slowly, and with the particular embarrassment of someone who can write about self-awareness at considerable length and still somehow be the last to apply it, is that I was never actually alone in it. I had people in my corner the whole time. I simply hadn&apos;t yet developed the good sense to notice, let alone be grateful. The book tells the story as it felt then. This is what I know now. Both are true.
            </p>
            <p>
              I am also, apparently, an author. I have the book to prove it and the imposter syndrome to match. Every morning I wake up genuinely surprised that this is a sentence I get to say about myself, and spend a reasonable portion of the day waiting for someone official to arrive and explain that there&apos;s been an administrative error. So far, no one has. I&apos;m choosing to take that as confirmation.
            </p>
            <p>
              Beyond that: an insurance specialist, a half marathon runner, and I deploy both titles with equal amounts of pride and creative licence. The running in particular deserves full disclosure. I move at the pace of a determined shopping trolley navigating a gentle incline, the kind with one rogue wheel that pulls left no matter what you do: technically in motion, technically going somewhere, working considerably harder than it looks.
            </p>
            <p>
              I am a jack of all trades, a full-arser by nature, and a master of approximately none of them, with the exception of having a decidedly full arse. I have a lot to say about life. Opinions on topics as varied as sex, parenting, home d&eacute;cor, and the unforgivable, unconscionable, utterly indefensible presence of fruit in a savoury salad.
            </p>
            <p>
              I write because someone needs to say the thing out loud. The uncomfortable thing. The embarrassing thing. The thing everyone is privately thinking and publicly performing like they&apos;re not. I write because the story you&apos;re most ashamed to tell is usually the one someone else desperately needed to hear. And because if I don&apos;t write it down, some perfectly unsuspecting person will receive it as a WhatsApp essay at eleven on a Tuesday. Nobody wants that. Nobody asks for it. They read every word anyway.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border bg-grey py-24">
        <div className="mx-auto max-w-[720px] px-6">
          <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            The short version
          </span>
          <h2
            className="scroll-reveal font-display mb-12 text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold text-ink"
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            How we got here.
          </h2>

          <div className="space-y-8">
            {timeline.map(({ year, text }, i) => (
              <div
                key={year}
                className="scroll-reveal-left flex gap-6"
                style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
              >
                <span className="font-display w-28 shrink-0 text-right text-lg font-bold text-amber">
                  {year}
                </span>
                <p className="text-[15px] leading-[1.8] text-muted">{text}</p>
              </div>
            ))}
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
        </div>
      </section>
    </>
  )
}
