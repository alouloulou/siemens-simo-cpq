'use client';

import React from 'react';
import { Send, Sparkles, RefreshCw, Zap, Flame, ShieldAlert, Activity } from 'lucide-react';

interface EngineerInputProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const PRESET_SCENARIOS = [
  {
    title: 'Extruder Drive (Water-Cooled)',
    badge: '15 kW • Liquid Cooled',
    icon: Zap,
    prompt:
      'I need a 15 kW, 400V industrial motor with water cooling for a plastic extruder drive. The factory cabinet room is in a high-temperature hall (48°C ambient), and there is an 75m motor cable distance to the electrical substation. Closed-loop speed feedback with encoder is required.',
  },
  {
    title: 'Chemical Plant ATEX Pump',
    badge: '15 kW • Zone 1/21',
    icon: Flame,
    prompt:
      'Configure a 15 kW, 400V drive package for a chemical reactor transfer pump in an explosive gas atmosphere (ATEX Zone 1). Certified flameproof enclosure, certified PTC temperature monitoring, and PROFINET communication required.',
  },
  {
    title: 'Cement Mill Conveyor (Severe Duty)',
    badge: '22 kW • Cast Iron',
    icon: ShieldAlert,
    prompt:
      'I require a 22 kW, 400V continuous heavy-duty conveyor drive for a cement quarry. Extremely high dust load, high starting torque, air-cooled cast-iron construction (IE4 super premium efficiency), and line reactor for grid harmonic reduction.',
  },
  {
    title: 'Cleanroom HVAC Fan / Blower',
    badge: '7.5 kW • Standard',
    icon: Activity,
    prompt:
      'Select a low-cost, standard 7.5 kW, 400V air-cooled motor (IE3 efficiency) with a matching frequency converter for continuous air circulation in an HVAC ventilation plant. Cable distance is 15m.',
  },
];

export const EngineerInput: React.FC<EngineerInputProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  isLoading,
  onClear,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && prompt.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-[#0b1626] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      {/* 1-Click Scenario Quick Presets */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00ffb9]" />
            1-Click Industrial Scenarios for Live Testing
          </span>
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Input
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_SCENARIOS.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPromptChange(sc.prompt)}
                disabled={isLoading}
                className="text-left p-2.5 rounded-lg bg-[#070e1b] hover:bg-[#10223b] border border-slate-800 hover:border-[#00ffb9]/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-[#00ffb9] transition">
                      {sc.title}
                    </span>
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00ffb9] transition" />
                  </div>
                  <span className="inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                    {sc.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Natural Language Prompt Bar */}
      <div className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your motor/drive technical requirements in natural language (e.g. 'I need a 15 kW, 400V industrial motor with water cooling for an extruder, 48°C ambient temperature, 75m cable run, closed-loop encoder feedback')..."
          className="w-full bg-[#050b14] border border-cyan-800/50 rounded-lg p-3.5 pr-32 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00ffb9] focus:ring-1 focus:ring-[#00ffb9] resize-none font-sans transition"
        />

        <div className="absolute right-3 bottom-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00646e] to-[#00ffb9] hover:from-[#007b87] hover:to-[#22ffc3] text-black font-bold text-xs shadow-lg shadow-[#00ffb9]/20 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Solving...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-black" />
                <span>Run Agent</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
