"use client";

import { useMemo, useState } from "react";
import { MUMBAI_TOP_MANDALS, CROWD_COLORS, CROWD_WAIT, Mandal } from "@/lib/mandals";
import { analytics } from "@/lib/analytics";
import {
  MapPinIcon, RouteIcon, MapIcon, ChevronIcon, TrainIcon, WhatsAppIcon,
} from "@/components/icons";

type CrowdLevel = Mandal["crowdLevel"];
const LEVELS: CrowdLevel[] = ["Extreme", "Very High", "High", "Moderate"];

/** Crowd labels in words people actually use, not analytics jargon. */
const CROWD_HI: Record<CrowdLevel, string> = {
  Extreme: "बहुत भारी भीड़",
  "Very High": "भारी भीड़",
  High: "ठीक-ठाक भीड़",
  Moderate: "कम भीड़",
};

/**
 * Keyless Google Maps embed — `output=embed` needs no API key and no
 * billing account, unlike the `embed/v1` form this previously used with a
 * placeholder key that rendered an error page every time.
 */
const embed = (q: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;

export default function MumbaiMandals() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mapId, setMapId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<CrowdLevel | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MUMBAI_TOP_MANDALS.filter((m) => {
      if (level && m.crowdLevel !== level) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.marathiName.includes(query.trim()) ||
        m.area.toLowerCase().includes(q) ||
        m.nearbyStation.toLowerCase().includes(q)
      );
    });
  }, [query, level]);

  return (
    <section id="mandals" className="section section--tint" style={{ scrollMarginTop: 78 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--peacock">
            <span style={{ width: 18, height: 18, display: "inline-block" }}><MapPinIcon /></span>
            मुंबई
          </span>
          <h2 className="section-title">मुंबई के बड़े गणपति</h2>
          <p className="section-sub">नक्शा, रास्ता और कितनी भीड़ है — सब एक जगह।</p>
        </div>

        {/* Overview map */}
        <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "var(--sh-2)", marginBottom: 22, border: "2px solid var(--paper-3)" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", minHeight: 240 }}>
            <iframe
              title="मुंबई गणपति मंडल नक्शा"
              src={embed("Lalbaugcha Raja, Lalbaug, Mumbai")}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="toolbar">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 मंडल या इलाका खोजें…"
            aria-label="मंडल खोजें"
          />
          <div className="chips" role="group" aria-label="भीड़ से छाँटें">
            <button type="button" className="chip-btn" aria-pressed={level === null} onClick={() => setLevel(null)}>
              सब
            </button>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                className="chip-btn"
                aria-pressed={level === l}
                onClick={() => setLevel(level === l ? null : l)}
              >
                {CROWD_HI[l]}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--ink-3)", padding: "32px 0" }}>
            कुछ नहीं मिला। दूसरा नाम आज़माएं।
          </p>
        )}

        <div className="mandal-grid">
          {visible.map((m) => {
            const open = openId === m.id;
            const crowd = CROWD_COLORS[m.crowdLevel];
            return (
              <article key={m.id} className="mandal">
                <button
                  type="button"
                  className="mandal-top"
                  style={{ background: m.color }}
                  aria-expanded={open}
                  aria-controls={`d-${m.id}`}
                  onClick={() => {
                    const opening = !open;
                    setOpenId(opening ? m.id : null);
                    if (opening) analytics.mandalOpened(m.name, m.rank);
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <span className="mandal-rank">#{m.rank}</span>
                        <span className="crowd" style={{ background: crowd }}>{CROWD_HI[m.crowdLevel]}</span>
                      </div>
                      <h3 className="mandal-name">{m.name}</h3>
                      <p className="mandal-mar">{m.marathiName}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0, width: 38, height: 38, borderRadius: "50%",
                        background: "rgba(0,0,0,0.3)", border: "1.5px solid rgba(255,255,255,0.35)",
                        display: "grid", placeItems: "center", color: "#fff",
                        transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s",
                      }}
                    >
                      <span style={{ width: 20, height: 20 }}><ChevronIcon /></span>
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <span className="chip"><span style={{ width: 12, height: 12 }}><MapPinIcon /></span>{m.area}</span>
                    <span className="chip"><span style={{ width: 12, height: 12 }}><TrainIcon /></span>{m.nearbyStation}</span>
                  </div>
                </button>

                <div className="mandal-acts">
                  <a
                    href={m.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mandal-act"
                    onClick={() => analytics.mandalDirections(m.name)}
                  >
                    <RouteIcon />
                    रास्ता
                  </a>
                  <button
                    type="button"
                    className="mandal-act"
                    aria-expanded={mapId === m.id}
                    onClick={() => setMapId(mapId === m.id ? null : m.id)}
                  >
                    <MapIcon />
                    नक्शा
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🙏 ${m.name} (${m.marathiName}) के दर्शन करें!\n\n📍 ${m.address}\n🕑 अच्छा समय: ${m.bestTimeToVisit}\n\n${m.directionsUrl}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mandal-act"
                    style={{ color: "var(--wa-d)" }}
                    onClick={() => analytics.cardShared("whatsapp", "mandal")}
                  >
                    <WhatsAppIcon />
                    भेजें
                  </a>
                </div>

                {mapId === m.id && (
                  <iframe
                    title={`${m.name} नक्शा`}
                    src={embed(`${m.name}, ${m.address}`)}
                    style={{ width: "100%", height: 240, border: "none", display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}

                <div id={`d-${m.id}`} hidden={!open} style={{ padding: "18px" }}>
                  <p style={{ color: "var(--ink-2)", marginBottom: 16, lineHeight: 1.7 }}>{m.description}</p>

                  <div className="facts">
                    <div className="fact">
                      <div className="fact-k">शुरू हुआ</div>
                      <div className="fact-v">{m.established}</div>
                    </div>
                    <div className="fact">
                      <div className="fact-k">कितने दिन</div>
                      <div className="fact-v">{m.durationDays} दिन</div>
                    </div>
                    <div className="fact">
                      <div className="fact-k">कितना इंतज़ार</div>
                      <div className="fact-v" style={{ color: crowd }}>{CROWD_WAIT[m.crowdLevel]}</div>
                    </div>
                    <div className="fact">
                      <div className="fact-k">अच्छा समय</div>
                      <div className="fact-v">{m.bestTimeToVisit}</div>
                    </div>
                  </div>

                  <div className="note">
                    <div className="note-k">किसलिए मशहूर</div>
                    <div className="note-v">{m.famousFor}</div>
                  </div>
                  <div className="note note--tip">
                    <div className="note-k">काम की बात</div>
                    <div className="note-v">{m.tips}</div>
                  </div>

                  <a
                    href={m.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--save btn--block"
                    style={{ marginTop: 16 }}
                    onClick={() => analytics.mandalDirections(m.name)}
                  >
                    <RouteIcon /> रास्ता देखें
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <h3 style={{ fontFamily: "var(--font-dev)", fontSize: "1.6rem", textAlign: "center", margin: "38px 0 6px", color: "var(--ink)" }}>
          एक दिन में कई दर्शन
        </h3>
        <p style={{ textAlign: "center", color: "var(--ink-3)", marginBottom: 18 }}>
          ये रास्ते चुनें, समय बचेगा
        </p>
        <div className="trails">
          {TRAILS.map((t) => (
            <div key={t.name} className="trail">
              <div style={{ fontFamily: "var(--font-dev)", fontSize: "1.2rem", marginBottom: 6 }}>
                <span aria-hidden="true" style={{ marginRight: 8 }}>{t.icon}</span>{t.name}
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--ink-2)", marginBottom: 10, lineHeight: 1.6 }}>{t.desc}</p>
              <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--peacock-d)" }}>⏱ {t.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TRAILS = [
  { name: "लालबाग रास्ता", desc: "लालबागचा राजा → गणेश गली → तेजुकायाचा राजा", duration: "5–8 घंटे", icon: "🚶" },
  { name: "साउथ मुंबई", desc: "सिद्धिविनायक → GSB सेवा मंडल → केशवजी नाईक चाळ", duration: "4–6 घंटे", icon: "🚆" },
  { name: "पूरा दिन", desc: "अंधेरीचा राजा → सिद्धिविनायक → लालबागचा राजा", duration: "पूरा दिन", icon: "🚗" },
];
