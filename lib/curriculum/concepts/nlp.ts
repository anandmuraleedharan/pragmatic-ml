import { Concept } from '../types';

export const NLP_CONCEPTS: Concept[] = [
  {
    id: 'gliner-ner',
    title: 'GLiNER (Generalist Lightweight NER)',
    subtitle: 'Bidirectional Transformer Encoder with Span Representations for Zero-Shot Open Entity Extraction',
    sectionId: 'classical-nlp',
    sectionTitle: 'Classical NLP & Information Extraction',
    level: 'Principal Specialist',
    tags: ['NER', 'Zero-Shot', 'Span Representations', 'Bi-Encoder', 'GLiNER', 'Entity Extraction'],
    llmAntiPattern: {
      scenario: 'Sending 5-page legal contracts to a 70B parameter LLM with a 500-token prompt: "Extract all companies, dates, and contract values in valid JSON with exact offsets".',
      whyItFails: 'LLMs hallucinate entity keys, fail on exact character offset spans, mangle JSON schemas on edge cases, stream tokens at 50 tokens/sec, and cost $0.03 per page.',
      tcoComparison: {
        specialized: { latency: '15ms (CPU/ONNX)', costPerMillion: '$0.00', determinism: '100% Deterministic Character Spans' },
        llmAlternative: { latency: '3,500ms', costPerMillion: '$12,000', determinism: 'Prone to Hallucinated JSON & Missed Spans' }
      }
    },
    intuition: {
      summary: 'GLiNER formulates Named Entity Recognition as a bidirectional span-representation task, allowing zero-shot entity extraction with arbitrary custom labels at 15ms latency.',
      keyPoints: [
        'Unlike legacy SpaCy models (which are locked to fixed training labels like PERSON/ORG), GLiNER accepts arbitrary label types on the fly at inference time.',
        'Encodes both the input text tokens and the target entity labels jointly into a shared bidirectional embedding space.',
        'Represents text spans as concatenated start and end token embeddings, computing similarity against label vectors.',
        'Runs in under 20ms on a single CPU core, producing exact character start and end offsets with confidence scores.'
      ],
      detailedExplanation: 'Traditional zero-shot NER with LLMs is slow, generative, and non-deterministic. GLiNER uses a compact encoder backbone (like DeBERTa-v3-small, ~150M parameters). It feeds input text and desired entity types (e.g., ["medication", "dosage", "adverse reaction"]) through a bidirectional transformer, scoring all valid candidate spans via dot-product matching against label embeddings.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Input["Input: 'Patient took 50mg Aspirin yesterday.'"] --> Enc["Bidirectional Transformer Encoder (DeBERTa)"]
    Labels["Labels: ['medication', 'dosage', 'date']"] --> Enc
    Enc --> Span["Span Representation: [h_start, h_end]"]
    Enc --> LabelVec["Label Representations: e_label"]
    Span --> Sim["Dot Product & Sigmoid Span Matching"]
    LabelVec --> Sim
    Sim --> Output["Exact Spans: '50mg' -> dosage, 'Aspirin' -> medication (15ms)"]
    style Enc fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Sim fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff
    style Output fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'GLiNER Architecture: Joint token and label encoding with span-representation matching.'
    },
    mathematics: {
      coreFormula: 's(i, j, l) = \\sigma\\left( \\mathbf{w}^T \\left[ \\mathbf{h}_i \\,;\\, \\mathbf{h}_j \\,;\\, \\mathbf{h}_i \\odot \\mathbf{h}_j \\right] \\cdot \\mathbf{e}_l \\right)',
      variableDefinitions: [
        { symbol: '\\mathbf{h}_i, \\mathbf{h}_j', meaning: 'Contextual token hidden states for span start i and span end j' },
        { symbol: '\\mathbf{e}_l', meaning: 'Normalized representation vector for target entity label l' },
        { symbol: 's(i, j, l)', meaning: 'Probability that span (i, j) corresponds to entity label l' },
        { symbol: '\\odot', meaning: 'Hadamard (element-wise) product capturing span interaction' }
      ],
      derivationOrIntuition: 'Trained using Binary Cross-Entropy loss over all candidate spans, penalizing non-entity spans and matching true entity spans to their target label embeddings.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Extracting domain-specific entities (medical drugs, financial metrics, legal clauses) with zero labeled training data.',
        'High-throughput document extraction pipelines requiring exact character-level offsets.',
        'Deploying edge microservices where GPU hosting is too expensive.'
      ],
      whenToAvoid: [
        'Massive paragraphs exceeding 512 tokens without sliding window chunking.'
      ],
      complexity: {
        timeTraining: 'Fine-tuned in hours on small labeled datasets',
        timeInference: '10ms to 25ms on CPU via ONNX Runtime',
        space: 'Compact model weights (~150MB to ~600MB)'
      }
    },
    codeRecipe: {
      framework: 'Python (gliner)',
      code: `from gliner import GLiNER

# Load lightweight pre-trained model (150MB)
model = GLiNER.from_pretrained("urchade/gliner_small-v2.1")

text = "Apple CEO Tim Cook announced the new M4 MacBook Pro in Cupertino yesterday."

# Arbitrary zero-shot labels defined on the fly!
labels = ["company", "executive", "hardware product", "city"]

# Predict entities with exact character offsets
entities = model.predict_entities(text, labels, threshold=0.4)

for entity in entities:
    print(f"{entity['text']} -> {entity['label']} (Confidence: {entity['score']:.2f}, [{entity['start']}:{entity['end']}])")`,
      explanation: 'Extracts custom entities in zero-shot fashion, returning exact text, label, confidence, and character span indices.'
    },
    principalInterviewFocus: {
      question: 'How does GLiNER overcome the catastrophic span combinatorial explosion O(L^2) in sequence length, and why does it beat autoregressive LLMs at span extraction?',
      insight: 'A naive span classifier over length L must evaluate L*(L+1)/2 candidate spans. GLiNER restricts maximum span length to a reasonable threshold K (e.g. K=12 tokens), reducing candidate spans from quadratic O(L^2) to linear O(K * L). Furthermore, LLMs generate text token-by-token using autoregressive generation, which causes error propagation, hallucinated spans, and token boundary mismatches when converting token indices back to raw character positions. GLiNER evaluates all spans simultaneously in a single forward pass over token representations, guaranteeing exact character span extraction without generation hallucinations.',
      failureModesInProduction: [
        'Overlapping nested entities (e.g. "Bank of America" vs "America") where span thresholding must incorporate non-maximum suppression (NMS).'
      ]
    }
  },
  {
    id: 'tfidf',
    title: 'TF-IDF (Term Frequency - Inverse Document Frequency)',
    subtitle: 'Statistical Term Importance Weighting for Sparse Document Vectors & Keyword Extraction',
    sectionId: 'classical-nlp',
    sectionTitle: 'Classical NLP & Information Extraction',
    level: 'Foundational',
    tags: ['NLP', 'Information Retrieval', 'TF-IDF', 'Sparse Vectors', 'Keywords'],
    llmAntiPattern: {
      scenario: 'Calling an LLM API to extract top 5 representative topic keywords from 100,000 blog articles.',
      whyItFails: 'Costs hundreds of dollars in API tokens and takes hours; TF-IDF extracts unique discriminative keywords across the entire corpus in seconds.',
      tcoComparison: {
        specialized: { latency: '0.08ms per doc', costPerMillion: '$0.00', determinism: 'Exact Statistical Importance' },
        llmAlternative: { latency: '1,500ms', costPerMillion: '$4,000', determinism: 'Subjective Word Suggestions' }
      }
    },
    intuition: {
      summary: 'TF-IDF measures how important a word is to a specific document relative to an entire corpus. Words frequent in one document but rare across the corpus receive the highest scores.',
      keyPoints: [
        'Term Frequency (TF): How many times the word appears in the document.',
        'Inverse Document Frequency (IDF): Logarithm of total documents divided by documents containing the word.',
        'Common words like "the", "is", and "at" appear in every document, so their IDF approaches 0.',
        'Rare, domain-specific words receive high IDF, making them excellent discriminators for search and classification.'
      ],
      detailedExplanation: 'TF-IDF transforms variable-length raw text into fixed-length sparse numerical vectors. These sparse vectors can be fed into fast linear classifiers (Logistic Regression, LinearSVM) or compared directly via Cosine Similarity for keyword search.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Doc["Document: 'Quantum computing qubits algorithms'"] --> TF["Term Frequency: 'qubits' appears 4 times (High TF)"]
    Corpus["Corpus: 100,000 Documents"] --> IDF["Inverse Doc Frequency: 'qubits' in only 5 docs (High IDF)"]
    TF --> Product["TF * IDF = Highest Score (Top Keyword)"]
    IDF --> Product
    Corpus --> LowIDF["'the' in 99,990 docs -> IDF ~ 0.0 (Zero Weight)"]
    style Product fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style LowIDF fill:#1e293b,stroke:#f43f5e,stroke-width:1px,color:#fff`,
      caption: 'TF-IDF highlights terms that are locally frequent in a document but globally rare across the corpus.'
    },
    mathematics: {
      coreFormula: '\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\ln\\left( \\frac{1 + |D|}{1 + |\\{d \\in D : t \\in d\\}|} \\right) + 1',
      variableDefinitions: [
        { symbol: 't', meaning: 'The candidate token/word' },
        { symbol: 'd', meaning: 'A specific document in the corpus' },
        { symbol: 'D', meaning: 'The entire corpus of documents' },
        { symbol: '\\text{TF}(t, d)', meaning: 'Term frequency count (often sub-linear: 1 + \\ln(\\text{count}))' },
        { symbol: '\\text{IDF}(t, D)', meaning: 'Inverse document frequency with smoothing (+1)' }
      ],
      derivationOrIntuition: 'Sub-linear term frequency scaling TF = 1 + ln(count) prevents a document mentioning a word 20 times from receiving 20x more weight than a document mentioning it once.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Document classification baselines with Logistic Regression or Naive Bayes.',
        'Automatic keyword and tag extraction for articles and tickets.',
        'Lexical search relevance ranking when a full Lucene engine is unnecessary.'
      ],
      whenToAvoid: [
        'Synonym and semantic matching (TF-IDF fails if user searches "sofa" and document contains "couch"; use dense embeddings).'
      ],
      complexity: {
        timeTraining: 'O(N * L) where L is average document length in tokens',
        timeInference: 'O(L) token lookups into sparse dictionary',
        space: 'O(V) storing the sparse vocabulary and IDF array'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    max_features=10000,
    sublinear_tf=True,
    stop_words='english',
    ngram_range=(1, 2)
)

# Learn vocabulary and transform training documents into sparse matrix
tfidf_matrix = vectorizer.fit_transform(corpus)

# Extract top keywords for document 0
feature_names = vectorizer.get_feature_names_out()
doc_vector = tfidf_matrix[0].toarray().flatten()
top_indices = doc_vector.argsort()[-5:][::-1]

for idx in top_indices:
    print(f"{feature_names[idx]}: {doc_vector[idx]:.4f}")`,
      explanation: 'Extracts unigram and bigram TF-IDF vectors with sublinear scaling and stop-word removal.'
    },
    principalInterviewFocus: {
      question: 'How does TF-IDF differ from Okapi BM25, and why does BM25 outperform TF-IDF in modern information retrieval?',
      insight: 'TF-IDF scales term frequency linearly or logarithmically without upper bound. In search, if a document repeats the query keyword 500 times (keyword stuffing), standard TF-IDF score keeps rising. Okapi BM25 introduces term frequency saturation via hyperparameter k_1 (typically 1.2-2.0): no matter how many times a word appears, the TF term asymptotes to k_1 + 1. Furthermore, BM25 explicitly normalizes for document length via hyperparameter b (penalizing long documents while rewarding concise ones), making BM25 far superior for search ranking.',
      failureModesInProduction: [
        'Vocabulary explosion when processing unconstrained social media text without min_df thresholds.'
      ]
    }
  },
  {
    id: 'word2vec',
    title: 'Word2Vec (Skip-Gram & CBOW)',
    subtitle: 'Distributed Dense Word Representations via Continuous Vector Embeddings & Negative Sampling',
    sectionId: 'classical-nlp',
    sectionTitle: 'Classical NLP & Information Extraction',
    level: 'Core ML',
    tags: ['Embeddings', 'Skip-gram', 'CBOW', 'Distributed Representations', 'Negative Sampling'],
    llmAntiPattern: {
      scenario: 'Calling an LLM API to fetch 1536-dimensional embeddings for 10 million single words in a vocabulary index.',
      whyItFails: 'Huge API latency and costs; pre-trained Word2Vec or FastText vectors can be queried locally from RAM in nanoseconds.',
      tcoComparison: {
        specialized: { latency: '0.0001ms (RAM lookup)', costPerMillion: '$0.00', determinism: 'Exact Word Embedding' },
        llmAlternative: { latency: '500ms', costPerMillion: '$2,000', determinism: 'API Overhead & Delay' }
      }
    },
    intuition: {
      summary: 'Word2Vec learns dense vector embeddings where words appearing in similar contexts map to nearby coordinates in space, famous for vector arithmetic like King - Man + Woman = Queen.',
      keyPoints: [
        'Based on the distributional hypothesis: "You shall know a word by the company it keeps" (J.R. Firth).',
        'Continuous Bag of Words (CBOW): Predicts the target word given its surrounding context words.',
        'Skip-Gram: Predicts surrounding context words given the center target word (better for rare words).',
        'Negative Sampling (SGNS) turns expensive full-vocabulary softmax into fast binary logistic regressions.'
      ],
      detailedExplanation: 'Before Word2Vec, words were represented as orthogonal one-hot vectors with zero semantic relationship. Word2Vec compresses vocabulary into a dense 300-dimensional space where semantic relationships correspond to geometric vector translations.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    subgraph Skip-Gram
        Target["Center Word: w(t)"] --> Predict1["Context: w(t-1)"]
        Target --> Predict2["Context: w(t+1)"]
    end
    subgraph CBOW
        C1["Context: w(t-1)"] --> Target2["Predict Center: w(t)"]
        C2["Context: w(t+1)"] --> Target2
    end
    style Target fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Target2 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Skip-Gram predicts surrounding context from center word; CBOW predicts center word from surrounding context.'
    },
    mathematics: {
      coreFormula: '\\mathcal{L}_{\\text{SGNS}} = \\ln \\sigma(\\mathbf{v}_{w_O}^\\prime \\mathbf{v}_{w_I}) + \\sum_{i=1}^k \\mathbb{E}_{w_i \\sim P_n(w)} \\left[ \\ln \\sigma(-\\mathbf{v}_{w_i}^\\prime \\mathbf{v}_{w_I}) \\right]',
      variableDefinitions: [
        { symbol: '\\mathbf{v}_{w_I}', meaning: 'Input vector representation of center word w_I' },
        { symbol: '\\mathbf{v}_{w_O}^\\prime', meaning: 'Output vector representation of true context word w_O' },
        { symbol: 'w_i', meaning: 'Randomly drawn negative sample words' },
        { symbol: 'P_n(w)', meaning: 'Unigram distribution raised to the 3/4 power: \\frac{U(w)^{3/4}}{\\sum_w U(w)^{3/4}}' }
      ],
      derivationOrIntuition: 'Mikolov introduced raising word frequencies to 3/4 power in the negative sampling distribution. This slightly boosts the probability of sampling rare words while dampening ultra-frequent stop-words.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Item2Vec and Prod2Vec in recommendation systems (treating user purchase sessions as "sentences" and products as "words").',
        'Graph embeddings (Node2Vec, DeepWalk using random walks on graphs).',
        'Fast keyword similarity and synonym clustering without GPU inference.'
      ],
      whenToAvoid: [
        'Polysemy (words with multiple meanings like "apple" fruit vs company; static embeddings have only one vector per token; use contextual transformers).'
      ],
      complexity: {
        timeTraining: 'O(tokens * window * k) - trains millions of words in minutes on CPU',
        timeInference: 'O(1) dictionary hash lookup',
        space: 'O(|V| * d) storing the embedding matrix'
      }
    },
    codeRecipe: {
      framework: 'Python (gensim)',
      code: `from gensim.models import Word2Vec

# sentences: list of tokenized sentences
model = Word2Vec(
    sentences=tokenized_corpus,
    vector_size=300,
    window=5,
    min_count=2,
    sg=1, # 1 for Skip-Gram, 0 for CBOW
    negative=10,
    workers=4
)

# Vector arithmetic: King - Man + Woman = Queen
result = model.wv.most_similar(positive=['king', 'woman'], negative=['man'], topn=1)
print(result)`,
      explanation: 'Trains Skip-Gram with negative sampling and demonstrates semantic vector arithmetic.'
    },
    principalInterviewFocus: {
      question: 'What is the theoretical connection between Word2Vec Skip-Gram with Negative Sampling (SGNS) and Matrix Factorization?',
      insight: 'Levy & Goldberg mathematically proved in 2014 that Skip-Gram with Negative Sampling is implicitly factorizing a shifted Pointwise Mutual Information (PMI) matrix: M_{ij} = \\text{PMI}(w_i, c_j) - \\ln(k), where k is the number of negative samples. This showed that neural word embeddings and classical distributional semantics (spectral matrix factorization) are solving the exact same geometric optimization problem.',
      failureModesInProduction: [
        'Out-Of-Vocabulary (OOV) words failing completely in static Word2Vec (FastText resolves this using character n-grams).'
      ]
    }
  },
  {
    id: 'vader-sentiment',
    title: 'VADER (Valence Aware Dictionary and sEntiment Reasoner)',
    subtitle: 'Rule-Based Heuristic Sentiment Engine for Microblogs, Social Media & Punctuation Nuance',
    sectionId: 'classical-nlp',
    sectionTitle: 'Classical NLP & Information Extraction',
    level: 'Foundational',
    tags: ['Sentiment', 'Rule-Based', 'Lexicon', 'VADER', 'Zero Latency', 'Social Media'],
    llmAntiPattern: {
      scenario: 'Calling an LLM API to classify the sentiment of 5 million incoming tweets or product reviews per day.',
      whyItFails: 'Costs thousands of dollars daily and takes 1,000ms per tweet; VADER scores sentiment in 0.02ms with zero GPU footprint and explainable rules.',
      tcoComparison: {
        specialized: { latency: '0.02ms', costPerMillion: '$0.00', determinism: '100% Explainable Rule Weights' },
        llmAlternative: { latency: '1,200ms', costPerMillion: '$3,000', determinism: 'Stochastic LLM Variations' }
      }
    },
    intuition: {
      summary: 'VADER is a rule-based sentiment analysis tool specifically tuned to social media sentiments. It combines a gold-standard curated sentiment lexicon with grammatical heuristic rules.',
      keyPoints: [
        'Zero training required: instantly ready for inference out-of-the-box.',
        'Punctuation booster: "Great!!!" receives a higher score than "Great."',
        'Capitalization booster: "GREAT" receives higher intensity than "great".',
        'Contrastive conjunctions: In "The food was great, but the service was terrible", VADER correctly weights the clause following "but" higher.',
        'Handles emojis (😃, 😡) and slang ("kinda", "meh", "sux").'
      ],
      detailedExplanation: 'VADER assigns valence scores from -4.0 (extremely negative) to +4.0 (extremely positive) to words. It then applies rule-based modifiers for negation ("not good"), intensifiers ("really good"), and contrastive conjunctions, producing a normalized compound score between -1.0 and +1.0.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Input["'The phone is GOOD, but battery life sux!!!'"] --> Lexicon["Lexicon Matches: GOOD (+1.9), sux (-1.5)"]
    Lexicon --> Heuristics["Grammar Rules: ALL-CAPS boost (+), 'but' shift, exclamation boost (!!!)"]
    Heuristics --> Compound["Compound Score: -0.42 (Slightly Negative) (0.02ms)"]
    style Lexicon fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Heuristics fill:#818cf8,stroke:#c7d2fe,stroke-width:2px,color:#fff
    style Compound fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff`,
      caption: 'VADER parses lexical words and applies grammatical modifiers (contrast, punctuation, caps) in real time.'
    },
    mathematics: {
      coreFormula: '\\text{Compound Score} = \\frac{x}{\\sqrt{x^2 + \\alpha}}, \\quad \\text{where } x = \\sum \\text{valence}_{\\text{modified}}',
      variableDefinitions: [
        { symbol: 'x', meaning: 'Sum of all valence scores of words in the sentence after rule modification' },
        { symbol: '\\alpha', meaning: 'Normalization constant (empirically set to 15)' },
        { symbol: '\\text{Compound}', meaning: 'Normalized metric mapped to range [-1, +1]' }
      ],
      derivationOrIntuition: 'Thresholds for compound score: Positive: >= 0.05, Neutral: between -0.05 and +0.05, Negative: <= -0.05.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Real-time streaming social media monitoring (Twitter / X, Reddit, customer chat feeds).',
        'Zero-compute sentiment features for financial market trading bots.',
        'Explainable audit requirements where model decisions must be traced to specific words and punctuation.'
      ],
      whenToAvoid: [
        'Subtle sarcasm, irony, or complex multi-sentence narrative prose (requires contextual transformers).'
      ],
      complexity: {
        timeTraining: 'N/A (Pre-built Rule Engine)',
        timeInference: 'O(L) token lookups and regex passes - microseconds',
        space: 'O(1) memory'
      }
    },
    codeRecipe: {
      framework: 'Python (nltk.sentiment.vader)',
      code: `from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Initialize analyzer (lexicon loaded in memory)
sia = SentimentIntensityAnalyzer()

text = "The product is AMAZING, but customer support took 3 days... unacceptable!!"
scores = sia.polarity_scores(text)

# Returns: {'neg': 0.22, 'neu': 0.45, 'pos': 0.33, 'compound': -0.15}
print(f"Compound Score: {scores['compound']}")
if scores['compound'] >= 0.05:
    print("Positive")
elif scores['compound'] <= -0.05:
    print("Negative")
else:
    print("Neutral")`,
      explanation: 'Evaluates text polarity and grammatical modifiers, outputting compound sentiment in microseconds.'
    },
    principalInterviewFocus: {
      question: 'When should a Principal ML Engineer choose a lexicon rule-based system like VADER over fine-tuning a RoBERTa sentiment classifier?',
      insight: 'The decision hinges on three constraints: Latency, Cold-Start Annotation Cost, and Explainability. If your SLA is < 1ms on a streaming WebSocket feed processing 50k events/sec, RoBERTa on GPUs costs $50,000/month and introduces batching delay, whereas VADER runs on existing CPU instances for free. Furthermore, VADER requires 0 labeled training examples and is 100% auditable. If high-precision detection of subtle sarcasm, multi-paragraph context, or domain-specific jargon is required, distillation of a transformer model to a student ONNX model is the correct secondary step.',
      failureModesInProduction: [
        'Sarcasm ("Oh great, another flat tire!") scored as positive due to presence of "great".'
      ]
    }
  }
];
