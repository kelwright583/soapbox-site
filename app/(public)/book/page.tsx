import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotifyModal } from '@/components/public/NotifyModal'

export const metadata: Metadata = {
  title: 'The Book',
  description: 'In the Absence of a Soapbox: Rants and Revelations of a Thirty-Something Single Mum.',
}

const chapters = [
  {
    numeral: 'I',
    name: 'The Perfect Storm That Is Teenage Pregnancy and Motherhood',
    subtitle: 'Sixteen. Pregnant. No plan. A school uniform, a blood test, and doctors who spoke about her in the third person while she sat right there.',
    quote: '\u201COne moment, I was doing adult things in bed. The next moment, I was having to lie in it.\u201D',
    image: 'The perfect storm that is Teenage Pregnancy and Motherhood-01.png',
  },
  {
    numeral: 'II',
    name: 'The Shit Show That Is Single Parenting',
    subtitle: 'Running out of patience, money, and direction. A red Noddy car in a private school parking lot. McDonald\u2019s for dinner.',
    quote: '\u201CAt the end of the day, that\u2019s all we can bank on, isn\u2019t it? Love. Enthusiasm. And McDonald\u2019s. Universal values.\u201D',
    image: 'The shit show that is single parenting-01.png',
  },
  {
    numeral: 'III',
    name: 'The Clusterfuck That Is Dating',
    subtitle: 'Tinder. The T-rexes. The men who were functional and emotionally astute had been snatched up years ago. What remained was trying to eat you.',
    quote: '\u201CBasically, dating was a walk in the park. Jurassic Park.\u201D',
    image: 'The clusterfuck that is dating-01.png',
  },
  {
    numeral: 'IV',
    name: 'The Dumpster Fire That Is Unhealthy Relationships',
    subtitle: 'The kind of gaslighting that makes you surprised nothing actually caught fire.',
    quote: '\u201COpen. As in: his pants, the door, and my emotional wound.\u201D',
    image: 'the dumpster fire that is unhealthy relationships-01.png',
  },
  {
    numeral: 'V',
    name: 'The Omnishambles That Is Repeating Your Fuckups',
    subtitle: 'The Afrikaner. Cape Town. A wraparound porch she started imagining. A fortnight of easy. A text received mid-Uno. Everything inside her screaming: not again.',
    quote: '\u201CLove is patient. Love is constipated.\u201D',
    image: 'The omnishambles that is repeating your fuck ups -01.png',
  },
  {
    numeral: 'VI',
    name: 'The Clanger That Is Learning from Your Mistakes',
    subtitle: 'A solo trip to the Drakensberg that achieved nothing she planned. The internal renovation. Brick by broken brick.',
    quote: '\u201COne useful thing the Afrikaner did teach me was the term \u2018fok voort\u2019. Fuck forward. So forward I fucked, through the rubble of my life.\u201D',
    image: 'The clanger that is learning from your mistakes-01.png',
  },
  {
    numeral: 'VII',
    name: 'The Hot Mess That Is Growing Up',
    subtitle: 'Size 14 and fine with it. A child who debriefs on the car ride home from her first school social. A front-row seat.',
    quote: '\u201CHealing doesn\u2019t always have to be a big, soapbox moment. Sometimes it shows up as a casual shrug. A laugh. A step to the left.\u201D',
    image: 'The hot mess that is growing up-01.png',
  },
]

export default function BookPage() {
  return (
    <>
      {/* Book Hero */}
      <section className="relative bg-ink" style={{ paddingTop: 64 }}>
        <div className="mx-auto grid max-w-[1140px] items-center gap-0 lg:grid-cols-2">
          <div className="hero-animate-image flex items-center justify-center px-6 py-16 lg:py-20 lg:px-12">
            <Image
              src="/images/BookCover_Real.png"
              alt="In the Absence of a Soapbox - book cover"
              width={320}
              height={460}
              priority
              className="shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              style={{ borderRadius: 2 }}
            />
          </div>
          <div className="px-6 py-16 lg:py-20 lg:pl-4 lg:pr-14">
            <span className="hero-animate-kicker mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
              Published by Blu Lotis
            </span>
            <h1 className="hero-animate-headline font-display text-[clamp(2rem,3.5vw,3rem)] font-extrabold leading-[1.1] text-white">
              In the Absence of
              <br />
              <span className="text-amber italic">a Soapbox</span>
            </h1>
            <p className="hero-animate-body mt-3 text-[15px] font-medium text-white/60">
              Rants and Revelations of a Thirty-Something Single Mum
            </p>
            <blockquote className="hero-animate-body font-display mt-8 border-l-2 border-amber pl-5 text-base italic leading-[1.6] text-white/80">
              &ldquo;One moment, I was doing adult things in bed. The next moment, I was having to
              lie in it.&rdquo;
            </blockquote>
            <div className="hero-animate-body mt-8 flex flex-wrap gap-8">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Author</span>
                <span className="mt-1 block text-sm text-white">Kel Wright</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Publisher</span>
                <span className="mt-1 block text-sm text-white">Blu Lotis</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Format</span>
                <span className="mt-1 block text-sm text-white">Narrative Memoir</span>
              </div>
            </div>
            <div className="hero-animate-ctas mt-10 flex flex-wrap gap-4">
              <NotifyModal />
              <Link
                href="/about"
                className="btn-lift inline-block border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white hover:text-ink"
                style={{ borderRadius: 2 }}
              >
                About the author
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Synopsis */}
      <section className="py-28">
        <div className="mx-auto max-w-[720px] px-6">
          <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            What this is
          </span>
          <h2
            className="scroll-reveal font-display mb-10 text-[clamp(1.6rem,2.5vw,2rem)] font-extrabold text-ink"
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            A memoir about bodies, bad boys, and the long, unglamorous business of figuring yourself out.
          </h2>
          <div
            className="scroll-reveal space-y-5 text-[15px] leading-[1.85] text-muted"
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            <p className="amber-left-accent">It starts at sixteen.</p>
            <p>Pregnant. Unplanned. In possession of approximately zero useful skills &mdash; including, apparently, the ability to correctly deploy a condom.</p>
            <p className="amber-left-accent">It ends at 30(ish).</p>
            <p>20(ish) kilograms heavier. Two relationships worse for wear. One child raised mostly well (the jury&apos;s still out on the dental hygiene). A genuinely alarming amount of self-knowledge that was predominantly the byproduct of having made so many mistakes, and choosing to fok voort regardless.</p>
            <p>It is also, and perhaps more than anything else, a book about a child. A forgiving, gracious human, who arrived before I was ready, grew up while I was still figuring out how to, and somehow &mdash; through all of it &mdash; managed to teach me more about grace, grit, and getting back up than I ever managed to teach myself.</p>
            <p className="font-display text-base font-bold text-ink">This is not a book about having it figured out. It is a book about what happens when you don&apos;t &mdash; and about the very specific kind of person who, in the absence of an actual soapbox, decides to write it all down anyway.</p>
          </div>
        </div>
      </section>

      {/* Dedication */}
      <section className="relative overflow-hidden bg-ink py-24">
        <div className="mx-auto max-w-[600px] px-6 text-center">
          <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Dedication
          </span>
          <p
            className="scroll-reveal font-display mb-10 text-xl font-bold text-white"
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            For my daughter
          </p>
          <div
            className="scroll-reveal pullquote-mark pt-6 font-display space-y-6 text-base italic leading-relaxed text-white/70"
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            <p>
              You are my undoing<br />
              The shattering of every brittle belief<br />
              I ever held about myself
            </p>
            <p>
              Where I fractured, you flourished<br />
              Where I flailed, you forgave<br />
              You turned my brokenness into bravery<br />
              You taught me grace simply by being gracious<br />
              And without ever raising your voice<br />
              <span className="text-amber">You gave me mine</span>
            </p>
            <p>
              You changed my story<br />
              Revealed my truth<br />
              And made me want to grow<br />
              Into someone worthy of yours
            </p>
          </div>
          <div className="mx-auto mt-10 h-[3px] w-16 bg-amber" />
        </div>
      </section>

      {/* Chapters */}
      <section className="py-28">
        <div className="mx-auto max-w-[1140px] px-6">
          <div className="mb-16">
            <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
              The Structure
            </span>
            <h2
              className="scroll-reveal font-display mb-3 text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold text-ink"
              style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            >
              How it&apos;s organised. More or less.
            </h2>
            <p
              className="scroll-reveal max-w-lg text-[15px] leading-[1.8] text-muted"
              style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            >
              Each section has a name. Each name is, technically, a category of disaster. Together they
              form something that looks suspiciously like a life well examined.
            </p>
          </div>

          <div className="space-y-6">
            {chapters.map((ch, i) => (
              <div
                key={ch.numeral}
                className={`scroll-reveal chapter-card overflow-hidden ${i % 2 === 0 ? 'bg-grey' : 'bg-white border border-border'}`}
                style={{ '--reveal-delay': `${i * 80}ms`, borderRadius: 2 } as React.CSSProperties}
              >
                <div className="grid items-center gap-0 md:grid-cols-[220px_1fr]">
                  <div className="relative aspect-square overflow-hidden md:aspect-auto md:h-full">
                    <Image
                      src={`/images/${ch.image}`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="220px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
                      <span className="font-display text-5xl font-extrabold text-white/60">
                        {ch.numeral}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <h3 className="font-display mb-3 text-[clamp(1rem,1.5vw,1.25rem)] font-bold text-ink">{ch.name}</h3>
                    <p className="text-[15px] leading-[1.8] text-muted">{ch.subtitle}</p>
                    <blockquote className="font-display mt-5 border-l-2 border-amber pl-4 text-sm italic text-ink/60">
                      {ch.quote}
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collage */}
      <section className="bg-grey py-20">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="scroll-reveal-scale overflow-hidden shadow-lg" style={{ borderRadius: 2 }}>
            <Image
              src="/images/MockupCollage.png"
              alt="Book mockup collage"
              width={1000}
              height={600}
              className="transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* Excerpt */}
      <section className="bg-grey py-28">
        <div className="mx-auto max-w-[720px] px-6">
          <span className="scroll-reveal mb-3 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            From the Introduction
          </span>
          <h2
            className="scroll-reveal font-display mb-10 text-[clamp(1.6rem,2.5vw,2rem)] font-extrabold text-ink"
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          >
            A taste of what you&apos;re in for.
          </h2>
          <div
            className="scroll-reveal amber-left-accent space-y-5 text-[15px] leading-[1.85] text-muted"
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          >
            <p>
              At 30 years of age, I suddenly find I have a lot to say about life. Not only about my
              own life, mind you, but other peoples&apos; too. I have opinions on topics as varied as
              sex, parenting, home d&eacute;cor, and how not to be a thundering twat.
            </p>
            <p>
              These things have been accumulating since I was squeezed out of utero. And items of
              specific importance &mdash; such as getting myself up the pole at 16, weight gain, navigating
              single parenting, weight gain, dating, weight gain, fluctuating emotions, weight gain,
              bad decisions, oh, and weight gain &mdash; are but a few of these topics.
            </p>
          </div>
          <p
            className="scroll-reveal font-display mt-8 text-base font-bold italic text-amber"
            style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
          >
            There is considerably more where that came from.
          </p>
          <div className="scroll-reveal mt-10" style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
            <NotifyModal />
          </div>
        </div>
      </section>
    </>
  )
}
