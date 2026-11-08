'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight } from 'lucide-react';
import { ValidationSummary } from '@/lib/engine/constraints';

interface ConstraintMatrixProps {
  validation?: ValidationSummary;
}

export const ConstraintMatrix: React.FC<ConstraintMatrixProps> = ({ validation }) => {
  if (!validation) {
    return (
      <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl text-center text-slate-500 text-xs">
        Constraint matrix will populate once an industrial configuration is analyzed.
      </div>
    );
  }

  const { overallStatus, score, checks, missingComponents } = validation;

  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      {/* Header & Overall Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-950 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00ffb9]" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Deterministic Constraint & Compatibility Matrix
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluated via symbolic physical engineering rules (IEC / DIN / EN standards)
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {overallStatus === 'COMPATIBLE' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% COMPATIBLE</span>
            </div>
          )}
          {overallStatus === 'INVALID_CONSTRAINTS' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>CONSTRAINT VIOLATION</span>
            </div>
          )}
          {overallStatus === 'MISSING_COMPONENTS' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>INCOMPLETE BOM</span>
            </div>
          )}

          <span className="font-mono text-xs px-2 py-1 rounded bg-[#060c16] text-[#00ffb9] border border-cyan-900 font-bold">
            Score: {score}%
          </span>
        </div>
      </div>

      {/* Missing Component Alerts */}
      {missingComponents.length > 0 && (
        <div className="mb-3.5 p-3 rounded-lg bg-amber-950/30 border border-amber-700/50 text-xs text-amber-200">
          <span className="font-bold flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Missing Required Drive Train Components:
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            {missingComponents.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Constraint Rule Cards */}
      <div className="space-y-2.5">
        {checks.map((rule) => (
          <div
            key={rule.ruleId}
            className={`p-3 rounded-lg border transition text-xs ${
              rule.passed
                ? 'bg-[#060c16]/80 border-slate-800/80 hover:border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-800/60 shadow-lg shadow-rose-950/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                {rule.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span className="font-bold text-slate-100">{rule.title}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                <span className="text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800/40">
                  {rule.ruleId}
                </span>
                {rule.normReference && (
                  <span className="text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                    {rule.normReference}
                  </span>
                )}
              </div>
            </div>

            <p className={`mt-1 pl-6 leading-relaxed ${rule.passed ? 'text-slate-300' : 'text-rose-200 font-medium'}`}>
              {rule.message}
            </p>

            {/* Recommended Action / Remediation */}
            {rule.recommendedAction && (
              <div className="mt-2 ml-6 p-2 rounded bg-rose-900/20 border border-rose-700/40 text-[11px] text-amber-200 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Engineering Remediation:</strong> {rule.recommendedAction}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
