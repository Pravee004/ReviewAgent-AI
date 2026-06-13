"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Plus, RefreshCw, AlertCircle, CheckCircle2, X, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/repositories')
      .then(res => res.json())
      .then(data => {
        setRepositories(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setError("Repository name is required.");
      return;
    }
    
    // Simple validation for owner/repo format
    const repoPattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    if (!repoPattern.test(repoName.trim())) {
      setError("Please enter a valid repository format, e.g., 'owner/repo'");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/repositories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: repoName.trim(),
          githubUrl: githubUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect repository");
      }

      setRepositories((prev) => [...prev, data]);
      setIsOpen(false);
      setRepoName("");
      setGithubUrl("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (repoId: number) => {
    if (!confirm("Are you sure you want to remove this repository? This will also delete all associated Pull Requests and review findings.")) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/repositories/${repoId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete repository");
      }
      
      setRepositories(prev => prev.filter(repo => repo.id !== repoId));
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting the repository.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connected Repositories</h1>
          <p className="text-muted-foreground mt-1">Manage which GitHub repositories the agent has access to.</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4" />
          Connect Repository
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
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
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Connect Repository</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure a GitHub repository to monitor.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleConnect} className="p-6 flex flex-col gap-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-destructive/10 border border-destructive/20 text-destructive animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="repoName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Repository Name *
                  </label>
                  <input
                    id="repoName"
                    type="text"
                    required
                    placeholder="e.g. facebook/react"
                    className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="githubUrl" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    GitHub URL (Optional)
                  </label>
                  <input
                    id="githubUrl"
                    type="url"
                    placeholder="e.g. https://github.com/facebook/react"
                    className="w-full bg-muted/40 border border-border rounded-lg px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gap-2 font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              GitHub Integrations
            </CardTitle>
            <CardDescription>Your agent automatically listens to webhooks on these repositories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Repository</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Analyzed PRs</th>
                    <th className="px-6 py-4 font-medium">Last Sync</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {repositories.map((repo) => (
                    <tr key={repo.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{repo.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {repo.status === "Connected" ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
                              <AlertCircle className="w-3 h-3 mr-1" /> {repo.status}
                            </Badge>
                          )}
                        </div>
                        {repo.error && <p className="text-xs text-destructive mt-1">{repo.error}</p>}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{repo.analyzedPrs}</td>
                      <td className="px-6 py-4 text-muted-foreground">{repo.lastSync}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8">
                            Configure
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(repo.id)}
                            title="Remove Repository"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
