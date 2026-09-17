import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";

const EXTERIOR = "https://static.prod-images.emergentagent.com/jobs/daa89962-3eb5-4a90-9a28-c4a18ef03946/images/13eddce7a4dd559fd2e4c7d5d4727a52f9a7229834d890f0be2ac0225265df93.png";
const LAB = "https://static.prod-images.emergentagent.com/jobs/daa89962-3eb5-4a90-9a28-c4a18ef03946/images/97e40991d6971a5fc37e5550971f929eb6e5c71ff29769d8e7ac7744f683294f.png";
const CODING = "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=1200";
const CIRCUIT = "https://images.unsplash.com/photo-1631375937044-6dd5beac01d2?w=1200";

const FACILITIES = [
  "Robotics & IoT Lab", "AI / GPU Workstations", "PCB Design Studio",
  "Cybersecurity Range", "Drone Flight Bay", "3D Printing Workshop",
  "Smart Classrooms", "Library & Reading Lounge", "Recording Studio",
];

export default function OfflineCenter() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course_interest: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/inquiries", { ...form, message: form.message || `Center visit request` });
      toast.success("Thanks! Our team will reach out within 24 hours.");
      setForm({ name: "", email: "", phone: "", course_interest: "", message: "" });
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed to submit");
    } finally { setSending(false); }
  };

  return (
    <div className="pt-28 pb-24" data-testid="offline-center-page">
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Offline Center</div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05]">
            The Supernova Hub <span className="gold-text">— Patna</span>
          </h1>
          <div className="mt-5 flex items-center gap-2 text-foreground/70">
            <MapPin className="h-4 w-4 text-primary" />
            Kankarbagh, Patna, Bihar 800020, India
          </div>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-white/10 relative">
            <img src={EXTERIOR} alt="ISAI Academy exterior" className="w-full h-full aspect-[16/10] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-5 left-5 glass-strong rounded-xl p-4 max-w-sm">
              <div className="font-mono text-[10px] tracking-widest text-primary uppercase">Flagship Campus</div>
              <div className="font-display font-bold text-lg">12,000 sq ft. of futuristic learning space</div>
            </div>
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="rounded-3xl overflow-hidden border border-white/10 relative">
              <img src={LAB} alt="Robotics lab" className="w-full h-full aspect-square object-cover" />
              <div className="absolute bottom-2 left-2 glass rounded-md px-2 py-1 font-mono text-[10px] tracking-widest text-primary uppercase">Robotics Lab</div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/10 relative">
              <img src={CODING} alt="Coding lab" className="w-full h-full aspect-square object-cover" />
              <div className="absolute bottom-2 left-2 glass rounded-md px-2 py-1 font-mono text-[10px] tracking-widest text-primary uppercase">Coding Studio</div>
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/10 relative col-span-2">
              <img src={CIRCUIT} alt="Circuit lab" className="w-full h-full aspect-[2/1] object-cover" />
              <div className="absolute bottom-2 left-2 glass rounded-md px-2 py-1 font-mono text-[10px] tracking-widest text-primary uppercase">PCB & Hardware</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 mt-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Facilities</div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-3 leading-tight">
              Built for <span className="cyan-gold-text">hands-on innovation</span>
            </h2>
            <p className="mt-4 text-foreground/70 max-w-md">
              Every room is designed to spark curiosity — from quiet reading corners to high-energy robotics arenas.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {FACILITIES.map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-foreground/85" data-testid="facility-item">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-2 text-sm">
              <div className="flex items-center gap-3 text-foreground/80"><Phone className="h-4 w-4 text-primary" /> +91-8757870948</div>
              <div className="flex items-center gap-3 text-foreground/80"><Mail className="h-4 w-4 text-primary" /> hello@isaiacademy.in</div>
              <div className="flex items-center gap-3 text-foreground/80"><Calendar className="h-4 w-4 text-primary" /> Mon – Sat · 9:00 AM – 8:00 PM</div>
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-7 glass-strong rounded-3xl p-6 md:p-8" data-testid="visit-form">
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Book a Visit</div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-6">Walk in for a free demo class</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground/80">Full name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="visit-name" />
              </div>
              <div>
                <Label className="text-foreground/80">Email</Label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="visit-email" />
              </div>
              <div>
                <Label className="text-foreground/80">Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="visit-phone" />
              </div>
              <div>
                <Label className="text-foreground/80">Course interest</Label>
                <Input placeholder="e.g. Robotics, Python, AI/ML" value={form.course_interest}
                       onChange={(e) => setForm({ ...form, course_interest: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="visit-course" />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-foreground/80">Message</Label>
                <Textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="mt-2 bg-white/5 border-white/10" placeholder="Tell us about your goals…" data-testid="visit-message" />
              </div>
            </div>
            <Button type="submit" disabled={sending} className="btn-neon mt-6 h-12 rounded-xl px-7" data-testid="visit-submit">
              {sending ? "Sending…" : "Book my visit"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 mt-16">
        <div className="rounded-3xl overflow-hidden border border-white/10">
          <iframe
            title="ISAI Academy map"
            src="https://www.google.com/maps?q=Kankarbagh,+Patna,+Bihar,+India&output=embed"
            width="100%" height="380" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg) saturate(0.85)" }}
            data-testid="map-embed"
          />
        </div>
      </section>
    </div>
  );
}
