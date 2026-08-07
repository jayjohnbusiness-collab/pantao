/* ============================================================================
 * PANTAO — DROP CONFIG
 * ----------------------------------------------------------------------------
 * This is the ONLY file you need to edit to run a drop.
 * Flip `phase`, set the `dropDate`, and edit the `products` list.
 * ==========================================================================*/

window.PANTAO_CONFIG = {

  /* ------------------------------------------------------------------
   * PHASE — controls what visitors see.
   *   "teaser" → countdown, brand story, waitlist. No shopping yet.
   *   "live"   → full store. Product grid, sizes, cart, checkout.
   *   "sold"   → drop is over. Archive + waitlist for next year.
   * ---------------------------------------------------------------- */
  phase: "live",

  /* The moment the drop goes live. Used by the countdown in "teaser". *
   * ISO 8601. Example below is a placeholder — set your real date.    */
  dropDate: "2026-11-11T11:00:00-08:00",

  /* Collection / drop identity ------------------------------------- */
  season: "MMXXVI",
  collectionName: "IMMORTAL PEACH",
  collectionNo: "001",

  /* Contact / social — used in the footer. Leave "" to hide a link.  */
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    email: "hello@pantao.studio"
  },

  /* Currency prefix shown before prices.                             */
  currency: "$",

  /* ------------------------------------------------------------------
   * PRODUCTS
   * Each piece in the drop. Set `stock` to control availability:
   *   stock > 0          → in stock (a number ≤ 8 shows a "low stock" tag)
   *   stock === 0        → sold out
   * `sizes` — omit or empty [] for one-size pieces (hats, bags).
   * `art` — a hue (0–360) used to render the piece's placeholder card.
   *   Swap the whole `art` object for `img: "assets/img/your-photo.jpg"`
   *   once you have real product photography.
   * ---------------------------------------------------------------- */
  products: [
    {
      id: "p01",
      name: "Immortal Peach Heavyweight Tee",
      subtitle: "14oz boxy tee · peach-dyed cotton",
      price: 85,
      sizes: ["S", "M", "L", "XL"],
      stock: 6,
      art: { hue: 14, glyph: "蟠" },
      story: "Garment-dyed in small batches so no two share the exact same wash. Boxed fit, dropped shoulder, ribbed collar built to hold its shape past a thousand years."
    },
    {
      id: "p02",
      name: "Queen Mother Hoodie",
      subtitle: "Cross-grain fleece · 500gsm",
      price: 165,
      sizes: ["S", "M", "L", "XL"],
      stock: 3,
      art: { hue: 340, glyph: "桃" },
      story: "500gsm loopback fleece brushed to a stone finish. Embroidered orchard motif across the back, hidden drawcord tips cast in matte metal."
    },
    {
      id: "p03",
      name: "Orchard Work Jacket",
      subtitle: "Waxed canvas · limited to 40",
      price: 285,
      sizes: ["S", "M", "L", "XL"],
      stock: 0,
      art: { hue: 122, glyph: "園" },
      story: "A chore jacket cut from waxed 12oz canvas. Triple-needle seams, corozo buttons, an inside pocket sized for nothing in particular. Forty made. Never again."
    },
    {
      id: "p04",
      name: "Three Thousand Year Cap",
      subtitle: "Unstructured 6-panel",
      price: 55,
      sizes: [],
      stock: 8,
      art: { hue: 45, glyph: "壽" },
      story: "Washed cotton twill, unstructured crown, a low profile that breaks in fast. Tonal stitch, brass slider closure."
    },
    {
      id: "p05",
      name: "Longevity Cargo",
      subtitle: "Double-knee ripstop",
      price: 145,
      sizes: ["28", "30", "32", "34", "36"],
      stock: 5,
      art: { hue: 30, glyph: "永" },
      story: "Ripstop cargo with articulated knees and gusseted movement. Deep bellows pockets, a taper that stops clean at the ankle."
    },
    {
      id: "p06",
      name: "Blossom Scarf",
      subtitle: "Silk-wool · one size",
      price: 75,
      sizes: [],
      stock: 0,
      art: { hue: 350, glyph: "花" },
      story: "A silk-wool blend printed with the orchard in bloom. Hand-rolled edges. The first thing to go, every year."
    }
  ]
};
