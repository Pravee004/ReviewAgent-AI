"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, ShieldAlert, Clock, GitPullRequest, ArrowUpRight, Bug, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import Link from "next/link";

const mockActivityData = [
  { name: "Mon", prs: 12 },
  { name: "Tue", prs: 19 },
  { name: "Wed", prs: 15 },
  { name: "Thu", prs: 22 },
  { name: "Fri", prs: 28 },
  { name: "Sat", prs: 5 },
  { name: "Sun", prs: 7 },
];

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div className="flex justify-center p-20"><Activity className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const { stats, recentActivity: recentPRs, recentAlerts: alerts } = data;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
        <p className="text-muted-foreground mt-1">Overview of your AI PR Reviewer's activity.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total PRs Scanned</CardTitle>
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPrs}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+14%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bugs & Vulns Caught</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bugsCaught}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-destructive font-medium">47 High Risk</span> prevented
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Est. Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timeSaved} hrs</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on avg. 20m per manual review
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500 flex items-center">
                Active <span className="relative flex h-3 w-3 ml-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently scanning 2 PRs
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>PR Review Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockActivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip cursor={{ fill: 'var(--muted)' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                    <Bar dataKey="prs" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-destructive" />
                Recent Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="flex flex-col gap-1 border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <Badge variant={alert.severity === "Critical" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm font-medium mt-1 leading-tight">{alert.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">{alert.pullRequest?.repo?.name}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent PRs Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Recent PRs Analyzed</CardTitle>
            <Link href="/pr">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-md">Pull Request</th>
                    <th className="px-4 py-3">Repository</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPRs.map((pr: any) => (
                    <tr key={pr.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/pr/${pr.id}`} className="hover:underline flex items-center gap-2">
                          {pr.status === "Completed" ? (
                             <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : pr.status === "Reviewing" ? (
                             <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                          ) : (
                             <ShieldAlert className="w-4 h-4 text-destructive" />
                          )}
                          {pr.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{pr.repo?.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant={pr.status === "Completed" ? "outline" : pr.status === "Reviewing" ? "secondary" : "destructive"}>
                          {pr.status} {pr.risk && `(${pr.risk})`}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">{pr.time}</td>
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
