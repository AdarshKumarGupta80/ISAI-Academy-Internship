import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Printer, ArrowLeft, Award, Sparkles, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Certificate() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const printAreaRef = useRef(null);

  useEffect(() => {
    api.get(`/certificates/${id}`).then((r) => setCert(r.data))
      .catch(() => setCert(false))
      .finally(() => setLoading(false));
  }, [id]);

  const onPrint = () => window.print();
  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: "My ISAI Certificate", url }); return; } catch { /* fallthrough */ }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary font-mono">LOADING…</div>;
  if (!cert) return <div className="min-h-screen flex items-center justify-center text-foreground/60">Certificate not found.</div>;

  const issuedDate = new Date(cert.issued_at).toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{`
        @media print {
          body, html, #root, .App { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .cert-paper { box-shadow: none !important; border: 1px solid #888 !important; }
        }
      `}</style>
      <div className="pt-24 pb-20 px-4" data-testid="certificate-page">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-6 no-print">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onShare} className="border-white/15" data-testid="share-cert-btn">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button onClick={onPrint} className="btn-neon" data-testid="print-cert-btn">
                <Printer className="h-4 w-4 mr-2" /> Print / Save PDF
              </Button>
            </div>
          </div>

          <div ref={printAreaRef}
            className="cert-paper relative rounded-3xl border-2 border-secondary/40 bg-gradient-to-br from-[#0a0a14] via-[#0d1018] to-[#0a0a14] p-8 md:p-14 overflow-hidden shadow-card-elevated"
            style={{ aspectRatio: "1.414 / 1" }} /* A4 landscape */
            data-testid="certificate-paper"
          >
            {/* Decorative neon corner rings */}
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
            <div className="absolute inset-4 rounded-2xl border border-white/10 pointer-events-none" />
            <div className="absolute inset-7 rounded-xl border border-secondary/30 pointer-events-none" />

            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-neon-cyan">
                    <Sparkles className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <div className="font-cyber text-lg md:text-xl font-extrabold uppercase tracking-wider">ISAI <span className="cyan-gold-text">Academy</span></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">International Supernova AI Academy</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Certificate No.</div>
                  <div className="font-mono text-primary tracking-widest">{cert.id}</div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center text-center mt-8">
                <div className="font-mono text-[11px] tracking-[0.4em] text-primary uppercase">// Certificate of Completion</div>
                <h1 className="font-cyber text-4xl md:text-6xl font-extrabold mt-4 uppercase tracking-wide">
                  Awarded to
                </h1>
                <div className="mt-6 font-display text-4xl md:text-6xl font-extrabold cyan-gold-text neon-text">
                  {cert.user_name}
                </div>
                <p className="mt-7 text-foreground/80 max-w-2xl">
                  for successfully completing the course and demonstrating mastery in
                </p>
                <div className="mt-3 font-display text-2xl md:text-3xl font-bold">
                  "{cert.course_title}"
                </div>
                {cert.course_level && (
                  <div className="mt-2 font-mono text-xs tracking-widest text-secondary uppercase">
                    {cert.course_level}
                  </div>
                )}
                <div className="mt-6 flex items-center gap-2 text-foreground/80">
                  <Award className="h-5 w-5 text-secondary" />
                  <span className="font-medium">Knowledge. Innovation. Excellence.</span>
                </div>
              </div>

              <div className="mt-auto pt-8 grid grid-cols-2 gap-8 items-end">
                <div>
                  <div className="font-cyber text-lg italic text-foreground border-b border-white/30 pb-1">— ISAI Faculty</div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mt-1">Authorized Signatory</div>
                </div>
                <div className="text-right">
                  <div className="font-cyber text-lg">{issuedDate}</div>
                  <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mt-1">Date of Issue</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-foreground/50 mt-6 no-print font-mono tracking-widest uppercase">
            Verify at isaiacademy.in/certificate/{cert.id}
          </div>
        </div>
      </div>
    </>
  );
}
