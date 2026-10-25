import React from 'react';
import { CrisisScenario } from '../types/crisis';
import { SEED_SCENARIOS } from '../data/seedScenarios';
import { RotateCcw } from 'lucide-react';

interface ScenarioSelectorProps {
  currentScenarioId: string;
  onSelectScenario: (scenario: CrisisScenario) => void;
  onResetScenario: () => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenarioId,
  onSelectScenario,
  onResetScenario
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Crisis Demonstration Scenarios
        </div>
        <p className="text-xs text-slate-400">
          Switch active crisis context to evaluate AI triage and logistics under different disaster profiles
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {SEED_SCENARIOS.map(s => {
          const isActive = s.id === currentScenarioId;
          return (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                isActive
                  ? 'bg-red-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {s.title.split('&')[0].trim()}
            </button>
          );
        })}

        <button
          onClick={onResetScenario}
          className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded transition-colors flex items-center gap-1.5"
          title="Reset Active Scenario Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
