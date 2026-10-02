import { Concept, SectionMetadata, SectionId } from './types';
import { SECTIONS } from './sections';
import { GRAPH_CONCEPTS } from './concepts/graphs';
import { DISTANCE_CONCEPTS } from './concepts/distances';
import { SUPERVISED_CONCEPTS } from './concepts/supervised';
import { UNSUPERVISED_CONCEPTS } from './concepts/unsupervised';
import { RECOMMENDER_CONCEPTS } from './concepts/recommenders';
import { NLP_CONCEPTS } from './concepts/nlp';
import { SEARCH_CONCEPTS } from './concepts/search';
import { DEEP_LEARNING_CONCEPTS } from './concepts/deeplearning';
import { EVALUATION_CONCEPTS } from './concepts/evaluation';
import { PRODUCTION_CONCEPTS } from './concepts/production';

// Master list of all registered concepts across all 10 pillars
export const ALL_CONCEPTS: Concept[] = [
  ...GRAPH_CONCEPTS,
  ...DISTANCE_CONCEPTS,
  ...SUPERVISED_CONCEPTS,
  ...UNSUPERVISED_CONCEPTS,
  ...RECOMMENDER_CONCEPTS,
  ...NLP_CONCEPTS,
  ...SEARCH_CONCEPTS,
  ...DEEP_LEARNING_CONCEPTS,
  ...EVALUATION_CONCEPTS,
  ...PRODUCTION_CONCEPTS,
];

// Enrich sections with dynamic concept counts
export function getAllSections(): SectionMetadata[] {
  return SECTIONS.map((section) => {
    const count = ALL_CONCEPTS.filter((c) => c.sectionId === section.id).length;
    return {
      ...section,
      conceptCount: count,
    };
  });
}

export function getAllConcepts(): Concept[] {
  return ALL_CONCEPTS;
}

export function getConceptBySlug(slug: string): Concept | undefined {
  return ALL_CONCEPTS.find((c) => c.id === slug);
}

export function getConceptsBySection(sectionId: SectionId): Concept[] {
  return ALL_CONCEPTS.filter((c) => c.sectionId === sectionId);
}

export function searchConcepts(query: string): Concept[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_CONCEPTS;

  return ALL_CONCEPTS.filter((c) => {
    return (
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.sectionTitle.toLowerCase().includes(q) ||
      c.intuition.summary.toLowerCase().includes(q)
    );
  });
}
