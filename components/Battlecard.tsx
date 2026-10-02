'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Concept } from '../lib/curriculum/types';
import { KaTeXFormula } from './KaTeXFormula';
import {
  RotateCw,
  CheckCircle2,
  Clock,
  Zap,
  HardDrive,
  Cpu,
  Layers,
  AlertTriangle,
  ArrowRight,
  Code2,
  Copy,
  Check,
  HelpCircle,
  Bookmark,
  Share2,
} from 'lucide-react';

interface BattlecardProps {
  concept: Concept;
  isFlipped?: boolean;
  onFlip?: () => void;
  isMastered?: boolean;
  onToggleMastered?: () => void;
  compact?: boolean;
  deckMode?: boolean;
}

export function Battlecard({
  concept,
  isFlipped: controlledFlipped,
  onFlip: controlledOnFlip,
  isMastered = false,
  onToggleMastered,
  compact = false,
  deckMode = false,
}: BattlecardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;
  const handleFlip = () => {
    if (controlledOnFlip) {
      controlledOnFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(concept.codeRecipe.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Section Badge Colors
  const sectionColors: Record<string, { border: string; bg: string; text: string }> = {
    'graph-algorithms': { border: 'border-sky-500/30', bg: 'bg-sky-500/10', text: 'text-sky-400' },
    'distance-metrics': { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
    'classical-supervised': { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    'classical-unsupervised': { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400' },
    'recommender-systems': { border: 'border-pink-500/30', bg: 'bg-pink-500/10', text: 'text-pink-400' },
    'classical-nlp': { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    'search-retrieval': { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    'deep-learning': { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400' },
    'evaluation-metrics': { border: 'border-teal-500/30', bg: 'bg-teal-500/10', text: 'text-teal-400' },
    'production-systems': { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  };

  const currentSectionColor = sectionColors[concept.sectionId] || {
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
  };

  // Format mechanical execution steps from keyPoints
  const executionSteps = concept.intuition.keyPoints.slice(0, 3);

  return (
    <div
      className={`perspective-1000 w-full transition-all duration-300 ${
        deckMode ? 'max-w-3xl mx-auto h-[620px] sm:h-[660px]' : 'h-[640px]'
      }`}
    >
      <div
        className={`relative w-full h-full transform-style-3d transition-transform duration-500 ease-out ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ========================================================================= */}
        {/* FRONT FACE: ALGORITHM ANATOMY, INTUITION & FORMULATION */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl doppelrand-card flex flex-col justify-between p-6 sm:p-7 border ${
            isMastered
              ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'border-white/[0.1] hover:border-sky-500/40'
          }`}
        >
          {/* Subtle Top Glow Line */}
          <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

          {/* Top Section & Level Bar */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-lg px-2.5 py-0.5 text-[10px] font-mono font-medium border uppercase tracking-wider ${currentSectionColor.border} ${currentSectionColor.bg} ${currentSectionColor.text}`}
                >
                  {concept.sectionTitle}
                </span>
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 font-medium border border-slate-700/50">
                  {concept.level}
                </span>
              </div>

              {/* Mastered Bookmark Button */}
              {onToggleMastered && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastered();
                  }}
                  className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg border transition-all tactile-press ${
                    isMastered
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20'
                      : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200'
                  }`}
                  title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                >
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${isMastered ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-500'}`}
                  />
                  <span>{isMastered ? 'Mastered' : 'Study'}</span>
                </button>
              )}
            </div>

            {/* Algorithm Title & Subtitle */}
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-sky-300 transition-colors">
                {concept.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {concept.subtitle}
              </p>
            </div>

            {/* 30-Second Mental Model */}
            <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.07] via-slate-900/60 to-transparent p-3.5 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300 uppercase tracking-wider mb-1.5">
                <Cpu className="h-3.5 w-3.5 text-sky-400" />
                <span>30-Second Core Intuition</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal mb-2">
                {concept.intuition.summary}
              </p>
              <ul className="space-y-1">
                {concept.intuition.keyPoints.slice(0, 2).map((kp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                    <span className="text-sky-400 mt-0.5">•</span>
                    <span className="line-clamp-1">{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mathematical Backbone */}
            <div className="rounded-xl border border-purple-500/20 bg-[#070b16] p-3.5 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-400" />
                  <span>Mathematical Backbone</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Formal Formulation</span>
              </div>
              <div className="py-1 text-center overflow-x-auto min-h-[48px] flex items-center justify-center">
                <KaTeXFormula math={concept.mathematics.coreFormula} block />
              </div>
              {/* Variable Glossary Badges */}
              {concept.mathematics.variableDefinitions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/[0.05] pt-2">
                  {concept.mathematics.variableDefinitions.slice(0, 3).map((v, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-slate-400"
                    >
                      <strong className="text-purple-300">{v.symbol}</strong>: {v.meaning}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Complexity Scorecard & Flip Affordance */}
          <div>
            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3 mb-4 text-center">
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  ⏱️ Fit / Train
                </span>
                <span className="text-[11px] font-mono font-bold text-sky-300 truncate block">
                  {concept.engineeringCriteria.complexity.timeTraining || 'O(1) / None'}
                </span>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  ⚡ Query / Infer
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-300 truncate block">
                  {concept.engineeringCriteria.complexity.timeInference}
                </span>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  💾 Space / RAM
                </span>
                <span className="text-[11px] font-mono font-bold text-purple-300 truncate block">
                  {concept.engineeringCriteria.complexity.space}
                </span>
              </div>
            </div>

            {/* Flip Trigger Button */}
            <button
              type="button"
              onClick={handleFlip}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 hover:from-sky-500/30 hover:to-purple-500/30 border border-sky-400/30 px-4 py-2.5 text-xs font-semibold text-sky-200 transition-all tactile-press shadow-sm cursor-pointer"
            >
              <RotateCw className="h-3.5 w-3.5 text-sky-400" />
              <span>Flip for Execution Mechanics &amp; Failure Modes ➔</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BACK FACE: EXECUTION MECHANICS, PITFALLS & INTERVIEW TAKEAWAYS */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl doppelrand-card flex flex-col justify-between p-6 sm:p-7 border ${
            isMastered
              ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'border-white/[0.1] hover:border-indigo-500/40'
          }`}
        >
          {/* Subtle Top Glow Line */}
          <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

          {/* Header & Back Flip Button */}
          <div className="overflow-y-auto pr-1">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300 uppercase tracking-wider">
                  Algorithmic Mechanics
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[180px]">
                  {concept.title}
                </span>
              </div>
              <button
                type="button"
                onClick={handleFlip}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] tactile-press"
              >
                <RotateCw className="h-3 w-3 text-sky-400" />
                <span>Front</span>
              </button>
            </div>

            {/* Algorithmic Execution Steps (Mechanics) */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 mb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-indigo-400" />
                <span>Execution Pipeline (Step-by-Step)</span>
              </div>
              <div className="space-y-1.5">
                {executionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500/30 text-[9px] font-mono font-bold text-indigo-300">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 text-[11px] leading-relaxed line-clamp-2">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* When to Deploy vs When It Breaks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {/* Sweet Spot */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-2.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>When to Deploy</span>
                </div>
                <ul className="space-y-1">
                  {concept.engineeringCriteria.whenToUse.slice(0, 2).map((u, idx) => (
                    <li key={idx} className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                      • {u}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Failure Modes */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/15 p-2.5">
                <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Failure Modes</span>
                </div>
                <ul className="space-y-1">
                  {concept.principalInterviewFocus.failureModesInProduction.slice(0, 2).map((f, idx) => (
                    <li key={idx} className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                      • {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Principal Interview Anchor */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/15 p-2.5 mb-3">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                <HelpCircle className="h-3 w-3 text-amber-400" />
                <span>Principal ML Interview Anchor</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-100 italic mb-1 line-clamp-1">
                &ldquo;{concept.principalInterviewFocus.question}&rdquo;
              </p>
              <p className="text-[10px] text-slate-300 leading-normal line-clamp-2">
                {concept.principalInterviewFocus.insight}
              </p>
            </div>

            {/* Production Micro-Recipe */}
            <div className="rounded-xl border border-white/[0.08] bg-[#070b14] p-2.5 mb-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-sky-300">
                  <Code2 className="h-3 w-3" />
                  <span>{concept.codeRecipe.framework}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="hover:text-white flex items-center gap-1 text-[9px] tactile-press"
                >
                  {copiedCode ? (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Check className="h-2.5 w-2.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Copy className="h-2.5 w-2.5" /> Copy Code
                    </span>
                  )}
                </button>
              </div>
              <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto p-1.5 rounded bg-black/40 leading-snug">
                <code>{concept.codeRecipe.code.split('\n').slice(0, 4).join('\n')}</code>
              </pre>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleFlip}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] tactile-press"
            >
              <RotateCw className="h-3 w-3 text-sky-400" />
              <span>Flip Back</span>
            </button>

            <Link
              href={`/concepts/${concept.id}`}
              className="text-xs font-semibold text-sky-400 hover:text-cyan-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 tactile-press"
            >
              <span>Full Blueprint</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
