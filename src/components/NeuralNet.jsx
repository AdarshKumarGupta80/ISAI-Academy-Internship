import React, { useMemo } from "react";

/**
 * Animated SVG neural network — pulsing nodes + glowing connections.
 * Pure CSS animations, no JS rAF loop, so it's GPU-cheap.
 */
export default function NeuralNet({ className = "" }) {
  // Layered architecture: 4 input nodes, 6 hidden, 6 hidden, 4 output
  const layers = useMemo(() => [
    { x: 80,  count: 4 },
    { x: 220, count: 6 },
    { x: 360, count: 6 },
    { x: 500, count: 4 },
  ], []);

  const yFor = (i, count, height = 320) => {
    const padding = 30;
    if (count === 1) return height / 2;
    return padding + (i * (height - padding * 2)) / (count - 1);
  };

  const nodes = layers.flatMap((layer, li) =>
    Array.from({ length: layer.count }, (_, ni) => ({
      id: `${li}-${ni}`,
      layerIndex: li,
      x: layer.x,
      y: yFor(ni, layer.count),
      delay: (li * 0.4 + ni * 0.15) % 2.4,
    }))
  );

  const connections = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const fromLayer = nodes.filter((n) => n.layerIndex === li);
    const toLayer = nodes.filter((n) => n.layerIndex === li + 1);
    fromLayer.forEach((a, ai) => {
      toLayer.forEach((b, bi) => {
        connections.push({
          id: `${a.id}_${b.id}`,
          x1: a.x, y1: a.y, x2: b.x, y2: b.y,
          delay: ((ai + bi) * 0.18 + li * 0.5) % 3.6,
        });
      });
    });
  }

  return (
    <div className={`relative ${className}`} aria-hidden data-testid="neural-net-anim">
      <svg viewBox="0 0 580 340" className="w-full h-full">
        <defs>
          <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="60%" stopColor="#00F0FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGradGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="60%" stopColor="#FFD700" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connections */}
        <g strokeWidth="1" fill="none">
          {connections.map((c) => (
            <line
              key={c.id}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="url(#lineGrad)"
              opacity="0.18"
            />
          ))}
          {/* Pulse beams — animated dashes traveling along a few connections */}
          {connections.filter((_, i) => i % 7 === 0).map((c) => (
            <line
              key={`pulse-${c.id}`}
              x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#00F0FF"
              strokeWidth="1.5"
              opacity="0.85"
              strokeDasharray="4 12"
              filter="url(#glow)"
              style={{
                animation: `nnPulse 2.4s ${c.delay}s linear infinite`,
              }}
            />
          ))}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n, i) => {
            const isGold = i % 5 === 0;
            const r = isGold ? 7 : 6;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle r={r + 8} fill={isGold ? "url(#nodeGradGold)" : "url(#nodeGrad)"} opacity="0.6" />
                <circle r={r}
                  fill={isGold ? "#FFD700" : "#00F0FF"}
                  stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="0.5"
                  filter="url(#glow)"
                  style={{ animation: `nnNodePulse 2.2s ${n.delay}s ease-in-out infinite` }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      <style>{`
        @keyframes nnPulse {
          0%   { stroke-dashoffset: 0;   opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { stroke-dashoffset: -200; opacity: 0; }
        }
        @keyframes nnNodePulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50%      { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
