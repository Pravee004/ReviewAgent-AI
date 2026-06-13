"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  GitPullRequest, CheckCircle2, ShieldAlert, Code2, Zap, ArrowLeft, Copy, Sparkles, Check, FileCode, AlertCircle, Loader2, Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ReasoningTrace } from "@/components/ReasoningTrace";

const mockDiff = `@@ -15,7 +15,7 @@
  export async function authenticateUser(req: Request) {
    const { username, password } = await req.json();
    
-  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
+  const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
-  const result = await db.query(query);
+  const result = await db.query(query, [username, password]);
    
    if (result.rows.length > 0) {`;

// Component for copying text with success indicator
const CopyFixButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      onClick={handleCopy}
      className="gap-1.5 h-8 text-xs font-semibold px-3 bg-muted border border-border hover:bg-muted/80 shrink-0"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          Copy Fix
        </>
      )}
    </Button>
  );
};

export default function PRDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const pathname = usePathname();

  const [prData, setPrData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fixing State hooks
  const [isFixing, setIsFixing] = useState(false);
  const [fixingStep, setFixingStep] = useState(0);
  const [fixComplete, setFixComplete] = useState(false);
  const [fixedFileName, setFixedFileName] = useState("src/backend/auth.ts");
  const [oldRisk, setOldRisk] = useState("Critical");
  const [oldScore, setOldScore] = useState(72);

  useEffect(() => {
    // 1. Fetch initial PR details
    fetch(`http://localhost:3001/api/pr/${id}`)
      .then(res => res.json())
      .then(data => {
        setPrData(data);
        setIsInitializing(false);

        // 2. Read query string client-side directly
        const queryParams = new URLSearchParams(window.location.search);
        const shouldAnalyze = queryParams.get("analyze") === "true";
        
        if (shouldAnalyze) {
          // Clear query params to prevent re-trigger on manual page refreshes
          router.replace(pathname);
          setIsAnalyzing(true);
        } else if (data.status === "Reviewing") {
          setIsAnalyzing(true);
        }
      })
      .catch(err => {
        console.error(err);
        setIsInitializing(false);
      });
  }, [id, router, pathname]);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/pr/${id}/analyze`, {
        method: "POST"
      });
      if (res.ok) {
        const updatedPr = await res.json();
        setPrData(updatedPr);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const approveFixes = async () => {
    if (prData && prData.findings && prData.findings.length > 0) {
      setFixedFileName(prData.findings[0].fileName || "src/backend/auth.ts");
    } else {
      setFixedFileName("src/backend/auth.ts");
    }
    setOldRisk(prData.risk || "Critical");
    setOldScore(100 - (prData.riskScore || 0));

    setIsFixing(true);
    setFixingStep(0);
    setFixComplete(false);

    // Simulate AI Agent execution steps
    const stepInterval = setInterval(() => {
      setFixingStep((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 2000); // 2s * 5 steps = 10s total duration

    // Perform API call and transition to success screen after 10 seconds
    setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/pr/${id}`, { method: 'POST' });
        if (res.ok) {
          const updatedPr = await res.json();
          setPrData(updatedPr);
          setFixComplete(true);
        }
      } catch (err) {
        console.error(err);
        setIsFixing(false);
      }
    }, 10000);
  };

  const handleCloseFixModal = () => {
    setIsFixing(false);
    setFixComplete(false);
  };

  if (isInitializing || !prData) {
    return (
      <div className="flex justify-center items-center p-20 min-h-[60vh]">
        <Sparkles className="w-8 h-8 animate-pulse text-primary" />
      </div>
    );
  }

  // Welcome page for unanalyzed PR
  if (!isAnalyzing && prData.status === "Unanalyzed") {
    return (
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-12">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/pr">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              PR Analysis
            </span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border bg-card/40 backdrop-blur-xl relative overflow-hidden text-center p-8 flex flex-col items-center gap-6 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-purple-500 to-blue-500" />
            
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner relative mt-4">
              <GitPullRequest className="w-12 h-12 text-primary" />
              <div className="absolute bottom-2 right-2 bg-background p-1 rounded-full border border-border">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Ready for AI Security Analysis</h2>
              <p className="text-xs text-muted-foreground font-mono">
                {prData.repo?.name} #{prData.prNumber} • {prData.title}
              </p>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                This pull request has not been audited yet. Trigger the ReviewAgent AI agent to review the code diffs for security vulnerabilities, logical bugs, and style violations.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs mt-2 mb-4">
              <Button 
                onClick={handleStartAnalysis} 
                className="w-full h-11 gap-2 font-semibold shadow-lg shadow-primary/15"
              >
                <Sparkles className="w-4 h-4" />
                Analyze PR Now
              </Button>
              <Link href="/pr" className="w-full">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                  Cancel and Go Back
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Get color and text based on risk score (0-100)
  const getRiskDetails = (score: number) => {
    if (score >= 81) return { label: "Critical Risk", color: "text-destructive border-destructive/20 bg-destructive/10", border: "border-destructive" };
    if (score >= 61) return { label: "High Risk", color: "text-orange-500 border-orange-500/20 bg-orange-500/10", border: "border-orange-500" };
    if (score >= 31) return { label: "Medium Risk", color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10", border: "border-yellow-500" };
    return { label: "Low Risk", color: "text-green-500 border-green-500/20 bg-green-500/10", border: "border-green-500" };
  };

  // Group findings to represent affected files
  const getAffectedFiles = () => {
    if (!prData.findings || prData.findings.length === 0) {
      return [{ path: "src/backend/auth.ts", maxSeverity: "Low", count: 0 }];
    }
    
    const filesMap: Record<string, { path: string, maxSeverity: string, count: number }> = {};
    
    prData.findings.forEach((finding: any) => {
      const path = finding.fileName || "src/backend/auth.ts";
      const severity = finding.severity || "Low";
      
      if (!filesMap[path]) {
        filesMap[path] = { path, maxSeverity: severity, count: 0 };
      }
      filesMap[path].count++;
      
      const ranks: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      const currentRank = ranks[severity] || 1;
      const existingRank = ranks[filesMap[path].maxSeverity] || 1;
      if (currentRank > existingRank) {
        filesMap[path].maxSeverity = severity;
      }
    });
    
    return Object.values(filesMap);
  };

  const riskDetails = getRiskDetails(prData.riskScore || 0);
  const affectedFiles = getAffectedFiles();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/pr">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{prData.title}</h1>
              {!isAnalyzing && (
                <Badge variant={prData.status === "Completed" ? "outline" : "destructive"}>
                  {prData.status} {prData.risk && `(${prData.risk})`}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
              <GitPullRequest className="w-4 h-4" /> {prData.repo?.name} #{prData.prNumber} • opened by {prData.author}
            </p>
          </div>
        </div>
        
        {/* Re-analyze Action Button */}
        {!isAnalyzing && (
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleStartAnalysis}
              className="gap-2 font-semibold shadow-sm"
              variant="outline"
              size="sm"
            >
              <Zap className="w-4 h-4 text-primary" />
              Re-analyze PR
            </Button>
          </div>
        )}
      </div>

      {isAnalyzing ? (
        <div className="py-8">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="mb-4 text-primary"
            >
              <Sparkles className="w-10 h-10 opacity-80" />
            </motion.div>
            <h2 className="text-xl font-medium text-foreground">Agent is executing PR audit sequence...</h2>
          </div>
          <ReasoningTrace prId={Number(id)} onComplete={handleAnalysisComplete} />
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          {/* Section 1: Security Intelligence Overview Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-4"
          >
            {/* Risk Score Gauge */}
            <Card className="flex flex-col items-center justify-center p-6 text-center border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Risk Score
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="var(--border)" strokeWidth="8" fill="transparent" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke={prData.riskScore >= 80 ? "var(--destructive)" : prData.riskScore >= 50 ? "#f97316" : "#22c55e"} 
                    strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (prData.riskScore || 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{prData.riskScore || 0}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">of 100</span>
                </div>
              </div>
              <Badge variant="outline" className={`font-semibold px-2 py-0.5 mt-2 ${riskDetails.color}`}>
                {riskDetails.label}
              </Badge>
            </Card>

            {/* Confidence Score */}
            <Card className="flex flex-col items-center justify-center p-6 text-center border-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Confidence Score
              </span>
              <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="var(--border)" strokeWidth="8" fill="transparent" 
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="var(--primary)" 
                    strokeWidth="8" fill="transparent" 
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (prData.confidenceScore || 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{prData.confidenceScore || 0}%</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Accuracy</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground mt-2">Audit certainty</span>
            </Card>

            {/* AI Summary Card */}
            <Card className="md:col-span-2 border-border flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center">
                <p className="text-sm text-foreground leading-relaxed">
                  {prData.aiSummary || "No summary generated for this pull request analysis."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: Affected Files List */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-primary" />
                  Affected Files Risk Mapping ({affectedFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {affectedFiles.map((file) => {
                    const fileRisk = getRiskDetails(file.maxSeverity === "Critical" ? 90 : file.maxSeverity === "High" ? 70 : file.maxSeverity === "Medium" ? 40 : 10);
                    return (
                      <div 
                        key={file.path} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Code2 className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-mono font-medium text-foreground truncate">
                            {file.path}
                          </span>
                        </div>
                        <Badge variant="outline" className={`font-semibold shrink-0 ml-2 ${fileRisk.color}`}>
                          {fileRisk.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: Detailed Diff View & AI Findings */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Diff View */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
              className="xl:col-span-2"
            >
              <Card className="h-full border-border flex flex-col">
                <CardHeader className="py-4 border-b border-border bg-muted/30 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-mono flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> src/backend/auth.ts
                  </CardTitle>
                  <Badge className="font-mono text-[10px]">Unified Diff</Badge>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto bg-[#0d1117] text-[#e6edf3] flex-1">
                  <pre className="text-sm font-mono p-4 leading-relaxed whitespace-pre-wrap">
                    <code>
                      {mockDiff.split("\n").map((line, i) => (
                        <div 
                          key={i} 
                          className={`px-2 ${
                            line.startsWith("+") ? "bg-green-500/20 text-green-400" : 
                            line.startsWith("-") ? "bg-red-500/20 text-red-400" : "opacity-80"
                          }`}
                        >
                          {line}
                        </div>
                      ))}
                    </code>
                  </pre>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Findings Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full flex flex-col border-border relative overflow-hidden bg-muted/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Security Findings & Fixes
                  </CardTitle>
                  <CardDescription>
                    The agent isolated {prData.findings.length} findings in this code review.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-[500px] pr-4">
                    {prData.findings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-3 border border-dashed border-border rounded-lg bg-green-500/5 mt-4">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                        <p className="font-semibold text-foreground text-sm">All Findings Resolved</p>
                        <p className="text-xs text-muted-foreground">
                          The security fixes have been successfully applied and verified by the AI agent. No issues remaining.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {prData.findings.map((finding: any, index: number) => (
                          <div key={finding.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={finding.severity === "Critical" ? "destructive" : "secondary"} 
                                className="flex items-center gap-1 font-semibold"
                              >
                                {finding.severity === "Critical" ? <ShieldAlert className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />} 
                                {finding.severity}
                              </Badge>
                              <Badge variant="outline" className="font-semibold text-xs">
                                {finding.category}
                              </Badge>
                              {finding.lineNumber && (
                                <span className="text-xs text-muted-foreground ml-auto font-mono">
                                  Line {finding.lineNumber}
                                </span>
                              )}
                            </div>
                            <h3 className={`font-bold text-sm ${finding.severity === "Critical" ? "text-destructive" : "text-foreground"}`}>
                              {finding.severity} Severity {finding.category} Issue
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {finding.description}
                            </p>
                            
                            {/* Recommended Fix Box */}
                            {finding.fixSuggestion && (
                              <div className="bg-background rounded-lg border border-border p-3.5 relative flex flex-col gap-2.5">
                                <div className="flex items-center justify-between border-b border-border pb-2">
                                  <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">
                                    Recommended Fix
                                  </span>
                                  <CopyFixButton code={finding.fixSuggestion} />
                                </div>
                                <pre className="text-xs font-mono whitespace-pre-wrap text-[#e6edf3] bg-[#0d1117] p-2 rounded border border-border/60">
                                  <code>{finding.fixSuggestion}</code>
                                </pre>
                              </div>
                            )}
                            {index < prData.findings.length - 1 && <Separator className="bg-border/50 mt-6" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <div className="p-4 border-t border-border bg-background/50 backdrop-blur">
                  <Button 
                    className="w-full gap-2 font-semibold" 
                    variant={prData.status === 'Completed' ? "secondary" : "default"} 
                    disabled={prData.status === 'Completed' || isFixing}
                    onClick={approveFixes}
                  >
                    {isFixing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fixing PR...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        {prData.status === 'Completed' ? "Fixes Applied" : "Approve Proposed Fixes"}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* AI Agent Applying Fixes Modal */}
      <AnimatePresence>
        {isFixing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative p-6 flex flex-col gap-6"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />
              
              {!fixComplete ? (
                <>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20 text-green-500 animate-pulse">
                      <Activity className="w-8 h-8 animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">AI Security Agent Executing...</h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applying proposed secure remediation pattern.
                      </p>
                    </div>
                  </div>

                  {/* Stepper progress */}
                  <div className="flex flex-col gap-4 mt-2">
                    {[
                      "Backing up original file",
                      "Generating secure implementation",
                      "Validating code changes",
                      "Running security verification",
                      "Updating PR findings"
                    ].map((step, idx) => {
                      const isCompleted = fixingStep > idx;
                      const isActive = fixingStep === idx;

                      return (
                        <div key={idx} className="flex items-center gap-3.5">
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-semibold transition-all duration-300 ${
                              isCompleted 
                                ? "bg-green-500 border-green-500 text-green-foreground" 
                                : isActive 
                                ? "bg-background border-green-500 text-green-500 ring-2 ring-green-500/20" 
                                : "bg-background border-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : isActive ? (
                              <Loader2 className="w-3 h-3 animate-spin text-green-500" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span 
                            className={`text-sm font-medium transition-all duration-300 ${
                              isActive 
                                ? "text-green-500 font-semibold" 
                                : isCompleted 
                                ? "text-foreground opacity-60" 
                                : "text-muted-foreground"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Visual progress bar */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <motion.div 
                      className="h-full bg-green-500"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(fixingStep / 4) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-5 text-center py-4"
                >
                  <div className="p-3 bg-green-500/10 rounded-full border border-green-500/20 text-green-500">
                    <CheckCircle2 className="w-12 h-12 stroke-[1.5] animate-bounce" />
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Fix Applied Successfully</h2>
                    <p className="text-xs text-muted-foreground font-mono">
                      File Updated: {fixedFileName}
                    </p>
                  </div>

                  <div className="w-full bg-muted/20 border border-border rounded-lg p-4 grid grid-cols-2 gap-4 text-left font-mono mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Security Score</span>
                      <span className="text-sm font-semibold text-green-500">
                        {oldScore} → 98
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Level</span>
                      <span className="text-sm font-semibold text-green-500">
                        {oldRisk} → Low
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-4 font-semibold shadow-lg shadow-green-500/10" 
                    onClick={handleCloseFixModal}
                  >
                    Close & View Report
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
