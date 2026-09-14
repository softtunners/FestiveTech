# Bappa Blessings — ganpatibappa.online

Ganesh Chaturthi greeting-card and WhatsApp-status maker, a Mumbai Ganpati
mandal darshan guide, and a Ganesh aarti collection. Next.js 16 (App Router).

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Ads — Adsterra

Every ad slot is driven by env vars. **A slot with no key renders nothing at
all** — no empty box, no "Advertisement" label over blank space — so the site
looks finished whether or not ads are configured.

Copy `.env.example` to `.env.local` and fill in the values from your Adsterra
dashboard.

| Format | Vars | Where it appears |
| --- | --- | --- |
| Banner 728x90 | `NEXT_PUBLIC_ADSTERRA_BANNER_728` | Below hero, below aarti |
| Banner 320x50 | `NEXT_PUBLIC_ADSTERRA_BANNER_320` | Auto-swapped in for the 728 on phones |
| Banner 300x250 | `NEXT_PUBLIC_ADSTERRA_BANNER_300` | Below the card creator |
| Native Banner | `NEXT_PUBLIC_ADSTERRA_NATIVE_SRC` + `..._NATIVE_CONTAINER` | Below the mandals |
| Social Bar | `NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC` | Site-wide, 3.5s after load |
| Popunder | `NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC` | Site-wide, after real engagement |

### Reading your Adsterra snippet

**Banners.** Adsterra gives you something like:

```html
<script type="text/javascript">
  atOptions = { 'key':'a1b2c3d4e5f6...', 'format':'iframe',
                'height':90, 'width':728, 'params':{} };
</script>
<script src="//www.highperformanceformat.com/a1b2c3d4e5f6.../invoke.js"></script>
```

Take **only the `key` value** (`a1b2c3d4e5f6...`) and put it in the var matching
that size. The component builds the rest.

**Native / Social Bar / Popunder.** These come as an `invoke.js` loader:

```html
<script async data-cfasync="false"
        src="//pl26052081.profitableratecpm.com/<hash>/invoke.js"></script>
<div id="container-<hash>"></div>
```

Paste the whole `src` into the `*_SRC` var. For the native banner also copy the
`<div>`'s `id` into `NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER`.

### Notes on the implementation

- **Each banner runs in its own `srcdoc` iframe.** Adsterra's loader reads a
  *global* `atOptions`, so two banners on one page would otherwise race and both
  render whichever size was set last. One iframe per unit is the only reliable
  fix.
- **Nothing loads until it is ~300px from the viewport**, and every slot
  reserves its exact height first, so ads never shift the layout.
- **Popunder waits for engagement** (a scroll past 400px, a tap, or 25s) rather
  than firing on load. Firing immediately reads as a scam page and costs more in
  bounces than it earns.

## Analytics

Google Analytics 4 (`G-JTDZYPYW55`) is in `app/layout.tsx`. Verified firing:
`page_view` and `user_engagement` beacons reach `google-analytics.com/g/collect`
with the correct `tid`.

Beyond pageviews, `lib/analytics.ts` reports what people actually do — so GA can
answer "are visitors finishing a card?" rather than just "how many landed?":

`card_download` · `card_share` · `card_customise` · `card_photo_added` ·
`mandal_open` · `mandal_directions` · `aarti_open` · `cta_click` ·
`referral_visit`

These show up in GA under **Reports → Engagement → Events** (allow ~24h, or use
**Realtime** to confirm immediately).

## Design

Restraint is the whole idea. Earlier versions piled on gradients, glows,
particles, a fake gold arch and five competing accent colours; all of it
fought the photograph and made the page feel like a template.

- **Two colours.** Saffron for actions, green for WhatsApp. Everything else is
  cream, white and ink. No gradients anywhere.
- **The photograph is the design.** Shown large and unframed. No arch, no
  garland, no glow.
- **Hairlines, not shadows.** One shadow token exists and is used twice.
- **Two typefaces.** Rozha One for headings only; Noto Sans Devanagari for all
  UI and body text, because a serif is harder to read at small sizes and this
  audience reads slowly.
- **No decorative motion.** The particle canvas, light rays, mandala, aura and
  parallax tilt are all gone. A short fade as sections enter view is all that
  remains, and it is disabled under `prefers-reduced-motion`.
- **Selection is a 2px accent ring** — not a fill plus a badge plus a shadow.
- **52px minimum tap targets**; body text at 17px.
- No emoji in the interface: they render differently on every device and read
  as decoration rather than controls.

### Devanagari

`letter-spacing` is never applied to Devanagari text — tracking pulls conjuncts
apart and makes words harder to parse. Headings get a small `padding-block`
because Rozha One's ascenders clip otherwise.

## Structure

```
app/
  layout.tsx      metadata, fonts, GA, JSON-LD
  page.tsx        section composition, scroll targets, mobile action bar
  globals.css     design tokens + all component styles
  sitemap.ts robots.ts manifest.ts
components/
  Hero/           3D shrine presentation of the idol
  Blessing/       card creator (canvas) — the primary action
  Mandals/        darshan guide with search + crowd filter
  Aarti/          aarti list
  Ads/            AdBanner · NativeAd · AdsterraGlobal
lib/
  cardGenerator.ts  canvas card rendering
  mandals.ts aarti.ts blessings.ts
  ads.ts            ad config from env
  analytics.ts      typed GA events
```

Cards are rendered entirely in the browser on a `<canvas>`. **No photo is ever
uploaded** — worth keeping true, since the UI promises it.
