import React from "react";

/** Lightweight CSS-only particle / grid background for futuristic vibes. */
export default function ParticleBg({ variant = "default" }) {
  const particles = Array.from({ length: 32 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 hex-grid opacity-[0.35]" />
      <div className="absolute inset-0 grid-radial" />
      {variant !== "minimal" && particles.map((_, i) => {
        const size = 2 + (i % 4);
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const delay = (i % 8) * 0.4;
        const dur = 5 + (i % 6);
        const isGold = i % 5 === 0;
        return (
          <span
            key={i}
            className="absolute rounded-full animate-float-y"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              background: isGold ? "#FFD700" : "#00F0FF",
              boxShadow: isGold
                ? "0 0 8px rgba(255,215,0,0.8)"
                : "0 0 8px rgba(0,240,255,0.8)",
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
}
