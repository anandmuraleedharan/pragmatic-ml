'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Tag,
  Table,
  Network,
  PieChart,
  ShoppingBag,
  Zap,
  ShieldAlert,
  ArrowRight,
  Clock,
  Cpu,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DecisionNode {
  id: string;
  domain: string;
  icon: any;
  title: string;
  problem: string;
  recommendedModel: string;
  conceptSlug: string;
  latencySLA: string;
  costComparison: string;
  llmAntiPattern: string;
  subBranches: {
    label: string;
    condition: string;
    targetModel: string;
    conceptSlug: string;
    latency: string;
  }[];
}

const DECISION_TREE_NODES: DecisionNode[] = [
  {
    id: 'search',
    domain: 'Search & Information Retrieval',
    icon: Search,
    title: 'Text & Document Search Engine',
    problem: 'Locate relevant technical documentation, product catalogs, or code files from millions of corpus records.',
    recommendedModel: 'BM25 Lexical Index + Hybrid Dense Embeddings',
    conceptSlug: 'bm25',
    latencySLA: '0.2ms - 8ms P99',
    costComparison: '$0.00 / 1M queries (Self-hosted)',
    llmAntiPattern: 'Passing 50 docs into a 128k context window costs $0.05/query and adds 2,200ms latency with high needle-in-a-haystack drop rates.',
    subBranches: [
      {
        label: 'Exact Keywords & Code Logs',
        condition: 'Query contains error codes (502, SIGSEGV), IDs, or exact SKUs.',
        targetModel: 'BM25 Inverted Index',
        conceptSlug: 'bm25',
        latency: '0.2ms',
      },
      {
        label: 'Conceptual Semantic Similarity',
        condition: 'Query uses synonyms, colloquial phrases, or multilingual text.',
        targetModel: 'Two-Tower Dense + HNSW ANN',
        conceptSlug: 'two-tower-recommenders',
        latency: '4ms',
      },
      {
        label: 'Critical Legal / High-Stakes Reranking',
        condition: 'Need cross-attention between query and top 20 candidate docs.',
        targetModel: 'Hybrid RRF + Cross-Encoder',
        conceptSlug: 'hybrid-rrf',
        latency: '22ms',
      },
    ],
  },
  {
    id: 'ner',
    domain: 'Named Entity Recognition (NER)',
    icon: Tag,
    title: 'Token-Level Extraction & Tagging',
    problem: 'Extract structured attributes (people, locations, SKUs, pricing, chemical compounds) from unstructured prose.',
    recommendedModel: 'GLiNER (Generalist Bidirectional NER)',
    conceptSlug: 'gliner-ner',
    latencySLA: '12ms - 18ms P99',
    costComparison: '$0.00 / 1M docs (CPU ONNX Runtime)',
    llmAntiPattern: 'Prompting an LLM for JSON extraction costs $15/1k calls and suffers from syntax parse errors, truncated JSON, and hallucinated entities.',
    subBranches: [
      {
        label: 'Zero-Shot Custom Taxonomy',
        condition: 'Entity categories change dynamically at runtime without retraining.',
        targetModel: 'GLiNER DeBERTa-v3 Bi-Encoder',
        conceptSlug: 'gliner-ner',
        latency: '15ms',
      },
      {
        label: 'Fixed Enterprise Schema',
        condition: 'Static entities (PER, ORG, LOC) trained on 5,000+ domain annotations.',
        targetModel: 'Fine-tuned RoBERTa Token Classifier',
        conceptSlug: 'encoder-vs-decoder',
        latency: '5ms',
      },
    ],
  },
  {
    id: 'tabular',
    domain: 'Tabular Prediction & Churn',
    icon: Table,
    title: 'Relational Tabular Classification',
    problem: 'Predict customer churn, credit default, fraud, or click-through rate from heterogeneous tabular database columns.',
    recommendedModel: 'Gradient Boosted Decision Trees (XGBoost / LightGBM)',
    conceptSlug: 'xgboost-gbdt',
    latencySLA: '1ms - 3ms P99',
    costComparison: '$0.00 / 1M predictions',
    llmAntiPattern: 'LLMs cannot perform numerical split boundaries or handle missing value sparsity; they hallucinate probabilities and cost 100x more.',
    subBranches: [
      {
        label: 'Mixed Categorical & Continuous',
        condition: 'Non-linear feature interactions, missing values, tabular schema.',
        targetModel: 'XGBoost / LightGBM GBDT',
        conceptSlug: 'xgboost-gbdt',
        latency: '2.5ms',
      },
      {
        label: 'High-Dimensional Sparse Ad CTR',
        condition: 'Millions of one-hot encoded category IDs requiring O(1) inference.',
        targetModel: 'Logistic Regression + L1 (Lasso)',
        conceptSlug: 'logistic-regression',
        latency: '0.8ms',
      },
      {
        label: 'Non-Parametric Geometry',
        condition: 'Zero assumptions on underlying distribution; small sample set.',
        targetModel: 'Random Forests',
        conceptSlug: 'random-forests',
        latency: '3ms',
      },
    ],
  },
  {
    id: 'graphs',
    domain: 'Graph Routing & Topology',
    icon: Network,
    title: 'Shortest Path & Network Authority',
    problem: 'Calculate optimal logistics routing, detect fraud clusters, or rank high-authority entities across relational graphs.',
    recommendedModel: 'Dijkstra / A* & PageRank',
    conceptSlug: 'dijkstra',
    latencySLA: '2ms - 6ms P99',
    costComparison: '$0.00 (In-Memory Graph Traversal)',
    llmAntiPattern: 'Generative models notoriously fail at path-finding, cycle detection, and topological sorting, hallucinating non-existent bridges.',
    subBranches: [
      {
        label: 'Shortest Physical / Network Path',
        condition: 'Non-negative edge weights; road networks or microservice latency hops.',
        targetModel: 'Dijkstra Priority Queue / A* Heuristic',
        conceptSlug: 'dijkstra',
        latency: '3ms',
      },
      {
        label: 'Global Node Importance & Influence',
        condition: 'Rank authoritative web pages or influential accounts in social graphs.',
        targetModel: 'PageRank Power Iteration',
        conceptSlug: 'pagerank',
        latency: '5ms',
      },
      {
        label: 'Arbitrary Arbitrage & Currency Exchange',
        condition: 'Graph contains negative edge weights or negative cycle detection.',
        targetModel: 'Bellman-Ford Algorithm',
        conceptSlug: 'bellman-ford',
        latency: '8ms',
      },
    ],
  },
  {
    id: 'clustering',
    domain: 'Clustering & Dimensionality',
    icon: PieChart,
    title: 'Unsupervised Discovery & Compression',
    problem: 'Group user cohorts, detect visual anomalies, or compress 1,536-dimensional embeddings for memory reduction.',
    recommendedModel: 'K-Means, PCA & DBSCAN',
    conceptSlug: 'kmeans',
    latencySLA: '3ms - 10ms P99',
    costComparison: '$0.00 (CPU Linear Algebra)',
    llmAntiPattern: 'LLMs cannot compute mathematical centroid vectors or orthogonal eigenvectors without stochastic rounding distortions.',
    subBranches: [
      {
        label: 'Spherical Partitions & Vector Quantization',
        condition: 'Data clusters around convex spherical centers; fixed cluster count K.',
        targetModel: 'K-Means Expectation-Maximization',
        conceptSlug: 'kmeans',
        latency: '4ms',
      },
      {
        label: 'Arbitrary Density Shapes & Noise',
        condition: 'Spatial anomalies, non-convex winding shapes, noise filtering.',
        targetModel: 'DBSCAN (&epsilon;-Radius)',
        conceptSlug: 'dbscan',
        latency: '9ms',
      },
      {
        label: 'Feature Compression & Decorrelation',
        condition: 'Reduce dimensionality while retaining 95% of total variance.',
        targetModel: 'Principal Component Analysis (PCA)',
        conceptSlug: 'pca',
        latency: '2ms',
      },
    ],
  },
  {
    id: 'recs',
    domain: 'Recommender Systems',
    icon: ShoppingBag,
    title: 'Catalog Candidate Retrieval',
    problem: 'Filter 10,000,000 candidate products or media streams down to top 50 in real time for personalized user feeds.',
    recommendedModel: 'Two-Tower Embeddings & Matrix Factorization',
    conceptSlug: 'two-tower-recommenders',
    latencySLA: '3ms - 5ms P99',
    costComparison: '$0.00 / 1M operations',
    llmAntiPattern: 'Feeding millions of catalog items into an LLM context is mathematically impossible and financially ruinous ($1,000s/minute).',
    subBranches: [
      {
        label: 'Real-Time User & Item Interaction',
        condition: 'Decoupled query and item features; precomputed offline item vectors.',
        targetModel: 'Two-Tower Neural Network + ScaNN',
        conceptSlug: 'two-tower-recommenders',
        latency: '3.5ms',
      },
      {
        label: 'Collaborative Filtering (Ratings Matrix)',
        condition: 'Implicit click/purchase matrix decomposition into low-rank latent vectors.',
        targetModel: 'Alternating Least Squares (ALS) / SVD',
        conceptSlug: 'matrix-factorization',
        latency: '2ms',
      },
    ],
  },
];

export function InteractiveDecisionTree() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('search');
  const [selectedSubBranchIndex, setSelectedSubBranchIndex] = useState<number>(0);

  const activeNode = DECISION_TREE_NODES.find((n) => n.id === selectedNodeId) || DECISION_TREE_NODES[0];
  const activeBranch = activeNode.subBranches[selectedSubBranchIndex] || activeNode.subBranches[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#070b14] p-5 sm:p-7 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
              The Anti-LLM Architecture Decision Tree
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Click any engineering problem domain to trace the optimal non-generative algorithm pipeline.
          </p>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          6 Core Branches &bull; 16 Production Paths
        </span>
      </div>

      {/* Main Grid: Interactive Tree Nav + Detail Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Domain Selector Tiles */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Step 1: Select Your Problem Domain
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {DECISION_TREE_NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = node.id === selectedNodeId;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setSelectedSubBranchIndex(0);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-400/60 bg-gradient-to-r from-sky-950/60 via-indigo-950/40 to-slate-900/60 shadow-lg shadow-sky-500/10'
                      : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{node.domain}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{node.title}</p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isSelected ? 'text-sky-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Sub-Branch Scenarios & Prescription Card */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 2: Specific Engineering Scenario */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Step 2: Specific Data &amp; Query Constraints
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeNode.subBranches.map((branch, idx) => {
                const isBranchActive = selectedSubBranchIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubBranchIndex(idx)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all ${
                      isBranchActive
                        ? 'border-emerald-500/60 bg-emerald-950/30 text-white shadow-md shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-[11px]">{branch.label}</span>
                      <span className="font-mono text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {branch.latency}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{branch.condition}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Prescribed Architecture & LLM Anti-Pattern Comparison */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold">
                  Prescribed Production Algorithm:
                </span>
                <h3 className="text-sm font-extrabold text-white">{activeBranch.targetModel}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <Clock className="h-3 w-3" />
                  <span>SLA: {activeBranch.latency} P99</span>
                </span>
                <span className="flex items-center gap-1 text-xs font-mono text-sky-300 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-lg">
                  <Cpu className="h-3 w-3" />
                  <span>$0.00 / 1M</span>
                </span>
              </div>
            </div>

            {/* Why LLM is an Anti-Pattern */}
            <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-3.5 text-xs">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Why Generative LLM is an Anti-Pattern Here:</span>
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">{activeNode.llmAntiPattern}</p>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-2 flex justify-end">
              <Link
                href={`/concepts/${activeBranch.conceptSlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white hover:brightness-110 shadow-lg shadow-indigo-500/20 transition-all tactile-press"
              >
                <span>Study Full Architecture &amp; Code Recipe</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
