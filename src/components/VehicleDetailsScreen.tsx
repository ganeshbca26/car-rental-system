import React, { useState } from 'react';
import { Vehicle, SearchState } from '../types';
import { formatCurrency } from '../utils/currency';
import { 
  ChevronRight, 
  Heart, 
  Settings, 
  Fuel, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowRight,
  MapPin,
  Calendar,
  Zap,
  Info
} from 'lucide-react';

interface VehicleDetailsScreenProps {
  vehicle: Vehicle;
  searchState: SearchState;
  onBackToSearch: () => void;
  onProceedToCheckout: (vehicle: Vehicle, days: number, plan: 'basic' | 'standard' | 'premium') => void;
}

export const VehicleDetailsScreen: React.FC<VehicleDetailsScreenProps> = ({
  vehicle,
  searchState,
  onBackToSearch,
  onProceedToCheckout
}) => {
  const [selectedImageKey, setSelectedImageKey] = useState<'hero' | 'interior' | 'wheel' | 'trunk'>('hero');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [rentalDays, setRentalDays] = useState(3);

  // Price calculations
  const rentalRateSubtotal = vehicle.pricePerDay * rentalDays;
  const taxesAndFees = Math.round(rentalRateSubtotal * 0.1125 * 100) / 100; // ~11.25%
  
  const protectionCostPerDay = selectedPlan === 'basic' ? 0 : selectedPlan === 'standard' ? 15 : 28;
  const protectionTotal = protectionCostPerDay * rentalDays;
  const totalDue = rentalRateSubtotal + taxesAndFees + protectionTotal;

  // Active gallery image
  const activeImage = vehicle.galleryImages[selectedImageKey] || vehicle.imageUrl;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb matching Screen 3 */}
      <nav className="flex items-center gap-2 text-sm text-[#45464d]">
        <button
          onClick={onBackToSearch}
          className="hover:text-[#0051d5] transition-colors font-medium"
        >
          Search
        </button>
        <ChevronRight className="w-4 h-4 text-[#76777d]" />
        <span className="text-[#0b1c30] font-semibold">{vehicle.category}</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Visual Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Photo Card */}
          <div className="bg-white rounded-2xl border border-[#c6c6cd]/50 overflow-hidden relative shadow-sm h-[360px] md:h-[480px] bg-[#f8f9ff] flex items-center justify-center group">
            <img
              src={activeImage}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            {vehicle.tag && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#0b1c30] border border-[#c6c6cd]/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#0051d5]" />
                <span>{vehicle.tag}</span>
              </div>
            )}
          </div>

          {/* Thumbnail Selector Strip (matching Screen 3: Interior, Wheel, Trunk) */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedImageKey('interior')}
              className={`h-24 md:h-28 rounded-xl overflow-hidden border-2 transition-all relative ${
                selectedImageKey === 'interior'
                  ? 'border-[#0051d5] shadow-md ring-2 ring-[#0051d5]/20'
                  : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={vehicle.galleryImages.interior}
                alt="Interior Cockpit"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-2 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                Interior
              </span>
            </button>

            <button
              onClick={() => setSelectedImageKey('wheel')}
              className={`h-24 md:h-28 rounded-xl overflow-hidden border-2 transition-all relative ${
                selectedImageKey === 'wheel'
                  ? 'border-[#0051d5] shadow-md ring-2 ring-[#0051d5]/20'
                  : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={vehicle.galleryImages.wheel}
                alt="Alloy Wheel"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-2 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                Wheels
              </span>
            </button>

            <button
              onClick={() => setSelectedImageKey('trunk')}
              className={`h-24 md:h-28 rounded-xl overflow-hidden border-2 transition-all relative ${
                selectedImageKey === 'trunk'
                  ? 'border-[#0051d5] shadow-md ring-2 ring-[#0051d5]/20'
                  : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={vehicle.galleryImages.trunk}
                alt="Cargo Trunk"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-2 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">
                Cargo
              </span>
            </button>
          </div>

          {/* Vehicle Highlights & Policies */}
          <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-[#0b1c30]">Vehicle Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#45464d]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0c9488]" />
                <span>Instant Digital Key Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0c9488]" />
                <span>Sanitized & Clean Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0c9488]" />
                <span>Unlimited Mileage Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#0c9488]" />
                <span>24/7 Roadside Assistance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Specs & Booking Summary (matching Screen 3) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Card: Title, Category & Daily Price */}
          <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#0b1c30] tracking-tight">
                  {vehicle.name}
                </h1>
                <p className="text-sm text-[#45464d] mt-1">
                  Or similar {vehicle.category}
                </p>
              </div>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isFavorite
                    ? 'border-[#ffdad6] bg-[#ffdad6]/40 text-[#ba1a1a]'
                    : 'border-[#c6c6cd]/60 text-[#76777d] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/20'
                }`}
                aria-label="Save to favorites"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#ba1a1a]' : ''}`} />
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-[#0b1c30]">
                {formatCurrency(vehicle.pricePerDay)}
              </span>
              <span className="text-sm font-medium text-[#76777d]">/ day</span>
            </div>
          </div>

          {/* VEHICLE SPECIFICATIONS Card (matching Screen 3) */}
          <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#45464d]">
              VEHICLE SPECIFICATIONS
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Transmission */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0051d5] shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#76777d] block font-medium">Transmission</span>
                  <span className="text-sm font-semibold text-[#0b1c30]">
                    {vehicle.transmission}
                  </span>
                </div>
              </div>

              {/* Fuel Efficiency */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0051d5] shrink-0">
                  <Fuel className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#76777d] block font-medium">Fuel Efficiency</span>
                  <span className="text-sm font-semibold text-[#0b1c30]">
                    {vehicle.mpgOrRange}
                  </span>
                </div>
              </div>

              {/* Seats */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0051d5] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#76777d] block font-medium">Seats</span>
                  <span className="text-sm font-semibold text-[#0b1c30]">
                    {vehicle.seats} Passengers
                  </span>
                </div>
              </div>

              {/* Luggage */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0051d5] shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#76777d] block font-medium">Luggage</span>
                  <span className="text-sm font-semibold text-[#0b1c30]">
                    {vehicle.luggageBags} Bags
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Card (matching Screen 3) */}
          <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm relative overflow-hidden space-y-5">
            {/* Subtle blue accent corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#dbe1ff]/60 to-transparent pointer-events-none rounded-bl-full" />

            <h3 className="text-xl font-bold text-[#0b1c30] tracking-tight">
              Booking Summary
            </h3>

            {/* Duration Selector */}
            <div className="flex items-center justify-between bg-[#f8f9ff] p-3 rounded-xl border border-[#eff4ff]">
              <span className="text-xs font-medium text-[#45464d]">Rental Duration:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 7].map((days) => (
                  <button
                    key={days}
                    onClick={() => setRentalDays(days)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      rentalDays === days
                        ? 'bg-[#0051d5] text-white shadow-xs'
                        : 'bg-white text-[#45464d] border border-[#c6c6cd]/40 hover:bg-[#eff4ff]'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            {/* Price Line Items */}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-[#45464d]">
                <span>Rental Rate ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})</span>
                <span className="font-semibold text-[#0b1c30]">{formatCurrency(rentalRateSubtotal, { decimals: 2 })}</span>
              </div>

              <div className="flex justify-between items-center text-[#45464d]">
                <span className="flex items-center gap-1">
                  Taxes & Fees
                  <Info className="w-3.5 h-3.5 text-[#76777d]" />
                </span>
                <span className="font-semibold text-[#0b1c30]">{formatCurrency(taxesAndFees, { decimals: 2 })}</span>
              </div>

              {selectedPlan !== 'basic' && (
                <div className="flex justify-between items-center text-[#45464d]">
                  <span>Protection ({selectedPlan})</span>
                  <span className="font-semibold text-[#0b1c30]">{formatCurrency(protectionTotal, { decimals: 2 })}</span>
                </div>
              )}
            </div>

            {/* Total Due Row (exact styling from Screen 3) */}
            <div className="border-t border-[#c6c6cd]/40 pt-4 flex justify-between items-baseline">
              <span className="text-lg font-bold text-[#0b1c30]">Total Due</span>
              <span className="text-3xl font-bold text-[#0b1c30]">
                {formatCurrency(totalDue, { decimals: 2 })}
              </span>
            </div>

            {/* Proceed to Checkout CTA (matching Screen 3) */}
            <button
              onClick={() => onProceedToCheckout(vehicle, rentalDays, selectedPlan)}
              className="w-full py-3.5 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
