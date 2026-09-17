import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Linkedin, MessageCircle, AtSign } from "lucide-react";

const SOCIALS = [
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/isaiacademy", color: "#E1306C" },
  { label: "Threads", icon: AtSign, href: "https://www.threads.com/@isaiacademy", color: "#FFFFFF" },
  { label: "YouTube", icon: Youtube, href: "https://www.youtube.com/@ISAIACADEMYOFFICIAL", color: "#FF0033" },
  { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/18SLHbHmE7/", color: "#1877F2" },
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/international-supernova-ai-academy/", color: "#0A66C2" },
  { label: "WhatsApp", icon: MessageCircle, href: "https://whatsapp.com/channel/0029VbCaTWIG3R3lrp0CXf3C", color: "#25D366" },
];

export default function SocialBar() {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2"
      data-testid="floating-social-bar"
    >
      {SOCIALS.map(({ label, icon: Icon, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          data-testid={`floating-social-${label.toLowerCase()}`}
          className="group relative h-11 w-11 rounded-xl glass flex items-center justify-center hover:scale-110 transition-transform"
          style={{ ['--c']: color }}
        >
          <Icon className="h-4 w-4 text-foreground/70 group-hover:text-foreground transition-colors" />
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ boxShadow: `0 0 18px ${color}55, inset 0 0 0 1px ${color}66` }}
          />
        </a>
      ))}
    </motion.div>
  );
}
