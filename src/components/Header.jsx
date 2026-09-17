import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Sparkles, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/gallery", label: "Gallery" },
  { to: "/news", label: "News" },
  { to: "/blog", label: "Blog" },
  { to: "/teach", label: "Teach" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
      data-testid="site-header"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 pt-4">
        <div className="glass-strong rounded-2xl flex items-center justify-between px-4 md:px-6 py-3">
        


         <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
  {/* PNG logo image - replace src with your actual file path */}
  <img
    src="/ISAIA.png"   // change to your PNG file location
    alt="ISAI Academy Logo"
    className="h-10 w-auto"          // maintains original height, width scales automatically
  />
  {/* Keep original text section */}
  <div className="leading-tight">
    <div className="font-display text-base md:text-lg font-bold tracking-tight">
      ISAI <span className="cyan-gold-text">ACADEMY</span>
    </div>
    <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
      Learn AI Technology
    </div>
  </div>
</Link>
        
        
        
        
        
        
        
        
        
        
        
        

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-foreground/80 hover:text-foreground"
                  onClick={() => navigate("/dashboard")}
                  data-testid="header-dashboard-btn"
                >
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  {user.name?.split(" ")[0]}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-white/5"
                  onClick={async () => { await logout(); navigate("/"); }}
                  data-testid="header-logout-btn"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-foreground/80 hover:text-foreground"
                  onClick={() => navigate("/login")}
                  data-testid="header-login-btn"
                >
                  Login
                </Button>
                <Button
                  className="btn-neon rounded-lg px-5"
                  onClick={() => navigate("/register")}
                  data-testid="header-enroll-btn"
                >
                  Enroll Now
                </Button>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setOpen((v) => !v)}
            data-testid="mobile-menu-toggle"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-1"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm ${isActive ? "text-primary bg-white/5" : "text-foreground/80"}`
                }
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <>
                <Button onClick={() => { setOpen(false); navigate("/dashboard"); }} className="btn-neon w-full">
                  Dashboard
                </Button>
                <Button variant="outline" onClick={async () => { await logout(); setOpen(false); navigate("/"); }}
                  className="w-full mt-2 border-white/10">Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setOpen(false); navigate("/login"); }}
                  className="w-full border-white/10">Login</Button>
                <Button onClick={() => { setOpen(false); navigate("/register"); }} className="btn-neon w-full mt-2">
                  Enroll Now
                </Button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
