import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ParticleBg from "@/components/ParticleBg";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import GithubLoginButton from "@/components/GithubLoginButton";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "student" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setBusy(true);
    const res = await register(form);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome to ISAI Academy, ${res.user.name.split(" ")[0]}! 🚀`);
      navigate("/dashboard", { replace: true });
    } else {
      toast.error(res.error || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12" data-testid="register-page">
      <ParticleBg variant="minimal" />
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-strong rounded-3xl w-full max-w-md p-8 shadow-card-elevated"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="font-display font-bold text-lg">Create your account</div>
            <div className="font-mono text-[10px] tracking-widest text-primary uppercase">// Join 12,000+ learners</div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Full name</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                   className="mt-2 bg-white/5 border-white/10" data-testid="register-name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                   className="mt-2 bg-white/5 border-white/10" data-testid="register-email" />
          </div>
          <div>
            <Label>Phone (optional)</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                   className="mt-2 bg-white/5 border-white/10" data-testid="register-phone" />
          </div>
          <div>
            <Label>Password</Label>
            <Input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                   className="mt-2 bg-white/5 border-white/10" placeholder="min 6 characters" data-testid="register-password" />
          </div>
          <div>
            <Label className="mb-3 block">I am a…</Label>
            <RadioGroup value={form.role} onValueChange={(v) => setForm({ ...form, role: v })} className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${form.role === "student" ? "border-primary bg-primary/5 text-primary" : "border-white/10"}`}>
                <RadioGroupItem value="student" data-testid="role-student" /> Student
              </label>
              <label className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${form.role === "parent" ? "border-primary bg-primary/5 text-primary" : "border-white/10"}`}>
                <RadioGroupItem value="parent" data-testid="role-parent" /> Parent
              </label>
            </RadioGroup>
          </div>

          <Button type="submit" disabled={busy} className="btn-neon w-full h-12 rounded-xl" data-testid="register-submit">
            {busy ? "Creating…" : "Create account"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleLoginButton label="Sign up with Google" />
        <div className="h-2" />
        <GithubLoginButton label="Sign up with GitHub" />

        <div className="mt-5 text-sm text-foreground/70 text-center">
          Already have one?{" "}
          <Link to="/login" className="text-primary font-semibold" data-testid="goto-login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
