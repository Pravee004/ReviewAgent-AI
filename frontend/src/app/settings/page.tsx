"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Shield, Code, Zap, FileText } from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  if (!settings) {
    return <div className="flex justify-center p-20"><Zap className="w-8 h-8 animate-pulse text-primary" /></div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Policy Configuration</h1>
        <p className="text-muted-foreground mt-1">Define the strictness and focus areas of your AI PR Reviewer.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Vulnerability Checks
            </CardTitle>
            <CardDescription>Configure which security risks the agent should prioritize.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none">Hardcoded Secrets Detection</label>
                <p className="text-sm text-muted-foreground">Scan for API keys, passwords, and tokens.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none">OWASP Top 10 Vulnerabilities</label>
                <p className="text-sm text-muted-foreground">Check for SQLi, XSS, CSRF, and broken access control.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none">Dependency Risk Analysis</label>
                <p className="text-sm text-muted-foreground">Flag updates to suspicious or vulnerable packages.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Code Quality & Style
            </CardTitle>
            <CardDescription>Set the standards for code formatting and best practices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none">Enforce SOLID Principles</label>
                <p className="text-sm text-muted-foreground">Suggest architectural improvements based on SOLID.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none">Strict Type Checking (TypeScript)</label>
                <p className="text-sm text-muted-foreground">Flag the use of "any" or missing type definitions.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Agent Sensitivity Threshold
            </CardTitle>
            <CardDescription>Control how aggressive the agent is in leaving comments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Lenient (Major bugs only)</span>
                <span className="text-sm font-medium">Strict (Nitpicks included)</span>
              </div>
              <Slider defaultValue={[70]} max={100} step={1} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">Current: Balanced (Focus on logic and security, ignore minor stylistic nits unless configured)</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Custom System Prompt
            </CardTitle>
            <CardDescription>Override the agent's base instructions for specific team preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea 
              className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              defaultValue={settings.systemPrompt || `You are an expert Senior Staff Engineer reviewing code.
Always prioritize security over performance. 
If you see raw SQL queries, immediately flag them as high risk.
For React components, ensure memoization is used only when strictly necessary.`}
            />
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
