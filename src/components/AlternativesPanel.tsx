'use client';

import React from 'react';
import { GitFork, Check, ArrowRight, Sparkles } from 'lucide-react';

interface AlternativeConfig {
  id: string;
  name: string;
  tag: string;
  componentIds: string[];
  totalPriceEUR: number;
  highlightDifference: string;
}

interface AlternativesPanelProps {
  alternatives: AlternativeConfig[];
  onApplyAlternative: (componentIds: string[]) => void;
}

export const AlternativesPanel: React.FC<AlternativesPanelProps> = ({
  alternatives,
  onApplyAlternative,
}) => {
  if (alternatives.length === 0) return null;

  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-[#00ffb9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Automated Alternative Configurations
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
          {alternatives.length} Alternatives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            className="p-3.5 rounded-lg bg-[#060c16] border border-slate-800 hover:border-cyan-700 transition flex flex-col justify-between text-xs"
          >
            <div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 inline-block mb-1.5">
                {alt.tag}
              </span>
              <h4 className="font-bold text-slate-100 text-sm mb-1">{alt.name}</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
                {alt.highlightDifference}
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Estimated Net:</span>
                <span className="font-mono font-bold text-slate-100 text-sm">
                  €{alt.totalPriceEUR.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onApplyAlternative(alt.componentIds)}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#0b1b2d] hover:bg-[#00ffb9] hover:text-black text-[#00ffb9] border border-cyan-700/60 font-semibold text-xs transition cursor-pointer"
              >
                <span>Apply BOM</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
