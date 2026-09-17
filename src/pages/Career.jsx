import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Star, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Career() {
  const ROLES = [
    { id: 1, title: "AI Instructor (Part-time)", loc: "Remote / Patna" },
    { id: 2, title: "Curriculum Developer — Robotics", loc: "Patna" },
    { id: 3, title: "Student Success Mentor", loc: "Remote" },
  ];

  return (
    <div className="pt-28 pb-24" data-testid="career-page">
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Careers</div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05]">
            Join ISAI Academy — build the <span className="cyan-gold-text">future</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75 leading-relaxed">
            We're a fast-growing learning lab focused on AI, robotics and applied computing. If you're
            passionate about teaching, curriculum design, or student growth — we'd love to hear from you.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <div className="font-display text-xl font-bold">Open roles</div>
            </div>
            <ul className="mt-4 space-y-3">
              {ROLES.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{r.title}</div>
                    <div className="text-xs text-foreground/60 mt-1">{r.loc}</div>
                  </div>
                  <Button asChild size="sm" className="h-9">
                    <Link to="/contact">Apply</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-primary" />
              <div className="font-display text-xl font-bold">Why work with us</div>
            </div>
            <ul className="mt-4 list-disc pl-5 text-foreground/75 space-y-2">
              <li>Hands-on curriculum building with real projects.</li>
              <li>Work with a small, mission-driven team in EdTech.</li>
              <li>Opportunities for research and product collaboration.</li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div className="font-display text-xl font-bold">Perks</div>
            </div>
            <div className="mt-4 text-foreground/75">
              Flexible hours, mentorship, access to our lab, and support for workshops and conferences.
            </div>

            <div className="mt-6">
              <div className="text-sm text-foreground/60">Prefer to reach us directly?</div>
              <div className="mt-3 flex gap-3">
                <a href="mailto:hello@isaiacademy.in" className="btn-neon h-12 rounded-xl px-5 inline-flex items-center">Email us</a>
                <Button asChild variant="outline" className="h-12 rounded-xl px-5">
                  <Link to="/contact">Contact form</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
