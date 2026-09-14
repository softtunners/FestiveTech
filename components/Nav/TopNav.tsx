"use client";
import Link from "next/link";

interface TopNavProps {
  onScrollToAarti: () => void;
  onScrollToMandals: () => void;
}

export default function TopNav({ onScrollToAarti, onScrollToMandals }: TopNavProps) {
  return (
    <header className="top-nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Bappa Blessings Home">
          <OmIcon className="brand-icon" />
          <span>Bappa <span className="accent">Blessings</span></span>
        </Link>
        <nav className="nav-actions" aria-label="Site navigation">
          <button className="pill-btn" onClick={onScrollToMandals} aria-label="View top Ganpati mandals in Mumbai">
            <MapPinIcon />
            <span className="nav-label">Top Mandals</span>
          </button>
          <button className="pill-btn" onClick={onScrollToAarti} aria-label="Open Aarti playlist">
            <MusicIcon />
            <span className="nav-label">Aarti Playlist</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function OmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#E86A17" />
      <text x="50%" y="73%" dominantBaseline="middle" textAnchor="middle" fontFamily="serif" fontSize="18" fill="#FFFBEB">ॐ</text>
    </svg>
  );
}
function MapPinIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function MusicIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
}
