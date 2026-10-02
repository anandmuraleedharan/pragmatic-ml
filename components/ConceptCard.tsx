import React from 'react';
import Link from 'next/link';
import { Concept } from '../lib/curriculum/types';
import { ArrowRight, Zap, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ConceptCardProps {
  concept: Concept;
}

export function ConceptCard({ concept }: ConceptCardProps) {
  const levelBadgeColors = {
    Foundational: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
    'Core ML': 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sm shadow-sky-500/10',
    'Principal Specialist': 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-500/10',
  }[concept.level];

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl doppelrand-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/50 hover:shadow-xl hover:shadow-sky-500/10">
      {/* Subtle Top Glow Line on Hover */}
      <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/0 to-transparent transition-all duration-300 group-hover:via-sky-400/60" />

      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-300 border border-slate-700/60 shadow-sm">
            {concept.sectionTitle}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border ${levelBadgeColors}`}
          >
            {concept.level}
          </span>
        </div>

        {/* Title & Subtitle */}
        <Link href={`/concepts/${concept.id}`} className="block">
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
            {concept.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {concept.subtitle}
          </p>
        </Link>

        {/* The LLM Anti-Pattern Callout Strip (Vibrant, high-contrast) */}
        <div className="mt-4 rounded-r-xl border-l-2 border-amber-400 bg-gradient-to-r from-amber-500/10 via-amber-950/20 to-transparent py-2.5 pl-3.5 pr-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 mb-1">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
            <span className="tracking-wider uppercase text-[10px]">The LLM Anti-Pattern</span>
          </div>
          <p className="text-[11px] text-slate-200 line-clamp-2 leading-normal">
            {concept.llmAntiPattern.scenario}
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-amber-500/15 pt-2 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-mono tabular-nums font-bold">
              <Zap className="h-3 w-3" />
              {concept.llmAntiPattern.tcoComparison.specialized.latency}
            </span>
            <span className="flex items-center gap-1 text-sky-400 font-mono tabular-nums font-bold">
              <DollarSign className="h-3 w-3" />
              {concept.llmAntiPattern.tcoComparison.specialized.costPerMillion}
            </span>
            <span className="flex items-center gap-1 text-purple-300 font-medium">
              <CheckCircle2 className="h-3 w-3 text-purple-400" />
              Deterministic
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {concept.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={tag}
              className={`rounded-md px-2 py-0.5 text-[10px] font-mono border ${
                idx === 0
                  ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                  : idx === 1
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono tabular-nums">
          {concept.engineeringCriteria.complexity.timeInference}
        </span>
        <Link
          href={`/concepts/${concept.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 transition-all group-hover:translate-x-1.5 group-hover:text-cyan-300"
        >
          <span>Explore Specification</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
