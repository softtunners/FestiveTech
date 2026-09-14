"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";
import { WhatsAppIcon, CheckIcon } from "@/components/icons";
import ParticleCanvas from "@/components/Particles/ParticleCanvas";

interface HeroSectionProps {
  onShareWhatsApp: () => void;
}

export default function HeroSection({ onShareWhatsApp }: HeroSectionProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  /**
   * Depth for the shrine.
   *
   * The layers already sit at different translateZ values, so rotating the
   * single parent is enough to make them slide past each other — that
   * parallax between layers is what reads as 3D. Pointer on desktop,
   * scroll on touch, and nothing at all under prefers-reduced-motion.
   */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const set = (x: number, y: number) => {
      el.style.setProperty("--sx", `${x.toFixed(2)}deg`);
      el.style.setProperty("--sy", `${y.toFixed(2)}deg`);
    };

    const fine = window.matchMedia("(pointer: fine)").matches;

    if (fine) {
      const onMove = (e: PointerEvent) => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          set(clamp(dx) * 11, clamp(dy) * -8);
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(frame);
        set(0, 0);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    }

    // Touch: let the scroll position drive a gentle tilt instead.
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const progress = clamp((r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight);
        set(progress * 5, progress * -6);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <ParticleCanvas />

      <div className="container hero-grid">
        <div className="hero-text">
          <span className="hero-badge">
            <span style={{ fontFamily: "var(--font-dev)", fontSize: "1.15rem" }}>ॐ</span>
            श्री गणेशाय नमः
          </span>

          <h1 className="hero-title">गणपती बाप्पा मोरया</h1>
          <p className="hero-sub">सबको भेजें बाप्पा का आशीर्वाद</p>

          {/* The single most important control on the site. */}
          <button
            className="wa-hero-btn"
            onClick={() => {
              analytics.ctaClicked("hero_whatsapp");
              onShareWhatsApp();
            }}
          >
            <WhatsAppIcon />
            WhatsApp पर भेजें
          </button>

          <div className="hero-trust">
            <span><CheckIcon /> बिल्कुल मुफ़्त</span>
            <span><CheckIcon /> लॉगिन नहीं</span>
            <span><CheckIcon /> 10 सेकंड में</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="stage" ref={stageRef}>
            <div className="stage-inner">
              <Mandala />
              <Rays />
              <div className="stage-aura" aria-hidden="true" />

              <div className="stage-arch">
                <div className="stage-arch-inner">
                  <Image
                    src="/images/ganesha_cinematic.jpg"
                    alt="गेंदे की मालाओं और दीपों से सजी भगवान गणेश की मूर्ति"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 900px) 340px, 460px"
                    quality={88}
                    className="stage-img"
                  />
                </div>
              </div>

              <Garland />

              <p className="stage-plaque">
                <span aria-hidden="true">🪔</span> मंगलमूर्ती मोरया
              </p>

              <div className="stage-diya stage-diya--l" aria-hidden="true"><Diya /></div>
              <div className="stage-diya stage-diya--r" aria-hidden="true"><Diya /></div>
            </div>
          </div>
        </div>
      </div>

      {/* A real edge between the dark hero and the light page. */}
      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 90V44c180-28 360-40 540-24s360 56 540 40 300-40 360-52v82z" fill="#FFFBF4" />
      </svg>
    </section>
  );
}

function clamp(n: number) {
  return Math.max(-1, Math.min(1, n));
}

/** Slow-turning halo far behind the idol. */
function Mandala() {
  const petals = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg className="stage-mandala" viewBox="0 0 200 200" fill="none" aria-hidden="true">
      {petals.map((i) => (
        <ellipse
          key={i}
          cx="100"
          cy="34"
          rx="7"
          ry="26"
          fill="none"
          stroke="rgba(255,179,0,0.34)"
          strokeWidth="1"
          transform={`rotate(${(360 / petals.length) * i} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(216,27,96,0.3)" strokeWidth="1" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="rgba(255,179,0,0.22)" strokeWidth="1" strokeDasharray="4 7" />
    </svg>
  );
}

/** Sweeping shafts of temple light. */
function Rays() {
  const rays = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg className="stage-rays" viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="rayG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,238,190,0.5)" />
          <stop offset="100%" stopColor="rgba(255,238,190,0)" />
        </linearGradient>
      </defs>
      {rays.map((i) => (
        <polygon
          key={i}
          points="100,4 95,150 105,150"
          fill="url(#rayG)"
          transform={`rotate(${-46 + i * 9.2} 100 10)`}
          opacity={0.35 + (i % 3) * 0.2}
        />
      ))}
    </svg>
  );
}

/** Marigold torana that sways in front of the arch. */
function Garland() {
  const beads = Array.from({ length: 28 }, (_, i) => i);
  const at = (t: number) => ({
    x: (1 - t) ** 2 * 4 + 2 * (1 - t) * t * 200 + t ** 2 * 396,
    y: (1 - t) ** 2 * 12 + 2 * (1 - t) * t * 76 + t ** 2 * 12,
  });

  return (
    <svg className="stage-garland" viewBox="0 0 400 86" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="mA" cx="34%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE55C" />
          <stop offset="60%" stopColor="#FF8A00" />
          <stop offset="100%" stopColor="#C2410C" />
        </radialGradient>
        <radialGradient id="mB" cx="34%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="60%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#A15C09" />
        </radialGradient>
      </defs>

      <path d="M4 12 Q200 76 396 12" stroke="#8C4A0B" strokeWidth="3" fill="none" />

      {[0.18, 0.36, 0.5, 0.64, 0.82].map((t) => {
        const { x, y } = at(t);
        return <path key={t} d={`M${x} ${y + 4} q -7 13 0 24 q 7 -11 0 -24 z`} fill="#15803D" />;
      })}

      {beads.map((i) => {
        const { x, y } = at(i / (beads.length - 1));
        const r = 7.5 + (i % 3) * 1.1;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={i % 2 ? "url(#mB)" : "url(#mA)"} />
            <circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.26} fill="#FFFBEB" opacity="0.6" />
          </g>
        );
      })}
    </svg>
  );
}

/** Oil lamp with a flame that actually flickers. */
function Diya() {
  return (
    <svg viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="fl" cx="50%" cy="74%" r="58%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="38%" stopColor="#FFE55C" />
          <stop offset="100%" stopColor="#FF6A00" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="22" rx="15" ry="20" fill="rgba(255,200,60,0.22)" />
      <g className="flame">
        <path d="M30 4 C21 15 19 24 30 30 C41 24 39 15 30 4Z" fill="url(#fl)" />
        <path d="M30 14 C26 20 25 24 30 27 C35 24 34 20 30 14Z" fill="#FFFDE7" opacity="0.85" />
      </g>
      <ellipse cx="30" cy="52" rx="23" ry="10" fill="#E0A02F" />
      <ellipse cx="30" cy="49" rx="20" ry="7.5" fill="#A15C09" />
      <ellipse cx="30" cy="47" rx="13" ry="4" fill="#5C3208" />
    </svg>
  );
}
