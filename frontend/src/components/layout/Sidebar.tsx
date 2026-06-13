"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GitPullRequest, Settings, Database, GitBranch, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "PR Analysis", href: "/pr", icon: GitPullRequest },
  { name: "Security Center", href: "/security", icon: Shield },
  { name: "Repositories", href: "/repositories", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <GitBranch className="w-6 h-6 mr-3 text-primary" />
        <span className="font-bold text-lg">ReviewAgent</span>
      </div>
      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-border">
        <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Agent Online
        </div>
      </div>
    </div>
  );
}
