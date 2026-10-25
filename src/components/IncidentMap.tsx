import React, { useState } from 'react';
import { SOSRequest, ReliefHub, VolunteerTeam } from '../types/crisis';
import { MapPin, Navigation, Eye, Layers } from 'lucide-react';

interface IncidentMapProps {
  incidents: SOSRequest[];
  hubs: ReliefHub[];
  teams: VolunteerTeam[];
  onSelectIncident: (sos: SOSRequest) => void;
  onDispatchSOS: (sos: SOSRequest) => void;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  hubs,
  teams,
  onSelectIncident,
  onDispatchSOS
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(incidents[0]?.id || null);
  const [showFloods, setShowFloods] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showTeams, setShowTeams] = useState(true);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden mb-6">
      {/* Top Map Action Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Regional Crisis Cartography & Tactical Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial telemetry for Slate Bay & Delta Coastal drainage sectors
          </p>
        </div>

        {/* Layer Toggles (Functional buttons with active states) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Layers:</span>
            </span>
            <button
              onClick={() => setShowFloods(!showFloods)}
              className={`px-2.5 py-1 rounded transition-colors ${
                showFloods
                  ? 'bg-blue-900/60 text-blue-200 border border-blue-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Surge Inundation
            </button>
            <button
              onClick={() => setShowHubs(!showHubs)}
              className={`px-2.5 py-1 rounded transition-colors ${
                showHubs
                  ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Staging Depots ({hubs.length})
            </button>
            <button
              onClick={() => setShowTeams(!showTeams)}
              className={`px-2.5 py-1 rounded transition-colors ${
                showTeams
                  ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Units ({teams.length})
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Visual Map Canvas with Satellite Base & SVG Vector Overlays */}
        <div className="lg:col-span-2 relative min-h-[420px] bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* Base Satellite Imagery */}
          <img
            src="/src/assets/images/hero_crisis_map_1792952584920.jpg"
            alt="Tactical satellite map of coastal disaster sector with GIS grid overlay"
            className="w-full h-full object-cover opacity-75"
            referrerPolicy="no-referrer"
          />

          {/* Fallback CSS pattern container if image is loading */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

          {/* SVG Tactical Coordinate Grid & Pins */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
            {/* Grid Coordinates Lines */}
            <line x1="200" y1="0" x2="200" y2="500" stroke="#334155" strokeWidth="0.75" strokeDasharray="4 4" />
            <line x1="400" y1="0" x2="400" y2="500" stroke="#334155" strokeWidth="0.75" strokeDasharray="4 4" />
            <line x1="600" y1="0" x2="600" y2="500" stroke="#334155" strokeWidth="0.75" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#334155" strokeWidth="0.75" strokeDasharray="4 4" />
            <line x1="0" y1="350" x2="800" y2="350" stroke="#334155" strokeWidth="0.75" strokeDasharray="4 4" />

            {/* Simulated Flood Hazard Polygon */}
            {showFloods && (
              <path
                d="M 120 400 Q 250 280 440 330 T 750 420 L 780 490 L 100 490 Z"
                fill="rgba(14, 165, 233, 0.22)"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
            )}
          </svg>

          {/* Interactive Incident Beacons */}
          <div className="absolute inset-0 p-4">
            {/* Hubs */}
            {showHubs &&
              hubs.map((hub, idx) => {
                const posX = 15 + ((idx * 32) % 70);
                const posY = 35 + ((idx * 24) % 45);
                return (
                  <button
                    key={hub.id}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
                    title={`Relief Hub: ${hub.name}`}
                    aria-label={`Relief Hub: ${hub.name}`}
                  >
                    <div className="flex items-center gap-1.5 bg-slate-950/90 text-emerald-400 border border-emerald-500/80 px-2 py-0.5 rounded text-[11px] font-mono tracking-tight font-medium shadow-md">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{hub.name.split(' ')[0]} Hub</span>
                    </div>
                  </button>
                );
              })}

            {/* Units */}
            {showTeams &&
              teams.map((team, idx) => {
                const posX = 25 + ((idx * 26) % 65);
                const posY = 45 + ((idx * 18) % 40);
                return (
                  <div
                    key={team.id}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    title={`Team: ${team.name}`}
                  >
                    <div className="flex items-center gap-1 bg-slate-950/80 text-amber-300 border border-amber-600/60 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      <Navigation className="w-2.5 h-2.5 rotate-45" />
                      <span>{team.name.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}

            {/* Incidents (Clickable pins) */}
            {incidents.map((sos, idx) => {
              const posX = 20 + ((idx * 21) % 65);
              const posY = 22 + ((idx * 27) % 55);
              const isSelected = selectedIncident?.id === sos.id;
              const isP1 = sos.urgencyScore === 5;

              return (
                <button
                  key={sos.id}
                  onClick={() => setSelectedIncidentId(sos.id)}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 focus:outline-none transition-transform ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                  }`}
                  aria-label={`Emergency: ${sos.locationName}, Urgency ${sos.urgencyScore}`}
                >
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded border shadow-lg text-xs font-semibold ${
                      isP1
                        ? 'bg-red-950/95 text-red-200 border-red-500 shadow-red-950/50'
                        : 'bg-amber-950/95 text-amber-200 border-amber-500'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>P{sos.urgencyScore}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Compass / Scale Bar */}
          <div className="absolute bottom-3 left-4 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded text-[11px] text-slate-400 font-mono flex items-center gap-4">
            <span>GRID: WGS84 ZONE 11N</span>
            <span aria-hidden="true">·</span>
            <span>SCALE: 1:25,000</span>
            <span aria-hidden="true">·</span>
            <span>DATUM: NAVD88</span>
          </div>
        </div>

        {/* Selected Incident Telemetry & Immediate Action Inspector */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-800 p-5 bg-slate-900/90 flex flex-col justify-between">
          {selectedIncident ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Selected Distress Incident</span>
                <span className="font-mono tabular-nums">{selectedIncident.timestamp}</span>
              </div>

              <h3 className="text-base font-bold text-white tracking-tight mb-1">
                {selectedIncident.locationName}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                <span className="font-semibold text-red-400">
                  Priority {selectedIncident.urgencyScore} · {selectedIncident.urgencyLabel}
                </span>
                <span aria-hidden="true">/</span>
                <span>{selectedIncident.category.replace('_', ' ').toUpperCase()}</span>
                {selectedIncident.vulnerableCount > 0 && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span className="text-amber-400 font-mono tabular-nums">
                      {selectedIncident.vulnerableCount} high-risk
                    </span>
                  </>
                )}
              </div>

              {/* Triage Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  AI Triage Assessment
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedIncident.triageSummary}
                </p>
              </div>

              {/* Reported Hazards */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Environmental Hazards
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {selectedIncident.keyHazards.map((hz, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-400">·</span>
                      <span>{hz}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Supplies */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Essential Supply Manifest
                </div>
                <div className="space-y-1.5">
                  {selectedIncident.requestedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-800 last:border-0"
                    >
                      <span className="text-slate-300">{item.item}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-12">
              Select an incident marker from the map to inspect telemetry
            </div>
          )}

          {selectedIncident && (
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="flex-1 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors text-center"
              >
                Inspect Telemetry
              </button>
              <button
                onClick={() => onDispatchSOS(selectedIncident)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition-colors text-center"
              >
                Dispatch Rescue Mission
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
