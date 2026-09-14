"use client";

import Image from "next/image";
import { analytics } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/icons";

interface HeroSectionProps {
  onShareWhatsApp: () => void;
}

/**
 * The photograph is the design.
 *
 * No gold arch, no garland, no diyas, no glow, no particles, no tilt — every
 * one of those competed with the image instead of presenting it.
 */
export default function HeroSection({ onShareWhatsApp }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="container hero-grid">
        <div className="hero-text">
          <p className="eyebrow">श्री गणेशाय नमः</p>

          <h1 className="display hero-title">गणपती बाप्पा मोरया</h1>

          <p className="lede hero-lede">
            अपने नाम के साथ सुंदर कार्ड बनाएं और परिवार-दोस्तों को WhatsApp पर भेजें।
          </p>

          <button
            className="btn btn--wa btn--hero hero-cta"
            onClick={() => {
              analytics.ctaClicked("hero_whatsapp");
              onShareWhatsApp();
            }}
          >
            <WhatsAppIcon />
            WhatsApp पर भेजें
          </button>

          <p className="hero-note">मुफ़्त · लॉगिन नहीं · 10 सेकंड में</p>
        </div>

        <div className="hero-visual">
          <div className="hero-photo">
            <Image
              src="/images/ganesha_cinematic.jpg"
              alt="गेंदे की मालाओं और दीपों से सजी भगवान गणेश की मूर्ति"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 900px) 100vw, 520px"
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
