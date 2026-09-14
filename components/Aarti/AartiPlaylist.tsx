"use client";

import { useState } from "react";
import { AARTI_PLAYLIST, AartiTrack } from "@/lib/aarti";
import { analytics } from "@/lib/analytics";
import { MusicIcon, PlayIcon, YouTubeIcon, TempleIcon } from "@/components/icons";

export default function AartiPlaylist() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const current = AARTI_PLAYLIST.find((t) => t.id === activeId) ?? null;

  const url = (t: AartiTrack) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(t.searchQuery)}`;

  return (
    <section id="aarti" className="section section--paper" style={{ scrollMarginTop: 78 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--purple">
            <span style={{ width: 18, height: 18, display: "inline-block" }}><MusicIcon /></span>
            आरती
          </span>
          <h2 className="section-title">आरती और भजन सुनें</h2>
          <p className="section-sub">हरे बटन ▶ पर दबाएं — YouTube पर चल जाएगी।</p>
        </div>

        <div className="aarti-wrap">
          <div className="aarti-now">
            <span style={{ width: 56, height: 56, display: "inline-block" }}><TempleIcon /></span>
            {current ? (
              <>
                <p className="aarti-now-title">{current.title}</p>
                <p className="aarti-now-artist">{current.artist}</p>
                <a
                  href={url(current)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ background: "#FF0000", color: "#fff", marginTop: 18, boxShadow: "0 5px 0 #A80000" }}
                  onClick={() => analytics.aartiOpened(current.title)}
                >
                  <YouTubeIcon /> YouTube पर सुनें
                </a>
              </>
            ) : (
              <>
                <p className="aarti-now-title">कोई आरती चुनें</p>
                <p className="aarti-now-artist">दाईं तरफ़ की सूची से</p>
              </>
            )}
          </div>

          <div className="tracks">
            {AARTI_PLAYLIST.map((t) => (
              <a
                key={t.id}
                href={url(t)}
                target="_blank"
                rel="noopener noreferrer"
                className={`track ${activeId === t.id ? "on" : ""}`}
                onClick={() => { setActiveId(t.id); analytics.aartiOpened(t.title); }}
                aria-label={`${t.title} — ${t.artist} — YouTube पर सुनें`}
              >
                <span className="track-play" aria-hidden="true"><PlayIcon /></span>
                <span className="track-info">
                  <span className="track-title" style={{ display: "block" }}>{t.title}</span>
                  <span className="track-artist" style={{ display: "block" }}>{t.artist}</span>
                </span>
                <span className="bars" aria-hidden="true"><i /><i /><i /></span>
                <span className="track-dur">{t.duration}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
