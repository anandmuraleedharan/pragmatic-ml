import { Concept } from '../types';

export const SUPERVISED_CONCEPTS: Concept[] = [
  {
    id: 'logistic-regression',
    title: 'Logistic Regression',
    subtitle: 'Probabilistic Classification with Logit Link Function & Maximum Likelihood',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Foundational',
    tags: ['Classification', 'Linear Models', 'Probabilistic', 'Sigmoid', 'Maximum Likelihood'],
    llmAntiPattern: {
      scenario: 'Calling an LLM with a 1,000-token prompt to output a binary "YES" or "NO" label for click-through rate (CTR) prediction on 10 million ad impressions per day.',
      whyItFails: 'Costs $20,000/day in API charges, adds 500ms latency to real-time ad bidding (which has a 10ms hard timeout), and provides uncalibrated confidence numbers.',
      tcoComparison: {
        specialized: { latency: '0.005ms', costPerMillion: '$0.00', determinism: '100% Calibrated Probability' },
        llmAlternative: { latency: '800ms', costPerMillion: '$2,000', determinism: 'Uncalibrated Natural Language' }
      }
    },
    intuition: {
      summary: 'Logistic Regression models the log-odds of a binary event as a linear combination of independent variables, mapping the output to a calibrated [0, 1] probability via the Sigmoid function.',
      keyPoints: [
        'Unlike Linear Regression, the predicted values are strictly bounded between 0 and 1.',
        'The decision boundary is a linear hyperplane in feature space.',
        'Trained using Maximum Likelihood Estimation (MLE) via Binary Cross-Entropy (Log-Loss).',
        'Coefficients have direct interpretability: e^{beta_i} represents the odds ratio multiplier for a unit increase in feature x_i.'
      ],
      detailedExplanation: 'Linear regression cannot be directly used for probabilities because it predicts values in (-infinity, +infinity). Logistic regression solves this by modeling the log-odds (logit): ln(p / (1 - p)) = w^T x + b. Inverting this equation yields the Sigmoid function sigma(z) = 1 / (1 + e^{-z}), giving an exact probabilistic interpretation.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Input["Linear Combination: z = w^T x + b"] --> Sigmoid["Sigmoid Function: 1 / (1 + e^-z)"]
    Sigmoid --> Output["Calibrated Probability P(Y=1|X) in [0, 1]"]
    Output --> Decision["Decision Threshold (e.g. 0.5) -> Class 0 or 1"]
    style Input fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Sigmoid fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style Output fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Decision fill:#1e293b,stroke:#f59e0b,stroke-width:1px,color:#fff`,
      caption: 'Logistic Regression: Continuous linear score z is transformed through Sigmoid into a calibrated probability.'
    },
    mathematics: {
      coreFormula: 'P(Y=1|\\mathbf{x}) = \\sigma(\\mathbf{w}^T \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^T \\mathbf{x} + b)}}',
      variableDefinitions: [
        { symbol: '\\mathbf{w}', meaning: 'Weight vector (learned model parameters)' },
        { symbol: '\\mathbf{x}', meaning: 'Feature input vector' },
        { symbol: 'b', meaning: 'Bias / intercept scalar' },
        { symbol: '\\sigma(z)', meaning: 'Standard Sigmoid / logistic function' },
        { symbol: '\\mathcal{L}_{\\text{BCE}}', meaning: 'Binary Cross-Entropy Loss: -\\frac{1}{N} \\sum_{i=1}^N \\left[ y_i \\ln(\\hat{y}_i) + (1 - y_i) \\ln(1 - \\hat{y}_i) \\right]' }
      ],
      derivationOrIntuition: 'The Log-Loss is strictly convex with respect to w, ensuring that gradient descent will always converge to the global minimum with no local minima traps.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Real-time Click-Through Rate (CTR) and conversion prediction in ad tech under 5ms SLAs.',
        'Credit risk scoring, medical triage, and financial underwriting requiring strict regulatory interpretability.',
        'High-dimensional sparse text classification (e.g. spam detection with bag-of-words).'
      ],
      whenToAvoid: [
        'Complex non-linear relationships or image/audio data (use GBDTs or Neural Networks).'
      ],
      complexity: {
        timeTraining: 'O(N * d * iterations) via L-BFGS or SGD',
        timeInference: 'O(d) dot product + 1 exp operation',
        space: 'O(d) storing weight vector w'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Pipeline ensures zero feature leakage during scaling
model = make_pipeline(
    StandardScaler(),
    LogisticRegression(penalty='l2', C=1.0, solver='lbfgs', max_iter=1000)
)

# Train
model.fit(X_train, y_train)

# Inference (returns calibrated probabilities)
probabilities = model.predict_proba(X_test)[:, 1]`,
      explanation: 'Fits a regularized logistic regression model with feature standardization, returning calibrated probabilities in microseconds.'
    },
    principalInterviewFocus: {
      question: 'How do you interpret the coefficients of Logistic Regression, and why is feature scaling critical when applying L1/L2 regularization?',
      insight: 'The coefficient beta_i represents the change in log-odds per unit change in x_i. Exponentiating e^{beta_i} gives the Odds Ratio: if beta_i = 0.693, e^{0.693} = 2.0, meaning each unit increase doubles the odds of the positive outcome. Feature scaling is essential because regularization penalties (lambda * sum w_i^2) treat all weights equally. If feature 1 has scale [0, 1000] and feature 2 has scale [0, 1], feature 1 will naturally have a tiny weight and escape regularization, while feature 2 will be penalized unfairly.',
      failureModesInProduction: [
        'Separable data (perfect classification) causing weights to diverge to infinity unless L2 regularization is enforced.',
        'Concept drift altering baseline prior probabilities, requiring recalibration via Platt scaling or temperature scaling.'
      ]
    }
  },
  {
    id: 'linear-regression-regularization',
    title: 'Linear Regression & Regularization (Ridge, Lasso, ElasticNet)',
    subtitle: 'Ordinary Least Squares, Feature Selection via L1 Sparsity, and L2 Variance Shrinkage',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Foundational',
    tags: ['Regression', 'OLS', 'Ridge', 'Lasso', 'ElasticNet', 'Regularization'],
    llmAntiPattern: {
      scenario: 'Asking an LLM to predict housing prices, customer lifetime value (LTV), or financial quarterly revenue based on numerical tabular columns.',
      whyItFails: 'LLMs are terrible at arithmetic interpolation, fail on tabular scale, cannot guarantee monotonic trends, and hallucinate numerical estimates.',
      tcoComparison: {
        specialized: { latency: '0.001ms', costPerMillion: '$0.00', determinism: 'Analytically Closed-Form' },
        llmAlternative: { latency: '1,500ms', costPerMillion: '$4,000', determinism: 'Inconsistent Number Guessing' }
      }
    },
    intuition: {
      summary: 'Linear regression finds the hyperplane that minimizes the sum of squared residuals between observed and predicted continuous values.',
      keyPoints: [
        'Ordinary Least Squares (OLS) has a closed-form analytical solution: beta = (X^T X)^{-1} X^T y.',
        'When features are collinear, X^T X is near-singular, causing OLS variance to explode.',
        'Ridge (L2) adds a spherical penalty that shrinks weights toward zero without setting them to zero.',
        'Lasso (L1) has sharp corners on its constraint surface, driving unimportant coefficients exactly to zero (automatic feature selection).'
      ],
      detailedExplanation: 'ElasticNet combines both L1 and L2 penalties: it achieves sparsity like Lasso while maintaining group selection stability like Ridge when predictors are strongly correlated.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    subgraph Constraint Geometries
        L1["L1 (Lasso): Diamond Contours -> Hits Corners (Exact Zeros / Sparse)"]
        L2["L2 (Ridge): Circular Contours -> Smooth Shrinkage (Never Exact Zero)"]
    end
    style L1 fill:#1e293b,stroke:#34d399,stroke-width:2px,color:#fff
    style L2 fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff`,
      caption: 'L1 diamond geometry intercepts OLS contours at axis corners (driving coefficients to 0), whereas L2 sphere shrinks smoothly.'
    },
    mathematics: {
      coreFormula: '\\min_{\\mathbf{w}} \\frac{1}{2N} \\|\\mathbf{y} - \\mathbf{X}\\mathbf{w}\\|_2^2 + \\lambda \\left( \\alpha \\|\\mathbf{w}\\|_1 + \\frac{1 - \\alpha}{2} \\|\\mathbf{w}\\|_2^2 \\right)',
      variableDefinitions: [
        { symbol: '\\mathbf{X}', meaning: 'Design matrix of shape N x d' },
        { symbol: '\\mathbf{y}', meaning: 'Continuous target vector of length N' },
        { symbol: '\\lambda', meaning: 'Overall regularization penalty strength' },
        { symbol: '\\alpha', meaning: 'ElasticNet mixing ratio (alpha=1: Lasso, alpha=0: Ridge)' }
      ],
      derivationOrIntuition: 'For Ridge regression (alpha=0), the normal equation is beta_ridge = (X^T X + lambda I)^{-1} X^T y. Adding lambda * I to the diagonal guarantees the matrix is strictly invertible even when X is rank-deficient.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Predicting real continuous numbers (pricing, demand, load forecasting).',
        'Automatic feature selection on wide datasets with d > N (Lasso).',
        'Baseline benchmark for all tabular regression pipelines.'
      ],
      whenToAvoid: [
        'Complex non-linear interactions without polynomial expansion (use XGBoost/LightGBM).'
      ],
      complexity: {
        timeTraining: 'O(N * d^2 + d^3) closed-form or O(N * d) per epoch via coordinate descent',
        timeInference: 'O(d) vector dot product',
        space: 'O(d)'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.linear_model import ElasticNetCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# ElasticNet with automated Cross-Validated lambda and alpha tuning
regressor = make_pipeline(
    StandardScaler(),
    ElasticNetCV(l1_ratio=[.1, .5, .7, .9, .95, .99, 1], cv=5)
)

regressor.fit(X_train, y_train)
y_pred = regressor.predict(X_test)`,
      explanation: 'Applies ElasticNet with 5-fold cross-validation to automatically select optimal L1/L2 shrinkage balance.'
    },
    principalInterviewFocus: {
      question: 'Geometrically and mathematically, why does Lasso (L1) produce sparse weights while Ridge (L2) does not?',
      insight: 'In constrained optimization (Lagrange multipliers), we minimize the quadratic bowl of OLS residuals subject to a constraint region. For L2, the constraint ||w||_2^2 <= C is a smooth hypersphere; the elliptical level curves of OLS touch this sphere generically along smooth arcs where no coordinate is zero. For L1, the constraint ||w||_1 <= C is a cross-polytope (diamond in 2D) with sharp vertices located directly on the coordinate axes. Because the contours of the OLS loss are far more likely to intersect these sharp corners first, the corresponding coefficients are driven exactly to zero.',
      failureModesInProduction: [
        'Multicollinearity causing Lasso to pick one arbitrary feature from a group of correlated features while zeroing out the rest; ElasticNet is required.'
      ]
    }
  },
  {
    id: 'decision-trees',
    title: 'Decision Trees (CART)',
    subtitle: 'Recursive Binary Partitioning with Gini Impurity, Entropy & Tree Pruning',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Foundational',
    tags: ['Trees', 'Non-linear', 'Interpretability', 'Gini', 'Entropy', 'CART'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM to follow a 20-step conditional rulebook for insurance eligibility.',
      whyItFails: 'LLMs hallucinate logic, forget nested if-else constraints midway through the generation, and cannot be audited for regulatory compliance.',
      tcoComparison: {
        specialized: { latency: '0.01ms', costPerMillion: '$0.00', determinism: '100% Deterministic Rule Engine' },
        llmAlternative: { latency: '2,000ms', costPerMillion: '$5,000', determinism: 'Prone to Rule Skips' }
      }
    },
    intuition: {
      summary: 'Decision Trees split the feature space recursively into axis-aligned hyper-rectangles, making decisions through hierarchical if-then conditions.',
      keyPoints: [
        'Requires zero feature normalization or scaling (invariant to monotonic transformations).',
        'Splits are chosen greedily at each node by maximizing Information Gain or minimizing Gini Impurity.',
        'Highly interpretable: can be exported directly to flowchart diagrams or C/SQL code.',
        'Major weakness: Prone to extreme overfitting (high variance) without depth limits or pruning.'
      ],
      detailedExplanation: 'At each node, the algorithm scans every feature and every possible threshold value, calculating the impurity reduction. The split yielding the greatest reduction becomes the decision branch. Unconstrained trees will memorize the training set with 100% accuracy and poor generalization.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Root["Age <= 30?"] -->|Yes| Left["Income <= $50k?"]
    Root -->|No| Right["Credit Score >= 700?"]
    Left -->|Yes| Reject1["Decline Loan (Gini: 0.0)"]
    Left -->|No| Approve1["Approve Loan (Gini: 0.1)"]
    Right -->|Yes| Approve2["Approve Loan (Gini: 0.0)"]
    Right -->|No| Review["Manual Review (Gini: 0.4)"]
    style Root fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Left fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff
    style Right fill:#1e293b,stroke:#818cf8,stroke-width:1px,color:#fff
    style Approve1 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Approve2 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style Reject1 fill:#e11d48,stroke:#fda4af,stroke-width:2px,color:#fff`,
      caption: 'Hierarchical axis-aligned splits partitioning feature space into pure decision leaves.'
    },
    mathematics: {
      coreFormula: '\\text{Gini}(D) = 1 - \\sum_{k=1}^K p_k^2, \\quad H(D) = -\\sum_{k=1}^K p_k \\log_2(p_k)',
      variableDefinitions: [
        { symbol: 'p_k', meaning: 'Proportion of instances in node dataset D belonging to class k' },
        { symbol: '\\text{Gini}(D)', meaning: 'Gini impurity: probability of misclassifying a randomly chosen element' },
        { symbol: 'H(D)', meaning: 'Shannon Entropy (measure of disorder/information content)' },
        { symbol: '\\Delta \\text{Gini}', meaning: 'Impurity reduction: Gini(D) - \\frac{|D_L|}{|D|} Gini(D_L) - \\frac{|D_R|}{|D|} Gini(D_R)' }
      ],
      derivationOrIntuition: 'CART uses Gini by default because it avoids expensive log computations required by Entropy, resulting in identical split decisions in over 98% of practical cases.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Auditable rule-based decision workflows (credit approvals, medical risk scoring).',
        'Tabular datasets with mixed categorical and numerical features.',
        'Feature importance profiling before complex modeling.'
      ],
      whenToAvoid: [
        'Tasks with smooth diagonal decision boundaries (trees struggle because splits are axis-aligned, creating a jagged staircase approximation).'
      ],
      complexity: {
        timeTraining: 'O(d * N log N) for building depth-bounded trees',
        timeInference: 'O(\\text{depth}) - typically <= 10 comparisons, sub-microsecond',
        space: 'O(\\text{nodes})'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.tree import DecisionTreeClassifier, export_text

# Cost-Complexity Pruning (ccp_alpha) prevents overfitting
clf = DecisionTreeClassifier(
    max_depth=5,
    min_samples_split=20,
    min_samples_leaf=10,
    ccp_alpha=0.01
)

clf.fit(X_train, y_train)

# Export as auditable human-readable decision rules
rules = export_text(clf, feature_names=feature_names)
print(rules)`,
      explanation: 'Fits a cost-complexity pruned decision tree and exports exact production if-then decision logic.'
    },
    principalInterviewFocus: {
      question: 'How does Cost-Complexity Pruning (CCP / Minimal Cost-Complexity) mathematically determine the optimal subtree?',
      insight: 'Minimal Cost-Complexity Pruning defines a cost function R_alpha(T) = R(T) + alpha * |T|, where R(T) is the misclassification rate and |T| is the number of terminal leaves. The hyperparameter alpha governs the penalty per leaf. As alpha increases from 0 to infinity, a finite nested sequence of pruned subtrees T_0 > T_1 > T_2 > ... is generated. By evaluating each candidate subtree via k-fold cross-validation, we select the exact alpha that maximizes validation performance without arbitrary max_depth heuristics.',
      failureModesInProduction: [
        'Data imbalance causing splits to isolate single outlier instances in leaf nodes.'
      ]
    }
  },
  {
    id: 'random-forests',
    title: 'Random Forests',
    subtitle: 'Ensemble Bagging with Feature Sub-sampling & Out-of-Bag Error Validation',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Core ML',
    tags: ['Ensembles', 'Bagging', 'Bootstrap', 'Variance Reduction', 'Feature Importance'],
    llmAntiPattern: {
      scenario: 'Using an LLM to predict tabular fraud transactions from hundreds of dense user behavioral columns.',
      whyItFails: 'LLMs cannot compute statistical variance or feature split correlations across thousands of rows efficiently.',
      tcoComparison: {
        specialized: { latency: '1.5ms', costPerMillion: '$0.00', determinism: '100% Robust Ensemble' },
        llmAlternative: { latency: '2,400ms', costPerMillion: '$8,000', determinism: 'Stochastic Predictions' }
      }
    },
    intuition: {
      summary: 'Random Forests train an ensemble of deep, uncorrelated decision trees on bootstrap samples of the data and random subsets of features, averaging their predictions to slash variance.',
      keyPoints: [
        'Applies Bagging (Bootstrap Aggregating): trains each tree on N samples drawn with replacement.',
        'At each split, considers only a random subset of features (typically sqrt(d)), de-correlating the trees.',
        'Individual trees have high variance and low bias; averaging B trees reduces variance by a factor of 1/B while keeping bias constant.',
        'Provides free validation via Out-Of-Bag (OOB) samples (about 36.8% of training data is left out of each bootstrap sample).'
      ],
      detailedExplanation: 'If one feature is an overwhelming predictor, all single decision trees would split on it first, making the trees highly correlated. By forcing each split to consider only a random fraction of features, weaker but informative features get explored, creating a diverse committee of models.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Data["Training Dataset (N rows, d features)"] --> B1["Bootstrap Sample 1 (sqrt(d) features)"]
    Data --> B2["Bootstrap Sample 2 (sqrt(d) features)"]
    Data --> B3["Bootstrap Sample B (sqrt(d) features)"]
    B1 --> T1["Deep Tree 1"]
    B2 --> T2["Deep Tree 2"]
    B3 --> TB["Deep Tree B"]
    T1 --> Vote["Majority Voting / Average"]
    T2 --> Vote
    TB --> Vote
    Vote --> Output["Robust Ensemble Prediction (Low Variance)"]
    style Data fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Vote fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff
    style Output fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'Bagging + Feature Subsampling: Multiple uncorrelated deep trees vote to produce a low-variance prediction.'
    },
    mathematics: {
      coreFormula: '\\text{Var}(\\bar{T}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2',
      variableDefinitions: [
        { symbol: 'B', meaning: 'Number of ensemble trees in the forest' },
        { symbol: '\\sigma^2', meaning: 'Variance of each individual decision tree' },
        { symbol: '\\rho', meaning: 'Pairwise correlation between trees' },
        { symbol: '\\text{Var}(\\bar{T})', meaning: 'Variance of the ensemble average prediction' }
      ],
      derivationOrIntuition: 'As B -> infinity, the second term vanishes, leaving rho * sigma^2. The only way to further reduce ensemble variance is to minimize tree correlation rho. Random feature selection directly drives rho down.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Robust out-of-the-box tabular classification and regression with virtually no hyperparameter tuning needed.',
        'When Out-Of-Bag (OOB) scoring is needed without maintaining a separate validation split.',
        'Ranking global feature importances across high-dimensional data.'
      ],
      whenToAvoid: [
        'Extrapolating trends outside the training range (trees cannot extrapolate continuous trends beyond min/max values seen during training).'
      ],
      complexity: {
        timeTraining: 'O(B * d_sub * N log N) - fully parallelizable across CPU cores',
        timeInference: 'O(B * \\text{depth}) - sub-millisecond on multi-core CPU',
        space: 'O(B * \\text{nodes})'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.ensemble import RandomForestClassifier

# n_jobs=-1 utilizes all CPU cores concurrently
rf = RandomForestClassifier(
    n_estimators=200,
    max_features='sqrt',
    oob_score=True,
    n_jobs=-1,
    random_state=42
)

rf.fit(X_train, y_train)

# Out-of-Bag validation accuracy without separate test set
print(f"OOB Accuracy: {rf.oob_score_:.4f}")
# Feature Importances (MDI)
print(rf.feature_importances_)`,
      explanation: 'Trains an ensemble of 200 trees in parallel, computing Out-of-Bag generalization score automatically.'
    },
    principalInterviewFocus: {
      question: 'Why is Out-Of-Bag (OOB) sample probability approximately 36.8%, and why can Mean Decrease in Impurity (MDI) feature importance be dangerously biased?',
      insight: 'The probability of a specific row not being chosen in a bootstrap sample of size N with replacement is (1 - 1/N)^N. In the limit as N -> infinity, lim (1 - 1/N)^N = 1/e ~ 0.3679 (~36.8%). Regarding MDI: tree algorithms greedily pick features with high cardinality (e.g. unique user IDs or timestamps) because random noise in many categories provides opportunities for spurious impurity drops. In production, Permutation Feature Importance or SHAP values should always be used over default tree MDI.',
      failureModesInProduction: [
        'Extrapolation failure in time-series forecasting (trees can only predict constants within the bounds of historical training leaves).'
      ]
    }
  },
  {
    id: 'xgboost-gbdt',
    title: 'Gradient Boosted Decision Trees (XGBoost / LightGBM)',
    subtitle: 'Sequential Gradient & Hessian Residual Fitting with Histogram Binning',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Core ML',
    tags: ['GBDT', 'XGBoost', 'LightGBM', 'Boosting', 'Gradients', 'Hessian', 'Kaggle Standard'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM to evaluate tabular risk or loan default probabilities on a dataset of 500,000 credit records.',
      whyItFails: 'LLMs underperform GBDTs on tabular datasets by large margins, cost millions in API calls, and fail to exploit complex non-linear numerical boundaries.',
      tcoComparison: {
        specialized: { latency: '0.2ms', costPerMillion: '$0.00', determinism: 'Gold Standard Tabular Benchmark' },
        llmAlternative: { latency: '2,500ms', costPerMillion: '$10,000', determinism: 'Inferior Tabular Accuracy' }
      }
    },
    intuition: {
      summary: 'Gradient Boosting builds trees sequentially. Each new tree fits directly to the pseudo-residuals (negative gradient of the loss function) of the existing ensemble.',
      keyPoints: [
        'Unlike Random Forests (which build independent deep trees in parallel), GBDT builds shallow trees sequentially.',
        'XGBoost optimizes an objective using both first-order gradients (g_i) and second-order Hessians (h_i) via Taylor expansion.',
        'LightGBM accelerates training by binning continuous features into discrete histograms (GOSS) and growing trees leaf-wise (best-first).',
        'Universally recognized as the reigning state-of-the-art for tabular data across Kaggle competitions and production industry systems.'
      ],
      detailedExplanation: 'At step m, the model calculates the residual errors of the current predictions. The m-th tree is trained to predict these residuals, scaled by a shrinkage factor (learning rate eta) to prevent overfitting: F_m(x) = F_{m-1}(x) + eta * f_m(x).'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    F0["Initial Base Prediction F0 (Log-Odds or Mean)"] --> R1["Compute Residuals r1 = y - F0"]
    R1 --> T1["Tree 1 (Fits r1)"]
    T1 --> F1["F1 = F0 + eta * T1"]
    F1 --> R2["Compute Residuals r2 = y - F1"]
    R2 --> T2["Tree 2 (Fits r2)"]
    T2 --> FM["F_m = F_{m-1} + eta * T_m"]
    style F0 fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style T1 fill:#1e293b,stroke:#34d399,stroke-width:2px,color:#fff
    style T2 fill:#1e293b,stroke:#34d399,stroke-width:2px,color:#fff
    style FM fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff`,
      caption: 'Sequential residual fitting: Each subsequent tree corrects the residual errors of all preceding trees.'
    },
    mathematics: {
      coreFormula: '\\mathcal{L}^{(t)} \\approx \\sum_{i=1}^n \\left[ g_i f_t(\\mathbf{x}_i) + \\frac{1}{2} h_i f_t^2(\\mathbf{x}_i) \\right] + \\gamma T + \\frac{1}{2} \\lambda \\sum_{j=1}^T w_j^2',
      variableDefinitions: [
        { symbol: 'g_i', meaning: 'First-order gradient of loss function: \\partial_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})' },
        { symbol: 'h_i', meaning: 'Second-order Hessian of loss function: \\partial^2_{\\hat{y}^{(t-1)}} l(y_i, \\hat{y}^{(t-1)})' },
        { symbol: 'w_j', meaning: 'Output weight score of leaf j' },
        { symbol: '\\gamma, \\lambda', meaning: 'Tree complexity and L2 leaf regularization penalties' }
      ],
      derivationOrIntuition: 'By taking the second-order Taylor series approximation of arbitrary loss functions, XGBoost derives an exact closed-form optimal weight for each leaf: w_j^* = - \\frac{\\sum_{i \\in I_j} g_i}{\\sum_{i \\in I_j} h_i + \\lambda}, and split gain: \\text{Gain} = \\frac{1}{2} \\left[ \\frac{G_L^2}{H_L + \\lambda} + \\frac{G_R^2}{H_R + \\lambda} - \\frac{(G_L + G_R)^2}{H_L + H_R + \\lambda} \\right] - \\gamma.'
    },
    engineeringCriteria: {
      whenToUse: [
        'Structured tabular data (financial risk, pricing, churn, ranking, search relevance).',
        'When maximizing predictive accuracy on tabular features is the top priority.',
        'Learning-to-Rank (LambdaMART) in search engines.'
      ],
      whenToAvoid: [
        'Unstructured raw computer vision, speech, or raw token text sequences (use Deep Learning).'
      ],
      complexity: {
        timeTraining: 'O(M * d * N) with histogram binning in LightGBM',
        timeInference: 'O(M * \\text{depth}) - microsecond latency via Treelite C++ compilation',
        space: 'O(M * \\text{nodes})'
      }
    },
    codeRecipe: {
      framework: 'Python (LightGBM)',
      code: `import lightgbm as lgb

# LightGBM Dataset with automated histogram binning
train_data = lgb.Dataset(X_train, label=y_train)

params = {
    'objective': 'binary',
    'metric': 'auc',
    'boosting_type': 'gbdt',
    'learning_rate': 0.05,
    'num_leaves': 31,
    'feature_fraction': 0.8,
    'bagging_fraction': 0.8,
    'verbose': -1
}

# Train with early stopping on validation set
model = lgb.train(
    params,
    train_data,
    num_boost_round=1000,
    valid_sets=[val_data],
    callbacks=[lgb.early_stopping(50)]
)`,
      explanation: 'Trains a gradient boosted model with histogram binning and early stopping to prevent over-fitting.'
    },
    principalInterviewFocus: {
      question: 'How does XGBoost utilize the Hessian (second derivative) compared to standard gradient boosting, and why is leaf-wise tree growth in LightGBM faster than level-wise growth?',
      insight: 'Standard GBDT (like early sklearn) only uses first-order gradients, approximating Newton-Raphson steps via a line search. XGBoost uses the exact second-order Hessian h_i in its Taylor approximation, enabling exact Newton steps that converge in fewer boosting rounds. For tree growth: XGBoost defaults to level-wise (depth-first) growth, splitting all nodes at a given depth uniformly. LightGBM uses leaf-wise (best-first) growth, splitting only the single leaf with the highest potential loss reduction. This achieves lower loss with fewer leaves, though it requires strict max_depth constraints to prevent overfitting on small datasets.',
      failureModesInProduction: [
        'Overfitting due to excessive num_leaves or high learning_rate without early stopping.'
      ]
    }
  },
  {
    id: 'support-vector-machines',
    title: 'Support Vector Machines (SVM)',
    subtitle: 'Maximum Margin Hyperplanes, Soft Margins & The Dual Kernel Trick',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Core ML',
    tags: ['SVM', 'Kernels', 'Convex Optimization', 'Margin', 'RBF Kernel'],
    llmAntiPattern: {
      scenario: 'Prompting an LLM to classify medical genomics vectors (e.g. 20,000 gene expressions on 200 patient samples).',
      whyItFails: 'LLMs cannot process thousands of continuous gene expression floats accurately; linear SVMs excel on wide datasets (d >> N).',
      tcoComparison: {
        specialized: { latency: '0.02ms', costPerMillion: '$0.00', determinism: 'Convex Global Optimum' },
        llmAlternative: { latency: '3,000ms', costPerMillion: '$12,000', determinism: 'Prone to Hallucinations' }
      }
    },
    intuition: {
      summary: 'SVM finds the unique decision hyperplane that maximizes the geometric margin (buffer distance) between classes, depending only on the critical boundary data points called Support Vectors.',
      keyPoints: [
        'Maximizes the margin 2 / ||w||, providing strong theoretical generalization bounds (Vapnik-Chervonenkis dimension).',
        'Points not on the margin boundary have zero influence on the final model weights.',
        'The Kernel Trick maps non-linear data into an infinite-dimensional feature space without ever explicitly computing coordinates in that space.',
        'Formulated as a Quadratic Programming (QP) convex optimization problem with zero local minima.'
      ],
      detailedExplanation: 'If classes are not linearly separable in the current dimension, a kernel function (such as the Radial Basis Function / Gaussian RBF: K(x, y) = exp(-gamma ||x - y||^2)) computes dot products as if the data had been projected into an infinite-dimensional Hilbert space where linear separation is possible.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    subgraph Maximum Margin
        H1["Margin Boundary (+1)"] --- SV1["Support Vector (+)"]
        Plane["Optimal Hyperplane: w^T x + b = 0"]
        H2["Margin Boundary (-1)"] --- SV2["Support Vector (-)"]
    end
    style Plane fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style SV1 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style SV2 fill:#e11d48,stroke:#fda4af,stroke-width:2px,color:#fff`,
      caption: 'The decision boundary is uniquely determined by the support vectors lying directly on the margin.'
    },
    mathematics: {
      coreFormula: '\\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}} \\frac{1}{2} \\|\\mathbf{w}\\|_2^2 + C \\sum_{i=1}^N \\xi_i, \\quad \\text{s.t. } y_i(\\mathbf{w}^T \\phi(\\mathbf{x}_i) + b) \\ge 1 - \\xi_i',
      variableDefinitions: [
        { symbol: '\\mathbf{w}', meaning: 'Normal vector to the separating hyperplane' },
        { symbol: 'C', meaning: 'Regularization hyperparameter balancing margin width vs slack penalties' },
        { symbol: '\\xi_i', meaning: 'Slack variable allowing soft-margin boundary violations' },
        { symbol: 'K(\\mathbf{x}, \\mathbf{z})', meaning: 'Kernel function: \\phi(\\mathbf{x})^T \\phi(\\mathbf{z}) = \\exp(-\\gamma \\|\\mathbf{x} - \\mathbf{z}\\|_2^2)' }
      ],
      derivationOrIntuition: 'In the dual formulation, the optimization depends solely on dot products: \\max_\\alpha \\sum_i \\alpha_i - \\frac{1}{2} \\sum_{i, j} \\alpha_i \\alpha_j y_i y_j K(\\mathbf{x}_i, \\mathbf{x}_j). Non-zero Lagrange multipliers \\alpha_i identify the support vectors.'
    },
    engineeringCriteria: {
      whenToUse: [
        'High-dimensional datasets with small sample size (d >> N), such as genomics, bioinformatics, and text classification.',
        'When robust geometric margin separation is required.',
        'Complex non-linear decision boundaries via RBF or polynomial kernels.'
      ],
      whenToAvoid: [
        'Massive training sets with N > 200,000 samples (kernel SVM training scales as O(N^2) to O(N^3); use LinearSVC or GBDTs instead).'
      ],
      complexity: {
        timeTraining: 'O(N^2) to O(N^3) for kernel SVM via Sequential Minimal Optimization (SMO)',
        timeInference: 'O(N_{\\text{SV}} * d) where N_SV is the number of support vectors',
        space: 'O(N_{\\text{SV}} * d)'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# SVM with Radial Basis Function (RBF) kernel
pipeline = make_pipeline(
    StandardScaler(),
    SVC(C=1.0, kernel='rbf', gamma='scale', probability=True)
)

pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)`,
      explanation: 'Fits an RBF kernel SVM with standardized features, applying Platt scaling for probability estimates.'
    },
    principalInterviewFocus: {
      question: 'What is Mercer’s Theorem, and why does the RBF kernel correspond to an infinite-dimensional feature space?',
      insight: 'Mercer’s Theorem states that any continuous, symmetric, positive semi-definite kernel function K(x, y) can be expressed as an inner product in some Hilbert feature space. For the Gaussian RBF kernel exp(-gamma ||x - y||^2), expanding the exponential via Taylor series yields an infinite sum of polynomial interaction terms: exp(-||x||^2) exp(-||y||^2) sum_{k=0}^infinity (2 gamma x . y)^k / k!. Because the sum runs to infinity, the implicit feature mapping phi(x) has infinite dimensions, allowing SVM to create arbitrarily complex smooth separation boundaries with a simple closed-form calculation.',
      failureModesInProduction: [
        'Training latency stalling on large datasets due to quadratic kernel Gram matrix memory requirements.'
      ]
    }
  },
  {
    id: 'naive-bayes',
    title: 'Naive Bayes Classifier',
    subtitle: 'Probabilistic Classification with Feature Conditional Independence & Laplace Smoothing',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Foundational',
    tags: ['Bayesian', 'Probability', 'Spam Filtering', 'NLP', 'Laplace Smoothing'],
    llmAntiPattern: {
      scenario: 'Routing inbound emails to "spam" vs "ham" using an LLM API at 10,000 emails per minute.',
      whyItFails: 'Costs thousands of dollars daily and takes 1,000ms per email, when Naive Bayes does it in 0.05ms with 99.5% accuracy.',
      tcoComparison: {
        specialized: { latency: '0.05ms', costPerMillion: '$0.00', determinism: '100% Deterministic Counts' },
        llmAlternative: { latency: '1,200ms', costPerMillion: '$3,500', determinism: 'High Cost & Latency' }
      }
    },
    intuition: {
      summary: 'Naive Bayes applies Bayes’ Theorem with the strong ("naive") assumption that all features are conditionally independent given the class label.',
      keyPoints: [
        'Despite the independence assumption rarely holding true in reality, it performs remarkably well in practice.',
        'Training requires just a single linear scan through the dataset to tally word/feature frequency tables.',
        'Laplace (add-1) smoothing prevents zero-probability multiplication when encountering unseen words.',
        'Extremely robust against irrelevant features and works exceptionally well with tiny amounts of training data.'
      ],
      detailedExplanation: 'To classify a document, Naive Bayes computes P(C|X) proportional to P(C) * prod P(x_i|C). By working in log-space (summing log probabilities), it avoids numerical underflow from multiplying hundreds of small decimal fractions.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph LR
    Input["Tokens: 'Win', 'Free', 'Cash'"] --> Likelihood["Class Likelihoods: P(Token|Spam) vs P(Token|Ham)"]
    Likelihood --> LogSum["Sum Log-Probabilities: log P(C) + sum log P(w|C)"]
    LogSum --> ArgMax["argmax Class -> 'Spam' (0.05ms)"]
    style Input fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style LogSum fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff
    style ArgMax fill:#e11d48,stroke:#fda4af,stroke-width:3px,color:#fff`,
      caption: 'Naive Bayes: Fast additive log-probability scoring across conditional token frequencies.'
    },
    mathematics: {
      coreFormula: '\\hat{y} = \\arg\\max_{c \\in C} \\left[ \\ln P(C=c) + \\sum_{i=1}^d \\ln P(x_i | C=c) \\right]',
      variableDefinitions: [
        { symbol: 'P(C=c)', meaning: 'Prior probability of class c (fraction of documents in training set)' },
        { symbol: 'P(x_i | C=c)', meaning: 'Conditional likelihood: \\frac{N_{ci} + \\alpha}{N_c + \\alpha d} (Laplace smoothed)' },
        { symbol: '\\alpha', meaning: 'Smoothing parameter (alpha=1 for Laplace smoothing)' },
        { symbol: 'd', meaning: 'Vocabulary size' }
      ],
      derivationOrIntuition: 'Derived directly from Bayes theorem: P(C|X) = P(X|C) P(C) / P(X). The denominator P(X) is constant across all classes and can be dropped during argmax comparison.'
    },
    engineeringCriteria: {
      whenToUse: [
        'High-throughput spam filtering and text categorization.',
        'Cold-start classification with very small training sets.',
        'Multi-class categorization baseline (MultinomialNB).'
      ],
      whenToAvoid: [
        'When feature correlations carry critical meaning (e.g. "not bad" vs "bad").'
      ],
      complexity: {
        timeTraining: 'O(N * d) - single linear pass counting frequencies',
        timeInference: 'O(d) dictionary lookups and additions',
        space: 'O(|C| * d) storing vocabulary count tables'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Multinomial Naive Bayes pipeline with Laplace smoothing (alpha=1.0)
spam_filter = make_pipeline(
    CountVectorizer(stop_words='english', min_df=2),
    MultinomialNB(alpha=1.0)
)

spam_filter.fit(train_texts, train_labels)
predictions = spam_filter.predict(test_texts)`,
      explanation: 'Builds a text spam classifier that trains in milliseconds and classifies in sub-microsecond time.'
    },
    principalInterviewFocus: {
      question: 'Why does Naive Bayes perform well as a classifier even when its conditional independence assumption is catastrophically violated?',
      insight: 'Classification decisions depend only on the argmax ranking of the log-posterior scores, not on the exact calibration of the posterior probabilities themselves. Even if correlated features artificially exaggerate the probabilities toward 0 or 1, the optimal decision boundary is preserved as long as the correct class has a higher score than the alternatives. Furthermore, Domingos & Pazzani proved that under 0-1 loss, Naive Bayes is optimal for a broad class of problems with high feature dependency.',
      failureModesInProduction: [
        'Zero-frequency problem if Laplace smoothing is disabled, which zeros out the entire document probability.'
      ]
    }
  },
  {
    id: 'knn',
    title: 'k-Nearest Neighbors (k-NN)',
    subtitle: 'Instance-Based Non-Parametric Classification & Spatial Voronoi Tessellations',
    sectionId: 'classical-supervised',
    sectionTitle: 'Classical Supervised Learning',
    level: 'Foundational',
    tags: ['Non-parametric', 'Lazy Learning', 'Metric Space', 'KD-Tree', 'Voronoi'],
    llmAntiPattern: {
      scenario: 'Asking an LLM to find the 5 most similar patient medical profiles from a database of 100,000 historical records.',
      whyItFails: 'LLMs cannot index 100,000 records in context; k-NN using KD-Trees or Ball-Trees locates exact nearest neighbors in 0.5ms.',
      tcoComparison: {
        specialized: { latency: '0.5ms (KD-Tree)', costPerMillion: '$0.00', determinism: 'Mathematically Exact Neighbors' },
        llmAlternative: { latency: '4,000ms', costPerMillion: '$15,000', determinism: 'Incomplete / Hallucinated' }
      }
    },
    intuition: {
      summary: 'k-NN is a lazy learner: it performs zero training phase computations, instead postponing all work until inference time by locating the k closest historical samples in feature space.',
      keyPoints: [
        'Non-parametric: makes no assumptions about the underlying distribution of the data.',
        'Decision boundaries adapt naturally to complex multi-modal islands and irregular shapes.',
        'Sensitive to feature scale: features with large numerical ranges completely overpower smaller features.',
        'Inference cost scales with dataset size N unless accelerated by spatial indexing structures (KD-Trees, Ball-Trees).'
      ],
      detailedExplanation: 'For a new query point, k-NN computes the distance to all points in the dataset, selects the k nearest points, and takes a majority vote (classification) or mean value (regression), optionally weighted by 1 / distance.'
    },
    diagram: {
      type: 'mermaid',
      content: `graph TD
    Query["Query Point (?)"] -->|Distance: 1.2| N1["Class A (+)"]
    Query -->|Distance: 1.4| N2["Class A (+)"]
    Query -->|Distance: 2.1| N3["Class B (-)"]
    Query --> Vote["Majority Vote (k=3): 2 'A' vs 1 'B' -> Predict 'A'"]
    style Query fill:#0284c7,stroke:#38bdf8,stroke-width:3px,color:#fff
    style N1 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style N2 fill:#059669,stroke:#34d399,stroke-width:2px,color:#fff
    style N3 fill:#e11d48,stroke:#fda4af,stroke-width:2px,color:#fff
    style Vote fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff`,
      caption: 'k-NN Classification: Query assigns class based on majority vote among k closest neighbors.'
    },
    mathematics: {
      coreFormula: '\\hat{y} = \\arg\\max_{c} \\sum_{i \\in N_k(\\mathbf{x})} \\mathbb{I}(y_i = c) \\cdot w_i, \\quad w_i = \\frac{1}{d(\\mathbf{x}, \\mathbf{x}_i)}',
      variableDefinitions: [
        { symbol: 'N_k(\\mathbf{x})', meaning: 'The set of k closest neighbors to query point x' },
        { symbol: 'd(\\mathbf{x}, \\mathbf{x}_i)', meaning: 'Distance metric (Euclidean, Manhattan, or Cosine)' },
        { symbol: 'w_i', meaning: 'Distance-based voting weight (optional)' }
      ],
      derivationOrIntuition: 'Cover & Hart proved that as N -> infinity, the 1-NN error rate is bounded above by twice the Bayes optimal error rate (the theoretical minimum achievable error rate).'
    },
    engineeringCriteria: {
      whenToUse: [
        'Small-to-medium datasets where decision boundaries are highly irregular.',
        'Imputing missing values in tabular datasets (KNNImputer).',
        'Instance-based recommendation prototypes.'
      ],
      whenToAvoid: [
        'High dimensions (d > 50) where KD-Trees degrade to brute force O(N) due to curse of dimensionality.',
        'Strict sub-millisecond production inference on millions of rows.'
      ],
      complexity: {
        timeTraining: 'O(1) brute force, or O(d * N log N) to construct KD-Tree',
        timeInference: 'O(d * log N) with KD-Tree in low dimensions, O(d * N) brute force',
        space: 'O(N * d) storing the full dataset'
      }
    },
    codeRecipe: {
      framework: 'Python (scikit-learn)',
      code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Feature scaling is mandatory for distance-based k-NN
knn = make_pipeline(
    StandardScaler(),
    KNeighborsClassifier(n_neighbors=5, weights='distance', algorithm='kd_tree')
)

knn.fit(X_train, y_train)
predictions = knn.predict(X_test)`,
      explanation: 'Uses a KD-Tree accelerated index with inverse-distance weighting and feature normalization.'
    },
    principalInterviewFocus: {
      question: 'Why do KD-Trees collapse to brute-force O(N) search as dimension d exceeds ~20, and what indexing structures resolve this?',
      insight: 'A KD-Tree recursively splits space using axis-aligned hyperplanes. To guarantee finding the true nearest neighbor, the search algorithm must check whether the query hypersphere intersects adjacent partition bounding boxes. In high dimensions, the volume of a hypersphere concentrates in its outer shell, and almost every partition box intersects the search sphere. As a result, the algorithm must backtrack into virtually every leaf node, degrading to O(N). For high dimensions (d=128 to 1536), production systems abandon exact trees and switch to Approximate Nearest Neighbors (ANN) using HNSW (graph-based) or IVF-PQ (vector quantization).',
      failureModesInProduction: [
        'Memory exhaustion when dataset N grows to millions, since k-NN stores all historical training rows in memory.'
      ]
    }
  }
];
