import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  Server, 
  Database, 
  Bell, 
  MapPin, 
  DollarSign, 
  Sliders, 
  Users,
  AlertCircle
} from 'lucide-react';

interface AdminSettingsProps {
  onResetSeedData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onResetSeedData }) => {
  const [currency, setCurrency] = useState('USD ($)');
  const [taxRate, setTaxRate] = useState(9.5);
  const [concessionFee, setConcessionFee] = useState(11.0);
  const [serviceInterval, setServiceInterval] = useState(10000);
  const [autoInspection, setAutoInspection] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('ganeshj.bca_iom@bkc.met.edu');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [apiPingStatus, setApiPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestApi = async () => {
    setIsPinging(true);
    setApiPingStatus(null);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setApiPingStatus(`Healthy: Connected to port 3000 (${data.totalCars} records in memory)`);
      } else {
        setApiPingStatus('API responded with error code ' + res.status);
      }
    } catch (e: any) {
      setApiPingStatus('API unreachable: running on client state sync fallback.');
    }
    setIsPinging(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0051d5]" />
            Fleet & System Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system defaults, pricing taxes, maintenance alerts, and administrator security.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Financial & Booking Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-[#0051d5]" />
            Commercial & Pricing Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State & City Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Airport Concession Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={concessionFee}
                onChange={(e) => setConcessionFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fleet Maintenance Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-[#0051d5]" />
            Fleet Telemetry & Maintenance Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Routine Service Mileage Interval (miles)
              </label>
              <input
                type="number"
                value={serviceInterval}
                onChange={(e) => setServiceInterval(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Vehicles exceeding this mileage trigger an automatic maintenance flag in dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Dispatch Alert Email
              </label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Receives new booking confirmations and telemetry threshold alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Role-Based Admin Access */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#0051d5]" />
            Role-Based Admin Access (RBAC)
          </h2>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Ganesh J. (ganeshj.bca_iom@bkc.met.edu)</div>
                <div className="text-[11px] text-slate-500">Super Administrator • Full CRUD + System Config</div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full">
                Active Super Admin
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Sarah M. (fleet.ops@ridemate.io)</div>
                <div className="text-[11px] text-slate-500">Fleet Operations Manager • Add/Edit & Status Dispatch</div>
              </div>
              <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-1 rounded-full">
                Operations Role
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: System Diagnostics & Seed Reset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Server className="w-4 h-4 text-[#0051d5]" />
            System Diagnostics & Database Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* API Health Test */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">API Health Diagnostics</span>
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={isPinging}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {isPinging ? 'Testing...' : 'Ping /api/health'}
                </button>
              </div>
              {apiPingStatus && (
                <div className="text-[11px] font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                  {apiPingStatus}
                </div>
              )}
            </div>

            {/* Reset Seed Data */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Reset Demo Fleet Data</span>
                  <span className="text-[11px] text-slate-500">Restore factory sample cars</span>
                </div>
                <button
                  type="button"
                  onClick={onResetSeedData}
                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0051d5] hover:bg-[#0042b0] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
