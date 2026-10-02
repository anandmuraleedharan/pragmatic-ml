import { SectionMetadata } from './types';

export const SECTIONS: SectionMetadata[] = [
  {
    id: 'graph-algorithms',
    title: 'Graph & Network Algorithms',
    shortTitle: 'Graphs',
    icon: 'Network',
    badgeColor: 'from-blue-500 to-indigo-500',
    description: 'Graph centrality, pathfinding, and topology traversals that solve discrete routing and influence problems in deterministic polynomial time.'
  },
  {
    id: 'distance-metrics',
    title: 'Distance & Similarity Metrics',
    shortTitle: 'Distances',
    icon: 'Ruler',
    badgeColor: 'from-cyan-500 to-teal-500',
    description: 'The geometric and topological foundations of machine learning, measuring proximity across continuous spaces, strings, sets, and sequences.'
  },
  {
    id: 'classical-supervised',
    title: 'Classical Supervised Learning',
    shortTitle: 'Supervised',
    icon: 'Brain',
    badgeColor: 'from-emerald-500 to-green-600',
    description: 'Interpretable, blazingly fast regression and classification models with rigorous statistical foundations, zero API bills, and no hallucination risk.'
  },
  {
    id: 'classical-unsupervised',
    title: 'Unsupervised & Dimensionality Reduction',
    shortTitle: 'Unsupervised',
    icon: 'Boxes',
    badgeColor: 'from-purple-500 to-pink-500',
    description: 'Discovering hidden manifolds, latent structures, and natural clusters across high-dimensional datasets without manual labeling.'
  },
  {
    id: 'recommender-systems',
    title: 'Recommenders & Collaborative Filtering',
    shortTitle: 'Recommenders',
    icon: 'Sparkles',
    badgeColor: 'from-amber-500 to-orange-500',
    description: 'Personalized discovery algorithms from matrix factorization to dual-encoder two-tower networks operating at scale over billions of interactions.'
  },
  {
    id: 'classical-nlp',
    title: 'Classical NLP & Information Extraction',
    shortTitle: 'NLP',
    icon: 'FileText',
    badgeColor: 'from-sky-500 to-blue-600',
    description: 'Targeted lexical, statistical, and specialized encoder models for entity extraction, token weighting, and sentiment with sub-10ms SLAs.'
  },
  {
    id: 'search-retrieval',
    title: 'Search, Retrieval & Ranking',
    shortTitle: 'Search',
    icon: 'Search',
    badgeColor: 'from-teal-500 to-emerald-600',
    description: 'Modern information retrieval combining sparse inverted indices (BM25), dense bi-encoders, reciprocal rank fusion, and cross-encoder re-rankers.'
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning & Neural Architectures',
    shortTitle: 'Deep Learning',
    icon: 'Cpu',
    badgeColor: 'from-rose-500 to-red-600',
    description: 'Core architectural building blocks: spatial convolutions, temporal recurrent gates, and scaled multi-head self-attention mechanisms.'
  },
  {
    id: 'evaluation-metrics',
    title: 'Evaluation, Loss Functions & Calibration',
    shortTitle: 'Evaluation',
    icon: 'Target',
    badgeColor: 'from-violet-500 to-purple-600',
    description: 'Rigorous optimization objectives, discrimination metrics, probabilistic calibration, and ranking evaluations used by senior ML practitioners.'
  },
  {
    id: 'production-systems',
    title: 'Production ML Systems & Optimization',
    shortTitle: 'Production ML',
    icon: 'Zap',
    badgeColor: 'from-yellow-500 to-amber-600',
    description: 'Inference runtime engineering: quantization, model distillation, covariate shift monitoring, and low-latency serving tradeoffs.'
  }
];
