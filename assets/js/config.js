/* ============================================================================
 * PANTAO — EDITION CONFIG
 * ----------------------------------------------------------------------------
 * pang-tao · para sa tao · "for the people"  (Tagalog)
 *
 * A house that opens once a year. This is the ONLY file you edit to run
 * an edition. It mirrors the structure of the Shopify theme so anything
 * proven here ports straight across.
 * ==========================================================================*/

window.PANTAO_CONFIG = {

  /* ------------------------------------------------------------------
   * PHASE — controls what visitors see.
   *   "antechamber" → doors closed. Application to the list only.
   *   "open"        → the edition is live. Manifest + shop.
   *   "closed"      → the edition has closed. Archive + apply for next.
   * ---------------------------------------------------------------- */
  phase: "open",

  /* The moment the doors open. Used by the counter in "antechamber". *
   * ISO 8601 — include your timezone offset.                          */
  opensAt: "2026-11-11T11:00:00+08:00",

  /* House identity ------------------------------------------------- */
  city: "MANILA",
  edition: "V",              // roman numeral
  editionLabel: "EDITION V",
  year: "MMXXVI",
  season: "AUTUMN",

  /* Contact / social — footer. Leave "" to hide.                     */
  social: {
    instagram: "https://instagram.com",
    email: "atelier@pantao.studio"
  },

  currency: "$",

  /* ------------------------------------------------------------------
   * THE MANIFEST — the pieces in this edition.
   * `stock` drives availability automatically:
   *   stock > 0   → available (≤ 8 shows a count)
   *   stock === 0 → closed (retired to the archive)
   * `sizes` — omit / [] for one-size pieces.
   * `tone` — a greyscale value 0–100 used to render the piece's plate.
   *   Swap the `tone` for `img: "assets/img/your-photo.jpg"` when you
   *   have real photography.
   * ---------------------------------------------------------------- */
  pieces: [
    {
      id: "vitrine-distressed-knit",
      name: "Vitrine Distressed Knit",
      material: "Hand-distressed merino · open gauge",
      price: 345,
      sizes: ["S", "M", "L", "XL"],
      stock: 8,
      tone: 9,
      feature: true,                     // renders the flagship feature moment
      note: "Open-gauge merino, distressed by hand. The openwork is worked deliberately at the wrist and the throat, so a watch reads at the cuff and a chain sits clear at the collarbone. Made in a count we can name.",
      // ---- feature-section copy (luxury moment) ----
      featureEyebrow: "The Flagship",
      featureHeading: "The setting,\nnot the stone.",
      featureLede: "A merino knit distressed by hand into open gauge — every loosening placed, none of it accident. At the cuff it falls away to clear the wrist. At the throat it opens to the collarbone. You bring the watch. You bring the chain. The sweater is only the setting.",
      caption: "Worn open, on purpose."
    },
    {
      id: "v1-boxy-tee",
      name: "V.1 Boxy Tee",
      material: "14oz loopwheel cotton",
      price: 85,
      sizes: ["S", "M", "L", "XL"],
      stock: 6,
      tone: 22,
      note: "Loomstate cotton, boxed and dropped at the shoulder, made to soften into the shape of whoever wears it. Numbered at the hem."
    },
    {
      id: "fireman-clasp-jacket",
      name: "Fireman Clasp Jacket",
      material: "Waxed 12oz canvas · clasp hardware",
      price: 285,
      sizes: ["S", "M", "L", "XL"],
      stock: 3,
      tone: 12,
      note: "Cut from waxed canvas with cast fireman clasps at the placket. Storm-worthy without saying so. Made in a count we can name by hand."
    },
    {
      id: "selvedge-baggy-denim",
      name: "Selvedge Baggy Denim",
      material: "14.5oz Japanese selvedge",
      price: 165,
      sizes: ["28", "30", "32", "34", "36"],
      stock: 5,
      tone: 30,
      note: "Woven on shuttle looms, cut full and easy through the leg. Chain-stitched hem, hidden selvedge ID down the outseam."
    },
    {
      id: "concrete-grey-v2-zip",
      name: "Concrete Grey V.2 Zip-Up",
      material: "500gsm cross-grain fleece",
      price: 175,
      sizes: ["S", "M", "L", "XL"],
      stock: 4,
      tone: 46,
      note: "Heavyweight fleece brushed to a stone hand-feel, two-way zip, ribbed storm cuffs. Warm without weight."
    },
    {
      id: "vintage-grey-double-knees",
      name: "Vintage Grey Double Knees",
      material: "Double-knee ripstop",
      price: 145,
      sizes: ["28", "30", "32", "34"],
      stock: 7,
      tone: 52,
      note: "Reinforced at the knee, articulated for movement, tapered clean at the ankle. A working trouser that dresses up."
    },
    {
      id: "logo-cap-grey",
      name: "Logo Cap — Grey",
      material: "Washed cotton twill · 6-panel",
      price: 55,
      sizes: [],
      stock: 8,
      tone: 60,
      note: "Unstructured crown, low profile, tonal stitch. Breaks in the first afternoon you wear it."
    },
    {
      id: "vintage-black-v1-zip",
      name: "Vintage Black V.1 Zip-Up",
      material: "Garment-dyed heavyweight terry",
      price: 175,
      sizes: ["S", "M", "L", "XL"],
      stock: 0,
      tone: 8,
      note: "Overdyed a soft, worn black so no two are exactly alike. First to close, every edition."
    },
    {
      id: "crocodile-card-holder",
      name: "Crocodile Card Holder",
      material: "Embossed leather · four slots",
      price: 95,
      sizes: [],
      stock: 0,
      tone: 34,
      note: "Vegetable-tanned leather with a crocodile emboss, edge-painted by hand. Small, quiet, made to last."
    }
  ]
};
