"use client";

import { useEffect, useRef, useState } from "react";
import { NATIVE_SRC, NATIVE_CONTAINER_ID, absoluteSrc } from "@/lib/ads";

/**
 * Adsterra Native Banner.
 *
 * Unlike the display banners this one injects itself into a container div by
 * id, so it can live directly in the page. Still loaded lazily, and skipped
 * entirely when unconfigured.
 */
export default function NativeAd({ label = "Sponsored" }: { label?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || loadedRef.current || !NATIVE_SRC) return;
    loadedRef.current = true;

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = absoluteSrc(NATIVE_SRC);
    document.body.appendChild(s);
  }, [inView]);

  if (!NATIVE_SRC || !NATIVE_CONTAINER_ID) return null;

  return (
    <div className="ad-zone" ref={hostRef}>
      <div className="ad-inner ad-native">
        <div className="ad-label-text">{label}</div>
        <div id={NATIVE_CONTAINER_ID} />
      </div>
    </div>
  );
}
