'use client';

import React, { useEffect } from 'react';
import { Concept } from '../lib/curriculum/types';
import { Battlecard } from './Battlecard';
import { X, Sparkles } from 'lucide-react';

interface BattlecardModalProps {
  concept: Concept | null;
  isOpen: boolean;
  onClose: () => void;
  isMastered?: boolean;
  onToggleMastered?: () => void;
}

export function BattlecardModal({
  concept,
  isOpen,
  onClose,
  isMastered = false,
  onToggleMastered,
}: BattlecardModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Top Controls Strip */}
        <div className="flex items-center justify-between pb-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-mono">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              Quick Algorithm Battlecard
            </span>
            <span className="text-slate-500">• 30-Second Mastery</span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] px-2.5 py-1 text-slate-300 hover:text-white border border-white/[0.1] transition-all tactile-press"
          >
            <X className="h-3.5 w-3.5" />
            <span className="text-[11px] font-mono">ESC to close</span>
          </button>
        </div>

        {/* Battlecard */}
        <Battlecard
          concept={concept}
          deckMode={true}
          isMastered={isMastered}
          onToggleMastered={onToggleMastered}
        />
      </div>
    </div>
  );
}
