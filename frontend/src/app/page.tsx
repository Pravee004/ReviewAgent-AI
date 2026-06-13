"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GitBranch, ArrowRight, Shield, Zap, Database, Activity, Sparkles, LineChart, 
  GitPullRequest, Lock, Code2, CheckCircle2, ChevronRight, Cpu, Terminal
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f8fafc] font-sans overflow-x-hidden relative">
      
      {/* Premium Radial Glow Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[180px] -z-10 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[130px] -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] -z-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header / Navbar */}
      <header className="border-b border-border/30 bg-[#07090e]/75 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20 relative">
              <GitBranch className="w-5 h-5 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              ReviewAgent
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Interactive Demo</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
            <a href="#tech" className="hover:text-foreground transition-colors">Integrations</a>
          </nav>

          <div>
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <Button className="font-semibold shadow-lg shadow-primary/10 group h-9">
                {isLoggedIn ? (
                  <>
                    Command Center
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Developer Login
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <Badge variant="outline" className="px-3.5 py-1 bg-primary/5 border-primary/20 text-primary font-mono text-xs tracking-wider uppercase gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            v2.4 Enterprise Security Audit
          </Badge>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.1] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
        >
          Automate Pull Request Reviews <br />
          <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
            At AI Security Speed
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-6 leading-relaxed"
        >
          An autonomous AI agent that audits code changes, simulates security checks against OWASP guidelines, and applies sandboxed remediation before you merge.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <Link href={isLoggedIn ? "/dashboard" : "/login"}>
            <Button size="lg" className="px-8 font-bold text-sm h-12 shadow-xl shadow-primary/15 relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              Launch Live Dashboard
              <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#demo">
            <Button size="lg" variant="outline" className="px-8 font-semibold text-sm h-12 bg-white/5 border-white/10 hover:bg-white/10 text-foreground transition-all">
              Watch Interactive Demo
            </Button>
          </a>
        </motion.div>

        {/* Floating Mockup Preview / Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.5 }}
          className="w-full max-w-5xl mt-20 relative rounded-2xl border border-border/40 bg-card/20 backdrop-blur-2xl p-3 shadow-2xl"
          id="demo"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          {/* Header layout controls */}
          <div className="flex items-center justify-between px-3 pb-3 border-b border-border/30">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] text-muted-foreground font-mono select-none">reviewagent-simulation.io</span>
            <div className="w-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 h-[420px] md:h-[480px]">
            {/* Diff View Simulator */}
            <div className="md:col-span-7 bg-[#0d1117] rounded-lg border border-border/20 p-4 font-mono text-[11px] leading-normal overflow-y-auto text-left flex flex-col justify-between">
              <div>
                <div className="text-slate-500 text-xs border-b border-border/20 pb-2 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> src/backend/auth.ts</span>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-wide px-1.5 h-4">Unified Diff</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="text-slate-500 select-none">@@ -15,7 +15,7 @@</div>
                  <div className="text-slate-300">  export async function authenticateUser(req: Request) &#123;</div>
                  <div className="text-slate-300">    const &#123; username, password &#125; = await req.json();</div>
                  <div className="text-slate-300">    </div>
                  <div className="bg-red-500/20 text-red-400 px-1 border-l-2 border-red-500 py-0.5">
                    {"-   const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;"}
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-1 border-l-2 border-green-500 py-0.5">
                    {"+   const query = \"SELECT * FROM users WHERE username = $1 AND password = $2\";"}
                  </div>
                  <div className="bg-red-500/20 text-red-400 px-1 border-l-2 border-red-500 py-0.5">
                    {"-   const result = await db.query(query);"}
                  </div>
                  <div className="bg-green-500/20 text-green-400 px-1 border-l-2 border-green-500 py-0.5">
                    {"+   const result = await db.query(query, [username, password]);"}
                  </div>
                  <div className="text-slate-300">    </div>
                  <div className="text-slate-300">    if (result.rows.length &gt; 0) &#123;</div>
                </div>
              </div>

              <div className="bg-[#161b22] border border-border/20 p-2.5 rounded flex items-center justify-between text-xs mt-4">
                <span className="text-[#8b949e]">Proposed Secure Patch</span>
                <span className="text-green-500 flex items-center gap-1.5 font-semibold">
                  <Shield className="w-3.5 h-3.5" /> OWASP Compliant
                </span>
              </div>
            </div>

            {/* Float Card AI Action Simulator */}
            <div className="md:col-span-5 flex flex-col gap-4 justify-between h-full">
              {/* Card 1: Scanning stepper */}
              <div className="bg-[#0b0e14] rounded-lg border border-border/30 p-4 text-left flex flex-col gap-3.5 shadow-lg flex-1 justify-center">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider flex items-center gap-1">
                  <Cpu className="w-3 h-3 animate-pulse" /> Agent Sandbox Executor
                </span>
                
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px] text-green-foreground font-bold">✓</div>
                    <span className="text-foreground">Backing up original file</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px] text-green-foreground font-bold">✓</div>
                    <span className="text-foreground">Generating secure implementation</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px] text-green-foreground font-bold">✓</div>
                    <span className="text-foreground">Validating code changes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4.5 h-4.5 bg-background border border-primary text-primary rounded-full flex items-center justify-center animate-pulse">
                      <Activity className="w-2.5 h-2.5 animate-spin" />
                    </div>
                    <span className="text-primary font-semibold">Running security verification</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Metrics shift */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="bg-card/75 border border-border rounded-lg p-5 text-left flex flex-col gap-3 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl -z-10" />
                <span className="text-green-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 animate-bounce" /> Fix Applied Successfully
                </span>

                <div className="grid grid-cols-2 gap-4 mt-1 bg-muted/30 border border-border/40 p-3 rounded-lg font-mono">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-muted-foreground uppercase">Security Score</span>
                    <span className="text-base font-bold text-green-500 flex items-center">
                      72 <ArrowRight className="w-3.5 h-3.5 mx-1 text-muted-foreground" /> 98
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-muted-foreground uppercase">Risk Level</span>
                    <span className="text-base font-bold text-green-500 flex items-center">
                      Critical <ArrowRight className="w-3.5 h-3.5 mx-1 text-muted-foreground" /> Low
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-24 max-w-7xl mx-auto px-6" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-widest font-mono">Core Capabilities</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">Enterprise Security Intelligence</p>
          <p className="text-muted-foreground text-sm">
            Everything you need to secure your production build automatically inside your Pull Request lifecycle.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-[#0b0e14]/40 hover:bg-[#0b0e14]/80 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 group relative hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary w-fit group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Vulnerability Scans</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Scans code diffs for SQL injections, secrets disclosure, and authentication loopholes based on OWASP Top 10 guidelines.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-[#0b0e14]/40 hover:bg-[#0b0e14]/80 backdrop-blur-xl transition-all duration-300 hover:border-green-500/30 group relative hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 w-fit group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">One-Click Remediation</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Runs AI agent execution pipelines that backup files, write secure patches, test code logic, and apply fixes automatically.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-[#0b0e14]/40 hover:bg-[#0b0e14]/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 group relative hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500 w-fit group-hover:scale-110 transition-transform">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Telemetry Dashboard</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Complete tracking for vulnerability trends, model accuracy metrics, token consumption, and risk severity indexes.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/50 bg-[#0b0e14]/40 hover:bg-[#0b0e14]/80 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 group relative hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 w-fit group-hover:scale-110 transition-transform">
                  <GitPullRequest className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Webhook Integrations</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Integrates directly with your GitHub repository workspace, listing pull requests dynamically for manual or automated scans.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-20 border-y border-border/30 bg-[#090c13]" id="stats">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 grid-cols-2 md:grid-cols-4 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-primary">450k+</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lines Audited</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-green-500">99.4%</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AI Review Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-purple-500">8.2s</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Turnaround</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-extrabold text-blue-500">1,200h</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Hours Saved</div>
          </div>
        </div>
      </section>

      {/* Tech Stack Parallax Brand Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 text-center" id="tech">
        <div className="max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-widest font-mono">Compatible Ecosystem</h2>
          <p className="text-2xl sm:text-3xl font-bold">Engineered for Modern Deployments</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          {[
            { name: "Next.js (App Router)", color: "text-[#ffffff]" },
            { name: "Prisma & SQLite", color: "text-[#2b3a4a]" },
            { name: "Azure OpenAI", color: "text-[#0078d4]" },
            { name: "Framer Motion", color: "text-[#ff0055]" },
            { name: "Tailwind CSS", color: "text-[#38bdf8]" },
            { name: "GitHub API", color: "text-[#e6edf3]" }
          ].map((tech, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className={`text-sm font-semibold font-mono tracking-wider px-4 py-2 border border-border/30 rounded-lg bg-card/20 select-none ${tech.color}`}
            >
              {tech.name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-primary/20 via-purple-500/10 to-blue-500/10 border border-primary/20 rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-3 max-w-xl text-left">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Ready to Secure Your Main Branch?</h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Unlock enterprise-grade vulnerability isolation, telemetry dashboards, and automated AI fix validations today.
            </p>
          </div>

          <div className="shrink-0">
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <Button size="lg" className="font-bold text-sm h-12 shadow-lg shadow-primary/10 group">
                {isLoggedIn ? "Enter Command Center" : "Get Started Free"}
                <ChevronRight className="w-4.5 h-4.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-10 bg-[#05060a]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <GitBranch className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">ReviewAgent Enterprise</span>
          </div>
          <p>© 2026 ReviewAgent Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
