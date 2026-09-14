"use client";
import Image from "next/image";

interface HeroSectionProps {
  onReceiveBlessing: () => void;
  onViewMandals: () => void;
}

export default function HeroSection({ onReceiveBlessing, onViewMandals }: HeroSectionProps) {
  return (
    <section className="hero" id="hero-section">
      <div className="container hero-grid">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span style={{ fontFamily: "var(--font-dev)", fontSize: "1.1rem" }}>ॐ</span>
            <span>श्री गणेशाय नमः</span>
          </div>
          <h1 className="hero-title">गणपती बाप्पा मोरया</h1>
          <h2 className="hero-subtitle">पावन गणेश उत्सव<br />शुभकामनाएं</h2>
          <p className="hero-desc">
            भगवान गणेश आपके जीवन के सभी संकट हरें और आपके परिवार में सुख, शांति, समृद्धि तथा उत्तम स्वास्थ्य का वास करें।
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <button
              className="cta-primary"
              onClick={onReceiveBlessing}
              aria-label="Scroll to create and download card"
            >
              <HandsIcon />
              अपना पावन कार्ड बनाएं
            </button>
            <button
              onClick={onViewMandals}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                border: "2px solid var(--gold)",
                color: "var(--brown-deep)",
                padding: "10px 26px",
                borderRadius: 9999,
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.98rem",
                cursor: "pointer",
                transition: "all 0.25s",
                maxWidth: 400,
                width: "100%",
                justifyContent: "center",
              }}
              aria-label="View top Ganpati mandals to visit in Mumbai"
            >
              <MapPinIcon />
              मुंबई के प्रमुख गणपति मंडल दर्शन
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="idol-wrapper">
            <div className="divine-glow" aria-hidden="true" />
            <div className="idol-img-box">
              <Image
                src="/images/ganesha_cinematic.jpg"
                alt="Lord Ganesha idol decorated with marigold garlands, diyas and temple lighting during Ganesh Chaturthi"
                fill
                priority
                sizes="(max-width: 840px) 90vw, 40vw"
                className="idol-img"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="diya-left" aria-hidden="true"><DiyaSvg /></div>
            <div className="diya-right" aria-hidden="true"><DiyaSvg /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HandsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
    </svg>
  );
}
function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function DiyaSvg() {
  return (
    <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="16" rx="10" ry="14" fill="rgba(232,106,23,0.35)" />
      <path d="M24 4 C18 12 16 18 24 22 C32 18 30 12 24 4Z" fill="url(#flame2)" />
      <ellipse cx="24" cy="40" rx="18" ry="8" fill="#D97706" />
      <ellipse cx="24" cy="38" rx="16" ry="6" fill="#B45309" />
      <defs>
        <radialGradient id="flame2" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="40%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
      </defs>
    </svg>
  );
}
