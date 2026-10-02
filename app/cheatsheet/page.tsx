'use client';

import React from 'react';
import Link from 'next/link';
import { KaTeXFormula } from '../../components/KaTeXFormula';
import { Printer, ArrowLeft, Cpu, CheckCircle2 } from 'lucide-react';

export default function CheatsheetPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 print:p-0 print:max-w-full">
      {/* Top Header Controls (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] print:hidden">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <Link href="/" className="hover:text-sky-400 transition-colors flex items-center gap-1 tactile-press">
              <ArrowLeft className="h-3 w-3" />
              <span>PragmaticML Hub</span>
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Executive Cheat-Sheet</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Principal ML Engineer <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent font-extrabold">Architectural Cheat-Sheet</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Condensed mathematical formulas, Big-O complexities, and anti-LLM model selection rules.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:brightness-110 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all tactile-press cursor-pointer border border-sky-400/30"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet Container */}
      <div className="mt-6 space-y-8 print:mt-0 print:space-y-4 print:text-black">
        {/* Printable Title Block (Visible on Print) */}
        <div className="hidden print:block border-b-2 border-black pb-2 mb-4">
          <h1 className="text-2xl font-bold">PragmaticML — Principal ML Architectural Cheat-Sheet</h1>
          <p className="text-xs text-gray-700">Anand Muraleedharan • anandmuraleedharan.com • Right-Sized ML Reference</p>
        </div>

        {/* 1. Distance & Metric Formulations */}
        <section className="rounded-2xl doppelrand-card p-6 border border-sky-500/20 print:border-black print:bg-white print:p-2">
          <h2 className="text-xs font-bold text-sky-400 uppercase font-mono tracking-wider mb-4 print:text-black print:border-b print:pb-1">
            1. Mathematical Metric &amp; Distance Formulations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {/* Cosine */}
            <div className="rounded-xl border border-sky-500/30 bg-[#0c101d] p-3.5 shadow-sm shadow-sky-500/5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-sky-300 block mb-1 print:text-black">Cosine Similarity</span>
              <div className="py-1">
                <KaTeXFormula math="\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}" block />
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Length-invariant vector orientation. Optimal for dense embeddings.</p>
            </div>

            {/* Euclidean & Manhattan */}
            <div className="rounded-xl border border-emerald-500/30 bg-[#0c101d] p-3.5 shadow-sm shadow-emerald-500/5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-emerald-300 block mb-1 print:text-black">Euclidean (L2) &amp; Manhattan (L1)</span>
              <div className="py-1">
                <KaTeXFormula math="L_2 = \sqrt{\sum (x_i - y_i)^2}, \quad L_1 = \sum |x_i - y_i|" block />
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">L1 is robust to outliers; L2 penalizes large deviations quadratically.</p>
            </div>

            {/* Mahalanobis */}
            <div className="rounded-xl border border-purple-500/30 bg-[#0c101d] p-3.5 shadow-sm shadow-purple-500/5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-purple-300 block mb-1 print:text-black">Mahalanobis Distance</span>
              <div className="py-1">
                <KaTeXFormula math="D_M = \sqrt{(\mathbf{x} - \boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu})}" block />
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Covariance-adjusted. Invariant to scale and feature correlations.</p>
            </div>

            {/* Jaccard & Hamming */}
            <div className="rounded-xl border border-amber-500/30 bg-[#0c101d] p-3.5 shadow-sm shadow-amber-500/5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-amber-300 block mb-1 print:text-black">Jaccard Index</span>
              <div className="py-1">
                <KaTeXFormula math="J(A, B) = \frac{|A \cap B|}{|A \cup B|}" block />
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Set overlap ratio. Foundation of MinHash Locality-Sensitive Hashing.</p>
            </div>

            {/* Okapi BM25 */}
            <div className="rounded-xl border border-teal-500/30 bg-[#0c101d] p-3.5 shadow-sm shadow-teal-500/5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-teal-300 block mb-1 print:text-black">Okapi BM25 Relevance</span>
              <div className="py-1">
                <KaTeXFormula math="\text{IDF} \cdot \frac{f(q, D) \cdot (k_1 + 1)}{f(q, D) + k_1(1 - b + b\frac{|D|}{\text{avgdl}})}" block />
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Sub-linear term frequency saturation with document length penalty.</p>
            </div>

            {/* PageRank */}
            <div className="rounded-xl border border-rose-500/30 bg-[#0c101d] p-3.5 shadow-sm shadow-rose-500/5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-rose-300 block mb-1 print:text-black">PageRank Stationary Vector</span>
              <div className="py-1">
                <KaTeXFormula math="\mathbf{PR}(u) = \frac{1-d}{|V|} + d \sum_{v \in \mathcal{N}_{in}} \frac{\mathbf{PR}(v)}{L(v)}" block />
              </div>
              <p className="text-[10px] text-slate-400 print:text-gray-600">Stationary Markov chain distribution with damping d=0.85.</p>
            </div>
          </div>
        </section>

        {/* 2. Model Selection Matrix */}
        <section className="rounded-2xl doppelrand-card p-6 print:border-black print:bg-white print:p-2">
          <h2 className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider mb-4 print:text-black print:border-b print:pb-1">
            2. The Right-Size Model Selection Matrix
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs print:text-[10px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 print:border-black print:text-black font-mono uppercase text-[11px]">
                  <th className="pb-3 pr-3">Engineering Task</th>
                  <th className="pb-3 px-3">Right-Sized Algorithm</th>
                  <th className="pb-3 px-3">Why Not An LLM?</th>
                  <th className="pb-3 pl-3">Inference SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] print:divide-gray-300 text-slate-300 print:text-black font-mono text-[11px]">
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">Named Entity Extraction (NER)</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">GLiNER (DeBERTa Spans)</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Hallucinates keys; fails character offsets</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">15ms (CPU)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">Exact SKU / Codebase Search</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">Okapi BM25 Inverted Index</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Lost in the middle; token subword blur</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">0.8ms (CPU)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">RAG Top-50 Re-Ranking</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">Cross-Encoder (MiniLM / BGE)</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Position bias; costs $0.05 per prompt</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">20ms (ONNX)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">Real-Time CTR / Loan Risk</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">Logistic Regression / LightGBM</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Violates 10ms SLA; uncalibrated outputs</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">0.05ms (C++)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">Graph Routing / Shortest Path</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">Dijkstra / A* Search</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Hallucinates edges; non-optimal hops</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">0.4ms (Heap)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">Streaming Sentiment (50k/sec)</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">VADER Rule Engine</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Costs $10k/day; network jitter</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">0.02ms (RAM)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-3 font-sans font-medium text-white print:text-black">10M Catalog Recommendations</td>
                  <td className="py-3 px-3 text-emerald-400 print:text-black font-bold">Two-Tower Encoders + HNSW</td>
                  <td className="py-3 px-3 text-red-400/90 print:text-gray-700">Cannot evaluate 10M dot products</td>
                  <td className="py-3 pl-3 text-sky-400 print:text-black tabular-nums">2ms (MIPS)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Big-O Complexity & Memory Reference */}
        <section className="rounded-2xl doppelrand-card p-6 print:border-black print:bg-white print:p-2">
          <h2 className="text-xs font-bold text-sky-400 uppercase font-mono tracking-wider mb-4 print:text-black print:border-b print:pb-1">
            3. Algorithmic Time &amp; Space Complexity Reference
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs print:text-[10px]">
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">Dijkstra (Heap)</span>
              <span className="text-emerald-400 font-mono block print:text-black tabular-nums">Time: O((V+E) log V)</span>
              <span className="text-slate-400 font-mono block print:text-gray-600 tabular-nums">Space: O(V)</span>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">HNSW Vector Search</span>
              <span className="text-emerald-400 font-mono block print:text-black tabular-nums">Time: O(log N)</span>
              <span className="text-slate-400 font-mono block print:text-gray-600 tabular-nums">Space: O(N · M) in RAM</span>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">Self-Attention</span>
              <span className="text-emerald-400 font-mono block print:text-black tabular-nums">Time: O(N² · d)</span>
              <span className="text-slate-400 font-mono block print:text-gray-600 tabular-nums">Space: O(N²) KV Cache</span>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">Levenshtein DP</span>
              <span className="text-emerald-400 font-mono block print:text-black tabular-nums">Time: O(M · N)</span>
              <span className="text-slate-400 font-mono block print:text-gray-600 tabular-nums">Space: O(min(M, N))</span>
            </div>
          </div>
        </section>

        {/* 4. Loss Functions & Calibration */}
        <section className="rounded-2xl doppelrand-card p-6 print:border-black print:bg-white print:p-2">
          <h2 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider mb-4 print:text-black print:border-b print:pb-1">
            4. Optimization Loss Objectives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs print:text-[10px]">
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3.5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">Binary Cross-Entropy</span>
              <KaTeXFormula math="\mathcal{L} = -[y \ln(\hat{y}) + (1-y)\ln(1-\hat{y})]" block />
              <p className="text-[10px] text-slate-400 print:text-gray-600">Proper scoring rule. Outputs are calibrated probabilities.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3.5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">Focal Loss (Class Skew)</span>
              <KaTeXFormula math="\text{FL}(p_t) = -\alpha (1 - p_t)^\gamma \ln(p_t)" block />
              <p className="text-[10px] text-slate-400 print:text-gray-600">Down-weights easy negatives. Requires post-hoc Platt scaling.</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0c1017] p-3.5 print:border-gray-300 print:bg-white">
              <span className="font-bold text-white block mb-1 print:text-black">Reciprocal Rank Fusion</span>
              <KaTeXFormula math="\text{RRF}(d) = \sum \frac{1}{60 + r_m(d)}" block />
              <p className="text-[10px] text-slate-400 print:text-gray-600">Scale-invariant rank merger for Hybrid Search.</p>
            </div>
          </div>
        </section>

        {/* 5. Principal Rules of Thumb */}
        <div className="rounded-2xl border-l-2 border-sky-400 bg-sky-950/20 p-5 text-xs print:border-black print:bg-white print:text-[9px]">
          <span className="font-bold text-sky-400 uppercase font-mono tracking-wider block mb-1.5 print:text-black">
            Principal ML Architectural Rules of Thumb:
          </span>
          <p className="text-slate-300 print:text-black leading-relaxed">
            1. Never use an autoregressive LLM when a bidirectional encoder (BERT / GLiNER) suffices. • 
            2. For tabular data, GBDTs (XGBoost/LightGBM) outperform deep neural nets in 95% of production benchmarks. • 
            3. Always pair dense vector search with sparse BM25 to prevent catastrophic recall failure on exact part numbers and error codes. • 
            4. Quantize linear layers to INT8 via PTQ before provisioning expensive GPU cloud instances.
          </p>
        </div>
      </div>
    </div>
  );
}
