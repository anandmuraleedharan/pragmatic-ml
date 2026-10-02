'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Concept } from '../lib/curriculum/types';
import { ConceptDiagram } from './ConceptDiagram';
import { KaTeXFormula } from './KaTeXFormula';
import {
  CosineSimilaritySimulator,
  KMeansSimulator,
  LatencyRaceSimulator,
  HybridRRFSimulator,
} from './InteractiveSimulators';
import {
  ShieldAlert,
  BookOpen,
  Cpu,
  Code2,
  Clock,
  HardDrive,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  DollarSign,
  Layers,
  LayoutGrid,
  Columns,
  Gamepad2,
} from 'lucide-react';

interface ConceptCarouselProps {
  concept: Concept;
}

const SLIDES = [
  { id: 'anti-pattern', title: 'Anti-Pattern', icon: ShieldAlert, short: 'Anti-Pattern' },
  { id: 'intuition', title: 'Intuition', icon: BookOpen, short: 'Intuition' },
  { id: 'diagram', title: 'Architecture', icon: Cpu, short: 'Diagram' },
  { id: 'math', title: 'Mathematics', icon: Layers, short: 'Math' },
  { id: 'production', title: 'Bounds & Complexity', icon: Clock, short: 'Bounds' },
  { id: 'code', title: 'Code Recipe', icon: Code2, short: 'Code' },
  { id: 'interview', title: 'Principal Interview', icon: HelpCircle, short: 'Interview' },
];

export function ConceptCarousel({ concept }: ConceptCarouselProps) {
  const [displayMode, setDisplayMode] = useState<'carousel' | 'visual-bento'>('carousel');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [diagramSubTab, setDiagramSubTab] = useState<'simulator' | 'blueprint'>('simulator');
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Check if this concept has a micro-simulator available
  const hasSimulator =
    concept.id === 'cosine-similarity' ||
    concept.id === 'kmeans' ||
    concept.id === 'bm25' ||
    concept.id === 'hybrid-rrf' ||
    concept.id === 'cross-encoders';

  const renderSimulator = () => {
    switch (concept.id) {
      case 'cosine-similarity':
        return <CosineSimilaritySimulator />;
      case 'kmeans':
        return <KMeansSimulator />;
      case 'bm25':
        return <LatencyRaceSimulator />;
      case 'hybrid-rrf':
      case 'cross-encoders':
        return <HybridRRFSimulator />;
      default:
        return null;
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (displayMode !== 'carousel') return;
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayMode]);

  // Touch Handlers for Mobile Swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Top View Mode Switcher: Visual Learner Bento vs Stage Carousel */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#070b14] border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Choose Presentation Mode:</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setDisplayMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              displayMode === 'carousel'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>7-Stage Deep Dive</span>
          </button>

          <button
            onClick={() => setDisplayMode('visual-bento')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              displayMode === 'visual-bento'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Visual Learner Bento</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: VISUAL LEARNER BENTO (All Visuals Front & Center)
          ========================================================================= */}
      {displayMode === 'visual-bento' ? (
        <div className="space-y-6">
          {/* Main Visual Architecture / Simulator Panel */}
          <div className="rounded-2xl doppelrand-card p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span>Core Architectural Blueprint &amp; Dataflow</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Scalable Vector Graphics</span>
            </div>

            {hasSimulator && (
              <div className="mb-6">
                {renderSimulator()}
              </div>
            )}

            <ConceptDiagram conceptId={concept.id} caption={concept.diagram.caption} />
          </div>

          {/* Visual Battlecard: Speed & Cost Race */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                <span>Specialized Model: {concept.title}</span>
              </span>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-emerald-900/30 pb-2 text-slate-300">
                  <span>Inference Latency:</span>
                  <span className="text-emerald-400 font-bold text-sm">{concept.llmAntiPattern.tcoComparison.specialized.latency}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-900/30 pb-2 text-slate-300">
                  <span>Cloud Cost / 1M Ops:</span>
                  <span className="text-emerald-400 font-bold text-sm">{concept.llmAntiPattern.tcoComparison.specialized.costPerMillion}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Determinism:</span>
                  <span className="text-emerald-400">{concept.llmAntiPattern.tcoComparison.specialized.determinism}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-5">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span>LLM Alternative (Anti-Pattern)</span>
              </span>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-rose-900/30 pb-2 text-slate-300">
                  <span>Inference Latency:</span>
                  <span className="text-rose-400 font-bold text-sm">{concept.llmAntiPattern.tcoComparison.llmAlternative.latency}</span>
                </div>
                <div className="flex justify-between border-b border-rose-900/30 pb-2 text-slate-300">
                  <span>Cloud Cost / 1M Ops:</span>
                  <span className="text-rose-400 font-bold text-sm">{concept.llmAntiPattern.tcoComparison.llmAlternative.costPerMillion}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Determinism:</span>
                  <span className="text-rose-400">{concept.llmAntiPattern.tcoComparison.llmAlternative.determinism}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Objective & Derivation */}
          <div className="rounded-2xl doppelrand-card p-6">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-3">
              Mathematical Formulation
            </span>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 shadow-inner mb-4">
              <KaTeXFormula math={concept.mathematics.coreFormula} block />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-white">Intuition: </strong>
              {concept.mathematics.derivationOrIntuition}
            </p>
          </div>

          {/* Copy-Paste Ready Code Recipe */}
          <div className="rounded-2xl doppelrand-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="h-4 w-4" />
                <span>Production Code Recipe ({concept.codeRecipe.framework})</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Copy-Paste Ready</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-xl">
              <pre className="overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                <code>{concept.codeRecipe.code}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW MODE 2: SEQUENTIAL 7-STAGE CAROUSEL
            ========================================================================= */
        <>
          {/* Sticky Carousel Navigation Header */}
          <div className="sticky top-16 z-30 -mx-4 sm:mx-0 doppelrand-card sm:rounded-2xl p-2.5 sm:p-3 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-white/[0.07] mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-400 font-mono tracking-wider">
                  STAGE {currentSlide + 1} / {SLIDES.length}
                </span>
                <span className="text-xs font-medium text-slate-300">
                  — {SLIDES[currentSlide].title}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                &larr; &rarr; Arrow keys or swipe to navigate
              </span>
            </div>

            {/* Horizontal Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SLIDES.map((slide, idx) => {
                const Icon = slide.icon;
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tactile-press transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/30 border border-sky-400/40'
                        : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{slide.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress Bar Line */}
            <div className="mt-2 h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 shadow-sm shadow-sky-400/50 transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Slide Card Container with Touch Gestures */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="min-h-[480px] rounded-2xl doppelrand-card p-6 sm:p-8 transition-all"
          >
            {/* SLIDE 0: Anti-Pattern & Visual Battlecard */}
            {currentSlide === 0 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-400 pb-3 border-b border-amber-900/30">
                  <ShieldAlert className="h-5 w-5" />
                  <span>Section 1: The LLM Anti-Pattern vs Right-Sized Model</span>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      The Naive Generative LLM Approach:
                    </span>
                    <p className="text-sm font-medium text-white leading-relaxed">
                      {concept.llmAntiPattern.scenario}
                    </p>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                      Why It Fails in Production:
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {concept.llmAntiPattern.whyItFails}
                    </p>
                  </div>
                </div>

                {/* Scorecard Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <Zap className="h-4 w-4" />
                      <span>Targeted Algorithm ({concept.title})</span>
                    </span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-emerald-900/30 pb-1.5 text-slate-300">
                        <span>Latency:</span>
                        <span className="text-emerald-400 font-bold">{concept.llmAntiPattern.tcoComparison.specialized.latency}</span>
                      </div>
                      <div className="flex justify-between border-b border-emerald-900/30 pb-1.5 text-slate-300">
                        <span>Cost / 1M Ops:</span>
                        <span className="text-emerald-400 font-bold">{concept.llmAntiPattern.tcoComparison.specialized.costPerMillion}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Determinism:</span>
                        <span className="text-emerald-400">{concept.llmAntiPattern.tcoComparison.specialized.determinism}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      <span>Generative LLM Alternative</span>
                    </span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-red-900/30 pb-1.5 text-slate-300">
                        <span>Latency:</span>
                        <span className="text-red-400 font-bold">{concept.llmAntiPattern.tcoComparison.llmAlternative.latency}</span>
                      </div>
                      <div className="flex justify-between border-b border-red-900/30 pb-1.5 text-slate-300">
                        <span>Cost / 1M Ops:</span>
                        <span className="text-red-400 font-bold">{concept.llmAntiPattern.tcoComparison.llmAlternative.costPerMillion}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Determinism:</span>
                        <span className="text-red-400">{concept.llmAntiPattern.tcoComparison.llmAlternative.determinism}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 1: Core Intuition */}
            {currentSlide === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-400 pb-3 border-b border-slate-800">
                  <BookOpen className="h-5 w-5" />
                  <span>Section 2: Conceptual Mechanism &amp; Intuition</span>
                </div>

                <p className="text-base font-medium text-white leading-relaxed">
                  {concept.intuition.summary}
                </p>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-3">
                    Key Conceptual Pillars
                  </span>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {concept.intuition.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 text-sm text-slate-300 leading-relaxed">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Detailed Mechanics
                  </span>
                  <p>{concept.intuition.detailedExplanation}</p>
                </div>
              </div>
            )}

            {/* SLIDE 2: Architectural Diagram & Interactive Simulator */}
            {currentSlide === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
                    <Cpu className="h-5 w-5" />
                    <span>Section 3: Visual Architecture &amp; Dataflow</span>
                  </div>

                  {hasSimulator && (
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
                      <button
                        onClick={() => setDiagramSubTab('simulator')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          diagramSubTab === 'simulator'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Gamepad2 className="h-3.5 w-3.5" />
                        <span>Interactive Simulator</span>
                      </button>
                      <button
                        onClick={() => setDiagramSubTab('blueprint')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          diagramSubTab === 'blueprint'
                            ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Cpu className="h-3.5 w-3.5" />
                        <span>Vector Blueprint</span>
                      </button>
                    </div>
                  )}
                </div>

                {hasSimulator && diagramSubTab === 'simulator' ? (
                  renderSimulator()
                ) : (
                  <ConceptDiagram conceptId={concept.id} caption={concept.diagram.caption} />
                )}
              </div>
            )}

            {/* SLIDE 3: Mathematical Formulation */}
            {currentSlide === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-400 pb-3 border-b border-slate-800">
                  <span className="font-serif italic font-bold text-xl text-sky-400">&Sigma;</span>
                  <span>Section 4: Mathematical Formulation &amp; Objectives</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner">
                  <span className="text-xs font-mono text-slate-400 block mb-2">Core Objective Formula:</span>
                  <KaTeXFormula math={concept.mathematics.coreFormula} block />
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                    Variable Definitions &amp; Notation
                  </span>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 pr-4 font-semibold">Symbol</th>
                        <th className="pb-2 pl-4 font-semibold">Mathematical Meaning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {concept.mathematics.variableDefinitions.map((v, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 pr-4 font-mono text-sky-400 font-semibold">{v.symbol}</td>
                          <td className="py-2.5 pl-4">{v.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Derivation Note: </strong>
                  {concept.mathematics.derivationOrIntuition}
                </div>
              </div>
            )}

            {/* SLIDE 4: Production Bounds & Complexity */}
            {currentSlide === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-400 pb-3 border-b border-slate-800">
                  <Clock className="h-5 w-5" />
                  <span>Section 5: Practical Engineering Bounds &amp; Complexity</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>When To Deploy (Sweet Spot)</span>
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {concept.engineeringCriteria.whenToUse.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-5">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      <span>When To Avoid (Boundary Limits)</span>
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {concept.engineeringCriteria.whenToAvoid.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Big-O Complexity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Clock className="h-3.5 w-3.5 text-sky-400" />
                      <span>Inference Latency SLA</span>
                    </div>
                    <p className="text-xs font-mono text-emerald-400 font-bold">
                      {concept.engineeringCriteria.complexity.timeInference}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Clock className="h-3.5 w-3.5 text-sky-400" />
                      <span>Training Time</span>
                    </div>
                    <p className="text-xs font-mono text-slate-300">
                      {concept.engineeringCriteria.complexity.timeTraining || 'N/A (Instant)'}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <HardDrive className="h-3.5 w-3.5 text-purple-400" />
                      <span>Space Footprint</span>
                    </div>
                    <p className="text-xs font-mono text-slate-300">
                      {concept.engineeringCriteria.complexity.space}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 5: Production Code Recipe */}
            {currentSlide === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
                    <Code2 className="h-5 w-5" />
                    <span>Section 6: Production Code Recipe ({concept.codeRecipe.framework})</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">Copy-Paste Ready</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-xl">
                  <pre className="overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                    <code>{concept.codeRecipe.code}</code>
                  </pre>
                </div>

                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Execution Mechanism: </strong>
                  {concept.codeRecipe.explanation}
                </p>
              </div>
            )}

            {/* SLIDE 6: Principal ML Interview Focus */}
            {currentSlide === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-400 pb-3 border-b border-purple-900/30">
                  <HelpCircle className="h-5 w-5" />
                  <span>Section 7: Principal ML Engineer Architectural Scenario</span>
                </div>

                <div className="rounded-xl border border-purple-900/40 bg-purple-950/20 p-5">
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider block mb-2">
                    Interview Scenario Question:
                  </span>
                  <p className="text-sm font-bold text-white italic leading-relaxed">
                    &ldquo;{concept.principalInterviewFocus.question}&rdquo;
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Principal-Level Architectural Answer:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {concept.principalInterviewFocus.insight}
                  </p>
                </div>

                {concept.principalInterviewFocus.failureModesInProduction?.length > 0 && (
                  <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-4">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-2">
                      Common Production Failure Modes:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {concept.principalInterviewFocus.failureModesInProduction.map((fm, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{fm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slide Navigation Footer Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium tactile-press transition-all ${
                currentSlide === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-500 border border-white/[0.06]'
                  : 'text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Stage</span>
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx
                      ? 'w-8 bg-gradient-to-r from-sky-400 to-indigo-400 shadow-sm shadow-sky-400/50'
                      : 'w-2 bg-white/[0.15] hover:bg-white/[0.3]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === SLIDES.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tactile-press transition-all ${
                currentSlide === SLIDES.length - 1
                  ? 'opacity-40 cursor-not-allowed text-slate-500 border border-white/[0.06]'
                  : 'text-white bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:brightness-110 shadow-md shadow-indigo-500/25 border border-sky-400/30'
              }`}
            >
              <span>Next Stage</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
