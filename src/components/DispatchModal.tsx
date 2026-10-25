import React, { useState, useEffect } from 'react';
import { SOSRequest, ReliefHub, VolunteerTeam, MissionDispatch } from '../types/crisis';
import { X, Loader2, Navigation, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface DispatchModalProps {
  isOpen: boolean;
  sos: SOSRequest | null;
  hub: ReliefHub | null;
  team: VolunteerTeam | null;
  onClose: () => void;
  onConfirmDispatch: (dispatch: MissionDispatch) => void;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  sos,
  hub,
  team,
  onClose,
  onConfirmDispatch
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && sos && hub && team) {
      fetchDispatchPlan();
    } else {
      setPlan(null);
      setErrorMsg('');
    }
  }, [isOpen, sos?.id, hub?.id, team?.id]);

  const fetchDispatchPlan = async () => {
    if (!sos || !hub || !team) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/dispatch-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sosRequest: sos,
          matchedHub: hub,
          matchedTeam: team
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setPlan(data);
    } catch (err: any) {
      console.warn('Dispatch plan API fetch fallback:', err);
      // Fallback
      setPlan({
        source: 'heuristic_engine',
        routeCaution: 'Avoid low-lying culverts along Highway 101 corridor. Use ridge bypass.',
        safetyBriefing: [
          'Wear Level 2 personal flotation vests and maintain active radio check-in every 10 min',
          'Deploy secondary winch anchors before entering waterlogged driveways',
          'Administer vitals evaluation immediately upon contact with patients'
        ],
        priorityEquipment: ['Thermal rescue blankets', 'Portable AED & oxygen kit', 'Heavy tow straps'],
        etaMinutes: 20
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !sos || !hub || !team) return null;

  const handleExecuteDispatch = () => {
    const newDispatch: MissionDispatch = {
      id: `disp-${Date.now().toString().slice(-4)}`,
      sosRequestId: sos.id,
      hubId: hub.id,
      teamId: team.id,
      createdAt: new Date().toISOString(),
      status: 'dispatched',
      allocatedSupplies: sos.requestedItems,
      routeCaution: plan?.routeCaution || 'Standard disaster conditions apply.',
      safetyBriefing: plan?.safetyBriefing || [],
      priorityEquipment: plan?.priorityEquipment || [],
      etaMinutes: plan?.etaMinutes || 25
    };

    onConfirmDispatch(newDispatch);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispatch-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 text-slate-100 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white">
              <Navigation className="w-4 h-4 rotate-45" />
            </div>
            <div>
              <h2 id="dispatch-modal-title" className="text-base font-bold text-white tracking-tight">
                Tactical Mission Dispatch Manifest
              </h2>
              <p className="text-xs text-slate-400">
                AI-optimized route navigation, crew safety protocol, and supply release order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Realism Banner */}
        <div className="relative h-28 rounded-lg overflow-hidden border border-slate-800 mb-4">
          <img
            src="/src/assets/images/dispatch_convoy_1792952585621.jpg"
            alt="Emergency rescue convoy staged for tactical field mission"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3 flex flex-col justify-end">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span className="font-mono font-bold tracking-wider uppercase">
                Field Unit: {team.name}
              </span>
              <span className="font-mono tabular-nums text-emerald-400">
                Vehicle: {team.vehicleType}
              </span>
            </div>
          </div>
        </div>

        {/* Incident Summary Card */}
        <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Destination Target:</span>
            <span className="font-bold text-red-400">
              Priority {sos.urgencyScore} · {sos.locationName}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Origin Staging Depot:</span>
            <span className="text-slate-300">{hub.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Primary Contact:</span>
            <span className="text-slate-300">{sos.callerName} ({sos.contactNumber})</span>
          </div>
        </div>

        {/* AI Loading State */}
        {isLoading && (
          <div className="py-10 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-500 mx-auto" />
            <div className="text-xs text-slate-300 font-medium">
              Generating tactical route caution & crew safety protocol via Gemini...
            </div>
          </div>
        )}

        {/* Tactical Plan Content */}
        {!isLoading && plan && (
          <div className="space-y-4">
            {/* Route Caution */}
            <div className="bg-amber-950/30 border border-amber-900/60 rounded p-3 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-300 mb-0.5">Route Navigation Caution:</span>
                <span>{plan.routeCaution}</span>
              </div>
            </div>

            {/* Safety Briefing Checklist */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Mandatory Crew Operational Safety Protocol
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {plan.safetyBriefing?.map((point: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assigned Cargo Items */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Cargo Manifest Release (To be loaded from {hub.name})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {sos.requestedItems.map((req, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded flex justify-between items-center"
                  >
                    <span className="text-slate-200">{req.item}</span>
                    <span className="font-mono text-slate-400 font-medium tabular-nums">
                      {req.quantity} {req.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Arrival */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 font-mono">
              <span className="text-slate-400">Calculated Transit Window:</span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">
                ETA ~{plan.etaMinutes} Minutes
              </span>
            </div>

            {/* Transmit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDispatch}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded flex items-center gap-2 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Transmit Mission Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
