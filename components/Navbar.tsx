'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, BookOpen, Compass, FileSpreadsheet, ArrowLeft, Sparkles } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const handleCurriculumClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('curriculum');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#060813]/80 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group tactile-press">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/25 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070914]">
                <Cpu className="h-5 w-5 text-sky-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  Pragmatic<span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">ML</span>
                </span>
                <span className="rounded-full bg-gradient-to-r from-sky-500/20 to-indigo-500/20 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-sky-300 border border-sky-500/30 shadow-sm shadow-sky-500/10">
                  Principal Manual
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-normal">
                The Anti-LLM Playbook for Right-Sized Machine Learning
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
          <a
            href="/#curriculum"
            onClick={handleCurriculumClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border tactile-press cursor-pointer transition-all ${
              pathname === '/'
                ? 'border-sky-500/40 bg-sky-500/15 text-sky-300 shadow-sm shadow-sky-500/20'
                : 'border-transparent text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-sky-400" />
            <span>Curriculum</span>
          </a>

          <Link
            href="/decision-catalogue"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border tactile-press transition-all ${
              pathname === '/decision-catalogue'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'border-transparent text-slate-300 hover:border-white/[0.1] hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-emerald-400" />
            <span>Decision Catalogue</span>
          </Link>

          <Link
            href="/cheatsheet"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all tactile-press ${
              pathname === '/cheatsheet'
                ? 'bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 shadow-indigo-500/40 border border-sky-400/40'
                : 'bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:brightness-110 shadow-indigo-500/25 border border-sky-500/30'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Cheat-Sheet</span>
          </Link>

          <a
            href="https://anandmuraleedharan.com"
            className="hidden lg:flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs border border-white/[0.08] px-3 py-1.5 rounded-xl bg-white/[0.03] tactile-press ml-1"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Portfolio</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
