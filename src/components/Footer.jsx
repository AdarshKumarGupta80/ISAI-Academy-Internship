import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MessageCircle,
  Globe,
  AtSign,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const SOCIALS = [
  {
    label: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/isaiacademy",
  },
  {
    label: "Threads",
    icon: AtSign,
    href: "https://www.threads.com/@isaiacademy",
  },
  {
    label: "YouTube",
    icon: Youtube,
    href: "https://www.youtube.com/@ISAIACADEMYOFFICIAL",
  },
  {
    label: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/share/18SLHbHmE7/",
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/international-supernova-ai-academy/",
  },
  {
    label: "WhatsApp",
    icon: MessageCircle,
    href: "https://whatsapp.com/channel/0029VbCaTWIG3R3lrp0CXf3C",
  },
  {
    label: "Website",
    icon: Globe,
    href: "https://www.isaiacademy.in",
  },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/10 bg-background mt-20"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Left Section */}
        <div className="md:col-span-5">
          
          {/* Premium Circular Logo */}
          <div className="flex items-center gap-5">
            <div className="relative">
              
              {/* Outer Glow Border */}
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/40 p-[3px] shadow-[0_0_30px_rgba(0,255,255,0.25)]">
                
                {/* Inner Circle */}
                <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20">
                  <img
                    src="/ISAIA.png"
                    alt="ISAI Academy Logo"
                    className="h-[88px] w-[88px] rounded-full object-cover scale-110"
                  />
                </div>
              </div>

              {/* Extra Glow */}
              <div className="absolute inset-0 rounded-full blur-2xl bg-cyan-400/20 -z-10"></div>
            </div>

            {/* Academy Text */}
            <div>
              <div className="font-display text-3xl font-bold leading-none">
                ISAI <span className="cyan-gold-text">Academy</span>
              </div>

              <p className="font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase mt-2">
                International Supernova AI Academy
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-foreground/70 max-w-md leading-relaxed">
            India's premium AI, Coding & Robotics learning ecosystem —
            from Class 3 to UG/PG. Built for the next generation of
            builders, hackers and innovators.
          </p>

          {/* Address */}
          <div className="mt-6 flex items-start gap-3 text-sm text-foreground/70">
            <MapPin className="h-4 w-4 mt-0.5 text-primary" />
            Kankarbagh, Patna, Bihar, India
          </div>

          {/* Email */}
          <div className="mt-2 flex items-center gap-3 text-sm text-foreground/70">
            <Mail className="h-4 w-4 text-primary" />
            hello@isaiacademy.in
          </div>

          {/* Phone */}
          <div className="mt-2 flex items-center gap-3 text-sm text-foreground/70">
            <Phone className="h-4 w-4 text-primary" />
            +91-8757870948
          </div>
        </div>

        {/* Explore Links */}
        <div className="md:col-span-3">
          <div className="font-mono text-[11px] tracking-[0.25em] text-primary uppercase mb-4">
            Explore
          </div>

          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/courses"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                All Courses
              </Link>
            </li>

            <li>
              <Link
                to="/courses?category=primary"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Class 3–8
              </Link>
            </li>

            <li>
              <Link
                to="/courses?category=secondary"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Class 9–12
              </Link>
            </li>

            <li>
              <Link
                to="/courses?category=higher"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                UG & PG
              </Link>
            </li>

            <li>
              <Link
                to="/offline-center"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Offline Center
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/career"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Career
              </Link>
            </li>

            <li>
              <Link
                to="/internship"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                Internship
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="md:col-span-4">
          <div className="font-mono text-[11px] tracking-[0.25em] text-primary uppercase mb-4">
            Connect
          </div>

          <div className="grid grid-cols-4 gap-3">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300"
                title={label}
                data-testid={`footer-social-${label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5 text-foreground/80 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>

          <div className="mt-6 text-xs text-foreground/50 leading-relaxed">
            Follow us for free tutorials, AI news, student achievements,
            workshops, hackathons and future technology updates.
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-foreground/50">
          
          <div>
            © {new Date().getFullYear()} ISAI Academy. Knowledge.
            Innovation. Excellence.
          </div>

          <div className="font-mono tracking-widest text-primary">
            Made By Shankar Singh
          </div>
        </div>
      </div>
    </footer>
  );
}