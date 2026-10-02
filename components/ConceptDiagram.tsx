'use client';

import React from 'react';

interface ConceptDiagramProps {
  conceptId: string;
  caption?: string;
}

export function ConceptDiagram({ conceptId, caption }: ConceptDiagramProps) {
  // Render high-fidelity, responsive SVG architectural diagrams tailored for each concept
  const renderDiagramContent = () => {
    switch (conceptId) {
      case 'gliner-ner':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />
            
            {/* Input Tokens */}
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

            {/* Custom Zero-Shot Labels */}
            <g transform="translate(450, 40)">
              <text x="0" y="0" fill="#a78bfa" fontSize="11" fontWeight="600" letterSpacing="0.05em">2. ARBITRARY RUNTIME LABELS</text>
              <rect x="0" y="15" width="90" height="36" rx="8" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="45" y="38" fill="#ddd6fe" fontSize="11" fontWeight="600" textAnchor="middle">#company</text>

              <rect x="100" y="15" width="85" height="36" rx="8" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="142" y="38" fill="#ddd6fe" fontSize="11" fontWeight="600" textAnchor="middle">#executive</text>

              <rect x="195" y="15" width="80" height="36" rx="8" fill="#2e1065" stroke="#8b5cf6" strokeWidth="1.5" />
              <text x="235" y="38" fill="#ddd6fe" fontSize="11" fontWeight="600" textAnchor="middle">#location</text>
            </g>

            {/* Central Bidirectional Encoder */}
            <g transform="translate(40, 120)">
              <rect x="0" y="0" width="720" height="60" rx="12" fill="#0f172a" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
              <text x="360" y="35" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">
                Bidirectional Transformer Encoder (DeBERTa-v3 Backbone)
              </text>
              <text x="360" y="50" fill="#64748b" fontSize="10" textAnchor="middle">
                Joint contextual token hidden states H &amp; Label vectors E in shared metric space
              </text>
            </g>

            {/* Span Representation & Matching Layer */}
            <g transform="translate(40, 215)">
              <rect x="0" y="0" width="340" height="85" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="24" fill="#38bdf8" fontSize="11" fontWeight="bold">Span Representation Generator</text>
              <text x="15" y="44" fill="#cbd5e1" fontSize="10" fontFamily="monospace">
                Span(i, j) = [ h_start ; h_end ; h_start ⊙ h_end ]
              </text>
              <text x="15" y="65" fill="#64748b" fontSize="9">
                Evaluates bounded candidate token spans (K ≤ 12 tokens) in O(K · L)
              </text>
            </g>

            {/* Cross-Matching dot product */}
            <g transform="translate(420, 215)">
              <rect x="0" y="0" width="340" height="85" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="15" y="24" fill="#34d399" fontSize="11" fontWeight="bold">Exact Dot-Product &amp; Sigmoid Output</text>
              <text x="15" y="44" fill="#ecfdf5" fontSize="10" fontFamily="monospace">
                &quot;Apple&quot; → #company (0.99) [0:5]
              </text>
              <text x="15" y="62" fill="#ecfdf5" fontSize="10" fontFamily="monospace">
                &quot;Tim Cook&quot; → #executive (0.98) [10:18]
              </text>
              <text x="15" y="78" fill="#a7f3d0" fontSize="9">
                Deterministic character spans • 15ms latency • Zero JSON hallucinations
              </text>
            </g>

            {/* Connecting arrows */}
            <path d="M 200 76 L 200 120" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-blue)" />
            <path d="M 600 76 L 600 120" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow-purple)" />
            <path d="M 210 180 L 210 215" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 380 257 L 420 257" stroke="#10b981" strokeWidth="2" />
          </svg>
        );

      case 'pagerank':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />

            {/* Node A */}
            <g transform="translate(180, 80)">
              <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              <text x="50" y="46" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">Node A</text>
              <text x="50" y="64" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">PR: 0.384</text>
            </g>

            {/* Node B */}
            <g transform="translate(480, 80)">
              <circle cx="50" cy="50" r="38" fill="#1e293b" stroke="#818cf8" strokeWidth="3" />
              <text x="50" y="46" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">Node B</text>
              <text x="50" y="64" fill="#818cf8" fontSize="11" fontFamily="monospace" textAnchor="middle">PR: 0.342</text>
            </g>

            {/* Node C */}
            <g transform="translate(330, 220)">
              <circle cx="50" cy="50" r="35" fill="#1e293b" stroke="#34d399" strokeWidth="2.5" />
              <text x="50" y="46" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">Node C</text>
              <text x="50" y="64" fill="#34d399" fontSize="11" fontFamily="monospace" textAnchor="middle">PR: 0.174</text>
            </g>

            {/* Node D (Dead end / Sink) */}
            <g transform="translate(60, 220)">
              <circle cx="45" cy="45" r="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="45" y="42" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Node D</text>
              <text x="45" y="58" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle">PR: 0.100</text>
            </g>

            {/* Edges */}
            <path d="M 272 120 L 480 120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
            <text x="375" y="112" fill="#94a3b8" fontSize="10" textAnchor="middle">d · PR(A) / 2</text>

            <path d="M 255 155 L 340 230" stroke="#38bdf8" strokeWidth="2" />
            <path d="M 490 155 L 415 230" stroke="#818cf8" strokeWidth="2" />
            <path d="M 330 250 L 150 250" stroke="#34d399" strokeWidth="2" />
            <path d="M 125 220 L 200 160" stroke="#f59e0b" strokeWidth="2" />

            {/* Random Surfer Teleportation Banner */}
            <g transform="translate(480, 240)">
              <rect x="0" y="0" width="280" height="75" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="15" y="24" fill="#fbbf24" fontSize="11" fontWeight="bold">Damping Factor d = 0.85</text>
              <text x="15" y="44" fill="#e2e8f0" fontSize="10" fontFamily="monospace">
                (1 - d) / |V| = 0.0375
              </text>
              <text x="15" y="62" fill="#94a3b8" fontSize="9">
                Uniform restart prevents rank sink traps
              </text>
            </g>
          </svg>
        );

      case 'dijkstra':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />

            {/* Source Node */}
            <g transform="translate(80, 130)">
              <circle cx="45" cy="45" r="40" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <text x="45" y="42" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Source S</text>
              <text x="45" y="60" fill="#bae6fd" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 0</text>
            </g>

            {/* Node A */}
            <g transform="translate(280, 50)">
              <circle cx="40" cy="40" r="35" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="40" y="37" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Node A</text>
              <text x="40" y="53" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 3</text>
            </g>

            {/* Node B */}
            <g transform="translate(280, 210)">
              <circle cx="40" cy="40" r="35" fill="#065f46" stroke="#34d399" strokeWidth="3" />
              <text x="40" y="37" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Node B</text>
              <text x="40" y="53" fill="#a7f3d0" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 2</text>
            </g>

            {/* Target Node */}
            <g transform="translate(480, 130)">
              <circle cx="45" cy="45" r="40" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="45" y="42" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Target T</text>
              <text x="45" y="60" fill="#fcd34d" fontSize="11" fontFamily="monospace" textAnchor="middle">dist = 7</text>
            </g>

            {/* Edges with Weights */}
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

            {/* Priority Queue state box */}
            <g transform="translate(580, 60)">
              <rect x="0" y="0" width="180" height="240" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="26" fill="#38bdf8" fontSize="11" fontWeight="bold">MIN-HEAP PRIORITY QUEUE</text>
              <rect x="12" y="42" width="156" height="34" rx="6" fill="#065f46" />
              <text x="22" y="63" fill="#ecfdf5" fontSize="10" fontFamily="monospace">POP: (dist=2, Node B)</text>
              
              <rect x="12" y="86" width="156" height="34" rx="6" fill="#1e293b" />
              <text x="22" y="107" fill="#cbd5e1" fontSize="10" fontFamily="monospace">HEAP: (dist=3, Node A)</text>

              <rect x="12" y="130" width="156" height="34" rx="6" fill="#1e293b" />
              <text x="22" y="151" fill="#cbd5e1" fontSize="10" fontFamily="monospace">HEAP: (dist=7, Node T)</text>

              <text x="15" y="195" fill="#64748b" fontSize="9">
                O((V + E) log V) via binary heap
              </text>
              <text x="15" y="215" fill="#10b981" fontSize="9" fontWeight="bold">
                ✓ Guaranteed Optimal Path
              </text>
            </g>
          </svg>
        );

      case 'bm25':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />

            {/* Query */}
            <g transform="translate(40, 40)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">1. SEARCH QUERY</text>
              <rect x="0" y="15" width="220" height="42" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="15" y="41" fill="#f8fafc" fontSize="12" fontFamily="monospace">&quot;Docker error 502&quot;</text>
            </g>

            {/* Inverted Index Postings */}
            <g transform="translate(300, 40)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">2. INVERTED INDEX POSTINGS (0.2ms)</text>
              <rect x="0" y="15" width="460" height="42" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="15" y="41" fill="#38bdf8" fontSize="11" fontFamily="monospace">
                term(&quot;502&quot;) → [Doc #12 (tf=4), Doc #88 (tf=1), Doc #904 (tf=12)]
              </text>
            </g>

            {/* Term Saturation Curve Visualization */}
            <g transform="translate(40, 130)">
              <rect x="0" y="0" width="340" height="190" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="20" y="28" fill="#f8fafc" fontSize="12" fontWeight="bold">Term Saturation Curve (k_1 = 1.5)</text>
              
              {/* Axes */}
              <line x1="40" y1="150" x2="300" y2="150" stroke="#475569" strokeWidth="1.5" />
              <line x1="40" y1="150" x2="40" y2="50" stroke="#475569" strokeWidth="1.5" />
              
              {/* TF-IDF Runaway Curve (Red) */}
              <path d="M 40 150 Q 150 90 290 55" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
              <text x="200" y="70" fill="#f43f5e" fontSize="9">Linear TF-IDF (Over-rewards spam)</text>

              {/* BM25 Asymptote Curve (Green) */}
              <path d="M 40 150 Q 90 85 290 85" stroke="#10b981" strokeWidth="2.5" />
              <text x="160" y="105" fill="#10b981" fontSize="10" fontWeight="bold">BM25 Saturates at (k1 + 1)</text>

              <text x="140" y="170" fill="#64748b" fontSize="9">Term Frequency Count in Document →</text>
            </g>

            {/* Document Length Normalization Box */}
            <g transform="translate(410, 130)">
              <rect x="0" y="0" width="350" height="190" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="20" y="28" fill="#f8fafc" fontSize="12" fontWeight="bold">Length Normalization (b = 0.75)</text>
              
              <rect x="20" y="45" width="310" height="40" rx="6" fill="#1e293b" />
              <text x="30" y="69" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                Concise Doc (50 words): Score Boosted (+35%)
              </text>

              <rect x="20" y="95" width="310" height="40" rx="6" fill="#1e293b" />
              <text x="30" y="119" fill="#f43f5e" fontSize="10" fontFamily="monospace">
                Bloated Doc (5,000 words): Penalized (-60%)
              </text>

              <text x="20" y="160" fill="#cbd5e1" fontSize="10">
                Formula: (1 - b + b · |D| / avgdl) regulates keyword stuffing
              </text>
            </g>
          </svg>
        );

      case 'cnn-convolutions':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />

            {/* Input Image Patch */}
            <g transform="translate(50, 60)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">INPUT PATCH (5x5)</text>
              <rect x="0" y="15" width="130" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              {/* 3x3 sliding window highlight */}
              <rect x="10" y="25" width="70" height="70" rx="4" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
              <text x="45" y="65" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">3x3 Window</text>
            </g>

            {/* Convolution Kernel */}
            <g transform="translate(230, 80)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">KERNEL FILTER (3x3)</text>
              <rect x="0" y="15" width="90" height="90" rx="8" fill="#0f172a" stroke="#818cf8" strokeWidth="2" />
              <text x="45" y="45" fill="#f8fafc" fontSize="9" fontFamily="monospace" textAnchor="middle">[ -1,  0, +1 ]</text>
              <text x="45" y="65" fill="#f8fafc" fontSize="9" fontFamily="monospace" textAnchor="middle">[ -2,  0, +2 ]</text>
              <text x="45" y="85" fill="#f8fafc" fontSize="9" fontFamily="monospace" textAnchor="middle">[ -1,  0, +1 ]</text>
              <text x="45" y="125" fill="#a78bfa" fontSize="9" textAnchor="middle">Sobel Edge Detector</text>
            </g>

            {/* Feature Map */}
            <g transform="translate(370, 75)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">FEATURE MAP</text>
              <rect x="0" y="15" width="100" height="100" rx="8" fill="#065f46" stroke="#34d399" strokeWidth="2" />
              <text x="50" y="65" fill="#ecfdf5" fontSize="11" fontWeight="bold" textAnchor="middle">Activation</text>
              <text x="50" y="85" fill="#a7f3d0" fontSize="9" textAnchor="middle">ReLU(W*X + b)</text>
            </g>

            {/* Residual Skip Connection (ResNet) */}
            <g transform="translate(520, 50)">
              <rect x="0" y="0" width="240" height="260" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="20" y="28" fill="#38bdf8" fontSize="12" fontWeight="bold">RESNET SKIP CONNECTION</text>

              <rect x="25" y="50" width="190" height="36" rx="6" fill="#1e293b" />
              <text x="120" y="73" fill="#cbd5e1" fontSize="10" textAnchor="middle">Input Tensor x</text>

              {/* Residual block bypass path */}
              <path d="M 20 68 L -15 68 L -15 195 L 30 195" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
              <text x="-4" y="130" fill="#f59e0b" fontSize="9" transform="rotate(-90 -4 130)">Identity Shortcut: +x</text>

              <rect x="25" y="110" width="190" height="36" rx="6" fill="#1e293b" stroke="#818cf8" />
              <text x="120" y="133" fill="#a78bfa" fontSize="10" textAnchor="middle">Conv2D Layers: F(x)</text>

              <circle cx="120" cy="195" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="120" y="200" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>

              <text x="120" y="235" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">Output = F(x) + x</text>
              <text x="120" y="250" fill="#64748b" fontSize="8" textAnchor="middle">Gradients flow back unattenuated</text>
            </g>
          </svg>
        );

      case 'cosine-similarity':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />

            {/* Coordinate Plane */}
            <g transform="translate(100, 40)">
              {/* Axes */}
              <line x1="40" y1="260" x2="340" y2="260" stroke="#475569" strokeWidth="1.5" />
              <line x1="40" y1="260" x2="40" y2="20" stroke="#475569" strokeWidth="1.5" />

              {/* Origin */}
              <circle cx="40" cy="260" r="4" fill="#94a3b8" />
              <text x="25" y="280" fill="#94a3b8" fontSize="10">O(0,0)</text>

              {/* Vector A (Short) */}
              <line x1="40" y1="260" x2="160" y2="140" stroke="#38bdf8" strokeWidth="3" />
              <text x="170" y="135" fill="#38bdf8" fontSize="11" fontWeight="bold">Doc A (50 words)</text>

              {/* Vector B (Collinear, long) */}
              <line x1="40" y1="260" x2="280" y2="60" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" />
              <text x="290" y="55" fill="#10b981" fontSize="11" fontWeight="bold">Doc B (5,000 words)</text>

              {/* Angle theta = 0 */}
              <text x="120" y="195" fill="#34d399" fontSize="10" fontWeight="bold">θ = 0° → cos(θ) = 1.0 (Identical!)</text>

              {/* Vector C (Orthogonal, 90 deg) */}
              <line x1="40" y1="260" x2="180" y2="260" stroke="#f43f5e" strokeWidth="2.5" />
              <text x="190" y="255" fill="#f43f5e" fontSize="10" fontWeight="bold">Unrelated Doc C (θ = 90° → cos = 0)</text>
            </g>

            {/* Theory Breakdown Box */}
            <g transform="translate(480, 50)">
              <rect x="0" y="0" width="280" height="250" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="20" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">ORIENTATION VS MAGNITUDE</text>
              
              <rect x="15" y="50" width="250" height="50" rx="6" fill="#1e293b" />
              <text x="25" y="70" fill="#f8fafc" fontSize="10" fontWeight="bold">Magnitude-Invariant Metric</text>
              <text x="25" y="88" fill="#94a3b8" fontSize="9">Measures semantic direction, not verbosity</text>

              <rect x="15" y="115" width="250" height="50" rx="6" fill="#1e293b" />
              <text x="25" y="135" fill="#34d399" fontSize="10" fontWeight="bold">L2-Normalized Simplicity</text>
              <text x="25" y="153" fill="#94a3b8" fontSize="9">When ||u|| = 1: cos(u, v) = u · v (Fast Dot Product)</text>

              <rect x="15" y="180" width="250" height="50" rx="6" fill="#1e293b" />
              <text x="25" y="200" fill="#a78bfa" fontSize="10" fontWeight="bold">Hardware SIMD Optimized</text>
              <text x="25" y="218" fill="#94a3b8" fontSize="9">Billions of ops/sec via AVX-512 / GPU cores</text>
            </g>
          </svg>
        );

      case 'transformers-attention':
        return (
          <svg viewBox="0 0 800 360" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" rx="16" fill="#090d16" />

            {/* Input Tokens */}
            <g transform="translate(40, 50)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">INPUT EMBEDDINGS X</text>
              <rect x="0" y="15" width="140" height="40" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="70" y="39" fill="#f8fafc" fontSize="11" fontFamily="monospace" textAnchor="middle">Token Vectors (N x d)</text>
            </g>

            {/* Linear Projections */}
            <g transform="translate(230, 30)">
              <rect x="0" y="0" width="90" height="32" rx="6" fill="#0284c7" />
              <text x="45" y="20" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Query (Q)</text>

              <rect x="0" y="45" width="90" height="32" rx="6" fill="#6366f1" />
              <text x="45" y="65" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Key (K)</text>

              <rect x="0" y="90" width="90" height="32" rx="6" fill="#059669" />
              <text x="45" y="110" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Value (V)</text>
            </g>

            {/* Scaled Dot-Product Core */}
            <g transform="translate(370, 40)">
              <rect x="0" y="0" width="180" height="90" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="90" y="32" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Scaled Dot-Product</text>
              <text x="90" y="55" fill="#f8fafc" fontSize="11" fontFamily="monospace" textAnchor="middle">Q · K^T / √d_k</text>
              <text x="90" y="75" fill="#a78bfa" fontSize="10" fontWeight="bold" textAnchor="middle">Softmax → Attention W</text>
            </g>

            {/* Output Weighted Values */}
            <g transform="translate(600, 40)">
              <rect x="0" y="0" width="160" height="90" rx="10" fill="#065f46" stroke="#34d399" strokeWidth="2" />
              <text x="80" y="35" fill="#ecfdf5" fontSize="12" fontWeight="bold" textAnchor="middle">Weighted Sum</text>
              <text x="80" y="58" fill="#ffffff" fontSize="12" fontFamily="monospace" textAnchor="middle">W · V</text>
              <text x="80" y="76" fill="#a7f3d0" fontSize="9" textAnchor="middle">Contextual Output</text>
            </g>

            {/* Attention Heatmap Matrix */}
            <g transform="translate(40, 160)">
              <rect x="0" y="0" width="720" height="160" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="25" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">N x N ALL-TO-ALL ATTENTION MATRIX ROUTING</text>
              <text x="25" y="50" fill="#94a3b8" fontSize="10">
                Every token simultaneously computes relevance scores against all other tokens in O(N^2)
              </text>
              
              {/* Token attention rows preview */}
              <g transform="translate(25, 70)">
                <rect x="0" y="0" width="100" height="28" rx="4" fill="#1e293b" />
                <text x="50" y="18" fill="#f8fafc" fontSize="10" textAnchor="middle">&quot;The&quot; → 0.05</text>

                <rect x="115" y="0" width="120" height="28" rx="4" fill="#0284c7" />
                <text x="175" y="18" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">&quot;robot&quot; → 0.72</text>

                <rect x="250" y="0" width="120" height="28" rx="4" fill="#1e293b" />
                <text x="310" y="18" fill="#f8fafc" fontSize="10" textAnchor="middle">&quot;crossed&quot; → 0.12</text>

                <rect x="385" y="0" width="110" height="28" rx="4" fill="#0284c7" />
                <text x="440" y="18" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">&quot;street&quot; → 0.65</text>

                <rect x="510" y="0" width="150" height="28" rx="4" fill="#065f46" />
                <text x="585" y="18" fill="#ecfdf5" fontSize="10" fontWeight="bold" textAnchor="middle">&quot;it&quot; (Resolves to robot)</text>
              </g>

              <text x="25" y="135" fill="#64748b" fontSize="9">
                FlashAttention avoids materializing this N x N matrix in slow HBM, tiling calculations in fast GPU SRAM
              </text>
            </g>
          </svg>
        );

      default:
        // Universal high-fidelity architectural schema for all other concepts
        return (
          <svg viewBox="0 0 800 320" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="320" rx="16" fill="#090d16" />

            {/* Stage 1: Ingestion */}
            <g transform="translate(50, 60)">
              <rect x="0" y="0" width="180" height="200" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="20" y="35" fill="#38bdf8" fontSize="12" fontWeight="bold">STAGE 1: INPUT</text>
              <rect x="15" y="55" width="150" height="40" rx="6" fill="#1e293b" />
              <text x="25" y="79" fill="#f8fafc" fontSize="10" fontFamily="monospace">Raw Feature Stream</text>
              <rect x="15" y="105" width="150" height="40" rx="6" fill="#1e293b" />
              <text x="25" y="129" fill="#94a3b8" fontSize="10" fontFamily="monospace">Normalization Layer</text>
              <text x="20" y="175" fill="#64748b" fontSize="9">Sub-millisecond ingress</text>
            </g>

            {/* Stage 2: Algorithmic Transformation */}
            <g transform="translate(290, 40)">
              <rect x="0" y="0" width="220" height="240" rx="14" fill="#1e1e38" stroke="#818cf8" strokeWidth="2" />
              <text x="20" y="35" fill="#a78bfa" fontSize="12" fontWeight="bold">STAGE 2: CORE ENGINE</text>
              
              <rect x="15" y="55" width="190" height="50" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="25" y="78" fill="#38bdf8" fontSize="10" fontWeight="bold">Closed-Form / Convex Optimization</text>
              <text x="25" y="94" fill="#cbd5e1" fontSize="9">Analytical or gradient convergence</text>

              <rect x="15" y="120" width="190" height="50" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <text x="25" y="143" fill="#34d399" fontSize="10" fontWeight="bold">Deterministic Metric Bounds</text>
              <text x="25" y="159" fill="#cbd5e1" fontSize="9">Zero hallucination probability</text>

              <text x="20" y="210" fill="#a78bfa" fontSize="10" fontFamily="monospace">O(1) to O(N log N) Bounds</text>
            </g>

            {/* Stage 3: Production Serving Output */}
            <g transform="translate(570, 60)">
              <rect x="0" y="0" width="180" height="200" rx="12" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
              <text x="20" y="35" fill="#34d399" fontSize="12" fontWeight="bold">STAGE 3: SERVING</text>
              <rect x="15" y="55" width="150" height="40" rx="6" fill="#065f46" />
              <text x="25" y="79" fill="#ecfdf5" fontSize="10" fontFamily="monospace">P99 &lt; 5ms SLA</text>
              <rect x="15" y="105" width="150" height="40" rx="6" fill="#065f46" />
              <text x="25" y="129" fill="#ecfdf5" fontSize="10" fontFamily="monospace">$0.00 Cloud Cost</text>
              <text x="20" y="175" fill="#a7f3d0" fontSize="9">100% Calibrated Precision</text>
            </g>

            {/* Arrows */}
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
        <span className="text-slate-500 font-mono text-[11px]">SVG • Scalable on Mobile</span>
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
