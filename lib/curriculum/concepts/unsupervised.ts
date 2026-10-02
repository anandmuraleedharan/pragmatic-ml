import { Concept } from '../types';

export const UNSUPERVISED_CONCEPTS: Concept[] = [
  {
    id: 'pca',
    title: 'Principal Component Analysis (PCA)',
    subtitle: 'Orthogonal Variance Maximization via Covariance Eigendecomposition & SVD',
    sectionId: 'classical-unsupervised',
    sectionTitle: 'Unsupervised & Dimensionality Reduction',
    level: 'Foundational',
    tags: ['Linear Algebra', 'Dimensionality Reduction', 'Eigendecomposition', 'SVD', 'Unsupervised'],
    llmAntiPattern: {
      scenario: 'Pasting 500 numerical tabular features into an LLM prompt to ask: "Summarize the 3 most important dimensions of variation in this customer data".',
      whyItFails: 'LLMs cannot compute covariance matrices or matrix singular value decompositions (SVD). PCA extracts the exact mathematical orthogonal axes of maximum variance in 5ms.',
      tcoComparison: {
        specialized: { latency: '4ms (LAPACK SVD)', costPerMillion: '$0.00', determinism: 'Analytically Exact Vectors' },
        llmAlternative: { latency: '3,500ms', costPerMillion: '$14,000', determinism: 'Hallucinated Numerical Projections' }
      }
    },
    intuition: {
      summary: 'PCA rotates the coordinate axes to point along the directions of maximum data spread (variance), ensuring each new principal component is completely uncorrelated (orthogonal) to the others.',
      keyPoints: [
        'Component 1 captures the largest possible variance in the dataset.',
        'Component 2 captures the second largest variance while being strictly orthogonal to Component 1.',
        'Allows compressing a 500-dimensional dataset down to 20 dimensions while preserving 95%+ of information.',
        'Solved efficiently via Singular Value Decomposition (SVD) on the centered data matrix X.'
      ],
      detailedExplanation: 'Data is first zero-centered. Computing the eigenvectors of the empirical covariance matrix Sigma = (1/N) X^T X yields the principal directions. The corresponding eigenvalues lambda_i quantify exactly how much variance is explained by each component.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Origin((Center 0,0)) -->|Principal Component 1 (Largest Variance)| PC1["PC1 Eigenvector (Angle of Max Spread)"]
    Origin -->|Principal Component 2 (Orthogonal)| PC2["PC2 Eigenvector (90 deg to PC1)"]
    style Origin fill:#0f172a,stroke:#64748b,stroke-width:2px,color:#fff
    style PC1 fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style PC2 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'PCA identifies the orthogonal axes of maximal spread, allowing projection onto lower-dimensional subspaces.'
    },
    mathematics: {
      coreFormula: '\\boldsymbol{\\Sigma} = \\frac{1}{N} \\mathbf{X}_c^T \\mathbf{X}_c = \\mathbf{V} \\boldsymbol{\\Lambda} \\mathbf{V}^T, \\quad \\mathbf{Z} = \\mathbf{X}_c \\mathbf{V}_k',
      variableDefinitions: [
        { symbol: '\\mathbf{X}_c', meaning: 'Mean-centered feature matrix (shape N x d)' },
        { symbol: '\\boldsymbol{\\Sigma}', meaning: 'Covariance matrix (shape d x d)' },
        { symbol: '\\mathbf{V}', meaning: 'Matrix of orthonormal eigenvectors (principal axes)' },
        { symbol: '\\boldsymbol{\\Lambda}', meaning: 'Diagonal matrix of eigenvalues (variances)' },
        { symbol: '\\mathbf{Z}', meaning: 'Low-dimensional projection matrix (shape N x k)' }
      ],
      derivationOrIntuition: 'Singular Value Decomposition (SVD) of centered data X_c = U S V^T directly yields the principal component directions V without ever explicitly computing the huge d x d covariance matrix, saving massive memory.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Denoising signals and removing collinearity before training linear or regression models.',
        'Compressing high-dimensional embeddings for faster retrieval and lower storage footprints.',
        'Visualizing multi-dimensional tabular datasets in 2D or 3D scatter plots.'
      ],
      whenToAvoid: [
        'Complex non-linear manifolds (e.g., Swiss roll dataset) where linear projections crush structural geometry (use t-SNE or UMAP).'
      ],
      complexity: {
        timeTraining: 'O(d^3) or O(N * d * min(N, d)) via truncated randomized SVD',
        timeInference: 'O(k * d) projection matrix-vector multiplication',
        space: 'O(k * d) storing the projection matrix V_k'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# StandardScaler is mandatory: PCA without standardization biases to largest scale
pca_pipe = make_pipeline(
    StandardScaler(),
    PCA(n_components=0.95) # Retain 95% of total variance automatically
)

X_reduced = pca_pipe.fit_transform(X_train)
explained_var = pca_pipe.named_steps['pca'].explained_variance_ratio_
print(f"Compressed from {X_train.shape[1]} to {X_reduced.shape[1]} dimensions")`,
      explanation: 'Applies standardization and truncated PCA to retain 95% of total dataset variance.'
    },
    principalInterviewFocus: {
      question: 'Why must data be centered before computing PCA, and what is the mathematical link between SVD on X and Eigendecomposition of X^T X?',
      insight: 'If data is not zero-centered, the first principal component will point directly toward the data mean vector rather than along the direction of maximum variance, distorting all subsequent orthogonal projections. For the connection: Let X = U S V^T. Then X^T X = (V S^T U^T)(U S V^T) = V S^2 V^T. Comparing this to the eigendecomposition of the covariance matrix Sigma = V Lambda V^T, the right singular vectors V of X are identical to the eigenvectors of X^T X, and the eigenvalues relate directly to singular values: lambda_i = s_i^2 / N. Randomized SVD allows computing the top-k components in O(N * d * k) time without ever materializing X^T X.',
      failureModesInProduction: [
        'Failing to standardize features with different measurement units, causing the feature with the largest numerical magnitude to dictate 99% of the projection.'
      ]
    }
  },
  {
    id: 'kmeans',
    title: 'K-Means & K-Means++ Clustering',
    subtitle: 'Expectation-Maximization Centroid Partitioning & Probabilistic Seeding',
    sectionId: 'classical-unsupervised',
    sectionTitle: 'Unsupervised & Dimensionality Reduction',
    level: 'Foundational',
    tags: ['Clustering', 'Lloyd Algorithm', 'K-Means++', 'Voronoi', 'Vector Quantization'],
    llmAntiPattern: {
      scenario: 'Pasting 20,000 customer transaction records into an LLM prompt and asking it to group them into 5 distinct behavioral personas.',
      whyItFails: 'LLMs exceed context window token limits, hallucinate clusters, cannot enforce convergence, and cost significant money. K-Means runs in 50ms.',
      tcoComparison: {
        specialized: { latency: '40ms', costPerMillion: '$0.00', determinism: 'Convergently Proven Local Minimum' },
        llmAlternative: { latency: '6,000ms', costPerMillion: '$25,000', determinism: 'Hallucinated Incoherent Groupings' }
      }
    },
    intuition: {
      summary: 'K-Means partitions data into k non-overlapping clusters by iteratively assigning each point to its closest centroid and then updating centroids to the mean of assigned points.',
      keyPoints: [
        'Alternates between two steps: Assignment Step (find closest centroid) and Update Step (recompute means).',
        'Guaranteed to converge monotonically to a local minimum of Within-Cluster Sum of Squares (WCSS / Inertia).',
        'K-Means++ seeding spreads initial centroids apart with probability proportional to squared distance, preventing poor initializations.',
        'Assumes clusters are spherical and roughly equal in size.'
      ],
      detailedExplanation: 'Lloyd’s algorithm minimizes WCSS = sum ||x - mu_k||^2. The Elbow Method plots WCSS against k to find the point of diminishing returns, while the Silhouette Score evaluates how well-separated clusters are.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Init["1. K-Means++: Seed k Centroids (D^2 Probability)"] --> Assign["2. Assign: Map each point to closest centroid"]
    Assign --> Update["3. Update: mu_k = Mean of points in cluster k"]
    Update --> Check{"Centroids moved?"}
    Check -->|Yes| Assign
    Check -->|No (Converged)| Done["4. Final Voronoi Clusters"]
    style Init fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Assign fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff
    style Update fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff
    style Done fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Lloyd iteration: Alternating between closest centroid assignment and centroid mean updating until convergence.'
    },
    mathematics: {
      coreFormula: '\\arg\\min_{\\mathbf{S}} \\sum_{i=1}^k \\sum_{\\mathbf{x} \\in S_i} \\|\\mathbf{x} - \\boldsymbol{\\mu}_i\\|_2^2, \\quad \\boldsymbol{\\mu}_i = \\frac{1}{|S_i|} \\sum_{\\mathbf{x} \\in S_i} \\mathbf{x}',
      variableDefinitions: [
        { symbol: 'k', meaning: 'Number of clusters specified a priori' },
        { symbol: 'S_i', meaning: 'Set of points assigned to cluster i' },
        { symbol: '\\boldsymbol{\\mu}_i', meaning: 'Centroid (mean vector) of cluster i' },
        { symbol: 'P(x)', meaning: 'K-Means++ seeding probability: \\frac{D(x)^2}{\\sum_{x\'} D(x\')^2}' }
      ],
      derivationOrIntuition: 'Arthur & Vassilvitskii proved that K-Means++ initialization achieves an O(log k) approximation ratio to the optimal clustering solution, eliminating disastrous local minima traps.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Customer segmentation and behavioral grouping across large databases.',
        'Product quantization (PQ) in vector search indices (FAISS) to compress dense embeddings.',
        'Image color quantization / compression.'
      ],
      whenToAvoid: [
        'Non-globular, concentric, or arbitrary density shapes (use DBSCAN or Spectral Clustering).',
        'Data with extreme outliers (outliers pull means away; use K-Medoids / PAM instead).'
      ],
      complexity: {
        timeTraining: 'O(k * N * d * iterations) - sub-second with Mini-Batch K-Means',
        timeInference: 'O(k * d) to assign new point to closest centroid',
        space: 'O(k * d) storing centroid vectors'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# KMeans with K-Means++ smart centroid initialization
kmeans = KMeans(
    n_clusters=5,
    init='k-means++',
    n_init=10,
    max_iter=300,
    random_state=42
)

cluster_labels = kmeans.fit_predict(X)
centroids = kmeans.cluster_centers_

# Evaluate clustering quality
score = silhouette_score(X, cluster_labels)
print(f"Silhouette Score: {score:.3f}")`,
      explanation: 'Fits K-Means with K-Means++ initialization, returning cluster assignments and silhouette separation quality.'
    },
    principalInterviewFocus: {
      question: 'How does Mini-Batch K-Means enable clustering on billion-scale datasets, and how is K-Means used in Inverted File with Product Quantization (IVF-PQ) for vector search?',
      insight: 'Mini-Batch K-Means processes small random subsets (e.g. batch size 1024) per iteration, updating centroids using an exponential moving average. This reduces RAM requirements and converges 10x faster with virtually zero loss in clustering quality. In IVF-PQ vector search: K-Means first clusters the vector space into K coarse Voronoi cells (e.g. K=4096). During search, queries only inspect the closest coarse cells (Inverted File). Then, within each cell, residual vectors are sliced into sub-vectors and quantized using secondary K-Means codebooks (Product Quantization), compressing 1536-dim vectors into 64 bytes with blazing SIMD inner-product evaluation.',
      failureModesInProduction: [
        'Empty cluster collapse when all points leave a cluster, requiring re-seeding the empty centroid with the point having the highest residual error.'
      ]
    }
  },
  {
    id: 'dbscan',
    title: 'DBSCAN & Density-Based Clustering',
    subtitle: 'Density-Reachability, Core Points & Automatic Outlier / Noise Isolation',
    sectionId: 'classical-unsupervised',
    sectionTitle: 'Unsupervised & Dimensionality Reduction',
    level: 'Core ML',
    tags: ['Clustering', 'Density', 'Anomaly Detection', 'Noise', 'Spatial'],
    llmAntiPattern: {
      scenario: 'Asking an LLM to identify geometric GPS cluster hotspots and filter out random GPS noise pings from delivery drivers.',
      whyItFails: 'LLMs cannot compute epsilon-neighborhood densities or spatial reachability trees; DBSCAN solves this in milliseconds without requiring k to be pre-specified.',
      tcoComparison: {
        specialized: { latency: '15ms (BallTree)', costPerMillion: '$0.00', determinism: 'Exact Density Reachability' },
        llmAlternative: { latency: '4,000ms', costPerMillion: '$18,000', determinism: 'Random Spatial Hallucinations' }
      }
    },
    intuition: {
      summary: 'DBSCAN discovers clusters of arbitrary shapes by grouping points located in dense neighborhoods and flagging low-density points as noise/outliers.',
      keyPoints: [
        'Does not require specifying the number of clusters (k) in advance.',
        'Can discover complex concave shapes, rings, and non-linear patterns that K-Means completely fails on.',
        'Core Point: Has at least minPts points within distance eps.',
        'Border Point: Within eps of a core point but has fewer than minPts neighbors.',
        'Noise Point: Neither a core nor border point (labeled as -1 outlier).'
      ],
      detailedExplanation: 'Starting from an unvisited core point, DBSCAN recursively expands the cluster by adding all density-reachable points. Once the connected dense region is exhausted, it moves to the next unvisited core point.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Core["Core Point (>= minPts within eps)"] -->|Within eps| Border["Border Point (< minPts within eps)"]
    Core -->|Within eps| Core2["Core Point 2"]
    Noise["Isolated Point (< minPts, no core neighbor)"] --> Outlier["Flagged as Noise: -1 (Outlier)"]
    style Core fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Core2 fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Border fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Noise fill:#e11d48,stroke:#fda4af,stroke-width:2px,color:#fff`,
      caption: 'DBSCAN classification: Core points expand clusters, border points seal boundaries, and isolated points are labeled noise.'
    },
    mathematics: {
      coreFormula: 'N_\\epsilon(p) = \\{q \\in D \\mid \\text{dist}(p, q) \\le \\epsilon\\}, \\quad |N_\\epsilon(p)| \\ge \\text{minPts}',
      variableDefinitions: [
        { symbol: '\\epsilon', meaning: 'Epsilon radius defining neighborhood distance' },
        { symbol: '\\text{minPts}', meaning: 'Minimum number of neighbors required to form a dense core' },
        { symbol: 'N_\\epsilon(p)', meaning: 'The epsilon-neighborhood of point p' }
      ],
      derivationOrIntuition: 'Density-connectedness is an equivalence relation on core points: if p is density-connected to q, and q is density-connected to r, then p is density-connected to r. This mathematical transitivity guarantees unique, deterministic clusters for a fixed eps and minPts.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Geospatial anomaly detection, ride-hailing pickup hotspots, delivery tracking.',
        'Clustering arbitrary curved or non-linear geometric structures.',
        'Automatic outlier rejection where data contains heavy sensor or network noise.'
      ],
      whenToAvoid: [
        'Datasets with widely varying densities across clusters (use HDBSCAN instead).',
        'High dimensions where distance concentration makes choosing a single eps impossible.'
      ],
      complexity: {
        timeTraining: 'O(N log N) using spatial trees (KD-Tree / BallTree), or O(N^2) brute force',
        timeInference: 'Instance-based clustering',
        space: 'O(N) storing visited states and neighborhoods'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.cluster import DBSCAN
import numpy as np

# eps=0.5, min_samples=5; metric='euclidean'
db = DBSCAN(eps=0.5, min_samples=5, algorithm='ball_tree')
labels = db.fit_predict(X)

# Number of clusters (excluding noise label -1)
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = np.sum(labels == -1)

print(f"Discovered {n_clusters} clusters with {n_noise} noise outliers")`,
      explanation: 'Applies DBSCAN with BallTree spatial acceleration, automatically isolating noise points with label -1.'
    },
    principalInterviewFocus: {
      question: 'Why does standard DBSCAN struggle with clusters of varying densities, and how does HDBSCAN (Hierarchical DBSCAN) solve this?',
      insight: 'DBSCAN uses a single global epsilon threshold. If one cluster is dense (points 0.1 apart) and another is sparse (points 2.0 apart), choosing eps=0.2 treats the sparse cluster entirely as noise; choosing eps=2.5 merges both clusters into one monolithic blob. HDBSCAN resolves this by transforming the space using mutual reachability distance d_mreach(a, b) = max(core_dist(a), core_dist(b), d(a, b)), constructing a minimum spanning tree over all points, and building a cluster hierarchy across all epsilon values. It then extracts stable clusters using excess-of-mass density over the tree hierarchy.',
      failureModesInProduction: [
        'Setting minPts too low on noisy telemetry, causing random outlier pairs to be falsely promoted to real clusters.'
      ]
    }
  },
  {
    id: 'tsne-umap',
    title: 't-SNE & UMAP',
    subtitle: 'Non-Linear Manifold Learning, Student-t Kernels & Fuzzy Simplicial Sets',
    sectionId: 'classical-unsupervised',
    sectionTitle: 'Unsupervised & Dimensionality Reduction',
    level: 'Core ML',
    tags: ['Manifold Learning', 'Visualization', 'Embeddings', 't-SNE', 'UMAP'],
    llmAntiPattern: {
      scenario: 'Asking an LLM to explain why two high-dimensional text embeddings from different topics are clustered together in 2D space.',
      whyItFails: 'LLMs have no visibility into the gradient optimization paths of non-linear projections and cannot analyze high-dimensional topological distances.',
      tcoComparison: {
        specialized: { latency: '150ms (UMAP)', costPerMillion: '$0.00', determinism: 'Mathematically Grounded Topology' },
        llmAlternative: { latency: '4,000ms', costPerMillion: '$15,000', determinism: 'Conjectural Reasoning' }
      }
    },
    intuition: {
      summary: 't-SNE and UMAP reduce high-dimensional embeddings to 2D or 3D for visualization by preserving the local neighborhood relationships of points rather than global linear variance.',
      keyPoints: [
        'Linear PCA fails on curved surfaces (manifolds); t-SNE and UMAP "unroll" complex high-dimensional non-linear shapes.',
        't-SNE converts Euclidean distances into conditional Gaussian probabilities in high dimensions and Student-t probabilities in low dimensions to solve the "crowding problem".',
        'UMAP (Uniform Manifold Approximation and Projection) is based on Riemannian geometry and fuzzy simplicial sets; it preserves both local and global structure much better than t-SNE and is 10x faster.',
        'Distances between distant clusters in t-SNE should never be interpreted literally; cluster sizes reflect perplexity settings.'
      ],
      detailedExplanation: 'In high dimensions, volume grows exponentially, meaning there is vastly more room for points to be neighbors than in 2D space. If you project points into 2D using a Gaussian, points crowd onto the center. The heavy tails of the Student-t distribution allow points to spread out naturally.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    HighDim["High-Dim Space (1536 Dimensions)"] --> ProbHigh["Compute Pairwise Similarities p_ij (Gaussian)"]
    LowDim["Low-Dim 2D Space"] --> ProbLow["Compute Pairwise Similarities q_ij (Student-t / Fuzzy Set)"]
    ProbHigh --> KL["Minimize Kullback-Leibler (KL) Divergence via SGD"]
    ProbLow --> KL
    KL --> Visual["Clean 2D Manifold Visualization"]
    style HighDim fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style LowDim fill:#1e293b,stroke:#818cf8,stroke-width:2px,color:#fff
    style KL fill:#0284c7,stroke:#34d399,stroke-width:3px,color:#fff
    style Visual fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 't-SNE / UMAP: Minimizing the divergence between high-dimensional and low-dimensional neighbor probabilities.'
    },
    mathematics: {
      coreFormula: 'p_{j|i} = \\frac{\\exp(-\\|\\mathbf{x}_i - \\mathbf{x}_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\neq i} \\exp(-\\|\\mathbf{x}_i - \\mathbf{x}_k\\|^2 / 2\\sigma_i^2)}, \\quad q_{ij} = \\frac{(1 + \\|\\mathbf{y}_i - \\mathbf{y}_j\\|^2)^{-1}}{\\sum_{k} \\sum_{l \\neq k} (1 + \\|\\mathbf{y}_k - \\mathbf{y}_l\\|^2)^{-1}}',
      variableDefinitions: [
        { symbol: 'p_{ij}', meaning: 'Symmetric joint probability that x_i and x_j are neighbors in high dimensions' },
        { symbol: 'q_{ij}', meaning: 'Probability of y_i and y_j being neighbors in 2D space (Student-t kernel with 1 DOF)' },
        { symbol: '\\text{KL}(P \\| Q)', meaning: 'Objective function minimized via gradient descent: \\sum_i \\sum_j p_{ij} \\log \\frac{p_{ij}}{q_{ij}}' }
      ],
      derivationOrIntuition: 'The asymmetric KL divergence heavily penalizes modeling distant points as nearby (if p_ij is small and q_ij is large, cost is modest; but if p_ij is large and q_ij is small, cost is astronomical). This guarantees that local neighborhoods are strictly preserved.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Visualizing deep neural network embedding spaces (BERT token embeddings, image features).',
        'Exploring high-dimensional single-cell RNA sequencing genomics clusters.',
        'Exploratory data analysis (EDA) to verify whether classes are separable before building models.'
      ],
      whenToAvoid: [
        'Using as general-purpose dimensionality reduction for downstream model training (t-SNE cannot project new unseen points out-of-sample; UMAP can, but can distort global metric distances).'
      ],
      complexity: {
        timeTraining: 'O(N^2) naive t-SNE; O(N log N) via Barnes-Hut or FFT (FIt-SNE); UMAP is O(N log N)',
        timeInference: 't-SNE cannot transform new points (transductive). UMAP supports approximate parametric transform.',
        space: 'O(N * k) storing k-NN graph'
      }
    },
    codeRecipe: {
      framework: 'Python (umap-learn / sklearn)',
      code: `import umap
from sklearn.manifold import TSNE

# UMAP preserves both local and global structure, and is 10x faster
reducer = umap.UMAP(
    n_neighbors=15,
    min_dist=0.1,
    n_components=2,
    metric='cosine',
    random_state=42
)

# Fit and transform high-dimensional embeddings
embedding_2d = reducer.fit_transform(high_dim_embeddings)`,
      explanation: 'Reduces 1536-dimensional embeddings to 2D using cosine distance with UMAP.'
    },
    principalInterviewFocus: {
      question: 'Why can t-SNE NOT project new out-of-sample data points, whereas UMAP can, and what is the Crowding Problem?',
      insight: 't-SNE optimizes the coordinates y_i of the training points directly using gradient descent over the KL divergence; it learns no parametric mapping function f(x) -> y. To project a new point, one must either re-run optimization over all N+1 points or use Parametric t-SNE (training a neural network to mimic coordinates). UMAP constructs an explicit fuzzy topological representation of the manifold using simplicial sets. When a new point arrives, it computes its simplex representation relative to the existing graph and optimizes its coordinates locally via coordinate descent. The Crowding Problem occurs because the ratio of volume of a sphere to its surface area collapses in lower dimensions; the heavy tails of the Student-t distribution resolve this by allowing moderate high-dimensional distances to map to much larger physical distances in 2D.',
      failureModesInProduction: [
        'Over-interpreting cluster distance or density in t-SNE plots without realizing that perplexity alters cluster sizes.'
      ]
    }
  }
];
