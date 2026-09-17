import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course_interest: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) { toast.error("Please share your message."); return; }
    setSending(true);
    try {
      await api.post("/inquiries", form);
      toast.success("Got it! We'll reply within 24 hours.");
      setForm({ name: "", email: "", phone: "", course_interest: "", message: "" });
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed to submit");
    } finally { setSending(false); }
  };

  return (
    <div className="pt-28 pb-24" data-testid="contact-page">
      <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Contact</div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05]">
            Let's <span className="cyan-gold-text">talk.</span>
          </h1>
          <p className="mt-5 max-w-xl text-foreground/70">
            Questions about courses, admissions, partnerships or careers? Drop a message — a real human responds within a day.
          </p>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-5">
              <div className="font-mono text-[10px] tracking-widest text-primary uppercase">Email</div>
              <div className="flex items-center gap-3 mt-2 text-foreground/90"><Mail className="h-4 w-4 text-primary" /> hello@isaiacademy.in</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="font-mono text-[10px] tracking-widest text-primary uppercase">Phone</div>
              <div className="flex items-center gap-3 mt-2 text-foreground/90"><Phone className="h-4 w-4 text-primary" /> +91-8757870948</div>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="font-mono text-[10px] tracking-widest text-primary uppercase">Address</div>
              <div className="flex items-start gap-3 mt-2 text-foreground/90"><MapPin className="h-4 w-4 text-primary mt-0.5" /> Kankarbagh, Patna, Bihar 800020, India</div>
            </div>
          </div>

          <form onSubmit={submit} className="lg:col-span-3 glass-strong rounded-3xl p-6 md:p-8" data-testid="contact-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="contact-name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="contact-email" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="contact-phone" />
              </div>
              <div>
                <Label>Course interest</Label>
                <Input value={form.course_interest} placeholder="e.g. AI & ML"
                       onChange={(e) => setForm({ ...form, course_interest: e.target.value })}
                       className="mt-2 bg-white/5 border-white/10" data-testid="contact-course" />
              </div>
              <div className="sm:col-span-2">
                <Label>Message</Label>
                <Textarea required rows={5} value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="mt-2 bg-white/5 border-white/10" data-testid="contact-message" />
              </div>
            </div>
            <Button type="submit" disabled={sending} className="btn-neon mt-6 h-12 rounded-xl px-7" data-testid="contact-submit">
              {sending ? "Sending…" : "Send message"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
