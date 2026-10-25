import { CrisisScenario } from '../types/crisis';

export const SEED_SCENARIOS: CrisisScenario[] = [
  {
    id: 'hurricane_surge',
    title: 'Category 4 Coastal Surge & Storm Grid Failure',
    eventType: 'Severe Hurricane / Surge Inundation',
    region: 'Slate Bay & Lower Delta Sector',
    activeDisplacements: 1420,
    operationalShelters: 4,
    criticalNeedsCount: 6,
    brief: 'Severe 12-foot storm surge penetrated 4 miles inland. Main arterial highways are submerged; multiple care facilities operating on dwindling backup fuel with vulnerable residents.',
    initialSOS: [
      {
        id: 'sos-101',
        timestamp: '12 mins ago',
        callerName: 'Dr. Raymond Chen (Pine Crest Assisted Living)',
        contactNumber: '555-0144',
        rawText: 'Our backup diesel generator just sputtered out. We have 14 elderly residents, 3 on continuous oxygen concentrators and 4 diabetic patients requiring refrigerated insulin. Floodwaters are 3 feet high in the parking lot and climbing.',
        locationName: 'Pine Crest Senior Care, 1420 Shoreline Blvd',
        coordinates: { lat: 34.12, lng: -119.48 },
        category: 'medical',
        urgencyScore: 5,
        urgencyLabel: 'Critical',
        vulnerableCount: 14,
        requestedItems: [
          { item: 'Portable Oxygen Concentrator', quantity: 3, unit: 'units' },
          { item: '5kW Inverter Generator + Fuel Canister', quantity: 2, unit: 'units' },
          { item: 'Cold-Chain Medical Cooler + Insulin Kit', quantity: 4, unit: 'kits' }
        ],
        keyHazards: ['Submerged access road', 'Life-support power loss', 'Elderly non-ambulatory patients'],
        status: 'triaged',
        triageSummary: 'Immediate life-support threat. Oxygen and power outage at senior facility with 14 non-ambulatory residents.',
        recommendedAction: 'Dispatch high-clearance medical convoy with generator and backup oxygen cylinders.'
      },
      {
        id: 'sos-102',
        timestamp: '24 mins ago',
        callerName: 'Elena Rostova',
        contactNumber: '555-0891',
        rawText: 'Family of 5 trapped on 2nd floor balcony. Water reached the ground floor ceiling. We have an 8-month-old infant with no formula or clean water left. Cell battery at 11%.',
        locationName: '88 Riverbend Court, Lower Delta',
        coordinates: { lat: 34.08, lng: -119.46 },
        category: 'rescue_evac',
        urgencyScore: 5,
        urgencyLabel: 'Critical',
        vulnerableCount: 3,
        requestedItems: [
          { item: 'Swift Water Inflatable Raft / Flotation Vests', quantity: 5, unit: 'vests' },
          { item: 'Pediatric Formula & Electrolyte Solutions', quantity: 4, unit: 'liters' },
          { item: 'Purified Drinking Water (1 Gallon Jugs)', quantity: 6, unit: 'gallons' }
        ],
        keyHazards: ['Deep flood current', 'Submerged power poles', 'Infant hypothermia risk'],
        status: 'triaged',
        triageSummary: 'Trapped family with infant on balcony in fast-rising current. Watercraft extraction required.',
        recommendedAction: 'Deploy Swift Water Rescue craft with pediatric rations immediately.'
      },
      {
        id: 'sos-103',
        timestamp: '38 mins ago',
        callerName: 'Marcus Vance (Community Center Shelter)',
        contactNumber: '555-0322',
        rawText: 'Shelter count surged to 320 evacuees. Municipal water pressure collapsed 2 hours ago. Running low on potable water and blankets. Temperatures dropping tonight to 44F.',
        locationName: 'North High Community Shelter, 400 Oak Lane',
        coordinates: { lat: 34.18, lng: -119.52 },
        category: 'water_food',
        urgencyScore: 3,
        urgencyLabel: 'Elevated',
        vulnerableCount: 45,
        requestedItems: [
          { item: 'Purified Drinking Water (1 Gallon Jugs)', quantity: 150, unit: 'gallons' },
          { item: 'Heavy Thermal Mylar Blankets', quantity: 200, unit: 'units' },
          { item: 'Ready-to-Eat High-Calorie Meal Rations', quantity: 300, unit: 'meals' }
        ],
        keyHazards: ['Dehydration risk', 'Hypothermia as temperatures fall', 'Mass shelter overcrowding'],
        status: 'assigned',
        triageSummary: 'Mass shelter water supply depleted for 320 evacuees. Bulk logistics staging in progress.',
        recommendedAction: 'Stage heavy cargo van transport for clean water pallets and thermal blankets.'
      },
      {
        id: 'sos-104',
        timestamp: '49 mins ago',
        callerName: 'Tariq Al-Mansoor',
        contactNumber: '555-0773',
        rawText: 'Wheelchair user trapped in single-story home. Front ramp collapsed under debris. Power line is down across the driveway sparking intermittently. I am safe inside but cannot leave.',
        locationName: '214 Magnolia Way',
        coordinates: { lat: 34.14, lng: -119.50 },
        category: 'special_needs',
        urgencyScore: 4,
        urgencyLabel: 'Severe',
        vulnerableCount: 1,
        requestedItems: [
          { item: 'All-Terrain Transport Wheelchair', quantity: 1, unit: 'unit' },
          { item: 'Heavy Thermal Mylar Blankets', quantity: 2, unit: 'units' }
        ],
        keyHazards: ['Downed live electrical wire', 'Impaired mobility', 'Structural porch collapse'],
        status: 'triaged',
        triageSummary: 'Mobility-impaired citizen trapped by live electrical hazard and collapsed ramp.',
        recommendedAction: 'Utility crew de-energize line + tactical extraction team.'
      }
    ],
    initialHubs: [
      {
        id: 'hub-slate-central',
        name: 'Slate Bay Logistics Depot',
        address: '800 Industrial Way, Slate Bay Sector',
        coordinates: { lat: 34.13, lng: -119.51 },
        status: 'operational',
        capacityPct: 68,
        manager: 'Commander Sarah Bradley',
        contactPhone: '555-8810',
        inventory: [
          { id: 'sb-1', item: 'Purified Drinking Water (1 Gallon Jugs)', category: 'water_food', available: 420, unit: 'gallons', reserved: 150 },
          { id: 'sb-2', item: 'Ready-to-Eat High-Calorie Meal Rations', category: 'water_food', available: 850, unit: 'meals', reserved: 300 },
          { id: 'sb-3', item: 'Portable Oxygen Concentrator', category: 'medical', available: 5, unit: 'units', reserved: 2 },
          { id: 'sb-4', item: 'Cold-Chain Medical Cooler + Insulin Kit', category: 'medical', available: 12, unit: 'kits', reserved: 4 },
          { id: 'sb-5', item: '5kW Inverter Generator + Fuel Canister', category: 'power_shelter', available: 6, unit: 'units', reserved: 2 },
          { id: 'sb-6', item: 'Heavy Thermal Mylar Blankets', category: 'power_shelter', available: 500, unit: 'units', reserved: 200 },
          { id: 'sb-7', item: 'Swift Water Inflatable Raft / Flotation Vests', category: 'rescue_evac', available: 16, unit: 'vests', reserved: 5 },
          { id: 'sb-8', item: 'Pediatric Formula & Electrolyte Solutions', category: 'special_needs', available: 35, unit: 'liters', reserved: 4 },
          { id: 'sb-9', item: 'All-Terrain Transport Wheelchair', category: 'special_needs', available: 3, unit: 'units', reserved: 1 }
        ]
      },
      {
        id: 'hub-delta-staging',
        name: 'Delta Sector Marine Staging Base',
        address: 'Pier 4, Maritime Causeway',
        coordinates: { lat: 34.09, lng: -119.47 },
        status: 'operational',
        capacityPct: 82,
        manager: 'Lt. Jason Thorne',
        contactPhone: '555-8822',
        inventory: [
          { id: 'ds-1', item: 'Swift Water Inflatable Raft / Flotation Vests', category: 'rescue_evac', available: 28, unit: 'vests', reserved: 0 },
          { id: 'ds-2', item: 'Emergency Rescue Stretcher', category: 'rescue_evac', available: 8, unit: 'units', reserved: 0 },
          { id: 'ds-3', item: 'Purified Drinking Water (1 Gallon Jugs)', category: 'water_food', available: 180, unit: 'gallons', reserved: 0 },
          { id: 'ds-4', item: 'Pediatric Formula & Electrolyte Solutions', category: 'special_needs', available: 18, unit: 'liters', reserved: 0 },
          { id: 'ds-5', item: 'Portable Oxygen Concentrator', category: 'medical', available: 2, unit: 'units', reserved: 0 }
        ]
      },
      {
        id: 'hub-foothill-shelter',
        name: 'North Ridge Evacuation Staging',
        address: '12 Foothill Expressway',
        coordinates: { lat: 34.20, lng: -119.55 },
        status: 'strained',
        capacityPct: 91,
        manager: 'Nurse Director Helen Cho',
        contactPhone: '555-8839',
        inventory: [
          { id: 'nr-1', item: 'Heavy Thermal Mylar Blankets', category: 'power_shelter', available: 120, unit: 'units', reserved: 0 },
          { id: 'nr-2', item: 'Purified Drinking Water (1 Gallon Jugs)', category: 'water_food', available: 95, unit: 'gallons', reserved: 0 },
          { id: 'nr-3', item: 'Advanced First Aid / Trauma Pack', category: 'medical', available: 14, unit: 'packs', reserved: 0 }
        ]
      }
    ],
    initialTeams: [
      {
        id: 'team-water-1',
        name: 'Delta Swift Water Task Force',
        leadName: 'Capt. Marcus Webb',
        phone: '555-3311',
        vehicleType: 'Inflatable Watercraft / Boat',
        certifications: ['Swift Water Rescue IV', 'Wilderness Paramedic', 'Boat Coxswain'],
        status: 'available',
        currentCoordinates: { lat: 34.09, lng: -119.47 }
      },
      {
        id: 'team-med-1',
        name: 'Mobile Trauma Unit 03',
        leadName: 'Dr. Anita Patel, EMT-P',
        phone: '555-3322',
        vehicleType: 'Ambulance / Mobile Med',
        certifications: ['Critical Care Transport', 'Cold-Chain Biologicals', 'Pediatric Life Support'],
        status: 'available',
        currentCoordinates: { lat: 34.13, lng: -119.51 }
      },
      {
        id: 'team-cargo-1',
        name: 'Logistics Convoy Unit Alpha',
        leadName: 'Sgt. Frank Miller',
        phone: '555-3333',
        vehicleType: 'Heavy Cargo Van',
        certifications: ['Commercial Hazardous Transport', 'Logistics Operations'],
        status: 'en_route',
        currentCoordinates: { lat: 34.15, lng: -119.52 },
        assignedMissionId: 'mission-seed-01'
      },
      {
        id: 'team-4x4-1',
        name: 'High-Clearance Recon Squad 7',
        leadName: 'Ranger Dave Kowalski',
        phone: '555-3344',
        vehicleType: 'High-Clearance 4x4',
        certifications: ['Off-Road Winch Certified', 'First Responder EMT-B'],
        status: 'available',
        currentCoordinates: { lat: 34.12, lng: -119.49 }
      }
    ],
    initialPledges: [
      {
        id: 'pl-1',
        donorName: 'Pacific Cold Storage Co.',
        contact: 'warehouse@pacificcold.org',
        type: 'supplies',
        description: 'Commercial dry ice totes & portable vaccine/insulin refrigeration coolers',
        quantity: 12,
        unit: 'units',
        targetHubId: 'hub-slate-central',
        status: 'pledged',
        timestamp: '1 hour ago'
      },
      {
        id: 'pl-2',
        donorName: 'Valley Water Co-op',
        contact: 'dispatch@valleywater.org',
        type: 'supplies',
        description: 'Potable 500-gallon water tanker and purification filter tablets',
        quantity: 500,
        unit: 'gallons',
        targetHubId: 'hub-slate-central',
        status: 'received',
        timestamp: '2 hours ago'
      },
      {
        id: 'pl-3',
        donorName: 'Carlos Rivera (Off-Road Club)',
        contact: '555-9201',
        type: 'transport',
        description: 'Lifted 4x4 Jeep with 12,000-lb recovery winch & chainsaw crew',
        quantity: 1,
        unit: 'vehicle',
        targetHubId: 'hub-delta-staging',
        status: 'pledged',
        timestamp: '35 mins ago'
      }
    ]
  },
  {
    id: 'flash_flood',
    title: 'Metropolitan Flash Flood & Subterranean Blackout',
    eventType: 'Severe Cloudburst & Urban Drainage Failure',
    region: 'Central Metro & Transit Corridors',
    activeDisplacements: 860,
    operationalShelters: 3,
    criticalNeedsCount: 4,
    brief: 'Historic 6-inch downpour in 2 hours overwhelmed municipal culverts. Subways and subterranean basements inundated; power station offline affecting hospital district.',
    initialSOS: [
      {
        id: 'sos-201',
        timestamp: '18 mins ago',
        callerName: 'Miriam Vance',
        contactNumber: '555-4012',
        rawText: 'Basement clinic submerged. 6 patients need immediate evacuation. One patient is in hypothermic shock after being trapped in knee-deep water for 3 hours. Elevator shafts flooded.',
        locationName: 'Metro Lower Health Clinic, 8th & Grand',
        coordinates: { lat: 34.15, lng: -119.50 },
        category: 'medical',
        urgencyScore: 5,
        urgencyLabel: 'Critical',
        vulnerableCount: 6,
        requestedItems: [
          { item: 'Advanced First Aid / Trauma Pack', quantity: 3, unit: 'packs' },
          { item: 'Heavy Thermal Mylar Blankets', quantity: 15, unit: 'units' },
          { item: 'Emergency Rescue Stretcher', quantity: 2, unit: 'units' }
        ],
        keyHazards: ['Flooded basement egress', 'Hypothermia', 'Active electrical short risk'],
        status: 'triaged',
        triageSummary: 'Hypothermic clinic patients trapped in flooded basement. Immediate extraction needed.',
        recommendedAction: 'Deploy rescue stretcher unit with thermal blankets.'
      }
    ],
    initialHubs: [
      {
        id: 'hub-metro-main',
        name: 'Metro Center Operations Hub',
        address: '500 Civic Center Mall',
        coordinates: { lat: 34.16, lng: -119.51 },
        status: 'operational',
        capacityPct: 74,
        manager: 'Chief Aaron Vance',
        contactPhone: '555-4100',
        inventory: [
          { id: 'm-1', item: 'Purified Drinking Water (1 Gallon Jugs)', category: 'water_food', available: 300, unit: 'gallons', reserved: 50 },
          { id: 'm-2', item: 'Heavy Thermal Mylar Blankets', category: 'power_shelter', available: 400, unit: 'units', reserved: 80 },
          { id: 'm-3', item: 'Emergency Rescue Stretcher', category: 'rescue_evac', available: 12, unit: 'units', reserved: 2 }
        ]
      }
    ],
    initialTeams: [
      {
        id: 'team-metro-paramedic',
        name: 'City Paramedic Squad 12',
        leadName: 'Lt. Gary Brooks',
        phone: '555-4200',
        vehicleType: 'Ambulance / Mobile Med',
        certifications: ['Advanced Trauma Life Support', 'Confined Space Rescue'],
        status: 'available',
        currentCoordinates: { lat: 34.16, lng: -119.51 }
      }
    ],
    initialPledges: [
      {
        id: 'pl-metro-1',
        donorName: 'Downtown Electrical Supply',
        contact: 'sales@dtelectric.com',
        type: 'supplies',
        description: 'Commercial submersible sump pumps and heavy-duty 240V extension reels',
        quantity: 8,
        unit: 'pumps',
        targetHubId: 'hub-metro-main',
        status: 'pledged',
        timestamp: '45 mins ago'
      }
    ]
  },
  {
    id: 'wildfire_evac',
    title: 'Canyon Wildfire Rapid Evacuation & Smoke Hazard',
    eventType: 'High-Velocity Wildfire & Gust Incursion',
    region: 'Foothill Canyons & Ridge Estates',
    activeDisplacements: 2100,
    operationalShelters: 5,
    criticalNeedsCount: 5,
    brief: '60 mph wind gusts pushed firefront across canyon divide. Heavy smoke plume descending into residential valley; elderly residents and asthma patients struggling with respiratory distress.',
    initialSOS: [
      {
        id: 'sos-301',
        timestamp: '8 mins ago',
        callerName: 'Arthur Pendelton',
        contactNumber: '555-7123',
        rawText: 'Heavy smoke surrounding ridge community. Several elderly neighbors with COPD and severe asthma cannot breathe. Visibility is under 30 feet, road blocked by fallen burning branches.',
        locationName: 'Ridgecrest Cul-de-sac, 9200 Canyon View',
        coordinates: { lat: 34.22, lng: -119.54 },
        category: 'medical',
        urgencyScore: 5,
        urgencyLabel: 'Critical',
        vulnerableCount: 5,
        requestedItems: [
          { item: 'Portable Oxygen Concentrator', quantity: 4, unit: 'units' },
          { item: 'Heavy Thermal Mylar Blankets', quantity: 10, unit: 'units' }
        ],
        keyHazards: ['Extreme smoke density', 'Burning debris on roadway', 'Respiratory distress'],
        status: 'triaged',
        triageSummary: 'Dense smoke entrapment with multiple COPD patients. Evacuation and oxygen required.',
        recommendedAction: 'Dispatch high-clearance 4x4 with respirator gear and oxygen tanks.'
      }
    ],
    initialHubs: [
      {
        id: 'hub-canyon-ridge',
        name: 'Foothill Fire Relief Base',
        address: 'Ridgeview High Stadium',
        coordinates: { lat: 34.21, lng: -119.53 },
        status: 'operational',
        capacityPct: 80,
        manager: 'Battalion Chief O’Connor',
        contactPhone: '555-7300',
        inventory: [
          { id: 'c-1', item: 'Portable Oxygen Concentrator', category: 'medical', available: 8, unit: 'units', reserved: 4 },
          { id: 'c-2', item: 'Heavy Thermal Mylar Blankets', category: 'power_shelter', available: 250, unit: 'units', reserved: 20 },
          { id: 'c-3', item: 'Purified Drinking Water (1 Gallon Jugs)', category: 'water_food', available: 600, unit: 'gallons', reserved: 100 }
        ]
      }
    ],
    initialTeams: [
      {
        id: 'team-canyon-4x4',
        name: 'Wildland Recon Squad 3',
        leadName: 'Capt. Linda Vasquez',
        phone: '555-7400',
        vehicleType: 'High-Clearance 4x4',
        certifications: ['Wildland Firefighter II', 'Winch Specialist', 'EMT-B'],
        status: 'available',
        currentCoordinates: { lat: 34.21, lng: -119.53 }
      }
    ],
    initialPledges: [
      {
        id: 'pl-wild-1',
        donorName: 'Valley Safety Equipment',
        contact: 'safety@valleysupply.org',
        type: 'supplies',
        description: 'N95 respirator masks (boxes of 50) and sterile saline eye wash kits',
        quantity: 40,
        unit: 'boxes',
        targetHubId: 'hub-canyon-ridge',
        status: 'pledged',
        timestamp: '25 mins ago'
      }
    ]
  }
];
