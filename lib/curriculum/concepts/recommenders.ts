import { Concept } from '../types';

export const RECOMMENDER_CONCEPTS: Concept[] = [
  {
    id: 'matrix-factorization',
    title: 'Matrix Factorization & SVD (ALS)',
    subtitle: 'Latent Factor Decomposition with Alternating Least Squares & Implicit Feedback',
    sectionId: 'recommender-systems',
    sectionTitle: 'Recommenders & Collaborative Filtering',
    level: 'Core ML',
    tags: ['Recommenders', 'SVD', 'ALS', 'Latent Factors', 'Netflix Prize'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM with a user’s historical watch history of 500 movies and asking it to rank 100,000 catalog candidates.',
      whyItFails: 'LLMs cannot perform dot products across 100k candidate vectors in real time, cost thousands in token context, and suffer from recency bias.',
      tcoComparison: {
        specialized: { latency: '0.2ms (Dot product lookup)', costPerMillion: '$0.00', determinism: 'Optimal Latent Factor Match' },
        llmAlternative: { latency: '4,000ms', costPerMillion: '$18,000', determinism: 'Popularity-Biased Hallucinations' }
      }
    },
    intuition: {
      summary: 'Matrix Factorization decomposes a sparse User-Item interaction matrix R into the product of two dense, low-rank matrices: a User Latent Matrix U and an Item Latent Matrix V.',
      keyPoints: [
        'The Netflix Prize gold-standard algorithm (Funk SVD / Koren et al.).',
        'Discovers hidden latent concepts (e.g., action intensity, humor, pacing) without requiring manual item tags.',
        'The predicted preference of user u for item i is the simple dot product: r_ui = u_u^T v_i.',
        'Alternating Least Squares (ALS) solves the non-convex optimization by holding U fixed to solve V (quadratic OLS), then holding V fixed to solve U.'
      ],
      detailedExplanation: 'Real-world interaction matrices (clicks, views, purchases) are over 99.9% sparse. Matrix factorization projects both users and items into a shared k-dimensional embedding space (e.g. k=64), enabling instant dot-product scoring and top-K candidate retrieval.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    R["Sparse Matrix R (|U| x |I|)"] --> Approx["Approximate Deconstruction: R ~ U * V^T"]
    Approx --> U["User Latent Matrix U (|U| x k)"]
    Approx --> V["Item Latent Matrix V (|I| x k)"]
    U --> Dot["Dot Product: u_u^T v_i"]
    V --> Dot
    Dot --> Pred["Predicted Affinity Score (0.05ms)"]
    style R fill:#1e293b,stroke:#818cf8,stroke-width:2px,color:#fff
    style U fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style V fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Pred fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'Decomposing a massive sparse interaction matrix into dense low-rank user and item latent vectors.'
    },
    mathematics: {
      coreFormula: '\\min_{\\mathbf{U}, \\mathbf{V}} \\sum_{(u, i) \\in \\mathcal{K}} (r_{ui} - \\mathbf{u}_u^T \\mathbf{v}_i)^2 + \\lambda (\\|\\mathbf{u}_u\\|_2^2 + \\|\\mathbf{v}_i\\|_2^2)',
      variableDefinitions: [
        { symbol: 'r_{ui}', meaning: 'Observed rating or interaction strength between user u and item i' },
        { symbol: '\\mathbf{u}_u', meaning: 'Latent feature vector of user u (length k)' },
        { symbol: '\\mathbf{v}_i', meaning: 'Latent feature vector of item i (length k)' },
        { symbol: '\\mathcal{K}', meaning: 'Set of known/observed user-item interactions' },
        { symbol: '\\lambda', meaning: 'L2 regularization hyperparameter to prevent overfitting' }
      ],
      derivationOrIntuition: 'For implicit feedback (Hu, Koren, Volinsky), confidence c_{ui} = 1 + alpha * r_{ui} weights the loss, and every unobserved pair is treated as a zero preference with low confidence, solved efficiently via ALS.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Candidate generation (retrieval stage) in e-commerce, streaming, and social media recommendation engines.',
        'Collaborative filtering with explicit ratings (stars) or implicit signals (clicks, watch time).',
        'Cold-start item similarity (using item latent vectors V).'
      ],
      whenToAvoid: [
        'Zero-interaction cold start for brand new users or items (use content-based or two-tower models with metadata features).'
      ],
      complexity: {
        timeTraining: 'O(iterations * (|E| * k + (|U| + |I|) * k^3)) via parallel ALS',
        timeInference: 'O(k) dot product; O(log |I|) using Approximate Nearest Neighbors (MIPS / HNSW)',
        space: 'O((|U| + |I|) * k) storing embeddings'
      }
    },
    codeRecipe: {
      framework: 'Python (implicit / scipy)',
      code: `import implicit
import scipy.sparse as sp

# Create sparse CSR user-item interaction matrix
user_item_matrix = sp.csr_matrix((ratings, (user_ids, item_ids)))

# Alternating Least Squares (ALS) model
model = implicit.als.AlternatingLeastSquares(
    factors=64,
    regularization=0.05,
    iterations=20,
    random_state=42
)

# Train on implicit feedback (uses multi-threaded C++/BLAS)
model.fit(user_item_matrix)

# Recommend top 10 items for user 42
ids, scores = model.recommend(42, user_item_matrix[42], N=10)`,
      explanation: 'Fits ALS matrix factorization on implicit interaction signals and retrieves top-10 items via fast vector dot products.'
    },
    principalInterviewFocus: {
      question: 'How do you bridge Matrix Factorization to real-time serving using Maximum Inner Product Search (MIPS), and what is the difference between explicit vs implicit ALS?',
      insight: 'Once U and V are trained, finding the top items for user u is argmax_i (u_u^T v_i). Running this across 10M items naively takes O(|I| * k). We load item vectors V into an Approximate Nearest Neighbors (ANN) index like FAISS or HNSW using Maximum Inner Product Search (MIPS) to retrieve top candidates in < 1ms. For feedback: Explicit ALS only trains on observed ratings (e.g. 1-5 stars) and ignores missing entries. Implicit ALS (clicks, purchases) cannot ignore missing entries because absence of a click is weak negative feedback; it introduces a confidence matrix C_ui = 1 + alpha * P_ui where all unobserved pairs are treated as negative with low baseline confidence.',
      failureModesInProduction: [
        'Popularity bias (the "Harry Potter problem") where popular items dominate all recommendation lists without personalization.'
      ]
    }
  },
  {
    id: 'two-tower-recommenders',
    title: 'Two-Tower Neural Recommenders',
    subtitle: 'Dual-Encoder Query & Candidate Networks for Billions of Interactions',
    sectionId: 'recommender-systems',
    sectionTitle: 'Recommenders & Collaborative Filtering',
    level: 'Principal Specialist',
    tags: ['Deep Learning', 'Recommenders', 'Dual-Encoder', 'Vector Search', 'Candidate Generation'],
    llmAntiPattern: {
      scenario: 'Deploying an LLM as a live recommendation ranking engine evaluating every candidate item sequentially with a prompt.',
      whyItFails: 'LLMs cannot score 1,000,000 items in real time. Two-Tower models separate candidate computation offline, enabling instant millisecond vector retrieval.',
      tcoComparison: {
        specialized: { latency: '2ms (ANN index)', costPerMillion: '$0.00', determinism: '100% Vector Metric' },
        llmAlternative: { latency: '5,000ms', costPerMillion: '$35,000', determinism: 'Slow & Unscalable' }
      }
    },
    intuition: {
      summary: 'Two-Tower networks use two separate neural networks: a User Tower that maps user context into an embedding space, and an Item Tower that maps candidate features into the exact same space.',
      keyPoints: [
        'Decouples candidate encoding from user query encoding: millions of items are encoded offline once and cached in an ANN vector database.',
        'At runtime, only the User Tower executes (e.g., in 1ms) to produce query vector q_u.',
        'Nearest item candidates are retrieved via vector dot product: score = q_u . v_i.',
        'Trained using In-Batch Negative Cross-Entropy Loss to handle billions of interactions without manual negative sampling.'
      ],
      detailedExplanation: 'Unlike matrix factorization which only uses static IDs, Two-Tower models ingest rich multimodal features: user demographics, past click sequence, device, location, item title, categories, and images. The towers independently map heterogeneous inputs into a shared 128-dimensional metric space.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    User["User Features (History, Device, Context)"] --> UTower["User Neural Tower (Online: 1ms)"]
    Item["Item Features (Metadata, Text, Image)"] --> ITower["Item Neural Tower (Offline Cached)"]
    UTower --> QVec["User Vector q_u"]
    ITower --> IVec["Item Vector v_i (in Vector DB)"]
    QVec --> MIPS["Cosine / Inner Product Search (FAISS/HNSW: 0.5ms)"]
    IVec --> MIPS
    MIPS --> TopK["Top-K Candidate Items"]
    style UTower fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style ITower fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style MIPS fill:#1e293b,stroke:#f59e0b,stroke-width:3px,color:#fff`,
      caption: 'Two-Tower Architecture: Item vectors are pre-computed offline; only the User Tower runs at query time.'
    },
    mathematics: {
      coreFormula: 'P(i \\mid u) = \\frac{\\exp(\\mathbf{u}(\\mathbf{x}_u)^T \\mathbf{v}(\\mathbf{y}_i) / \\tau)}{\\sum_{j \\in \\mathcal{B}} \\exp(\\mathbf{u}(\\mathbf{x}_u)^T \\mathbf{v}(\\mathbf{y}_j) / \\tau)}',
      variableDefinitions: [
        { symbol: '\\mathbf{u}(\\mathbf{x}_u)', meaning: 'User Tower embedding output vector for user features x_u' },
        { symbol: '\\mathbf{v}(\\mathbf{y}_i)', meaning: 'Item Tower embedding output vector for item features y_i' },
        { symbol: '\\tau', meaning: 'Temperature parameter scaling the logits' },
        { symbol: '\\mathcal{B}', meaning: 'Mini-batch of candidates (using other batch items as implicit negatives)' }
      ],
      derivationOrIntuition: 'In-batch negative sampling allows training on a batch of B interactions where for each user u_b, item i_b is the positive target and all other B-1 items in the batch serve as negative samples, computing B^2 pairwise dot products in a single GPU matrix multiplication.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Candidate generation at massive scale (YouTube, TikTok, Netflix, Instagram Explore).',
        'Retrieving top-1000 items out of 100,000,000 in under 5ms.',
        'Incorporating dynamic contextual features (time of day, network speed, current location).'
      ],
      whenToAvoid: [
        'Final stage precision re-ranking of top 50 items (use Cross-Encoders or heavy DLRM/GBDTs where user-item feature interactions can cross).'
      ],
      complexity: {
        timeTraining: 'O(B * d) forward pass per batch with high GPU tensor core efficiency',
        timeInference: 'User Tower forward pass (1ms) + ANN index lookup (0.5ms) = ~1.5ms end-to-end',
        space: 'O(|I| * d) storing the item vector ANN index'
      }
    },
    codeRecipe: {
      framework: 'Python (PyTorch)',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class TwoTowerModel(nn.Module):
    def __init__(self, user_feature_dim, item_feature_dim, embed_dim=128):
        super().__init__()
        self.user_tower = nn.Sequential(
            nn.Linear(user_feature_dim, 256),
            nn.ReLU(),
            nn.Linear(256, embed_dim)
        )
        self.item_tower = nn.Sequential(
            nn.Linear(item_feature_dim, 256),
            nn.ReLU(),
            nn.Linear(256, embed_dim)
        )
        
    def forward(self, user_feats, item_feats):
        # L2-normalize embeddings to use cosine similarity directly
        u_emb = F.normalize(self.user_tower(user_feats), p=2, dim=1)
        i_emb = F.normalize(self.item_tower(item_feats), p=2, dim=1)
        return u_emb, i_emb

    def compute_in_batch_loss(self, u_emb, i_emb, temperature=0.07):
        # Compute B x B similarity matrix
        logits = torch.matmul(u_emb, i_emb.T) / temperature
        labels = torch.arange(u_emb.size(0), device=u_emb.device)
        return F.cross_entropy(logits, labels)`,
      explanation: 'Implements dual neural towers with L2 normalization and in-batch cross-entropy contrastive loss.'
    },
    principalInterviewFocus: {
      question: 'What is the fundamental architectural limitation of the Two-Tower model compared to a Cross-Network / DLRM, and how do industrial systems pipeline them?',
      insight: 'The fundamental limitation is the late interaction assumption: user features and item features cannot interact until the final dot product. Cross-features (e.g. "Does the user live in the same city where the item is sold?") cannot be learned by the individual towers. To solve this, industrial systems use a multi-stage funnel: Stage 1 (Candidate Retrieval): Two-Tower model scans 100M items down to 1,000 candidates in 3ms using ANN vector search. Stage 2 (Fine Re-Ranking): A Deep & Cross Network (DCN-v2) or Transformer cross-attends over all pairwise feature interactions to rank the top 20 items with micro-precision.',
      failureModesInProduction: [
        'Stale item embeddings when item metadata changes; requires streaming incremental vector index updates to the vector database.'
      ]
    }
  }
];
