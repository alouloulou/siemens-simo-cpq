'use client';

import React from 'react';
import { Sparkles, HelpCircle, FileCheck2 } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: string;
  missingQuestions?: string[];
  onAnswerQuestion?: (q: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summary,
  missingQuestions,
  onAnswerQuestion,
}) => {
  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-[#00ffb9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Chief Solution Architect • Executive Engineering Rationale
          </h3>
        </div>
        <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
          Synthesized by Gemini 3.5 Flash
        </span>
      </div>

      {/* Missing Requirements Questions from Agent */}
      {missingQuestions && missingQuestions.length > 0 && (
        <div className="mb-4 p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-700/60 text-xs">
          <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1.5">
            <HelpCircle className="w-4 h-4 text-[#00ffb9]" />
            <span>Agent Clarification Requests (Missing Requirements):</span>
          </div>
          <p className="text-slate-300 mb-2">
            The autonomous agent identified ambiguous parameters in your request:
          </p>
          <ul className="space-y-1.5">
            {missingQuestions.map((q, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-2 rounded bg-[#060c16] border border-cyan-900 text-slate-200"
              >
                <span>&bull; {q}</span>
                {onAnswerQuestion && (
                  <button
                    onClick={() => onAnswerQuestion(q)}
                    className="text-[11px] text-[#00ffb9] hover:underline font-semibold ml-2"
                  >
                    Answer in prompt
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Rationale Text */}
      <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
        {summary}
      </div>
    </div>
  );
};
