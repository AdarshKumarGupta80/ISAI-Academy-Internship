import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Target, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ROLES = [
  { title: "AI Research Intern", desc: "Work on small research problems and prototyping ML models." },
  { title: "Frontend Intern", desc: "Build UI components, pages and improve accessibility." },
  { title: "Robotics Intern", desc: "Assist with hardware labs, sensors and control code." },
  { title: "Data Science Intern", desc: "Analyze datasets, create visualizations and reports." },
];

export default function Internship() {
  return (
    <div className="pt-28 pb-24" data-testid="internship-page">
      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Internship</div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-3 leading-[1.05] tracking-tight">
            Hands-on internships for the <span className="cyan-gold-text">next generation</span> of builders
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-foreground/75 leading-relaxed">
            ISAI Academy runs short-term, project-first internships for motivated students who want to
            learn by building. Work with mentors, ship real features, and graduate with a portfolio piece
            that shows what you can do.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <div className="font-display text-xl font-bold">Program Overview</div>
            </div>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Internships are 6–12 week guided projects with weekly mentorship sessions. We focus on
              meaningful outcomes: a deployed demo, clean code, and a short writeup explaining your
              approach and learnings.
            </p>

            <ul className="mt-4 space-y-2 text-foreground/70">
              <li className="flex items-start gap-3"><Calendar className="h-4 w-4 text-primary mt-1"/> 6–12 weeks, part-time
              </li>
              <li className="flex items-start gap-3"><Users className="h-4 w-4 text-primary mt-1"/> Mentor-led cohorts
              </li>
              <li className="flex items-start gap-3"><Target className="h-4 w-4 text-primary mt-1"/> Project-first & portfolio-ready
              </li>
            </ul>

            <div className="mt-6">
              <Button asChild className="btn-neon h-12 rounded-xl px-6">
                <Link to="/contact">Apply / Enquire</Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">Open Roles</div>
            <div className="mt-4 grid gap-4">
              {ROLES.map((r) => (
                <div key={r.title} className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display text-lg font-bold">{r.title}</div>
                      <div className="text-xs text-foreground/60 mt-1">{r.desc}</div>
                    </div>
                    <div className="text-sm text-primary">Part-time</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 mt-20">
        <div className="relative rounded-3xl glass-strong p-10 md:p-14 text-center overflow-hidden">
          <h3 className="font-display text-3xl md:text-4xl font-extrabold">
            Want to intern with us? <span className="cyan-gold-text">Let's talk.</span>
          </h3>
          <p className="mt-4 text-foreground/70">Email <a href="mailto:hello@isaiacademy.in" className="text-primary">hello@isaiacademy.in</a> with your CV and a short note.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-neon h-12 rounded-xl px-6">
              <Link to="/contact">Contact</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl px-6 border-white/20">
              <Link to="/courses">See courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
