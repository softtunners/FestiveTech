"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades a section in the first time it scrolls into view.
 *
 * Starts visible and only *becomes* hidden once the observer is attached, so
 * the content is never trapped invisible if JS fails or IntersectionObserver
 * is unavailable.
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const el = ref.current;
    if (!el) return;

    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[armed ? "reveal" : "", visible ? "is-visible" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
