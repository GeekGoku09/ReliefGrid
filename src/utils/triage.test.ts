import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeUrgencyScore,
  formatUrgencyLabel,
  categorizeDistress,
  extractKeyHazards,
  heuristicTriage
} from './triage';

test('computeUrgencyScore gives maximum 5 for life-threatening keywords', () => {
  const text = 'Water rising fast, family trapped on roof with infant and no oxygen';
  const score = computeUrgencyScore(text, 2);
  assert.equal(score, 5);
  assert.equal(formatUrgencyLabel(score), 'Critical');
});

test('computeUrgencyScore evaluates severe status for power outages with elderly', () => {
  const text = 'Elderly nursing home lost power, heating is out and insulin refrigeration failing';
  const score = computeUrgencyScore(text, 5);
  assert.ok(score >= 4);
});

test('categorizeDistress properly categorizes crisis domains', () => {
  assert.equal(categorizeDistress('Need urgent insulin and cardiac monitoring'), 'medical');
  assert.equal(categorizeDistress('Trapped in attic due to rising flash flood, need boat rescue'), 'rescue_evac');
  assert.equal(categorizeDistress('Need portable generator and dry blankets'), 'power_shelter');
  assert.equal(categorizeDistress('Need baby formula and pediatric supplies'), 'special_needs');
  assert.equal(categorizeDistress('Family needs drinking water jugs and canned food'), 'water_food');
});

test('heuristicTriage generates actionable supplies and hazards', () => {
  const result = heuristicTriage('Trapped in house with 2 feet of water rising, elderly grandmother present', 1);
  assert.equal(result.category, 'rescue_evac');
  assert.ok(result.urgencyScore >= 4);
  assert.ok(result.suggestedItems.length > 0);
  assert.ok(result.keyHazards.length > 0);
});
