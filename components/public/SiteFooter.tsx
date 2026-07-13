import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div
        className="mx-auto grid max-w-[1140px] gap-12 px-6 py-16 md:grid-cols-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.53rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 2,
            }}
          >
            In the Absence of
          </span>
          <span
            className="font-display"
            style={{
              display: 'block',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            A Soapbox
          </span>
          <p style={{ marginTop: 12, fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.4)' }}>
            The personal brand and book site
            <br />
            of Kel Wright. Durban, South Africa.
          </p>
        </div>

        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
            }}
          >
            Navigate
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">Home</Link>
            <Link href="/about" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">About</Link>
            <Link href="/book" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">The Book</Link>
            <Link href="/opinions" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">Unsolicited Opinions</Link>
            <Link href="/correspondence" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">Correspondence</Link>
          </div>
        </div>

        <div>
          <span
            style={{
              display: 'block',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 16,
            }}
          >
            Say hello
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="mailto:hello@intheabsence.co.za" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">
              hello@intheabsence.co.za
            </a>
            <a href="mailto:purchases@intheabsence.co.za" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-amber">
              purchases@intheabsence.co.za
            </a>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="mx-auto max-w-[1140px] px-6 py-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>&copy; 2026 Kelwyn Wright</p>
          <p style={{ fontSize: '0.65rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.25)' }}>
            ISBN: 978-1-0492-3869-2 (softcover) &middot; 978-1-0492-3870-8 (ebook)
          </p>
          <p style={{ fontSize: '0.65rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.25)' }}>
            All rights reserved. No part of this publication may be reproduced, distributed, stored in a retrieval system, or transmitted in any form or by any means without the prior written permission of the author.
          </p>
          <p style={{ fontSize: '0.65rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.25)' }}>
            Edited by Lauren Shapiro &middot; Cover design and illustrations by Geraldine Harris &middot; Author photo: Kel Williams of Silver Lining Photography &middot; Book design and publishing assistance by Heeren Ranchod &middot; Published by Blu Lotis &middot;{' '}
            <a href="mailto:publish@blulotis.com" style={{ textDecoration: 'underline', color: 'rgba(255,255,255,0.35)' }} className="hover:text-amber">publish@blulotis.com</a>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '14px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
          &copy; 2026 In the Absence of a Soapbox &middot; intheabsence.co.za
        </p>
      </div>
    </footer>
  )
}
