"use client";
import { useState } from "react";
import { AARTI_PLAYLIST, AartiTrack } from "@/lib/aarti";

export default function AartiPlaylist() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const currentTrack = AARTI_PLAYLIST.find((t) => t.id === activeId) ?? null;

  const handlePlay = (track: AartiTrack) => {
    if (activeId === track.id) {
      setActiveId(null);
    } else {
      setActiveId(track.id);
    }
  };

  const searchUrl = (track: AartiTrack) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(track.searchQuery)}`;

  return (
    <section className="aarti-section section" id="aarti-section">
      <div className="container">
        <div className="section-header">
          <div className="hero-eyebrow" style={{ justifyContent: "center", marginBottom: 12 }}>
            <MusicIcon />
            <span>Ganesh Aarti Playlist</span>
          </div>
          <h2 className="section-title">Listen to Sacred Aarties</h2>
          <p className="section-sub">
            Select any aarti below to open it on YouTube.
            {currentTrack && <> &nbsp;Now viewing: <strong style={{ color: "var(--bhagwa-deep)" }}>{currentTrack.title}</strong></>}
          </p>
        </div>

        <div className="aarti-player-wrap">
          {/* Intro / Now-playing panel */}
          <div className="aarti-intro-panel">
            {currentTrack ? (
              <>
                <div style={{ fontSize: 52, marginBottom: 12, lineHeight: 1 }}>
                  <TempleIcon size={56} />
                </div>
                <div style={{ fontFamily: "var(--font-dev)", fontSize: "1.2rem", color: "rgba(253,230,138,0.65)", marginBottom: 8 }}>
                  Now Playing
                </div>
                <div className="aarti-now-playing-title">{currentTrack.title}</div>
                <div className="aarti-now-playing-artist">{currentTrack.artist}</div>
                <p style={{ fontSize: "0.88rem", color: "rgba(253,230,138,0.5)", marginTop: 10, lineHeight: 1.6, maxWidth: 320 }}>
                  {currentTrack.description}
                </p>
                <a
                  href={searchUrl(currentTrack)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: 22, display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#FF0000", color: "#fff", padding: "11px 22px",
                    borderRadius: 12, fontFamily: "var(--font-heading)", fontWeight: 700,
                    fontSize: "0.96rem", textDecoration: "none",
                    boxShadow: "0 4px 0 rgba(140,0,0,0.4), 0 8px 18px rgba(255,0,0,0.22)",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
                >
                  <YouTubeIcon />
                  Open on YouTube
                </a>
              </>
            ) : (
              <>
                <TempleIcon size={56} />
                <div style={{ fontFamily: "var(--font-dev)", fontSize: "1.4rem", color: "rgba(253,230,138,0.75)", marginTop: 18 }}>
                  Ganesh Aarti Playlist
                </div>
                <p style={{ fontSize: "0.88rem", color: "rgba(253,230,138,0.45)", marginTop: 8, maxWidth: 260 }}>
                  Select any aarti from the list to play on YouTube
                </p>
              </>
            )}
          </div>

          {/* Playlist list */}
          <div className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <MusicIcon />
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem", color: "var(--brown-deep)" }}>
                {AARTI_PLAYLIST.length} Sacred Aarties
              </span>
            </div>
            <div className="playlist-list">
              {AARTI_PLAYLIST.map((track, i) => {
                const isPlaying = activeId === track.id;
                return (
                  <a
                    key={track.id}
                    href={searchUrl(track)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`playlist-item ${isPlaying ? "playing" : ""}`}
                    onClick={() => handlePlay(track)}
                    aria-label={`Play ${track.title} by ${track.artist} on YouTube`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="playlist-num">{i + 1}</div>
                    <div className="playlist-info">
                      <div className="playlist-title">{track.title}</div>
                      <div className="playlist-artist">{track.artist}</div>
                    </div>
                    <div className="now-playing-bars" aria-hidden="true">
                      <div className="bar" />
                      <div className="bar" />
                      <div className="bar" />
                    </div>
                    <span className="playlist-dur">{track.duration}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MusicIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bhagwa)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
}
function TempleIcon({ size = 48 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(253,230,138,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V11a3 3 0 0 1 6 0v10"/></svg>;
}
function YouTubeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
}
