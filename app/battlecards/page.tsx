'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAllConcepts, getAllSections } from '../../lib/curriculum/registry';
import { Concept, SectionId } from '../../lib/curriculum/types';
import { Battlecard } from '../../components/Battlecard';
import {
  ArrowLeft,
  Zap,
  Sparkles,
  Layers,
  LayoutGrid,
  CheckCircle2,
  RotateCw,
  Search,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Filter,
  Flame,
  Award,
} from 'lucide-react';

function BattlecardsContent() {
  const searchParams = useSearchParams();
  const allConcepts = useMemo(() => getAllConcepts(), []);
  const allSections = useMemo(() => getAllSections(), []);

  // Display Mode: 'deck' (focused study flashcards) or 'grid' (all 38 cards)
  const initialMode = searchParams.get('mode') === 'grid' ? 'grid' : 'deck';
  const initialConcept = searchParams.get('concept');

  const [viewMode, setViewMode] = useState<'deck' | 'grid'>(initialMode);
  const [currentDeckIndex, setCurrentDeckIndex] = useState(() => {
    if (initialConcept) {
      const idx = allConcepts.findIndex((c) => c.id === initialConcept);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'mastered' | 'review'>('all');
  const [flipAllGrid, setFlipAllGrid] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load mastered items from localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('pragmatic_ml_mastered_algorithms');
      if (saved) {
        setMasteredIds(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Save mastered items
  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pragmatic_ml_mastered_algorithms', JSON.stringify(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return allConcepts.filter((c) => {
      if (selectedSection !== 'all' && c.sectionId !== selectedSection) return false;
      if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
      if (masteryFilter === 'mastered' && !masteredIds.includes(c.id)) return false;
      if (masteryFilter === 'review' && masteredIds.includes(c.id)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesSubtitle = c.subtitle.toLowerCase().includes(q);
        const matchesSection = c.sectionTitle.toLowerCase().includes(q);
        const matchesTags = c.tags.some((t) => t.toLowerCase().includes(q));
        const matchesMath = c.mathematics.coreFormula.toLowerCase().includes(q);
        return matchesTitle || matchesSubtitle || matchesSection || matchesTags || matchesMath;
      }
      return true;
    });
  }, [allConcepts, selectedSection, selectedLevel, masteryFilter, masteredIds, searchQuery]);

  // Keep deck index bounded
  const currentConcept = filteredConcepts[currentDeckIndex] || filteredConcepts[0] || allConcepts[0];

  const nextCard = () => {
    if (filteredConcepts.length === 0) return;
    setCurrentDeckIndex((prev) => (prev < filteredConcepts.length - 1 ? prev + 1 : 0));
  };

  const prevCard = () => {
    if (filteredConcepts.length === 0) return;
    setCurrentDeckIndex((prev) => (prev > 0 ? prev - 1 : filteredConcepts.length - 1));
  };

  const shuffleDeck = () => {
    if (filteredConcepts.length <= 1) return;
    const randomIndex = Math.floor(Math.random() * filteredConcepts.length);
    setCurrentDeckIndex(randomIndex);
  };

  // Keyboard Navigation for Deck Mode
  useEffect(() => {
    if (viewMode !== 'deck') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in search input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'j') {
        nextCard();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        prevCard();
      } else if (e.key === 'm' || e.key === 'M') {
        if (currentConcept) toggleMastered(currentConcept.id);
      } else if (e.key === 'r' || e.key === 'R') {
        shuffleDeck();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentConcept, filteredConcepts.length]);

  const masteryPercentage = Math.round((masteredIds.length / allConcepts.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Breadcrumb Nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1 tactile-press">
              <ArrowLeft className="h-3 w-3" />
              <span>PragmaticML Hub</span>
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Algorithm Battlecards</span>
          </nav>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Algorithm{' '}
              <span className="bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Battlecards
              </span>
            </h1>
            <span className="hidden sm:inline-flex rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-mono font-bold text-amber-300 shadow-sm shadow-amber-500/10">
              30-Second Mastery
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            High-density flashcards engineered for algorithmic mastery: Mathematical formulas, execution mechanics, Big-O complexities, deployment sweet spots, and principal interview takeaways.
          </p>
        </div>

        {/* Mastery Progress Badge */}
        <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto bg-slate-900/80 border border-white/[0.08] p-3 rounded-2xl">
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span>Mastery Progress</span>
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {isClient ? masteredIds.length : 0} / {allConcepts.length} ({isClient ? masteryPercentage : 0}%)
            </span>
          </div>
          <div className="w-full sm:w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-300 transition-all duration-500"
              style={{ width: `${isClient ? masteryPercentage : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main View Mode Selector & Global Controls */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Dual Mode Switcher */}
        <div className="flex items-center rounded-xl bg-slate-900/90 p-1 border border-white/[0.1] shadow-inner">
          <button
            onClick={() => setViewMode('deck')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all tactile-press ${
              viewMode === 'deck'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25 border border-sky-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Interactive Study Deck</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all tactile-press ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25 border border-sky-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Mastery Grid ({filteredConcepts.length})</span>
          </button>
        </div>

        {/* Global Filter & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search algorithm, formula, tag..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentDeckIndex(0);
              }}
              className="w-full rounded-xl bg-slate-900/80 border border-white/[0.1] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          {/* Mastery Filter Pill */}
          <div className="flex items-center rounded-xl bg-slate-900/80 p-0.5 border border-white/[0.1] text-xs">
            <button
              onClick={() => setMasteryFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                masteryFilter === 'all' ? 'bg-white/[0.1] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMasteryFilter('review')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                masteryFilter === 'review' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Needs Review
            </button>
            <button
              onClick={() => setMasteryFilter('mastered')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                masteryFilter === 'mastered' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mastered
            </button>
          </div>

          {/* Grid Flip All Button */}
          {viewMode === 'grid' && (
            <button
              onClick={() => setFlipAllGrid(!flipAllGrid)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/[0.1] text-xs font-semibold text-sky-300 hover:text-white transition-all tactile-press"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{flipAllGrid ? 'Show Math (Front)' : 'Show Mechanics (Back)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedSection('all');
            setCurrentDeckIndex(0);
          }}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all tactile-press ${
            selectedSection === 'all'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-sm shadow-sky-500/20'
              : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:border-white/[0.15] hover:text-slate-200'
          }`}
        >
          All 10 Pillars
        </button>

        {allSections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => {
              setSelectedSection(sec.id);
              setCurrentDeckIndex(0);
            }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all tactile-press ${
              selectedSection === sec.id
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 shadow-sm shadow-sky-500/20'
                : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:border-white/[0.15] hover:text-slate-200'
            }`}
          >
            {sec.shortTitle} ({sec.conceptCount})
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE STUDY DECK (FLASHCARD MODE) */}
      {/* ========================================================================= */}
      {viewMode === 'deck' && (
        <div className="mt-8">
          {filteredConcepts.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.1] bg-slate-900/50 p-12 text-center">
              <Search className="h-8 w-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">No algorithms match your active filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSection('all');
                  setSelectedLevel('all');
                  setMasteryFilter('all');
                }}
                className="mt-3 text-xs text-sky-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div>
              {/* Deck Navigation Strip */}
              <div className="max-w-3xl mx-auto flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                    Card {currentDeckIndex + 1} of {filteredConcepts.length}
                  </span>
                  <button
                    onClick={shuffleDeck}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-sky-300 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] tactile-press transition-colors"
                    title="Keyboard shortcut: 'R'"
                  >
                    <Shuffle className="h-3 w-3" />
                    <span>Shuffle</span>
                  </button>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>← / → Navigate</span>
                  <span>•</span>
                  <span>M: Mark Mastered</span>
                  <span>•</span>
                  <span>R: Shuffle</span>
                </div>

                {/* Prev / Next Navigation Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={prevCard}
                    className="flex items-center gap-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-slate-200 transition-all tactile-press"
                    title="Previous Card (← or K)"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>
                  <button
                    onClick={nextCard}
                    className="flex items-center gap-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-slate-200 transition-all tactile-press"
                    title="Next Card (→ or J)"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* The Active Battlecard */}
              {currentConcept && (
                <Battlecard
                  key={currentConcept.id}
                  concept={currentConcept}
                  deckMode={true}
                  isMastered={masteredIds.includes(currentConcept.id)}
                  onToggleMastered={() => toggleMastered(currentConcept.id)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MASTERY GRID (ALL 38 CARDS) */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="mt-8">
          {filteredConcepts.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.1] bg-slate-900/50 p-12 text-center">
              <Search className="h-8 w-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">No algorithms match your active filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSection('all');
                  setSelectedLevel('all');
                  setMasteryFilter('all');
                }}
                className="mt-3 text-xs text-sky-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcepts.map((concept) => (
                <Battlecard
                  key={concept.id}
                  concept={concept}
                  isFlipped={flipAllGrid ? true : undefined}
                  isMastered={masteredIds.includes(concept.id)}
                  onToggleMastered={() => toggleMastered(concept.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BattlecardsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Battlecards...</div>}>
      <BattlecardsContent />
    </Suspense>
  );
}
