# PANTAO

**pang-tao · para sa tao — "for the people."** (Tagalog)

A house that opens once a year. A single edition, made in numbers small enough
to know each piece by hand — then the doors close until the next.

This repo holds two things:

```
/                     The experience sandbox (standalone static site)
  index.html
  assets/css/styles.css
  assets/js/config.js   ⭐ the one file you edit to run an edition
  assets/js/store.js

/shopify-theme          The real store — the exported Shopify theme (Atelier base)
```

---

## The name

Pantao is Tagalog — from **_tao_**, a person, a people. **_Pang-tao_**: for the
people. The house takes the name as an instruction: clothing cut for the body and
the life around it, made in numbers it can answer for. Not for the few.

> The brand world is **Filipino, editorial, by invitation** — signed **· MANILA**.
> It is **not** Chinese, and there are no peach / 蟠桃 motifs anywhere.

---

## The two surfaces, and why

You asked to treat the standalone site as a fast **experimentation ground** and
port winning ideas into the Shopify theme. So the sandbox is built to **mirror the
theme's structure 1:1**, which makes porting nearly mechanical:

| Sandbox section (`index.html`) | Shopify theme section (`shopify-theme/sections/`) |
| --- | --- |
| Arrival hero | `arrival-hero.liquid` |
| The Name (etymology) | *new — candidate to port* |
| Editorial dispatch (a letter) | `editorial-dispatch.liquid` |
| The manifest (numbered pieces) | `edition-manifest.liquid` |
| By invitation (apply) | `password-antechamber.liquid` |

Prototype an idea in the sandbox, get it looking right, then rebuild that one
section in Liquid. Same names, same order, same voice.

---

## Running an edition — edit `assets/js/config.js`

### Phase
```js
phase: "antechamber"  // doors closed — counter + application to the list only
phase: "open"         // the edition is live — manifest + shop
phase: "closed"       // the edition has closed — archive + apply for next year
```

### When the doors open (used by the counter in `antechamber`)
```js
opensAt: "2026-11-11T11:00:00+08:00"   // ISO 8601, include timezone
```

### The pieces
Each piece's `stock` drives availability automatically:
- `stock > 0` → open (**8 or fewer** shows a remaining count)
- `stock === 0` → **closed** (struck through, retired to the archive)

Set `sizes: []` for one-size pieces. Swap the monochrome `tone` plate for a real
photo any time with `img: "assets/img/your-photo.jpg"`.

### The flagship feature
Mark one piece `feature: true` and it gets a full-bleed luxury moment above the
manifest. The **Vitrine Distressed Knit** is the built-in example — a knit whose
hand-worked open gauge is framed as a *setting* for the watch and chain the wearer
brings to it ("the setting, not the stone"). Feature copy lives on the piece:
`featureEyebrow`, `featureHeading` (use `\n` for a line break), `featureLede`,
`caption`. The distressed-knit visual is rendered in CSS; drop in real campaign
photography with `featureImg: "assets/img/knit.jpg"`.

> Note on the horology framing: the piece is *designed* to show off fine watches and
> jewelry, but the site copy evokes that world rather than naming other houses
> (Rolex, AP, …) — printing their trademarks in your marketing implies an endorsement
> you don't have, and the suggestion reads more luxury than the logo anyway.

---

## What changed in the Shopify theme

The theme was already excellent and on-brand — no Chinese elements anywhere. The
only factual root issue was the **city**, which appeared inconsistently:

- `templates/password.json` — antechamber caption `TAIPEI` → **`MANILA`**
- `templates/index.json` — homepage dispatch dateline `SEATTLE` → **`MANILA`**
- `sections/editorial-dispatch.liquid` — schema default `TAIPEI` → **`MANILA`**

Everything is now consistent on **PANTAO ATELIER · MANILA**.

To push the theme live: use the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
(`shopify theme push` from inside `shopify-theme/`), or zip that folder and upload it
in **Online Store → Themes**.

---

## Wiring commerce (optional)

The sandbox is a full *experience* — the bag persists in `localStorage`; checkout and
the application form are stubbed with clearly-marked hooks in `store.js`:

- **`checkout()`** — drop in Stripe Checkout or a Shopify cart permalink. The current
  bag is logged so you can see the payload shape.
- **`apply()` submit** — currently logs; point it at Klaviyo / Mailchimp / your API.

The real transactions happen in the Shopify theme; the sandbox is for feel and flow.

---

## Design notes

- **Type:** Inter (UI / micro-labels) · Cormorant Garamond italic (display / letters)
- **Palette:** light and clean — a cool near-white ground, cool near-black text, and a
  restrained **steel** micro-label accent. Airy and editorial, in the world of overcast
  daylight, private aviation, and hypercars. Two deliberate dark moments punctuate it:
  the flagship **feature** and the **footer**. Swap the CSS custom properties at the top
  of `styles.css` to re-skin everything.
- **Hero image:** the landing hero is a full-bleed campaign photo set by
  `config.heroImage` (default `assets/img/hero.jpg`). Drop your photo at that path and
  it appears automatically; until then a clean overcast placeholder shows. A left- and
  bottom-biased scrim keeps the headline legible over any image.
- Respects `prefers-reduced-motion`, keyboard-navigable, mobile-first responsive.

---

_Opens once a year · For the people · Manila._
