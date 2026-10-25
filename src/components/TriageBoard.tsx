import React, { useState } from 'react';
import { SOSRequest, CrisisCategory } from '../types/crisis';
import { Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface TriageBoardProps {
  incidents: SOSRequest[];
  onDispatchIncident: (sos: SOSRequest) => void;
  onResolveIncident: (id: string) => void;
  onOpenSOSModal: () => void;
}

export const TriageBoard: React.FC<TriageBoardProps> = ({
  incidents,
  onDispatchIncident,
  onResolveIncident,
  onOpenSOSModal
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterPriority === 'critical' && item.urgencyScore !== 5) return false;
    if (filterPriority === 'severe' && item.urgencyScore < 4) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.locationName.toLowerCase().includes(q) ||
        item.callerName.toLowerCase().includes(q) ||
        item.rawText.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-6">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Live Emergency Incident & Distress Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active triaged requests categorized by clinical and logistical severity
          </p>
        </div>

        <button
          onClick={onOpenSOSModal}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
        >
          + Add Distress SOS
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by street, caller, medical need, or sector..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Category Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterCategory === 'all'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({incidents.length})
          </button>
          <button
            onClick={() => setFilterCategory('medical')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterCategory === 'medical'
                ? 'bg-slate-800 text-red-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Medical
          </button>
          <button
            onClick={() => setFilterCategory('rescue_evac')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterCategory === 'rescue_evac'
                ? 'bg-slate-800 text-blue-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rescue / Evac
          </button>
          <button
            onClick={() => setFilterCategory('power_shelter')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterCategory === 'power_shelter'
                ? 'bg-slate-800 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Power / Shelter
          </button>
          <button
            onClick={() => setFilterCategory('water_food')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterCategory === 'water_food'
                ? 'bg-slate-800 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Water & Food
          </button>
        </div>
      </div>

      {/* Incidents List */}
      {filteredIncidents.length === 0 ? (
        <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-lg">
          <CheckCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No matching distress reports found</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map(item => {
            const isCritical = item.urgencyScore === 5;
            const isSevere = item.urgencyScore === 4;

            return (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Header Row: Clean unboxed metadata with separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                      <span
                        className={`font-mono font-bold ${
                          isCritical
                            ? 'text-red-400'
                            : isSevere
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        Priority {item.urgencyScore} · {item.urgencyLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="uppercase text-slate-300 font-medium">
                        {item.category.replace('_', ' ')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.timestamp}
                      </span>
                      {item.vulnerableCount > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-mono tabular-nums">
                            {item.vulnerableCount} vulnerable person(s)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Location & Caller */}
                    <h3 className="text-sm font-bold text-white tracking-tight mb-1">
                      {item.locationName}
                    </h3>
                    <div className="text-xs text-slate-400 mb-2">
                      Reported by <span className="text-slate-300">{item.callerName}</span> ({item.contactNumber})
                    </div>

                    {/* Raw Text excerpt */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-3 italic">
                      "{item.rawText}"
                    </p>

                    {/* AI Assessment Brief */}
                    <div className="bg-slate-900 border border-slate-850 rounded p-2.5 mb-3 text-xs">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                        Operational Directive
                      </div>
                      <p className="text-slate-200 leading-normal">
                        {item.triageSummary} — {item.recommendedAction}
                      </p>
                    </div>

                    {/* Requested Supplies Manifest */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span className="font-medium text-slate-500">Allocated needs:</span>
                      {item.requestedItems.map((req, idx) => (
                        <span key={idx} className="text-slate-300 font-mono tabular-nums">
                          {req.quantity} {req.unit} {req.item}
                          {idx < item.requestedItems.length - 1 && <span className="text-slate-600 ml-2">/</span>}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-xs font-mono uppercase tracking-wider">
                      {item.status === 'dispatched' ? (
                        <span className="text-blue-400 font-bold">En Route</span>
                      ) : item.status === 'resolved' ? (
                        <span className="text-emerald-400 font-bold">Resolved</span>
                      ) : item.status === 'assigned' ? (
                        <span className="text-amber-400 font-bold">Assigned</span>
                      ) : (
                        <span className="text-red-400 font-bold">Pending Action</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status !== 'resolved' && (
                        <button
                          onClick={() => onResolveIncident(item.id)}
                          className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-800 rounded transition-colors"
                          title="Mark Incident Resolved"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => onDispatchIncident(item)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition-colors whitespace-nowrap"
                      >
                        Deploy Mission
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
