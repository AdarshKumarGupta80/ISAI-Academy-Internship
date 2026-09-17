import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Code2, Bot, Brain, ArrowRight, PlayCircle, MapPin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleBg from "@/components/ParticleBg";
import NeuralNet from "@/components/NeuralNet";
import GalleryGrid from "@/components/GalleryGrid";
import CourseCard from "@/components/CourseCard";
import api from "@/lib/api";

const HERO_BG = "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=6d4d070e2b4f6e8932a0f6b6f6f0c8a0";

function Stat({ num, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl md:text-4xl font-extrabold cyan-gold-text">{num}</div>
      <div className="text-sm text-foreground/70 mt-1">{label}</div>
    </div>
  );
}

const FEATURES = [
  { icon: Brain, title: "AI Tutor NOVA", desc: "Personalized practice & instant doubt resolution." },
  { icon: Bot, title: "Robotics Labs", desc: "Hands-on kits, drones & automation projects." },
  { icon: Code2, title: "Live Coding", desc: "Pair-programming and weekly hackathons." },
  { icon: Sparkles, title: "Mentorship", desc: "Industry mentors & portfolio guidance." },
];

export default function Landing() {
  const [stats, setStats] = useState({ students: "12k+", courses: "80+", mentors: "60+" });
  const [courses, setCourses] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    api.get("/courses").then((r) => setCourses(r.data.slice(0, 6))).catch(() => {});
    api.get("/gallery?limit=6").then((r) => setGallery(r.data.slice(0, 6))).catch(() => {});
    api.get("/stats").then((r) => setStats({ students: r.data.students?.toLocaleString() + "+", courses: r.data.courses + "+", mentors: r.data.teachers + "+" })).catch(() => {});
  }, []);

  return (
    <div className="pt-24" data-testid="landing-page">
      <section className="relative min-h-[70vh] flex items-center overflow-hidden rounded-b-3xl" style={{ backgroundImage: `linear-gradient(rgba(2,6,23,0.6), rgba(2,6,23,0.6)), url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <ParticleBg />
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-20 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// ISAI Academy</div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-3 leading-tight">
              Learn <span className="cyan-gold-text">AI, Robotics & Coding</span> with real projects
            </h1>
            <p className="mt-5 text-foreground/75 max-w-2xl">Project-first learning, weekly mentor sessions and a 24×7 AI tutor to help you practice, debug and improve.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="btn-neon h-12 px-6 rounded-xl">
                <Link to="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-6 rounded-xl border-white/20">
                <Link to="/courses">Browse Courses</Link>
              </Button>
              <Button asChild variant="ghost" className="h-12 px-6 rounded-xl">
                <Link to="/offline-center"><MapPin className="mr-2 h-4 w-4"/> Visit Center</Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <Stat num={stats.students} label="Students" />
              <Stat num={stats.courses} label="Courses" />
              <Stat num={stats.mentors} label="Mentors" />
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl glass-strong p-6">
              <NeuralNet className="h-56 w-full" />
              <div className="mt-4 text-sm text-foreground/70">Meet NOVA — your always-on AI tutor for instant help.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Why ISAI</div>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-3">A project-first curriculum, built with industry mentors.</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass rounded-2xl p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="font-display text-lg font-bold mt-3">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Featured Courses</div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold mt-2">Hands-on courses loved by students</h3>
          </div>
          <Button asChild variant="outline" className="border-white/20">
            <Link to="/courses">View all courses <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] tracking-[0.3em] text-primary uppercase">// Gallery</div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold mt-2">Inside the Supernova Hub</h3>
          </div>
          <Button asChild variant="outline" className="border-white/20">
            <Link to="/gallery">View gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-8">
          <GalleryGrid items={gallery} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-20">
        <div className="relative rounded-3xl glass-strong p-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold">Ready to start learning?</h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">Join a cohort, start a project and get mentorship that helps you ship real work.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="btn-neon h-12 px-6 rounded-xl"><Link to="/register">Enroll</Link></Button>
            <Button asChild variant="outline" className="h-12 px-6 rounded-xl border-white/20"><Link to="/contact">Contact</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
