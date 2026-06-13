"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [aiMode, setAiMode] = useState<string>("Detecting...");

  const fetchAlerts = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setAlerts(data.recentAlerts || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlerts();
    // Poll for notifications every 15 seconds to keep it dynamic
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/ai-status')
      .then(res => res.json())
      .then(data => {
        setAiMode(data.mode);
      })
      .catch(() => {
        setAiMode("Demo Mode");
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("auth-state-change"));
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="font-semibold text-lg flex items-center gap-2.5">
        <span>PR Reviewer Agent</span>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 font-medium">
          Beta
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
          aiMode === "Live AI Mode" 
            ? "bg-green-500/10 text-green-400 border-green-500/20" 
            : "bg-purple-500/10 text-purple-400 border-purple-500/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            aiMode === "Live AI Mode" ? "bg-green-400 animate-pulse" : "bg-purple-400"
          }`} />
          {aiMode}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-muted-foreground hover:text-foreground transition-colors relative p-1.5 hover:bg-muted/40 rounded-lg flex items-center justify-center"
            title="Recent Alerts"
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border border-background"></span>
            )}
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">Recent Security Alerts</span>
                  {alerts.length > 0 && (
                    <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-semibold border border-destructive/20">
                      {alerts.length} Active
                    </span>
                  )}
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {loading && alerts.length === 0 ? (
                    <div className="flex justify-center p-6">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No recent security alerts
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/pr/${alert.pullRequest?.id}`);
                          }}
                          className="p-3.5 hover:bg-muted/40 transition-colors cursor-pointer text-left flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              alert.severity === "Critical" 
                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                            }`}>
                              {alert.severity}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {alert.pullRequest?.repo?.name}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-foreground line-clamp-2 mt-1 leading-normal">
                            {alert.description}
                          </p>
                          <span className="text-[9px] text-muted-foreground mt-0.5 truncate">
                            {alert.pullRequest?.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-2 bg-muted/20 border-t border-border text-center">
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/security");
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline w-full"
                  >
                    View Security Center
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Avatar className="w-8 h-8 border border-border">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive transition-colors p-1.5 hover:bg-destructive/10 rounded-lg flex items-center justify-center"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
