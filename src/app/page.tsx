'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EngineerInput, PRESET_SCENARIOS } from '@/components/EngineerInput';
import { AgentActivityPanel } from '@/components/AgentActivityPanel';
import { SelectedBOM } from '@/components/SelectedBOM';
import { ConstraintMatrix } from '@/components/ConstraintMatrix';
import { PricingPanel } from '@/components/PricingPanel';
import { RAGSourcesPanel } from '@/components/RAGSourcesPanel';
import { AlternativesPanel } from '@/components/AlternativesPanel';
import { ExecutiveSummary } from '@/components/ExecutiveSummary';
import { AgentActivityStep, AgentExecutionResult } from '@/lib/agent/controller';
import { ValidationSummary, CustomerRequirements } from '@/lib/engine/constraints';
import { TechnicalDocumentCitation } from '@/lib/rag/knowledge';
import { IndustrialProduct, SIEMENS_PRODUCT_CATALOG } from '@/lib/catalog/products';

export default function SimoCPQDashboard() {
  const [prompt, setPrompt] = useState(PRESET_SCENARIOS[0].prompt);
  const [customerTier, setCustomerTier] = useState<'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)'>('OEM Partner (12%)');
  const [isLoading, setIsLoading] = useState(false);

  const [activitySteps, setActivitySteps] = useState<AgentActivityStep[]>([]);
  const [validation, setValidation] = useState<ValidationSummary | undefined>(undefined);
  const [ragCitations, setRagCitations] = useState<TechnicalDocumentCitation[]>([]);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<string>('');
  const [missingQuestions, setMissingQuestions] = useState<string[]>([]);
  const [currentRequirements, setCurrentRequirements] = useState<CustomerRequirements>({
    powerKW: 15,
    voltageV: 400,
    cooling: 'Water (IC71W)',
    cableLengthMeters: 75,
    ambientTempC: 48,
    closedLoopFeedback: true,
    customerTier: 'OEM Partner (12%)',
  });

  // Re-validate constraints instantly when user modifies BOM manually
  const revalidateBOM = async (newComponentIds: string[], reqs: CustomerRequirements = currentRequirements) => {
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirements: reqs,
          selectedComponentIds: newComponentIds,
        }),
      });
      const data: ValidationSummary = await res.json();
      setValidation(data);
    } catch (err) {
      console.error('Failed to revalidate BOM:', err);
    }
  };

  const handleRunAgent = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setActivitySteps([]);
    setExecutiveSummary('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          customerTier,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to execute configuration agent.');
      }

      const data: AgentExecutionResult = await res.json();

      setActivitySteps(data.activitySteps);
      setValidation(data.validation);
      setRagCitations(data.ragCitations);
      setAlternatives(data.alternatives);
      setExecutiveSummary(data.naturalLanguageResponse);
      setMissingQuestions(data.missingRequirementsQuestions || []);
      setCurrentRequirements(data.parsedRequirements);
    } catch (err: unknown) {
      console.error('Agent execution error:', err);
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setExecutiveSummary(`Error executing agent: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveComponent = (id: string) => {
    if (!validation) return;
    const currentIds = validation.selectedBOM.map((p) => p.id);
    const updatedIds = currentIds.filter((cid) => cid !== id);
    revalidateBOM(updatedIds);
  };

  const handleAddComponent = (product: IndustrialProduct) => {
    if (!validation) return;
    const currentIds = validation.selectedBOM.map((p) => p.id);
    if (!currentIds.includes(product.id)) {
      revalidateBOM([...currentIds, product.id]);
    }
  };

  const handleApplyAlternative = (componentIds: string[]) => {
    revalidateBOM(componentIds);
  };

  const handleCustomerTierChange = (newTier: 'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)') => {
    setCustomerTier(newTier);
    const updatedReqs: CustomerRequirements = {
      ...currentRequirements,
      customerTier: newTier,
    };
    setCurrentRequirements(updatedReqs);
    if (validation) {
      const currentIds = validation.selectedBOM.map((p) => p.id);
      revalidateBOM(currentIds, updatedReqs);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setActivitySteps([]);
    setValidation(undefined);
    setRagCitations([]);
    setAlternatives([]);
    setExecutiveSummary('');
    setMissingQuestions([]);
  };

  // Run initial scenario automatically on first mount
  useEffect(() => {
    handleRunAgent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#040911] text-slate-100 flex flex-col font-sans">
      <Header
        customerTier={customerTier}
        onCustomerTierChange={handleCustomerTierChange}
        selectedBOM={validation?.selectedBOM || []}
        pricing={validation?.pricing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Top: Engineer Input & 1-Click Scenarios */}
        <EngineerInput
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={handleRunAgent}
          isLoading={isLoading}
          onClear={handleClear}
        />

        {/* Executive Engineering Rationale (if present) */}
        {executiveSummary && (
          <ExecutiveSummary
            summary={executiveSummary}
            missingQuestions={missingQuestions}
            onAnswerQuestion={(q) => setPrompt((prev) => `${prev} [Clarification: ${q}]`)}
          />
        )}

        {/* 2-Column Industrial CPQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Real-time Autonomous Agent Tool Trace (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <AgentActivityPanel
              activitySteps={activitySteps}
              isLoading={isLoading}
            />

            {/* RAG Sources Panel */}
            <RAGSourcesPanel citations={ragCitations} />
          </div>

          {/* Right Column: Interactive CPQ Workspace (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Selected BOM */}
            <SelectedBOM
              selectedBOM={validation?.selectedBOM || []}
              onRemoveComponent={handleRemoveComponent}
              onAddComponent={handleAddComponent}
            />

            {/* Constraint Matrix (Pass / Fail Physical & Electrical Rules) */}
            <ConstraintMatrix validation={validation} />

            {/* Pricing Panel */}
            <PricingPanel pricing={validation?.pricing} />

            {/* Alternatives Comparison */}
            <AlternativesPanel
              alternatives={alternatives}
              onApplyAlternative={handleApplyAlternative}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-950/80 bg-[#060c16] py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Siemens SimoCPQ • AI Product Configuration & Decision Support Agent • Built for Siemens Solution Engineer Assessment
        </p>
      </footer>
    </div>
  );
}
