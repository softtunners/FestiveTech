"use client";
import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId: number;

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    type Particle = {
      x: number; y: number; r: number; vy: number; vx: number;
      rot: number; rotV: number; color: string; opacity: number; type: "petal" | "sparkle";
    };

    const colors = ["#F59E0B", "#E86A17", "#FDE68A", "#D97706"];
    const particles: Particle[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 5 + 3,
      vy: Math.random() * 0.7 + 0.28,
      vx: (Math.random() - 0.5) * 0.4,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 1.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.45 + 0.22,
      type: Math.random() > 0.32 ? "petal" : "sparkle",
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.012) * 0.55 + p.vx;
        p.rot += p.rotV;
        if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        if (p.type === "petal") {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 1.7, p.r * 0.85, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "#FEF3C7";
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" aria-hidden="true" />;
}
