'use client';

import React from 'react';
import { Layers, ShieldCheck, Zap, Thermometer, Wind, Plus, Trash2 } from 'lucide-react';
import { IndustrialProduct, SIEMENS_PRODUCT_CATALOG } from '@/lib/catalog/products';

interface SelectedBOMProps {
  selectedBOM: IndustrialProduct[];
  onRemoveComponent: (id: string) => void;
  onAddComponent: (product: IndustrialProduct) => void;
}

export const SelectedBOM: React.FC<SelectedBOMProps> = ({
  selectedBOM,
  onRemoveComponent,
  onAddComponent,
}) => {
  const availableAccessories = SIEMENS_PRODUCT_CATALOG.filter(
    (p) => (p.category === 'accessory' || p.category === 'encoder') && !selectedBOM.some((b) => b.id === p.id)
  );

  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00ffb9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Selected Bill of Materials (BOM)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
          {selectedBOM.length} Line Items
        </span>
      </div>

      {selectedBOM.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs">
          No components selected. Run an agent scenario to generate a verified BOM.
        </div>
      ) : (
        <div className="space-y-2.5">
          {selectedBOM.map((prod) => (
            <div
              key={prod.id}
              className="p-3 rounded-lg bg-[#060c16] border border-slate-800/90 hover:border-cyan-800/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-300">
                    {prod.category}
                  </span>
                  <span className="font-mono text-[11px] text-[#00ffb9] font-semibold">
                    MLFB: {prod.orderNumber}
                  </span>
                  {prod.atexCertified && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                      ATEX Certified
                    </span>
                  )}
                </div>
                <h4 className="text-slate-100 font-bold">{prod.name}</h4>

                {/* Tech Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                  {prod.powerKW !== undefined && prod.powerKW > 0 && (
                    <span className="flex items-center gap-1 bg-[#0b1626] px-1.5 py-0.5 rounded border border-cyan-950">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      {prod.powerKW} kW
                    </span>
                  )}
                  {prod.voltageV && (
                    <span className="bg-[#0b1626] px-1.5 py-0.5 rounded border border-cyan-950">
                      {prod.voltageV}V
                    </span>
                  )}
                  {prod.ratedCurrentA !== undefined && prod.ratedCurrentA > 0 && (
                    <span className="bg-[#0b1626] px-1.5 py-0.5 rounded border border-cyan-950">
                      {prod.ratedCurrentA}A rated
                    </span>
                  )}
                  {prod.coolingType && (
                    <span className="flex items-center gap-1 bg-[#0b1626] px-1.5 py-0.5 rounded border border-cyan-950">
                      <Wind className="w-3 h-3 text-cyan-400" />
                      {prod.coolingType}
                    </span>
                  )}
                  {prod.protectionRating && (
                    <span className="bg-[#0b1626] px-1.5 py-0.5 rounded border border-cyan-950">
                      {prod.protectionRating}
                    </span>
                  )}
                  {prod.efficiencyClass && (
                    <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      {prod.efficiencyClass}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <span className="text-sm font-mono font-bold text-slate-100">
                  €{prod.basePriceEUR.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveComponent(prod.id)}
                  title="Remove from configuration to test constraint failure"
                  className="mt-1 text-slate-500 hover:text-rose-400 transition flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Component Insertion Drawer (For Interview Demonstrations) */}
      {availableAccessories.length > 0 && (
        <div className="mt-4 pt-3 border-t border-cyan-950">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Available Add-on Modules & Accessories (Click to test constraint solver):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableAccessories.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => onAddComponent(acc)}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#060c16] hover:bg-[#10223a] border border-slate-800 hover:border-[#00ffb9]/40 text-[11px] text-slate-300 transition"
              >
                <Plus className="w-3 h-3 text-[#00ffb9]" />
                <span>{acc.name}</span>
                <span className="font-mono text-slate-400 text-[10px]">
                  (+€{acc.basePriceEUR})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
