"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/login";
  const isLandingPage = pathname === "/";
  const isPublicPage = isLoginPage || isLandingPage;

  useEffect(() => {
    // Check auth status from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);

    // Dynamic redirects based on state
    if (!loggedIn && !isPublicPage) {
      router.push("/login");
    } else if (loggedIn && isLoginPage) {
      router.push("/dashboard");
    }
  }, [pathname, router, isPublicPage]);

  // Listen for custom login/logout events to update state instantly across components
  useEffect(() => {
    const handleAuthChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(loggedIn);
    };

    window.addEventListener("auth-state-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-state-change", handleAuthChange);
    };
  }, []);

  // Show a premium loading screen while resolving auth status for protected routes
  if (isAuthenticated === null && !isPublicPage) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Sparkles className="w-10 h-10 text-primary animate-pulse mb-3" />
        <p className="text-sm text-muted-foreground tracking-wider font-medium animate-pulse">
          Loading your session...
        </p>
      </div>
    );
  }

  // If not logged in and trying to access app pages, render nothing (blank) while router.push runs
  if (!isAuthenticated && !isPublicPage) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Sparkles className="w-10 h-10 text-primary animate-pulse mb-3" />
      </div>
    );
  }

  // If logged in and trying to access login page, render nothing while redirecting to '/dashboard'
  if (isAuthenticated && isLoginPage) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Sparkles className="w-10 h-10 text-primary animate-pulse mb-3" />
      </div>
    );
  }

  // Render public pages (Landing Page & Login Card) full screen without sidebar/header layout
  if (isPublicPage) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-full flex bg-background text-foreground w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
