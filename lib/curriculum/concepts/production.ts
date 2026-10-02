import { Concept } from '../types';

export const PRODUCTION_CONCEPTS: Concept[] = [
  {
    id: 'quantization',
    title: 'Model Quantization (FP16, INT8 & INT4)',
    subtitle: 'Post-Training Quantization (PTQ) vs Quantization-Aware Training (QAT) for Edge Serving',
    sectionId: 'production-systems',
    sectionTitle: 'Production ML Systems & Optimization',
    level: 'Principal Specialist',
    tags: ['Inference', 'Quantization', 'INT8', 'INT4', 'PTQ', 'QAT', 'Edge Serving'],
    llmAntiPattern: {
      scenario: 'Hosting full FP32 or FP16 unquantized neural models on expensive 80GB A100 GPUs for simple text classification or embedding tasks.',
      whyItFails: 'Costs thousands of dollars per month in GPU cloud hosting when INT8 or INT4 quantization fits the model onto a standard $20/month CPU instance with zero noticeable drop in accuracy.',
      tcoComparison: {
        specialized: { latency: '3ms (INT8 CPU via ONNX)', costPerMillion: '$0.00', determinism: 'Identical Output Accuracy' },
        llmAlternative: { latency: 'Full FP16 GPU required', costPerMillion: '$4,000/mo Cloud VM', determinism: 'Massive Waste of VRAM' }
      }
    },
    intuition: {
      summary: 'Quantization compresses neural network weights and activations from 32-bit floating point (FP32) down to 8-bit integers (INT8) or 4-bit integers (INT4), slashing memory by 4x to 8x and accelerating inference via integer SIMD math.',
      keyPoints: [
        'FP32 requires 4 bytes per parameter; INT8 requires only 1 byte per parameter; INT4 requires 0.5 bytes.',
        'CPUs and modern GPUs (Tensor Cores) execute integer operations (DP4A, INT8 matrix math) at 2x to 4x the throughput of floating-point math.',
        'Post-Training Quantization (PTQ): Converts a pre-trained model directly using a calibration dataset to determine scale and zero-point factors.',
        'Quantization-Aware Training (QAT): Simulates low-precision rounding errors during training, allowing the model to adapt its weights and achieve zero accuracy loss.'
      ],
      detailedExplanation: 'Quantization maps continuous float values in [alpha, beta] to discrete integer buckets [q_min, q_max] using an affine transformation: q = round(x / S) + Z, where S is the scale factor and Z is the integer zero-point offset.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    FP32["FP32 Float (32-bit: 4 Bytes per weight)"] --> Scale["Affine Mapping: q = round(x / S) + Z"]
    Scale --> INT8["INT8 Integer (8-bit: 1 Byte per weight)"]
    INT8 --> SIMD["Hardware Integer Tensor Cores (4x Memory Reduction, 3x Faster Inference)"]
    style FP32 fill:#1e293b,stroke:#f43f5e,stroke-width:1px,color:#fff
    style INT8 fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style SIMD fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff`,
      caption: 'Quantization maps continuous 32-bit floats into compact 8-bit integer buckets.'
    },
    mathematics: {
      coreFormula: 'q = \\text{clamp}\\left( \\left\\lfloor \\frac{x}{S} \\right\\rceil + Z, \\, q_{\\min}, \\, q_{\\max} \\right), \\quad S = \\frac{\\beta - \\alpha}{q_{\\max} - q_{\\min}}',
      variableDefinitions: [
        { symbol: 'x', meaning: 'Original 32-bit floating point weight or activation' },
        { symbol: 'S', meaning: 'Positive floating-point scale factor' },
        { symbol: 'Z', meaning: 'Integer zero-point offset (ensures real float 0 maps exactly to an integer)' },
        { symbol: 'q', meaning: 'Quantized integer representation (e.g. in [-128, 127] for signed INT8)' }
      ],
      derivationOrIntuition: 'In Symmetric Quantization, Z=0 and alpha = -beta = max(|x|), simplifying runtime matrix multiplications: X Y = S_X S_Y (Q_X Q_Y), allowing integer matrix multiplication engines to compute products directly without offset corrections.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Deploying transformer models, CNNs, or embeddings to CPU, mobile (CoreML / TFLite), or browser (ONNX Web / WebAssembly).',
        'Fitting large models into constrained GPU VRAM (e.g. 70B models in 4-bit AWQ / GPTQ on a single 48GB GPU).',
        'High-throughput microservices where memory bandwidth is the primary latency bottleneck.'
      ],
      whenToAvoid: [
        'Models with sensitive activation outliers where naive INT8 clipping destroys dynamic range (use SmoothQuant or INT4 weight-only quantization).'
      ],
      complexity: {
        timeTraining: 'PTQ: minutes on CPU calibration set; QAT: requires fine-tuning epochs',
        timeInference: '2x to 4x faster execution speed; 75% reduction in memory bandwidth I/O',
        space: '75% reduction in model file size (e.g. 400MB -> 100MB)'
      }
    },
    codeRecipe: {
      framework: 'Python (PyTorch)',
      code: `import torch

# Load standard model in FP32
model_fp32 = torch.load("transformer_model.pt")
model_fp32.eval()

# Post-Training Dynamic Quantization to INT8
# Quantizes Linear layers to 8-bit integers
quantized_model = torch.ao.quantization.quantize_dynamic(
    model_fp32,
    {torch.nn.Linear}, # Layers to quantize
    dtype=torch.qint8
)

# Export or run inference on standard CPU
output = quantized_model(sample_inputs)`,
      explanation: 'Applies dynamic INT8 post-training quantization to Linear layers, slashing memory footprint by 75% with one function call.'
    },
    principalInterviewFocus: {
      question: 'What is the distinction between Weight-Only Quantization (e.g. AWQ/GPTQ) vs Full Integer Quantization (W8A8), and why does SmoothQuant matter for LLMs?',
      insight: 'In generative autoregressive inference with batch size 1, the model is memory-bandwidth bound (reading weights from VRAM to compute cores dominates latency). Weight-Only Quantization (W4A16) compresses weights to 4 bits in VRAM and dequantizes them to FP16 in registers on the fly, reducing memory footprint by 75% and speeding up memory reading without needing integer arithmetic for activations. In high-throughput serving with large batches, the workload becomes compute-bound, requiring Full Integer Quantization (W8A8) so that matrix multiplications run on integer tensor cores. In large language models, certain activation channels develop massive outliers (100x larger than normal activations). Standard per-tensor quantization destroys precision on these channels. SmoothQuant addresses this by mathematically migrating the quantization difficulty from activations to weights: Y = (X diag(s)^{-1}) (diag(s) W), smoothing the activation outliers so both weights and activations can be cleanly quantized to INT8 with zero perplexity degradation.',
      failureModesInProduction: [
        'Quantizing activation layers without a representative calibration dataset, leading to severe clipping of outlier features.'
      ]
    }
  },
  {
    id: 'data-concept-drift',
    title: 'Data Drift vs Concept Drift Detection',
    subtitle: 'Covariate Shift, Population Stability Index (PSI) & Kolmogorov-Smirnov Statistical Testing',
    sectionId: 'production-systems',
    sectionTitle: 'Production ML Systems & Optimization',
    level: 'Principal Specialist',
    tags: ['MLOps', 'Monitoring', 'Data Drift', 'Concept Drift', 'PSI', 'Covariate Shift'],
    llmAntiPattern: {
      scenario: 'Deploying an ML model to production and only monitoring infrastructure metrics (CPU, RAM, HTTP 200s) while ignoring feature distribution shifts.',
      whyItFails: 'Models fail silently! An API can return HTTP 200 in 5ms while outputting completely degraded, disastrous predictions because incoming user data drifted.',
      tcoComparison: {
        specialized: { latency: 'Automated Daily PSI Scan: 2ms', costPerMillion: '$0.00', determinism: 'Statistically Proven Drift Alert' },
        llmAlternative: { latency: 'Unmonitored', costPerMillion: 'Catastrophic Silent Revenue Loss', determinism: 'Silent Failures' }
      }
    },
    intuition: {
      summary: 'Data Drift (Covariate Shift) occurs when the distribution of input features P(X) changes over time. Concept Drift occurs when the underlying relationship between inputs and outputs P(Y|X) changes.',
      keyPoints: [
        'Data Drift: P(X) changes while P(Y|X) remains constant (e.g., app launches in a new country; user age demographics shift).',
        'Concept Drift: P(Y|X) changes even if P(X) looks identical (e.g., inflation alters how income predicts loan default; a pandemic changes buying behavior).',
        'Population Stability Index (PSI): Measures the shift between a baseline reference distribution and the current production window. PSI > 0.2 indicates significant drift.',
        'Kolmogorov-Smirnov (KS) Test: Non-parametric statistical test evaluating whether two continuous feature samples were drawn from the same distribution.'
      ],
      detailedExplanation: 'ML models are trained under the assumption that data is independent and identically distributed (IID). When production distributions diverge from training distributions, model performance degrades. Production systems run automated daily drift checks to trigger alerts or automated retraining pipelines.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Prod["Production Stream X_prod"] --> Monitor["Drift Engine: Compute PSI & KS-Test"]
    Train["Baseline Reference X_train"] --> Monitor
    Monitor --> Check{"PSI > 0.2?"}
    Check -->|No (PSI < 0.1)| Stable["Status: Stable (No Action)"]
    Check -->|Yes (PSI > 0.2)| Alert["Trigger Alert: Feature Drift Detected -> Re-train Model!"]
    style Monitor fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Alert fill:#e11d48,stroke:#fda4af,stroke-width:2px,color:#fff
    style Stable fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff`,
      caption: 'Continuous Drift Monitoring: Comparing production distributions against baseline training data to trigger retraining.'
    },
    mathematics: {
      coreFormula: '\\text{PSI} = \\sum_{b=1}^B \\left( \\%\\text{Actual}_b - \\%\\text{Expected}_b \\right) \\times \\ln\\left( \\frac{\\%\\text{Actual}_b}{\\%\\text{Expected}_b} \\right)',
      variableDefinitions: [
        { symbol: 'B', meaning: 'Number of discrete feature bins (typically 10 deciles)' },
        { symbol: '\\%\\text{Expected}_b', meaning: 'Fraction of observations in bin b during training/baseline' },
        { symbol: '\\%\\text{Actual}_b', meaning: 'Fraction of observations in bin b in the recent production window' },
        { symbol: '\\text{PSI} < 0.1', meaning: 'No significant distribution change' },
        { symbol: '0.1 \\le \\text{PSI} \\le 0.2', meaning: 'Moderate drift; monitor closely' },
        { symbol: '\\text{PSI} > 0.2', meaning: 'Significant drift; trigger retraining immediately' }
      ],
      derivationOrIntuition: 'PSI is a symmetric version of Kullback-Leibler (KL) divergence: (P - Q) * ln(P/Q) is always non-negative and penalizes both sudden population spikes and drops.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Production ML feature monitoring for credit risk, fraud, and recommendation systems.',
        'Continuous automated model retraining triggers in CI/CD ML pipelines.',
        'Detecting upstream data pipeline bugs (e.g. tracking SDK version bug changing a field format).'
      ],
      whenToAvoid: [
        'Small batch windows with < 100 samples where small sample variance produces false alarm spikes.'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(N log N) to bin continuous data and compute PSI - milliseconds',
        space: 'O(B) storing bin boundary histograms'
      }
    },
    codeRecipe: {
      framework: 'Python (NumPy / SciPy)',
      code: `import numpy as np

def calculate_psi(expected, actual, num_bins=10):
    """
    Computes Population Stability Index (PSI) between baseline and production data.
    """
    # Create bins using baseline quantiles
    percentiles = np.linspace(0, 100, num_bins + 1)
    bin_edges = np.percentile(expected, percentiles)
    bin_edges[0] -= 1e-5
    bin_edges[-1] += 1e-5
    
    # Calculate counts in bins
    expected_counts, _ = np.histogram(expected, bins=bin_edges)
    actual_counts, _ = np.histogram(actual, bins=bin_edges)
    
    # Fractions with smoothing
    exp_pct = np.maximum(expected_counts / len(expected), 1e-4)
    act_pct = np.maximum(actual_counts / len(actual), 1e-4)
    
    psi_value = np.sum((act_pct - exp_pct) * np.log(act_pct / exp_pct))
    return float(psi_value)

# Example: PSI on production feature
psi = calculate_psi(baseline_feature_array, production_feature_array)
if psi > 0.2:
    print(f"CRITICAL DRIFT: PSI={psi:.3f}. Retraining required!")`,
      explanation: 'Computes Population Stability Index (PSI) using quantile binning to automatically flag significant covariate shift.'
    },
    principalInterviewFocus: {
      question: 'How do you detect Concept Drift when ground-truth labels Y arrive with a 30-day delay, and what is the difference between Virtual Drift vs Real Drift?',
      insight: 'Virtual Drift (Covariate Shift) is a change in P(X) without altering P(Y|X); Real Drift is a change in P(Y|X) (the true boundary moves). When labels Y have delayed arrival (e.g. loan defaults take 6 months to materialize), we cannot measure accuracy or real concept drift directly. Instead, we monitor: (1) Input feature drift P(X) via PSI and KS-tests; (2) Prediction distribution drift P(Y_hat) (if the model suddenly predicts 25% fraud instead of the historical 1%, that flags drift even without ground-truth labels); (3) Prediction confidence entropy. If P(X) drifts into regions with low training support density (high epistemic uncertainty), the system flags virtual drift and routes ambiguous inputs to human reviewers or fallback heuristics before catastrophic silent failures occur.',
      failureModesInProduction: [
        'Treating seasonality (e.g. Black Friday shopping spike) as catastrophic concept drift; requires seasonal baseline calibration.'
      ]
    }
  }
];
