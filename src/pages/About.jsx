import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Award, Globe2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Award, label: "Best EdTech 2026", desc: "Bihar Innovation Awards" },
  { icon: Globe2, label: "1 Countries", desc: "Students across the globe" },
  { icon: Rocket, label: "one Launches", desc: "Capstone projects deployed" },
  { icon: Sparkles, label: "99% Satisfaction", desc: "Parent & student NPS" },
];

const VALUES = [
  { t: "Curiosity First", d: "We don't teach to a test. We teach to make minds restless and hands busy." },
  { t: "Hands-on Mastery", d: "Every concept ends with a project. Build it, break it, ship it." },
  { t: "Equal Opportunity", d: "Scholarships keep great education accessible to every learner who shows up to learn." },
  { t: "Future Ready", d: "Curriculum updated every term based on what the industry is actually shipping." },
];

export default function About() {
  return (
    <div className="pt-28 pb-24" data-testid="about-page">
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// About ISAI Academy</div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05] tracking-tight">
            A school for the <span className="cyan-gold-text">builders of tomorrow.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/75 leading-relaxed">
            Born in Kankarbagh, Patna — built for the world. The International Supernova AI Academy is a
            new kind of school: part lab, part launchpad. We bridge classroom learning with industry-grade
            AI, robotics & cybersecurity skills, so every student leaves prepared not for an exam, but for
            an era.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="glass rounded-2xl p-5">
              <s.icon className="h-6 w-6 text-primary" />
              <div className="font-display text-xl font-bold mt-3">{s.label}</div>
              <div className="text-xs text-foreground/60 mt-1">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 mt-24">
        <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Our values</div>
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mt-3 leading-tight max-w-3xl">
          What we believe.
        </h2>
        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {VALUES.map((v, i) => (
            <motion.div key={v.t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass rounded-2xl p-7">
              <div className="font-mono text-[11px] tracking-widest text-primary uppercase">0{i + 1}</div>
              <h3 className="font-display text-2xl font-bold mt-2">{v.t}</h3>
              <p className="mt-3 text-foreground/70 leading-relaxed">{v.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 mt-24">
        <div className="relative rounded-3xl glass-strong p-10 md:p-14 text-center overflow-hidden">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <h3 className="font-display text-3xl md:text-4xl font-extrabold">
            Come build the <span className="cyan-gold-text">future</span> with us.
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-neon h-12 rounded-xl px-6">
              <Link to="/courses">See courses</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-6 border-white/20">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
