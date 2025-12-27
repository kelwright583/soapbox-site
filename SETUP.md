# Setup Guide - In the Absence of a Soapbox PWA

## Quick Start

1. **Add Required Images:**
   - Replace `/assets/images/cover.jpg` with your book cover (recommended: 800x1200px)
   - Add PWA icons to `/assets/icons/`:
     - `icon-192.png` (192x192)
     - `icon-512.png` (512x512)
     - `maskable-192.png` (192x192, with safe zone)
     - `maskable-512.png` (512x512, with safe zone)

2. **Update Email Address:**
   - Edit `/js/main.js`
   - Find the `initEmailCopy()` function
   - Replace `'hello@yourdomain.com'` with your actual email

3. **Update Domain:**
   - Search and replace `https://intheabsenceof.example` with your actual domain in all HTML files
   - This is used for Open Graph tags and canonical URLs

4. **Run Locally:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (npx serve)
   npx serve
   
   # Using VS Code Live Server extension
   # Right-click index.html > Open with Live Server
   ```

5. **Test PWA:**
   - Open in Chrome/Edge
   - Open DevTools > Application > Service Workers
   - Verify service worker registers
   - Test offline mode (DevTools > Network > Offline)
   - Test install prompt (should appear automatically)

## File Structure

```
soapbox-pwa/
├── assets/
│   ├── icons/          (add your PWA icons here)
│   └── images/         (add cover.jpg here)
├── css/
│   └── styles.css      (all styles)
├── js/
│   ├── main.js         (main functionality)
│   └── sw-register.js  (service worker registration)
├── data/
│   └── dispatches.json (dispatch data)
├── dispatches/
│   ├── index.html      (archive page)
│   ├── bra-seatbelts.html
│   └── turning-thirty.html
├── index.html
├── about.html
├── book.html
├── correspondence.html
├── offline.html
├── manifest.webmanifest
└── sw.js              (service worker)
```

## Customization

- **Colors:** Edit CSS variables in `/css/styles.css` (`:root` section)
- **Typography:** Google Fonts are loaded in each HTML file's `<head>`
- **Content:** Edit HTML files directly or update `/data/dispatches.json` for dispatch content
- **New Unsolicited Opinions:** Add entries to `dispatches.json` and create corresponding HTML files in `/dispatches/`

## Deployment

This is a static site and can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

Make sure:
- Service worker is served over HTTPS (required for PWA)
- All paths are relative or absolute (starting with `/`)
- Manifest and service worker are at the root level

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Service Worker support required for offline functionality
- Progressive enhancement: site works without JS, but features require it

