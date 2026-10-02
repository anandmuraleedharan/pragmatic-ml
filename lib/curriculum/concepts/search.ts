import { Concept } from '../types';

export const SEARCH_CONCEPTS: Concept[] = [
  {
    id: 'bm25',
    title: 'Okapi BM25',
    subtitle: 'Probabilistic Information Retrieval with Term Saturation & Document Length Normalization',
    sectionId: 'search-retrieval',
    sectionTitle: 'Search, Retrieval & Ranking',
    level: 'Foundational',
    tags: ['Search', 'Inverted Index', 'BM25', 'Elasticsearch', 'Information Retrieval', 'Lucene'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM with 200 documents in context to answer: "Which of these documents best mentions model number XJ-9042 and SKU 8812?".',
      whyItFails: 'LLMs suffer from the "Lost in the Middle" phenomenon, hallucinate SKU digits, cost massive input tokens, and cannot scale past a few hundred documents.',
      tcoComparison: {
        specialized: { latency: '0.8ms (Lucene / Inverted Index)', costPerMillion: '$0.00', determinism: '100% Exact Keyword Match' },
        llmAlternative: { latency: '3,000ms', costPerMillion: '$15,000', determinism: 'Hallucinated Product Numbers' }
      }
    },
    intuition: {
      summary: 'BM25 (Best Matching 25) is the reigning industry gold standard for keyword and lexical search, powering Elasticsearch, Lucene, and Algolia.',
      keyPoints: [
        'Improves upon TF-IDF with Term Saturation: additional occurrences of a search keyword have diminishing returns on the score.',
        'Length Normalization: Penalizes verbose documents that mention words by accident while rewarding concise, punchy documents.',
        'Exact matching for domain codes, SKUs, error messages, and proper nouns where dense vector embeddings fail.',
        'Executes in sub-millisecond time via Inverted Index posting list traversals.'
      ],
      detailedExplanation: 'BM25 is derived from the probabilistic relevance framework. Parameter k_1 controls how quickly term frequency saturates, and parameter b controls the degree of document length penalization.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Query["Search: 'Docker container error 502'"] --> Postings["Inverted Index Posting Lists"]
    Postings --> Saturation["TF Saturation (k_1 = 1.5): Stops Keyword Stuffing"]
    Postings --> LengthNorm["Doc Length Normalization (b = 0.75): Penalizes Long Fluff"]
    Saturation --> Score["BM25 Final Score"]
    LengthNorm --> Score
    Score --> TopK["Top-10 Matching Docs in 0.8ms"]
    style Postings fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Score fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'BM25 combines term saturation with length normalization for precise lexical retrieval.'
    },
    mathematics: {
      coreFormula: '\\text{BM25}(D, Q) = \\sum_{i=1}^n \\text{IDF}(q_i) \\cdot \\frac{f(q_i, D) \\cdot (k_1 + 1)}{f(q_i, D) + k_1 \\cdot \\left( 1 - b + b \\cdot \\frac{|D|}{\\text{avgdl}} \\right)}',
      variableDefinitions: [
        { symbol: 'q_i', meaning: 'Query term i' },
        { symbol: 'f(q_i, D)', meaning: 'Term frequency of query term q_i in document D' },
        { symbol: '|D|, \\text{avgdl}', meaning: 'Length of document D and average document length across the entire corpus' },
        { symbol: 'k_1', meaning: 'Term saturation parameter (typically 1.2 to 2.0)' },
        { symbol: 'b', meaning: 'Length normalization parameter (typically 0.75)' },
        { symbol: '\\text{IDF}(q_i)', meaning: '\\ln \\left( \\frac{N - n(q_i) + 0.5}{n(q_i) + 0.5} + 1 \\right)' }
      ],
      derivationOrIntuition: 'If b=1, full length normalization is applied; if b=0, length normalization is completely ignored. As f(q_i, D) -> infinity, the term approaches k_1 + 1, enforcing asymptotic saturation.'
    },
    engineeringCriteria: {
      whenToUse: [
        'E-commerce product search with exact product codes, models, and specifications.',
        'Codebase search (GitHub/grep-style exact function names and variable search).',
        'First-stage candidate retrieval in search engines and Hybrid RAG pipelines.'
      ],
      whenToAvoid: [
        'Pure conceptual or semantic queries where user query uses completely different vocabulary than the document (use dense vector embeddings).'
      ],
      complexity: {
        timeTraining: 'O(N * L) to build inverted index',
        timeInference: 'O(q * \\text{avg\\_postings\\_length}) - sub-millisecond',
        space: 'Compressed inverted index on disk/RAM'
      }
    },
    codeRecipe: {
      framework: 'Python (rank_bm25)',
      code: `from rank_bm25 import BM25Okapi

# Tokenized documents
corpus_tokens = [doc.lower().split() for doc in corpus]
bm25 = BM25Okapi(corpus_tokens, k1=1.5, b=0.75)

# Search query
query = "docker container error 502"
query_tokens = query.lower().split()

# Get top 5 document scores
doc_scores = bm25.get_scores(query_tokens)
top_5_docs = bm25.get_top_n(query_tokens, corpus, n=5)`,
      explanation: 'Indexes corpus using Okapi BM25 with standard k1=1.5 and b=0.75 hyperparameters.'
    },
    principalInterviewFocus: {
      question: 'Why does pure Dense Vector Search fail catastrophically on exact keyword queries (e.g. error codes, part numbers), and why is Hybrid Search (BM25 + Dense) mandatory in enterprise RAG?',
      insight: 'Dense bi-encoders compress text into continuous latent vectors (e.g. 768 dimensions). In this compression, rare alphanumeric strings like "CVE-2024-38077" or "part #99421" lose their unique identity because the subword tokenizer splits them into arbitrary byte fragments. Dense search prioritizes semantic topic similarity over literal token identity. BM25 guarantees 100% recall for exact token presence via postings lists. Combining BM25 with Dense Retrieval via Reciprocal Rank Fusion (RRF) delivers the best of both worlds: semantic understanding for vague queries and exact precision for specific keywords.',
      failureModesInProduction: [
        'Vocabulary mismatch and synonym failure when BM25 is used alone without query expansion.'
      ]
    }
  },
  {
    id: 'cross-encoders',
    title: 'Cross-Encoder Re-Ranking',
    subtitle: 'Deep Cross-Attention Interaction for High-Precision Top-K Re-Ranking',
    sectionId: 'search-retrieval',
    sectionTitle: 'Search, Retrieval & Ranking',
    level: 'Core ML',
    tags: ['Search', 'Re-Ranking', 'Cross-Attention', 'RAG', 'Information Retrieval', 'Transformers'],
    llmAntiPattern: {
      scenario: 'Calling GPT-4 with a 50-document context prompt asking: "Rank these 50 documents from most relevant to least relevant for the query".',
      whyItFails: 'LLMs take 4 seconds, struggle to maintain a strict sorting order over 50 items, cost $0.05 per ranking call, and suffer from position bias.',
      tcoComparison: {
        specialized: { latency: '25ms (GPU / ONNX)', costPerMillion: '$0.00', determinism: '100% Calibrated Relevance Scores' },
        llmAlternative: { latency: '4,000ms', costPerMillion: '$25,000', determinism: 'Position-Biased LLM Sorting' }
      }
    },
    intuition: {
      summary: 'A Cross-Encoder feeds the query and candidate document together into a single transformer encoder, allowing full self-attention across every query token and document token.',
      keyPoints: [
        'Bi-Encoders encode query and document separately (no cross-attention), which is fast but misses fine token interactions.',
        'Cross-Encoders allow every query token to attend to every document token simultaneously, delivering unmatched ranking precision.',
        'Too computationally expensive to run across 1M documents, but ideal for re-ranking the top 50-100 candidates retrieved by BM25 or vector search.',
        'Outputs a continuous relevance score in [0, 1].'
      ],
      detailedExplanation: 'In search pipelines, candidate retrieval retrieves 100 candidates in 5ms. The Cross-Encoder (e.g., BGE-reranker or Cohere Rerank) then scores those 100 pairs with deep cross-attention, boosting NDCG@10 by 15-25%.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    subgraph Bi-Encoder: Separate Embeddings (Fast Retrieval)
        Q1["Query"] --> E1["Encoder"] --> V1["Vector Q"]
        D1["Doc"] --> E2["Encoder"] --> V2["Vector D"]
        V1 --> Dot["Dot Product (No cross-token interaction)"]
        V2 --> Dot
    end
    subgraph Cross-Encoder: Joint Attention (Deep Precision)
        Pair["[CLS] Query [SEP] Document [SEP]"] --> DeepEnc["Full Cross-Attention Transformer"]
        DeepEnc --> RelScore["Relevance Score in [0, 1] (High Precision)"]
    end
    style Dot fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff
    style DeepEnc fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style RelScore fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Bi-Encoder vs Cross-Encoder: Cross-Encoder allows every query token to attend to every document token.'
    },
    mathematics: {
      coreFormula: 's(q, d) = \\sigma\\left( \\mathbf{W} \\cdot \\text{BERT}([\\text{CLS}] \\, q \\, [\\text{SEP}] \\, d \\, [\\text{SEP}])_{[\\text{CLS}]} \\right)',
      variableDefinitions: [
        { symbol: 'q', meaning: 'Search query string' },
        { symbol: 'd', meaning: 'Candidate document string' },
        { symbol: '[\\text{CLS}]', meaning: 'Classification token representation capturing joint interaction' },
        { symbol: '\\mathbf{W}', meaning: 'Linear projection layer mapping [CLS] to a scalar relevance score' }
      ],
      derivationOrIntuition: 'Trained using Binary Cross-Entropy with hard negative mining or MarginMSE loss against teacher models to discern fine semantic nuances.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Stage 2 Re-ranking in modern RAG (Retrieval-Augmented Generation) pipelines.',
        'Re-ranking top-50 results in e-commerce search before displaying to users.',
        'Passage re-ranking in enterprise question-answering systems.'
      ],
      whenToAvoid: [
        'Initial candidate generation over large databases (evaluating 1M docs would take 10 minutes).'
      ],
      complexity: {
        timeTraining: 'Fine-tuned on (query, positive, hard_negative) triplets',
        timeInference: 'O(k * (L_q + L_d)^2) for k candidates - ~20ms for 50 candidates on GPU/ONNX',
        space: 'Model parameters (~100M to 300M)'
      }
    },
    codeRecipe: {
      framework: 'Python (sentence_transformers)',
      code: `from sentence_transformers import CrossEncoder

# Load pre-trained Cross-Encoder reranker
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

query = "How to configure Docker bridge network"
candidate_docs = [
    "Docker uses bridge networks by default to isolate containers on the same host.",
    "Kubernetes pod networking uses CNI plugins like Calico and Flannel.",
    "Python socket programming tutorial for beginners."
]

# Pair query with each candidate
pairs = [[query, doc] for doc in candidate_docs]
scores = reranker.predict(pairs)

# Sort by relevance descending
ranked = sorted(zip(candidate_docs, scores), key=lambda x: x[1], reverse=True)
for doc, score in ranked:
    print(f"[{score:.4f}] {doc}")`,
      explanation: 'Scores query-document pairs simultaneously using deep cross-attention, returning fine relevance ranks.'
    },
    principalInterviewFocus: {
      question: 'What is the Late Interaction architecture (ColBERT), and how does it sit between Bi-Encoders and Cross-Encoders on the Pareto frontier?',
      insight: 'Bi-Encoders compress each document into a single vector (extreme compression, fast O(1) dot product, lower quality). Cross-Encoders allow all tokens to cross-attend (uncompressed, slow O(N * L^2), highest quality). ColBERT (Contextualized Late Interaction over BERT) bridges this gap: it retains multi-vector token embeddings for both query and document, and computes relevance via MaxSim: score = sum_{i in Q} max_{j in D} (E_q_i . E_d_j). Because token embeddings are pre-computed offline and MaxSim is a fast vector search operation, ColBERT achieves 98% of Cross-Encoder accuracy at 100x the speed.',
      failureModesInProduction: [
        'Latency timeouts if candidate pool k is set too high (e.g. k=500 instead of k=50).'
      ]
    }
  },
  {
    id: 'hybrid-rrf',
    title: 'Reciprocal Rank Fusion (RRF)',
    subtitle: 'Parameter-Free Rank Merging for Lexical BM25 & Dense Semantic Search',
    sectionId: 'search-retrieval',
    sectionTitle: 'Search, Retrieval & Ranking',
    level: 'Core ML',
    tags: ['Search', 'Hybrid Search', 'RRF', 'Information Retrieval', 'RAG', 'Ranking'],
    llmAntiPattern: {
      scenario: 'Asking an LLM agent to merge two different search result lists and decide which document belongs at rank 1.',
      whyItFails: 'LLMs suffer from severe ordering biases, slow down search responses by 2,000ms, and cost unnecessary money for a simple ranking formula.',
      tcoComparison: {
        specialized: { latency: '0.01ms', costPerMillion: '$0.00', determinism: '100% Deterministic Fusion' },
        llmAlternative: { latency: '2,000ms', costPerMillion: '$6,000', determinism: 'Inconsistent Sorting' }
      }
    },
    intuition: {
      summary: 'Reciprocal Rank Fusion (RRF) is a non-parametric method that merges rankings from multiple independent search engines (e.g. lexical BM25 and dense vector search) without requiring score normalization.',
      keyPoints: [
        'Different search algorithms produce scores on completely incompatible scales (BM25 scores are unbounded [0, 50], cosine is [-1, 1]).',
        'RRF relies only on the rank positions (1st, 2nd, 3rd) rather than raw floating-point score values.',
        'A constant k (typically 60) dampens the impact of high ranks, preventing an outlier result in one list from dominating.',
        'Documents that rank well across both systems rise to the top.'
      ],
      detailedExplanation: 'For each document d, its RRF score is sum 1 / (k + rank_m(d)). Cormack et al. proved that RRF consistently outperforms score-based linear combinations and is completely immune to score distribution changes.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Query["User Query"] --> BM25["Sparse BM25 Search"]
    Query --> Vector["Dense Vector Search"]
    BM25 --> List1["BM25 Ranking: Doc A (1), Doc B (2), Doc C (3)"]
    Vector --> List2["Dense Ranking: Doc B (1), Doc D (2), Doc A (3)"]
    List1 --> RRF["Reciprocal Rank Fusion: 1 / (60 + rank)"]
    List2 --> RRF
    RRF --> Final["Final Rank: Doc B #1 (ranked high in both!) (0.01ms)"]
    style BM25 fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Vector fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style RRF fill:#818cf8,stroke:#c7d2fe,stroke-width:3px,color:#fff
    style Final fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'RRF merges multiple retrieval result sets based on rank position rather than raw incompatible scores.'
    },
    mathematics: {
      coreFormula: '\\text{RRF\\_Score}(d \\in D) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}',
      variableDefinitions: [
        { symbol: 'M', meaning: 'Set of retrieval systems (e.g., BM25, Dense Vector Search, Splade)' },
        { symbol: 'r_m(d)', meaning: 'Rank position of document d in system m (1-indexed)' },
        { symbol: 'k', meaning: 'Smoothing constant (default standard is k = 60)' },
        { symbol: 'D', meaning: 'Union of all retrieved candidate documents' }
      ],
      derivationOrIntuition: 'Constant k ensures that top ranks don’t receive infinite weight. For k=60: rank 1 yields 1/61 = 0.0164, rank 2 yields 1/62 = 0.0161, providing smooth monotonic decay.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Hybrid RAG systems combining lexical search (BM25) and dense embeddings.',
        'Multi-modal search merging image vector ranks with text vector ranks.',
        'Ensembling multiple search backends without training complex Learning-to-Rank models.'
      ],
      whenToAvoid: [
        'When one search engine is known to be 10x more accurate than the other (use weighted RRF or Cross-Encoder re-ranking).'
      ],
      complexity: {
        timeTraining: 'N/A (Parameter-free)',
        timeInference: 'O(|M| * |D| log |D|) - microseconds for a few hundred documents',
        space: 'O(|D|) hash table'
      }
    },
    codeRecipe: {
      framework: 'Python',
      code: `def reciprocal_rank_fusion(ranking_lists, k=60):
    """
    ranking_lists: list of lists containing doc_ids in ranked order
    Returns: sorted list of (doc_id, rrf_score)
    """
    rrf_scores = {}
    
    for ranked_docs in ranking_lists:
        for rank, doc_id in enumerate(ranked_docs, start=1):
            if doc_id not in rrf_scores:
                rrf_scores[doc_id] = 0.0
            rrf_scores[doc_id] += 1.0 / (k + rank)
            
    # Sort descending by RRF score
    return sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)

# Example: Merging BM25 and Vector search results
bm25_results = ['doc_A', 'doc_B', 'doc_C']
vector_results = ['doc_B', 'doc_D', 'doc_A']

fused = reciprocal_rank_fusion([bm25_results, vector_results], k=60)
print(fused)`,
      explanation: 'Merges multi-source ranking lists in microseconds using the standard k=60 smoothing parameter.'
    },
    principalInterviewFocus: {
      question: 'Why does RRF outperform Min-Max Normalized Linear Combination in real-world hybrid search systems?',
      insight: 'Min-Max normalization (score - min)/(max - min) is fragile in production because: (1) Outlier scores (e.g. an unusually high BM25 match) squash all other scores into near-zero variance; (2) Score distributions shift wildly depending on query length (short queries produce small BM25 scores; long queries produce large scores); (3) It requires maintaining calibration constants across changing indices. RRF is scale-invariant, outlier-invariant, and distribution-free, making it the most reliable production merger for hybrid search.',
      failureModesInProduction: [
        'Setting k too small (e.g. k=1), which over-rewards the #1 rank of any single system even if the document was missing completely from all other systems.'
      ]
    }
  },
  {
    id: 'hnsw-ann',
    title: 'HNSW (Hierarchical Navigable Small World)',
    subtitle: 'Multi-Layer Proximity Graphs for Sub-Millisecond Approximate Nearest Neighbor Search',
    sectionId: 'search-retrieval',
    sectionTitle: 'Search, Retrieval & Ranking',
    level: 'Principal Specialist',
    tags: ['ANN', 'Vector Search', 'HNSW', 'Graphs', 'Skip-List', 'Vector DB'],
    llmAntiPattern: {
      scenario: 'Writing a linear brute-force scan or prompt to locate the nearest vector among 10 million 1536-dimensional embeddings.',
      whyItFails: 'Brute-force scan takes seconds and wastes gigabytes of memory; HNSW locates the top nearest neighbors in 1ms with 99% recall.',
      tcoComparison: {
        specialized: { latency: '1ms (HNSW)', costPerMillion: '$0.00', determinism: '>98% Recall-at-10' },
        llmAlternative: { latency: 'N/A (Impossible)', costPerMillion: 'N/A', determinism: 'Fails to Index' }
      }
    },
    intuition: {
      summary: 'HNSW is the graph-based indexing algorithm powering modern vector databases (Pinecone, Weaviate, Qdrant, Milvus). It builds a multi-layer hierarchical graph inspired by Skip-Lists.',
      keyPoints: [
        'Top layers have few nodes with long-range highway edges for fast macroscopic traversal.',
        'Bottom layer contains all vectors with short-range edges for fine local greedy routing.',
        'Achieves logarithmic O(log N) search complexity instead of linear O(N) brute force.',
        'Delivers the highest recall-vs-latency tradeoff among all ANN algorithms.'
      ],
      detailedExplanation: 'Search starts at the top layer with a greedy search to find the local minimum. That entry point is projected down to the next denser layer, zooming in successively until reaching layer 0 where a beam search (efSearch) explores the immediate neighborhood.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    subgraph Layer 2: Sparse Highway Layer
        L2_A["Node A"] -->|Long Jump| L2_B["Node B"]
    end
    subgraph Layer 1: Medium Density
        L1_A["Node A"] --> L1_C["Node C"] --> L1_B["Node B"]
    end
    subgraph Layer 0: Dense Bottom (All Vectors)
        L0_A["Node A"] --> L0_D["Node D"] --> L0_C["Node C"] --> L0_E["Node E"] --> L0_B["Node B"]
    end
    L2_B -.->|Descend Entry Point| L1_B
    L1_C -.->|Descend Entry Point| L0_C
    style L2_B fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style L0_C fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'HNSW Hierarchy: Coarse highway navigation on top layers, zooming in to fine local greedy search on Layer 0.'
    },
    mathematics: {
      coreFormula: 'P(\\text{level} = l) = e^{-l / m_L}, \\quad m_L = \\frac{1}{\\ln(M)}',
      variableDefinitions: [
        { symbol: 'M', meaning: 'Maximum number of bidirectional connections per element in the graph' },
        { symbol: 'm_L', meaning: 'Normalization factor for probabilistic layer assignment' },
        { symbol: '\\text{efSearch}', meaning: 'Size of dynamic candidate list during query beam search' },
        { symbol: '\\text{efConstruction}', meaning: 'Candidate list size during index construction' }
      ],
      derivationOrIntuition: 'Exponential decay ensures the number of nodes per layer decreases exponentially like a Skip-List, guaranteeing logarithmic O(log N) search hops.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Production vector databases indexing millions of dense embeddings.',
        'Sub-5ms vector retrieval for semantic search and recommendation systems.',
        'High recall (>98%) requirements where quantization artifacts are unacceptable.'
      ],
      whenToAvoid: [
        'Extreme memory constraints (HNSW keeps graph connectivity pointers in RAM; if RAM is limited, use IVF-PQ on disk).'
      ],
      complexity: {
        timeTraining: 'O(N log N) index construction',
        timeInference: 'O(log N) beam traversal - ~1ms',
        space: 'High RAM overhead: Vector storage + M * 4 bytes per node for edge links'
      }
    },
    codeRecipe: {
      framework: 'Python (hnswlib)',
      code: `import hnswlib
import numpy as np

dim = 128
num_elements = 50000

# Generating dummy data
data = np.float32(np.random.random((num_elements, dim)))

# Initializing HNSW index
index = hnswlib.Index(space='cosine', dim=dim)
index.init_index(max_elements=num_elements, ef_construction=200, M=16)

# Add vectors in parallel
index.add_items(data)

# Query top 5 nearest neighbors in 0.3ms
index.set_ef(50) # efSearch trades off speed vs recall
query_vector = data[0]
labels, distances = index.knn_query(query_vector, k=5)
print(f"Top 5 neighbors: {labels}")`,
      explanation: 'Initializes an HNSW index, builds multi-layer proximity graph, and queries top-5 neighbors in 0.3ms.'
    },
    principalInterviewFocus: {
      question: 'What is the memory overhead tradeoff of HNSW vs IVF-PQ, and how do you prune graph edges using the Heuristic Edge Selection rule?',
      insight: 'HNSW maintains bidirectional links M (typically M=16-64) per node across all layers, requiring ~1-2 KB of RAM overhead per vector beyond the raw vector data. For 100M 1536-dim vectors, HNSW requires ~600GB of RAM. In contrast, IVF-PQ compresses vectors into 64 bytes using product quantization codebooks, fitting 100M vectors into ~30GB RAM with a slight recall penalty. For edge pruning: HNSW doesn’t just connect to the M nearest neighbors; it applies a heuristic that checks whether a candidate neighbor is closer to another already-connected neighbor than to the base node. If so, the edge is pruned to prevent forming dense redundant cliques and preserve diverse geometric routing.',
      failureModesInProduction: [
        'OOM (Out Of Memory) crashes when scaling vector counts without provisioning RAM for graph edge pointers.'
      ]
    }
  }
];
