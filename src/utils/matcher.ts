import { ReliefHub, VolunteerTeam, SOSRequest, RequestedItem } from '../types/crisis';

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface MatchResult {
  hub: ReliefHub;
  team: VolunteerTeam;
  matchScore: number; // 0 to 100
  distanceKm: number;
  etaMinutes: number;
  inventoryCoveragePct: number;
  vehicleSuitability: string;
  rationale: string;
}

export function matchSOSWithResources(
  sos: SOSRequest,
  hubs: ReliefHub[],
  teams: VolunteerTeam[]
): MatchResult | null {
  const operationalHubs = hubs.filter(h => h.status !== 'critical');
  const availableTeams = teams.filter(t => t.status === 'available');

  if (operationalHubs.length === 0 || availableTeams.length === 0) {
    return null;
  }

  let bestMatch: MatchResult | null = null;
  let highestScore = -1;

  for (const hub of operationalHubs) {
    const hubDist = calculateDistanceKm(
      hub.coordinates.lat,
      hub.coordinates.lng,
      sos.coordinates.lat,
      sos.coordinates.lng
    );

    // Calculate inventory coverage
    let matchedItems = 0;
    for (const req of sos.requestedItems) {
      const invItem = hub.inventory.find(i =>
        i.item.toLowerCase().includes(req.item.toLowerCase()) ||
        req.item.toLowerCase().includes(i.item.toLowerCase())
      );
      if (invItem && invItem.available >= req.quantity) {
        matchedItems++;
      }
    }
    const inventoryCoverage = sos.requestedItems.length > 0
      ? (matchedItems / sos.requestedItems.length) * 100
      : 80;

    for (const team of availableTeams) {
      const teamDist = calculateDistanceKm(
        team.currentCoordinates.lat,
        team.currentCoordinates.lng,
        hub.coordinates.lat,
        hub.coordinates.lng
      ) + hubDist;

      // Assess vehicle suitability
      let vehicleScore = 70;
      let suitabilityReason = 'Standard utility logistics';

      if (sos.category === 'rescue_evac') {
        if (team.vehicleType === 'Inflatable Watercraft / Boat') {
          vehicleScore = 100;
          suitabilityReason = 'Optimal watercraft for flood evacuation';
        } else if (team.vehicleType === 'High-Clearance 4x4') {
          vehicleScore = 85;
          suitabilityReason = 'High-clearance terrain vehicle';
        } else {
          vehicleScore = 40;
        }
      } else if (sos.category === 'medical') {
        if (team.vehicleType === 'Ambulance / Mobile Med') {
          vehicleScore = 100;
          suitabilityReason = 'Dedicated mobile medical unit with cold chain';
        } else if (team.certifications.some(c => c.toLowerCase().includes('paramedic') || c.toLowerCase().includes('emt'))) {
          vehicleScore = 90;
          suitabilityReason = 'Certified EMT on-board';
        } else {
          vehicleScore = 60;
        }
      } else {
        if (team.vehicleType === 'Heavy Cargo Van') {
          vehicleScore = 95;
          suitabilityReason = 'High volumetric cargo capacity for bulk aid';
        } else {
          vehicleScore = 80;
        }
      }

      // Proximity score (closer is better, max 100)
      const proximityScore = Math.max(10, Math.round(100 - (teamDist * 3)));

      // Composite match score
      const compositeScore = Math.round(
        (inventoryCoverage * 0.4) +
        (vehicleScore * 0.35) +
        (proximityScore * 0.25)
      );

      // Estimated arrival in minutes (average 35 km/h in disaster conditions + 10 min load)
      const eta = Math.max(12, Math.round((teamDist / 35) * 60 + 10));

      if (compositeScore > highestScore) {
        highestScore = compositeScore;
        bestMatch = {
          hub,
          team,
          matchScore: compositeScore,
          distanceKm: Math.round(teamDist * 10) / 10,
          etaMinutes: eta,
          inventoryCoveragePct: Math.round(inventoryCoverage),
          vehicleSuitability: suitabilityReason,
          rationale: `Staged from ${hub.name} (${Math.round(inventoryCoverage)}% supply match) deployed via ${team.name} (${suitabilityReason}).`
        };
      }
    }
  }

  return bestMatch;
}

export function deductHubInventory(hub: ReliefHub, requestedItems: RequestedItem[]): ReliefHub {
  const updatedInventory = hub.inventory.map(item => {
    const match = requestedItems.find(req =>
      item.item.toLowerCase().includes(req.item.toLowerCase()) ||
      req.item.toLowerCase().includes(item.item.toLowerCase())
    );
    if (match) {
      const deduction = Math.min(item.available, match.quantity);
      return {
        ...item,
        available: Math.max(0, item.available - deduction),
        reserved: item.reserved + deduction
      };
    }
    return item;
  });

  return {
    ...hub,
    inventory: updatedInventory
  };
}
