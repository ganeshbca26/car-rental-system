import React from 'react';
import { 
  Car, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight, 
  Layers, 
  ChevronRight,
  Eye,
  Edit3,
  Trash2,
  Download,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CarRecord, AdminStats, AdminActivityLog, AdminTab } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface AdminDashboardProps {
  stats: AdminStats;
  cars: CarRecord[];
  recentActivity: AdminActivityLog[];
  categoryBreakdown: Record<string, number>;
  onSelectTab: (tab: AdminTab) => void;
  onViewCar: (car: CarRecord) => void;
  onEditCar: (car: CarRecord) => void;
  onDeleteCar: (car: CarRecord) => void;
  onResetSeedData: () => void;
  onExportRecords: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  cars,
  recentActivity,
  categoryBreakdown,
  onSelectTab,
  onViewCar,
  onEditCar,
  onDeleteCar,
  onResetSeedData,
  onExportRecords,
}) => {
  const recentlyAdded = [...cars]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const getStatusBadge = (status: CarRecord['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
          </span>
        );
      case 'Rented':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Rented
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Maintenance
          </span>
        );
      case 'Unavailable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Unavailable
          </span>
        );
      default:
        return null;
    }
  };

  const categories = categoryBreakdown ? Object.keys(categoryBreakdown) : ['Luxury', 'SUV', 'Sedan', 'Electric', 'Sports'];
  const totalFleetCount = stats?.totalCars || Math.max(cars.length, 1);
  const totalFleetVal = stats?.totalFleetValuation ?? cars.reduce((sum, c) => sum + (c.price || 0), 0);
  const avgRate = stats?.averageRentalRate ?? (cars.length > 0 ? Math.round(cars.reduce((sum, c) => sum + (c.rentalPricePerDay || 0), 0) / cars.length) : 0);
  const availCount = stats?.availableCars ?? cars.filter((c) => c.status === 'Available').length;
  const rentCount = stats?.rentedCars ?? cars.filter((c) => c.status === 'Rented').length;
  const maintCount = stats?.maintenanceCars ?? cars.filter((c) => c.status === 'Maintenance').length;
  const unavailCount = stats?.unavailableCars ?? cars.filter((c) => c.status === 'Unavailable').length;
  const utilRate = stats?.utilizationRate ?? (cars.length > 0 ? Math.round((rentCount / cars.length) * 100) : 0);
  const totalCount = stats?.totalCars ?? cars.length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#111f43] to-[#1e3a8a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Car className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Automotive Fleet Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
            Car Management & Fleet Control
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Manage your entire fleet registry, track live vehicle availability, adjust pricing parameters, and review system audit records in real time.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onSelectTab('add-car')}
              className="inline-flex items-center gap-2 bg-[#0051d5] hover:bg-[#0042b0] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Car</span>
            </button>
            <button
              onClick={() => onSelectTab('records')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View All Records ({stats.totalCars})</span>
            </button>
            <button
              onClick={onExportRecords}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="Export Fleet CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Cars */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Cars</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalCount}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Active Fleet
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Valuation:</span>
            <span className="font-bold text-slate-800">
              {formatCurrency(totalFleetVal)}
            </span>
          </div>
        </div>

        {/* Card 2: Available Cars */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Cars</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{availCount}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {Math.round((availCount / totalFleetCount) * 100)}% Ready
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average Rental Rate:</span>
            <span className="font-bold text-slate-800">{formatCurrency(avgRate)}/day</span>
          </div>
        </div>

        {/* Card 3: Rented / Booked Cars */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rented / Booked</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{rentCount}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {utilRate}% Utilized
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>On Active Dispatch:</span>
            <span className="font-bold text-indigo-600">{rentCount} on trip</span>
          </div>
        </div>

        {/* Card 4: Unavailable / Maintenance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unavailable / Service</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {unavailCount + maintCount}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {maintCount} In Service
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Offline / Reserved:</span>
            <span className="font-bold text-slate-800">{unavailCount} cars</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Category Inventory & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fleet Category Distribution</h2>
              <p className="text-xs text-slate-500 mt-0.5">Vehicle volume grouped by automotive class</p>
            </div>
            <button
              onClick={() => onSelectTab('cars')}
              className="text-xs font-bold text-[#0051d5] hover:underline flex items-center gap-1"
            >
              Browse Fleet <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => {
              const count = categoryBreakdown[cat] || 0;
              const pct = Math.round((count / totalFleetCount) * 100);
              const colorClass =
                cat === 'Luxury'
                  ? 'bg-purple-600'
                  : cat === 'Electric'
                  ? 'bg-emerald-500'
                  : cat === 'SUV'
                  ? 'bg-blue-600'
                  : cat === 'Sports'
                  ? 'bg-rose-500'
                  : cat === 'Sedan'
                  ? 'bg-cyan-600'
                  : 'bg-indigo-600';

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-sm ${colorClass}`} />
                      {cat}
                    </span>
                    <span className="text-slate-500 font-medium">
                      <strong className="text-slate-900">{count}</strong> vehicles ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Status Summary (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Fleet Availability Ratio</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status breakdown</p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-emerald-950">Available for Booking</div>
                    <div className="text-[10px] text-emerald-700">Ready at depot</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-emerald-800">{availCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div>
                    <div className="text-xs font-bold text-blue-950">Active on Road</div>
                    <div className="text-[10px] text-blue-700">Rented by customers</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-blue-800">{rentCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div>
                    <div className="text-xs font-bold text-amber-950">Maintenance / Inspection</div>
                    <div className="text-[10px] text-amber-700">Service required</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-800">{maintCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Offline / Reserved</div>
                    <div className="text-[10px] text-slate-500">Decommissioned</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-slate-700">{unavailCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onResetSeedData}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
              title="Reset records to default demo state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Seed</span>
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className="text-xs font-bold text-[#0051d5] hover:underline"
            >
              Configure Limits
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Recently Added Cars & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Cars (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recently Registered Vehicles</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest additions to the car inventory</p>
            </div>
            <button
              onClick={() => onSelectTab('records')}
              className="text-xs font-bold text-[#0051d5] hover:underline flex items-center gap-1"
            >
              View Full Table ({cars.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentlyAdded.map((car) => (
              <div
                key={car.id}
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between bg-white"
              >
                <div>
                  {/* Image & Status Badge */}
                  <div className="relative h-32 rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">{getStatusBadge(car.status)}</div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {car.category}
                    </div>
                  </div>

                  {/* Car info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">{car.name}</h3>
                      <p className="text-[11px] text-slate-500">{car.brand} • {car.year}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-[#0051d5]">
                        {formatCurrency(car.rentalPricePerDay)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/day</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center justify-between">
                    <span>Plate: {car.registrationNumber}</span>
                    <span>VIN: {car.vin.substring(0, 8)}...</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    {car.seatingCapacity} seats • {car.transmission}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewCar(car)}
                      title="View Details"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#0051d5] hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onEditCar(car)}
                      title="Edit Car"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCar(car)}
                      title="Delete Car"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Audit Stream (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Audit Stream</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live fleet management actions</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Live Feed
            </span>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="mt-1">
                  {log.action === 'create' && <span className="w-2 h-2 rounded-full bg-emerald-500 block ring-4 ring-emerald-100" />}
                  {log.action === 'update' && <span className="w-2 h-2 rounded-full bg-blue-500 block ring-4 ring-blue-100" />}
                  {log.action === 'delete' && <span className="w-2 h-2 rounded-full bg-rose-500 block ring-4 ring-rose-100" />}
                  {log.action === 'status_change' && <span className="w-2 h-2 rounded-full bg-amber-500 block ring-4 ring-amber-100" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900 truncate">{log.title}</p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">{log.details}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{log.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
