import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Maximize2, X } from "lucide-react";

/**
 * AI-styled image card with:
 *  - 3D tilt on mouse-move
 *  - Animated neural-scan gradient sweep on hover
 *  - Horizontal scan-line that travels top→bottom
 *  - Glow border + corner brackets like an HUD
 *  - Caption reveal on hover
 */
function AIImage({ item, index, onDelete, onOpen }) {
  const ref = useRef(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width);
    const y = ((e.clientY - r.top) / r.height);
    setT({
      ry: (x - 0.5) * 10,    // rotateY
      rx: -(y - 0.5) * 8,    // rotateX
      mx: x * 100,
      my: y * 100,
    });
  };
  const handleLeave = () => setT({ rx: 0, ry: 0, mx: 50, my: 50 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: (index % 9) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onOpen?.(item)}
      style={{ perspective: 1200 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      data-testid="gallery-item"
    >
      <div
        className="relative aspect-[4/3] transition-transform duration-300 will-change-transform"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image */}
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Always-on subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent opacity-80" />

        {/* AI cursor-tracked highlight (neural beam) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen pointer-events-none"
          style={{
            background: `radial-gradient(420px circle at ${t.mx}% ${t.my}%, rgba(0,240,255,0.45), rgba(255,215,0,0.10) 35%, transparent 60%)`,
          }}
        />

        {/* Travelling scan-line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 animate-scan-line pointer-events-none" />

        {/* HUD corner brackets */}
        <span className="absolute top-2 left-2 h-4 w-4 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-2 right-2 h-4 w-4 border-r-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-2 left-2 h-4 w-4 border-l-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-2 right-2 h-4 w-4 border-r-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category label */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/55 backdrop-blur-sm font-mono text-[10px] tracking-widest text-primary uppercase border border-primary/30">
          {item.category}
        </div>

        {/* Caption + actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="font-display font-bold text-base leading-tight">{item.title}</div>
          {item.caption && (
            <div className="text-xs text-foreground/70 mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.caption}
            </div>
          )}
        </div>

        {/* Expand & delete buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item); }}
              className="h-8 w-8 rounded-md bg-black/60 backdrop-blur border border-white/15 flex items-center justify-center hover:bg-destructive/30 hover:text-destructive"
              title="Delete"
              data-testid="gallery-delete-btn"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <div className="h-8 w-8 rounded-md bg-black/60 backdrop-blur border border-white/15 flex items-center justify-center text-primary">
            <Maximize2 className="h-4 w-4" />
          </div>
        </div>

        {/* Neon outline glow on hover */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-shadow duration-300 group-hover:shadow-neon-cyan ring-1 ring-inset ring-white/5" />
      </div>
    </motion.div>
  );
}

/** Public grid + lightbox. `canManage` toggles delete affordance. */
export default function GalleryGrid({ items, onDelete }) {
  const [open, setOpen] = useState(null);

  if (!items?.length) {
    return <div className="text-center text-foreground/55 py-20">No photos yet — check back soon.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {items.map((it, i) => (
          <AIImage key={it.id} item={it} index={i} onDelete={onDelete} onOpen={setOpen} />
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setOpen(null)}
          data-testid="gallery-lightbox"
        >
          <button
            className="absolute top-5 right-5 h-10 w-10 rounded-lg glass flex items-center justify-center hover:bg-white/10"
            onClick={() => setOpen(null)}
            data-testid="lightbox-close"
          >
            <X className="h-5 w-5" />
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[88vh] flex flex-col"
          >
            <img src={open.image_url} alt={open.title} className="rounded-2xl object-contain max-h-[78vh] w-full border border-white/10" />
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest text-primary uppercase">// {open.category}</div>
                <h3 className="font-display text-2xl font-bold mt-1">{open.title}</h3>
                {open.caption && <p className="text-foreground/70 mt-2">{open.caption}</p>}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(0);    opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(360px); opacity: 0; }
        }
        .animate-scan-line { animation: scanLine 2.4s linear infinite; }
      `}</style>
    </>
  );
}
