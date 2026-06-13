"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, User, Lock, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGitHubSubmitting, setIsGitHubSubmitting] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/");
    }
  }, [router]);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLoggedIn", "true");
    // Dispatch a custom event so LayoutClient is immediately notified
    window.dispatchEvent(new Event("auth-state-change"));
    router.push("/");
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simulate standard API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username.trim() === "admin" && password === "admin") {
      handleLoginSuccess();
    } else {
      setError("Invalid username or password. (Use 'admin' / 'admin' for demo)");
      setIsSubmitting(false);
    }
  };

  const handleGitHubSubmit = async () => {
    setError(null);
    setIsGitHubSubmitting(true);

    // Simulate GitHub OAuth handshake delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    handleLoginSuccess();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Decorative Radial Gradients for Premium Feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-4 z-10"
      >
        <Card className="bg-card/40 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
          
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              PR Reviewer Agent
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Sign in to manage and analyze your pull requests.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            {/* GitHub OAuth Button */}
            <Button
              onClick={handleGitHubSubmit}
              disabled={isSubmitting || isGitHubSubmitting}
              className="w-full h-11 gap-3 bg-[#24292f] hover:bg-[#2f363d] text-white border border-border/60 shadow-md font-medium text-sm transition-all"
            >
              {isGitHubSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white shrink-0">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              {isGitHubSubmitting ? "Connecting with GitHub..." : "Continue with GitHub"}
            </Button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                or use credentials
              </span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            {/* Credentials Login Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting || isGitHubSubmitting}
                  className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="e.g. admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting || isGitHubSubmitting}
                  className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isGitHubSubmitting}
                className="w-full h-11 mt-6 font-semibold shadow-lg shadow-primary/10 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
