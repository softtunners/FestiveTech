"use client";

import { useEffect } from "react";
import { SOCIAL_BAR_SRC, POPUNDER_SRC, absoluteSrc } from "@/lib/ads";

/**
 * Site-wide Adsterra formats: Social Bar and Popunder.
 *
 * Both are deliberately delayed. Loading them at first paint would compete
 * with the hero image for bandwidth and — for the popunder — fire before a
 * visitor has seen anything, which reads as a scam page and drives bounces.
 * Waiting until the page is idle and the visitor has engaged keeps the first
 * impression clean while still monetising the session.
 */
export default function AdsterraGlobal() {
  useEffect(() => {
    if (!SOCIAL_BAR_SRC && !POPUNDER_SRC) return;

    const added: HTMLScriptElement[] = [];
    const timers: number[] = [];

    const inject = (src: string) => {
      const url = absoluteSrc(src);
      if (document.querySelector(`script[src="${url}"]`)) return;
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src = url;
      s.async = true;
      s.setAttribute("data-cfasync", "false");
      document.body.appendChild(s);
      added.push(s);
    };

    // Social Bar: once the page has settled.
    if (SOCIAL_BAR_SRC) {
      timers.push(window.setTimeout(() => inject(SOCIAL_BAR_SRC), 3500));
    }

    // Popunder: only after the visitor has actually engaged with the page.
    if (POPUNDER_SRC) {
      let fired = false;
      const arm = () => {
        if (fired) return;
        fired = true;
        inject(POPUNDER_SRC);
        cleanupTriggers();
      };
      const onScroll = () => {
        if (window.scrollY > 400) arm();
      };
      const cleanupTriggers = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointerdown", arm);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointerdown", arm, { once: false });
      // Fallback so a passive reader is still monetised.
      timers.push(window.setTimeout(arm, 25000));

      return () => {
        cleanupTriggers();
        timers.forEach(clearTimeout);
        added.forEach((s) => s.remove());
      };
    }

    return () => {
      timers.forEach(clearTimeout);
      added.forEach((s) => s.remove());
    };
  }, []);

  return null;
}
