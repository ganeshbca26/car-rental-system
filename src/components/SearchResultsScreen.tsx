import React, { useState } from 'react';
import { Vehicle, SearchState, FilterState } from '../types';
import { formatCurrency } from '../utils/currency';
import { 
  MapPin, 
  Calendar, 
  Search, 
  RotateCcw, 
  Users, 
  Briefcase, 
  Cpu, 
  Gauge, 
  CheckCircle2, 
  Zap,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface SearchResultsScreenProps {
  vehicles: Vehicle[];
  searchState: SearchState;
  onUpdateSearchState: (updated: Partial<SearchState>) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  rentalDays: number;
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  vehicles,
  searchState,
  onUpdateSearchState,
  onSelectVehicle,
  rentalDays = 3
}) => {
  const [filters, setFilters] = useState<FilterState>({
    vehicleTypes: ['Sedan', 'SUV', 'Electric', 'Luxury'],
    maxPrice: 200,
    capacities: [4, 5, 7],
    transmissions: ['Automatic']
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle Type filter
  const toggleType = (type: string) => {
    setFilters((prev) => {
      const exists = prev.vehicleTypes.includes(type);
      return {
        ...prev,
        vehicleTypes: exists
          ? prev.vehicleTypes.filter((t) => t !== type)
          : [...prev.vehicleTypes, type]
      };
    });
  };

  // Toggle Capacity filter
  const toggleCapacity = (cap: number) => {
    setFilters((prev) => {
      const exists = prev.capacities.includes(cap);
      return {
        ...prev,
        capacities: exists
          ? prev.capacities.filter((c) => c !== cap)
          : [...prev.capacities, cap]
      };
    });
  };

  // Toggle Transmission filter
  const toggleTransmission = (trans: string) => {
    setFilters((prev) => {
      const exists = prev.transmissions.includes(trans);
      return {
        ...prev,
        transmissions: exists
          ? prev.transmissions.filter((t) => t !== trans)
          : [...prev.transmissions, trans]
      };
    });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      vehicleTypes: ['Sedan', 'SUV', 'Electric', 'Luxury'],
      maxPrice: 200,
      capacities: [2, 4, 5, 7],
      transmissions: ['Automatic', 'Manual']
    });
  };

  // Filtered list
  const filteredVehicles = vehicles.filter((v) => {
    // Type match
    if (filters.vehicleTypes.length > 0 && !filters.vehicleTypes.includes(v.type)) {
      return false;
    }
    // Price match
    if (v.pricePerDay > filters.maxPrice) {
      return false;
    }
    // Capacity match
    if (filters.capacities.length > 0) {
      const matchesSeat = filters.capacities.some((c) => (c === 7 ? v.seats >= 7 : v.seats === c));
      if (!matchesSeat) return false;
    }
    // Transmission match
    if (filters.transmissions.length > 0 && !filters.transmissions.includes(v.transmission)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Top Search Criteria Bar (matching Screen 2) */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Pickup Location */}
          <div className="lg:col-span-4 flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#45464d]">Pick-up Location</label>
            <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2.5 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-1 focus-within:ring-[#0051d5] transition-all">
              <MapPin className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
              <input
                type="text"
                value={searchState.pickupLocation}
                onChange={(e) => onUpdateSearchState({ pickupLocation: e.target.value })}
                placeholder="San Francisco International Airport (SFO)"
                className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-[#0b1c30] placeholder-[#76777d]"
              />
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#45464d]">Pick-up Date & Time</label>
            <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2.5 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-1 focus-within:ring-[#0051d5] transition-all">
              <Calendar className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
              <input
                type="date"
                value={searchState.pickupDate}
                onChange={(e) => onUpdateSearchState({ pickupDate: e.target.value })}
                className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-xs text-[#0b1c30]"
              />
              <span className="text-xs text-[#45464d] ml-1 font-medium">10:00 AM</span>
            </div>
          </div>

          {/* Dropoff Date & Time */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#45464d]">Drop-off Date & Time</label>
            <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2.5 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-1 focus-within:ring-[#0051d5] transition-all">
              <Calendar className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
              <input
                type="date"
                value={searchState.returnDate}
                onChange={(e) => onUpdateSearchState({ returnDate: e.target.value })}
                className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-xs text-[#0b1c30]"
              />
              <span className="text-xs text-[#45464d] ml-1 font-medium">10:00 AM</span>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
            <button
              onClick={() => {}}
              className="w-full bg-[#0051d5] hover:bg-[#003ea8] text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filter Sidebar + Vehicle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden col-span-1 flex justify-between items-center bg-white p-3.5 rounded-xl border border-[#c6c6cd]/50">
          <span className="text-sm font-semibold text-[#0b1c30] flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#0051d5]" />
            Filters & Criteria
          </span>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="text-xs font-semibold text-[#0051d5] px-3 py-1.5 bg-[#eff4ff] rounded-lg"
          >
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Left Sidebar Filter Panel */}
        <aside
          className={`lg:col-span-3 bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex justify-between items-center border-b border-[#eff4ff] pb-3">
            <h3 className="font-bold text-base text-[#0b1c30]">Filters</h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#0051d5] hover:text-[#003ea8] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Vehicle Type Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
              Vehicle Type
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Sedan', value: 'Sedan' },
                { label: 'SUV', value: 'SUV' },
                { label: 'Luxury', value: 'Luxury' },
                { label: 'Electric', value: 'Electric' },
              ].map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-3 text-sm text-[#0b1c30] cursor-pointer hover:text-[#0051d5] select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.vehicleTypes.includes(item.value)}
                    onChange={() => toggleType(item.value)}
                    className="w-4 h-4 rounded border-[#c6c6cd] text-[#0051d5] focus:ring-[#0051d5] cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range / Day */}
          <div className="space-y-3 border-t border-[#eff4ff] pt-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
                Price Range / Day
              </h4>
              <span className="text-xs font-bold text-[#0051d5]">{formatCurrency(filters.maxPrice)}/day</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[#0051d5] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#76777d]">
              <span>{formatCurrency(30)}</span>
              <span>{formatCurrency(150)}</span>
              <span>{formatCurrency(200)}</span>
            </div>
          </div>

          {/* Capacity Filter */}
          <div className="space-y-3 border-t border-[#eff4ff] pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
              Capacity
            </h4>
            <div className="space-y-2.5">
              {[
                { label: '2 Seats', value: 2 },
                { label: '4 Seats', value: 4 },
                { label: '5 Seats', value: 5 },
                { label: '7+ Seats', value: 7 },
              ].map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-3 text-sm text-[#0b1c30] cursor-pointer hover:text-[#0051d5] select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.capacities.includes(item.value)}
                    onChange={() => toggleCapacity(item.value)}
                    className="w-4 h-4 rounded border-[#c6c6cd] text-[#0051d5] focus:ring-[#0051d5] cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="space-y-3 border-t border-[#eff4ff] pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
              Transmission
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Automatic', value: 'Automatic' },
                { label: 'Manual', value: 'Manual' },
              ].map((item) => (
                <label
                  key={item.value}
                  className="flex items-center gap-3 text-sm text-[#0b1c30] cursor-pointer hover:text-[#0051d5] select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters.transmissions.includes(item.value)}
                    onChange={() => toggleTransmission(item.value)}
                    className="w-4 h-4 rounded border-[#c6c6cd] text-[#0051d5] focus:ring-[#0051d5] cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Content: Available Vehicles List */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1c30] tracking-tight">
              Available Vehicles
            </h2>
            <span className="text-sm font-semibold text-[#76777d]">
              {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Result' : 'Results'}
            </span>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#c6c6cd]/50 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#0051d5] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30]">No vehicles match your filters</h3>
              <p className="text-sm text-[#45464d]">
                Try adjusting the price range, car type, or seating capacity to see more available options.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0051d5] text-white rounded-xl text-xs font-semibold hover:bg-[#003ea8] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredVehicles.map((vehicle) => {
                const totalEstimated = vehicle.pricePerDay * rentalDays;

                return (
                  <div
                    key={vehicle.id}
                    className="bg-white rounded-2xl border border-[#c6c6cd]/50 overflow-hidden hover:shadow-[0px_8px_24px_rgba(15,23,42,0.08)] transition-all flex flex-col md:flex-row group"
                  >
                    {/* Vehicle Photo Container */}
                    <div className="md:w-[42%] lg:w-[40%] h-64 md:h-auto relative bg-[#e5eeff] shrink-0 overflow-hidden">
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#0c9488] border border-[#0c9488]/30 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Available</span>
                      </div>
                      {vehicle.fuelType === 'Electric' && (
                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0051d5] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm border border-[#0051d5]/20">
                          <Zap className="w-3.5 h-3.5" />
                          <span>EV</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content & Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Title & Rate */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-xl md:text-2xl font-bold text-[#0b1c30] tracking-tight">
                            {vehicle.name}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="text-2xl font-bold text-[#0b1c30]">
                              {formatCurrency(vehicle.pricePerDay)}
                            </span>
                            <span className="text-xs text-[#76777d] font-normal">/day</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#45464d] mb-4 leading-relaxed line-clamp-2">
                          {vehicle.description}
                        </p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 border-t border-[#eff4ff] pt-3.5 mb-5 text-xs text-[#45464d]">
                          <div className="flex items-center gap-2 font-medium">
                            <Users className="w-4 h-4 text-[#76777d]" />
                            <span>{vehicle.seats} Seats</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium">
                            <Briefcase className="w-4 h-4 text-[#76777d]" />
                            <span>{vehicle.luggageBags} Large Bags</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium">
                            <Cpu className="w-4 h-4 text-[#76777d]" />
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center gap-2 font-medium">
                            <Gauge className="w-4 h-4 text-[#76777d]" />
                            <span>{vehicle.mpgOrRange}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total for Duration & View Details CTA */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-[#eff4ff]">
                        <div className="text-xs font-semibold text-[#45464d]">
                          Total for {rentalDays} days:{' '}
                          <span className="text-sm font-bold text-[#0b1c30]">
                            {formatCurrency(totalEstimated)}
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectVehicle(vehicle)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
