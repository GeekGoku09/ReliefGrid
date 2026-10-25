import React, { useState } from 'react';
import { MutualAidPledge, ReliefHub } from '../types/crisis';
import { HeartHandshake, Package, PlusCircle, Check } from 'lucide-react';

interface MutualAidPortalProps {
  pledges: MutualAidPledge[];
  hubs: ReliefHub[];
  onAddPledge: (pledge: MutualAidPledge) => void;
}

const CRITICAL_SHORTAGES = [
  { item: 'Purified Drinking Water (1 Gallon)', needed: 1500, pledged: 920, unit: 'gallons' },
  { item: '5kW Inverter Generators', needed: 15, pledged: 8, unit: 'units' },
  { item: 'Cold-Chain Insulin Coolers', needed: 25, pledged: 16, unit: 'kits' },
  { item: 'Pediatric Formula & Electrolytes', needed: 80, pledged: 48, unit: 'liters' },
  { item: 'Heavy Thermal Mylar Blankets', needed: 1200, pledged: 850, unit: 'units' }
];

export const MutualAidPortal: React.FC<MutualAidPortalProps> = ({
  pledges,
  hubs,
  onAddPledge
}) => {
  const [donorName, setDonorName] = useState('');
  const [contact, setContact] = useState('');
  const [pledgeType, setPledgeType] = useState<'supplies' | 'transport' | 'specialized_skill'>('supplies');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [targetHubId, setTargetHubId] = useState(hubs[0]?.id || '');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmitPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !donorName.trim()) return;

    const newPledge: MutualAidPledge = {
      id: `pl-${Date.now().toString().slice(-4)}`,
      donorName,
      contact: contact || 'Anonymous',
      type: pledgeType,
      description,
      quantity: Number(quantity) || 1,
      unit,
      targetHubId,
      status: 'pledged',
      timestamp: 'Just now'
    };

    onAddPledge(newPledge);
    setDescription('');
    setDonorName('');
    setContact('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="p-5 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span>COMMUNITY AID & VOLUNTEER DISPATCH GRID</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mb-2">
              Citizen Mutual Aid & Direct Resource Pledging
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mb-4">
              During large-scale emergencies, decentralized community assistance bridges the critical
              window before federal supply convoys arrive. Pledge critical supplies, specialized equipment,
              or all-terrain vehicle transport to verified staging hubs.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-3 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Total Community Pledges</span>
                <span className="font-mono text-white font-bold text-sm tabular-nums">
                  {pledges.length} registered
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Fulfillment Verified</span>
                <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                  100% transparent audit
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[160px] bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800">
            <img
              src="/src/assets/images/field_coordinator_1792952584918.jpg"
              alt="Humanitarian relief logistics coordinator verifying community donations"
              className="w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                Intake Verification Desk
              </span>
              <span className="text-xs text-slate-400">
                Direct staging delivery to municipal relief depots
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Verified Shortages Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-bold text-white tracking-tight mb-3">
          Verified Priority Shortages Across Regional Bases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRITICAL_SHORTAGES.map((s, idx) => {
            const pct = Math.min(100, Math.round((s.pledged / s.needed) * 100));
            return (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded p-4 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-white">{s.item}</span>
                  <span className="font-mono text-slate-400 tabular-nums">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-slate-400 font-mono text-[11px] tabular-nums">
                  <span>Pledged: {s.pledged} {s.unit}</span>
                  <span>Goal: {s.needed} {s.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pledge Form & Live Pledges Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Pledge Aid or Specialized Skill
            </h3>
          </div>

          <form onSubmit={handleSubmitPledge} className="space-y-3 text-xs">
            <div>
              <label htmlFor="donor-name" className="block text-slate-300 font-medium mb-1">
                Your Name / Organization
              </label>
              <input
                id="donor-name"
                type="text"
                required
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                placeholder="e.g. Elena Rostova or Bay Area 4x4 Club"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="donor-contact" className="block text-slate-300 font-medium mb-1">
                Contact Phone or Email
              </label>
              <input
                id="donor-contact"
                type="text"
                required
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="e.g. 555-0182 or aid@valleycoop.org"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="pledge-type" className="block text-slate-300 font-medium mb-1">
                Pledge Category
              </label>
              <select
                id="pledge-type"
                value={pledgeType}
                onChange={e => setPledgeType(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              >
                <option value="supplies">Essential Supplies & Goods</option>
                <option value="transport">High-Clearance Transport / Watercraft</option>
                <option value="specialized_skill">Medical, Translation, or Rescue Skill</option>
              </select>
            </div>

            <div>
              <label htmlFor="pledge-desc" className="block text-slate-300 font-medium mb-1">
                Description of Aid
              </label>
              <textarea
                id="pledge-desc"
                rows={2}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. 40 gallons drinking water, 2 portable sump pumps, or lifted pickup truck"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="pledge-qty" className="block text-slate-300 font-medium mb-1">
                  Quantity
                </label>
                <input
                  id="pledge-qty"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono tabular-nums focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label htmlFor="pledge-unit" className="block text-slate-300 font-medium mb-1">
                  Unit
                </label>
                <input
                  id="pledge-unit"
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="units, gallons, boxes"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="target-hub" className="block text-slate-300 font-medium mb-1">
                Drop-off Staging Depot
              </label>
              <select
                id="target-hub"
                value={targetHubId}
                onChange={e => setTargetHubId(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-red-500"
              >
                {hubs.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            {isSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-700 p-2 rounded text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Pledge registered and credited to staging inventory!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
            >
              Confirm Mutual Aid Pledge
            </button>
          </form>
        </div>

        {/* Live Pledges Ledger */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Verified Community Contribution Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Direct pledges allocated to regional relief hubs
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {pledges.length} total entries
            </span>
          </div>

          <div className="space-y-2.5">
            {pledges.map(p => {
              const targetHub = hubs.find(h => h.id === p.targetHubId);
              return (
                <div
                  key={p.id}
                  className="bg-slate-950 border border-slate-800 rounded p-3 text-xs hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-white">{p.donorName}</span>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] tabular-nums">
                      <span>{p.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span className={p.status === 'received' ? 'text-emerald-400' : 'text-amber-400'}>
                        {p.status === 'received' ? 'Delivered' : 'Pledged in Transit'}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-slate-400 text-[11px] pt-1.5 border-t border-slate-850">
                    <span className="font-mono text-emerald-400 tabular-nums">
                      Amount: {p.quantity} {p.unit} ({p.type.replace('_', ' ')})
                    </span>
                    <span>Staged for: {targetHub?.name || 'Regional Depot'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
