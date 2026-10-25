import React, { useState } from 'react';
import { ReliefHub, VolunteerTeam, SOSRequest } from '../types/crisis';
import { matchSOSWithResources, MatchResult } from '../utils/matcher';
import { Warehouse, Truck, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ResourceMatcherProps {
  hubs: ReliefHub[];
  teams: VolunteerTeam[];
  pendingSOS: SOSRequest[];
  onGenerateDispatch: (sos: SOSRequest, hub: ReliefHub, team: VolunteerTeam) => void;
}

export const ResourceMatcher: React.FC<ResourceMatcherProps> = ({
  hubs,
  teams,
  pendingSOS,
  onGenerateDispatch
}) => {
  const [selectedSOSId, setSelectedSOSId] = useState<string>(pendingSOS[0]?.id || '');

  const activeSOS = pendingSOS.find(s => s.id === selectedSOSId) || pendingSOS[0];
  const matchResult: MatchResult | null = activeSOS
    ? matchSOSWithResources(activeSOS, hubs, teams)
    : null;

  return (
    <div className="space-y-6 mb-6">
      {/* Overview Card with Visual Documentary Realism */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-5 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>AUTONOMOUS CONSTRAINT SATISFACTION ENGINE</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mb-2">
              Humanitarian Aid Matching & Dispatch Router
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
              ReliefGrid optimizes allocation between urgent clinical needs, regional staging inventories,
              and all-terrain volunteer rescue capabilities using distance modeling and inventory reservation constraints.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Staging Bases</span>
                <span className="font-mono text-white font-bold text-sm tabular-nums">
                  {hubs.length} active depots
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Deployment Units</span>
                <span className="font-mono text-white font-bold text-sm tabular-nums">
                  {teams.filter(t => t.status === 'available').length} of {teams.length} ready
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Pending SOS Matches</span>
                <span className="font-mono text-red-400 font-bold text-sm tabular-nums">
                  {pendingSOS.length} in queue
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[160px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800">
            <img
              src="/src/assets/images/relief_logistics_hub_1792952585963.jpg"
              alt="Emergency humanitarian relief logistics hub warehouse"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                Depot Floor Telemetry
              </span>
              <span className="text-xs text-slate-400">
                Cold-chain biologicals & water filtration verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target SOS Selector & Match Execution */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Select Distress Request to Route
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates inventory coverage, equipment pairing, and route transit ETA
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sos-select" className="text-xs text-slate-400 whitespace-nowrap">
              Distress Case:
            </label>
            <select
              id="sos-select"
              value={selectedSOSId}
              onChange={e => setSelectedSOSId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 font-medium focus:outline-none focus:border-red-500"
            >
              {pendingSOS.map(s => (
                <option key={s.id} value={s.id}>
                  P{s.urgencyScore} · {s.locationName.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeSOS && matchResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* Step 1: Distress Target */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-red-400">
                    Priority {activeSOS.urgencyScore} Distress Target
                  </span>
                  <span className="font-mono tabular-nums">{activeSOS.timestamp}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{activeSOS.locationName}</h4>
                <p className="text-xs text-slate-300 italic mb-3">"{activeSOS.rawText.slice(0, 110)}..."</p>

                <div className="text-xs text-slate-400 space-y-1 mb-2">
                  <div>
                    <span className="text-slate-500">Demanded Goods:</span>
                    <ul className="mt-1 space-y-0.5 text-slate-300">
                      {activeSOS.requestedItems.map((r, i) => (
                        <li key={i} className="flex justify-between font-mono">
                          <span>{r.item}</span>
                          <span className="text-slate-400 tabular-nums">
                            {r.quantity} {r.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 text-xs text-slate-400">
                Reporter: {activeSOS.callerName} ({activeSOS.contactNumber})
              </div>
            </div>

            {/* Step 2: Optimal Match Pairing */}
            <div className="bg-slate-950 border border-emerald-900/60 rounded-lg p-4 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Algorithmic Optimization</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                    {matchResult.matchScore}/100 Match
                  </span>
                </div>

                {/* Staging Depot Assigned */}
                <div className="mb-3 bg-slate-900 border border-slate-800 rounded p-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-1">
                    <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Origin Depot: {matchResult.hub.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {matchResult.inventoryCoveragePct}% Inventory Coverage · Managed by {matchResult.hub.manager}
                  </div>
                </div>

                {/* Response Team Assigned */}
                <div className="mb-3 bg-slate-900 border border-slate-800 rounded p-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Response Unit: {matchResult.team.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Vehicle: {matchResult.team.vehicleType}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Certs: {matchResult.team.certifications.join(', ')}
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed mb-2">
                  {matchResult.rationale}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs font-mono tabular-nums">
                <span className="text-slate-400">Distance: {matchResult.distanceKm} km</span>
                <span className="text-emerald-400 font-bold">Transit ETA: ~{matchResult.etaMinutes} min</span>
              </div>
            </div>

            {/* Step 3: Trigger Mission Action */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Mission Action Directive
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Confirming this match will immediately formulate the AI tactical mission order,
                  reserve the specified supplies from {matchResult.hub.name}, and alert {matchResult.team.name}.
                </p>

                <div className="bg-slate-900 border border-slate-800 rounded p-3 text-xs space-y-1.5 text-slate-300 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stock Status:</span>
                    <span className="text-emerald-400">In Stock & Verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Unit Status:</span>
                    <span className="text-emerald-400 font-semibold">Available / Standby</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hazard Clearance:</span>
                    <span className="text-amber-400">Tactical Caution</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onGenerateDispatch(activeSOS, matchResult.hub, matchResult.team)}
                className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Generate Mission Manifest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-950 border border-slate-800 rounded">
            <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <span className="text-xs text-slate-400">
              No active pending distress calls to match or all available units en-route.
            </span>
          </div>
        )}
      </div>

      {/* Regional Inventory Ledgers */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-bold text-white tracking-tight mb-3">
          Regional Staging Hub Inventory Ledgers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hubs.map(hub => (
            <div key={hub.id} className="bg-slate-950 border border-slate-800 rounded p-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-850 mb-3">
                <span className="font-bold text-white">{hub.name}</span>
                <span className="font-mono text-emerald-400 font-medium tabular-nums">
                  {hub.capacityPct}% Capacity
                </span>
              </div>
              <div className="space-y-1.5 font-mono tabular-nums">
                {hub.inventory.slice(0, 5).map(inv => (
                  <div key={inv.id} className="flex justify-between items-center text-slate-300">
                    <span className="font-sans truncate max-w-[170px]">{inv.item}</span>
                    <span className="text-slate-400">
                      {inv.available} {inv.unit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-850 text-slate-500 text-[11px] flex justify-between font-sans">
                <span>Manager: {hub.manager}</span>
                <span>{hub.contactPhone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
