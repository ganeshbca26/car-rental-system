import React, { useState } from 'react';
import { ScreenType } from '../types';
import { Search, User, ShieldCheck, Car, Calendar, SlidersHorizontal, CheckCircle2, KeyRound, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onSearchQuery?: (query: string) => void;
  bookingCount: number;
  userName?: string;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup' | 'forgot-password') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onSearchQuery,
  bookingCount,
  userName = 'Ganesh J.',
  isLoggedIn = true,
  onOpenAuth,
  onLogout
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery && searchValue.trim()) {
      onSearchQuery(searchValue);
      onNavigate('search');
    } else {
      onNavigate('search');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f8f9ff]/95 backdrop-blur-md border-b border-[#c6c6cd]/40 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand and Search */}
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 font-bold text-2xl tracking-tight text-[#0b1c30] hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center text-white shadow-xs">
              <Car className="w-5 h-5" />
            </div>
            <span>RIDEMATE</span>
          </button>

          {/* Quick Search in Header (visible on md+) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-[#eff4ff] hover:bg-[#e5eeff] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0051d5] rounded-full px-3.5 py-1.5 border border-[#c6c6cd]/50 transition-all">
            <Search className="w-4 h-4 text-[#45464d] mr-2 shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search destinations, models..."
              className="bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-sm text-[#0b1c30] placeholder-[#45464d] w-48 md:w-56 font-normal"
            />
          </form>
        </div>

        {/* Navigation Links and Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-1 sm:gap-4">
            <button
              onClick={() => onNavigate('search')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentScreen === 'search'
                  ? 'text-[#0051d5] bg-[#eff4ff]'
                  : 'text-[#45464d] hover:text-[#0051d5]'
              }`}
            >
              Browse Fleet
            </button>

            <button
              onClick={() => onNavigate('bookings')}
              className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentScreen === 'bookings'
                  ? 'text-[#0051d5] bg-[#eff4ff]'
                  : 'text-[#45464d] hover:text-[#0051d5]'
              }`}
            >
              <span>My Bookings</span>
              {bookingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0051d5] text-white text-[11px] font-semibold flex items-center justify-center">
                  {bookingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('admin')}
              id="nav-admin-panel-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border cursor-pointer ${
                currentScreen === 'admin'
                  ? 'bg-[#0051d5] text-white border-[#0051d5] shadow-xs'
                  : 'bg-blue-50/80 text-[#0051d5] border-blue-200 hover:bg-blue-100/70'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>

            <button
              onClick={() => onNavigate('ops')}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all items-center gap-1.5 border cursor-pointer ${
                currentScreen === 'ops'
                  ? 'bg-[#131b2e] text-white border-[#131b2e] shadow-xs'
                  : 'bg-white text-[#0b1c30] border-[#c6c6cd]/60 hover:bg-[#eff4ff]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0051d5]" />
              <span>Ops</span>
            </button>
          </nav>

          {/* User / Login Segment */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#c6c6cd]/50 relative">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  id="nav-profile-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-[#45464d] hover:text-[#0051d5] p-1 rounded-full focus:outline-none transition-colors cursor-pointer"
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0051d5]/10 border border-[#0051d5]/30 flex items-center justify-center text-[#0051d5] font-semibold text-xs shadow-xs">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline-block text-xs font-medium text-[#0b1c30]">
                    {userName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>KYC & License Verified</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('bookings');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      My Active Rentals
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#0051d5] hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#0051d5]" />
                      Admin Car Management
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAuth('forgot-password');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-slate-400" />
                      Change / Reset Password
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAuth('login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-slate-400" />
                      Switch Account / Sign In
                    </button>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-bold text-[#0051d5] hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="text-xs font-bold bg-[#0051d5] hover:bg-[#003ea8] text-white px-3.5 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

