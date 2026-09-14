"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { analytics } from "@/lib/analytics";

/**
 * Hidden while the hero's own green button is on screen — two identical
 * green buttons competing for the same tap is what made the page confusing.
 */
export default function FloatingWhatsApp({ onShare }: { onShare: () => void }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      const id = requestAnimationFrame(() => setHidden(false));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([e]) => setHidden(e.isIntersecting && e.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 1] },
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
