"use client";

import Link from "next/link";
import { analytics } from "@/lib/analytics";
import { CardIcon, MapPinIcon, MusicIcon, WhatsAppIcon } from "@/components/icons";

interface TopNavProps {
  onCard: () => void;
  onMandals: () => void;
  onAarti: () => void;
  onShareWhatsApp: () => void;
}

export default function TopNav({ onCard, onMandals, onAarti, onShareWhatsApp }: TopNavProps) {
  return (
    <header className="top-nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Bappa Blessings — होम">
          <BrandMark />
          <span>बाप्पा <span className="accent">आशीर्वाद</span></span>
        </Link>

        <nav className="nav-actions" aria-label="मुख्य मेन्यू">
          <button className="nav-btn" onClick={() => { analytics.ctaClicked("nav_card"); onCard(); }}>
            <CardIcon />
            <span>कार्ड</span>
          </button>
          <button className="nav-btn" onClick={() => { analytics.ctaClicked("nav_mandals"); onMandals(); }}>
            <MapPinIcon />
            <span>मंडल</span>
          </button>
          <button className="nav-btn" onClick={() => { analytics.ctaClicked("nav_aarti"); onAarti(); }}>
            <MusicIcon />
            <span>आरती</span>
          </button>
          <button
            className="nav-btn nav-btn--wa"
            onClick={() => { analytics.ctaClicked("nav_whatsapp"); onShareWhatsApp(); }}
          >
            <WhatsAppIcon />
            <span>भेजें</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <svg className="brand-icon" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFB300" />
          <stop offset="55%" stopColor="#F4741F" />
          <stop offset="100%" stopColor="#D81B60" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="13" fill="url(#bm)" />
      <text x="50%" y="53%" dominantBaseline="central" textAnchor="middle" fontFamily="serif" fontSize="25" fill="#FFFBF4">ॐ</text>
    </svg>
  );
}
