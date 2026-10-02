'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowRight, Gauge, Layers } from 'lucide-react';

/* =========================================================================
   SIMULATOR 1: COSINE SIMILARITY VECTOR DIAL
   ========================================================================= */
export function CosineSimilaritySimulator() {
  const [angleDeg, setAngleDeg] = useState(25);

  const angleRad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(angleRad);
  const dotProduct = cosVal.toFixed(3);

  // SVG dimensions
  const cx = 150;
  const cy = 150;
  const r = 105;

  // Vector A fixed along positive X axis (0 deg)
  const ax = cx + r;
  const ay = cy;

  // Vector B rotated by angleDeg (in SVG Y is downward, so subtract sin for upward rotation)
  const bx = cx + r * Math.cos(angleRad);
  const by = cy - r * Math.sin(angleRad);

  // Semantic interpretation
  const getSemanticMeaning = () => {
    if (angleDeg < 15) return { label: 'Near Identical Meaning', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (angleDeg < 60) return { label: 'High Semantic Relevance', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
    if (angleDeg <= 90) return { label: 'Orthogonal (Uncorrelated)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Opposite / Contradictory Meaning', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const meaning = getSemanticMeaning();

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">Interactive Vector Space &amp; Cosine Angle</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Drag Slider to Rotate Vector B</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-5">
        {/* Interactive SVG Unit Circle */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full max-w-[260px] h-auto select-none">
            {/* Background grid circle */}
            <circle cx={cx} cy={cy} r={r} fill="#0d1527" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
            <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="#334155" strokeWidth="1.5" />
            <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="#334155" strokeWidth="1.5" />

            {/* Arc between Vector A and Vector B */}
            {angleDeg > 0 && (
              <path
                d={`M ${cx + 35} ${cy} A 35 35 0 0 0 ${cx + 35 * Math.cos(angleRad)} ${cy - 35 * Math.sin(angleRad)}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            )}
            <text x={cx + 42} y={cy - 12} fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
              &theta;={angleDeg}&deg;
            </text>

            {/* Vector A (Target Document) */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={ax} cy={ay} r="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <text x={ax + 8} y={ay + 4} fill="#38bdf8" fontSize="11" fontWeight="bold">
              Doc A
            </text>

            {/* Vector B (Search Query) */}
            <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx={bx} cy={by} r="6" fill="#7e22ce" stroke="#a855f7" strokeWidth="2" />
            <text x={bx + (bx >= cx ? 8 : -45)} y={by + (by >= cy ? 14 : -8)} fill="#c084fc" fontSize="11" fontWeight="bold">
              Query B
            </text>

            {/* Origin */}
            <circle cx={cx} cy={cy} r="4" fill="#64748b" />
          </svg>
        </div>

        {/* Live Calculation & Controls */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
              <span>Metric: cos(&theta;) = u &middot; v / (||u|| ||v||)</span>
              <span className="text-white font-bold text-sm">{dotProduct}</span>
            </div>
            
            {/* Visual similarity meter */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden mt-2 relative">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, ((parseFloat(dotProduct) + 1) / 2) * 100))}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-1.0 (Opposite)</span>
              <span>0.0 (Orthogonal)</span>
              <span>+1.0 (Identical)</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${meaning.bg}`}>
            <span className="text-slate-300">Semantic Interpretation:</span>
            <span className={`font-bold ${meaning.color}`}>{meaning.label}</span>
          </div>

          {/* Angle Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Angle Between Embeddings:</span>
              <span className="font-mono text-sky-400 font-bold">{angleDeg}&deg;</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={angleDeg}
              onChange={(e) => setAngleDeg(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setAngleDeg(0)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              0&deg; (Identical)
            </button>
            <button
              onClick={() => setAngleDeg(25)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              25&deg; (High Sim)
            </button>
            <button
              onClick={() => setAngleDeg(90)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              90&deg; (Orthogonal)
            </button>
            <button
              onClick={() => setAngleDeg(180)}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              180&deg; (Opposite)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SIMULATOR 2: K-MEANS CLUSTERING STEP-BY-STEP SIMULATOR
   ========================================================================= */
interface Point {
  x: number;
  y: number;
  cluster: number; // 0, 1, 2
}

const INITIAL_POINTS: Point[] = [
  // Cluster A (Top Left)
  { x: 50, y: 60, cluster: 0 }, { x: 70, y: 80, cluster: 0 }, { x: 90, y: 50, cluster: 0 },
  { x: 60, y: 100, cluster: 0 }, { x: 100, y: 90, cluster: 0 }, { x: 80, y: 70, cluster: 0 },
  // Cluster B (Top Right)
  { x: 230, y: 70, cluster: 1 }, { x: 250, y: 50, cluster: 1 }, { x: 270, y: 80, cluster: 1 },
  { x: 220, y: 90, cluster: 1 }, { x: 260, y: 100, cluster: 1 }, { x: 240, y: 60, cluster: 1 },
  // Cluster C (Bottom Center)
  { x: 140, y: 190, cluster: 2 }, { x: 160, y: 220, cluster: 2 }, { x: 180, y: 180, cluster: 2 },
  { x: 150, y: 210, cluster: 2 }, { x: 190, y: 200, cluster: 2 }, { x: 170, y: 230, cluster: 2 },
];

export function KMeansSimulator() {
  const [step, setStep] = useState(0); // 0: Init, 1: Assigned, 2: Shifted, 3: Converged
  const [centroids, setCentroids] = useState([
    { x: 110, y: 130, color: '#38bdf8' }, // Centroid 0
    { x: 190, y: 110, color: '#10b981' }, // Centroid 1
    { x: 150, y: 160, color: '#f59e0b' }, // Centroid 2
  ]);

  const stepDescriptions = [
    'Step 0: Initial random centroid placement (K=3). Centroids are scattered.',
    'Step 1: Assign each data point to its closest centroid using Euclidean distance ||x - &mu;||^2.',
    'Step 2: Recalculate each centroid &mu;_k as the mathematical mean of its assigned cluster points.',
    'Step 3: Convergence reached! Centroids stabilize (&Delta; < 0.001). Within-Cluster Sum of Squares (WCSS) minimized.',
  ];

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      // Shift centroids toward true cluster centers
      setCentroids([
        { x: 75, y: 75, color: '#38bdf8' },
        { x: 245, y: 75, color: '#10b981' },
        { x: 165, y: 205, color: '#f59e0b' },
      ]);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleReset = () => {
    setCentroids([
      { x: 110, y: 130, color: '#38bdf8' },
      { x: 190, y: 110, color: '#10b981' },
      { x: 150, y: 160, color: '#f59e0b' },
    ]);
    setStep(0);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">Interactive K-Means Expectation-Maximization Sandbox</h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
          {step === 3 ? '✓ Converged' : `Phase: ${step === 1 ? 'Expectation (E)' : step === 2 ? 'Maximization (M)' : 'Initialization'}`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-5">
        {/* Coordinate Scatter Plot */}
        <div className="md:col-span-7 flex justify-center">
          <svg viewBox="0 0 320 260" className="w-full max-w-[340px] h-auto bg-slate-950 rounded-xl border border-slate-800 p-2">
            {/* Grid lines */}
            <line x1="20" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="80" x2="300" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="140" x2="300" y2="140" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="200" x2="300" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

            {/* Data points */}
            {INITIAL_POINTS.map((pt, i) => {
              const ptColor = step === 0 ? '#94a3b8' : pt.cluster === 0 ? '#38bdf8' : pt.cluster === 1 ? '#10b981' : '#f59e0b';
              const assignedCentroid = centroids[pt.cluster];

              return (
                <g key={i}>
                  {/* Connection line during assignment step */}
                  {step >= 1 && (
                    <line
                      x1={pt.x}
                      y1={pt.y}
                      x2={assignedCentroid.x}
                      y2={assignedCentroid.y}
                      stroke={ptColor}
                      strokeWidth="0.8"
                      strokeOpacity="0.3"
                    />
                  )}
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill={ptColor} stroke="#0f172a" strokeWidth="1" />
                </g>
              );
            })}

            {/* Centroids */}
            {centroids.map((c, i) => (
              <g key={i} className="transition-all duration-500">
                <circle cx={c.x} cy={c.y} r="14" fill={c.color} fillOpacity="0.2" stroke={c.color} strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1={c.x - 7} y1={c.y} x2={c.x + 7} y2={c.y} stroke={c.color} strokeWidth="2.5" />
                <line x1={c.x} y1={c.y - 7} x2={c.x} y2={c.y + 7} stroke={c.color} strokeWidth="2.5" />
                <text x={c.x + 10} y={c.y - 8} fill={c.color} fontSize="10" fontWeight="bold">
                  &mu;_{i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Step-by-Step Explainer & Controls */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
              EM Algorithm State:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {stepDescriptions[step]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block text-[10px]">WCSS Inertia</span>
              <span className="text-sky-400 font-bold text-sm">
                {step === 0 ? '142.8' : step === 1 ? '98.4' : step === 2 ? '41.2' : '18.6'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60">
              <span className="text-slate-400 block text-[10px]">Iteration</span>
              <span className="text-emerald-400 font-bold text-sm">
                {step} / 3
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleNextStep}
              disabled={step === 3}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                step === 3
                  ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-400'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-sky-500/20'
              }`}
            >
              <Play className="h-3.5 w-3.5" />
              <span>{step === 0 ? 'Start Step 1 (Assign)' : step === 1 ? 'Step 2 (Re-center)' : step === 2 ? 'Step 3 (Converge)' : 'Converged!'}</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2 px-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SIMULATOR 3: BM25 VS GENERATIVE LLM LATENCY & COST RACE
   ========================================================================= */
export function LatencyRaceSimulator() {
  const [racing, setRacing] = useState(false);
  const [bm25Progress, setBm25Progress] = useState(0);
  const [llmProgress, setLlmProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [llmCost, setLlmCost] = useState(0);

  const startRace = () => {
    setRacing(true);
    setBm25Progress(0);
    setLlmProgress(0);
    setElapsedMs(0);
    setLlmCost(0);

    // BM25 finishes almost instantly (20ms virtual time)
    setTimeout(() => {
      setBm25Progress(100);
    }, 150);

    // LLM ticks for 2.5 seconds
    const interval = setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 50;
        setLlmProgress(Math.min(100, (next / 2400) * 100));
        setLlmCost((next / 2400) * 42.5);

        if (next >= 2400) {
          clearInterval(interval);
          setRacing(false);
        }
        return next;
      });
    }, 50);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">Production Benchmark: 1,000 Document Retrieval Queries</h3>
        </div>
        <button
          onClick={startRace}
          disabled={racing}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:brightness-110 disabled:opacity-50 transition-all shadow-md shadow-amber-500/20"
        >
          <Play className="h-3 w-3" />
          <span>{racing ? 'Running Benchmark...' : 'Fire 1,000 Queries'}</span>
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {/* Lane 1: BM25 */}
        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              <span>Target: BM25 Inverted Index (C++ / Rust Core)</span>
            </span>
            <span className="font-mono text-emerald-300">P99: 0.2ms • Cloud Cost: $0.00</span>
          </div>

          <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-emerald-900/40 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
              style={{ width: `${bm25Progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
            <span>Completed: {bm25Progress === 100 ? '1,000 / 1,000 (Done in 0.2ms)' : 'Waiting...'}</span>
            <span className="text-emerald-400 font-bold">100% Deterministic (Exact Postings)</span>
          </div>
        </div>

        {/* Lane 2: Generative LLM */}
        <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-rose-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Anti-Pattern: Generative LLM Reranker (Cloud API)</span>
            </span>
            <span className="font-mono text-rose-300">P99: 1,450ms • Accrued Cost: ${llmCost.toFixed(2)}</span>
          </div>

          <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-rose-900/40 relative">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-75"
              style={{ width: `${llmProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
            <span>Processed: {Math.round((llmProgress / 100) * 1000)} / 1,000</span>
            <span className="text-rose-400 font-bold">7,250x Slower • Rate Limit Exposure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SIMULATOR 4: HYBRID SEARCH RRF (RECIPROCAL RANK FUSION) BLENDER
   ========================================================================= */
export function HybridRRFSimulator() {
  const [alpha, setAlpha] = useState(0.5); // 0 = 100% BM25, 1 = 100% Vector

  const documents = [
    {
      id: 'doc-101',
      title: 'PostgreSQL connection pool leak in pgBouncer (Error 502)',
      bm25Rank: 1,
      denseRank: 4,
      desc: 'Contains exact error 502 and pgBouncer keywords.',
    },
    {
      id: 'doc-204',
      title: 'Database socket exhaustion and thread starvation',
      bm25Rank: 6,
      denseRank: 1,
      desc: 'High semantic match for connection leak, zero exact keyword match.',
    },
    {
      id: 'doc-308',
      title: 'Optimizing timeout thresholds in distributed microservices',
      bm25Rank: 3,
      denseRank: 2,
      desc: 'Balanced lexical and semantic relevance for distributed errors.',
    },
    {
      id: 'doc-412',
      title: 'HTTP 502 Bad Gateway NGINX reverse proxy guide',
      bm25Rank: 2,
      denseRank: 7,
      desc: 'Exact match for error code 502, wrong subsystem.',
    },
  ];

  // Calculate RRF score: score = alpha * (1 / (60 + denseRank)) + (1 - alpha) * (1 / (60 + bm25Rank))
  const rankedDocs = documents
    .map((doc) => {
      const denseWeight = alpha;
      const bm25Weight = 1 - alpha;
      const score = (denseWeight * (1 / (60 + doc.denseRank)) + bm25Weight * (1 / (60 + doc.bm25Rank))) * 1000;
      return { ...doc, score };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">Interactive Reciprocal Rank Fusion (RRF) Blender</h3>
        </div>
        <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
          Query: &ldquo;Postgres connection pool leak 502&rdquo;
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {/* Slider */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-emerald-400 font-mono">100% BM25 Lexical (&alpha; = 0.0)</span>
            <span className="text-purple-300 font-mono font-bold bg-slate-800 px-2 py-0.5 rounded">
              Current &alpha; = {alpha.toFixed(2)}
            </span>
            <span className="text-sky-400 font-mono">100% Dense Semantic (&alpha; = 1.0)</span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Slide left to favor exact keyword tokens (error codes, IDs); slide right to favor conceptual paraphrasing.
          </p>
        </div>

        {/* Dynamic Re-ranked List */}
        <div className="space-y-2">
          {rankedDocs.map((doc, idx) => (
            <div
              key={doc.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                idx === 0
                  ? 'border-emerald-500/50 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                  : 'border-slate-800/80 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    idx === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400">{doc.desc}</p>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono shrink-0">
                <div className="text-slate-400">
                  BM25: <span className="text-emerald-400 font-semibold">#{doc.bm25Rank}</span> | Dense:{' '}
                  <span className="text-sky-400 font-semibold">#{doc.denseRank}</span>
                </div>
                <div className="text-purple-300 font-bold mt-0.5">RRF Score: {doc.score.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
