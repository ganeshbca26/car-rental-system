import React from 'react';
import { Vehicle, SearchState } from '../types';
import { HOTLINK_IMAGES } from '../data/mockData';
import { formatCurrency } from '../utils/currency';
import { 
  MapPin, 
  Calendar, 
  Search, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Users, 
  Briefcase, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Gauge,
  User,
  KeyRound,
  Lock,
  UserPlus,
  LogIn
} from 'lucide-react';

interface HomeScreenProps {
  vehicles: Vehicle[];
  searchState: SearchState;
  onUpdateSearchState: (updated: Partial<SearchState>) => void;
  onSearch: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onViewAllFleet: () => void;
  onOpenAuth: (mode: 'login' | 'signup' | 'forgot-password') => void;
  isLoggedIn: boolean;
  userName?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  vehicles,
  searchState,
  onUpdateSearchState,
  onSearch,
  onSelectVehicle,
  onViewAllFleet,
  onOpenAuth,
  isLoggedIn,
  userName = 'Member'
}) => {
  const featuredVehicles = vehicles.filter((v) => v.featured).slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative w-full min-h-[660px] flex items-center bg-[#d3e4fe] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('${HOTLINK_IMAGES.hero}')`,
          }}
          role="img"
          aria-label="A sleek, modern luxury SUV driving on a pristine coastal highway at sunrise"
        />

        {/* Gradient Overlay for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9ff]/98 via-[#f8f9ff]/85 to-transparent z-10" />

        {/* Hero Content Container */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Search Widget */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#eff4ff] border border-[#0051d5]/30 rounded-full text-xs font-bold text-[#0051d5] mb-4 w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Fleet • Instant Digital Check-In</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[46px] font-bold text-[#0b1c30] tracking-tight leading-[1.15] mb-3">
              Drive Your Ambition
            </h1>
            <p className="text-base md:text-lg text-[#45464d] mb-6 max-w-lg font-normal">
              Professional car rentals for business, family, and luxury travel.
            </p>

            {/* Search Widget */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 md:p-6 rounded-2xl shadow-[0px_12px_32px_rgba(15,23,42,0.12)] border border-[#c6c6cd]/40 flex flex-col gap-3.5 w-full max-w-xl"
            >
              {/* Pickup & Return Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
                    Pickup Location
                  </label>
                  <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-2 focus-within:ring-[#0051d5]/20 transition-all">
                    <MapPin className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchState.pickupLocation}
                      onChange={(e) => onUpdateSearchState({ pickupLocation: e.target.value })}
                      placeholder="City, Airport, or Address"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-[#0b1c30] placeholder-[#76777d]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
                    Return Location
                  </label>
                  <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-2 focus-within:ring-[#0051d5]/20 transition-all">
                    <MapPin className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchState.returnLocation}
                      onChange={(e) => onUpdateSearchState({ returnLocation: e.target.value })}
                      placeholder="Same as pickup"
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-[#0b1c30] placeholder-[#76777d]"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup & Return Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
                    Pickup Date
                  </label>
                  <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-2 focus-within:ring-[#0051d5]/20 transition-all">
                    <Calendar className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
                    <input
                      type="date"
                      value={searchState.pickupDate}
                      onChange={(e) => onUpdateSearchState({ pickupDate: e.target.value })}
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-[#0b1c30]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider">
                    Return Date
                  </label>
                  <div className="flex items-center border border-[#c6c6cd]/80 rounded-xl px-3 py-2 bg-[#f8f9ff] focus-within:border-[#0051d5] focus-within:ring-2 focus-within:ring-[#0051d5]/20 transition-all">
                    <Calendar className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
                    <input
                      type="date"
                      value={searchState.returnDate}
                      onChange={(e) => onUpdateSearchState({ returnDate: e.target.value })}
                      className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-[#0b1c30]"
                    />
                  </div>
                </div>
              </div>

              {/* Find Vehicles Button */}
              <button
                type="submit"
                className="mt-1 w-full bg-[#0051d5] hover:bg-[#003ea8] text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Available Vehicles</span>
              </button>
            </form>
          </div>

          {/* Right Column: Home Page Login / Signup / Member Access Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-[0_16px_40px_rgba(15,23,42,0.12)] relative overflow-hidden">
              {/* Card Header Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0051d5] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {isLoggedIn ? 'Account Overview' : 'Member Privileges'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isLoggedIn ? 'Verified Driver Profile' : 'Exclusive Rates & Digital Key'}
                    </p>
                  </div>
                </div>

                {!isLoggedIn ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                    15% Off 1st Trip
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Active
                  </span>
                )}
              </div>

              {!isLoggedIn ? (
                /* Logged Out View: Login, Signup, Forgot Password CTA */
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Join over 40,000+ verified drivers. Unlock contactless car pickup, express return, and special member-only seasonal discounts.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    {/* Sign In Button */}
                    <button
                      id="home-hero-login-btn"
                      type="button"
                      onClick={() => onOpenAuth('login')}
                      className="w-full py-2.5 px-4 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Your Account</span>
                    </button>

                    {/* Sign Up Button */}
                    <button
                      id="home-hero-signup-btn"
                      type="button"
                      onClick={() => onOpenAuth('signup')}
                      className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-[#0051d5]" />
                      <span>Create New Account (Free)</span>
                    </button>
                  </div>

                  {/* Forgot Password Helper Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Trouble accessing your account?</span>
                    <button
                      id="home-hero-forgot-password-btn"
                      type="button"
                      onClick={() => onOpenAuth('forgot-password')}
                      className="font-bold text-[#0051d5] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Forgot Password?</span>
                    </button>
                  </div>

                  {/* Trust Micro-Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant KYC Check</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Mobile Key Unlock</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Logged In View */
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{userName}</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Driver's License Verified
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onViewAllFleet}
                      className="p-2.5 bg-[#eff4ff] hover:bg-[#e0ecff] text-[#0051d5] border border-blue-200 rounded-xl text-xs font-bold text-center transition-colors cursor-pointer"
                    >
                      Explore Fleet
                    </button>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold text-center transition-colors cursor-pointer"
                    >
                      Switch User / Login
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Need to update password?</span>
                    <button
                      onClick={() => onOpenAuth('forgot-password')}
                      className="font-bold text-[#0051d5] hover:underline cursor-pointer"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why RIDEMATE Section */}
      <section className="py-20 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0b1c30] mb-3 tracking-tight">
            Why RIDEMATE
          </h2>
          <p className="text-base text-[#45464d] max-w-2xl mx-auto leading-relaxed">
            Experience a new standard in car rental with our commitment to quality, transparency, and seamless service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Transparent Pricing */}
          <div className="bg-white p-8 rounded-2xl border border-[#c6c6cd]/40 hover:border-[#0051d5]/40 hover:shadow-[0px_8px_24px_rgba(15,23,42,0.08)] transition-all flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-5 text-[#0051d5] group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2.5">Transparent Pricing</h3>
            <p className="text-sm text-[#45464d] leading-relaxed">
              No hidden fees or unexpected charges. What you see is exactly what you pay, ensuring peace of mind for every journey.
            </p>
          </div>

          {/* Feature 2: Trusted Inventory */}
          <div className="bg-white p-8 rounded-2xl border border-[#c6c6cd]/40 hover:border-[#0051d5]/40 hover:shadow-[0px_8px_24px_rgba(15,23,42,0.08)] transition-all flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-5 text-[#0051d5] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2.5">Trusted Inventory</h3>
            <p className="text-sm text-[#45464d] leading-relaxed">
              Our fleet is rigorously maintained and inspected. Choose from a curated selection of reliable, top-tier vehicles for any occasion.
            </p>
          </div>

          {/* Feature 3: Effortless Self-Service */}
          <div className="bg-white p-8 rounded-2xl border border-[#c6c6cd]/40 hover:border-[#0051d5]/40 hover:shadow-[0px_8px_24px_rgba(15,23,42,0.08)] transition-all flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-5 text-[#0051d5] group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2.5">Effortless Self-Service</h3>
            <p className="text-sm text-[#45464d] leading-relaxed">
              Skip the counter. Unlock your vehicle directly from our app and get on the road faster with our streamlined digital process.
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated Home Page Login / Signup & Member Onboarding Banner */}
      <section className="py-12 px-4 md:px-8 max-w-[1280px] mx-auto w-full">
        <div className="bg-gradient-to-br from-[#0b1c30] via-[#132742] to-[#0051d5] rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Join the RIDEMATE Club
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Unlock Exclusive Rates & Priority Bookings
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                Create your verified driver profile in under 60 seconds to access luxury fleet discounts, complimentary extra drivers, and 24/7 VIP roadside assistance.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                id="home-banner-signup-btn"
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="w-full py-3.5 px-6 bg-white hover:bg-slate-100 text-[#0b1c30] font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#0051d5]" />
                <span>Create Free Account</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  id="home-banner-login-btn"
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  id="home-banner-forgot-btn"
                  type="button"
                  onClick={() => onOpenAuth('forgot-password')}
                  className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Forgot Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-20 bg-[#eff4ff] px-4 md:px-8 w-full border-t border-[#c6c6cd]/30">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#0b1c30] mb-2 tracking-tight">Featured Vehicles</h2>
              <p className="text-sm md:text-base text-[#45464d]">Premium options for your next destination.</p>
            </div>
            <button
              onClick={onViewAllFleet}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#0051d5] hover:text-[#003ea8] transition-colors"
            >
              <span>View All Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-[#c6c6cd]/40 overflow-hidden hover:shadow-[0px_8px_24px_rgba(15,23,42,0.09)] transition-all flex flex-col group"
              >
                {/* Vehicle Image Header */}
                <div className="h-52 relative bg-[#e5eeff] overflow-hidden">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {vehicle.tag && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#0c9488] border border-[#0c9488]/30 flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{vehicle.tag}</span>
                    </div>
                  )}
                  {vehicle.fuelType === 'Electric' && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0051d5] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm border border-[#0051d5]/20">
                      <Zap className="w-3.5 h-3.5" />
                      <span>EV</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-xl font-bold text-[#0b1c30] tracking-tight">{vehicle.name}</h3>
                      <div className="text-right">
                        <span className="text-xs text-[#76777d] block font-medium">From</span>
                        <div className="text-xl font-bold text-[#0b1c30]">
                          {formatCurrency(vehicle.pricePerDay)}
                          <span className="text-xs font-normal text-[#76777d]">/day</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-[#45464d] mb-5 line-clamp-2">
                      {vehicle.description}
                    </p>

                    {/* Vehicle Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-2.5 border-t border-[#eff4ff] pt-4 mb-6">
                      <div className="flex items-center gap-2 text-[#45464d] text-xs font-medium">
                        <Cpu className="w-4 h-4 text-[#76777d]" />
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#45464d] text-xs font-medium">
                        <Users className="w-4 h-4 text-[#76777d]" />
                        <span>{vehicle.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#45464d] text-xs font-medium">
                        <Briefcase className="w-4 h-4 text-[#76777d]" />
                        <span>{vehicle.luggageBags} Bags</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#45464d] text-xs font-medium">
                        <Gauge className="w-4 h-4 text-[#76777d]" />
                        <span>{vehicle.mpgOrRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="w-full py-2.5 border border-[#c6c6cd] hover:border-[#0051d5] hover:bg-[#0051d5] hover:text-white rounded-xl text-sm font-semibold text-[#0b1c30] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Select Vehicle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
