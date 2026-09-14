"use client";
import { useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import TopNav from "@/components/Nav/TopNav";
import HeroSection from "@/components/Hero/HeroSection";
import AdBanner from "@/components/Ads/AdBanner";
import Footer from "@/components/Footer/Footer";

const ParticleCanvas = dynamic(() => import("@/components/Particles/ParticleCanvas"), { ssr: false });
const BlessingExperience = dynamic(() => import("@/components/Blessing/BlessingExperience"), { ssr: false });
const AartiPlaylist = dynamic(() => import("@/components/Aarti/AartiPlaylist"), { ssr: false });
const MumbaiMandals = dynamic(() => import("@/components/Mandals/MumbaiMandals"), { ssr: false });

function HomeInner() {
  const searchParams = useSearchParams();
  const fromName = searchParams.get("from") ?? "";
  const toName = searchParams.get("to") ?? "";
  const nameParam = searchParams.get("name") ?? "";
  const initialName = toName || nameParam;

  const personalizationRef = useRef<HTMLDivElement>(null);
  const aartiRef = useRef<HTMLDivElement>(null);
  const mandalsRef = useRef<HTMLDivElement>(null);

  const scrollToPersonalization = () =>
    personalizationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToAarti = () =>
    aartiRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToMandals = () =>
    mandalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <ParticleCanvas />
      <TopNav onScrollToAarti={scrollToAarti} onScrollToMandals={scrollToMandals} />

      {/* Referral banner */}
      {fromName && (
        <div className="container">
          <div className="referral-banner" role="status" aria-live="polite">
            <strong>{fromName}</strong> has sent you a sacred Ganesh Chaturthi blessing!
          </div>
        </div>
      )}

      {/* Hero */}
      <HeroSection onReceiveBlessing={scrollToPersonalization} onViewMandals={scrollToMandals} />

      {/* Ad 1 */}
      <div className="container">
        <AdBanner size="leaderboard" />
      </div>
      <hr className="gold-divider" />

      {/* Personalization + Card + Share */}
      <div ref={personalizationRef}>
        <Suspense fallback={<div style={{ padding: 60, textAlign: "center", fontFamily: "var(--font-heading)", color: "var(--text-muted)" }}>Loading blessings...</div>}>
          <BlessingExperience initialName={initialName} fromName={fromName} />
        </Suspense>
      </div>

      {/* Ad 2 */}
      <div className="container">
        <AdBanner size="rectangle" />
      </div>
      <hr className="gold-divider" />

      {/* Mumbai Top Mandals */}
      <div ref={mandalsRef}>
        <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading Mandals...</div>}>
          <MumbaiMandals />
        </Suspense>
      </div>

      <hr className="gold-divider" />

      {/* Aarti Playlist */}
      <div ref={aartiRef}>
        <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading Aarti Playlist...</div>}>
          <AartiPlaylist />
        </Suspense>
      </div>

      {/* Ad 3 */}
      <div className="container">
        <AdBanner size="leaderboard" label="Sponsored" />
      </div>

      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
