"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GitPullRequest, ArrowLeft, CheckCircle2, Activity, ShieldAlert, Plus, X, Loader2, AlertCircle, Calendar, ShieldCheck 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Dictionary of Demo Pull Requests mapped by repository name
const demoPullRequests: Record<string, Array<{ number: number; title: string; author: string }>> = {
  "acme-corp/frontend": [
    { number: 142, title: "Add GitHub OAuth Login", author: "johndoe" },
    { number: 143, title: "Fix JWT Validation", author: "janedoe" },
    { number: 144, title: "Refactor Auth Middleware", author: "alexsmith" }
  ],
  "acme-corp/backend": [
    { number: 201, title: "Secure API tokens storage", author: "janedoe" },
    { number: 204, title: "Optimize SQL queries in streaming handler", author: "johndoe" },
    { number: 208, title: "Implement webhooks rate limiting", author: "alexsmith" }
  ],
  "acme-corp/infrastructure": [
    { number: 301, title: "Add Cloudflare SSL configuration", author: "alexsmith" },
    { number: 305, title: "Setup Docker compose file", author: "johndoe" }
  ]
};

// Fallback logic if the connected repository is not one of the pre-defined ones
const getDemoPullRequestsForRepo = (repoName: string) => {
  const normalized = repoName.toLowerCase();
  if (normalized.includes("frontend")) {
    return demoPullRequests["acme-corp/frontend"];
  }
  if (normalized.includes("backend")) {
    return demoPullRequests["acme-corp/backend"];
  }
  if (normalized.includes("infrastructure")) {
    return demoPullRequests["acme-corp/infrastructure"];
  }
  
  return [
    { number: 101, title: `Refactor ${repoName.split('/')[1] || 'core'} modules`, author: "dev_alice" },
    { number: 102, title: "Audit dependencies for vulnerabilities", author: "sec_bob" },
    { number: 103, title: "Implement security headers middleware", author: "expert_charlie" }
  ];
};

export default function PRListPage() {
  const router = useRouter();
  const [prs, setPrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState("");
  
  // PR Dropdown States
  const [availablePrs, setAvailablePrs] = useState<Array<{ number: number; title: string; author: string }>>([]);
  const [selectedPrIndex, setSelectedPrIndex] = useState("0");

  // Analysis Scope States
  const [scopeSecurity, setScopeSecurity] = useState(true);
  const [scopeQuality, setScopeQuality] = useState(true);
  const [scopeAuth, setScopeAuth] = useState(true);
  const [scopeOwasp, setScopeOwasp] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch PR list
  const fetchPrs = () => {
    fetch("http://localhost:3001/api/prs")
      .then((res) => res.json())
      .then((data) => {
        setPrs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrs();
  }, []);

  // Fetch repositories when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setSubmitError(null);
      fetch("http://localhost:3001/api/repositories")
        .then((res) => res.json())
        .then((data) => {
          setRepositories(data);
          if (data.length > 0) {
            setSelectedRepoId(data[0].id.toString());
          }
        })
        .catch(console.error);
    }
  }, [isModalOpen]);

  // Update available pull requests dropdown when selectedRepoId changes
  useEffect(() => {
    if (selectedRepoId && repositories.length > 0) {
      const repo = repositories.find((r) => r.id.toString() === selectedRepoId);
      if (repo) {
        const prList = getDemoPullRequestsForRepo(repo.name);
        setAvailablePrs(prList);
        if (prList.length > 0) {
          setSelectedPrIndex("0");
        }
      }
    }
  }, [selectedRepoId, repositories]);

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepoId || availablePrs.length === 0 || !selectedPrIndex) {
      setSubmitError("Please select a repository and an available pull request.");
      return;
    }

    const prIndex = Number(selectedPrIndex);
    const targetPr = availablePrs[prIndex];
    if (!targetPr) {
      setSubmitError("Selected pull request is invalid.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("http://localhost:3001/api/prs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          repoId: Number(selectedRepoId),
          prNumber: targetPr.number,
          title: targetPr.title,
          author: targetPr.author
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create PR");
      }

      setIsModalOpen(false);
      
      // Redirect to the newly created PR detail page with analyze=true trigger
      router.push(`/pr/${data.id}?analyze=true`);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to run analysis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return <span className="text-muted-foreground text-xs font-mono">—</span>;
    
    const colors: Record<string, string> = {
      Critical: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
      High: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
      Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
      Low: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
    };

    return (
      <Badge variant="outline" className={`font-semibold ${colors[risk] || "bg-muted text-muted-foreground"}`}>
        {risk}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Completed: "bg-green-500/10 text-green-500 border-green-500/20",
      Flagged: "bg-destructive/10 text-destructive border-destructive/20",
      Reviewing: "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse",
      Unanalyzed: "bg-muted text-muted-foreground border-muted-foreground/15"
    };

    return (
      <Badge variant="outline" className={`font-semibold ${colors[status] || ""}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PR Analysis History</h1>
            <p className="text-muted-foreground mt-1">
              Browse all pull requests reviewed by the AI Agent.
            </p>
          </div>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Run Analysis
        </Button>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Run PR Analysis</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a repository and an available pull request to audit.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleRunAnalysis} className="p-6 flex flex-col gap-4">
                {submitError && (
                  <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Repository Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Repository *
                  </label>
                  {repositories.length === 0 ? (
                    <div className="text-sm text-amber-500 flex items-center gap-1.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>No repositories connected. 
                        <Link href="/repositories" className="underline ml-1 font-semibold hover:text-amber-400">
                          Connect one here
                        </Link>
                      </span>
                    </div>
                  ) : (
                    <select
                      required
                      className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={selectedRepoId}
                      onChange={(e) => setSelectedRepoId(e.target.value)}
                      disabled={isSubmitting}
                    >
                      {repositories.map((repo) => (
                        <option key={repo.id} value={repo.id} className="bg-background">
                          {repo.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Available Pull Requests Selection */}
                {repositories.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Available Pull Requests *
                    </label>
                    <select
                      required
                      className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      value={selectedPrIndex}
                      onChange={(e) => setSelectedPrIndex(e.target.value)}
                      disabled={isSubmitting || availablePrs.length === 0}
                    >
                      {availablePrs.length === 0 ? (
                        <option value="" className="bg-background">No pull requests found</option>
                      ) : (
                        availablePrs.map((pr, index) => (
                          <option key={pr.number} value={index} className="bg-background">
                            PR #{pr.number} - {pr.title} ({pr.author})
                          </option>
                        ))
                      )}
                    </select>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      * Demo Pull Requests displayed since direct GitHub integration is offline.
                    </p>
                  </div>
                )}

                {/* Analysis Scope Section */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Analysis Scope
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-muted/20 border border-border rounded-lg">
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={scopeSecurity}
                        onChange={(e) => setScopeSecurity(e.target.checked)}
                        className="rounded border-border bg-muted/40 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1 w-3.5 h-3.5"
                      />
                      Security Vulnerabilities
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={scopeQuality}
                        onChange={(e) => setScopeQuality(e.target.checked)}
                        className="rounded border-border bg-muted/40 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1 w-3.5 h-3.5"
                      />
                      Code Quality
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={scopeAuth}
                        onChange={(e) => setScopeAuth(e.target.checked)}
                        className="rounded border-border bg-muted/40 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1 w-3.5 h-3.5"
                      />
                      Authentication Issues
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={scopeOwasp}
                        onChange={(e) => setScopeOwasp(e.target.checked)}
                        className="rounded border-border bg-muted/40 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-1 w-3.5 h-3.5"
                      />
                      OWASP Top 10 Checks
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 font-medium"
                    disabled={isSubmitting || repositories.length === 0 || availablePrs.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initiating...
                      </>
                    ) : (
                      "Run Analysis"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-primary" />
              All Analyzed Pull Requests
            </CardTitle>
            <CardDescription>
              Select any pull request below to inspect specific code issues and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-20">
                <Activity className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : prs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-muted-foreground gap-4 border border-dashed border-border rounded-lg bg-muted/10">
                <GitPullRequest className="w-16 h-16 text-muted-foreground/20" />
                <div className="text-center space-y-1.5 max-w-sm">
                  <p className="font-semibold text-foreground text-lg">No PR Analyses Yet</p>
                  <p className="text-sm text-muted-foreground">
                    You haven't run any pull request analyses. Start by running a new analysis on a connected repository.
                  </p>
                </div>
                <Button className="gap-2 mt-2 font-medium" onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Run First Analysis
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium">Pull Request</th>
                      <th className="px-6 py-4 font-medium">Repository</th>
                      <th className="px-6 py-4 font-medium">Author</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Risk Level</th>
                      <th className="px-6 py-4 font-medium">Created Time</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prs.map((pr) => (
                      <tr
                        key={pr.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          <Link
                            href={`/pr/${pr.id}`}
                            className="hover:underline flex items-center gap-2 text-foreground"
                          >
                            {pr.status === "Completed" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            ) : pr.status === "Reviewing" ? (
                              <Activity className="w-4 h-4 text-blue-500 animate-pulse shrink-0" />
                            ) : pr.status === "Unanalyzed" ? (
                              <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
                            ) : (
                              <ShieldAlert className="w-4 h-4 text-destructive shrink-0" />
                            )}
                            <span>{pr.title}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{pr.repo?.name}</td>
                        <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                          {pr.author}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(pr.status)}
                        </td>
                        <td className="px-6 py-4">
                          {getRiskBadge(pr.risk)}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-xs">
                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                            {new Date(pr.createdAt).toLocaleString(undefined, { 
                              dateStyle: 'medium', 
                              timeStyle: 'short' 
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {pr.status === "Unanalyzed" ? (
                              <Link href={`/pr/${pr.id}?analyze=true`}>
                                <Button size="sm" className="h-8 font-semibold shadow-sm">
                                  Analyze PR
                                </Button>
                              </Link>
                            ) : (
                              <>
                                <Link href={`/pr/${pr.id}`}>
                                  <Button size="sm" variant="outline" className="h-8 font-medium">
                                    View Report
                                  </Button>
                                </Link>
                                <Link href={`/pr/${pr.id}?analyze=true`}>
                                  <Button size="sm" variant="ghost" className="h-8 font-medium text-muted-foreground hover:text-foreground">
                                    Re-analyze
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
