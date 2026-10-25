export type CrisisCategory =
  | 'medical'
  | 'rescue_evac'
  | 'water_food'
  | 'power_shelter'
  | 'special_needs';

export type TriageUrgency = 1 | 2 | 3 | 4 | 5; // 5 = Maximum emergency / Immediate life threat

export type SOSStatus = 'unprocessed' | 'triaged' | 'assigned' | 'dispatched' | 'resolved';

export interface RequestedItem {
  item: string;
  quantity: number;
  unit: string;
}

export interface SOSRequest {
  id: string;
  timestamp: string;
  callerName: string;
  contactNumber: string;
  rawText: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: CrisisCategory;
  urgencyScore: TriageUrgency;
  urgencyLabel: 'Critical' | 'Severe' | 'Elevated' | 'Moderate' | 'Low';
  vulnerableCount: number; // children, elderly, disabled, patients
  requestedItems: RequestedItem[];
  keyHazards: string[];
  status: SOSStatus;
  triageSummary: string;
  recommendedAction: string;
  assignedTeamId?: string;
  assignedHubId?: string;
}

export interface InventoryItem {
  id: string;
  item: string;
  category: CrisisCategory;
  available: number;
  unit: string;
  reserved: number;
}

export interface ReliefHub {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'operational' | 'strained' | 'critical';
  capacityPct: number;
  manager: string;
  contactPhone: string;
  inventory: InventoryItem[];
}

export interface VolunteerTeam {
  id: string;
  name: string;
  leadName: string;
  phone: string;
  vehicleType: 'High-Clearance 4x4' | 'Ambulance / Mobile Med' | 'Heavy Cargo Van' | 'Inflatable Watercraft / Boat';
  certifications: string[];
  status: 'available' | 'en_route' | 'on_scene' | 'standby';
  currentCoordinates: {
    lat: number;
    lng: number;
  };
  assignedMissionId?: string;
}

export interface MissionDispatch {
  id: string;
  sosRequestId: string;
  hubId: string;
  teamId: string;
  createdAt: string;
  status: 'dispatched' | 'in_transit' | 'on_site' | 'completed';
  allocatedSupplies: RequestedItem[];
  routeCaution: string;
  safetyBriefing: string[];
  priorityEquipment: string[];
  etaMinutes: number;
}

export interface MutualAidPledge {
  id: string;
  donorName: string;
  contact: string;
  type: 'supplies' | 'transport' | 'specialized_skill';
  description: string;
  quantity: number;
  unit: string;
  targetHubId: string;
  status: 'pledged' | 'received';
  timestamp: string;
}

export interface CrisisScenario {
  id: string;
  title: string;
  eventType: string;
  region: string;
  activeDisplacements: number;
  operationalShelters: number;
  criticalNeedsCount: number;
  brief: string;
  initialSOS: SOSRequest[];
  initialHubs: ReliefHub[];
  initialTeams: VolunteerTeam[];
  initialPledges: MutualAidPledge[];
}
