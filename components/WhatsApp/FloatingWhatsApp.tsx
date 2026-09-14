"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { analytics } from "@/lib/analytics";

/**
 * A WhatsApp button that follows the visitor down the page.
 *
 * It hides itself while the hero's own big green button is on screen —
 * two identical green buttons competing for the same tap is exactly the
 * kind of thing that makes a page feel confusing.
 */
export default function FloatingWhatsApp({ onShare }: { onShare: () => void }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      // Nothing to hide behind — reveal on the next frame rather than
      // synchronously, which would cascade an extra render.
      const id = requestAnimationFrame(() => setHidden(false));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 1] },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <button
      className="wa-float"
      data-hidden={hidden}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      onClick={() => {
        analytics.ctaClicked("floating_whatsapp");
        onShare();
      }}
    >
      <WhatsAppIcon />
      भेजें
    </button>
  );
}
