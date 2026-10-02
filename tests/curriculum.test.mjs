import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Curriculum Registry & Visual Architecture Integrity', () => {
  const conceptsDir = path.resolve(process.cwd(), 'lib/curriculum/concepts');
  const sectionsFile = path.resolve(process.cwd(), 'lib/curriculum/sections.ts');
  const simulatorsFile = path.resolve(process.cwd(), 'components/InteractiveSimulators.tsx');
  const decisionTreeFile = path.resolve(process.cwd(), 'components/InteractiveDecisionTree.tsx');
  const diagramsFile = path.resolve(process.cwd(), 'components/ConceptDiagram.tsx');

  test('all 10 curriculum concept files exist and are populated', () => {
    assert.ok(fs.existsSync(conceptsDir), 'Concepts directory must exist');
    const conceptFiles = fs.readdirSync(conceptsDir).filter((f) => f.endsWith('.ts'));
    assert.strictEqual(conceptFiles.length, 10, 'Must have 10 concept category files');
  });

  test('all concept entries have required fields for visual learners', () => {
    const conceptFiles = fs.readdirSync(conceptsDir).filter((f) => f.endsWith('.ts'));
    const allIds = new Set();
    let totalConcepts = 0;

    for (const file of conceptFiles) {
      const content = fs.readFileSync(path.join(conceptsDir, file), 'utf-8');
      const idMatches = [...content.matchAll(/id:\s*['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]);

      for (const id of idMatches) {
        assert.ok(!allIds.has(id), `Duplicate concept ID found: ${id}`);
        allIds.add(id);
        totalConcepts++;
      }

      // Check required curriculum structure patterns
      assert.ok(content.includes('title:'), `Missing title definitions in ${file}`);
      assert.ok(content.includes('subtitle:'), `Missing subtitle definitions in ${file}`);
      assert.ok(content.includes('llmAntiPattern:'), `Missing llmAntiPattern in ${file}`);
      assert.ok(content.includes('intuition:'), `Missing intuition in ${file}`);
      assert.ok(content.includes('diagram:'), `Missing diagram in ${file}`);
      assert.ok(content.includes('mathematics:'), `Missing mathematics in ${file}`);
      assert.ok(content.includes('codeRecipe:'), `Missing codeRecipe in ${file}`);
      assert.ok(content.includes('principalInterviewFocus:'), `Missing principalInterviewFocus in ${file}`);
    }

    assert.ok(totalConcepts >= 38, `Expected at least 38 concepts across all pillars, got ${totalConcepts}`);
  });

  test('all 10 sections are defined with valid metadata', () => {
    assert.ok(fs.existsSync(sectionsFile), 'sections.ts must exist');
    const content = fs.readFileSync(sectionsFile, 'utf-8');
    const expectedSections = [
      'graph-algorithms',
      'distance-metrics',
      'classical-supervised',
      'classical-unsupervised',
      'recommender-systems',
      'classical-nlp',
      'search-retrieval',
      'deep-learning',
      'evaluation-metrics',
      'production-systems',
    ];

    for (const section of expectedSections) {
      assert.ok(content.includes(section), `Section ${section} must be defined in sections.ts`);
    }
  });

  test('visual learner components exist with all required simulators and diagrams', () => {
    assert.ok(fs.existsSync(simulatorsFile), 'InteractiveSimulators.tsx must exist');
    const simContent = fs.readFileSync(simulatorsFile, 'utf-8');
    assert.ok(simContent.includes('CosineSimilaritySimulator'), 'Must export CosineSimilaritySimulator');
    assert.ok(simContent.includes('KMeansSimulator'), 'Must export KMeansSimulator');
    assert.ok(simContent.includes('LatencyRaceSimulator'), 'Must export LatencyRaceSimulator');
    assert.ok(simContent.includes('HybridRRFSimulator'), 'Must export HybridRRFSimulator');

    assert.ok(fs.existsSync(decisionTreeFile), 'InteractiveDecisionTree.tsx must exist');
    const treeContent = fs.readFileSync(decisionTreeFile, 'utf-8');
    assert.ok(treeContent.includes('InteractiveDecisionTree'), 'Must export InteractiveDecisionTree');

    assert.ok(fs.existsSync(diagramsFile), 'ConceptDiagram.tsx must exist');
    const diagContent = fs.readFileSync(diagramsFile, 'utf-8');
    assert.ok(diagContent.includes('ConceptDiagram'), 'Must export ConceptDiagram');
  });
});
