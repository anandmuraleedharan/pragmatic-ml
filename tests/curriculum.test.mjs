import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ALL_CONCEPTS, getAllSections, getConceptBySlug, searchConcepts } from '../lib/curriculum/registry.ts';

describe('Curriculum Registry Integrity', () => {
  test('all concepts have unique IDs', () => {
    const ids = ALL_CONCEPTS.map((c) => c.id);
    const uniqueIds = new Set(ids);
    assert.strictEqual(ids.length, uniqueIds.size, 'Concept IDs must be globally unique');
  });

  test('all concepts map to valid known sections', () => {
    const validSectionIds = new Set(getAllSections().map((s) => s.id));
    for (const concept of ALL_CONCEPTS) {
      assert.ok(
        validSectionIds.has(concept.sectionId),
        `Concept ${concept.id} has invalid section ${concept.sectionId}`
      );
    }
  });

  test('every concept contains required fields for rendering', () => {
    for (const concept of ALL_CONCEPTS) {
      assert.ok(concept.title, `Missing title on ${concept.id}`);
      assert.ok(concept.subtitle, `Missing subtitle on ${concept.id}`);
      assert.ok(concept.intuition.summary, `Missing intuition on ${concept.id}`);
      assert.ok(concept.diagram.content, `Missing diagram on ${concept.id}`);
      assert.ok(concept.mathematics.coreFormula, `Missing math on ${concept.id}`);
      assert.ok(concept.codeRecipe.code, `Missing code recipe on ${concept.id}`);
      assert.ok(concept.principalInterviewFocus.question, `Missing interview question on ${concept.id}`);
    }
  });

  test('lookup by slug returns correct concept', () => {
    const gliner = getConceptBySlug('gliner-ner');
    assert.ok(gliner, 'GLiNER concept must exist');
    assert.strictEqual(gliner.id, 'gliner-ner');
    assert.strictEqual(gliner.sectionId, 'classical-nlp');

    const pagerank = getConceptBySlug('pagerank');
    assert.ok(pagerank, 'PageRank must exist');
    assert.strictEqual(pagerank.sectionId, 'graph-algorithms');
  });

  test('search query finds relevant concepts', () => {
    const results = searchConcepts('ner');
    assert.ok(results.length > 0, 'Search for NER should return results');
    assert.ok(results.some((r) => r.id === 'gliner-ner'));
  });
});
