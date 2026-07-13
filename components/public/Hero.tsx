import Image from 'next/image'
import Link from 'next/link'
import { NotifyModal } from './NotifyModal'

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white">
      <div className="mx-auto grid max-w-[1140px] gap-0 lg:grid-cols-2 lg:items-center">
        {/* Hero image */}
        <div className="relative aspect-[3/4] lg:aspect-auto lg:h-screen">
          <Image
            src="/images/HeroSection.png"
            alt="Kel Wright"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/30" />
        </div>

        {/* Hero content */}
        <div className="relative px-6 py-12 lg:py-20 lg:pl-12 lg:pr-6">
          <span className="mb-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            Kel Wright
          </span>
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
            I don&apos;t have it
            <br />
            figured out.
            <span className="block text-amber italic">
              I&apos;m not sure
              <br />
              I ever will.
            </span>
            <span className="mt-2 block text-[0.6em] font-bold tracking-normal text-muted">
              Turns out that might
              <br />
              be the whole point.
            </span>
          </h1>

          {/* Topic pills */}
          <div className="mt-6 flex flex-wrap gap-2">
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
                className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted"
              >
                {pill}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Candid, funny, occasionally furious writing about bodies, relationships, motherhood,
            and the long, unglamorous business of growing outward instead of up.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/opinions"
              className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Read the Opinions
            </Link>
            <NotifyModal />
          </div>

          {/* Book cameo */}
          <div className="mt-10 flex items-center gap-4 border-t border-border pt-6">
            <Image
              src="/images/BookCover_Real.png"
              alt="In the Absence of a Soapbox book cover"
              width={60}
              height={90}
              className="rounded shadow-md"
            />
            <div>
              <span className="font-display block text-sm font-bold text-ink">
                In the Absence of a Soapbox
              </span>
              <span className="block text-xs text-muted">
                A memoir. Published by Blu Lotis.
              </span>
              <Link href="/book" className="mt-1 block text-xs font-semibold text-amber hover:text-amber-light">
                About the book &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
