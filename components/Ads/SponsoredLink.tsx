"use client";

import { SMARTLINK } from "@/lib/ads";
import { analytics } from "@/lib/analytics";

/**
 * A single Adsterra Direct Link, labelled plainly as a sponsored link.
 *
 * Kept visually distinct from real navigation on purpose — a monetised link
 * dressed up as site content is the kind of thing that gets a site reported,
 * and it costs more in trust than it earns.
 */
export default function SponsoredLink() {
  if (!SMARTLINK) return null;

  return (
    <p className="sponsored">
      <span className="sponsored-tag">विज्ञापन</span>
      <a
        href={SMARTLINK}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => analytics.ctaClicked("smartlink")}
      >
        हमारे प्रायोजक का ऑफ़र देखें
      </a>
    </p>
  );
}
