"use client";

import { useEffect, useRef } from "react";

/**
 * Falling marigold petals.
 *
 * Scoped to the dark hero rather than fixed over the whole page — petals
 * drifting across light content sections just looked like dirt on the screen,
 * and a full-viewport rAF loop is wasted battery on the cheap phones this
 * site is built for.
 */
export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Cap the pixel ratio: a 3x buffer on a budget GPU costs more than it shows.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    type P = {
      x: number; y: number; r: number; vy: number; vx: number;
      rot: number; rotV: number; color: string; alpha: number; petal: boolean;
    };

    const colors = ["#FFB300", "#F4741F", "#FFE55C", "#D81B60"];
    const make = (atTop: boolean): P => ({
      x: Math.random() * w,
      y: atTop ? -20 : Math.random() * h,
      r: Math.random() * 5 + 3,
      vy: Math.random() * 0.6 + 0.25,
      vx: (Math.random() - 0.5) * 0.35,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 1.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.25,
      petal: Math.random() > 0.3,
    });

    const particles: P[] = Array.from({ length: 26 }, () => make(false));

    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.012) * 0.5 + p.vx;
        p.rot += p.rotV;
        if (p.y > h + 20) Object.assign(p, make(true));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.petal ? p.color : "#FFF3C4";
        ctx.beginPath();
        if (p.petal) ctx.ellipse(0, 0, p.r * 1.7, p.r * 0.8, 0, 0, Math.PI * 2);
        else ctx.arc(0, 0, p.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    // Stop burning frames once the hero is scrolled past or the tab is hidden.
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !document.hidden;
      if (running) draw();
      else cancelAnimationFrame(raf);
    });
    io.observe(parent);

    const onVis = () => {
      running = !document.hidden;
      if (running) draw();
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="petal-canvas" aria-hidden="true" />;
}
