'use client';

import React from 'react';
import { DollarSign, Tag, CheckCheck, ShieldCheck } from 'lucide-react';
import { PriceBreakdown } from '@/lib/engine/constraints';

interface PricingPanelProps {
  pricing?: PriceBreakdown;
}

export const PricingPanel: React.FC<PricingPanelProps> = ({ pricing }) => {
  if (!pricing) return null;

  return (
    <div className="bg-[#091220] border border-cyan-900/40 rounded-xl p-4 lg:p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#00ffb9]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Deterministic Commercial Pricing Engine
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          0% LLM Price Hallucination
        </span>
      </div>

      {/* Itemized Table */}
      <div className="overflow-x-auto mb-3.5">
        <table className="w-full text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase font-mono">
              <th className="py-1.5 px-2">Component</th>
              <th className="py-1.5 px-2">MLFB Order No.</th>
              <th className="py-1.5 px-2 text-right">Unit Price</th>
              <th className="py-1.5 px-2 text-right">Ext. Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {pricing.items.map((item) => (
              <tr key={item.productId} className="hover:bg-slate-900/40">
                <td className="py-2 px-2 font-sans font-medium text-slate-200">
                  {item.name}
                </td>
                <td className="py-2 px-2 text-cyan-400">{item.orderNumber}</td>
                <td className="py-2 px-2 text-right text-slate-400">
                  €{item.unitPriceEUR.toLocaleString()}
                </td>
                <td className="py-2 px-2 text-right font-bold text-slate-100">
                  €{item.totalPriceEUR.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summary Calculation */}
      <div className="p-3.5 rounded-lg bg-[#060c16] border border-cyan-950 space-y-1.5 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span>Catalog Subtotal:</span>
          <span>€{pricing.subtotalEUR.toLocaleString()}</span>
        </div>

        {pricing.discountPercentage > 0 && (
          <div className="flex items-center justify-between text-emerald-400 font-semibold">
            <span>Customer Tier Discount ({pricing.discountPercentage}%):</span>
            <span>-€{pricing.discountAmountEUR.toLocaleString()}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-400">
          <span>Austrian / EU VAT (20%):</span>
          <span>€{pricing.vatEUR.toLocaleString()}</span>
        </div>

        <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-base font-bold text-slate-100">
          <span className="font-sans text-sm">Net Configuration Total:</span>
          <span className="text-[#00ffb9] text-lg font-mono">
            €{pricing.netTotalEUR.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>Gross Total (incl. VAT):</span>
          <span>€{pricing.grossTotalEUR.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
