"use client";

import { useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import TopNav from "@/components/Nav/TopNav";
import HeroSection from "@/components/Hero/HeroSection";
import Choices from "@/components/Choices/Choices";
import Footer from "@/components/Footer/Footer";
import Reveal from "@/components/Reveal/Reveal";
import AdBanner from "@/components/Ads/AdBanner";
import NativeAd from "@/components/Ads/NativeAd";
import FloatingWhatsApp from "@/components/WhatsApp/FloatingWhatsApp";
import type { BlessingHandle } from "@/components/Blessing/BlessingExperience";
import { analytics } from "@/lib/analytics";

const BlessingExperience = dynamic(() => import("@/components/Blessing/BlessingExperience"), { ssr: false });
const AartiPlaylist = dynamic(() => import("@/components/Aarti/AartiPlaylist"), { ssr: false });
const MumbaiMandals = dynamic(() => import("@/components/Mandals/MumbaiMandals"), { ssr: false });

function Loading({ label }: { label: string }) {
  return <div style={{ padding: 56, textAlign: "center", color: "var(--ink-3)" }}>{label}</div>;
}

function HomeInner() {
  const params = useSearchParams();
  const fromName = params.get("from") ?? "";
  const initialName = params.get("to") ?? params.get("name") ?? "";

  const cardRef = useRef<HTMLDivElement>(null);
  const mandalsRef = useRef<HTMLDivElement>(null);
  const aartiRef = useRef<HTMLDivElement>(null);
  const makerRef = useRef<BlessingHandle>(null);

  const goCard = useCallback(
    () => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    [],
  );
  const goMandals = useCallback(
    () => mandalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    [],
  );
  const goAarti = useCallback(
    () => aartiRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    [],
  );

  /**
   * Every WhatsApp button on the page routes here.
   *
   * If the card is ready it shares straight away; otherwise it scrolls to the
   * maker so the tap still does something visible rather than nothing.
   */
  const shareWhatsApp = useCallback(() => {
    if (makerRef.current) {
      makerRef.current.shareWhatsApp();
      return;
    }
    goCard();
  }, [goCard]);

  useEffect(() => {
    if (fromName) analytics.referralArrived(fromName);
  }, [fromName]);

  return (
    <>
      <TopNav
        onCard={goCard}
        onMandals={goMandals}
        onAarti={goAarti}
        onShareWhatsApp={shareWhatsApp}
      />

      <main id="main">
        <HeroSection onShareWhatsApp={shareWhatsApp} />

        <Choices onCard={goCard} onMandals={goMandals} onAarti={goAarti} />

        {fromName && (
          <div className="container" style={{ marginTop: 22 }}>
            <p
              role="status"
              style={{
                background: "var(--gold-l)",
                border: "2px solid var(--marigold)",
                borderRadius: 18,
                padding: "14px 20px",
                textAlign: "center",
                fontSize: "1.05rem",
                color: "var(--ink)",
              }}
            >
              🎉 <strong>{fromName}</strong> ने आपको बाप्पा का आशीर्वाद भेजा है!
            </p>
          </div>
        )}

        <AdBanner slot="leaderboard" />

        <div ref={cardRef}>
          <Suspense fallback={<Loading label="कार्ड तैयार हो रहा है…" />}>
            <BlessingExperience ref={makerRef} initialName={initialName} />
          </Suspense>
        </div>

        <AdBanner slot="rectangle" />

        <div ref={mandalsRef}>
          <Reveal>
            <Suspense fallback={<Loading label="मंडल आ रहे हैं…" />}>
              <MumbaiMandals />
            </Suspense>
          </Reveal>
        </div>

        <NativeAd />

        <div ref={aartiRef}>
          <Reveal>
            <Suspense fallback={<Loading label="आरती आ रही है…" />}>
              <AartiPlaylist />
            </Suspense>
          </Reveal>
        </div>

        <AdBanner slot="leaderboard" label="Sponsored" />
      </main>

      <Footer onCard={goCard} onMandals={goMandals} onAarti={goAarti} />

      <FloatingWhatsApp onShare={shareWhatsApp} />
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
