import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'incidents' | 'dispatch' | 'mutual_aid' | 'sitrep';
  onSelectTab: (tab: 'overview' | 'incidents' | 'dispatch' | 'mutual_aid' | 'sitrep') => void;
  onOpenSOSModal: () => void;
  activeScenarioTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSOSModal,
  activeScenarioTitle
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-white font-bold">
            <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          </div>
          <button
            onClick={() => onSelectTab('overview')}
            className="text-lg font-bold tracking-tight text-white hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            ReliefGrid
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'overview'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('incidents')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'incidents'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Incidents
          </button>
          <button
            onClick={() => onSelectTab('dispatch')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'dispatch'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Resource Dispatch
          </button>
          <button
            onClick={() => onSelectTab('mutual_aid')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'mutual_aid'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mutual Aid
          </button>
          <button
            onClick={() => onSelectTab('sitrep')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'sitrep'
                ? 'border-red-500 text-white font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SitRep Briefing
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSOSModal}
            className="px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            aria-label="Report Distress SOS"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Report Distress SOS</span>
            <span className="sm:hidden">Report SOS</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Strip (Visible on mobile screens) */}
      <nav className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs font-medium text-slate-300 no-scrollbar">
        <button
          onClick={() => onSelectTab('overview')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'overview' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('incidents')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'incidents' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Incidents
        </button>
        <button
          onClick={() => onSelectTab('dispatch')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'dispatch' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dispatch
        </button>
        <button
          onClick={() => onSelectTab('mutual_aid')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'mutual_aid' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Mutual Aid
        </button>
        <button
          onClick={() => onSelectTab('sitrep')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded transition-colors ${
            activeTab === 'sitrep' ? 'bg-red-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          SitRep
        </button>
      </nav>

      {/* Sub-header context strip: clean unboxed prose without pills */}
      <div className="bg-slate-900 border-t border-slate-850 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-400 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-slate-200 font-medium">Active Operation:</span>
          <span>{activeScenarioTitle}</span>
          <span aria-hidden="true">·</span>
          <span>NIMS Aligned</span>
          <span aria-hidden="true">·</span>
          <span>Sub-meter Triage</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono text-[11px] tabular-nums">
          <span>UTC {new Date().toISOString().slice(11, 16)}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 font-sans">Radio Link Nominal</span>
        </div>
      </div>
    </header>
  );
};
