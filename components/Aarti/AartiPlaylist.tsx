"use client";

import { AARTI_PLAYLIST, AartiTrack } from "@/lib/aarti";
import { analytics } from "@/lib/analytics";
import { PlayIcon } from "@/components/icons";

export default function AartiPlaylist() {
  const url = (t: AartiTrack) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(t.searchQuery)}`;

  return (
    <section id="aarti" className="section" style={{ scrollMarginTop: 80 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">आरती</p>
          <h2 className="display section-title">आरती और भजन सुनें</h2>
          <p className="lede section-lede">किसी पर भी दबाएं — YouTube पर चल जाएगी।</p>
        </div>

        <div className="tracks">
          {AARTI_PLAYLIST.map((t) => (
            <a
              key={t.id}
              href={url(t)}
              target="_blank"
              rel="noopener noreferrer"
              className="track"
              onClick={() => analytics.aartiOpened(t.title)}
              aria-label={`${t.title} — ${t.artist} — YouTube पर सुनें`}
            >
              <span className="track-play" aria-hidden="true"><PlayIcon /></span>
              <span className="track-info">
                <span className="track-title" style={{ display: "block" }}>{t.title}</span>
                <span className="track-artist" style={{ display: "block" }}>{t.artist}</span>
              </span>
              <span className="track-dur">{t.duration}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
