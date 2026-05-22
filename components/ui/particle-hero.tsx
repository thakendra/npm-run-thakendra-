"use client";

import { useEffect, useRef, useState } from "react";

// Six light-colour themes — cycling on every sun click
const COLORS = [
  {
    accent: "#9dc3f7",
    rgb:    "157,195,247",
    beamR:  "80,150,255",
    grad:   "#9dc3f7,#c3dffe,#6ea8f5,#c3dffe,#9dc3f7",
  },
  {
    accent: "#f0c040",
    rgb:    "240,192,64",
    beamR:  "240,180,50",
    grad:   "#f0c040,#fde68a,#d4a017,#fde68a,#f0c040",
  },
  {
    accent: "#c084fc",
    rgb:    "192,132,252",
    beamR:  "160,80,255",
    grad:   "#c084fc,#e9d5ff,#a855f7,#e9d5ff,#c084fc",
  },
  {
    accent: "#4ade80",
    rgb:    "74,222,128",
    beamR:  "40,200,100",
    grad:   "#4ade80,#bbf7d0,#22c55e,#bbf7d0,#4ade80",
  },
  {
    accent: "#fb7185",
    rgb:    "251,113,133",
    beamR:  "240,60,110",
    grad:   "#fb7185,#fecdd3,#e11d48,#fecdd3,#fb7185",
  },
  {
    accent: "#38bdf8",
    rgb:    "56,189,248",
    beamR:  "20,160,240",
    grad:   "#38bdf8,#bae6fd,#0ea5e9,#bae6fd,#38bdf8",
  },
] as const;

export interface ParticleHeroProps {
  name?: string;
  title?: string;
  tagline?: string;
  services?: string[];
}

export function ParticleHero({
  name = "Thakendra Khadka",
  title = "Founder & CEO — Nava AI",
  tagline = "Building the future with Artificial Intelligence",
  services = [
    "AI Automation",
    "AI Counselling",
    "Agentic AI",
    "AI Integration",
    "Custom Chatbot Building",
  ],
}: ParticleHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [colorIdx, setColorIdx] = useState(0);

  const { accent, grad, beamR } = COLORS[colorIdx];
  const nextColor = () => setColorIdx((i) => (i + 1) % COLORS.length);

  // Auto-cycle colour every 60 seconds
  useEffect(() => {
    const id = setInterval(nextColor, 15_000);
    return () => clearInterval(id);
  }, []);

  // Particle + connection-line animation — restarts when colour changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = COLORS[colorIdx].rgb;
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const pts: P[] = Array.from({ length: 90 }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.4 + 0.4,
      a:  Math.random() * 0.45 + 0.12,
    }));

    function tick() {
      ctx!.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 110) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${rgb},${(0.11 * (1 - d / 110)).toFixed(3)})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.stroke();
          }
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb},${p.a})`;
        ctx!.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    tick();

    const onResize = () => {
      w = canvas!.width  = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [colorIdx]);

  return (
    <section
      style={{
        background: "#05060f",
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* ── Particle canvas ─────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          animation: "ph-fadein 0.8s ease forwards",
        }}
      />

      {/* ── Sun spotlight layers ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
      >
        {/* Soft radial halo — blooms outward from the sun */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "660px",
            height: "62vh",
            background: `radial-gradient(ellipse 330px 55vh at 50% 0%, rgba(${beamR},0.22) 0%, transparent 70%)`,
            filter: "blur(22px)",
            animation: "ph-fadein 1s 0.2s ease both",
          }}
        />

        {/* Main cone spotlight — triangle with soft edges */}
        <div style={{ position: "absolute", inset: 0, filter: "blur(8px)" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "820px",
              height: "96vh",
              background: `linear-gradient(
                180deg,
                rgba(255,255,255,0.42) 0%,
                rgba(${beamR},0.26)    6%,
                rgba(${beamR},0.12)   30%,
                rgba(${beamR},0.04)   65%,
                transparent           100%
              )`,
              clipPath: "polygon(50% 0%, 3% 100%, 97% 100%)",
              animation: "ph-fadein 1s 0.3s ease both",
            }}
          />
        </div>

        {/* Left ambient fill beam */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: 0,
            width: "190px",
            height: "60%",
            background: `linear-gradient(180deg, rgba(${beamR},0.09) 0%, transparent 85%)`,
            filter: "blur(40px)",
            transformOrigin: "top center",
            animation: "ph-beam1 9s ease-in-out infinite alternate, ph-fadein 1.2s 0.4s ease both",
          }}
        />

        {/* Right ambient fill beam */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: 0,
            width: "170px",
            height: "55%",
            background: `linear-gradient(180deg, rgba(${beamR},0.07) 0%, transparent 85%)`,
            filter: "blur(45px)",
            transformOrigin: "top center",
            animation: "ph-beam2 11s ease-in-out infinite alternate, ph-fadein 1.2s 0.6s ease both",
          }}
        />
      </div>

      {/* ── Clickable sun ────────────────────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={nextColor}
        onKeyDown={(e) => e.key === "Enter" && nextColor()}
        aria-label="Cycle light colour"
        style={{
          position: "absolute",
          top: "-13px",          // half-clipped by viewport top edge, like the reference
          left: "50%",
          transform: "translateX(-50%)",
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 38% 32%, #1c2540 0%, #07091a 60%, #05060f 100%)",
          border: `1.5px solid ${accent}99`,
          boxShadow: `0 0 18px ${accent}, 0 0 40px ${accent}77, 0 0 80px ${accent}44`,
          cursor: "pointer",
          zIndex: 30,
          outline: "none",
          transition: "box-shadow 0.5s ease, border-color 0.5s ease",
        }}
      />

      {/* ══ Full-height flex column — text → photo → pills ══════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          paddingTop: "clamp(3rem, 6vh, 5rem)",
        }}
      >
        {/* ── 1. Text block (top) ─────────────────────────────────── */}
        <div style={{ textAlign: "center", width: "100%", maxWidth: "900px", padding: "0 1.5rem", flexShrink: 0 }}>

          {/* Hello, I'm */}
          <p style={{
            fontSize: "clamp(0.85rem, 1.6vw, 1.05rem)",
            color: "rgba(175,200,230,0.6)",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            margin: "0 0 0.25rem",
            animation: "ph-slideup 0.6s 0.6s ease both",
          }}>
            Hello, I&apos;m
          </p>

          {/* Name */}
          <h1 style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: "0 0 0.4rem",
            backgroundImage: `linear-gradient(90deg,${grad})`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "ph-slideup 0.7s 0.8s ease both, ph-gradmove 4s linear infinite",
          }}>
            {name}
          </h1>

          {/* Title */}
          <p style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.15rem)",
            fontWeight: 500,
            color: accent,
            margin: "0 0 0.4rem",
            letterSpacing: "0.04em",
            textShadow: `0 0 20px ${accent}88`,
            animation: "ph-slideup 0.7s 1.1s ease both",
            transition: "color 0.5s, text-shadow 0.5s",
          }}>
            {title}
          </p>

          {/* Tagline — "Artificial Intelligence" highlighted */}
          <p style={{
            fontSize: "clamp(0.82rem, 1.4vw, 0.97rem)",
            color: "rgba(175,200,230,0.65)",
            margin: 0,
            lineHeight: 1.6,
            animation: "ph-slideup 0.7s 1.4s ease both",
          }}>
            {(() => {
              const hi = "Artificial Intelligence";
              const idx = tagline.indexOf(hi);
              if (idx === -1) return tagline;
              return (
                <>
                  {tagline.slice(0, idx)}
                  <span style={{ color: accent, transition: "color 0.5s" }}>{hi}</span>
                  {tagline.slice(idx + hi.length)}
                </>
              );
            })()}
          </p>
        </div>

        {/* ── 2. Photo — fills remaining space, centered ──────────── */}
        <div className="ph-photo-flex" style={{
          flex: "1 1 0",
          minHeight: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
          pointerEvents: "none",
          animation: "ph-scalein 1s 0.4s ease both",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/myphoto.png"
            alt="Thakendra Khadka"
            style={{
              height: "100%",
              width: "auto",
              maxWidth: "clamp(320px, 52vw, 680px)",
              objectFit: "contain",
              objectPosition: "center bottom",
              mixBlendMode: "screen",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              WebkitMaskComposite: "source-in",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
              maskComposite: "intersect",
            }}
          />
          {/* Beam colour tint */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 30%, rgba(${beamR},0.12) 0%, transparent 60%)`,
            transition: "background 0.6s ease",
            mixBlendMode: "screen",
          }} />
        </div>

        {/* ── 3. Service pills (bottom) ────────────────────────────── */}
        <div
          className="ph-pills"
          style={{
            flexShrink: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "0.55rem",
            justifyContent: "center",
            maxWidth: "700px",
            width: "100%",
            padding: "0.75rem 1.5rem 1.2rem",
          }}
        >
          {services.map((svc, i) => (
            <span
              key={svc}
              className="ph-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.35rem 1rem",
                borderRadius: "9999px",
                border: `1px solid ${accent}44`,
                background: `rgba(${beamR},0.07)`,
                color: accent,
                fontSize: "clamp(0.7rem, 1.3vw, 0.82rem)",
                fontWeight: 500,
                letterSpacing: "0.03em",
                cursor: "default",
                transition: "box-shadow 0.25s, background 0.25s, color 0.5s, border-color 0.5s",
                animation: `ph-slidein 0.5s ${(1.8 + i * 0.1).toFixed(2)}s ease both`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = `0 0 16px rgba(${beamR},0.55)`;
                el.style.background = `rgba(${beamR},0.15)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "none";
                el.style.background = `rgba(${beamR},0.07)`;
              }}
            >
              {svc}
            </span>
          ))}
        </div>
      </div>

      {/* ── Keyframes + responsive overrides ───────────────────────── */}
      <style>{`
        @keyframes ph-fadein {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes ph-scalein {
          from { opacity: 0; transform: scale(0.72) }
          to   { opacity: 1; transform: scale(1)    }
        }
        @keyframes ph-slideup {
          from { opacity: 0; transform: translateY(20px) }
          to   { opacity: 1; transform: translateY(0)    }
        }
        @keyframes ph-slidein {
          from { opacity: 0; transform: translateY(12px) }
          to   { opacity: 1; transform: translateY(0)    }
        }
        @keyframes ph-ring {
          0%,100% { transform: scale(1);    opacity: 0.6  }
          50%      { transform: scale(1.09); opacity: 0.18 }
        }
        @keyframes ph-gradmove {
          from { background-position: 0%   center }
          to   { background-position: 200% center }
        }
        @keyframes ph-beam1 {
          0%   { transform: rotate(-14deg) translateX(-8%); opacity: 0.6 }
          100% { transform: rotate(10deg)  translateX(8%);  opacity: 1   }
        }
        @keyframes ph-beam2 {
          0%   { transform: rotate(16deg)  translateX(10%); opacity: 0.7 }
          100% { transform: rotate(-12deg) translateX(-8%); opacity: 1   }
        }
        @media (max-width: 768px) {
          .ph-photo-flex {
            flex: 0 0 auto !important;
            height: 54vh;
            align-items: flex-start !important;
            margin-top: 0.5rem;
          }
        }
        @media (max-width: 480px) {
          .ph-photo-flex {
            flex: 0 0 auto !important;
            height: 52vh;
            align-items: flex-start !important;
            margin-top: 0.5rem;
          }
          .ph-pills {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .ph-pill {
            white-space: normal !important;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
