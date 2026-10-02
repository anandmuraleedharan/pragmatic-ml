import { Concept } from '../types';

export const DEEP_LEARNING_CONCEPTS: Concept[] = [
  {
    id: 'cnn-convolutions',
    title: 'Convolutional Neural Networks (CNNs) & ResNet',
    subtitle: 'Spatial Translation Invariance, 2D Kernels, Receptive Fields & Residual Skip Connections',
    sectionId: 'deep-learning',
    sectionTitle: 'Deep Learning & Neural Architectures',
    level: 'Core ML',
    tags: ['Computer Vision', 'CNN', 'Convolutions', 'ResNet', 'Feature Maps', 'Computer Vision'],
    llmAntiPattern: {
      scenario: 'Calling a multimodal LLM API to detect whether an industrial manufacturing part on an assembly line has a physical crack defect.',
      whyItFails: 'Costs $0.02 per image, takes 1,500ms over network latency, and cannot guarantee pixel-precise spatial localization. A fine-tuned MobileNet or ResNet runs in 3ms on edge hardware.',
      tcoComparison: {
        specialized: { latency: '3ms (ONNX on Edge CPU/NPU)', costPerMillion: '$0.00', determinism: '100% Deterministic Feature Maps' },
        llmAlternative: { latency: '2,000ms', costPerMillion: '$20,000', determinism: 'Hallucinated Defect Reports' }
      }
    },
    intuition: {
      summary: 'CNNs leverage two fundamental properties of sensory signals: local spatial correlation and translation invariance. A small filter kernel slides across the input to extract localized feature maps.',
      keyPoints: [
        'Weight sharing: The same filter is applied across the entire image, slashing parameters compared to fully-connected layers.',
        'Early layers learn basic edges and textures; deeper layers compose these into object parts and semantic concepts.',
        'Max Pooling reduces spatial dimensions while introducing translation invariance.',
        'ResNet Skip Connections (Residual Blocks) solve the vanishing gradient problem in deep networks by letting gradients flow directly backwards via identity shortcuts: F(x) + x.'
      ],
      detailedExplanation: 'In fully-connected networks, flattening an image discards all 2D spatial adjacency. 2D convolutions preserve spatial topology. Deep networks (50+ layers) historically suffered from gradient degradation until He et al. introduced residual learning, enabling networks of 152+ layers to train smoothly.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Input["Input Image (H x W x 3)"] --> Conv["Conv2D + ReLU (3x3 Kernels)"]
    Conv --> Pool["Max Pooling (Downsample 2x)"]
    Pool --> ResBlock["Residual Block: F(x) + x (Skip Connection)"]
    ResBlock --> GlobalPool["Global Average Pooling"]
    GlobalPool --> Dense["Dense Output Head (3ms)"]
    style Conv fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style ResBlock fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff
    style Dense fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'CNN with Residual Skip Connections: Preserving gradient flow through identity shortcut x.'
    },
    mathematics: {
      coreFormula: '(I * K)(i, j) = \\sum_{m} \\sum_{n} I(i - m, j - n) K(m, n), \\quad \\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x}',
      variableDefinitions: [
        { symbol: 'I', meaning: '2D input image or feature map' },
        { symbol: 'K', meaning: 'Learned convolution kernel / filter matrix (e.g. 3x3)' },
        { symbol: '\\mathcal{F}(\\mathbf{x})', meaning: 'Residual mapping (stacked convolution layers)' },
        { symbol: '\\mathbf{x}', meaning: 'Identity shortcut connection added to the residual output' }
      ],
      derivationOrIntuition: 'During backpropagation, the gradient of the residual block is \\frac{\\partial \\mathcal{E}}{\\partial \\mathbf{x}} = \\frac{\\partial \\mathcal{E}}{\\partial \\mathbf{y}} \\left( \\frac{\\partial \\mathcal{F}}{\\partial \\mathbf{x}} + 1 \\right). The constant +1 term ensures that even if weights vanish (\\partial \\mathcal{F} / \\partial \\mathbf{x} \\approx 0), the gradient flows backward unattenuated.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Real-time computer vision (object detection, segmentation, optical character recognition).',
        'Audio spectrogram classification and speech keyword spotting.',
        'High-speed assembly-line defect inspection and medical X-ray classification.'
      ],
      whenToAvoid: [
        'Tabular categorical datasets with no natural spatial ordering (use XGBoost).'
      ],
      complexity: {
        timeTraining: 'O(epochs * N * H * W * C_in * C_out * K^2) on GPUs',
        timeInference: '3ms to 15ms on edge hardware via TensorRT / ONNX INT8',
        space: 'Compact model weights (~15MB for MobileNet, ~90MB for ResNet50)'
      }
    },
    codeRecipe: {
      framework: 'Python (PyTorch)',
      code: `import torch
import torch.nn as nn

class ResidualBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(channels)
        
    def forward(self, x):
        residual = x # Identity shortcut
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        out += residual # Element-wise skip addition
        return self.relu(out)`,
      explanation: 'Implements a standard PyTorch Residual Block with identity skip connection and batch normalization.'
    },
    principalInterviewFocus: {
      question: 'What is the Receptive Field of a deep CNN, how do Dilated (Atrous) Convolutions expand it without increasing parameter counts, and why is Global Average Pooling preferred over Flattening?',
      insight: 'The receptive field is the patch of pixels in the input image that directly influences a particular activation in a deep layer. Receptive field grows linearly with depth: RF = RF_{prev} + (K - 1) * stride_product. To capture wide contextual relationships without stacking dozens of pooling layers (which destroys spatial resolution in segmentation), Dilated Convolutions insert spaces into the kernel (dilation rate r), expanding the receptive field exponentially to (r * (K - 1) + 1) with zero increase in parameter count. For classification heads: Global Average Pooling (GAP) takes the spatial mean across each feature map, outputting a 1D vector of length C. Unlike flattening (which creates millions of dense weights prone to catastrophic overfitting), GAP has 0 parameters and enforces spatial translation invariance.',
      failureModesInProduction: [
        'Input aspect ratio distortion when resizing images arbitrarily instead of padding, warping spatial features.'
      ]
    }
  },
  {
    id: 'transformers-attention',
    title: 'Transformers & Scaled Dot-Product Self-Attention',
    subtitle: 'Multi-Head Attention Mechanisms, Softmax Routing & Positional Encodings',
    sectionId: 'deep-learning',
    sectionTitle: 'Deep Learning & Neural Architectures',
    level: 'Core ML',
    tags: ['Transformers', 'Attention', 'Self-Attention', 'NLP', 'Foundation Models', 'Vaswani'],
    llmAntiPattern: {
      scenario: 'Treating the Transformer as a mysterious black box and attempting to tune prompt temperatures rather than understanding context limits and attention patterns.',
      whyItFails: 'Engineers who don’t understand attention mechanisms fail to realize that context window quadratic memory ($O(N^2)$) causes GPU OOM crashes in production.',
      tcoComparison: {
        specialized: { latency: 'Self-Attention: O(N^2 * d)', costPerMillion: 'GPU RAM Bound', determinism: 'Exact Attention Weights' },
        llmAlternative: { latency: 'Black Box Prompting', costPerMillion: 'High Cloud Bills', determinism: 'Opaque Behaviour' }
      }
    },
    intuition: {
      summary: 'Self-Attention allows every token in a sequence to look at and dynamically route information from every other token in the sequence simultaneously, weighted by their contextual relevance.',
      keyPoints: [
        'Replaces recurrent sequential processing (RNNs) with fully parallelizable matrix multiplications.',
        'Queries (Q), Keys (K), and Values (V) are linear projections of token embeddings.',
        'Dividing by sqrt(d_k) prevents dot products from growing massive, which would push softmax into flat regions with vanishing gradients.',
        'Multi-Head Attention runs multiple parallel attention mechanisms, allowing the model to attend to syntax, grammar, and factual references simultaneously.'
      ],
      detailedExplanation: 'Given an input sentence, every word generates a Query vector (what it is looking for), a Key vector (what it offers), and a Value vector (its actual content). Computing softmax(Q K^T / sqrt(d_k)) creates an N x N attention matrix of weights, which then takes a weighted sum of the Values V.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Input["Input Tokens X"] --> Q["Query Q = X * W_q"]
    Input --> K["Key K = X * W_k"]
    Input --> V["Value V = X * W_v"]
    Q --> Dot["Scaled Dot Product: Q * K^T / sqrt(d_k)"]
    K --> Dot
    Dot --> Softmax["Softmax (Attention Weights Matrix N x N)"]
    Softmax --> Weighted["Weighted Sum: Attention * V"]
    V --> Weighted
    Weighted --> Output["Contextual Output Vectors"]
    style Dot fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Softmax fill:#818cf8,stroke:#c7d2fe,stroke-width:2px,color:#fff
    style Weighted fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Scaled Dot-Product Attention: Computing attention compatibility between Queries and Keys to route Values.'
    },
    mathematics: {
      coreFormula: '\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left( \\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}} \\right) \\mathbf{V}',
      variableDefinitions: [
        { symbol: '\\mathbf{Q}', meaning: 'Query matrix of shape N x d_k' },
        { symbol: '\\mathbf{K}', meaning: 'Key matrix of shape N x d_k' },
        { symbol: '\\mathbf{V}', meaning: 'Value matrix of shape N x d_v' },
        { symbol: 'd_k', meaning: 'Dimension of keys (scaling factor sqrt(d_k))' },
        { symbol: '\\text{MultiHead}', meaning: '\\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) \\mathbf{W}^O' }
      ],
      derivationOrIntuition: 'If d_k is large, dot products between random zero-mean unit-variance vectors have variance d_k. Scaling by 1/sqrt(d_k) restores the variance to 1, ensuring the softmax function operates in its active gradient slope rather than saturating.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Contextual sequence modeling across language, code, music, and genomic sequences.',
        'Foundation model architectures (BERT, RoBERTa, LLaMA, GPT-4, Gemini).',
        'Vision Transformers (ViT) dividing images into sequence patches.'
      ],
      whenToAvoid: [
        'Streaming micro-controllers with severe RAM bounds where quadratic O(N^2) memory footprint is prohibitive.'
      ],
      complexity: {
        timeTraining: 'O(N^2 * d) attention matrix multiplication per layer',
        timeInference: 'O(N^2 * d) without KV cache; O(N * d) per generated token with KV cache',
        space: 'O(N^2) storing attention weight matrices during training backpropagation'
      }
    },
    codeRecipe: {
      framework: 'Python (PyTorch)',
      code: `import torch
import torch.nn as nn
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    # Compute attention scores: (Batch, Heads, N, N)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
        
    weights = torch.softmax(scores, dim=-1)
    output = torch.matmul(weights, V)
    return output, weights`,
      explanation: 'Implements scaled dot-product attention with optional autoregressive masking and softmax normalization.'
    },
    principalInterviewFocus: {
      question: 'What is the KV-Cache in transformer inference, and how do FlashAttention and Rotary Position Embeddings (RoPE) optimize memory and length extrapolation?',
      insight: 'During autoregressive generation, past tokens are fixed. Instead of recomputing Q, K, and V for all prior tokens at every step (which costs O(N^2)), we cache the K and V matrices of past tokens in GPU memory (KV-Cache), computing attention for only the single newest query vector in O(N). FlashAttention optimizes the memory bottleneck: standard attention materializes the massive N x N attention matrix into slow High Bandwidth Memory (HBM); FlashAttention tiles the Q, K, V matrices and computes softmax incrementally in fast SRAM, reducing memory I/O by 5-10x. RoPE (Rotary Position Embedding) encodes position by rotating the Q and K vectors in 2D coordinate slices: R_m Q . R_n K depends only on the relative distance m - n, enabling stable sequence length generalization.',
      failureModesInProduction: [
        'KV-cache memory consumption exceeding GPU VRAM during multi-tenant LLM serving; requires PagedAttention (vLLM).'
      ]
    }
  },
  {
    id: 'encoder-vs-decoder',
    title: 'Transformer Archetypes: Encoder vs Decoder vs Seq2Seq',
    subtitle: 'Structural Differences Between BERT, GPT & T5 for Task-Optimal Architecture Selection',
    sectionId: 'deep-learning',
    sectionTitle: 'Deep Learning & Neural Architectures',
    level: 'Core ML',
    tags: ['Architectures', 'BERT', 'GPT', 'T5', 'Masking', 'Generative vs Discriminative'],
    llmAntiPattern: {
      scenario: 'Using an autoregressive decoder-only model (GPT) for document classification or dense vector embeddings.',
      whyItFails: 'Causal decoders only attend to past tokens (left-to-right), throwing away 50% of the bidirectional context that encoders (BERT) leverage naturally.',
      tcoComparison: {
        specialized: { latency: 'Encoder: 8ms bidirectional', costPerMillion: '$0.00', determinism: 'Full Bidirectional Context' },
        llmAlternative: { latency: 'Decoder: 1,500ms causal', costPerMillion: '$5,000', determinism: 'Unidirectional Loss of Future Context' }
      }
    },
    intuition: {
      summary: 'The original Transformer consisted of an Encoder and a Decoder. The industry fractured this into three specialized archetypes: Encoder-Only (BERT), Decoder-Only (GPT), and Encoder-Decoder (T5).',
      keyPoints: [
        'Encoder-Only (BERT, RoBERTa): Bidirectional attention. Every token attends to all tokens. Optimal for classification, NER, and dense embeddings.',
        'Decoder-Only (GPT, LLaMA): Causal autoregressive masking. Tokens can only attend to previous tokens. Optimal for text generation and reasoning.',
        'Encoder-Decoder (T5, BART): Full bidirectional encoder coupled with an autoregressive decoder. Optimal for sequence-to-sequence translation and summarization.'
      ],
      detailedExplanation: 'Selecting the wrong archetype creates huge architectural waste. If you need embeddings or text categorization, an Encoder-only model with 110M parameters outperforms a 70B parameter causal decoder at 1/1000th the latency.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    subgraph Encoder-Only BERT
        E_Tokens["All Tokens [x1, x2, x3, x4]"] --> E_Attn["Bidirectional Self-Attention (Every token sees all tokens)"]
        E_Attn --> E_Tasks["Embeddings, Classification, NER (8ms)"]
    end
    subgraph Decoder-Only GPT
        D_Tokens["Tokens [x1, x2, x3]"] --> D_Attn["Causal Masked Attention (Can only look backwards)"]
        D_Attn --> D_Tasks["Generative Text, Code Completion, Chat"]
    end
    style E_Attn fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style D_Attn fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Encoder (BERT) uses unconstrained bidirectional attention; Decoder (GPT) enforces causal triangular masking.'
    },
    mathematics: {
      coreFormula: '\\mathbf{M}_{\\text{causal}}(i, j) = \\begin{cases} 0 & \\text{if } j \\le i \\\\ -\\infty & \\text{if } j > i \\end{cases}, \\quad \\mathbf{M}_{\\text{encoder}}(i, j) = 0',
      variableDefinitions: [
        { symbol: '\\mathbf{M}_{\\text{causal}}', meaning: 'Upper-triangular causal attention mask for decoder architectures' },
        { symbol: '\\mathbf{M}_{\\text{encoder}}', meaning: 'All-zero bidirectional mask permitting full token visibility' }
      ],
      derivationOrIntuition: 'Adding -infinity to the logits before softmax zeroes out attention weights to future tokens: softmax([x1, x2, -infinity]) = [p1, p2, 0], mathematically preventing information leakage from future tokens.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Encoder-only: Vector search embeddings, text classification, named entity recognition, semantic similarity.',
        'Decoder-only: Free-form text generation, code writing, multi-turn conversational agents.',
        'Encoder-Decoder: Translation across languages, abstractive text summarization.'
      ],
      whenToAvoid: [
        'Using massive causal decoders for embedding generation without mean-pooling over non-causal representations.'
      ],
      complexity: {
        timeTraining: 'Encoder & Decoder: O(N^2 * d) per layer',
        timeInference: 'Encoder: O(1) single forward pass; Decoder: O(tokens) autoregressive loop',
        space: 'O(N * d)'
      }
    },
    codeRecipe: {
      framework: 'Python (Hugging Face Transformers)',
      code: `from transformers import AutoTokenizer, AutoModel

# Encoder-Only Model for fast bidirectional embeddings
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

inputs = tokenizer("Bidirectional encoders represent context in full.", return_tensors="pt")
outputs = model(**inputs)

# Mean pooling over token embeddings produces the final sentence embedding
sentence_embedding = outputs.last_hidden_state.mean(dim=1)`,
      explanation: 'Loads a compact bidirectional encoder and computes high-quality dense sentence embeddings via mean pooling.'
    },
    principalInterviewFocus: {
      question: 'Why did Decoder-Only architectures dominate foundation models over Encoder-Decoder models, despite Encoder-Decoder being theoretically more flexible?',
      insight: 'Three engineering reasons drove the convergence to Decoder-Only: (1) Simplicity & Scaling Laws: A single homogeneous stack of causal decoder blocks is simpler to scale, parallelize (Tensor & Pipeline Parallelism), and optimize with continuous batching than coupled encoder-decoder cross-attention stacks; (2) In-Context Learning: Autoregressive next-token prediction over raw internet text naturally learns few-shot prompting and chain-of-thought without task-specific prefixes; (3) Inference Efficiency: In encoder-decoders, the cross-attention layer requires attending to the full encoder hidden states at every generated token, doubling KV-cache communication overhead across distributed GPUs.',
      failureModesInProduction: [
        'Deploying a 70B decoder for search query embedding generation when a 22M parameter bidirectional encoder delivers superior retrieval quality in 2ms.'
      ]
    }
  }
];
