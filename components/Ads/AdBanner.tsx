"use client";

import { useEffect, useRef, useState } from "react";
import { BANNERS, BannerUnit, absoluteSrc } from "@/lib/ads";

type Slot = "leaderboard" | "rectangle" | "skyscraper";

interface AdBannerProps {
  slot?: Slot;
  label?: string;
}

/**
 * Adsterra display banner.
 *
 * Two things here are deliberate:
 *
 * 1. The ad runs inside an `srcdoc` iframe. Adsterra's banner loader reads a
 *    *global* `atOptions` object, so two banners injected into the same page
 *    would race and both render the last-set size. One iframe per banner gives
 *    each loader its own window, which is the only reliable way to run more
 *    than one unit on a page.
 *
 * 2. Nothing loads until the slot is near the viewport, and the slot reserves
 *    its exact height beforehand, so ads never push content around (CLS).
 */
export default function AdBanner({ slot = "leaderboard", label = "Advertisement" }: AdBannerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  // Swap the 728x90 leaderboard for a 320x50 on phones.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let unit: BannerUnit | null;
  if (slot === "leaderboard") unit = isNarrow ? BANNERS.mobile ?? BANNERS.leaderboard : BANNERS.leaderboard;
  else if (slot === "rectangle") unit = BANNERS.rectangle;
  else unit = BANNERS.skyscraper;

  // No key configured for this slot — render nothing at all rather than an
  // empty labelled box that makes the page look broken.
  if (!unit) return null;

  const sizeClass =
    slot === "rectangle" ? "ad-rectangle" : slot === "skyscraper" ? "ad-native" : "ad-leaderboard";

  return (
    <div className="ad-zone" ref={hostRef}>
      <div className={`ad-inner ${sizeClass}`}>
        <div className="ad-label-text">{label}</div>
        <div className="ad-content" style={{ minHeight: unit.height }}>
          {inView && <BannerFrame unit={unit} />}
        </div>
      </div>
    </div>
  );
}

function BannerFrame({ unit }: { unit: BannerUnit }) {
  const src = absoluteSrc(`//www.highrevenueformat.com/${unit.key}/invoke.js`);

  const doc = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style>
</head><body>
<script type="text/javascript">
  atOptions = ${JSON.stringify({
    key: unit.key,
    format: "iframe",
    height: unit.height,
    width: unit.width,
    params: {},
  })};
<\/script>
<script type="text/javascript" src="${src}"><\/script>
</body></html>`;

  return (
    <iframe
      title="Advertisement"
      srcDoc={doc}
      width={unit.width}
      height={unit.height}
      scrolling="no"
      loading="lazy"
      // Ads need scripts and their own origin; withhold everything else.
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      style={{ border: 0, display: "block", maxWidth: "100%" }}
    />
  );
}
