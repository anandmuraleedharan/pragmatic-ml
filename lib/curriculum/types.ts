export type ConceptLevel = 'Foundational' | 'Core ML' | 'Principal Specialist';

export type SectionId =
  | 'graph-algorithms'
  | 'distance-metrics'
  | 'classical-supervised'
  | 'classical-unsupervised'
  | 'recommender-systems'
  | 'classical-nlp'
  | 'search-retrieval'
  | 'deep-learning'
  | 'evaluation-metrics'
  | 'production-systems';

export interface SectionMetadata {
  id: SectionId;
  title: string;
  shortTitle: string;
  icon: string; // Lucide icon name
  badgeColor: string; // Tailwind color class
  description: string;
  conceptCount?: number;
}

export interface DiagramConfig {
  type: 'mermaid' | 'svg' | 'ascii';
  content: string;
  caption: string;
}

export interface ComplexityInfo {
  timeTraining?: string;
  timeInference: string;
  space: string;
}

export interface LLMAntiPattern {
  scenario: string;
  whyItFails: string;
  tcoComparison: {
    specialized: { latency: string; costPerMillion: string; determinism: string };
    llmAlternative: { latency: string; costPerMillion: string; determinism: string };
  };
}

export interface PrincipalInterviewFocus {
  question: string;
  insight: string;
  failureModesInProduction: string[];
}

export interface Concept {
  id: string;
  title: string;
  subtitle: string;
  sectionId: SectionId;
  sectionTitle: string;
  level: ConceptLevel;
  tags: string[];

  // 1. Pragmatic Positioning vs LLM
  llmAntiPattern: LLMAntiPattern;

  // 2. Conceptual Walkthrough & Intuition
  intuition: {
    summary: string;
    keyPoints: string[];
    detailedExplanation: string;
  };

  // 3. Visual Architecture / Helper Diagram
  diagram: DiagramConfig;

  // 4. Mathematical Formulation
  mathematics: {
    coreFormula: string; // LaTeX
    variableDefinitions: { symbol: string; meaning: string }[];
    derivationOrIntuition: string;
  };

  // 5. Practical Engineering Bounds
  engineeringCriteria: {
    whenToUse: string[];
    whenToAvoid: string[];
    complexity: ComplexityInfo;
  };

  // 6. Production Code Recipe
  codeRecipe: {
    framework: string; // e.g. "Python (NumPy / NetworkX)", "scikit-learn", "PyTorch"
    code: string;
    explanation: string;
  };

  // 7. Principal ML Architectural Scenarios
  principalInterviewFocus: PrincipalInterviewFocus;
}
