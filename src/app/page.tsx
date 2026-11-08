'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EngineerInput, PRESET_SCENARIOS } from '@/components/EngineerInput';
import { CleanCPQDashboard } from '@/components/CleanCPQDashboard';
import { WorkflowNodeGraph } from '@/components/WorkflowNodeGraph';
import { DataArchitectureOverview } from '@/components/DataArchitectureOverview';
import { AgentActivityStep, AgentExecutionResult } from '@/lib/agent/controller';
import { ValidationSummary, CustomerRequirements } from '@/lib/engine/constraints';
import { TechnicalDocumentCitation } from '@/lib/rag/knowledge';
import { Layers, GitFork, Database, Sparkles } from 'lucide-react';

export default function SimoCPQDashboard() {
  const [activeTab, setActiveTab] = useState<'solution' | 'workflow' | 'data'>('solution');
  const [prompt, setPrompt] = useState(PRESET_SCENARIOS[0].prompt);
  const [customerTier, setCustomerTier] = useState<'Standard (0%)' | 'OEM Partner (12%)' | 'Strategic Enterprise (20%)'>('OEM Partner (12%)');
  const [isLoading, setIsLoading] = useState(false);

  const [activitySteps, setActivitySteps] = useState<AgentActivityStep[]>([]);
  const [validation, setValidation] = useState<ValidationSummary | undefined>(undefined);
  const [ragCitations, setRagCitations] = useState<TechnicalDocumentCitation[]>([]);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [originalBOMIds, setOriginalBOMIds] = useState<string[]>([]);
  const [currentRequirements, setCurrentRequirements] = useState<CustomerRequirements>({
    powerKW: 15,
    voltageV: 400,
    cooling: 'Water (IC71W)',
    cableLengthMeters: 75,
    ambientTempC: 48,
    closedLoopFeedback: true,
    customerTier: 'OEM Partner (12%)',
  });

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
      setCurrentRequirements(data.parsedRequirements);
      if (data.validation?.selectedBOM) {
        setOriginalBOMIds(data.validation.selectedBOM.map(p => p.id));
      }
    } catch (err: unknown) {
      console.error('Agent execution error:', err);
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

  const handleApplyAlternative = (componentIds: string[]) => {
    revalidateBOM(componentIds);
  };

  const handleRestoreOriginalBOM = () => {
    if (originalBOMIds.length > 0) {
      revalidateBOM(originalBOMIds);
    }
  };

  const isCustomOrAlternative = Boolean(
    validation &&
    originalBOMIds.length > 0 &&
    (validation.selectedBOM.length !== originalBOMIds.length ||
      !validation.selectedBOM.every((p) => originalBOMIds.includes(p.id)))
  );

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
  };

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

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Top: Engineer Input & 1-Click Scenarios */}
        <EngineerInput
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={handleRunAgent}
          isLoading={isLoading}
          onClear={handleClear}
        />

        {/* View Mode Switcher Tabs (Clean Segmented Control) */}
        <div className="border-b border-slate-800/80 pb-3">
          <div className="inline-flex p-1 rounded-xl bg-[#060c16] border border-slate-800/80 gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'solution'
                  ? 'bg-gradient-to-r from-[#00646e] to-[#00ffb9] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hardware Solution</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'workflow'
                  ? 'bg-gradient-to-r from-[#00646e] to-[#00ffb9] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Workflow Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-gradient-to-r from-[#00646e] to-[#00ffb9] text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data Architecture</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Clean Executive Dashboard */}
        {activeTab === 'solution' && (
          <CleanCPQDashboard
            validation={validation}
            activitySteps={activitySteps}
            ragCitations={ragCitations}
            alternatives={alternatives}
            onApplyAlternative={handleApplyAlternative}
            onRestoreOriginal={handleRestoreOriginalBOM}
            isCustomOrAlternative={isCustomOrAlternative}
            onRemoveComponent={handleRemoveComponent}
            isLoading={isLoading}
          />
        )}

        {/* Tab 2: Architecture Workflow Node Graph */}
        {activeTab === 'workflow' && (
          <WorkflowNodeGraph
            activitySteps={activitySteps}
            parsedRequirements={currentRequirements}
            validation={validation}
            ragCitations={ragCitations}
            prompt={prompt}
            isLoading={isLoading}
          />
        )}

        {/* Tab 3: Data Architecture Overview */}
        {activeTab === 'data' && (
          <DataArchitectureOverview />
        )}
      </main>

      <footer className="border-t border-cyan-950/80 bg-[#060c16] py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Siemens SimoCPQ • AI Product Configuration & Decision Support Agent • Built for Siemens DAI R Assessment
        </p>
      </footer>
    </div>
  );
}
