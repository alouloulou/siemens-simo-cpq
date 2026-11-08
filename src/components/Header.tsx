'use client';

import React from 'react';
import { Cpu, Download, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import * as XLSX from 'xlsx';
import { PriceBreakdown } from '@/lib/engine/constraints';
import { IndustrialProduct } from '@/lib/catalog/products';

interface HeaderProps {
  customerTier: 'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)';
  onCustomerTierChange: (tier: 'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)') => void;
  selectedBOM: IndustrialProduct[];
  pricing?: PriceBreakdown;
}

export const Header: React.FC<HeaderProps> = ({
  customerTier,
  onCustomerTierChange,
  selectedBOM,
  pricing,
}) => {
  const exportToExcel = () => {
    if (!pricing || selectedBOM.length === 0) return;

    const bomData = pricing.items.map((item, idx) => ({
      Item: idx + 1,
      Category: item.category.toUpperCase(),
      Name: item.name,
      'Order Number (MLFB)': item.orderNumber,
      Qty: item.quantity,
      'Unit Price (€)': item.unitPriceEUR,
      'Total Price (€)': item.totalPriceEUR,
    }));

    const summaryData = [
      { Parameter: 'Subtotal (€)', Value: pricing.subtotalEUR },
      { Parameter: `Discount (${pricing.discountPercentage}%)`, Value: -pricing.discountAmountEUR },
      { Parameter: 'Net Configuration Total (€)', Value: pricing.netTotalEUR },
      { Parameter: 'VAT (20%) (€)', Value: pricing.vatEUR },
      { Parameter: 'Gross Total (€)', Value: pricing.grossTotalEUR },
      { Parameter: 'Configuration Date', Value: new Date().toLocaleDateString() },
      { Parameter: 'Pricing Engine', Value: 'Siemens Deterministic Rules Engine (0% Hallucination)' },
    ];

    const wb = XLSX.utils.book_new();
    const wsBOM = XLSX.utils.json_to_sheet(bomData);
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);

    XLSX.utils.book_append_sheet(wb, wsBOM, 'Bill of Materials');
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Pricing & Audit');

    XLSX.writeFile(wb, `Siemens_SimoCPQ_Configuration_${Date.now()}.xlsx`);
  };

  return (
    <header className="border-b border-cyan-900/30 bg-[#070e1b]/95 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Siemens Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#00646e] to-[#00ffb9] text-black font-extrabold text-xl shadow-lg shadow-[#00ffb9]/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">SIEMENS</span>
              <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-[#00ffb9]/10 text-[#00ffb9] border border-[#00ffb9]/30">
                SimoCPQ AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Product Configuration & Decision Support Agent • Motion Control
            </p>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Architecture Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0b172a] border border-cyan-800/40 text-xs text-cyan-200">
            <Cpu className="w-3.5 h-3.5 text-[#00ffb9]" />
            <span>Neuro-Symbolic Engine (GenAI + Rules Engine)</span>
          </div>

          {/* Customer Tier Selector */}
          <div className="flex items-center gap-1.5 bg-[#0b172a] border border-slate-700/60 rounded-md px-2.5 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Account Tier:</span>
            <select
              value={customerTier}
              onChange={(e) => onCustomerTierChange(e.target.value as any)}
              className="bg-transparent text-[#00ffb9] font-medium outline-none cursor-pointer"
            >
              <option value="Standard (0%)" className="bg-[#0b172a] text-white">Standard (0%)</option>
              <option value="OEM Partner (12%)" className="bg-[#0b172a] text-white">OEM Partner (12%)</option>
              <option value="Strategic Enterprise (20%)" className="bg-[#0b172a] text-white">Strategic Enterprise (20%)</option>
            </select>
          </div>

          {/* Export Spec Sheet Excel */}
          <button
            onClick={exportToExcel}
            disabled={!pricing || selectedBOM.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-[#00646e] to-[#00a396] hover:from-[#007b87] hover:to-[#00bfae] text-white text-xs font-semibold shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Spec Sheet (.xlsx)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
