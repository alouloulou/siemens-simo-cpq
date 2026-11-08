'use client';

import React, { useState } from 'react';
import { Database, BookOpen, ShieldCheck, FileCode, CheckCircle2, ArrowRight, Table, Layers, Cpu } from 'lucide-react';
import { SIEMENS_PRODUCT_CATALOG } from '@/lib/catalog/products';
import { SIEMENS_TECHNICAL_KNOWLEDGE_BASE } from '@/lib/rag/knowledge';

export const DataArchitectureOverview: React.FC = () => {
  const [activePillar, setActivePillar] = useState<'catalog' | 'knowledge' | 'rules'>('catalog');

  return (
    <div className="bg-[#091322] border border-cyan-950 rounded-2xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ffb9] animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Data Architecture & System Knowledge Foundations
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          An abstract breakdown of the 3 data foundations that power the CPQ agent: Hardware Catalog, Technical Guidelines, and Physical Rules.
        </p>
      </div>

      {/* 3 Pillar Cards (Navigation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pillar 1: Hardware Catalog */}
        <button
          onClick={() => setActivePillar('catalog')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activePillar === 'catalog'
              ? 'bg-[#0e213b] border-[#00ffb9] shadow-lg shadow-[#00ffb9]/10'
              : 'bg-[#060c16] border-slate-800 hover:border-cyan-800/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                Pillar 1 • products.ts
              </span>
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Hardware Catalog</h4>
            <p className="text-xs text-slate-400">
              The equipment inventory containing real Siemens MLFB part numbers, electrical ratings, and list prices.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-300">
            <span>{SIEMENS_PRODUCT_CATALOG.length} Siemens Parts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Pillar 2: Technical Knowledge Base */}
        <button
          onClick={() => setActivePillar('knowledge')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activePillar === 'knowledge'
              ? 'bg-[#0e213b] border-[#00ffb9] shadow-lg shadow-[#00ffb9]/10'
              : 'bg-[#060c16] border-slate-800 hover:border-cyan-800/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                Pillar 2 • knowledge.ts
              </span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Knowledge Base</h4>
            <p className="text-xs text-slate-400">
              Curated Siemens engineering manuals (SIOS), IEC standard citations, and operational guidelines.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-purple-300">
            <span>{SIEMENS_TECHNICAL_KNOWLEDGE_BASE.length} Manual Citations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Pillar 3: Symbolic Physical Rules */}
        <button
          onClick={() => setActivePillar('rules')}
          className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activePillar === 'rules'
              ? 'bg-[#0e213b] border-[#00ffb9] shadow-lg shadow-[#00ffb9]/10'
              : 'bg-[#060c16] border-slate-800 hover:border-cyan-800/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                Pillar 3 • constraints.ts
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Constraint Rules Engine</h4>
            <p className="text-xs text-slate-400">
              Deterministic physics equations (heat de-rating, cable reflection, pricing math, OR-Tools logic).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-300">
            <span>7 Mathematical Laws</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Detail Section for Selected Pillar */}
      <div className="bg-[#060c16] border border-slate-800 rounded-xl p-5 space-y-4">
        {/* PILLAR 1 DETAILS */}
        {activePillar === 'catalog' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Hardware Catalog Schema (`src/lib/catalog/products.ts`)
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Represents the Siemens Industry Mall database. Used by Node 3 to filter candidate components.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Entity: IndustrialProduct
              </span>
            </div>

            {/* Field Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-1.5 px-2">Field Name</th>
                    <th className="py-1.5 px-2">Data Type</th>
                    <th className="py-1.5 px-2">Engineering Purpose</th>
                    <th className="py-1.5 px-2">Sample Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-1.5 px-2 text-cyan-400 font-bold">orderNumber</td>
                    <td className="py-1.5 px-2 text-purple-300">string</td>
                    <td className="py-1.5 px-2">Siemens Machine-Readable Product Code (MLFB)</td>
                    <td className="py-1.5 px-2 text-slate-400">&quot;1LM1203-2AB33-4AF4&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-cyan-400 font-bold">powerKW</td>
                    <td className="py-1.5 px-2 text-purple-300">number</td>
                    <td className="py-1.5 px-2">Continuous mechanical shaft power rating</td>
                    <td className="py-1.5 px-2 text-slate-400">15.0</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-cyan-400 font-bold">ratedCurrentA</td>
                    <td className="py-1.5 px-2 text-purple-300">number</td>
                    <td className="py-1.5 px-2">Full load motor draw / Inverter continuous limit</td>
                    <td className="py-1.5 px-2 text-slate-400">28.0 (Motor) / 45.0 (Inverter)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-cyan-400 font-bold">coolingType</td>
                    <td className="py-1.5 px-2 text-purple-300">enum</td>
                    <td className="py-1.5 px-2">Thermal cooling method (DIN EN 60034-6)</td>
                    <td className="py-1.5 px-2 text-slate-400">&quot;Water (IC71W)&quot; / &quot;Air (IC411)&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-cyan-400 font-bold">basePriceEUR</td>
                    <td className="py-1.5 px-2 text-purple-300">number</td>
                    <td className="py-1.5 px-2">Siemens official distributor list price</td>
                    <td className="py-1.5 px-2 text-slate-400">4650</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-[#091322] border border-cyan-950 flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-[#00ffb9] shrink-0 mt-0.5" />
              <span>
                <strong>How the App Uses This:</strong> When Gemini extracts the customer intent (e.g. 15 kW, water cooling), the system runs a deterministic `.filter()` against this catalog to extract exact matching parts with authentic Siemens MLFB codes.
              </span>
            </div>
          </div>
        )}

        {/* PILLAR 2 DETAILS */}
        {activePillar === 'knowledge' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  Engineering Guidelines Schema (`src/lib/rag/knowledge.ts`)
                </h4>
                <p className="text-slate-400 text-[11px]">
                  Official Siemens operating manuals and IEC norms. Used by Node 4 to provide citations for every decision.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Entity: TechnicalDocumentCitation
              </span>
            </div>

            {/* Field Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-1.5 px-2">Document Title</th>
                    <th className="py-1.5 px-2">Manual Code</th>
                    <th className="py-1.5 px-2">Page</th>
                    <th className="py-1.5 px-2">Engineering Directive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-1.5 px-2 font-sans font-medium text-white">SIMOTICS FD Water Cooling Design</td>
                    <td className="py-1.5 px-2 text-cyan-400">Siemens D 81.1</td>
                    <td className="py-1.5 px-2 text-purple-300">p. 47</td>
                    <td className="py-1.5 px-2">Water-cooled motors must have an active re-cooling chiller (6SY8101).</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-sans font-medium text-white">Long Motor Cables & Wave Reflections</td>
                    <td className="py-1.5 px-2 text-cyan-400">Doc GH1 • 2023</td>
                    <td className="py-1.5 px-2 text-purple-300">p. 112</td>
                    <td className="py-1.5 px-2">Cables &gt; 50m mandate du/dt filter to stop 1600V reflection spikes.</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-sans font-medium text-white">SINAMICS PM240-2 Thermal Derating</td>
                    <td className="py-1.5 px-2 text-cyan-400">Manual A5E3329</td>
                    <td className="py-1.5 px-2 text-purple-300">p. 89</td>
                    <td className="py-1.5 px-2">De-rate inverter continuous current by 1.5% per °C above 40°C.</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 font-sans font-medium text-white">Explosion-Protected ATEX Drives</td>
                    <td className="py-1.5 px-2 text-cyan-400">Directive 2014/34/EU</td>
                    <td className="py-1.5 px-2 text-purple-300">p. 24</td>
                    <td className="py-1.5 px-2">Zone 1/21 requires SIMOTICS XP (1MB) with certified PTC sensors.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-lg bg-[#091322] border border-purple-950 flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>How the App Uses This:</strong> Instead of guessing, the app cites exact manual numbers and pages so a Siemens plant engineer can verify that the configuration respects official European directives.
              </span>
            </div>
          </div>
        )}

        {/* PILLAR 3 DETAILS */}
        {activePillar === 'rules' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Constraint Rules & Formulas (`src/lib/engine/constraints.ts`)
                </h4>
                <p className="text-slate-400 text-[11px]">
                  The mathematical laws executed by the solver. Implemented in TypeScript and Python OR-Tools.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Module: Symbolic Constraint Solver
              </span>
            </div>

            {/* Mathematical Rules Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-[#091322] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">RULE 1: Thermal Heat De-rating</span>
                <p className="font-mono text-emerald-300 text-[11px]">
                  derate = ambientTemp &gt; 40 ? (ambientTemp - 40) * 1.5% : 0%
                </p>
                <p className="text-[11px] text-slate-400">
                  Calculates effective inverter current at high temperatures (e.g. at 48°C, capacity drops 12%).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#091322] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">RULE 2: Cable Reflection du/dt Protection</span>
                <p className="font-mono text-emerald-300 text-[11px]">
                  cableLength &gt; 50m =&gt; mandates(du_dt_Filter_6SL3000)
                </p>
                <p className="text-[11px] text-slate-400">
                  Prevents reflected voltage waves from doubling peak voltage to 1,600V on long lines (IEC 60034-25).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#091322] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">RULE 3: Water Cooling Loop Coupling</span>
                <p className="font-mono text-emerald-300 text-[11px]">
                  motor.cooling == &quot;Water (IC71W)&quot; &lt;= accessory.chiller
                </p>
                <p className="text-[11px] text-slate-400">
                  Boolean implication: Selecting a liquid-cooled motor forces inclusion of the 5 kW chiller.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#091322] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">RULE 4: Deterministic Commercial Pricing</span>
                <p className="font-mono text-emerald-300 text-[11px]">
                  Net = Subtotal - (Subtotal * DiscountRate) + 20% VAT
                </p>
                <p className="text-[11px] text-slate-400">
                  Calculates exact account discount tiers (0%, 12%, 20%) with zero calculation or rounding drift.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#091322] border border-emerald-950 flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>How the App Uses This:</strong> These formulas run deterministically on every change. The LLM never invents numbers or prices—the formulas guarantee 100% mathematical validity.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
