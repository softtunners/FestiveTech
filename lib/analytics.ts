/**
 * Google Analytics 4 helpers.
 *
 * The gtag snippet itself lives in app/layout.tsx. This module is the typed
 * surface the app uses to report what people actually do, so GA reports
 * something more useful than a single pageview count.
 */

export const GA_ID = "G-JTDZYPYW55";

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/** True once the GA script has loaded and defined gtag. */
export function isAnalyticsReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Report a custom event. Safe to call before GA loads or when a visitor's
 * ad blocker has removed it — the call is simply dropped.
 */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    // Queue onto dataLayer even if gtag hasn't defined itself yet; the
    // snippet replays the queue on load.
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(["event", event, params]);
    }
  } catch {
    // Analytics must never break the page.
  }
}

/* Named events, so call sites can't drift on spelling. */
export const analytics = {
  cardDownloaded: (format: string, frame: string, hasPhoto: boolean) =>
    track("card_download", { format, frame, has_photo: hasPhoto }),

  cardShared: (channel: "whatsapp" | "native" | "copy_link", format: string) =>
    track("card_share", { channel, format }),

  cardCustomised: (field: string, value: string) =>
    track("card_customise", { field, value }),

  photoAdded: () => track("card_photo_added"),

  mandalOpened: (name: string, rank: number) =>
    track("mandal_open", { mandal_name: name, rank }),

  mandalDirections: (name: string) => track("mandal_directions", { mandal_name: name }),

  aartiOpened: (title: string) => track("aarti_open", { aarti_title: title }),

  ctaClicked: (cta: string) => track("cta_click", { cta_name: cta }),

  referralArrived: (from: string) => track("referral_visit", { referred_by: from }),
};
