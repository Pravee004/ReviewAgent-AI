"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldAlert, ShieldCheck, Key, Database, Sparkles, TrendingUp, 
  Activity, Clock, Cpu, Percent, Zap, Server 
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, Legend 
} from "recharts";

const COLORS = ["var(--destructive)", "#f97316", "#eab308", "#3b82f6"];

export default function SecurityCenterPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/security/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center p-20 min-h-[60vh]">
        <Activity className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Formatting categories for Recharts Pie Chart
  const pieData = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value,
  }));

  const totalExposures = stats.secretsCount + stats.sqlInjectionCount;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-primary shrink-0" />
          Enterprise Security Center
        </h1>
        <p className="text-muted-foreground">
          Real-time security analytics, compliance monitoring, and model audit records.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-destructive/20 bg-destructive/5">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-destructive" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Critical Vulnerabilities
              </CardTitle>
              <ShieldAlert className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.criticalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires immediate remediation</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden border-orange-500/20 bg-orange-500/5">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                High Risk Findings
              </CardTitle>
              <ShieldAlert className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.highCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Severe logical/security flows</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Secrets Exposed
              </CardTitle>
              <Key className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.secretsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">API keys and credentials leaked</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="relative overflow-hidden border-blue-500/20 bg-blue-500/5">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                SQL Injection Risks
              </CardTitle>
              <Database className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.sqlInjectionCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Concatenated queries flagged</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Security Trends Line Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.5 }} 
          className="lg:col-span-4"
        >
          <Card className="h-full border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Vulnerability Detection Trends
              </CardTitle>
              <CardDescription>
                Monthly breakdown of resolved and active vulnerabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.trends}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="critical" stroke="var(--destructive)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* OWASP Category Breakdown Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.6 }} 
          className="lg:col-span-3"
        >
          <Card className="h-full border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                OWASP Category Share
              </CardTitle>
              <CardDescription>
                Vulnerability distribution by audit classification.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[220px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        borderRadius: '8px' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Stats Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">{stats.totalFindings}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Issues</span>
                </div>
              </div>
              
              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mt-4 w-full">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                    <span className="font-semibold ml-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Model Intelligence Metrics Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }}
      >
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Model Intelligence & Audit Metrics
            </CardTitle>
            <CardDescription>
              Operational statistics and processing latency for the active security agent model.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <div className="flex flex-col gap-1 border-r border-border last:border-0 pr-4">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-primary" /> Active Model
                </span>
                <span className="text-lg font-bold text-foreground truncate mt-1">
                  {stats.modelMetrics.modelName}
                </span>
                <span className="text-xs text-muted-foreground">Azure Foundry AI</span>
              </div>

              <div className="flex flex-col gap-1 border-r border-border last:border-0 pr-4">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Total AI Requests
                </span>
                <span className="text-2xl font-bold text-foreground mt-1">
                  {stats.modelMetrics.aiRequests}
                </span>
                <span className="text-xs text-muted-foreground">Lifetime audit executions</span>
              </div>

              <div className="flex flex-col gap-1 border-r border-border last:border-0 pr-4">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Avg Analysis Time
                </span>
                <span className="text-2xl font-bold text-foreground mt-1">
                  {stats.modelMetrics.avgAnalysisTime}
                </span>
                <span className="text-xs text-muted-foreground">Includes diff parsing & checks</span>
              </div>

              <div className="flex flex-col gap-1 border-r border-border last:border-0 pr-4">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-primary" /> Token Consumption
                </span>
                <span className="text-2xl font-bold text-foreground mt-1">
                  {(stats.modelMetrics.tokenUsage / 1000).toFixed(0)}k
                </span>
                <span className="text-xs text-muted-foreground">Input & output context tokens</span>
              </div>

              <div className="flex flex-col gap-1 last:border-0 pr-4">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-primary" /> Success Rate
                </span>
                <span className="text-2xl font-bold text-foreground mt-1">
                  {stats.modelMetrics.successRate}
                </span>
                <span className="text-xs text-muted-foreground">Non-error network logs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
