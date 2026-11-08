'use client';

import React, { useState } from 'react';
import { Terminal, CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronRight, Code2 } from 'lucide-react';
import { AgentActivityStep } from '@/lib/agent/controller';

interface AgentActivityPanelProps {
  activitySteps: AgentActivityStep[];
  isLoading: boolean;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  activitySteps,
  isLoading,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00ffb9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Agent Activity & Tool Calling Trace
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Autonomous Loop Active
            </span>
          )}
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
            {activitySteps.length} Tool Actions
          </span>
        </div>
      </div>

      {activitySteps.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
          <Terminal className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
          <p className="text-xs">No tool calls yet. Click a preset scenario or submit a requirement to start the autonomous solver loop.</p>
        </div>
      ) : (
        <div className="space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
          {activitySteps.map((step) => {
            const isExpanded = !!expandedSteps[step.id];

            return (
              <div
                key={step.id}
                className="rounded-lg bg-[#060c16] border border-cyan-950 hover:border-cyan-800/60 transition overflow-hidden text-xs"
              >
                {/* Step Header */}
                <div
                  onClick={() => toggleStep(step.id)}
                  className="flex items-start justify-between p-2.5 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition"
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-semibold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800/40">
                          TOOL: {step.toolName}()
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium mt-1 leading-snug">
                        {step.reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {step.status === 'success' && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        SUCCESS
                      </span>
                    )}
                    {step.status === 'warning' && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        WARNING
                      </span>
                    )}
                    {step.status === 'executing' && (
                      <span className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30 animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </div>
                </div>

                {/* Step Summary */}
                <div className="px-3 py-2 bg-[#040810] border-t border-cyan-950/80 text-slate-300 font-mono text-[11px]">
                  <span className="text-slate-500 mr-1.5">&gt;</span>
                  {step.toolOutputSummary}
                </div>

                {/* Collapsible JSON payload */}
                {isExpanded && (
                  <div className="p-3 bg-black/60 border-t border-cyan-950 font-mono text-[10px] text-slate-400">
                    <div className="flex items-center gap-1 text-cyan-400 font-bold mb-1">
                      <Code2 className="w-3 h-3" />
                      <span>Input Arguments:</span>
                    </div>
                    <pre className="bg-[#050b14] p-2 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                      {JSON.stringify(step.toolInput, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
