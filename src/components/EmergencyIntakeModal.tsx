import React, { useState } from 'react';
import { SOSRequest } from '../types/crisis';
import { AlertCircle, Loader2, Sparkles, X, Check } from 'lucide-react';

interface EmergencyIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSOS: (sos: SOSRequest) => void;
}

const DEMO_PRESETS = [
  {
    label: 'Flooded Care Facility',
    caller: 'Nurse Supervisor Karen Diaz',
    contact: '555-0914',
    location: 'St. Jude Convalescent Home, 440 Cypress Ave',
    vulnerable: 8,
    text: 'Basement generator shorted in floodwater. 8 stroke patients require suction machines and oxygen concentrators. Cold storage for diabetic insulin is reaching room temperature.'
  },
  {
    label: 'Rooftop Family with Infant',
    caller: 'David & Maria Torres',
    contact: '555-0819',
    location: '712 Bayou Vista Road',
    vulnerable: 2,
    text: 'Creek crested suddenly and entered living room. We retreated to the attic with our 4-month-old twins. Running out of clean water bottles and baby formula. Need boat extraction.'
  },
  {
    label: 'Hypothermia & Debris Entrapment',
    caller: 'Gordon Vance',
    contact: '555-0427',
    location: 'Milepost 14, Old County Route',
    vulnerable: 1,
    text: 'Car slid off washed-out culvert into swollen ditch. Passenger has possible broken arm and showing signs of severe shivering/hypothermia. Water is up to the door handles.'
  }
];

export const EmergencyIntakeModal: React.FC<EmergencyIntakeModalProps> = ({
  isOpen,
  onClose,
  onSubmitSOS
}) => {
  const [callerName, setCallerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [locationName, setLocationName] = useState('');
  const [rawText, setRawText] = useState('');
  const [vulnerableCount, setVulnerableCount] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setCallerName(preset.caller);
    setContactNumber(preset.contact);
    setLocationName(preset.location);
    setRawText(preset.text);
    setVulnerableCount(preset.vulnerable);
    setTriageResult(null);
    setErrorMsg('');
  };

  const handleRunAITriage = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Please enter or select emergency distress details.');
      return;
    }
    setErrorMsg('');
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          callerName: callerName || 'Anonymous Citizen',
          locationName: locationName || 'Regional Disaster Sector',
          vulnerableCount: Number(vulnerableCount) || 0
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setTriageResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to triage. Using offline fallback.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmSubmission = () => {
    if (!triageResult) return;

    const newSOS: SOSRequest = {
      id: `sos-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      callerName: callerName || 'Citizen Report',
      contactNumber: contactNumber || 'Radio Net',
      locationName: locationName || 'Reported Sector',
      coordinates: {
        lat: 34.12 + (Math.random() * 0.08 - 0.04),
        lng: -119.49 + (Math.random() * 0.08 - 0.04)
      },
      rawText,
      category: triageResult.category,
      urgencyScore: triageResult.urgencyScore,
      urgencyLabel: triageResult.urgencyLabel,
      vulnerableCount: triageResult.vulnerableCount ?? vulnerableCount,
      requestedItems: triageResult.requestedItems || [],
      keyHazards: triageResult.keyHazards || [],
      status: 'triaged',
      triageSummary: triageResult.triageSummary,
      recommendedAction: triageResult.recommendedAction
    };

    onSubmitSOS(newSOS);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 text-slate-100 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 id="sos-modal-title" className="text-base font-bold text-white tracking-tight">
                Emergency Distress Intake & AI Triage
              </h2>
              <p className="text-xs text-slate-400">
                Log real-time civilian SOS reports for automated severity scoring and logistics routing
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

        {/* Demo Fast Presets */}
        <div className="mb-4 bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400 font-medium mb-2">
            Load Evaluation Sample Distress Signals:
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="caller-name" className="block text-xs font-medium text-slate-300 mb-1">
                Caller / Reporter Name
              </label>
              <input
                id="caller-name"
                type="text"
                value={callerName}
                onChange={e => setCallerName(e.target.value)}
                placeholder="e.g. Captain Vance, Shelter Lead"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="contact-num" className="block text-xs font-medium text-slate-300 mb-1">
                Contact Phone / VHF Channel
              </label>
              <input
                id="contact-num"
                type="text"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="e.g. 555-0199 or VHF Ch. 16"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="location-name" className="block text-xs font-medium text-slate-300 mb-1">
                Physical Location / Landmark
              </label>
              <input
                id="location-name"
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="e.g. 1420 Shoreline Blvd, Unit 4B"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="vulnerable-count" className="block text-xs font-medium text-slate-300 mb-1">
                Vulnerable Persons Count
              </label>
              <input
                id="vulnerable-count"
                type="number"
                min="0"
                value={vulnerableCount}
                onChange={e => setVulnerableCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono tabular-nums focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="raw-text" className="block text-xs font-medium text-slate-300 mb-1">
              Raw Emergency Description / Dispatch Transcript
            </label>
            <textarea
              id="raw-text"
              rows={3}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Describe situation, flood depth, trapped individuals, medical conditions, power outages, food/water urgency..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 p-2.5 rounded">
              {errorMsg}
            </div>
          )}

          {/* AI Trigger Button */}
          {!triageResult && (
            <button
              type="button"
              onClick={handleRunAITriage}
              disabled={isAnalyzing || !rawText.trim()}
              className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Urgency & Extracting Needs with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Triage with Gemini Disaster Engine</span>
                </>
              )}
            </button>
          )}

          {/* Triaged Output Result Preview */}
          {triageResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Triage Classification Result
                  </span>
                  <span className="text-xs text-slate-400">
                    via {triageResult.source || 'gemini-3.8-flash'}
                  </span>
                </div>
                <div className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                  Priority {triageResult.urgencyScore} · {triageResult.urgencyLabel}
                </div>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-medium">Domain: </span>
                <span className="font-semibold text-white uppercase">
                  {triageResult.category?.replace('_', ' ')}
                </span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="text-slate-400 font-medium">Action Directive: </span>
                <span className="text-slate-200">{triageResult.recommendedAction}</span>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Identified Tactical Hazards
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  {triageResult.keyHazards?.map((hz: string, i: number) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-red-400">·</span>
                      <span>{hz}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Extracted Supply Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                  {triageResult.requestedItems?.map((it: any, i: number) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 px-2 py-1 rounded flex justify-between">
                      <span className="text-slate-300">{it.item}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {it.quantity} {it.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTriageResult(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded"
                >
                  Re-evaluate
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmission}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept & Inject into Crisis Queue</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
