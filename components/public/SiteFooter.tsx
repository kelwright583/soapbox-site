import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-grey">
      <div className="mx-auto grid max-w-[1140px] gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            In the Absence of
          </span>
          <span className="font-display block text-lg font-extrabold leading-tight text-ink">
            A Soapbox
          </span>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The personal brand and book site
            <br />
            of Kel Wright. Durban, South Africa.
          </p>
        </div>

        <div>
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Navigate
          </span>
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-sm text-ink hover:text-amber">Home</Link>
            <Link href="/about" className="text-sm text-ink hover:text-amber">About</Link>
            <Link href="/book" className="text-sm text-ink hover:text-amber">The Book</Link>
            <Link href="/opinions" className="text-sm text-ink hover:text-amber">Unsolicited Opinions</Link>
            <Link href="/correspondence" className="text-sm text-ink hover:text-amber">Correspondence</Link>
          </div>
        </div>

        <div>
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            Say hello
          </span>
          <div className="flex flex-col gap-2">
            <a href="mailto:hello@intheabsence.co.za" className="text-sm text-ink hover:text-amber">
              hello@intheabsence.co.za
            </a>
            <a href="mailto:purchases@intheabsence.co.za" className="text-sm text-ink hover:text-amber">
              purchases@intheabsence.co.za
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6">
        <div className="mx-auto max-w-[1140px] space-y-2 text-[11px] leading-relaxed text-muted">
          <p><strong className="text-ink">&copy; 2026 Kelwyn Wright</strong></p>
          <p>ISBN: 978-1-0492-3869-2 (softcover) &middot; 978-1-0492-3870-8 (ebook)</p>
          <p>This book is a memoir. Names of persons and locations may have been altered for the protection of privacy.</p>
          <p>All rights reserved. No part of this publication may be reproduced, distributed, stored in a retrieval system, or transmitted in any form or by any means without the prior written permission of the author.</p>
          <p>
            Edited by Lauren Shapiro &middot; Cover design and illustrations by Geraldine Harris &middot; Author photo: Kel Williams of Silver Lining Photography &middot; Book design and publishing assistance by Heeren Ranchod &middot; Published by Blu Lotis &middot;{' '}
            <a href="mailto:publish@blulotis.com" className="underline hover:text-amber">publish@blulotis.com</a>
          </p>
        </div>
      </div>

      <div className="bg-ink px-6 py-4">
        <p className="text-center text-xs text-white/50">
          &copy; 2026 In the Absence of a Soapbox &middot; intheabsence.co.za
        </p>
      </div>
    </footer>
  )
}
