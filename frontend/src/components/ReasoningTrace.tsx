"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Check, Activity } from "lucide-react";

const steps = [
  "Fetching Pull Request",
  "Parsing Changed Files",
  "Checking Security Patterns",
  "Running AI Review",
  "Generating Findings"
];

export function ReasoningTrace({ prId, onComplete }: { prId: number, onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3001/api/pr/${prId}/trace`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.log === "[DONE]") {
        setIsDone(true);
        eventSource.close();
        setTimeout(onComplete, 1200);
      } else {
        setLogs(prev => [...prev, data.log]);
      }
    };

    return () => eventSource.close();
  }, [prId, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Logic to calculate progress percent and current step based on log count
  const getActiveStep = () => {
    if (isDone) return 5;
    const count = logs.length;
    if (count <= 3) return 0;
    if (count <= 5) return 1;
    if (count <= 7) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getProgressPercent = () => {
    if (isDone) return 100;
    const count = logs.length;
    if (count === 0) return 0;
    if (count <= 3) return Math.min(20, 5 + count * 5);
    if (count <= 5) return Math.min(40, 20 + (count - 3) * 10);
    if (count <= 7) return Math.min(60, 40 + (count - 5) * 10);
    if (count <= 10) return Math.min(80, 60 + (count - 7) * 7);
    return Math.min(95, 80 + (count - 10) * 15);
  };

  const activeStep = getActiveStep();
  const progressPercent = getProgressPercent();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* 5-Step Stepper Component */}
      <div className="w-full bg-card border border-border rounded-xl p-6 shadow-lg">
        {/* Progress Bar Background */}
        <div className="relative flex justify-between items-center w-full mb-8">
          <div className="absolute left-0 top-[18px] w-full h-[3px] bg-muted -z-10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => {
            const isCompleted = activeStep > index;
            const isActive = activeStep === index;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                {/* Node circle */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-mono text-sm transition-all duration-300 ${
                    isCompleted 
                      ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : isActive 
                      ? "bg-background border-primary text-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20" 
                      : "bg-background border-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isActive ? (
                    <Activity className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`text-xs mt-3 text-center font-medium max-w-[120px] transition-all duration-300 ${
                    isActive 
                      ? "text-primary font-semibold" 
                      : isCompleted 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Latency and Status */}
        <div className="flex justify-between items-center text-xs text-muted-foreground px-2 pt-2 border-t border-border/60">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isDone ? "bg-green-500" : "bg-blue-500 animate-pulse"}`} />
            Status: {isDone ? "Review complete" : `Executing step ${activeStep + 1} of 5`}
          </span>
          <span>Progress: {progressPercent}%</span>
        </div>
      </div>

      {/* Terminal View */}
      <div className="w-full bg-[#1e1e1e] border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 text-[#cccccc] text-xs font-mono font-semibold opacity-70">
            <Terminal className="w-3.5 h-3.5" />
            agent-trace.log
          </div>
          <div className="w-12" />
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="p-5 h-[280px] overflow-y-auto font-mono text-[13px] leading-relaxed"
        >
          {logs.map((log, index) => (
            <div key={index} className="mb-2 flex">
              <span className="text-slate-600 mr-4 select-none">{(index + 1).toString().padStart(2, '0')}</span>
              <span className={`break-words ${
                log.includes("[ALERT]") ? "text-red-400 font-bold" : 
                log.includes("[THOUGHT]") ? "text-purple-400" :
                log.includes("[SYSTEM]") ? "text-emerald-400" : "text-[#cccccc]"
              }`}>
                {log}
              </span>
            </div>
          ))}
          {!isDone && (
            <div className="flex mt-2">
              <span className="text-slate-600 mr-4 select-none">{(logs.length + 1).toString().padStart(2, '0')}</span>
              <span className="w-2.5 h-4 bg-slate-400 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
