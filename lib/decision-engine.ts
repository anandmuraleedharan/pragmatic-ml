export interface DecisionRule {
  id: string;
  taskTitle: string;
  problemDomain:
    | 'NLP & Extraction'
    | 'Search & Retrieval'
    | 'Tabular & Risk'
    | 'Graph & Routing'
    | 'Deduplication'
    | 'Classification'
    | 'Clustering'
    | 'Recommenders';
  latencySLA: '< 5ms (Real-time)' | '< 50ms (Interactive)' | '< 1s (Batch)';
  dataRequirement: 'Zero-Shot (No Labels)' | 'Few-Shot (10-50 examples)' | 'Supervised Dataset (1k+)';
  computeTarget: 'Edge CPU / WASM ($0)' | 'Standard CPU Server' | 'GPU Inference';
  recommendedStack: {
    primaryAlgorithm: string;
    conceptSlug: string;
    pipelineSteps: string[];
  };
  antiPatternLLM: {
    whyLLMFails: string;
    wastedCostPerMillion: string;
  };
  rationale: string;
}

export const DECISION_RULES: DecisionRule[] = [
  {
    id: 'zero-shot-ner',
    taskTitle: 'Domain-Specific Entity Extraction with Custom Labels',
    problemDomain: 'NLP & Extraction',
    latencySLA: '< 50ms (Interactive)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Standard CPU Server',
    recommendedStack: {
      primaryAlgorithm: 'GLiNER (Generalist Lightweight NER)',
      conceptSlug: 'gliner-ner',
      pipelineSteps: [
        'Ingest raw unstructured text',
        'Pass text and arbitrary custom runtime labels into bidirectional DeBERTa backbone',
        'Compute span representations [h_start ; h_end ; h_start ⊙ h_end]',
        'Sigmoid thresholding for exact character offset extraction'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'LLMs hallucinate schema keys, drop character offsets, stream tokens slowly (2,000ms), and cost $0.02 per document.',
      wastedCostPerMillion: '$20,000 vs $0.00'
    },
    rationale: 'GLiNER provides open-vocabulary zero-shot extraction with exact character boundaries in 15ms on a standard CPU.'
  },
  {
    id: 'exact-sku-search',
    taskTitle: 'Codebase, Log & Exact Product SKU / Part Number Search',
    problemDomain: 'Search & Retrieval',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: 'Okapi BM25 Inverted Index',
      conceptSlug: 'bm25',
      pipelineSteps: [
        'Tokenize documents into inverted index postings lists',
        'Calculate term frequency with asymptotic saturation parameter k_1 = 1.5',
        'Apply document length normalization parameter b = 0.75'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'LLMs suffer from "Lost in the Middle", hallucinate numerical digits, and dense vector embeddings lose alphanumeric token identity.',
      wastedCostPerMillion: '$15,000 vs $0.00'
    },
    rationale: 'BM25 guarantees 100% recall for exact keyword presence in 0.8ms without GPU requirements.'
  },
  {
    id: 'hybrid-rag-retrieval',
    taskTitle: 'Enterprise Hybrid Search for High-Precision RAG',
    problemDomain: 'Search & Retrieval',
    latencySLA: '< 50ms (Interactive)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Standard CPU Server',
    recommendedStack: {
      primaryAlgorithm: 'BM25 + Dense Bi-Encoder + Reciprocal Rank Fusion (RRF)',
      conceptSlug: 'hybrid-rrf',
      pipelineSteps: [
        'Stage 1: Retrieve top-100 candidates from BM25 sparse index (exact keywords)',
        'Stage 1: Retrieve top-100 candidates from HNSW vector index (semantic concepts)',
        'Stage 2: Merge ranking lists using parameter-free Reciprocal Rank Fusion (k=60)',
        'Stage 3: Score top-30 candidates with Cross-Encoder for deep attention re-ranking'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'Stuffing 200 documents into an LLM prompt costs massive tokens and triggers position bias.',
      wastedCostPerMillion: '$35,000 vs $0.00'
    },
    rationale: 'Combines lexical precision with dense semantic understanding, filtered down to exact high-signal passages in under 30ms.'
  },
  {
    id: 'realtime-ctr-risk',
    taskTitle: 'Real-Time Click-Through Rate (CTR) & Credit Risk Bidding',
    problemDomain: 'Tabular & Risk',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Supervised Dataset (1k+)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: 'Logistic Regression or LightGBM',
      conceptSlug: 'logistic-regression',
      pipelineSteps: [
        'Extract dense numerical features and one-hot categorical hashes',
        'Standardize features via StandardScaler',
        'Evaluate linear dot product or leaf tree indices in C++ / ONNX runtime',
        'Map to calibrated probability via Sigmoid function'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'Ad tech bidding has a strict 10ms hard timeout. LLM API calls take 800ms and cannot output calibrated probabilities.',
      wastedCostPerMillion: '$3,000 vs $0.00'
    },
    rationale: 'Logistic regression executes in 0.005ms with 100% mathematically calibrated probability estimates.'
  },
  {
    id: 'graph-centrality',
    taskTitle: 'Authoritative Node Ranking in Dependency & Web Networks',
    problemDomain: 'Graph & Routing',
    latencySLA: '< 50ms (Interactive)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Standard CPU Server',
    recommendedStack: {
      primaryAlgorithm: 'PageRank with Power Iteration',
      conceptSlug: 'pagerank',
      pipelineSteps: [
        'Construct directed stochastic adjacency matrix M',
        'Apply damping factor d = 0.85 with uniform teleportation vector (1-d)/|V|',
        'Run power iteration until L1 convergence norm < 1e-6'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'LLMs cannot compute matrix eigenvalues, hallucinate edge traversals, and fail on graphs larger than 50 nodes.',
      wastedCostPerMillion: '$18,000 vs $0.00'
    },
    rationale: 'PageRank mathematically calculates the stationary Markov distribution across millions of nodes in deterministic polynomial time.'
  },
  {
    id: 'shortest-path-navigation',
    taskTitle: 'Optimal Point-to-Point Navigation & Packet Routing',
    problemDomain: 'Graph & Routing',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: "Dijkstra's Algorithm or A* Search",
      conceptSlug: 'dijkstra',
      pipelineSteps: [
        'Initialize min-priority queue with source node distance 0',
        'Extract lowest tentative distance node u',
        'Relax edges: if dist[u] + w(u, v) < dist[v], update dist[v] and heap'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'LLMs hallucinate invalid edge hops, violate distance accumulation, and produce sub-optimal paths.',
      wastedCostPerMillion: '$9,000 vs $0.00'
    },
    rationale: 'Guarantees the mathematically optimal shortest path in O((V + E) log V) time with zero hallucinations.'
  },
  {
    id: 'entity-deduplication',
    taskTitle: 'Fuzzy Customer Record Linkage & Typo Matching',
    problemDomain: 'Deduplication',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: 'Levenshtein Distance + MinHash LSH',
      conceptSlug: 'levenshtein-distance',
      pipelineSteps: [
        'Shingle strings into character 3-grams',
        'MinHash LSH buckets candidates into identical hash bins',
        'Apply bounded Levenshtein dynamic programming on candidate pairs'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'Querying an LLM to compare 100k customer name pairs costs $500+ and takes hours with zero diff traceability.',
      wastedCostPerMillion: '$4,000 vs $0.00'
    },
    rationale: 'Runs in 0.02ms using rolling-buffer dynamic programming and hardware-accelerated bitwise operations.'
  },
  {
    id: 'high-scale-recs',
    taskTitle: 'Billion-Scale Candidate Recommendation Generation',
    problemDomain: 'Recommenders',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Supervised Dataset (1k+)',
    computeTarget: 'Standard CPU Server',
    recommendedStack: {
      primaryAlgorithm: 'Two-Tower Dual Encoders + HNSW Vector Index',
      conceptSlug: 'two-tower-recommenders',
      pipelineSteps: [
        'Item Tower pre-computes dense vectors for 10M items offline into HNSW index',
        'User Tower encodes live user context online in 1ms',
        'Retrieve top-1000 items via Maximum Inner Product Search (MIPS) in 1ms'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'LLMs cannot evaluate dot products across 10M catalog items in real time.',
      wastedCostPerMillion: '$35,000 vs $0.00'
    },
    rationale: 'Decoupled offline item encoding allows candidate generation over billions of items in sub-2ms latency.'
  },
  {
    id: 'multivariate-anomaly',
    taskTitle: 'Server Telemetry & Financial Anomaly Detection',
    problemDomain: 'Clustering',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: 'Mahalanobis Covariance Distance',
      conceptSlug: 'mahalanobis-distance',
      pipelineSteps: [
        'Estimate empirical covariance matrix Sigma and mean vector mu from baseline',
        'Compute pseudo-inverse precision matrix Sigma^-1',
        'Calculate squared Mahalanobis distance D_M^2 for incoming telemetry',
        'Evaluate analytical p-value via Chi-Square distribution'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'LLMs have no concept of multivariate feature covariance and flag false positives when correlated metrics scale naturally.',
      wastedCostPerMillion: '$8,000 vs $0.00'
    },
    rationale: 'Accounts for correlated features and provides exact analytical p-values in 0.05ms.'
  },
  {
    id: 'streaming-sentiment',
    taskTitle: 'High-Throughput Social Media Stream Sentiment Analysis',
    problemDomain: 'Classification',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Zero-Shot (No Labels)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: 'VADER Lexicon & Rule Engine',
      conceptSlug: 'vader-sentiment',
      pipelineSteps: [
        'Match tokens against curated sentiment valence dictionary',
        'Apply grammatical heuristic rules (ALL-CAPS boost, exclamation booster, contrastive conjunctions)',
        'Compute normalized compound polarity score in [-1.0, +1.0]'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'Processing 50,000 tweets/sec through an LLM costs thousands of dollars per minute and introduces network jitter.',
      wastedCostPerMillion: '$3,000 vs $0.00'
    },
    rationale: 'Zero training, explainable rule weights, and sub-0.02ms latency running in existing CPU memory.'
  },
  {
    id: 'spatial-defect-cv',
    taskTitle: 'Assembly-Line Industrial Defect Detection in Computer Vision',
    problemDomain: 'Classification',
    latencySLA: '< 5ms (Real-time)',
    dataRequirement: 'Supervised Dataset (1k+)',
    computeTarget: 'Edge CPU / WASM ($0)',
    recommendedStack: {
      primaryAlgorithm: 'Convolutional Neural Network (CNN / ResNet) via ONNX INT8',
      conceptSlug: 'cnn-convolutions',
      pipelineSteps: [
        'Ingest raw camera image sensor feed',
        'Apply 2D spatial convolution kernels with residual skip connections',
        'Global average pooling head outputs defect confidence in 3ms on edge NPU'
      ]
    },
    antiPatternLLM: {
      whyLLMFails: 'Multimodal LLMs cost $0.02 per image, take 1,500ms, and cannot guarantee pixel-precise spatial defect localization.',
      wastedCostPerMillion: '$20,000 vs $0.00'
    },
    rationale: 'Weight sharing and spatial translation invariance run in 3ms on edge microcontrollers with INT8 quantization.'
  }
];
