'use client';

import React from 'react';

interface ConceptDiagramProps {
  conceptId: string;
  caption?: string;
}

export function ConceptDiagram({ conceptId, caption }: ConceptDiagramProps) {
  // Render high-fidelity, responsive SVG architectural diagrams tailored for each concept family
  const renderDiagramContent = () => {
    switch (conceptId) {
      /* =========================================================================
         1. GLiNER / Zero-Shot NER
         ========================================================================= */
      case 'gliner-ner':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            <g transform="translate(40, 40)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="600" letterSpacing="0.05em">1. RAW INPUT TEXT TOKENS</text>
              <rect x="0" y="15" width="80" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="40" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Apple</text>
              <rect x="90" y="15" width="60" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="120" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">CEO</text>
              <rect x="160" y="15" width="80" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="200" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Tim Cook</text>
              <rect x="250" y="15" width="40" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="270" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">in</text>
              <rect x="300" y="15" width="90" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="345" y="38" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Cupertino</text>
            </g>
            <g transform="translate(450, 40)">
              <text x="0" y="0" fill="#a78bfa" fontSize="11" fontWeight="600" letterSpacing="0.05em">2. ARBITRARY RUNTIME LABELS</text>
              <rect x="0" y="15" width="90" height="36" rx="8" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="45" y="38" fill="#ddd6fe" fontSize="11" fontWeight="600" textAnchor="middle">#company</text>
              <rect x="100" y="15" width="85" height="36" rx="8" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="142" y="38" fill="#ddd6fe" fontSize="11" fontWeight="600" textAnchor="middle">#executive</text>
              <rect x="195" y="15" width="80" height="36" rx="8" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="235" y="38" fill="#ddd6fe" fontSize="11" fontWeight="600" textAnchor="middle">#location</text>
            </g>
            <g transform="translate(40, 120)">
              <rect x="0" y="0" width="720" height="60" rx="12" fill="#0f172a" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
              <text x="360" y="35" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">Bidirectional Transformer Encoder (DeBERTa-v3 Backbone)</text>
              <text x="360" y="50" fill="#64748b" fontSize="10" textAnchor="middle">Joint contextual token hidden states H &amp; Label vectors E in shared metric space</text>
            </g>
            <g transform="translate(40, 215)">
              <rect x="0" y="0" width="340" height="85" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="24" fill="#38bdf8" fontSize="11" fontWeight="bold">Span Representation Generator</text>
              <text x="15" y="44" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Span(i, j) = [ h_start ; h_end ; h_start ⊙ h_end ]</text>
              <text x="15" y="65" fill="#64748b" fontSize="9">Evaluates bounded candidate token spans (K ≤ 12 tokens) in O(K · L)</text>
            </g>
            <g transform="translate(420, 215)">
              <rect x="0" y="0" width="340" height="85" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="15" y="24" fill="#34d399" fontSize="11" fontWeight="bold">Exact Dot-Product &amp; Sigmoid Output</text>
              <text x="15" y="44" fill="#ecfdf5" fontSize="10" fontFamily="monospace">&quot;Apple&quot; → #company (0.99) [0:5]</text>
              <text x="15" y="62" fill="#ecfdf5" fontSize="10" fontFamily="monospace">&quot;Tim Cook&quot; → #executive (0.98) [10:18]</text>
              <text x="15" y="78" fill="#a7f3d0" fontSize="9">Deterministic character spans • 15ms latency • Zero JSON hallucinations</text>
            </g>
            <path d="M 200 76 L 200 120" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 600 76 L 600 120" stroke="#8b5cf6" strokeWidth="2" />
            <path d="M 210 180 L 210 215" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 380 257 L 420 257" stroke="#10b981" strokeWidth="2" />
          </svg>
        );

      /* =========================================================================
         2. PAGERANK
         ========================================================================= */
      case 'pagerank':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            <g transform="translate(180, 80)">
              <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              <text x="50" y="46" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">Node A</text>
              <text x="50" y="64" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">PR: 0.384</text>
            </g>
            <g transform="translate(480, 80)">
              <circle cx="50" cy="50" r="38" fill="#1e293b" stroke="#818cf8" strokeWidth="3" />
              <text x="50" y="46" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">Node B</text>
              <text x="50" y="64" fill="#818cf8" fontSize="11" fontFamily="monospace" textAnchor="middle">PR: 0.342</text>
            </g>
            <g transform="translate(330, 220)">
              <circle cx="50" cy="50" r="35" fill="#1e293b" stroke="#34d399" strokeWidth="2.5" />
              <text x="50" y="46" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">Node C</text>
              <text x="50" y="64" fill="#34d399" fontSize="11" fontFamily="monospace" textAnchor="middle">PR: 0.174</text>
            </g>
            <g transform="translate(60, 220)">
              <circle cx="45" cy="45" r="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="45" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Node D</text>
              <text x="45" y="58" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">PR: 0.100</text>
            </g>
            <path d="M 272 120 L 480 120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <text x="375" y="112" fill="#94a3b8" fontSize="10" textAnchor="middle">d · PR(A) / 2</text>
            <path d="M 255 155 L 340 230" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 490 155 L 415 230" stroke="#818cf8" strokeWidth="2" />
            <path d="M 330 250 L 150 250" stroke="#34d399" strokeWidth="2" />
            <path d="M 125 220 L 200 160" stroke="#f59e0b" strokeWidth="2" />
            <g transform="translate(480, 240)">
              <rect x="0" y="0" width="280" height="75" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="15" y="24" fill="#fbbf24" fontSize="11" fontWeight="bold">Damping Factor d = 0.85</text>
              <text x="15" y="44" fill="#e2e8f0" fontSize="10" fontFamily="monospace">(1 - d) / |V| = 0.0375</text>
              <text x="15" y="62" fill="#94a3b8" fontSize="9">Uniform restart prevents rank sink traps</text>
            </g>
          </svg>
        );

      /* =========================================================================
         3. DIJKSTRA & SHORTEST PATHS
         ========================================================================= */
      case 'dijkstra':
      case 'a-star':
      case 'bellman-ford':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            <g transform="translate(80, 130)">
              <circle cx="45" cy="45" r="40" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <text x="45" y="42" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Source S</text>
              <text x="45" y="60" fill="#bae6fd" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 0</text>
            </g>
            <g transform="translate(280, 50)">
              <circle cx="40" cy="40" r="35" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="40" y="37" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Node A</text>
              <text x="40" y="53" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 3</text>
            </g>
            <g transform="translate(280, 210)">
              <circle cx="40" cy="40" r="35" fill="#065f46" stroke="#34d399" strokeWidth="3" />
              <text x="40" y="37" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Node B</text>
              <text x="40" y="53" fill="#a7f3d0" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 2</text>
            </g>
            <g transform="translate(480, 130)">
              <circle cx="45" cy="45" r="40" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="45" y="42" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Target T</text>
              <text x="45" y="60" fill="#fcd34d" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 7</text>
            </g>
            <path d="M 160 155 L 280 90" stroke="#64748b" strokeWidth="1.5" />
            <text x="205" y="115" fill="#94a3b8" fontSize="11" fontWeight="bold">w=4</text>
            <path d="M 160 185 L 280 235" stroke="#34d399" strokeWidth="3" />
            <text x="205" y="225" fill="#34d399" fontSize="11" fontWeight="bold">w=2 (Relaxed!)</text>
            <path d="M 320 210 L 320 120" stroke="#34d399" strokeWidth="2.5" />
            <text x="335" y="170" fill="#34d399" fontSize="11" fontWeight="bold">w=1</text>
            <path d="M 350 90 L 480 155" stroke="#64748b" strokeWidth="1.5" />
            <text x="420" y="115" fill="#94a3b8" fontSize="11" fontWeight="bold">w=5</text>
            <path d="M 350 240 L 480 190" stroke="#34d399" strokeWidth="3" />
            <text x="420" y="230" fill="#34d399" fontSize="11" fontWeight="bold">w=5</text>
            <g transform="translate(580, 60)">
              <rect x="0" y="0" width="180" height="240" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="26" fill="#38bdf8" fontSize="11" fontWeight="bold">MIN-HEAP PRIORITY QUEUE</text>
              <rect x="12" y="42" width="156" height="34" rx="6" fill="#065f46" />
              <text x="22" y="63" fill="#ecfdf5" fontSize="10" fontFamily="monospace">POP: (dist=2, Node B)</text>
              <rect x="12" y="86" width="156" height="34" rx="6" fill="#1e293b" />
              <text x="22" y="107" fill="#cbd5e1" fontSize="10" fontFamily="monospace">HEAP: (dist=3, Node A)</text>
              <rect x="12" y="130" width="156" height="34" rx="6" fill="#1e293b" />
              <text x="22" y="151" fill="#cbd5e1" fontSize="10" fontFamily="monospace">HEAP: (dist=7, Node T)</text>
              <text x="15" y="195" fill="#64748b" fontSize="9">O((V + E) log V) via binary heap</text>
              <text x="15" y="215" fill="#10b981" fontSize="9" fontWeight="bold">✓ Guaranteed Optimal Path</text>
            </g>
          </svg>
        );

      /* =========================================================================
         4. BM25 & INVERTED INDEX SEARCH
         ========================================================================= */
      case 'bm25':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            <g transform="translate(40, 40)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">1. SEARCH QUERY</text>
              <rect x="0" y="15" width="220" height="42" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="15" y="41" fill="#f8fafc" fontSize="12" fontFamily="monospace">&quot;Docker error 502&quot;</text>
            </g>
            <g transform="translate(300, 40)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">2. INVERTED INDEX POSTINGS (0.2ms)</text>
              <rect x="0" y="15" width="460" height="42" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="41" fill="#38bdf8" fontSize="11" fontFamily="monospace">term(&quot;502&quot;) → [Doc #12 (tf=4), Doc #88 (tf=1), Doc #904 (tf=12)]</text>
            </g>
            <g transform="translate(40, 130)">
              <rect x="0" y="0" width="340" height="190" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="20" y="28" fill="#f8fafc" fontSize="12" fontWeight="bold">Term Saturation Curve (k_1 = 1.5)</text>
              <line x1="40" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="1.5" />
              <line x1="40" y1="150" x2="40" y2="50" stroke="#475569" strokeWidth="1.5" />
              <path d="M 40 150 Q 150 90 290 55" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
              <text x="200" y="70" fill="#f43f5e" fontSize="9">Linear TF-IDF (Spam vulnerable)</text>
              <path d="M 40 150 Q 90 85 290 85" stroke="#10b981" strokeWidth="2.5" />
              <text x="160" y="105" fill="#10b981" fontSize="10" fontWeight="bold">BM25 Saturates at (k1 + 1)</text>
              <text x="140" y="170" fill="#64748b" fontSize="9">Term Frequency Count in Document →</text>
            </g>
            <g transform="translate(410, 130)">
              <rect x="0" y="0" width="350" height="190" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="20" y="28" fill="#f8fafc" fontSize="12" fontWeight="bold">Length Normalization (b = 0.75)</text>
              <rect x="20" y="45" width="310" height="40" rx="6" fill="#1e293b" />
              <text x="30" y="69" fill="#38bdf8" fontSize="10" fontFamily="monospace">Concise Doc (50 words): Score Boosted (+35%)</text>
              <rect x="20" y="95" width="310" height="40" rx="6" fill="#1e293b" />
              <text x="30" y="119" fill="#f43f5e" fontSize="10" fontFamily="monospace">Bloated Doc (5,000 words): Penalized (-60%)</text>
              <text x="20" y="160" fill="#cbd5e1" fontSize="10">Formula: (1 - b + b · |D| / avgdl) penalizes keyword stuffing</text>
            </g>
          </svg>
        );

      /* =========================================================================
         5. DECISION TREES & GBDT / XGBOOST
         ========================================================================= */
      case 'decision-trees':
      case 'random-forests':
      case 'xgboost-gbdt':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            {/* Left Panel: 2D Orthogonal Partition Map */}
            <g transform="translate(40, 40)">
              <text x="0" y="0" fill="#38bdf8" fontSize="12" fontWeight="bold">1. ORTHOGONAL FEATURE SPACE SPLITS</text>
              <rect x="0" y="15" width="280" height="240" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              {/* Partition regions */}
              <rect x="15" y="30" width="120" height="210" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="75" y="130" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Region R1 (Class A)</text>
              <line x1="135" y1="30" x2="135" y2="240" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
              <text x="140" y="50" fill="#94a3b8" fontSize="9">Split: X1 &gt; 3.5</text>
              <rect x="135" y="30" width="130" height="100" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="1.5" />
              <text x="200" y="85" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">Region R2 (Class B)</text>
              <line x1="135" y1="130" x2="265" y2="130" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />
              <text x="205" y="145" fill="#94a3b8" fontSize="9">Split: X2 &lt; 1.2</text>
              <rect x="135" y="130" width="130" height="110" fill="#f59e0b" fillOpacity="0.2" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="200" y="190" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">Region R3 (Class C)</text>
              <text x="15" y="275" fill="#64748b" fontSize="10">Non-linear boundaries without expensive matrix inverses</text>
            </g>

            {/* Right Panel: Gradient Boosting Residual Cascade */}
            <g transform="translate(360, 40)">
              <text x="0" y="0" fill="#a78bfa" fontSize="12" fontWeight="bold">2. GRADIENT BOOSTING RESIDUAL CASCADE</text>
              <g transform="translate(0, 20)">
                <rect x="0" y="0" width="115" height="70" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="12" y="24" fill="#38bdf8" fontSize="11" fontWeight="bold">Tree 0 (Base)</text>
                <text x="12" y="44" fill="#cbd5e1" fontSize="9" fontFamily="monospace">y_0 = mean(y)</text>
                <text x="12" y="60" fill="#94a3b8" fontSize="9">Residual: r_0 = y - y_0</text>
              </g>
              <text x="130" y="58" fill="#a78bfa" fontSize="16" fontWeight="bold">+</text>
              <g transform="translate(150, 20)">
                <rect x="0" y="0" width="115" height="70" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="1.5" />
                <text x="12" y="24" fill="#818cf8" fontSize="11" fontWeight="bold">Tree 1 (&eta; · h_1)</text>
                <text x="12" y="44" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Fits pseudo-res r_0</text>
                <text x="12" y="60" fill="#94a3b8" fontSize="9">Shrinkage &eta; = 0.05</text>
              </g>
              <text x="280" y="58" fill="#a78bfa" fontSize="16" fontWeight="bold">+</text>
              <g transform="translate(300, 20)">
                <rect x="0" y="0" width="115" height="70" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <text x="12" y="24" fill="#34d399" fontSize="11" fontWeight="bold">Tree M (&eta; · h_M)</text>
                <text x="12" y="44" fill="#ecfdf5" fontSize="9" fontFamily="monospace">Final Output y_hat</text>
                <text x="12" y="60" fill="#a7f3d0" fontSize="9">Zero Residuals</text>
              </g>

              {/* Bottom Feature Importance Card */}
              <g transform="translate(0, 115)">
                <rect x="0" y="0" width="415" height="120" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="20" y="25" fill="#f8fafc" fontSize="11" fontWeight="bold">PRODUCTION SUPERIORITY OVER LLM ON TABULAR DATA</text>
                <text x="20" y="48" fill="#34d399" fontSize="10">✓ Exact numerical splits (no token rounding errors)</text>
                <text x="20" y="68" fill="#38bdf8" fontSize="10">✓ Native missing value branch routing (no imputation hallucination)</text>
                <text x="20" y="88" fill="#a78bfa" fontSize="10">✓ 2ms latency on 10,000 tabular rows vs $80 LLM API cost</text>
              </g>
            </g>
          </svg>
        );

      /* =========================================================================
         6. TWO-TOWER & MATRIX FACTORIZATION RECOMMENDERS
         ========================================================================= */
      case 'two-tower-recommenders':
      case 'matrix-factorization':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            {/* User / Query Tower (Left) */}
            <g transform="translate(40, 50)">
              <text x="0" y="0" fill="#38bdf8" fontSize="11" fontWeight="bold">QUERY TOWER (Real-Time)</text>
              <rect x="0" y="15" width="200" height="50" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="15" y="38" fill="#f8fafc" fontSize="10" fontFamily="monospace">User Context &amp; History</text>
              <text x="15" y="52" fill="#94a3b8" fontSize="9">Age, Country, Recent 10 Clicks</text>
              <path d="M 100 65 L 100 110" stroke="#38bdf8" strokeWidth="2" />
              <rect x="0" y="110" width="200" height="55" rx="8" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
              <text x="100" y="135" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Query MLP (128-d)</text>
              <text x="100" y="150" fill="#64748b" fontSize="9" textAnchor="middle">u = f_&theta;(UserContext) ∈ ℝ^128</text>
            </g>

            {/* Candidate / Item Tower (Right - Offline Precomputed) */}
            <g transform="translate(560, 50)">
              <text x="0" y="0" fill="#a78bfa" fontSize="11" fontWeight="bold">CANDIDATE TOWER (Offline Cached)</text>
              <rect x="0" y="15" width="200" height="50" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="1.5" />
              <text x="15" y="38" fill="#f8fafc" fontSize="10" fontFamily="monospace">Catalog Items (10M SKUs)</text>
              <text x="15" y="52" fill="#94a3b8" fontSize="9">Title, Category, Price, Vendor</text>
              <path d="M 100 65 L 100 110" stroke="#818cf8" strokeWidth="2" />
              <rect x="0" y="110" width="200" height="55" rx="8" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
              <text x="100" y="135" fill="#a78bfa" fontSize="11" fontWeight="bold" textAnchor="middle">Item MLP (128-d)</text>
              <text x="100" y="150" fill="#64748b" fontSize="9" textAnchor="middle">v = g_&phi;(ItemFeatures) ∈ ℝ^128</text>
            </g>

            {/* Central MIPS Dot Product & ANN Vector Space */}
            <g transform="translate(280, 80)">
              <rect x="0" y="0" width="240" height="130" rx="12" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
              <text x="120" y="30" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">MIPS / SCANN SEARCH</text>
              <text x="120" y="55" fill="#ecfdf5" fontSize="11" fontFamily="monospace" textAnchor="middle">Score = &lang;u, v&rang; = u &middot; v</text>
              <rect x="20" y="70" width="200" height="42" rx="6" fill="#065f46" />
              <text x="120" y="88" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Top-K Candidates in 2.8ms</text>
              <text x="120" y="102" fill="#a7f3d0" fontSize="8" textAnchor="middle">Retrieved from 10,000,000 items</text>
            </g>

            <path d="M 240 137 L 280 137" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M 560 137 L 520 137" stroke="#818cf8" strokeWidth="2.5" />

            {/* Bottom Architecture Specs */}
            <g transform="translate(40, 240)">
              <rect x="0" y="0" width="720" height="85" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="25" y="28" fill="#38bdf8" fontSize="11" fontWeight="bold">WHY DUAL TOWERS CRUSH GENERATIVE LLMS IN RETRIEVAL</text>
              <text x="25" y="50" fill="#cbd5e1" fontSize="10">
                • Decoupled Invariant: Item embeddings are precomputed once offline, not regenerated per request.
              </text>
              <text x="25" y="70" fill="#cbd5e1" fontSize="10">
                • Sub-5ms P99 SLA: Dot-product SIMD instructions filter millions of candidates before any reranker touches the list.
              </text>
            </g>
          </svg>
        );

      /* =========================================================================
         7. ENCODER VS DECODER ATTENTION MASKS
         ========================================================================= */
      case 'encoder-vs-decoder':
      case 'transformers-attention':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            {/* Bidirectional Encoder Mask (Left) */}
            <g transform="translate(60, 40)">
              <text x="0" y="0" fill="#38bdf8" fontSize="12" fontWeight="bold">1. BIDIRECTIONAL ENCODER (BERT/DeBERTa)</text>
              <text x="0" y="16" fill="#94a3b8" fontSize="9">Full token context: Every token attends to all tokens</text>
              {/* 4x4 Grid - All 1s */}
              <g transform="translate(0, 30)">
                <rect x="0" y="0" width="180" height="180" rx="8" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="2" />
                <line x1="45" y1="0" x2="45" y2="180" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="90" y1="0" x2="90" y2="180" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="135" y1="0" x2="135" y2="180" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="0" y1="45" x2="180" y2="45" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="0" y1="90" x2="180" y2="90" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="0" y1="135" x2="180" y2="135" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
                <text x="90" y="95" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">All-to-All (1.0)</text>
              </g>
              <text x="0" y="235" fill="#34d399" fontSize="10" fontWeight="bold">✓ Ideal for NER, Embeddings, Classification</text>
              <text x="0" y="250" fill="#64748b" fontSize="9">Zero autoregressive token-by-token latency penalty</text>
            </g>

            {/* Causal Decoder Mask (Right) */}
            <g transform="translate(460, 40)">
              <text x="0" y="0" fill="#f43f5e" fontSize="12" fontWeight="bold">2. CAUSAL DECODER (GPT / Llama)</text>
              <text x="0" y="16" fill="#94a3b8" fontSize="9">Autoregressive: Tokens can only attend to past tokens</text>
              {/* 4x4 Grid - Lower Triangular */}
              <g transform="translate(0, 30)">
                <rect x="0" y="0" width="180" height="180" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" />
                {/* Lower triangle active */}
                <polygon points="0,0 0,180 180,180" fill="#f43f5e" fillOpacity="0.3" />
                {/* Upper triangle masked */}
                <text x="125" y="60" fill="#f43f5e" fontSize="11" fontFamily="monospace">Masked (-&infin;)</text>
                <text x="50" y="135" fill="#fecdd3" fontSize="11" fontFamily="monospace">Active (W_ij)</text>
              </g>
              <text x="0" y="235" fill="#f59e0b" fontSize="10" fontWeight="bold">⚠ Necessary for Text Generation, Wasteful for Extraction</text>
              <text x="0" y="250" fill="#64748b" fontSize="9">O(N) sequential forwards passes = 1,200ms latency</text>
            </g>
          </svg>
        );

      /* =========================================================================
         8. QUANTIZATION & BIT ALLOCATION
         ========================================================================= */
      case 'quantization':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            {/* FP32 Bitfield */}
            <g transform="translate(50, 40)">
              <text x="0" y="0" fill="#f8fafc" fontSize="12" fontWeight="bold">1. FP32 (Full Precision IEEE-754 — 32 Bits / 4 Bytes per Weight)</text>
              <g transform="translate(0, 20)">
                <rect x="0" y="0" width="30" height="40" rx="4" fill="#f43f5e" />
                <text x="15" y="25" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1s</text>
                <rect x="35" y="0" width="160" height="40" rx="4" fill="#3b82f6" />
                <text x="115" y="25" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">8 Exponent Bits</text>
                <rect x="200" y="0" width="490" height="40" rx="4" fill="#10b981" />
                <text x="445" y="25" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">23 Mantissa (Fraction) Bits</text>
              </g>
              <text x="0" y="80" fill="#94a3b8" fontSize="10" fontFamily="monospace">Size: 7B Parameters &times; 4 Bytes = 28.0 Gigabytes of Memory</text>
            </g>

            {/* INT8 Quantization Mapping */}
            <g transform="translate(50, 140)">
              <text x="0" y="0" fill="#34d399" fontSize="12" fontWeight="bold">2. INT8 QUANTIZATION (Scale + Zero-Point Mapping — 1 Byte per Weight)</text>
              <g transform="translate(0, 20)">
                <rect x="0" y="0" width="180" height="40" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="2" />
                <text x="90" y="25" fill="#ecfdf5" fontSize="11" fontWeight="bold" textAnchor="middle">8-Bit Signed Int [-128, 127]</text>
              </g>
              <g transform="translate(200, 20)">
                <rect x="0" y="0" width="490" height="40" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                <text x="245" y="25" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                  q = round( x / Scale ) + ZeroPoint &bull; x_dequant = (q - Z) &times; S
                </text>
              </g>
              <text x="0" y="80" fill="#10b981" fontSize="10" fontFamily="monospace">
                Size: 7B Parameters &times; 1 Byte = 7.0 Gigabytes (75% VRAM Reduction &bull; 4x Cache Hit Rate)
              </text>
            </g>

            {/* Production Matrix Multiplier Speedup Card */}
            <g transform="translate(50, 240)">
              <rect x="0" y="0" width="700" height="80" rx="10" fill="#1e1e38" stroke="#818cf8" strokeWidth="1.5" />
              <text x="20" y="25" fill="#a78bfa" fontSize="11" fontWeight="bold">HARDWARE VECTOR ACCELERATION</text>
              <text x="20" y="45" fill="#e2e8f0" fontSize="10">
                Modern CPUs (AVX-512 VNNI) &amp; GPUs (Tensor Cores) execute INT8 dot-products 2x to 4x faster than FP32.
              </text>
              <text x="20" y="65" fill="#34d399" fontSize="10" fontWeight="bold">
                ✓ P99 latency drops from 45ms to 11ms on CPU with &lt; 0.2% accuracy drop!
              </text>
            </g>
          </svg>
        );

      /* =========================================================================
         9. GEOMETRIC DISTANCE METRICS
         ========================================================================= */
      case 'cosine-similarity':
      case 'euclidean-manhattan':
      case 'levenshtein-distance':
      case 'jaccard-hamming':
      case 'mahalanobis-distance':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            {/* Coordinate Plane */}
            <g transform="translate(80, 40)">
              <line x1="40" y1="260" x2="340" y2="260" stroke="#475569" strokeWidth="1.5" />
              <line x1="40" y1="260" x2="40" y2="20" stroke="#475569" strokeWidth="1.5" />
              <circle cx="40" cy="260" r="4" fill="#94a3b8" />
              <text x="25" y="280" fill="#94a3b8" fontSize="10">O(0,0)</text>

              {/* Euclidean Line */}
              <line x1="40" y1="260" x2="260" y2="80" stroke="#38bdf8" strokeWidth="3" />
              <text x="140" y="150" fill="#38bdf8" fontSize="10" fontWeight="bold">Euclidean: d = &radic;(&Delta;x&sup2; + &Delta;y&sup2;)</text>

              {/* Manhattan Grid Path */}
              <path d="M 40 260 L 260 260 L 260 80" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
              <text x="150" y="275" fill="#f59e0b" fontSize="10" fontWeight="bold">Manhattan: L_1 = |&Delta;x| + |&Delta;y|</text>

              {/* Target Point P */}
              <circle cx="260" cy="80" r="6" fill="#10b981" />
              <text x="270" y="80" fill="#10b981" fontSize="11" fontWeight="bold">Point P(x, y)</text>
            </g>

            {/* Metric Selection Rules */}
            <g transform="translate(450, 40)">
              <rect x="0" y="0" width="310" height="270" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="20" y="28" fill="#38bdf8" fontSize="12" fontWeight="bold">METRIC SELECTION PLAYBOOK</text>
              <div className="space-y-3 p-4 pt-1 text-xs">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-sky-400 font-bold block">Cosine Similarity:</span>
                  <span className="text-slate-300">Orientation-only (ignores length/verbosity). Best for dense text embeddings.</span>
                </div>
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold block">Manhattan (L1):</span>
                  <span className="text-slate-300">Resilient to extreme outliers. Best for high-dimensional grid/sparse spaces.</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block">Mahalanobis:</span>
                  <span className="text-slate-300">Scale-invariant, accounts for feature covariance &Sigma;^-1 in multivariate anomaly detection.</span>
                </div>
              </div>
            </g>
          </svg>
        );

      /* =========================================================================
         10. CLUSTERING & UNSUPERVISED (K-MEANS, PCA, DBSCAN)
         ========================================================================= */
      case 'kmeans':
      case 'pca':
      case 'dbscan':
      case 'tsne-umap':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            {/* PCA / Cluster Scatter */}
            <g transform="translate(60, 40)">
              <text x="0" y="0" fill="#38bdf8" fontSize="12" fontWeight="bold">1. PRINCIPAL COMPONENT ANALYSIS (PCA)</text>
              <text x="0" y="16" fill="#94a3b8" fontSize="9">Orthogonal projection onto maximum variance eigenvectors</text>
              <g transform="translate(0, 30)">
                <rect x="0" y="0" width="300" height="220" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                {/* Scatter points along diagonal */}
                <circle cx="60" cy="180" r="4" fill="#38bdf8" />
                <circle cx="90" cy="160" r="4" fill="#38bdf8" />
                <circle cx="120" cy="140" r="4" fill="#38bdf8" />
                <circle cx="150" cy="110" r="4" fill="#38bdf8" />
                <circle cx="180" cy="90" r="4" fill="#38bdf8" />
                <circle cx="210" cy="70" r="4" fill="#38bdf8" />
                <circle cx="240" cy="50" r="4" fill="#38bdf8" />
                {/* Eigenvector 1 (PC 1) */}
                <line x1="40" y1="200" x2="260" y2="40" stroke="#10b981" strokeWidth="3" />
                <text x="210" y="30" fill="#10b981" fontSize="10" fontWeight="bold">PC1 (Max Variance)</text>
                {/* Eigenvector 2 (PC 2 - Orthogonal) */}
                <line x1="120" y1="90" x2="180" y2="150" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                <text x="185" y="165" fill="#f43f5e" fontSize="9">PC2 (Orthogonal)</text>
              </g>
            </g>

            {/* DBSCAN Density Card */}
            <g transform="translate(420, 40)">
              <text x="0" y="0" fill="#a78bfa" fontSize="12" fontWeight="bold">2. DBSCAN DENSITY RADIUS (&epsilon;)</text>
              <text x="0" y="16" fill="#94a3b8" fontSize="9">Finds arbitrary non-convex shapes and isolates noise</text>
              <g transform="translate(0, 30)">
                <rect x="0" y="0" width="320" height="220" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                {/* Core point with epsilon circle */}
                <circle cx="100" cy="100" r="45" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="100" cy="100" r="6" fill="#38bdf8" />
                <text x="110" y="95" fill="#38bdf8" fontSize="10" fontWeight="bold">Core Point (&ge; MinPts)</text>
                {/* Border point */}
                <circle cx="135" cy="120" r="5" fill="#10b981" />
                <text x="145" y="130" fill="#34d399" fontSize="9">Border Point</text>
                {/* Noise point */}
                <circle cx="250" cy="170" r="4" fill="#f43f5e" />
                <text x="260" y="175" fill="#f43f5e" fontSize="9">Noise (Outlier)</text>
              </g>
            </g>
          </svg>
        );

      /* =========================================================================
         DEFAULT FALLBACK
         ========================================================================= */
      default:
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="320" rx="16" fill="#090d16" />
            <g transform="translate(50, 60)">
              <rect x="0" y="0" width="180" height="200" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="20" y="35" fill="#38bdf8" fontSize="12" fontWeight="bold">STAGE 1: INGRESS</text>
              <rect x="15" y="55" width="150" height="40" rx="6" fill="#1e293b" />
              <text x="25" y="79" fill="#f8fafc" fontSize="10" fontFamily="monospace">Feature Pipeline</text>
              <rect x="15" y="105" width="150" height="40" rx="6" fill="#1e293b" />
              <text x="25" y="129" fill="#94a3b8" fontSize="10" fontFamily="monospace">Dense Vectorization</text>
              <text x="20" y="175" fill="#64748b" fontSize="9">Sub-millisecond ingress</text>
            </g>
            <g transform="translate(290, 40)">
              <rect x="0" y="0" width="220" height="240" rx="14" fill="#1e1e38" stroke="#818cf8" strokeWidth="2" />
              <text x="20" y="35" fill="#a78bfa" fontSize="12" fontWeight="bold">STAGE 2: CORE ENGINE</text>
              <rect x="15" y="55" width="190" height="50" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="25" y="78" fill="#38bdf8" fontSize="10" fontWeight="bold">Convex Optimization</text>
              <text x="25" y="94" fill="#cbd5e1" fontSize="9">Analytical or gradient convergence</text>
              <rect x="15" y="120" width="190" height="50" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="25" y="143" fill="#34d399" fontSize="10" fontWeight="bold">Deterministic Bounds</text>
              <text x="25" y="159" fill="#cbd5e1" fontSize="9">Zero hallucination probability</text>
              <text x="20" y="210" fill="#a78bfa" fontSize="10" fontFamily="monospace">O(1) to O(N log N) Bounds</text>
            </g>
            <g transform="translate(570, 60)">
              <rect x="0" y="0" width="180" height="200" rx="12" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="20" y="35" fill="#34d399" fontSize="12" fontWeight="bold">STAGE 3: SERVING</text>
              <rect x="15" y="55" width="150" height="40" rx="6" fill="#065f46" />
              <text x="25" y="79" fill="#ecfdf5" fontSize="10" fontFamily="monospace">P99 &lt; 5ms SLA</text>
              <rect x="15" y="105" width="150" height="40" rx="6" fill="#065f46" />
              <text x="25" y="129" fill="#ecfdf5" fontSize="10" fontFamily="monospace">$0.00 Cloud Cost</text>
              <text x="20" y="175" fill="#a7f3d0" fontSize="9">100% Calibrated Output</text>
            </g>
            <path d="M 230 160 L 290 160" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M 510 160 L 570 160" stroke="#10b981" strokeWidth="2.5" />
          </svg>
        );
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-900 text-xs">
        <span className="font-semibold text-slate-300 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Vector Architecture &amp; Dataflow
        </span>
        <span className="text-slate-500 font-mono text-[11px]">SVG Blueprint • Scalable on Mobile</span>
      </div>

      <div className="py-2 overflow-x-auto">
        {renderDiagramContent()}
      </div>

      {caption && (
        <p className="mt-3 text-center text-xs text-slate-400 italic tracking-wide border-t border-slate-900 pt-2">
          {caption}
        </p>
      )}
    </div>
  );
}
