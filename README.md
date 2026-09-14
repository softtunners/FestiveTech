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

Built for the actual audience: people with limited literacy, on cheap Android
phones, often outdoors.

- **Light content sections, dark hero.** The page opens and closes dark and the
  content sits lit between — that contrast is what makes it read as *sections*
  rather than one endless gradient. Light surfaces also stay legible in direct
  sunlight, where a dark UI washes out.
- **Colour-coded sections.** Saffron = make a card, peacock = mandals,
  purple = aarti. Someone who cannot read the headings can still tell where
  they are.
- **Icons carry meaning, words confirm it.** Nav items, step markers and every
  action pair a symbol with a short label, never a label alone.
- **One green path.** Every WhatsApp button on the site — hero, nav, floating,
  and in the card maker — routes through a single handler. The floating button
  hides itself while the hero's own green button is on screen, so there are
  never two competing green buttons.
- **Selection is shown three ways** (border, fill, check badge), because one
  cue is easy to miss.
- **Minimum 56px tap targets** throughout.
- Everything animated is disabled under `prefers-reduced-motion`.

### The hero

Layered planes on a single CSS `perspective`, each at its own `translateZ`:
mandala → light rays → aura → arch + idol → garland → diyas. Rotating the one
parent slides them past each other, and that parallax *between* layers is what
reads as 3D. Pointer-driven on desktop, scroll-driven on touch. Petals are
canvas-drawn and scoped to the hero — they stop rendering when it scrolls out
of view or the tab is hidden.

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
