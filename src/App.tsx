import React, { useState } from 'react';
import { ScreenType, Vehicle, Booking, SearchState, ActionItem, FleetVehicle } from './types';
import { INITIAL_VEHICLES, INITIAL_BOOKINGS, INITIAL_ACTION_ITEMS, INITIAL_FLEET } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { SearchResultsScreen } from './components/SearchResultsScreen';
import { VehicleDetailsScreen } from './components/VehicleDetailsScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { OperationsDashboard } from './components/OperationsDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { Layers, CheckCircle2, SlidersHorizontal, Home, Search, Car, Calendar, ShieldCheck } from 'lucide-react';

export default function App() {
  // App navigation state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  
  // Data state
  const [vehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(INITIAL_VEHICLES[0]); // Range Rover Velar by default
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [actionItems, setActionItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);
  const [fleet, setFleet] = useState<FleetVehicle[]>(INITIAL_FLEET);

  // Search parameters
  const [searchState, setSearchState] = useState<SearchState>({
    pickupLocation: 'San Francisco International Airport (SFO)',
    returnLocation: 'San Francisco International Airport (SFO)',
    pickupDate: '2026-10-24',
    pickupTime: '10:00 AM',
    returnDate: '2026-10-27',
    returnTime: '2:00 PM'
  });

  // Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutVehicle, setCheckoutVehicle] = useState<Vehicle | null>(null);
  const [checkoutDays, setCheckoutDays] = useState(3);
  const [checkoutPlan, setCheckoutPlan] = useState<'basic' | 'standard' | 'premium'>('standard');

  // User & Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('Ganesh J.');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Handlers
  const handleOpenAuth = (mode: 'login' | 'signup' | 'forgot-password' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (name: string, _email: string) => {
    setUserName(name || 'Member');
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${name || 'Member'}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Signed out successfully.');
  };

  // Handlers
  const handleUpdateSearchState = (updated: Partial<SearchState>) => {
    setSearchState((prev) => ({ ...prev, ...updated }));
  };

  const handleSearch = () => {
    setCurrentScreen('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentScreen('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (vehicle: Vehicle, days: number, plan: 'basic' | 'standard' | 'premium') => {
    setCheckoutVehicle(vehicle);
    setCheckoutDays(days);
    setCheckoutPlan(plan);
    setCheckoutModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setCheckoutModalOpen(false);
    setCurrentScreen('bookings');
    showToast(`Reservation confirmed! Your pickup code is ${newBooking.pickupCode}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
    showToast('Reservation cancelled. Refund has been initiated.');
  };

  const handleModifyBooking = (booking: Booking) => {
    setSelectedVehicle(booking.vehicle);
    setCurrentScreen('details');
    showToast(`Editing reservation ${booking.pickupCode}`);
  };

  const handleUpdateActionItem = (id: string, newStatus: 'approved' | 'rejected' | 'completed') => {
    setActionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast(`Action item #${id} marked as ${newStatus}`);
  };

  const handleUpdateFleetVehicle = (id: string, updates: Partial<FleetVehicle>) => {
    setFleet((prev) =>
      prev.map((car) => (car.id === id ? { ...car, ...updates } : car))
    );
  };

  const handleUpdateBookingStatus = (id: string, status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#0051d5]/20 selection:text-[#0051d5]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in fade-in slide-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#0c9488]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Screen 6: Full Enterprise Admin Panel */}
      {currentScreen === 'admin' ? (
        <AdminPanel
          onExitAdmin={() => setCurrentScreen('home')}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentScreen('home');
            showToast('Logged out of Admin Portal.');
          }}
        />
      ) : currentScreen === 'ops' ? (
        <OperationsDashboard
          actionItems={actionItems}
          fleet={fleet}
          bookings={bookings}
          onExitOps={() => setCurrentScreen('home')}
          onUpdateActionItem={handleUpdateActionItem}
          onUpdateFleetVehicle={handleUpdateFleetVehicle}
          onUpdateBookingStatus={handleUpdateBookingStatus}
        />
      ) : (
        <>
          {/* Public Navbar (Screens 1 - 4) */}
          <Navbar
            currentScreen={currentScreen}
            onNavigate={(s) => {
              setCurrentScreen(s);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSearchQuery={(q) => {
              handleUpdateSearchState({ pickupLocation: q });
            }}
            bookingCount={bookings.filter((b) => b.status === 'Confirmed').length}
            userName={userName}
            isLoggedIn={isLoggedIn}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />

          {/* Main View Switching */}
          <div className="flex-grow flex flex-col">
            {currentScreen === 'home' && (
              <HomeScreen
                vehicles={vehicles}
                searchState={searchState}
                onUpdateSearchState={handleUpdateSearchState}
                onSearch={handleSearch}
                onSelectVehicle={handleSelectVehicle}
                onViewAllFleet={() => setCurrentScreen('search')}
                onOpenAuth={handleOpenAuth}
                isLoggedIn={isLoggedIn}
                userName={userName}
              />
            )}

            {currentScreen === 'search' && (
              <SearchResultsScreen
                vehicles={vehicles}
                searchState={searchState}
                onUpdateSearchState={handleUpdateSearchState}
                onSelectVehicle={handleSelectVehicle}
                rentalDays={checkoutDays}
              />
            )}

            {currentScreen === 'details' && selectedVehicle && (
              <VehicleDetailsScreen
                vehicle={selectedVehicle}
                searchState={searchState}
                onBackToSearch={() => setCurrentScreen('search')}
                onProceedToCheckout={handleProceedToCheckout}
              />
            )}

            {currentScreen === 'bookings' && (
              <MyBookingsScreen
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onModifyBooking={handleModifyBooking}
                onBrowseFleet={() => setCurrentScreen('search')}
              />
            )}
          </div>

          {/* Public Footer */}
          <Footer />
        </>
      )}

      {/* Checkout Modal */}
      {checkoutModalOpen && checkoutVehicle && (
        <CheckoutModal
          vehicle={checkoutVehicle}
          searchState={searchState}
          rentalDays={checkoutDays}
          initialPlan={checkoutPlan}
          onClose={() => setCheckoutModalOpen(false)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Login / Sign Up / Forgot Password Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Quick Screen Switcher Pill (Floating bar at bottom for previewing all screens) */}
      <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-[#c6c6cd]/50 hidden sm:flex items-center gap-1.5 text-xs font-semibold">
        <span className="text-[10px] uppercase font-bold text-[#76777d] px-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#0051d5]" />
          Screens:
        </span>
        <button
          onClick={() => setCurrentScreen('home')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            currentScreen === 'home' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
          title="Screen 1: Home & Hero"
        >
          <Home className="w-3.5 h-3.5" />
          <span>1. Home</span>
        </button>

        <button
          onClick={() => setCurrentScreen('search')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            currentScreen === 'search' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
          title="Screen 2: Search & Filter"
        >
          <Search className="w-3.5 h-3.5" />
          <span>2. Search</span>
        </button>

        <button
          onClick={() => {
            setSelectedVehicle(INITIAL_VEHICLES[0]);
            setCurrentScreen('details');
          }}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            currentScreen === 'details' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
          title="Screen 3: Vehicle Details"
        >
          <Car className="w-3.5 h-3.5" />
          <span>3. Details</span>
        </button>

        <button
          onClick={() => setCurrentScreen('bookings')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            currentScreen === 'bookings' ? 'bg-[#0051d5] text-white shadow-xs' : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
          title="Screen 4: My Bookings & Verification"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>4. Bookings</span>
        </button>

        <button
          onClick={() => setCurrentScreen('ops')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            currentScreen === 'ops' ? 'bg-[#131b2e] text-white shadow-xs' : 'text-[#45464d] hover:bg-[#eff4ff]'
          }`}
          title="Screen 5: Operations Dashboard"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#0051d5]" />
          <span>5. Ops</span>
        </button>

        <button
          onClick={() => setCurrentScreen('admin')}
          className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 font-bold ${
            currentScreen === 'admin' ? 'bg-[#0051d5] text-white shadow-xs' : 'bg-blue-50 text-[#0051d5] hover:bg-blue-100'
          }`}
          title="Screen 6: Production Car Management Admin Panel"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>6. Admin Panel</span>
        </button>
      </div>
    </div>
  );
}
