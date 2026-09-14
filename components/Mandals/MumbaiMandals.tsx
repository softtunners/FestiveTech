"use client";
import { useState } from "react";
import { MUMBAI_TOP_MANDALS, CROWD_COLORS, CROWD_WAIT, Mandal } from "@/lib/mandals";

export default function MumbaiMandals() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mapId, setMapId] = useState<string | null>(null);

  const activeCard = MUMBAI_TOP_MANDALS.find((m) => m.id === activeId) ?? null;

  const openMap = (m: Mandal, e: React.MouseEvent) => {
    e.stopPropagation();
    setMapId(mapId === m.id ? null : m.id);
  };

  return (
    <section className="mandals-section section" id="mandals-section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="hero-eyebrow" style={{ justifyContent: "center", marginBottom: 12 }}>
            <MapPinIcon />
            <span>Ganesh Chaturthi Mumbai</span>
          </div>
          <h2 className="section-title">Top Ganpati Mandals to Visit</h2>
          <p className="section-sub" style={{ maxWidth: 620, margin: "0 auto" }}>
            Mumbai comes alive during Ganesh Chaturthi. Here are the most famous Ganpati mandals
            with maps, routes, and insider tips for your darshan.
          </p>

          {/* Route Planner CTA */}
          <a
            href="https://www.google.com/maps/d/viewer?mid=1nRVw6uG3-La7lV0PcHFi0b7m8n8&ll=19.0,72.84&z=13"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn btn-share"
            style={{ display: "inline-flex", marginTop: 18, padding: "12px 28px", borderRadius: 9999 }}
          >
            <RouteIcon />
            Plan My Mandal Route on Google Maps
          </a>
        </div>

        {/* Map Embed — Google MyMaps of the Lalbaug belt */}
        <div className="mandal-fullmap glass-card" style={{ padding: 0, overflow: "hidden", marginBottom: 36, borderRadius: 20 }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "40%", minHeight: 280 }}>
            <iframe
              title="Mumbai Top Ganpati Mandals Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30156.47!2d72.82!3d19.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf26f4417a43%3A0x9d1c4de3e92e7b6f!2sLalbaugcha%20Raja!5e0!3m2!1sen!2sin!4v1694678400000!5m2!1sen!2sin"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div style={{ padding: "12px 20px", background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", display: "flex", alignItems: "center", gap: 8 }}>
            <MapPinIcon />
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", fontWeight: 700, color: "var(--brown-deep)" }}>
              Interactive Map — Lalbaug Ganpati Belt, Mumbai
            </span>
            <a href="https://maps.google.com/?q=Lalbaugcha+Raja+Mumbai" target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: "0.82rem", color: "var(--bhagwa-deep)", fontWeight: 700, textDecoration: "none" }}>
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mandals-grid">
          {MUMBAI_TOP_MANDALS.map((m) => {
            const isOpen = activeId === m.id;
            const crowdColor = CROWD_COLORS[m.crowdLevel];
            return (
              <div
                key={m.id}
                className={`mandal-card glass-card ${isOpen ? "mandal-card--open" : ""}`}
                style={{ cursor: "pointer", padding: 0, overflow: "hidden" }}
              >
                {/* Card Header */}
                <div
                  className="mandal-card-header"
                  style={{ background: m.color, padding: "18px 22px" }}
                  onClick={() => setActiveId(isOpen ? null : m.id)}
                  role="button"
                  aria-expanded={isOpen}
                  aria-controls={`mandal-detail-${m.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveId(isOpen ? null : m.id)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span className="mandal-rank">#{m.rank}</span>
                        <span style={{ background: crowdColor, color: "#fff", fontSize: "0.72rem", fontWeight: 700, padding: "2px 10px", borderRadius: 9999 }}>
                          {m.crowdLevel}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.1rem,2.5vw,1.35rem)", fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                        {m.name}
                      </h3>
                      <p style={{ fontFamily: "var(--font-dev)", fontSize: "1rem", color: "rgba(254,243,199,0.85)" }}>
                        {m.marathiName}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0, marginTop: 4 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                        <ChevronIcon />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <span className="mandal-tag">
                      <PinIcon /> {m.area}
                    </span>
                    <span className="mandal-tag">
                      <TrainIcon /> {m.nearbyStation}
                    </span>
                  </div>
                </div>

                {/* Quick Action Bar */}
                <div style={{ display: "flex", borderBottom: "1px solid rgba(217,154,43,0.15)" }}>
                  <a
                    href={m.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mandal-action-btn"
                    aria-label={`Get directions to ${m.name}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RouteIcon />
                    Directions
                  </a>
                  <button
                    className="mandal-action-btn"
                    onClick={(e) => openMap(m, e)}
                    aria-label={`${mapId === m.id ? "Hide" : "Show"} map for ${m.name}`}
                  >
                    <MapIcon />
                    {mapId === m.id ? "Hide Map" : "Show Map"}
                  </button>
                  <a
                    href={m.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mandal-action-btn"
                    aria-label={`Open ${m.name} in Google Maps`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalIcon />
                    Google Maps
                  </a>
                </div>

                {/* Inline Map Embed */}
                {mapId === m.id && (
                  <div style={{ width: "100%", height: 260, overflow: "hidden" }}>
                    <iframe
                      title={`Map of ${m.name}`}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-dummykey&q=${encodeURIComponent(m.address)}`}
                      width="100%"
                      height="260"
                      style={{ border: "none", display: "block" }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Expandable Detail */}
                <div
                  id={`mandal-detail-${m.id}`}
                  style={{
                    maxHeight: isOpen ? "600px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.45s cubic-bezier(0.25,0.8,0.25,1)",
                  }}
                >
                  <div style={{ padding: "20px 22px 22px" }}>
                    <p style={{ fontSize: "0.97rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 18 }}>
                      {m.description}
                    </p>

                    <div className="mandal-info-grid">
                      <div className="mandal-info-item">
                        <span className="mandal-info-label">Established</span>
                        <span className="mandal-info-value">{m.established}</span>
                      </div>
                      <div className="mandal-info-item">
                        <span className="mandal-info-label">Festival Days</span>
                        <span className="mandal-info-value">{m.durationDays} days</span>
                      </div>
                      <div className="mandal-info-item">
                        <span className="mandal-info-label">Avg. Wait Time</span>
                        <span className="mandal-info-value" style={{ color: crowdColor, fontWeight: 800 }}>
                          {CROWD_WAIT[m.crowdLevel]}
                        </span>
                      </div>
                      <div className="mandal-info-item">
                        <span className="mandal-info-label">Best Time</span>
                        <span className="mandal-info-value">{m.bestTimeToVisit}</span>
                      </div>
                    </div>

                    <div style={{ background: "#FEF9F0", border: "1px solid var(--gold)", borderRadius: 12, padding: "14px 16px", marginTop: 16 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--bhagwa-deep)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        Famous For
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>{m.famousFor}</p>
                    </div>

                    <div style={{ background: "#FFF7ED", border: "1px solid rgba(217,154,43,0.3)", borderRadius: 12, padding: "14px 16px", marginTop: 12 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--brown-deep)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        Insider Tip
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{m.tips}</p>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                      <a
                        href={m.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn btn-wa"
                        style={{ flex: 1, minWidth: 160, justifyContent: "center", fontSize: "0.95rem", minHeight: 46 }}
                      >
                        <RouteIcon /> Get Directions
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Visit ${m.name} this Ganesh Chaturthi!\n\nAddress: ${m.address}\nBest time: ${m.bestTimeToVisit}\n\nGet directions: ${m.directionsUrl}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn btn-share"
                        style={{ flex: 1, minWidth: 160, justifyContent: "center", fontSize: "0.95rem", minHeight: 46 }}
                        aria-label={`Share ${m.name} location on WhatsApp`}
                      >
                        <WhatsAppIcon /> Share Location
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trail Suggestions */}
        <div className="glass-card" style={{ marginTop: 36, textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.4rem", color: "var(--brown-deep)", marginBottom: 8 }}>
            Recommended Darshan Trails
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Plan your Ganesh Chaturthi visit efficiently with these curated routes</p>
          <div className="trails-grid">
            {[
              {
                name: "The Lalbaug Trail",
                desc: "Lalbaugcha Raja → Ganesh Galli → Tejukayacha Raja → Chinchpoklicha Chintamani",
                duration: "5–8 hrs (excluding wait)",
                transport: "Walk + Auto",
                icon: "🚶",
                color: "#B45309",
              },
              {
                name: "The South Mumbai Circuit",
                desc: "Siddhivinayak → GSB Seva Mandal → Keshavji Naik Chawl",
                duration: "4–6 hrs (excluding wait)",
                transport: "Local Train + Walk",
                icon: "🚆",
                color: "#D97706",
              },
              {
                name: "The Celebrity Route",
                desc: "Andhericha Raja → Siddhivinayak → Lalbaugcha Raja",
                duration: "Full day trip",
                transport: "Taxi / Cab",
                icon: "🚗",
                color: "#92400E",
              },
            ].map((trail) => (
              <div
                key={trail.name}
                style={{
                  background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
                  border: `2px solid ${trail.color}30`,
                  borderLeft: `4px solid ${trail.color}`,
                  borderRadius: 16, padding: "20px 18px", textAlign: "left",
                }}
              >
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.05rem", color: "var(--brown-deep)", marginBottom: 8 }}>
                  {trail.name}
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.6 }}>{trail.desc}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: trail.color }}>
                    Duration: {trail.duration}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{trail.transport}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Icons
function MapPinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bhagwa)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function RouteIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>;
}
function MapIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
}
function ExternalIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
}
function ChevronIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
}
function PinIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(254,243,199,0.8)" stroke="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg>;
}
function TrainIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(254,243,199,0.8)" strokeWidth="2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/></svg>;
}
function WhatsAppIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>;
}
