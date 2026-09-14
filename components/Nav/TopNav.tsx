"use client";

import Link from "next/link";
import { analytics } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/icons";

interface TopNavProps {
  onCard: () => void;
  onMandals: () => void;
  onAarti: () => void;
  onShareWhatsApp: () => void;
}

export default function TopNav({ onCard, onMandals, onAarti, onShareWhatsApp }: TopNavProps) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="बाप्पा आशीर्वाद — होम">
          <span className="brand-mark" aria-hidden="true">ॐ</span>
          बाप्पा आशीर्वाद
        </Link>

        <nav className="nav-links" aria-label="मुख्य मेन्यू">
          <button className="nav-link" onClick={() => { analytics.ctaClicked("nav_card"); onCard(); }}>
            कार्ड
          </button>
          <button className="nav-link" onClick={() => { analytics.ctaClicked("nav_mandals"); onMandals(); }}>
            मंडल
          </button>
          <button className="nav-link" onClick={() => { analytics.ctaClicked("nav_aarti"); onAarti(); }}>
            आरती
          </button>
          <button
            className="btn btn--wa"
            style={{ minHeight: 44, padding: "10px 18px", fontSize: "0.9375rem", marginLeft: 6 }}
            onClick={() => { analytics.ctaClicked("nav_whatsapp"); onShareWhatsApp(); }}
          >
            <WhatsAppIcon />
            भेजें
          </button>
        </nav>
      </div>
    </header>
  );
}
