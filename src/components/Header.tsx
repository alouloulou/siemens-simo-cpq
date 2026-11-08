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

const SiemensLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg
    viewBox="0 0 210 50"
    className={className}
    fill="currentColor"
    aria-label="Siemens"
  >
    <path d="M200.121 10.3466l0 5.8289c-3.0198,-1.14 -5.7084,-1.7164 -8.0615,-1.7164 -1.3938,0 -2.5037,0.2581 -3.3382,0.7571 -0.8346,0.5033 -1.2605,1.1228 -1.2605,1.8541 0,0.9722 0.9421,1.8368 2.8392,2.6112l5.4805 2.6671c4.4309,2.1122 6.6291,4.9169 6.6291,8.4401 0,2.9295 -1.1658,5.2654 -3.5189,6.9947 -2.3359,1.7466 -5.4805,2.6112 -9.3951,2.6112 -1.8068,0 -3.4285,-0.0774 -4.8696,-0.2409 -1.4411,-0.1548 -3.0973,-0.4732 -4.9342,-0.9292l0 -6.0999c3.3683,1.14 6.4355,1.7164 9.1972,1.7164 3.2952,0 4.9342,-0.955 4.9342,-2.8822 0,-0.9593 -0.6711,-1.7336 -2.0347,-2.3402l-6.0871 -2.594c-2.2455,-1.0152 -3.9146,-2.2455 -5.0073,-3.7038 -1.0754,-1.4712 -1.6218,-3.1575 -1.6218,-5.0847 0,-2.6973 1.1357,-4.8697 3.3812,-6.5216 2.2628,-1.639 5.2655,-2.4606 8.9994,-2.4606 1.2131,0 2.6112,0.1075 4.1599,0.3054 1.5615,0.2108 3.0628,0.4689 4.5082,0.7873z"/>
    <path d="M27.7222 10.3466l0 5.8289c-3.0199,-1.14 -5.7042,-1.7164 -8.0573,-1.7164 -1.3981,0 -2.5036,0.2581 -3.3382,0.7571 -0.8345,0.5033 -1.2604,1.1228 -1.2604,1.8541 0,0.9722 0.955,1.8368 2.8521,2.6112l5.4805 2.6671c4.4136,2.1122 6.6162,4.9169 6.6162,8.4401 0,2.9295 -1.1701,5.2654 -3.506,6.9947 -2.3531,1.7466 -5.4805,2.6112 -9.408,2.6112 -1.8068,0 -3.4329,-0.0774 -4.874,-0.2409 -1.4411,-0.1548 -3.0801,-0.4732 -4.9298,-0.9292l0 -6.0999c3.3812,1.14 6.4484,1.7164 9.1929,1.7164 3.2952,0 4.9342,-0.955 4.9342,-2.8822 0,-0.9593 -0.6668,-1.7336 -2.0176,-2.3402l-6.087 -2.594c-2.2628,-1.0152 -3.9319,-2.2455 -5.0073,-3.7038 -1.0927,-1.4712 -1.6261,-3.1575 -1.6261,-5.0847 0,-2.6973 1.1271,-4.8697 3.3855,-6.5216 2.2456,-1.639 5.2525,-2.4606 8.9865,-2.4606 1.226,0 2.6069,0.1075 4.1727,0.3054 1.5487,0.2108 3.05,0.4689 4.4911,0.7873z"/>
    <polygon points="34.0028,9.8002 42.9291,9.8002 42.9291,39.8483 34.0028,39.8483 "/>
    <polygon points="71.6866,9.8002 71.6866,15.3539 58.4241,15.3539 58.4241,22.0173 69.9272,22.0173 69.9272,27.0246 58.4241,27.0246 58.4241,34.0194 71.9576,34.0194 71.9576,39.8483 49.8335,39.8483 49.8335,9.8002 "/>
    <polygon points="113.358,9.8002 113.358,39.8483 105.025,39.8483 105.025,20.0299 96.3789,40.1236 91.234,40.1236 82.9186,20.0299 82.9186,39.8483 76.8918,39.8483 76.8918,9.8002 87.7882,9.8002 95.226,28.1947 103.008,9.8002 "/>
    <polygon points="142.103,9.8002 142.103,15.3539 128.913,15.3539 128.913,22.0173 140.416,22.0173 140.416,27.0246 128.913,27.0246 128.913,34.0194 142.374,34.0194 142.374,39.8483 120.25,39.8483 120.25,9.8002 "/>
    <polygon points="173.424,9.8002 173.424,39.8483 163.956,39.8483 153.331,20.5762 153.331,39.8483 147.308,39.8483 147.308,9.8002 157.052,9.8002 167.402,28.7411 167.402,9.8002 "/>
  </svg>
);

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
        <div className="flex items-center gap-3.5">
          <div className="text-[#00ffb9] hover:text-white transition flex items-center shrink-0">
            <SiemensLogo className="h-5 w-auto" />
          </div>
          <div className="h-6 w-px bg-cyan-800/60 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">SimoCPQ AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00ffb9]/10 text-[#00ffb9] border border-[#00ffb9]/30">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Product Configuration Agent • Motion Control
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
