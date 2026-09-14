/**
 * Adsterra configuration.
 *
 * Everything is driven by env vars so no ad keys are hard-coded and the
 * site degrades gracefully: any slot without a key simply does not render
 * (no empty boxes, no layout shift, no "Advertisement" label over nothing).
 *
 * See .env.example for where each value comes from in the Adsterra dashboard.
 */

/** Numeric publisher/domain id shown in the Adsterra dashboard. */
export const ADSTERRA_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSTERRA_PUBLISHER_ID ?? "6052081";

/**
 * Display banners. Adsterra gives each banner size its own 32-char key,
 * used against https://www.highperformanceformat.com/<key>/invoke.js
 */
export interface BannerUnit {
  key: string;
  width: number;
  height: number;
}

function unit(key: string | undefined, width: number, height: number): BannerUnit | null {
  return key ? { key, width, height } : null;
}

export const BANNERS = {
  /** 728x90 — desktop leaderboard */
  leaderboard: unit(process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728, 728, 90),
  /** 320x50 — mobile banner, swapped in for the leaderboard on small screens */
  mobile: unit(process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320, 320, 50),
  /** 300x250 — medium rectangle */
  rectangle: unit(process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300, 300, 250),
  /** 160x600 — wide skyscraper (optional) */
  skyscraper: unit(process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160, 160, 600),
} as const;

export type BannerSlot = keyof typeof BANNERS;

/**
 * Formats delivered by an `invoke.js` loader rather than a banner key.
 * Paste the full `src` from the Adsterra snippet, e.g.
 * //pl26052081.profitableratecpm.com/ab12.../invoke.js
 */
export const NATIVE_SRC = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC ?? "";

/** The `id` of the <div> the native snippet targets, e.g. container-ab12... */
export const NATIVE_CONTAINER_ID =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER ?? "";

export const SOCIAL_BAR_SRC = process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC ?? "";
export const POPUNDER_SRC = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC ?? "";

/** Protocol-relative URLs are fine in the browser but need https for a srcdoc iframe. */
export function absoluteSrc(src: string): string {
  if (!src) return "";
  return src.startsWith("//") ? `https:${src}` : src;
}
