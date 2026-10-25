import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm, matchSOSWithResources, deductHubInventory } from './matcher';
import { ReliefHub, VolunteerTeam, SOSRequest } from '../types/crisis';

test('calculateDistanceKm calculates sensible geographic distance', () => {
  // Coords roughly 10-15km apart
  const d = calculateDistanceKm(29.95, -90.07, 29.98, -90.15);
  assert.ok(d > 5 && d < 20);
});

test('matchSOSWithResources pairs water rescue needs with watercraft team', () => {
  const mockSOS: SOSRequest = {
    id: 'sos-1',
    timestamp: new Date().toISOString(),
    callerName: 'Sarah Jenkins',
    contactNumber: '555-0192',
    rawText: 'Flooding 4 feet deep, elderly father trapped upstairs, need boat rescue',
    locationName: 'Lower Delta Sector',
    coordinates: { lat: 29.95, lng: -90.05 },
    category: 'rescue_evac',
    urgencyScore: 5,
    urgencyLabel: 'Critical',
    vulnerableCount: 1,
    requestedItems: [{ item: 'Inflatable Raft / Flotation Vests', quantity: 2, unit: 'units' }],
    keyHazards: ['Submerged roads'],
    status: 'triaged',
    triageSummary: 'Immediate boat rescue required',
    recommendedAction: 'Deploy watercraft'
  };

  const mockHubs: ReliefHub[] = [
    {
      id: 'hub-1',
      name: 'Central Staging Depot',
      address: '100 Main St',
      coordinates: { lat: 29.94, lng: -90.06 },
      status: 'operational',
      capacityPct: 75,
      manager: 'Capt. Miller',
      contactPhone: '555-1100',
      inventory: [
        { id: 'i1', item: 'Inflatable Raft / Flotation Vests', category: 'rescue_evac', available: 10, unit: 'units', reserved: 0 }
      ]
    }
  ];

  const mockTeams: VolunteerTeam[] = [
    {
      id: 'team-van',
      name: 'Cargo Van 01',
      leadName: 'Bob',
      phone: '555-2200',
      vehicleType: 'Heavy Cargo Van',
      certifications: ['Logistics'],
      status: 'available',
      currentCoordinates: { lat: 29.93, lng: -90.06 }
    },
    {
      id: 'team-boat',
      name: 'Swift Water Unit 4',
      leadName: 'Officer Davis',
      phone: '555-3300',
      vehicleType: 'Inflatable Watercraft / Boat',
      certifications: ['Swift Water Rescue'],
      status: 'available',
      currentCoordinates: { lat: 29.94, lng: -90.05 }
    }
  ];

  const match = matchSOSWithResources(mockSOS, mockHubs, mockTeams);
  assert.ok(match !== null);
  assert.equal(match.team.id, 'team-boat', 'Should prioritize watercraft for water rescue');
  assert.equal(match.hub.id, 'hub-1');
  assert.ok(match.matchScore >= 70);
});

test('deductHubInventory decreases available and increases reserved stock', () => {
  const initialHub: ReliefHub = {
    id: 'h1',
    name: 'North Depot',
    address: 'Bayou Road',
    coordinates: { lat: 29.9, lng: -90.0 },
    status: 'operational',
    capacityPct: 50,
    manager: 'Jane',
    contactPhone: '555',
    inventory: [
      { id: 'item1', item: 'Portable Oxygen Concentrator', category: 'medical', available: 4, unit: 'units', reserved: 1 }
    ]
  };

  const updated = deductHubInventory(initialHub, [{ item: 'Portable Oxygen Concentrator', quantity: 2, unit: 'units' }]);
  assert.equal(updated.inventory[0].available, 2);
  assert.equal(updated.inventory[0].reserved, 3);
});
