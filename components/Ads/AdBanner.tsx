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
 * Three things are deliberate here:
 *
 * 1. The ad runs inside an `srcdoc` iframe. Adsterra's loader reads a *global*
 *    `atOptions`, so two banners on one page would race and both render the
 *    last-set size. One iframe per banner gives each its own window.
 *
 * 2. Nothing loads until the slot nears the viewport.
 *
 * 3. An unfilled slot leaves no trace. Ad fill is never 100%, and a bordered
 *    box labelled "Advertisement" wrapped around nothing is the single most
 *    broken-looking thing a page can show. The frame and label appear only
 *    once the unit has actually rendered something.
 */
export default function AdBanner({ slot = "leaderboard", label = "Advertisement" }: AdBannerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [filled, setFilled] = useState(false);

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
  if (slot === "leaderboard") {
    // Fall back to whichever size is configured rather than showing nothing.
    unit = isNarrow
      ? BANNERS.mobile ?? BANNERS.leaderboard
      : BANNERS.leaderboard ?? BANNERS.mobile;
  } else if (slot === "rectangle") {
    unit = BANNERS.rectangle;
  } else {
    unit = BANNERS.skyscraper;
  }

  if (!unit) return null;

  const sizeClass =
    slot === "rectangle" ? "ad-rectangle" : slot === "skyscraper" ? "ad-native" : "ad-leaderboard";

  return (
    <div className="ad-zone" ref={hostRef} data-filled={filled}>
      <div className={`ad-inner ${sizeClass}`} style={{ minHeight: filled ? undefined : 0 }}>
        {filled && <span className="ad-label-text">{label}</span>}
        <div className="ad-content">
          {inView && <BannerFrame unit={unit} onFilled={() => setFilled(true)} />}
        </div>
      </div>
    </div>
  );
}

function BannerFrame({ unit, onFilled }: { unit: BannerUnit; onFilled: () => void }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const src = absoluteSrc(`//www.highperformanceformat.com/${unit.key}/invoke.js`);

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

  /**
   * Decide whether the unit actually filled.
   *
   * `srcdoc` inherits this page's origin, so the inner document is readable.
   * The loader appends its own iframe/ins on success; on a no-fill the body
   * holds nothing but the two scripts. If the check is ever blocked we
   * assume filled, so a working ad is never hidden by a failed probe.
   */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;

    const check = () => {
      try {
        const body = el.contentDocument?.body;
        if (!body) return;
        const rendered = body.querySelector("iframe, ins, img, a, div");
        if (rendered) onFilled();
      } catch {
        onFilled();
      }
    };

    const onLoad = () => {
      // The loader injects asynchronously after its own script runs.
      timer = setTimeout(check, 1500);
    };

    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("load", onLoad);
      clearTimeout(timer);
    };
  }, [onFilled]);

  return (
    <iframe
      ref={frameRef}
      title="Advertisement"
      srcDoc={doc}
      width={unit.width}
      height={unit.height}
      scrolling="no"
      loading="lazy"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      style={{ border: 0, display: "block", maxWidth: "100%" }}
    />
  );
}
