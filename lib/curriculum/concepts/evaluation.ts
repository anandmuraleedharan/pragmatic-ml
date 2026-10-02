import { Concept } from '../types';

export const EVALUATION_CONCEPTS: Concept[] = [
  {
    id: 'loss-functions',
    title: 'Loss Functions: Cross-Entropy, MSE & Focal Loss',
    subtitle: 'Mathematical Objectives for Optimization, Probability Calibration & Severe Class Imbalance',
    sectionId: 'evaluation-metrics',
    sectionTitle: 'Evaluation, Loss Functions & Calibration',
    level: 'Core ML',
    tags: ['Loss Functions', 'Optimization', 'Cross-Entropy', 'Focal Loss', 'Class Imbalance'],
    llmAntiPattern: {
      scenario: 'Evaluating classification quality using raw qualitative prompt outputs without computing formal statistical loss metrics.',
      whyItFails: 'Qualitative evaluation cannot quantify uncertainty, calibration, or loss divergence during production shifts.',
      tcoComparison: {
        specialized: { latency: '0.001ms', costPerMillion: '$0.00', determinism: 'Exact Mathematical Objective' },
        llmAlternative: { latency: 'N/A', costPerMillion: 'N/A', determinism: 'Unscientific Eye-Test' }
      }
    },
    intuition: {
      summary: 'A loss function maps model predictions and ground-truth targets to a scalar penalty. Selecting the right loss function dictates whether the model converges to the true conditional mean, median, or probability.',
      keyPoints: [
        'Mean Squared Error (MSE): Penalizes large errors quadratically; outputs converge to the conditional mean E[Y|X]. Sensitive to outliers.',
        'Mean Absolute Error (MAE): Penalizes errors linearly; outputs converge to the conditional median. Highly robust to outliers.',
        'Binary Cross-Entropy (BCE): Negative log-likelihood of Bernoulli distribution; drives predictions to calibrated probabilities.',
        'Focal Loss: Adds a dynamic modulating factor (1 - p_t)^gamma to cross-entropy to down-weight easy, well-classified examples and focus training on hard, rare positives.'
      ],
      detailedExplanation: 'In severe class imbalance (e.g. 1 positive fraud transaction per 10,000 negative legitimate transactions), standard cross-entropy is completely overwhelmed by the cumulative gradient mass of trivial negative examples. Lin et al. created Focal Loss: by scaling loss by (1 - p_t)^gamma, easy examples with p_t = 0.99 have their loss attenuated by a factor of 10,000, forcing the model to concentrate exclusively on ambiguous fraud signals.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Pred["Prediction Probability p_t"] --> LossChoice{"Loss Function"}
    LossChoice --> BCE["Standard Cross-Entropy: -log(p_t) (Overwhelmed by easy negatives)"]
    LossChoice --> Focal["Focal Loss: -(1 - p_t)^gamma * log(p_t) (Down-weights easy examples)"]
    Focal --> Focus["Forces gradients to prioritize hard minority examples!"]
    style LossChoice fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Focal fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Focus fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'Focal Loss modulates Cross-Entropy to prevent massive volumes of easy negative examples from dominating gradient updates.'
    },
    mathematics: {
      coreFormula: '\\text{FL}(p_t) = -\\alpha_t (1 - p_t)^\\gamma \\ln(p_t)',
      variableDefinitions: [
        { symbol: 'p_t', meaning: 'Model estimated probability for the ground-truth class' },
        { symbol: '\\gamma', meaning: 'Focusing parameter (gamma >= 0). When gamma=0, FL is identical to standard Cross-Entropy. Typical gamma=2.0' },
        { symbol: '\\alpha_t', meaning: 'Class weighting balance factor in [0, 1]' }
      ],
      derivationOrIntuition: 'When an example is misclassified and p_t is small, the modulating factor (1 - p_t)^gamma is near 1 and the loss is unaffected. As p_t -> 1 (well classified), the factor approaches 0, scaling down the loss for easy examples.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Extreme class imbalance (fraud detection, ad click prediction with 0.01% CTR, medical cancer detection).',
        'Dense single-stage object detection (RetinaNet).',
        'Severe label skew in multi-label classification.'
      ],
      whenToAvoid: [
        'Balanced classification where standard Cross-Entropy is simpler and calibrates probabilities directly.'
      ],
      complexity: {
        timeTraining: 'O(1) element-wise operations during loss calculation',
        timeInference: 'N/A (Training objective only)',
        space: 'O(1)'
      }
    },
    codeRecipe: {
      framework: 'Python (PyTorch)',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class FocalLoss(nn.Module):
    def __init__(self, alpha=0.25, gamma=2.0, reduction='mean'):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.reduction = reduction

    def forward(self, inputs, targets):
        # inputs: logits, targets: binary labels {0, 1}
        bce_loss = F.binary_cross_entropy_with_logits(inputs, targets, reduction='none')
        pt = torch.exp(-bce_loss) # p_t is probability of true class
        alpha_t = self.alpha * targets + (1 - self.alpha) * (1 - targets)
        focal_loss = alpha_t * (1 - pt) ** self.gamma * bce_loss
        
        return focal_loss.mean() if self.reduction == 'mean' else focal_loss.sum()`,
      explanation: 'Custom PyTorch implementation of numerically stable Focal Loss with logit inputs.'
    },
    principalInterviewFocus: {
      question: 'Why does training with Focal Loss distort probability calibration, and how do you recalibrate the model outputs in production?',
      insight: 'Standard Binary Cross-Entropy is a Proper Scoring Rule: its expected loss is minimized if and only if the predicted probability matches the true underlying conditional distribution P(Y=1|X). Focal Loss is deliberately NOT a proper scoring rule—it artificially alters the loss landscape by multiplying by (1 - p_t)^gamma, which systematically pushes predicted probabilities downward toward 0. In production, if downstream business logic relies on exact probabilities (e.g. expected value bidding in ad tech: Bid = pCTR * Value), the outputs of a Focal Loss model MUST be passed through Platt Scaling (fitting a 1D logistic regression on logits) or Isotonic Regression on a balanced validation set to restore calibration.',
      failureModesInProduction: [
        'Treating raw outputs of Focal Loss directly as calibrated probabilities in financial calculations.'
      ]
    }
  },
  {
    id: 'classification-metrics',
    title: 'Classification Metrics: ROC-AUC vs PR-AUC & F1',
    subtitle: 'Threshold-Free Discrimination, Precision-Recall Curves & The Fallacy of Accuracy',
    sectionId: 'evaluation-metrics',
    sectionTitle: 'Evaluation, Loss Functions & Calibration',
    level: 'Foundational',
    tags: ['Evaluation', 'Metrics', 'ROC-AUC', 'PR-AUC', 'Precision', 'Recall', 'F1-Score'],
    llmAntiPattern: {
      scenario: 'Claiming an ML model is "99.9% accurate" when classifying rare credit card fraud where 99.9% of transactions are legitimate.',
      whyItFails: 'A trivial dummy model that predicts "NOT FRAUD" for every single transaction achieves 99.9% accuracy while catching 0% of fraud.',
      tcoComparison: {
        specialized: { latency: '0.01ms', costPerMillion: '$0.00', determinism: 'Statistically Sound Metric' },
        llmAlternative: { latency: 'N/A', costPerMillion: 'N/A', determinism: 'Misleading Metric Claims' }
      }
    },
    intuition: {
      summary: 'Evaluation metrics evaluate model quality across different operational thresholds. While ROC-AUC evaluates true positive vs false positive rates across all thresholds, PR-AUC is mandatory for imbalanced datasets.',
      keyPoints: [
        'Accuracy is useless on imbalanced data.',
        'Precision: When the model predicts positive, how often is it right? (TP / (TP + FP)).',
        'Recall: Out of all actual positives, how many did the model catch? (TP / (TP + FN)).',
        'F1-Score: Harmonic mean of Precision and Recall, balancing false positives and false negatives.',
        'ROC-AUC evaluates ranking discrimination across all thresholds; PR-AUC focuses exclusively on the positive minority class.'
      ],
      detailedExplanation: 'The Receiver Operating Characteristic (ROC) curve plots True Positive Rate vs False Positive Rate. Because False Positive Rate has True Negatives in the denominator (FP / (FP + TN)), in massive negative datasets (1M negatives, 100 positives), TN dominates, keeping FPR deceptively tiny and giving an artificially inflated ROC-AUC of 0.99. Precision-Recall AUC replaces TN with Precision, exposing high false positive counts immediately.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Confusion["Confusion Matrix"] --> TP["True Positives (TP)"]
    Confusion --> FP["False Positives (FP)"]
    Confusion --> FN["False Negatives (FN)"]
    Confusion --> TN["True Negatives (TN)"]
    TP --> Prec["Precision = TP / (TP + FP)"]
    FP --> Prec
    TP --> Rec["Recall = TP / (TP + FN)"]
    FN --> Rec
    Prec --> F1["F1 = 2 * (Prec * Rec) / (Prec + Rec)"]
    Rec --> F1
    style Confusion fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style F1 fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff`,
      caption: 'Precision, Recall, and the harmonic F1-Score: Key metrics for imbalanced classification.'
    },
    mathematics: {
      coreFormula: 'F_\\beta = (1 + \\beta^2) \\frac{\\text{Precision} \\times \\text{Recall}}{\\beta^2 \\text{Precision} + \\text{Recall}}, \\quad \\text{ROC-AUC} = P(\\hat{y}_{\\text{pos}} > \\hat{y}_{\\text{neg}})',
      variableDefinitions: [
        { symbol: 'F_1', meaning: 'Harmonic mean when beta=1 (equal weighting of precision and recall)' },
        { symbol: '\\beta', meaning: 'Weighting factor: beta=2 weights recall higher (medical diagnosis); beta=0.5 weights precision higher' },
        { symbol: '\\text{ROC-AUC}', meaning: 'Probability that a randomly chosen positive sample is scored higher than a randomly chosen negative sample' }
      ],
      derivationOrIntuition: 'The harmonic mean is used for F1 instead of the arithmetic mean because it severely penalizes extreme values: if Recall is 0.05 and Precision is 1.0, the arithmetic mean is 0.525, but the harmonic mean correctly collapses to 0.095.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Use PR-AUC (Average Precision) whenever the positive class represents < 5% of the dataset.',
        'Use ROC-AUC when evaluating pure ranking capability with roughly balanced classes.',
        'Select the operational decision threshold by calculating business cost: Cost = C_FP * FP + C_FN * FN.'
      ],
      whenToAvoid: [
        'Relying on default 0.5 decision thresholds in production without threshold tuning.'
      ],
      complexity: {
        timeTraining: 'N/A',
        timeInference: 'O(N log N) to sort predictions and compute curve areas',
        space: 'O(N)'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.metrics import classification_report, roc_auc_score, average_precision_score

# Threshold-free ranking metrics
roc_auc = roc_auc_score(y_test, y_probs)
pr_auc = average_precision_score(y_test, y_probs) # PR-AUC

print(f"ROC-AUC: {roc_auc:.4f} | PR-AUC: {pr_auc:.4f}")

# Threshold-dependent metrics (custom threshold e.g. 0.35)
y_pred_tuned = (y_probs >= 0.35).astype(int)
print(classification_report(y_test, y_pred_tuned))`,
      explanation: 'Computes ROC-AUC, PR-AUC, and tunes the decision threshold for optimal precision-recall balance.'
    },
    principalInterviewFocus: {
      question: 'What is the Wilcoxon-Mann-Whitney U statistic interpretation of ROC-AUC, and how do you determine the optimal operational threshold under asymmetric business costs?',
      insight: 'ROC-AUC is mathematically equivalent to the Wilcoxon-Mann-Whitney U test: it is the exact probability that a randomly drawn positive instance will receive a higher predicted score than a randomly drawn negative instance: AUC = sum I(score_pos > score_neg) / (N_pos * N_neg). To determine the optimal threshold in production, we define the expected business loss: L(t) = Cost_FN * P(pos) * (1 - Recall(t)) + Cost_FP * P(neg) * FPR(t). By plotting the cost curve across all thresholds t in [0, 1], we pick the exact threshold that minimizes total monetary loss.',
      failureModesInProduction: [
        'Evaluating with ROC-AUC on a 1:10,000 imbalanced dataset and celebrating a 0.98 score while user-facing precision is under 2%.'
      ]
    }
  }
];
