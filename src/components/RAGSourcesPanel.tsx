'use client';

import React from 'react';
import { BookOpen, FileText, Bookmark, ExternalLink } from 'lucide-react';
import { TechnicalDocumentCitation } from '@/lib/rag/knowledge';

interface RAGSourcesPanelProps {
  citations: TechnicalDocumentCitation[];
}

export const RAGSourcesPanel: React.FC<RAGSourcesPanelProps> = ({ citations }) => {
  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#00ffb9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            RAG Grounding & Technical Documentation Citations
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
          {citations.length} Grounded Siemens Docs
        </span>
      </div>

      {citations.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs">
          RAG citations will be displayed when the autonomous agent searches technical documentation.
        </div>
      ) : (
        <div className="space-y-3">
          {citations.map((cite) => (
            <div
              key={cite.id}
              className="p-3.5 rounded-lg bg-[#060c16] border border-slate-800 hover:border-cyan-800/60 transition text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <h4 className="font-bold text-slate-200">{cite.docTitle}</h4>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-300">
                  <span className="bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40 font-semibold">
                    {cite.docCode}
                  </span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                    p. {cite.page}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 mb-2">
                {cite.section}
              </div>

              {/* Exact Quote */}
              <div className="p-2.5 rounded bg-[#040810] border-l-2 border-[#00ffb9] text-slate-300 text-[11px] italic leading-relaxed mb-2 font-serif">
                &ldquo;{cite.excerpt}&rdquo;
              </div>

              {/* Guideline Takeaway */}
              <div className="flex items-start gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded border border-emerald-800/40">
                <Bookmark className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Siemens Engineering Directive:</strong> {cite.siemensGuidelineSummary}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
