import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, CheckCircle2, BadgeCheck, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "@/lib/api";
import ParticleBg from "@/components/ParticleBg";

const PERKS = [
  { icon: Briefcase, t: "Flexible schedule", d: "Choose your own hours — full-time, part-time, or evening batches." },
  { icon: BadgeCheck, t: "Top-tier compensation", d: "Industry-leading per-class rates + bonus on student outcomes." },
  { icon: Award, t: "Build your brand", d: "Get featured on the ISAI blog, social and the official newsroom." },
];

const EMPTY = {
  full_name: "", email: "", phone: "", qualifications: "",
  experience_years: "", expertise: "", bio: "",
  resume_url: "", linkedin_url: "", portfolio_url: "", why_isai: "",
};

export default function TeacherApply() {
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (f.bio.length < 20) { toast.error("Tell us a bit more about yourself (20+ chars)"); return; }
    setBusy(true);
    try {
      await api.post("/teacher-applications", {
        ...f,
        experience_years: Number(f.experience_years || 0),
        expertise: f.expertise.split(",").map((s) => s.trim()).filter(Boolean),
        resume_url: f.resume_url || null,
        linkedin_url: f.linkedin_url || null,
        portfolio_url: f.portfolio_url || null,
        why_isai: f.why_isai || null,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e2) {
      toast.error(formatApiErrorDetail(e2.response?.data?.detail) || "Failed to submit");
    } finally { setBusy(false); }
  };

  if (submitted) {
    return (
      <div className="pt-28 pb-24 px-6" data-testid="teacher-apply-success">
        <div className="max-w-2xl mx-auto glass-strong rounded-3xl p-10 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-cyber text-3xl md:text-4xl font-extrabold mt-6 uppercase">
            Application <span className="cyan-gold-text">received!</span>
          </h1>
          <p className="text-foreground/70 mt-4 leading-relaxed">
            Thanks for applying to teach at ISAI Academy. Our admissions team reviews every application
            personally — you'll hear back within <strong className="text-foreground">3 working days</strong> at the email you provided.
          </p>
          <p className="text-sm text-foreground/55 mt-3">
            On approval, we'll send you your teacher login + onboarding kit.
          </p>
          <Button asChild className="btn-neon mt-6 h-11 px-6 rounded-xl">
            <a href="/">Back to home</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-28 pb-24" data-testid="teacher-apply-page">
      <ParticleBg variant="minimal" />
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Join the Faculty</div>
            <h1 className="font-cyber text-4xl md:text-5xl font-extrabold mt-3 leading-[1.05] uppercase">
              Teach the <span className="cyan-gold-text">next generation</span> of builders
            </h1>
            <p className="mt-5 text-foreground/75 leading-relaxed">
              Are you a working professional, researcher or experienced educator in AI, Coding, Robotics or Cybersecurity?
              Bring your expertise to our students — apply below and our admissions team will get in touch.
            </p>

            <div className="mt-8 space-y-3">
              {PERKS.map((p) => (
                <div key={p.t} className="glass rounded-xl p-4 flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <p.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-bold">{p.t}</div>
                    <div className="text-xs text-foreground/65 mt-0.5">{p.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 glass rounded-xl p-4 border-l-2 border-secondary/60">
              <div className="font-mono text-[10px] tracking-widest text-secondary uppercase">// Vetting process</div>
              <ol className="mt-2 text-sm text-foreground/75 space-y-1 list-decimal list-inside">
                <li>Submit this application</li>
                <li>30-min intro call with our academic director</li>
                <li>Demo class (one topic of your choice)</li>
                <li>Background &amp; reference check</li>
                <li>Welcome aboard 🚀</li>
              </ol>
            </div>
          </motion.div>
        </div>

        <form onSubmit={submit} className="lg:col-span-7 glass-strong rounded-3xl p-6 md:p-8" data-testid="teacher-apply-form">
          <div className="font-mono text-[11px] tracking-widest text-primary uppercase">// Application</div>
          <h2 className="font-display text-2xl font-bold mt-1">Tell us about yourself</h2>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Field label="Full name *">
              <Input required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-name" />
            </Field>
            <Field label="Email *">
              <Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-email" />
            </Field>
            <Field label="Phone (with country code) *">
              <Input required value={f.phone} placeholder="+91-9999999999"
                onChange={(e) => setF({ ...f, phone: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-phone" />
            </Field>
            <Field label="Years of experience *">
              <Input required type="number" min="0" max="80" value={f.experience_years}
                onChange={(e) => setF({ ...f, experience_years: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-exp" />
            </Field>
            <Field label="Highest qualification *" full>
              <Input required value={f.qualifications} placeholder="B.Tech CS, IIT Patna · M.Sc AI, IISc"
                onChange={(e) => setF({ ...f, qualifications: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-qual" />
            </Field>
            <Field label="Expertise (comma separated) *" full>
              <Input required value={f.expertise} placeholder="Python, Deep Learning, Robotics, Cybersecurity"
                onChange={(e) => setF({ ...f, expertise: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-expertise" />
            </Field>
            <Field label="Short bio *" full>
              <Textarea required rows={3} value={f.bio} placeholder="Where you've worked, who you've taught, what you're passionate about…"
                onChange={(e) => setF({ ...f, bio: e.target.value })}
                className="bg-white/5 border-white/10" data-testid="ta-bio" />
            </Field>

            <Field label="Resume / CV URL">
              <Input value={f.resume_url} placeholder="Google Drive / Dropbox link"
                onChange={(e) => setF({ ...f, resume_url: e.target.value })}
                className="bg-white/5 border-white/10 font-mono text-sm" data-testid="ta-resume" />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={f.linkedin_url} onChange={(e) => setF({ ...f, linkedin_url: e.target.value })}
                className="bg-white/5 border-white/10 font-mono text-sm" data-testid="ta-linkedin" />
            </Field>
            <Field label="Portfolio / GitHub URL" full>
              <Input value={f.portfolio_url} onChange={(e) => setF({ ...f, portfolio_url: e.target.value })}
                className="bg-white/5 border-white/10 font-mono text-sm" data-testid="ta-portfolio" />
            </Field>
            <Field label="Why ISAI? (optional)" full>
              <Textarea rows={3} value={f.why_isai} onChange={(e) => setF({ ...f, why_isai: e.target.value })}
                className="bg-white/5 border-white/10" placeholder="What attracts you to our mission?" />
            </Field>
          </div>

          <Button type="submit" disabled={busy} className="btn-neon mt-6 h-12 rounded-xl px-7 w-full sm:w-auto" data-testid="ta-submit">
            {busy ? "Submitting…" : "Submit application"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="mt-4 text-xs text-foreground/50">
            By applying you agree to our verification process. Your information stays confidential.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, full = false, children }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label className="text-foreground/85">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
