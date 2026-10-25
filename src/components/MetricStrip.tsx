import React from 'react';
import { Users, AlertTriangle, Warehouse, CheckCircle2 } from 'lucide-react';

interface MetricStripProps {
  activeDisplacements: number;
  criticalNeedsCount: number;
  totalTriaged: number;
  operationalHubsCount: number;
  fulfillmentRatePct: number;
}

export const MetricStrip: React.FC<MetricStripProps> = ({
  activeDisplacements,
  criticalNeedsCount,
  totalTriaged,
  operationalHubsCount,
  fulfillmentRatePct,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Active Displacements</span>
          <Users className="w-4 h-4 text-slate-500" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {activeDisplacements.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Sheltered across regional relief bases
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Priority 1 Life-Threat Calls</span>
          <AlertTriangle className="w-4 h-4 text-red-500" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-red-400 font-mono tabular-nums">
          {criticalNeedsCount}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Requiring immediate boat/medical dispatch
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Operational Staging Depots</span>
          <Warehouse className="w-4 h-4 text-slate-500" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {operationalHubsCount}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Inventory verified & active radio watch
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Supply Matching Coverage</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums">
          {fulfillmentRatePct}%
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {totalTriaged} total distress cases mapped
        </div>
      </div>
    </div>
  );
};
