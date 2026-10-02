'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DECISION_RULES, DecisionRule } from '../../lib/decision-engine';
import {
  Compass,
  Zap,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Database,
  Cpu,
  Search,
  Sparkles,
} from 'lucide-react';

export default function DecisionCataloguePage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLatency, setSelectedLatency] = useState<string>('all');
  const [selectedData, setSelectedData] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains = useMemo(() => {
    return Array.from(new Set(DECISION_RULES.map((r) => r.problemDomain)));
  }, []);

  const filteredRules = useMemo(() => {
    return DECISION_RULES.filter((rule) => {
      if (selectedDomain !== 'all' && rule.problemDomain !== selectedDomain) return false;
      if (selectedLatency !== 'all' && rule.latencySLA !== selectedLatency) return false;
      if (selectedData !== 'all' && rule.dataRequirement !== selectedData) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          rule.taskTitle.toLowerCase().includes(q) ||
          rule.recommendedStack.primaryAlgorithm.toLowerCase().includes(q) ||
          rule.rationale.toLowerCase().includes(q) ||
          rule.antiPatternLLM.whyLLMFails.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedDomain, selectedLatency, selectedData, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-gradient-to-r from-sky-500/20 via-teal-500/20 to-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-sky-300 shadow-lg shadow-sky-500/10 backdrop-blur-md mb-4">
          <Compass className="h-4 w-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Interactive Architectural Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-[1.15]">
          The Principal ML <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent font-black">Decision Catalogue</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Input your engineering constraints (Latency SLA, data availability, compute budget) to find the right-sized model pipeline. Stop throwing LLM tokens at tasks classical algorithms solve in 2ms.
        </p>
      </div>

      {/* Interactive Constraint Filter Bar */}
      <div className="mt-10 rounded-2xl doppelrand-card p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter Engineering Constraints</span>
          </span>
          <button
            onClick={() => {
              setSelectedDomain('all');
              setSelectedLatency('all');
              setSelectedData('all');
              setSearchQuery('');
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Domain Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Problem Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All Domains ({DECISION_RULES.length})</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Latency SLA */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Latency Constraint (P99)
            </label>
            <select
              value={selectedLatency}
              onChange={(e) => setSelectedLatency(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">Any Latency SLA</option>
              <option value="< 5ms (Real-time)">&lt; 5ms (Real-time Ad/Edge)</option>
              <option value="< 50ms (Interactive)">&lt; 50ms (User Interactive)</option>
              <option value="< 1s (Batch)">&lt; 1s (Async / Batch)</option>
            </select>
          </div>

          {/* Data Requirement */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Labeled Training Data
            </label>
            <select
              value={selectedData}
              onChange={(e) => setSelectedData(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">Any Data Availability</option>
              <option value="Zero-Shot (No Labels)">Zero-Shot (No Labels)</option>
              <option value="Few-Shot (10-50 examples)">Few-Shot (10-50 examples)</option>
              <option value="Supervised Dataset (1k+)">Supervised Dataset (1k+)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. SKU, NER, routing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rules Result Cards */}
      <div className="mt-8 space-y-6">
        {filteredRules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <p className="text-sm font-semibold text-slate-300">No architectural rules matched your exact combination</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the latency or data constraint filters.</p>
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-2xl doppelrand-card p-6 sm:p-7 transition-all"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
                    {rule.problemDomain}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-emerald-400">
                    <Clock className="h-3 w-3" />
                    {rule.latencySLA}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 hidden sm:inline-flex">
                    <Database className="h-3 w-3 text-purple-400" />
                    {rule.dataRequirement}
                  </span>
                </div>

                <span className="flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  <Cpu className="h-3 w-3 text-cyan-400" />
                  {rule.computeTarget}
                </span>
              </div>

              {/* Task Title */}
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
                {rule.taskTitle}
              </h2>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                {rule.rationale}
              </p>

              {/* Two Column Prescription */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Prescribed Stack */}
                <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#0a0f1d]/80 to-[#060813] p-5 shadow-lg shadow-emerald-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Recommended Architecture</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Zero Hallucination
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white mb-3">
                    {rule.recommendedStack.primaryAlgorithm}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Pipeline Stages:</span>
                    {rule.recommendedStack.pipelineSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-end">
                    <Link
                      href={`/concepts/${rule.recommendedStack.conceptSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition-all text-xs font-semibold tactile-press"
                    >
                      <span>Study Full Implementation</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* LLM Anti-Pattern Alert */}
                <div className="rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-[#0a0f1d]/80 to-[#060813] p-5 flex flex-col justify-between shadow-lg shadow-rose-500/5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4 text-rose-400" />
                        <span>Why Generative LLM Fails</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-full">
                        High Risk
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-4">
                      {rule.antiPatternLLM.whyLLMFails}
                    </p>
                  </div>

                  <div className="border-t border-rose-500/20 pt-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Wasted Cost / 1M:</span>
                    <span className="text-rose-400 font-bold text-sm">{rule.antiPatternLLM.wastedCostPerMillion}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
