import Image from 'next/image'
import Link from 'next/link'
import { NotifyModal } from './NotifyModal'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white">
      <div className="mx-auto grid max-w-[1140px] gap-0 lg:grid-cols-2 lg:items-center">
        {/* Hero image */}
        <div className="hero-animate-image relative aspect-[3/4] overflow-hidden lg:aspect-auto lg:h-screen">
          <Image
            src="/images/HeroSection.png"
            alt="Kel Wright"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white" />
        </div>

        {/* Hero content */}
        <div className="relative px-6 py-16 lg:py-24 lg:pl-14 lg:pr-6">
          <span className="hero-animate-kicker mb-4 block text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
            Kel Wright
          </span>
          <h1 className="hero-animate-headline font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
            I don&apos;t have it
            <br />
            figured out.
            <span className="block text-amber italic">
              I&apos;m not sure
              <br />
              I ever will.
            </span>
            <span className="mt-3 block text-[0.5em] font-bold tracking-normal text-muted">
              Turns out that might be the whole point.
            </span>
          </h1>

          {/* Topic pills */}
          <div className="hero-animate-pills mt-8 flex flex-wrap gap-2">
            {[
              'Bodies, no apology',
              'The wrong men',
              'Seemed fine at the time',
              'Single parenting',
              'Dating apps and their casualties',
              'Relationships that weren\u2019t',
              'Slowly figuring it out',
            ].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-ink/10 px-3.5 py-1.5 text-[11px] font-medium text-muted transition-all duration-200 hover:border-amber/40 hover:text-amber"
              >
                {pill}
              </span>
            ))}
          </div>

          <p className="hero-animate-body mt-8 max-w-md text-[15px] leading-[1.8] text-muted">
            Candid, funny, occasionally furious writing about bodies, relationships, motherhood,
            and the long, unglamorous business of growing outward instead of up.
          </p>

          <div className="hero-animate-ctas mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/opinions"
              className="btn-lift inline-block border-2 border-ink px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:bg-ink hover:text-white"
              style={{ borderRadius: 2 }}
            >
              Read the Opinions
            </Link>
            <NotifyModal />
          </div>

          {/* Book cameo */}
          <div className="hero-animate-cameo mt-12 flex items-center gap-5 border-t border-ink/8 pt-8">
            <Image
              src="/images/BookCover_Real.png"
              alt="In the Absence of a Soapbox book cover"
              width={64}
              height={96}
              className="shadow-lg transition-transform duration-300 hover:scale-105"
              style={{ borderRadius: 2 }}
            />
            <div>
              <span className="font-display block text-sm font-bold text-ink">
                In the Absence of a Soapbox
              </span>
              <span className="block text-xs text-muted">
                A memoir. Published by Blu Lotis.
              </span>
              <Link href="/book" className="link-hover mt-1.5 inline-block text-xs font-semibold text-amber">
                About the book &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
