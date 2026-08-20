import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Car, 
  MapPin, 
  Users, 
  Fuel, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCcw,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { CarRecord, AdminTab } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface AdminCarGridProps {
  cars: CarRecord[];
  onSelectTab: (tab: AdminTab) => void;
  onViewCar: (car: CarRecord) => void;
  onEditCar: (car: CarRecord) => void;
  onDeleteCar: (car: CarRecord) => void;
  onQuickStatusToggle: (car: CarRecord, newStatus: CarRecord['status']) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminCarGrid: React.FC<AdminCarGridProps> = ({
  cars,
  onSelectTab,
  onViewCar,
  onEditCar,
  onDeleteCar,
  onQuickStatusToggle,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredCars = useMemo(() => {
    let list = [...cars];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.registrationNumber.toLowerCase().includes(q) ||
          c.vin.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedStatus !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    return list;
  }, [cars, searchQuery, selectedCategory, selectedStatus]);

  const categories = ['All', 'Sedan', 'SUV', 'Luxury', 'Electric', 'Sports', 'Truck'];

  return (
    <div className="space-y-5">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-5 h-5 text-[#0051d5]" />
            Fleet Visual Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <strong className="text-slate-800">{filteredCars.length}</strong> of {cars.length} total vehicles
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab('records')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            Switch to Table View
          </button>
          <button
            onClick={() => onSelectTab('add-car')}
            className="flex items-center gap-1.5 bg-[#0051d5] hover:bg-[#0042b0] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Car</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0051d5] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fleet..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#0051d5] focus:outline-hidden"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Grid of Car Cards */}
      {filteredCars.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <Car className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-bold text-slate-700">No vehicles match the selected filter</p>
          <button
            onClick={() => {
              onSearchChange('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="mt-3 px-4 py-2 bg-[#0051d5] text-white rounded-xl text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Category badge */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={car.imageUrl}
                    alt={car.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Tag */}
                  <div className="absolute top-3 left-3">
                    <select
                      value={car.status}
                      onChange={(e) => onQuickStatusToggle(car, e.target.value as CarRecord['status'])}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm cursor-pointer focus:outline-hidden ${
                        car.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : car.status === 'Rented'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : car.status === 'Maintenance'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <option value="Available">● Available</option>
                      <option value="Rented">● Rented</option>
                      <option value="Maintenance">● Maintenance</option>
                      <option value="Unavailable">● Unavailable</option>
                    </select>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                    {car.category}
                  </div>

                  {/* Daily Rate floating tag */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md border border-slate-200/80">
                    <span className="text-sm font-extrabold text-[#0051d5]">{formatCurrency(car.rentalPricePerDay)}</span>
                    <span className="text-[10px] text-slate-500 font-medium"> /day</span>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                        {car.brand} • {car.year}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{car.name}</h3>
                    </div>
                  </div>

                  {/* Plate and VIN */}
                  <div className="flex items-center justify-between text-[11px] font-mono bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-900">{car.registrationNumber}</span>
                    <span className="text-slate-400">VIN: {car.vin.substring(0, 10)}...</span>
                  </div>

                  {/* Specs Pill List */}
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] text-slate-600 text-center">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      {car.transmission}
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      {car.fuelType}
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      {car.seatingCapacity} Seats
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewCar(car)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => onEditCar(car)}
                    className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                    title="Edit Record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCar(car)}
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
