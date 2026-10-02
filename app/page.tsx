'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllConcepts, getAllSections } from '../lib/curriculum/registry';
import { ConceptCard } from '../components/ConceptCard';
import {
  Search,
  Sparkles,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';


export default function HomePage() {
  const allSections = useMemo(() => getAllSections(), []);
  const allConcepts = useMemo(() => getAllConcepts(), []);

  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredConcepts = useMemo(() => {
    return allConcepts.filter((concept) => {
      // Section filter
      if (selectedSection !== 'all' && concept.sectionId !== selectedSection) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && concept.level !== selectedLevel) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = concept.title.toLowerCase().includes(q);
        const matchesSubtitle = concept.subtitle.toLowerCase().includes(q);
        const matchesTags = concept.tags.some((t) => t.toLowerCase().includes(q));
        const matchesAntiPattern = concept.llmAntiPattern.scenario.toLowerCase().includes(q);
        return matchesTitle || matchesSubtitle || matchesTags || matchesAntiPattern;
      }
      return true;
    });
  }, [allConcepts, selectedSection, selectedLevel, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 px-4 py-1.5 text-xs font-semibold text-sky-300 shadow-lg shadow-sky-500/10 backdrop-blur-md mb-8">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>The Anti-LLM Playbook for Principal ML Engineers</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
          Stop Using an{' '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 bg-clip-text text-transparent font-black">
            LLM Hammer
          </span>
          <br className="hidden sm:block" /> for a Thumbtack Problem
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base text-slate-300 sm:text-lg leading-relaxed font-normal">
          Defaulting to 70B+ parameter generative LLMs for entity extraction, string distance, graph routing, or click prediction wastes millions in API bills, adds seconds of latency, and introduces hallucination risks. Master the{' '}
          <strong className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 font-semibold">
            targeted, specialized, and classical algorithms
          </strong>{' '}
          that execute in 2ms, cost $0, and run deterministically.
        </p>

        {/* Telemetry Stats Strip (Vibrant 4-Color Palette) */}
        <div className="mx-auto mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {/* Card 1: Sky / Cyan */}
          <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-b from-sky-500/15 via-slate-900/80 to-[#070914] p-4 text-center shadow-lg shadow-sky-500/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
              <Cpu className="h-4 w-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">10</span>
            </div>
            <p className="text-[11px] font-mono text-sky-300/80 uppercase tracking-wider font-semibold">Pillars</p>
          </div>

          {/* Card 2: Emerald / Mint */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/15 via-slate-900/80 to-[#070914] p-4 text-center shadow-lg shadow-emerald-500/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">&lt; 5ms</span>
            </div>
            <p className="text-[11px] font-mono text-emerald-300/80 uppercase tracking-wider font-semibold">P99 SLA</p>
          </div>

          {/* Card 3: Amber / Gold */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/15 via-slate-900/80 to-[#070914] p-4 text-center shadow-lg shadow-amber-500/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">$0.00</span>
            </div>
            <p className="text-[11px] font-mono text-amber-300/80 uppercase tracking-wider font-semibold">API Overhead</p>
          </div>

          {/* Card 4: Purple / Fuchsia */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-500/15 via-slate-900/80 to-[#070914] p-4 text-center shadow-lg shadow-purple-500/10 backdrop-blur-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-center gap-1.5 text-purple-400 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-2xl font-bold font-mono tabular-nums text-white">100%</span>
            </div>
            <p className="text-[11px] font-mono text-purple-300/80 uppercase tracking-wider font-semibold">Deterministic</p>
          </div>
        </div>

        {/* Battlecard Feature Callout */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-purple-500/10 p-5 text-left sm:flex sm:items-center sm:justify-between shadow-xl shadow-amber-500/5">
          <div className="flex items-start gap-3.5 mb-4 sm:mb-0">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Algorithm Mastery Battlecards</h3>
                <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono uppercase font-bold">
                  Quick Study
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                30-second algorithm flashcards: Core equations (KaTeX), execution mechanics, Big-O complexities, and principal interview takeaways across all 38 topics.
              </p>
            </div>
          </div>
          <Link
            href="/battlecards"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/25 transition-all tactile-press cursor-pointer"
          >
            <span>Study Battlecards</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}

      <div id="curriculum" className="mt-16 space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-400" />
            <input
              type="text"
              placeholder="Search concepts, algorithms, formulas (e.g. GLiNER, PageRank)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-sky-500/20 bg-[#0c101d] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 transition-all shadow-inner"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-medium">Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border border-white/[0.1] bg-[#0c101d] px-3.5 py-2 text-xs text-slate-200 focus:border-sky-400 focus:outline-none transition-colors shadow-sm"
            >
              <option value="all">All Levels</option>
              <option value="Foundational">Foundational</option>
              <option value="Core ML">Core ML</option>
              <option value="Principal Specialist">Principal Specialist</option>
            </select>
          </div>
        </div>

        {/* Section Category Pills (Vibrant Gradient Transitions) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSection('all')}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tactile-press transition-all ${
              selectedSection === 'all'
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30'
                : 'border border-white/[0.08] bg-[#0d1222] text-slate-300 hover:border-sky-500/30 hover:text-white'
            }`}
          >
            All Pillars ({allConcepts.length})
          </button>
          {allSections.map((sec) => {
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tactile-press transition-all flex items-center gap-2 ${
                  isSelected
                    ? `bg-gradient-to-r ${sec.badgeColor} text-white shadow-lg shadow-indigo-500/30 border border-white/20`
                    : 'border border-white/[0.08] bg-[#0d1222] text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                <span>{sec.shortTitle}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/[0.08] text-slate-300'
                  }`}
                >
                  {sec.conceptCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Concepts */}
      <div className="mt-8">
        {filteredConcepts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-500/30 bg-sky-950/10 p-12 text-center backdrop-blur-sm">
            <HelpCircle className="mx-auto h-8 w-8 text-sky-400 mb-2" />
            <p className="text-base text-slate-200 font-semibold">No concepts matched your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting another pillar.</p>
            <button
              onClick={() => {
                setSelectedSection('all');
                setSelectedLevel('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:brightness-110 shadow-md shadow-sky-500/20 tactile-press"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        )}
      </div>

      {/* Principal Engineering Decision Matrix */}
      <div className="mt-24 rounded-2xl doppelrand-card p-8 border border-sky-500/20 shadow-xl shadow-sky-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 uppercase tracking-wider font-semibold mb-1">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Production SLA Diagnostics</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              The Principal ML Architect Decision Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              A rapid diagnostic guide for choosing between Generative LLMs and Right-Sized Models in production.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.1] text-sky-300 font-mono uppercase text-[11px]">
                <th className="pb-3 pr-4">Task Requirement</th>
                <th className="pb-3 px-4 text-rose-400">LLM Approach (Anti-Pattern)</th>
                <th className="pb-3 px-4 text-emerald-400">Targeted / Specialized Model</th>
                <th className="pb-3 pl-4 text-cyan-400">Latency & Cost Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-mono text-[11px] text-slate-300">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4 font-sans text-white font-semibold">Named Entity Recognition (NER)</td>
                <td className="py-3.5 px-4 text-rose-400">Prompting 70B LLM with JSON schema</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">GLiNER (Zero-shot bi-encoder spans)</td>
                <td className="py-3.5 pl-4 text-sky-300 font-bold tabular-nums">15ms vs 2,500ms (150x faster, $0)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4 font-sans text-white font-semibold">Graph Centrality & Authority</td>
                <td className="py-3.5 px-4 text-rose-400">Pasting edge lists into LLM prompt</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">PageRank (Power iteration)</td>
                <td className="py-3.5 pl-4 text-sky-300 font-bold tabular-nums">5ms vs Timeout (100% Deterministic)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4 font-sans text-white font-semibold">Keyword / Exact SKU Search</td>
                <td className="py-3.5 px-4 text-rose-400">Vector search or LLM doc scanning</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">Okapi BM25 Inverted Index</td>
                <td className="py-3.5 pl-4 text-sky-300 font-bold tabular-nums">0.8ms vs 3,000ms (Exact Match)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4 font-sans text-white font-semibold">String Deduplication / Typos</td>
                <td className="py-3.5 px-4 text-rose-400">Asking LLM if strings match</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">Levenshtein DP or MinHash LSH</td>
                <td className="py-3.5 pl-4 text-sky-300 font-bold tabular-nums">0.02ms vs 1,400ms (Hardware POPCNT)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pr-4 font-sans text-white font-semibold">Tabular Risk / CTR Bidding</td>
                <td className="py-3.5 px-4 text-rose-400">Passing row features to LLM</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">XGBoost / LightGBM or Logistic Reg</td>
                <td className="py-3.5 pl-4 text-sky-300 font-bold tabular-nums">0.05ms vs 1,800ms (Meets 10ms ad SLA)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
