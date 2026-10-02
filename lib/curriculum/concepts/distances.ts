import { Concept } from '../types';

export const DISTANCE_CONCEPTS: Concept[] = [
  {
    id: 'cosine-similarity',
    title: 'Cosine Similarity & Angular Distance',
    subtitle: 'Orientation-Invariant Proximity for High-Dimensional Sparse & Dense Vectors',
    sectionId: 'distance-metrics',
    sectionTitle: 'Distance & Similarity Metrics',
    level: 'Foundational',
    tags: ['Linear Algebra', 'Vector Search', 'Embeddings', 'NLP', 'Information Retrieval'],
    llmAntiPattern: {
      scenario: 'Sending pairs of document embeddings or text paragraphs to an LLM asking: "Rate how semantically similar these two passages are from 0 to 1".',
      whyItFails: 'Costs 50,000x more compute, introduces prompt drift, takes seconds instead of nanoseconds, and fails to obey mathematical metric properties.',
      tcoComparison: {
        specialized: { latency: '0.002ms (AVX/SIMD)', costPerMillion: '$0.00', determinism: '100% Deterministic' },
        llmAlternative: { latency: '1,800ms', costPerMillion: '$5,000', determinism: 'Subjective / Inconsistent' }
      }
    },
    intuition: {
      summary: 'Cosine similarity measures the cosine of the angle between two non-zero vectors in an inner product space. It measures orientation, not magnitude.',
      keyPoints: [
        'Ranges from -1 (exact opposite) to +1 (identical direction), with 0 meaning orthogonal (uncorrelated).',
        'In text applications where word frequencies or embedding dimensions are non-negative, the range is [0, 1].',
        'Crucial property: Length invariant. A 100-word essay and a 10,000-word book about the same topic have virtually identical cosine similarity.'
      ],
      detailedExplanation: 'Magnitude often reflects verbosity or frequency rather than semantic content. By normalizing both vectors to unit length (L2 norm = 1), cosine similarity collapses down to a simple dot product: cos(theta) = u . v. This allows modern vector databases (FAISS, pgvector, HNSW) to perform billions of comparisons per second via SIMD hardware instructions.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Origin((Origin 0,0)) -->|Vector A| ShortDoc["Short Document: 'Machine Learning Python'"]
    Origin -->|Vector B (Same Direction, Longer)| LongDoc["Long Document: 'Machine Learning Python ... 50 pages'"]
    Origin -->|Vector C (Orthogonal)| Unrelated["Unrelated Document: 'Chocolate Cake Recipe'"]
    style Origin fill:#0f172a,stroke:#64748b,stroke-width:2px,color:#fff
    style ShortDoc fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style LongDoc fill:#1e293b,stroke:#34d399,stroke-width:2px,color:#fff
    style Unrelated fill:#1e293b,stroke:#f43f5e,stroke-width:2px,color:#fff`,
      caption: 'Cosine invariance: Short and long documents sharing the same vocabulary vector have an angle of 0 deg (Cosine = 1.0).'
    },
    mathematics: {
      coreFormula: '\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|_2 \\|\\mathbf{v}\\|_2} = \\frac{\\sum_{i=1}^n u_i v_i}{\\sqrt{\\sum_{i=1}^n u_i^2} \\sqrt{\\sum_{i=1}^n v_i^2}}',
      variableDefinitions: [
        { symbol: '\\mathbf{u}, \\mathbf{v}', meaning: 'n-dimensional real vectors' },
        { symbol: '\\|\\mathbf{u}\\|_2', meaning: 'Euclidean L2 norm (magnitude) of vector u' },
        { symbol: '\\cos(\\theta)', meaning: 'Similarity score between -1 and +1' },
        { symbol: 'D_{\\text{angular}}', meaning: 'True distance metric: 1 - \\cos(\\theta) or \\frac{\\arccos(\\cos(\\theta))}{\\pi}' }
      ],
      derivationOrIntuition: 'Cosine similarity is derived directly from the geometric definition of the Euclidean dot product: u . v = ||u|| ||v|| cos(theta). While 1 - cos(theta) is colloquially called cosine distance, note that it violates the Triangle Inequality; Angular Distance = arccos(cos(theta)) / pi is the mathematically valid metric.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Dense embedding comparisons (OpenAI embeddings, Sentence-Transformers, Cohere).',
        'Sparse TF-IDF and Bag-of-Words text document retrieval.',
        'High-dimensional recommender user/item latent vectors.'
      ],
      whenToAvoid: [
        'When physical scale or magnitude has physical meaning (e.g. coordinates in physical space, velocity vectors).'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(d) where d is the vector dimension. Vectorized on CPU/GPU via BLAS/SIMD.',
        space: 'O(1) memory overhead'
      }
    },
    codeRecipe: {
      framework: 'Python (NumPy / SciPy)',
      code: `import numpy as np

def cosine_similarity(u, v):
    """
    Computes cosine similarity between two 1D vectors u and v.
    """
    norm_u = np.linalg.norm(u)
    norm_v = np.linalg.norm(v)
    if norm_u == 0 or norm_v == 0:
        return 0.0
    return float(np.dot(u, v) / (norm_u * norm_v))

# Fast batch cosine similarity against a database matrix
def batch_cosine_similarity(query_vec, doc_matrix):
    # Normalize query
    q_norm = query_vec / np.linalg.norm(query_vec)
    # Normalize matrix rows
    m_norms = np.linalg.norm(doc_matrix, axis=1, keepdims=True)
    m_normed = doc_matrix / np.maximum(m_norms, 1e-12)
    # Matrix-vector product
    return np.dot(m_normed, q_norm)`,
      explanation: 'Normalizes vectors to unit sphere so that similarity reduces to a blazingly fast matrix-vector dot product.'
    },
    principalInterviewFocus: {
      question: 'Why does Cosine Distance (1 - cos) fail to be a formal metric, and why do vector databases require unit-normalized vectors for Maximum Inner Product Search (MIPS)?',
      insight: 'A formal metric must satisfy the Triangle Inequality: d(x, z) <= d(x, y) + d(y, z). 1 - cos fails this test. For example, in 2D space, rotating by 90 degrees twice yields 1 - cos = 1 each time (sum = 2), but the total 180-degree rotation yields 1 - (-1) = 2, violating strict subadditivity under certain projections. For vector databases, pre-normalizing all vectors to ||v|| = 1 transforms MIPS into standard Euclidean distance search because ||u - v||^2 = ||u||^2 + ||v||^2 - 2(u.v) = 2 - 2(u.v). Minimizing Euclidean distance directly maximizes cosine similarity.',
      failureModesInProduction: [
        'Failing to handle division by zero when embeddings produce all-zero vectors.'
      ]
    }
  },
  {
    id: 'euclidean-manhattan',
    title: 'Euclidean (L2) & Manhattan (L1) Distance',
    subtitle: 'Geometric Norms, Minkowski Generalization & The Curse of Dimensionality',
    sectionId: 'distance-metrics',
    sectionTitle: 'Distance & Similarity Metrics',
    level: 'Foundational',
    tags: ['Geometry', 'Norms', 'Linear Algebra', 'Clustering', 'Curse of Dimensionality'],
    llmAntiPattern: {
      scenario: 'Asking an LLM to cluster or find the nearest physical warehouse to a customer coordinate.',
      whyItFails: 'LLMs hallucinate geography, fail at arithmetic square root formulas, and produce non-deterministic spatial queries.',
      tcoComparison: {
        specialized: { latency: '0.001ms', costPerMillion: '$0.00', determinism: 'Exact Analytical Metric' },
        llmAlternative: { latency: '2,000ms', costPerMillion: '$6,000', determinism: 'Approximation / Guesswork' }
      }
    },
    intuition: {
      summary: 'Euclidean distance measures the "straight-line" physical distance between points, while Manhattan distance measures distance along axis-aligned grid paths (city blocks).',
      keyPoints: [
        'Euclidean (L2) penalizes large individual dimension deviations heavily due to the squaring operation.',
        'Manhattan (L1) is robust to outliers because errors accumulate linearly.',
        'Both are specific instances of the Minkowski distance family with p=2 and p=1 respectively.',
        'In very high dimensions (d > 100), the ratio between nearest and farthest points converges toward 1 (Curse of Dimensionality), making L1 preferable over L2.'
      ],
      detailedExplanation: 'In 2D space, Euclidean distance corresponds to the hypotenuse of a right-angled triangle. In city-grid navigation, diagonal movement is impossible, making Manhattan distance the realistic metric. As dimensionality explodes, distance concentration makes Euclidean distances nearly indistinguishable.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    P1["Point A (x1, y1)"] -->|"L2: Straight Line (Hypotenuse)"| P2["Point B (x2, y2)"]
    P1 -->|"L1: Grid Step Horizontal"| Corner["(x2, y1)"]
    Corner -->|"L1: Grid Step Vertical"| P2
    style P1 fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style P2 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Corner fill:#1e293b,stroke:#f59e0b,stroke-width:1px,stroke-dasharray: 4 4,color:#fff`,
      caption: 'L1 (Manhattan) traverses grid edges (|dx| + |dy|), whereas L2 (Euclidean) cuts the straight-line hypotenuse.'
    },
    mathematics: {
      coreFormula: 'L_2(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^d (x_i - y_i)^2}, \\quad L_1(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^d |x_i - y_i|',
      variableDefinitions: [
        { symbol: '\\mathbf{x}, \\mathbf{y}', meaning: 'Data points in d-dimensional Euclidean space \\mathbb{R}^d' },
        { symbol: 'L_p', meaning: 'Minkowski distance: \\left( \\sum_{i=1}^d |x_i - y_i|^p \\right)^{1/p}' },
        { symbol: 'd', meaning: 'Number of feature dimensions' }
      ],
      derivationOrIntuition: 'When p=1, we get Manhattan norm. When p=2, we get Euclidean norm. When p -> \\infty, we get the Chebyshev (maximum absolute deviation) norm: \\max_i |x_i - y_i|.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Physical coordinate systems, robotic spatial positioning, geospatial routing.',
        'K-Means clustering and Gaussian mixture models.',
        'Lasso (L1) and Ridge (L2) regression penalty calculations.'
      ],
      whenToAvoid: [
        'Unnormalized high-dimensional text data where document length inflates Euclidean distances artificially (use Cosine).'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(d) vector math',
        space: 'O(1)'
      }
    },
    codeRecipe: {
      framework: 'Python (NumPy)',
      code: `import numpy as np

def euclidean_distance(a, b):
    return float(np.linalg.norm(np.array(a) - np.array(b), ord=2))

def manhattan_distance(a, b):
    return float(np.linalg.norm(np.array(a) - np.array(b), ord=1))

def minkowski_distance(a, b, p=3):
    return float(np.sum(np.abs(np.array(a) - np.array(b)) ** p) ** (1 / p))`,
      explanation: 'Calculates L1, L2, and generalized Minkowski norms using NumPy vectorized linear algebra.'
    },
    principalInterviewFocus: {
      question: 'Explain the phenomenon of Distance Concentration in high dimensions and why Fractional Minkowski distance (p < 1) is researched for high-dimensional spaces.',
      insight: 'As dimensionality d increases, for any random vector distribution, the variance of distance between points scales as O(1) while the mean distance scales as O(sqrt(d)). Consequently, the relative contrast (dist_max - dist_min) / dist_min approaches 0. Points appear equidistant from one another, causing algorithms like k-NN and K-Means to collapse. Lower norms (p=1 or fractional p < 1) reduce the exponentiation of deviations, preserving more relative distance contrast than L2 in high-dimensional spaces.',
      failureModesInProduction: [
        'Applying Euclidean distance on unscaled features where one feature has range [0, 1000000] and another has [0, 1]; unscaled features completely dominate the metric.'
      ]
    }
  },
  {
    id: 'levenshtein-distance',
    title: 'Levenshtein & Edit Distance',
    subtitle: 'Dynamic Programming Matrix for String Alignment, Typo Tolerance & Spell Correction',
    sectionId: 'distance-metrics',
    sectionTitle: 'Distance & Similarity Metrics',
    level: 'Foundational',
    tags: ['Dynamic Programming', 'String Algorithms', 'Entity Resolution', 'NLP', 'Fuzzy Matching'],
    llmAntiPattern: {
      scenario: 'Calling an LLM API to check if a user input "anand" matches database entry "annand" or "anandm".',
      whyItFails: 'Costs 50,000x more per transaction, adds 1,500ms latency to search bars, and cannot supply predictable character-level diff matrices.',
      tcoComparison: {
        specialized: { latency: '0.04ms on CPU', costPerMillion: '$0.00', determinism: '100% Exact Edit Count' },
        llmAlternative: { latency: '1,400ms', costPerMillion: '$4,000', determinism: 'Subjective LLM Output' }
      }
    },
    intuition: {
      summary: 'Levenshtein distance measures the minimum number of single-character edits (insertions, deletions, or substitutions) required to transform one string into another.',
      keyPoints: [
        'Computed via an (M+1) x (N+1) Dynamic Programming grid.',
        'Supports exact fuzzy search, typo correction, and genomic DNA sequence alignment (Needleman-Wunsch).',
        'Can be restricted to a threshold k using Ukkonen’s cutoff algorithm to run in O(k * min(M, N)) time.'
      ],
      detailedExplanation: 'If the characters at the current positions match, the edit distance is carried over from the diagonal with 0 additional cost. If they differ, the cell takes 1 + the minimum of deletion (up), insertion (left), and substitution (diagonal).'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    subgraph DP Matrix Cell Logic
        Diag["Diagonal (i-1, j-1): Substitution (Cost 1 or 0)"] --> Cell["D[i, j] = Min + Cost"]
        Up["Up (i-1, j): Deletion (Cost +1)"] --> Cell
        Left["Left (i, j-1): Insertion (Cost +1)"] --> Cell
    end
    style Cell fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Diag fill:#1e293b,stroke:#34d399,stroke-width:1px,color:#fff
    style Up fill:#1e293b,stroke:#f59e0b,stroke-width:1px,color:#fff
    style Left fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff`,
      caption: 'Dynamic Programming Recurrence: Selecting the minimum cost path across insertion, deletion, and substitution.'
    },
    mathematics: {
      coreFormula: 'D[i, j] = \\begin{cases} \\max(i, j) & \\text{if } \\min(i, j) = 0 \\\\ \\min \\begin{cases} D[i-1, j] + 1 \\\\ D[i, j-1] + 1 \\\\ D[i-1, j-1] + \\mathbb{I}(s_1[i] \\neq s_2[j]) \\end{cases} & \\text{otherwise} \\end{cases}',
      variableDefinitions: [
        { symbol: 'D[i, j]', meaning: 'Edit distance between prefix s1[0..i] and prefix s2[0..j]' },
        { symbol: '\\mathbb{I}', meaning: 'Indicator function: 0 if characters match, 1 if substitution required' },
        { symbol: 'M, N', meaning: 'Lengths of the two comparison strings' }
      ],
      derivationOrIntuition: 'The recurrence examines all optimal substructure transformations. Memory can be optimized from O(M * N) down to O(min(M, N)) space by observing that cell D[i, j] only depends on the current row and previous row.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Instant typo-tolerant search suggestions (e.g. Algolia, Elasticsearch fuzzy queries).',
        'Record linkage, entity deduplication (e.g. matching CRM customer records).',
        'Bioinformatics DNA / RNA codon alignment.'
      ],
      whenToAvoid: [
        'Long documents with thousands of characters (scales quadratically O(M * N); use MinHash or SimHash instead).'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(M * N) standard DP, or O(k * min(M, N)) with bounded edit distance k',
        space: 'O(min(M, N)) with two-row rolling buffer'
      }
    },
    codeRecipe: {
      framework: 'Python (Rolling Buffer DP)',
      code: `def levenshtein_distance(s1, s2):
    """
    Computes Levenshtein distance using O(min(M, N)) space.
    """
    if len(s1) < len(s2):
        s1, s2 = s2, s1
        
    previous_row = list(range(len(s2) + 1))
    
    for i, c1 in enumerate(s1):
        current_row = [i + 1] + [0] * len(s2)
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row[j + 1] = min(insertions, deletions, substitutions)
        previous_row = current_row
        
    return previous_row[-1]`,
      explanation: 'Calculates the exact minimal edit distance using a rolling row buffer to maintain an ultra-compact memory footprint.'
    },
    principalInterviewFocus: {
      question: 'How does a Levenshtein Automaton enable sub-millisecond fuzzy search over a dictionary of 1,000,000 words in an Inverted Index?',
      insight: 'Running pairwise Levenshtein against 1M dictionary entries takes seconds. A Levenshtein Automaton translates the edit distance rule into a Deterministic Finite Automaton (DFA) that accepts all strings within edit distance k. By intersecting this DFA with a pre-built Finite State Transducer (FST) or Trie index representing the dictionary, we prune 99.9% of non-matching branches in a single traversal, returning matching candidates in < 0.2ms.',
      failureModesInProduction: [
        'Unbounded edit queries (k > 2) triggering exponential combinatorial explosion in search index lookups.'
      ]
    }
  },
  {
    id: 'jaccard-hamming',
    title: 'Jaccard Index & Hamming Distance',
    subtitle: 'Set Overlap & Bitwise XOR Proximity for Categorical & Binary Vectors',
    sectionId: 'distance-metrics',
    sectionTitle: 'Distance & Similarity Metrics',
    level: 'Foundational',
    tags: ['Sets', 'Bitwise', 'MinHash', 'Deduplication', 'Information Retrieval'],
    llmAntiPattern: {
      scenario: 'Sending pairs of article scraped text to an LLM to check if one is a duplicate or scraped copy of the other.',
      whyItFails: 'Reading 10,000 words in an LLM costs significant tokens. MinHash with Jaccard similarity solves near-duplicate detection in microseconds.',
      tcoComparison: {
        specialized: { latency: '0.01ms (Bitwise POPCNT)', costPerMillion: '$0.00', determinism: 'Mathematically Exact' },
        llmAlternative: { latency: '2,500ms', costPerMillion: '$10,000', determinism: 'Prone to False Positives' }
      }
    },
    intuition: {
      summary: 'Jaccard measures the ratio of the intersection over union of two sets. Hamming distance counts the number of positions at which corresponding symbols differ.',
      keyPoints: [
        'Jaccard Similarity = |A intersect B| / |A union B|. Bounded strictly between 0 and 1.',
        'Jaccard Distance = 1 - Jaccard Similarity (a mathematically rigorous metric obeying Triangle Inequality).',
        'Hamming Distance between binary vectors is computed in 1 CPU cycle using bitwise XOR followed by a hardware POPCNT (population count) instruction.'
      ],
      detailedExplanation: 'When tokenizing documents into sets of n-gram shingles, the Jaccard similarity between the sets directly reflects document overlap. MinHash (Locality Sensitive Hashing) approximates Jaccard similarity by comparing hashed minimum values, enabling web-scale deduplication.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    subgraph Jaccard Similarity
        A["Set A: {apple, banana, cherry}"] --- Intersect["Intersection: {banana}"]
        B["Set B: {banana, date, fig}"] --- Intersect
        Union["Union: {apple, banana, cherry, date, fig} (Size 5)"]
    end
    style Intersect fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Union fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff`,
      caption: 'Jaccard: Size of intersection (1) divided by size of union (5) = 0.20.'
    },
    mathematics: {
      coreFormula: 'J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|} = \\frac{|A \\cap B|}{|A| + |B| - |A \\cap B|}, \\quad d_H(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^n \\mathbb{I}(x_i \\neq y_i)',
      variableDefinitions: [
        { symbol: 'A, B', meaning: 'Arbitrary discrete sets of elements or n-gram shingles' },
        { symbol: 'J(A, B)', meaning: 'Jaccard similarity coefficient \\in [0, 1]' },
        { symbol: 'd_H', meaning: 'Hamming distance (number of bit flips or mismatches)' }
      ],
      derivationOrIntuition: 'For binary vectors u, v: J(u, v) = (u . v) / (||u||_1 + ||v||_1 - (u . v)). Hamming distance can be written as ||u - v||_1 for binary vectors, directly evaluated as popcount(u ^ v).'
    },
    engineeringCriteria: {
      whenToUse: [
        'Near-duplicate document detection across massive web crawls (MinHash).',
        'Recommender user basket overlap and categorical feature co-occurrence.',
        'Network error correction codes and perceptual image hashing (pHash).'
      ],
      whenToAvoid: [
        'When word order, grammar, or word frequency is critical to meaning.'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(|A| + |B|) with hash sets, or O(1) bitwise XOR with 64-bit integer bitmasks',
        space: 'O(|A| + |B|)'
      }
    },
    codeRecipe: {
      framework: 'Python (Sets & Bitwise)',
      code: `def jaccard_similarity(set_a, set_b):
    intersection = len(set_a.intersection(set_b))
    union = len(set_a.union(set_b))
    return float(intersection / union) if union != 0 else 1.0

def binary_hamming_distance(int_a, int_b):
    # Bitwise XOR shows 1s where bits differ, bin().count('1') counts them
    return (int_a ^ int_b).bit_count()`,
      explanation: 'Uses Python native set intersections and the hardware-accelerated bit_count() instruction.'
    },
    principalInterviewFocus: {
      question: 'How does MinHash mathematically guarantee that the probability of two signatures matching equals their exact Jaccard similarity?',
      insight: 'Given a random permutation of all elements in the universal set, let h(S) be the element from set S that appears first in the permutation. The probability that h(A) == h(B) is exactly the probability that the first element from A union B to appear belongs to A intersect B. Hence, P(h(A) == h(B)) = |A intersect B| / |A union B| = J(A, B). By repeating this across K hash functions (e.g. K=128), we compress any arbitrarily large document into 128 integers, reducing Jaccard similarity computation to counting identical integer positions.',
      failureModesInProduction: [
        'Short text snippets where set unions are small, causing Jaccard variance to spike wildly.'
      ]
    }
  },
  {
    id: 'mahalanobis-distance',
    title: 'Mahalanobis Distance',
    subtitle: 'Covariance-Adjusted Distance Metric for Multimodal & Correlated Feature Spaces',
    sectionId: 'distance-metrics',
    sectionTitle: 'Distance & Similarity Metrics',
    level: 'Core ML',
    tags: ['Statistics', 'Covariance', 'Anomaly Detection', 'Multivariate Normal'],
    llmAntiPattern: {
      scenario: 'Feeding multivariate telemetry data (CPU, memory, IOPS) to an LLM to detect if an incoming server metric is an anomalous outlier.',
      whyItFails: 'LLMs have no concept of multivariate feature covariance matrices and will flag false positives when correlated features naturally scale together.',
      tcoComparison: {
        specialized: { latency: '0.05ms', costPerMillion: '$0.00', determinism: 'Statistically Sound p-value' },
        llmAlternative: { latency: '2,200ms', costPerMillion: '$8,000', determinism: 'Hallucinated Anomaly Calls' }
      }
    },
    intuition: {
      summary: 'Mahalanobis distance measures the distance between a point and a distribution, taking into account the variance and correlations between features.',
      keyPoints: [
        'Euclidean distance assumes spherical, uncorrelated contours. Real features are correlated and elliptical.',
        'Mahalanobis normalizes each axis by its standard deviation and rotates the axes to remove covariance.',
        'A point can be physically close in Euclidean distance but statistically extreme in Mahalanobis distance if it violates feature correlation.'
      ],
      detailedExplanation: 'Imagine height and weight: they are positively correlated. A point with high height and low weight might be closer in Euclidean space to the center than a tall, heavy person, but Mahalanobis correctly identifies the tall, underweight individual as an extreme statistical outlier.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    subgraph Distance Contours
        EUC["Euclidean Contours: Rigid Circles (Ignores Correlation)"]
        MAH["Mahalanobis Contours: Tilted Ellipses (Follows Covariance Sigma)"]
    end
    style EUC fill:#1e293b,stroke:#f43f5e,stroke-width:1px,color:#fff
    style MAH fill:#1e293b,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Mahalanobis distance accounts for correlated dimensions by stretching along principal variance eigenvectors.'
    },
    mathematics: {
      coreFormula: 'D_M(\\mathbf{x}, \\boldsymbol{\\mu}) = \\sqrt{(\\mathbf{x} - \\boldsymbol{\\mu})^T \\boldsymbol{\\Sigma}^{-1} (\\mathbf{x} - \\boldsymbol{\\mu})}',
      variableDefinitions: [
        { symbol: '\\mathbf{x}', meaning: 'Observation vector of features' },
        { symbol: '\\boldsymbol{\\mu}', meaning: 'Mean vector of the multivariate distribution' },
        { symbol: '\\boldsymbol{\\Sigma}', meaning: 'Covariance matrix of the dataset' },
        { symbol: '\\boldsymbol{\\Sigma}^{-1}', meaning: 'Precision matrix (inverse covariance matrix)' }
      ],
      derivationOrIntuition: 'If features are uncorrelated with unit variance, Sigma is the identity matrix I, and Mahalanobis distance collapses exactly to Euclidean distance: sqrt((x - mu)^T (x - mu)).'
    },
    engineeringCriteria: {
      whenToUse: [
        'Multivariate anomaly detection in financial fraud, hardware telemetry, and industrial IoT.',
        'Linear Discriminant Analysis (LDA) classification boundaries.',
        'Outlier detection prior to training regression or neural models.'
      ],
      whenToAvoid: [
        'When sample size N is less than feature dimensions d (the covariance matrix becomes singular / non-invertible).'
      ],
      complexity: {
        timeTraining: 'O(d^3) to invert the covariance matrix Sigma',
        timeInference: 'O(d^2) matrix-vector multiplication',
        space: 'O(d^2) storing the precision matrix'
      }
    },
    codeRecipe: {
      framework: 'Python (NumPy / SciPy)',
      code: `import numpy as np
from scipy.spatial.distance import mahalanobis

def compute_mahalanobis(x, data_distribution):
    mean_vec = np.mean(data_distribution, axis=0)
    cov_matrix = np.cov(data_distribution, rowvar=False)
    # Pseudo-inverse handles near-singular matrices
    inv_cov = np.linalg.pinv(cov_matrix)
    
    return mahalanobis(x, mean_vec, inv_cov)`,
      explanation: 'Computes covariance, inverts using pseudo-inverse pinv() for stability, and calculates the squared deviation.'
    },
    principalInterviewFocus: {
      question: 'What is the Chi-Square connection to squared Mahalanobis distance, and how do you handle ill-conditioned or singular covariance matrices in production?',
      insight: 'For a p-dimensional multivariate normal distribution, the squared Mahalanobis distance D_M^2 follows a Chi-Square distribution with p degrees of freedom: D_M^2 ~ chi^2(p). This provides an exact analytical p-value for anomaly detection (e.g. chi2.ppf(0.999, df=p)). In production, if features are collinear or N < p, Sigma is non-invertible. We use Ledoit-Wolf shrinkage or Ridge regularization: Sigma_reg = (1 - alpha) * Sigma + alpha * trace(Sigma)/p * I, which guarantees a well-conditioned, strictly positive-definite matrix.',
      failureModesInProduction: [
        'Matrix inversion instability causing NaN/inf when collinear features are added to telemetry pipelines.'
      ]
    }
  }
];
