# PANTAO

**A streetwear house that ripens once a year.** One drop, limited quantities, then never again.

This repo is the online store — a self-contained, dependency-free experience built around the
mythology of the _pántáo_ (蟠桃), the immortal peaches that fruit once in a lifetime.

---

## What's here

```
index.html              The store (hero, drop grid, lookbook, mythology, waitlist)
assets/css/styles.css    All styling — monochrome + blossom accent, grain, motion
assets/js/config.js      ⭐ THE ONLY FILE YOU EDIT to run a drop
assets/js/store.js       The engine — countdown, cart, quickview, phase switching
```

No build step. No frameworks. Open `index.html` or drop the folder on any static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages).

---

## Running a drop — edit `assets/js/config.js`

### 1. Set the phase
```js
phase: "teaser"   // countdown + waitlist, store hidden (pre-drop hype)
phase: "live"     // full store: product grid, sizes, cart, checkout
phase: "sold"     // drop is over — archive view + "notify me next year"
```

### 2. Set the drop time (used by the countdown in `teaser`)
```js
dropDate: "2026-11-11T11:00:00-08:00"   // ISO 8601, include your timezone
```

### 3. Edit the pieces
Each product has a `stock` number that drives availability automatically:
- `stock > 0` → in stock (**8 or fewer** shows an "Only N left" tag)
- `stock === 0` → renders as **Sold Out** (greyed, un-clickable)

Set `sizes: []` for one-size pieces (hats, scarves). Swap the generated `art` panel for a
real photo any time with `img: "assets/img/your-photo.jpg"`.

That's the whole workflow: **flip `phase` → `live`, set stock, publish.** When a piece sells
through, set its `stock` to `0`; when the season ends, flip `phase` to `sold`.

---

## Wiring the real stuff (optional)

The store is fully functional as an _experience_ — the cart persists in `localStorage` and the
checkout / waitlist are stubbed so you can launch the vibe today and connect commerce later.
Two clearly-marked hooks in `assets/js/store.js`:

- **`checkout()`** — replace the placeholder with Stripe Checkout, a Shopify cart permalink,
  or your own API. The current cart is logged so you can see the exact payload shape.
- **`signup()` form submit** — currently logs the email; point it at Klaviyo / Mailchimp / your ESP.

---

## Design notes

- **Type:** Space Grotesk (UI) · Bodoni Moda italic (display) · Noto Serif SC (蟠桃 glyphs)
- **Palette:** near-black ground, bone text, a single blossom-peach accent — swap the CSS
  custom properties at the top of `styles.css` to re-skin the whole site.
- Respects `prefers-reduced-motion`, keyboard-navigable, mobile-first responsive.

---

_One drop a year · Limited forever._
