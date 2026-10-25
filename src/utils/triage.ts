import { CrisisCategory, TriageUrgency } from '../types/crisis';

export interface TriageEvaluation {
  urgencyScore: TriageUrgency;
  urgencyLabel: 'Critical' | 'Severe' | 'Elevated' | 'Moderate' | 'Low';
  category: CrisisCategory;
  vulnerableCount: number;
  keyHazards: string[];
  suggestedItems: { item: string; quantity: number; unit: string }[];
  summary: string;
}

const CRITICAL_KEYWORDS = [
  'trapped', 'drowning', 'rising water', 'roof', 'unconscious', 'cardiac',
  'infant', 'hypothermia', 'no oxygen', 'oxygen running out', 'dialysis',
  'bleeding out', 'collapsed roof', 'diabetic shock', 'disabled', 'fire spreading'
];

const SEVERE_KEYWORDS = [
  'no power', 'freezing', 'elderly', 'insulin', 'out of food', 'wheelchair',
  'water rising fast', 'asthma', 'injured', 'broken bone', 'contaminated water'
];

const ELEVATED_KEYWORDS = [
  'drinking water', 'baby formula', 'blankets', 'stranded', 'generator',
  'cell service down', 'leaking roof', 'non-perishable food'
];

export function computeUrgencyScore(text: string, vulnerableCount = 0): TriageUrgency {
  const lower = text.toLowerCase();
  
  let score = 2; // base moderate

  const hasCritical = CRITICAL_KEYWORDS.some(kw => lower.includes(kw));
  const hasSevere = SEVERE_KEYWORDS.some(kw => lower.includes(kw));
  const hasElevated = ELEVATED_KEYWORDS.some(kw => lower.includes(kw));

  if (hasCritical) {
    score = 5;
  } else if (hasSevere) {
    score = 4;
  } else if (hasElevated) {
    score = 3;
  }

  // Adjust by vulnerable persons
  if (vulnerableCount >= 3 && score < 5) {
    score = Math.min(5, score + 1) as TriageUrgency;
  }

  // Extra boost for combination of cold/water + infants or elderly
  if ((lower.includes('water') || lower.includes('cold') || lower.includes('flood')) &&
      (lower.includes('baby') || lower.includes('infant') || lower.includes('elderly') || lower.includes('oxygen'))) {
    score = 5;
  }

  return Math.max(1, Math.min(5, score)) as TriageUrgency;
}

export function formatUrgencyLabel(score: TriageUrgency): 'Critical' | 'Severe' | 'Elevated' | 'Moderate' | 'Low' {
  switch (score) {
    case 5:
      return 'Critical';
    case 4:
      return 'Severe';
    case 3:
      return 'Elevated';
    case 2:
      return 'Moderate';
    case 1:
    default:
      return 'Low';
  }
}

export function categorizeDistress(text: string): CrisisCategory {
  const lower = text.toLowerCase();

  if (lower.includes('oxygen') || lower.includes('insulin') || lower.includes('unconscious') ||
      lower.includes('medication') || lower.includes('cardiac') || lower.includes('bleeding') ||
      lower.includes('medical') || lower.includes('injury') || lower.includes('dialysis')) {
    return 'medical';
  }

  if (lower.includes('trapped') || lower.includes('roof') || lower.includes('boat') ||
      lower.includes('rescue') || lower.includes('rising water') || lower.includes('flood') ||
      lower.includes('evacuate') || lower.includes('stranded')) {
    return 'rescue_evac';
  }

  if (lower.includes('generator') || lower.includes('power') || lower.includes('blanket') ||
      lower.includes('freezing') || lower.includes('shelter') || lower.includes('tarps') ||
      lower.includes('heat') || lower.includes('warmth')) {
    return 'power_shelter';
  }

  if (lower.includes('formula') || lower.includes('infant') || lower.includes('wheelchair') ||
      lower.includes('disabled') || lower.includes('special needs')) {
    return 'special_needs';
  }

  return 'water_food';
}

export function extractKeyHazards(text: string): string[] {
  const lower = text.toLowerCase();
  const hazards: string[] = [];

  if (lower.includes('flood') || lower.includes('water') || lower.includes('submerged')) {
    hazards.push('Active flood waters / Submerged access');
  }
  if (lower.includes('power') || lower.includes('blackout') || lower.includes('grid')) {
    hazards.push('Power grid failure / Life-support equipment offline');
  }
  if (lower.includes('fire') || lower.includes('smoke')) {
    hazards.push('Active fire perimeter / Respiratory risk');
  }
  if (lower.includes('cold') || lower.includes('freeze') || lower.includes('hypothermia')) {
    hazards.push('Severe cold exposure / Hypothermia threat');
  }
  if (lower.includes('trapped') || lower.includes('collapse') || lower.includes('debris')) {
    hazards.push('Structural instability / Blocked egress');
  }
  if (hazards.length === 0) {
    hazards.push('Isolated location / Communication degradation');
  }
  return hazards;
}

export function heuristicTriage(text: string, callerVulnerables = 0): TriageEvaluation {
  const score = computeUrgencyScore(text, callerVulnerables);
  const category = categorizeDistress(text);
  const hazards = extractKeyHazards(text);
  
  // Suggest items based on category and text
  const items: { item: string; quantity: number; unit: string }[] = [];
  const lower = text.toLowerCase();

  if (category === 'medical') {
    if (lower.includes('oxygen')) items.push({ item: 'Portable Oxygen Concentrator', quantity: 1, unit: 'unit' });
    if (lower.includes('insulin')) items.push({ item: 'Cold-Chain Medical Cooler + Insulin Kit', quantity: 2, unit: 'kits' });
    items.push({ item: 'Advanced First Aid / Trauma Pack', quantity: 1, unit: 'pack' });
  } else if (category === 'rescue_evac') {
    items.push({ item: 'Swift Water Inflatable Raft / Flotation Vests', quantity: 4, unit: 'vests' });
    items.push({ item: 'Emergency Rescue Stretcher', quantity: 1, unit: 'unit' });
  } else if (category === 'power_shelter') {
    items.push({ item: '5kW Inverter Generator + Fuel Canister', quantity: 1, unit: 'unit' });
    items.push({ item: 'Heavy Thermal Mylar Blankets', quantity: 10, unit: 'units' });
  } else if (category === 'special_needs') {
    items.push({ item: 'Pediatric Formula & Electrolyte Solutions', quantity: 8, unit: 'liters' });
    items.push({ item: 'All-Terrain Transport Wheelchair', quantity: 1, unit: 'unit' });
  } else {
    items.push({ item: 'Purified Drinking Water (1 Gallon Jugs)', quantity: 12, unit: 'gallons' });
    items.push({ item: 'Ready-to-Eat High-Calorie Meal Rations', quantity: 18, unit: 'meals' });
  }

  return {
    urgencyScore: score,
    urgencyLabel: formatUrgencyLabel(score),
    category,
    vulnerableCount: Math.max(callerVulnerables, lower.includes('infant') || lower.includes('elderly') ? 2 : 0),
    keyHazards: hazards,
    suggestedItems: items,
    summary: `Triaged ${formatUrgencyLabel(score)} priority: ${category.replace('_', ' ').toUpperCase()} dispatch required.`
  };
}
