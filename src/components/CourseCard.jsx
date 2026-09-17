import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, BookOpen, ArrowUpRight, Users } from "lucide-react";

export default function CourseCard({ course, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-primary/50 transition-all"
      data-testid={`course-card-${course.id}`}
    >
      <Link to={`/courses/${course.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.cover}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur border border-white/10 text-primary">
              {course.category === "primary" ? "Class 3–8" : course.category === "secondary" ? "Class 9–12" : "UG / PG"}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase bg-secondary/20 backdrop-blur border border-secondary/40 text-secondary">
              {course.level}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{course.tagline}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-foreground/60">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {course.duration}</span>
            <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5 text-primary" /> {course.lessons} lessons</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> {course.students.toLocaleString()}</span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Starts at</div>
              <div className="font-display font-bold text-xl"><span className="cyan-gold-text">₹{course.price.toLocaleString()}</span></div>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="font-bold text-sm">{course.rating}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View details <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
