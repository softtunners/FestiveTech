"use client";

import { useMemo, useState } from "react";
import { MUMBAI_TOP_MANDALS, CROWD_COLORS, CROWD_WAIT, Mandal } from "@/lib/mandals";
import { analytics } from "@/lib/analytics";
import { RouteIcon, MapIcon, WhatsAppIcon } from "@/components/icons";

type CrowdLevel = Mandal["crowdLevel"];
const LEVELS: CrowdLevel[] = ["Extreme", "Very High", "High", "Moderate"];

/** Plain words instead of analytics jargon. */
const CROWD_HI: Record<CrowdLevel, string> = {
  Extreme: "बहुत भारी भीड़",
  "Very High": "भारी भीड़",
  High: "ठीक-ठाक भीड़",
  Moderate: "कम भीड़",
};

/** Keyless embed — needs no API key, unlike the `embed/v1` form. */
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
    <section id="mandals" className="section section--alt" style={{ scrollMarginTop: 80 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">मुंबई</p>
          <h2 className="display section-title">मुंबई के बड़े गणपति</h2>
          <p className="lede section-lede">नक्शा, रास्ता और कितनी भीड़ है — सब एक जगह।</p>
        </div>

        <div className="map-wrap">
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 6", minHeight: 220 }}>
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
            placeholder="मंडल या इलाका खोजें"
            aria-label="मंडल खोजें"
          />
          <div className="filters" role="group" aria-label="भीड़ से छाँटें">
            <button type="button" className="filter" aria-pressed={level === null} onClick={() => setLevel(null)}>
              सब
            </button>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                className="filter"
                aria-pressed={level === l}
                onClick={() => setLevel(level === l ? null : l)}
              >
                {CROWD_HI[l]}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && (
          <p style={{ color: "var(--ink-3)", padding: "28px 0" }}>कुछ नहीं मिला। दूसरा नाम आज़माएं।</p>
        )}

        <div className="mandals">
          {visible.map((m) => {
            const open = openId === m.id;
            return (
              <article key={m.id} className="mandal">
                <button
                  type="button"
                  className="mandal-top"
                  aria-expanded={open}
                  aria-controls={`d-${m.id}`}
                  onClick={() => {
                    const opening = !open;
                    setOpenId(opening ? m.id : null);
                    if (opening) analytics.mandalOpened(m.name, m.rank);
                  }}
                >
                  <p className="mandal-rank">#{m.rank}</p>
                  <h3 className="display mandal-name">{m.marathiName}</h3>
                  <p className="mandal-where">{m.name} · {m.area}</p>
                  <p className="crowd">
                    <span className="crowd-dot" style={{ background: CROWD_COLORS[m.crowdLevel] }} />
                    {CROWD_HI[m.crowdLevel]} · {CROWD_WAIT[m.crowdLevel]}
                  </p>
                </button>

                <div className="mandal-acts">
                  <a
                    href={m.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mandal-act"
                    onClick={() => analytics.mandalDirections(m.name)}
                  >
                    <RouteIcon /> रास्ता
                  </a>
                  <button
                    type="button"
                    className="mandal-act"
                    aria-expanded={mapId === m.id}
                    onClick={() => setMapId(mapId === m.id ? null : m.id)}
                  >
                    <MapIcon /> नक्शा
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🙏 ${m.name} (${m.marathiName}) के दर्शन करें!\n\n${m.address}\nअच्छा समय: ${m.bestTimeToVisit}\n\n${m.directionsUrl}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mandal-act mandal-act--wa"
                    onClick={() => analytics.cardShared("whatsapp", "mandal")}
                  >
                    <WhatsAppIcon /> भेजें
                  </a>
                </div>

                {mapId === m.id && (
                  <iframe
                    title={`${m.name} नक्शा`}
                    src={embed(`${m.name}, ${m.address}`)}
                    style={{ width: "100%", height: 230, border: "none", borderTop: "1px solid var(--line)", display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}

                <div id={`d-${m.id}`} hidden={!open} className="mandal-detail">
                  <p style={{ color: "var(--ink-2)", fontSize: "0.9375rem", lineHeight: 1.7, marginTop: 18 }}>
                    {m.description}
                  </p>

                  <div className="facts">
                    <div className="fact">
                      <p className="fact-k">शुरू हुआ</p>
                      <p className="fact-v">{m.established}</p>
                    </div>
                    <div className="fact">
                      <p className="fact-k">कितने दिन</p>
                      <p className="fact-v">{m.durationDays} दिन</p>
                    </div>
                    <div className="fact">
                      <p className="fact-k">नज़दीकी स्टेशन</p>
                      <p className="fact-v">{m.nearbyStation}</p>
                    </div>
                    <div className="fact">
                      <p className="fact-k">अच्छा समय</p>
                      <p className="fact-v">{m.bestTimeToVisit}</p>
                    </div>
                  </div>

                  <div className="note">
                    <p className="note-k">किसलिए मशहूर</p>
                    <p className="note-v">{m.famousFor}</p>
                  </div>
                  <div className="note">
                    <p className="note-k">काम की बात</p>
                    <p className="note-v">{m.tips}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ marginTop: 56 }}>
          <h3 className="display" style={{ fontSize: "1.5rem", marginBottom: 6 }}>एक दिन में कई दर्शन</h3>
          <p style={{ color: "var(--ink-3)", marginBottom: 20 }}>ये रास्ते चुनें, समय बचेगा</p>
          <div className="trails">
            {TRAILS.map((t) => (
              <div key={t.name} className="trail">
                <p className="display trail-name">{t.name}</p>
                <p className="trail-desc">{t.desc}</p>
                <p className="trail-time">{t.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const TRAILS = [
  { name: "लालबाग रास्ता", desc: "लालबागचा राजा → गणेश गली → तेजुकायाचा राजा", duration: "5–8 घंटे" },
  { name: "साउथ मुंबई", desc: "सिद्धिविनायक → GSB सेवा मंडल → केशवजी नाईक चाळ", duration: "4–6 घंटे" },
  { name: "पूरा दिन", desc: "अंधेरीचा राजा → सिद्धिविनायक → लालबागचा राजा", duration: "पूरा दिन" },
];
