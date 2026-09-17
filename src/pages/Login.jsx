import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import ParticleBg from "@/components/ParticleBg";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import GithubLoginButton from "@/components/GithubLoginButton";
import OtpLogin from "@/components/OtpLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.ok) {
      toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      toast.error(res.error || "Login failed");
    }
  };

  const quick = (em, pw) => { setEmail(em); setPassword(pw); };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12" data-testid="login-page">
      <ParticleBg variant="minimal" />
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-strong rounded-3xl w-full max-w-md p-8 shadow-card-elevated relative"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <div>
            <div className="font-display font-bold text-lg">Welcome back</div>
            <div className="font-mono text-[10px] tracking-widest text-primary uppercase">// ISAI Academy</div>
          </div>
        </div>

        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-white/5 border border-white/10 p-1 h-auto">
            <TabsTrigger value="password" data-testid="tab-password">Password</TabsTrigger>
            <TabsTrigger value="otp" data-testid="tab-otp">OTP (Email / Phone)</TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="mt-5">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                       placeholder="you@email.com" className="mt-2 bg-white/5 border-white/10" data-testid="login-email" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                       placeholder="••••••••" className="mt-2 bg-white/5 border-white/10" data-testid="login-password" />
              </div>
              <Button type="submit" disabled={busy} className="btn-neon w-full h-12 rounded-xl" data-testid="login-submit">
                {busy ? "Signing in…" : "Sign in"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="otp" className="mt-5">
            <OtpLogin />
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleLoginButton label="Continue with Google" />
        <div className="h-2" />
        <GithubLoginButton label="Continue with GitHub" />

        <div className="mt-5 text-sm text-foreground/70 text-center">
          New here?{" "}
          <Link to="/register" className="text-primary font-semibold" data-testid="goto-register">Create an account</Link>
        </div>
        <div className="mt-2 text-xs text-foreground/55 text-center">
          Want to teach with us?{" "}
          <Link to="/teach" className="text-secondary font-semibold" data-testid="goto-teach">Apply as a teacher</Link>
        </div>

        {/* <div className="mt-6 pt-6 border-t border-white/10"> */}
          {/* <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-2">Demo accounts</div> */}
          {/* <div className="grid grid-cols-3 gap-2 text-[11px]"> */}
            {/* <button type="button" onClick={() => quick("admin@isaiacademy.in", "Admin@ISAI2026")} */}
                    {/* // className="px-2 py-2 rounded-md border border-white/10 hover:border-primary/40" data-testid="demo-admin"> */}
              {/* Admin */}
            {/* </button> */}
            {/* <button type="button" onClick={() => quick("teacher@isaiacademy.in", "Teacher@2026")} */}
                    {/* // className="px-2 py-2 rounded-md border border-white/10 hover:border-primary/40" data-testid="demo-teacher"> */}
              {/* Teacher */}
            {/* </button> */}
            {/* <button type="button" onClick={() => quick("student@isaiacademy.in", "Student@2026")} */}
                    {/* // className="px-2 py-2 rounded-md border border-white/10 hover:border-primary/40" data-testid="demo-student"> */}
              {/* Student */}
            {/* </button> */}
          {/* </div> */}
        {/* </div> */}
      </motion.div>
    </div>
  );
}
