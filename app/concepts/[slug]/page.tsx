import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllConcepts, getConceptBySlug } from '../../../lib/curriculum/registry';
import { ConceptCarousel } from '../../../components/ConceptCarousel';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface ConceptPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const concepts = getAllConcepts();
  return concepts.map((c) => ({
    slug: c.id,
  }));
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  // Find previous and next concepts for bottom pagination
  const allConcepts = getAllConcepts();
  const currentIndex = allConcepts.findIndex((c) => c.id === slug);
  const prevConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null;
  const nextConcept =
    currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Breadcrumb Nav */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/#curriculum" className="hover:text-sky-400 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Curriculum Hub</span>
        </Link>
        <span>/</span>
        <span className="text-slate-500">{concept.sectionTitle}</span>
        <span>/</span>
        <span className="text-white font-medium">{concept.title}</span>
      </nav>

      {/* Header Info */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="rounded-md bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
            {concept.sectionTitle}
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
            Level: {concept.level}
          </span>
          <Link
            href={`/battlecards?concept=${concept.id}`}
            className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-all tactile-press ml-auto"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Study Battlecard</span>
          </Link>
        </div>


        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          {concept.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
          {concept.subtitle}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {concept.tags.map((t) => (
            <span
              key={t}
              className="rounded bg-slate-900 border border-slate-800/80 px-2 py-0.5 text-[11px] text-slate-400"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile-Friendly Carousel Presentation per Section */}
      <ConceptCarousel concept={concept} />

      {/* Bottom Global Pagination (Prev Concept / Next Concept) */}
      <div className="mt-14 border-t border-slate-800/80 pt-6 flex items-center justify-between">
        {prevConcept ? (
          <Link
            href={`/concepts/${prevConcept.id}`}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Previous Concept</span>
              <span className="font-semibold text-slate-200">{prevConcept.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextConcept && (
          <Link
            href={`/concepts/${nextConcept.id}`}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors text-right"
          >
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-mono">Next Concept</span>
              <span className="font-semibold text-slate-200">{nextConcept.title}</span>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
