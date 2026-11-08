'use client';

import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Euro, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { ValidationSummary, PriceBreakdown } from '@/lib/engine/constraints';
import { IndustrialProduct } from '@/lib/catalog/products';
import { TechnicalDocumentCitation } from '@/lib/rag/knowledge';
import { AgentActivityStep } from '@/lib/agent/controller';
import * as XLSX from 'xlsx';

interface CleanCPQDashboardProps {
  validation?: ValidationSummary;
  activitySteps: AgentActivityStep[];
  ragCitations: TechnicalDocumentCitation[];
  alternatives: any[];
  onApplyAlternative: (componentIds: string[]) => void;
  onRemoveComponent: (id: string) => void;
  isLoading: boolean;
}

export const CleanCPQDashboard: React.FC<CleanCPQDashboardProps> = ({
  validation,
  activitySteps,
  ragCitations,
  alternatives,
  onApplyAlternative,
  onRemoveComponent,
  isLoading
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);

  if (isLoading) {
    return (
      <div className="bg-[#0b1524] border border-cyan-800/40 rounded-2xl p-12 text-center shadow-2xl">
        <div className="w-12 h-12 border-3 border-[#00ffb9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-white mb-1">AI Solution Architect is Assembling Drive Train...</h3>
        <p className="text-xs text-slate-400">
          Querying Siemens product catalog • Checking technical norms (IEC / DIN) • Verifying physical constraints
        </p>
      </div>
    );
  }

  if (!validation) return null;

  const { overallStatus, score, checks, pricing, selectedBOM } = validation;

  const motor = selectedBOM.find(p => p.category === 'motor');
  const inverter = selectedBOM.find(p => p.category === 'inverter');
  const controlUnit = selectedBOM.find(p => p.category === 'control_unit');
  const accessories = selectedBOM.filter(p => p.category === 'accessory' || p.category === 'encoder');

  const exportExcel = () => {
    const bomData = selectedBOM.map((item, idx) => ({
      Position: idx + 1,
      Category: item.category.toUpperCase(),
      Name: item.name,
      'MLFB Order Code': item.orderNumber,
      'Price (EUR)': item.basePriceEUR
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(bomData);
    XLSX.utils.book_append_sheet(wb, ws, 'Siemens Configuration');
    XLSX.writeFile(wb, `Siemens_Drive_Quote_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP EXECUTIVE RESULT BAR: 3 HIGH-LEVEL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Selected System */}
        <div className="bg-[#091322] border border-slate-800 rounded-xl p-4 flex items-center gap-3.5 shadow-md">
          <div className="w-11 h-11 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#00ffb9]" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Configured Drive</span>
            <h4 className="text-sm font-bold text-white truncate max-w-[200px]">
              {motor?.powerKW || 15} kW {motor?.coolingType.includes('Water') ? 'Water-Cooled' : 'Air-Cooled'} Package
            </h4>
            <span className="text-[10px] text-cyan-300 font-mono">
              {selectedBOM.length} Verified Components
            </span>
          </div>
        </div>

        {/* Card 2: Compatibility Status */}
        <div className="bg-[#091322] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
              overallStatus === 'COMPATIBLE' 
                ? 'bg-emerald-950/60 border border-emerald-600/50 text-emerald-400' 
                : 'bg-rose-950/60 border border-rose-600/50 text-rose-400'
            }`}>
              {overallStatus === 'COMPATIBLE' ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Physical Validation</span>
              <h4 className="text-sm font-bold text-white">
                {overallStatus === 'COMPATIBLE' ? '100% Compatible' : 'Constraint Conflict'}
              </h4>
              <span className="text-[10px] text-slate-400">
                {checks.filter(c => c.passed).length}/{checks.length} IEC Norms Passed
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#050b14] text-[#00ffb9] border border-cyan-900">
            {score}%
          </span>
        </div>

        {/* Card 3: Total Price Quote */}
        <div className="bg-[#091322] border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-white">
              <Euro className="w-5 h-5 text-[#00ffb9]" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">Net Package Price</span>
              <h4 className="text-lg font-mono font-extrabold text-white">
                €{pricing.netTotalEUR.toLocaleString()}
              </h4>
              <span className="text-[10px] text-slate-400">
                Incl. {pricing.discountPercentage}% Account Discount
              </span>
            </div>
          </div>
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00646e] hover:bg-[#00828f] text-white text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN DRIVE PACKAGE: CLEAN 3-CARD ARCHITECTURE */}
      <div className="bg-[#091322] border border-cyan-950 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ffb9]" />
              Configured Drive Package (Bill of Materials)
            </h3>
            <p className="text-xs text-slate-400">
              The AI automatically selected the primary components and added required protection units.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Component 1: Motor */}
          {motor && (
            <div className="bg-[#060c16] border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-800/60 transition">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold uppercase tracking-wider mb-2 inline-block">
                  1. Electric Motor
                </span>
                <h4 className="text-sm font-bold text-white mb-1">{motor.name}</h4>
                <p className="text-xs text-slate-400 mb-3">{motor.description}</p>
                <div className="space-y-1 text-xs text-slate-300 font-mono bg-[#091322] p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between"><span>Power:</span><span className="text-white font-bold">{motor.powerKW} kW</span></div>
                  <div className="flex justify-between"><span>Voltage:</span><span>3AC {motor.voltageV}V</span></div>
                  <div className="flex justify-between"><span>Cooling:</span><span className="text-[#00ffb9]">{motor.coolingType}</span></div>
                  <div className="flex justify-between"><span>Efficiency:</span><span className="text-emerald-400">{motor.efficiencyClass}</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500">MLFB: {motor.orderNumber}</span>
                <span className="font-mono text-sm font-bold text-white">€{motor.basePriceEUR.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Component 2: Inverter & Control Unit */}
          {inverter && (
            <div className="bg-[#060c16] border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-800/60 transition">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold uppercase tracking-wider mb-2 inline-block">
                  2. Frequency Inverter
                </span>
                <h4 className="text-sm font-bold text-white mb-1">{inverter.name}</h4>
                <p className="text-xs text-slate-400 mb-3">{inverter.description}</p>
                <div className="space-y-1 text-xs text-slate-300 font-mono bg-[#091322] p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between"><span>Capacity:</span><span className="text-white font-bold">{inverter.powerKW} kW ({inverter.ratedCurrentA}A)</span></div>
                  <div className="flex justify-between"><span>Control Unit:</span><span className="text-cyan-300">{controlUnit?.name.slice(0, 24)}</span></div>
                  <div className="flex justify-between"><span>Safety:</span><span className="text-emerald-400">STO SIL3 / PL e</span></div>
                  <div className="flex justify-between"><span>Fieldbus:</span><span>PROFINET</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500">MLFB: {inverter.orderNumber}</span>
                <span className="font-mono text-sm font-bold text-white">
                  €{((inverter.basePriceEUR) + (controlUnit?.basePriceEUR || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Component 3: Auto-Added Protection & Accessories */}
          <div className="bg-[#060c16] border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-800/60 transition">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-bold uppercase tracking-wider mb-2 inline-block">
                3. Auto-Added Protection ({accessories.length})
              </span>
              <h4 className="text-sm font-bold text-white mb-1">Safety & Auxiliary Units</h4>
              <p className="text-xs text-slate-400 mb-3">
                Protection accessories automatically inserted to meet physical and environmental constraints.
              </p>
              
              <div className="space-y-2">
                {accessories.map(acc => (
                  <div key={acc.id} className="p-2 rounded-lg bg-[#091322] border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-slate-200 font-medium block">{acc.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{acc.orderNumber}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-300">€{acc.basePriceEUR}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-emerald-400 font-medium">Automatic Protection</span>
              <span className="font-mono text-sm font-bold text-white">
                €{accessories.reduce((s, a) => s + a.basePriceEUR, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETERMINISTIC VERIFICATION AUDIT (WHY THIS WORKS) */}
      <div className="bg-[#091322] border border-cyan-950 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-[#00ffb9]" />
          Engineering Constraint Verification (Zero Guesswork)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Every rule below was verified with mathematical logic—not LLM guessing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checks.map(chk => (
            <div 
              key={chk.ruleId} 
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                chk.passed 
                  ? 'bg-[#060c16] border-slate-800/80 text-slate-300' 
                  : 'bg-rose-950/20 border-rose-800 text-rose-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {chk.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-white">{chk.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">{chk.normReference}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">{chk.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ALTERNATIVE PACKAGES */}
      {alternatives.length > 0 && (
        <div className="bg-[#091322] border border-cyan-950 rounded-2xl p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-1">Recommended Alternative Packages</h3>
          <p className="text-xs text-slate-400 mb-3">
            Compare options for different budgets or environmental conditions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alternatives.map(alt => (
              <div key={alt.id} className="p-3.5 rounded-xl bg-[#060c16] border border-slate-800 flex flex-col justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-bold mb-1.5 inline-block">
                    {alt.tag}
                  </span>
                  <h4 className="font-bold text-white mb-1">{alt.name}</h4>
                  <p className="text-slate-400 text-[11px] mb-3">{alt.highlightDifference}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">€{alt.totalPriceEUR.toLocaleString()}</span>
                  <button
                    onClick={() => onApplyAlternative(alt.componentIds)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#00ffb9] hover:underline cursor-pointer"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COLLAPSIBLE TECHNICAL BEHIND-THE-SCENES (RAG & TOOL TRACE) */}
      <div className="border border-slate-800/80 rounded-2xl bg-[#060c16] overflow-hidden">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[#00ffb9]" />
            <span className="text-xs font-bold text-slate-200">
              Technical Behind-the-Scenes (Agent Tool Calls & RAG Document Citations)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{showTechnicalDetails ? 'Hide Details' : 'Show Details'}</span>
            {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showTechnicalDetails && (
          <div className="p-5 border-t border-slate-800 space-y-4 bg-[#040810]">
            {/* RAG Citations */}
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                Siemens Engineering Manuals Grounding (RAG):
              </h4>
              <div className="space-y-2">
                {ragCitations.map(cite => (
                  <div key={cite.id} className="p-3 rounded-lg bg-[#091322] border border-slate-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{cite.docTitle}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{cite.docCode} (p. {cite.page})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic mb-1">&ldquo;{cite.excerpt}&rdquo;</p>
                    <span className="text-[11px] text-emerald-400 font-medium">Directive: {cite.siemensGuidelineSummary}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Steps */}
            <div>
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                Autonomous Tool Execution Sequence:
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                {activitySteps.map(step => (
                  <div key={step.id} className="p-2 rounded bg-[#091322] border border-slate-800/80 flex items-center justify-between">
                    <span className="text-cyan-400">Step {step.stepNumber}: {step.toolName}()</span>
                    <span className="text-slate-400 truncate max-w-[500px]">{step.toolOutputSummary}</span>
                    <span className="text-emerald-400 text-[10px] uppercase font-bold">{step.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
