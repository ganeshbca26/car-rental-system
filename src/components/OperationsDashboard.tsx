import React, { useState } from 'react';
import { ActionItem, FleetVehicle, Booking } from '../types';
import { formatCurrency } from '../utils/currency';
import { 
  LayoutDashboard, 
  Car, 
  CalendarCheck, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowRight,
  Filter,
  Check,
  X,
  BatteryCharging,
  Fuel,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Radio,
  Lock,
  Unlock,
  Volume2,
  Power,
  Gauge,
  Send,
  KeyRound,
  FileCheck,
  Eye,
  RefreshCw,
  Sliders,
  MapPin,
  Menu,
  Activity,
  UserCheck,
  CheckCheck,
  ChevronDown
} from 'lucide-react';

interface OperationsDashboardProps {
  actionItems: ActionItem[];
  fleet: FleetVehicle[];
  bookings: Booking[];
  onExitOps: () => void;
  onUpdateActionItem: (id: string, newStatus: 'approved' | 'rejected' | 'completed') => void;
  onUpdateFleetVehicle?: (id: string, updates: Partial<FleetVehicle>) => void;
  onUpdateBookingStatus?: (id: string, status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled') => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  actionItems,
  fleet,
  bookings,
  onExitOps,
  onUpdateActionItem,
  onUpdateFleetVehicle,
  onUpdateBookingStatus
}) => {
  // Navigation & View State
  const [activeSidebarNav, setActiveSidebarNav] = useState<'dashboard' | 'fleet' | 'bookings' | 'verification' | 'reports' | 'settings'>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals & Drawers
  const [selectedReviewItem, setSelectedReviewItem] = useState<ActionItem | null>(null);
  const [selectedTelemetryCar, setSelectedTelemetryCar] = useState<FleetVehicle | null>(null);
  const [selectedKeyBooking, setSelectedKeyBooking] = useState<Booking | null>(null);
  const [telemetryActionFeedback, setTelemetryActionFeedback] = useState<string | null>(null);
  const [keySentFeedback, setKeySentFeedback] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Filters & Searches
  const [fleetSearch, setFleetSearch] = useState('');
  const [fleetStatusFilter, setFleetStatusFilter] = useState<'all' | 'Rented' | 'Available' | 'Maintenance'>('all');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Interactive Settings State
  const [settingsState, setSettingsState] = useState({
    autoDispatchKey: true,
    maintenanceAlerts500: true,
    geoFenceDropoff: true,
    speedAlertThreshold: 80,
    twoFactorAuthStaff: true,
    afterHoursLockbox: true,
    telemetryRefreshRate: 15
  });

  // Local Fleet State fallback if parent didn't provide updater
  const [localFleet, setLocalFleet] = useState<FleetVehicle[]>(fleet);
  // Keep local fleet in sync if prop changes
  React.useEffect(() => {
    setLocalFleet(fleet);
  }, [fleet]);

  const showOpsToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Filtered fleet list
  const filteredFleet = localFleet.filter((car) => {
    if (fleetStatusFilter !== 'all' && car.status !== fleetStatusFilter) return false;
    if (fleetSearch.trim()) {
      const q = fleetSearch.toLowerCase();
      return (
        car.name.toLowerCase().includes(q) ||
        car.plate.toLowerCase().includes(q) ||
        car.code.toLowerCase().includes(q) ||
        car.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered bookings list
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== 'all' && b.status !== bookingFilter) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      return (
        b.pickupCode.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.vehicle.name.toLowerCase().includes(q) ||
        b.pickupLocation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered verifications
  const verificationItems = actionItems.filter((i) => {
    const isVerification = i.type.includes('verification') || i.type.includes('license');
    if (!isVerification) return false;
    if (verificationFilter !== 'all' && i.status !== verificationFilter) return false;
    return true;
  });

  const pendingActionCount = actionItems.filter((i) => i.status === 'pending').length;
  const pendingVerificationsCount = actionItems.filter(
    (i) => (i.type.includes('verification') || i.type.includes('license')) && i.status === 'pending'
  ).length;

  const handleUpdateVehicleStatus = (carId: string, newStatus: 'Available' | 'Rented' | 'Maintenance') => {
    setLocalFleet((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, status: newStatus } : c))
    );
    if (onUpdateFleetVehicle) {
      onUpdateFleetVehicle(carId, { status: newStatus });
    }
    if (selectedTelemetryCar && selectedTelemetryCar.id === carId) {
      setSelectedTelemetryCar((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showOpsToast(`Vehicle status updated to "${newStatus}"`);
  };

  const handleTriggerTelemetryCommand = (cmd: string) => {
    setTelemetryActionFeedback(`Command executed: ${cmd}`);
    showOpsToast(`Signal broadcast to onboard ECU: ${cmd}`);
    setTimeout(() => setTelemetryActionFeedback(null), 3000);
  };

  const handleResendDigitalKey = (booking: Booking) => {
    setSelectedKeyBooking(booking);
    setKeySentFeedback(false);
  };

  const handleConfirmSendKey = () => {
    setKeySentFeedback(true);
    showOpsToast(`Digital Key and BLE handshake sent to ${selectedKeyBooking?.customerEmail}`);
    setTimeout(() => {
      setSelectedKeyBooking(null);
      setKeySentFeedback(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col md:flex-row font-sans">
      {/* Toast Notification in Ops */}
      {toastNotification && (
        <div className="fixed top-20 right-6 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#0c9488] shrink-0" />
          <span className="text-xs font-semibold">{toastNotification}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-[#0b1c30] text-white flex flex-col justify-between shrink-0 p-4 border-r border-[#131b2e] shadow-xl z-20">
        <div className="space-y-6">
          {/* Brand Logo & Ops Badge */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center text-white font-bold shadow-xs">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block text-white">RIDEMATE</span>
                <span className="text-[10px] font-bold text-blue-300 bg-[#0051d5]/30 px-2 py-0.5 rounded tracking-wider uppercase border border-blue-400/20">
                  Operations Console
                </span>
              </div>
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`space-y-1.5 text-sm font-medium ${mobileNavOpen ? 'block' : 'hidden md:block'}`}>
            <button
              id="ops-nav-dashboard-btn"
              onClick={() => {
                setActiveSidebarNav('dashboard');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarNav === 'dashboard'
                  ? 'bg-[#0051d5] text-white shadow-xs font-semibold'
                  : 'text-[#bec6e0] hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              id="ops-nav-fleet-btn"
              onClick={() => {
                setActiveSidebarNav('fleet');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarNav === 'fleet'
                  ? 'bg-[#0051d5] text-white shadow-xs font-semibold'
                  : 'text-[#bec6e0] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 shrink-0" />
                <span>Fleet Telematics</span>
              </div>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-[#bec6e0] font-mono">
                {localFleet.length}
              </span>
            </button>

            <button
              id="ops-nav-bookings-btn"
              onClick={() => {
                setActiveSidebarNav('bookings');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarNav === 'bookings'
                  ? 'bg-[#0051d5] text-white shadow-xs font-semibold'
                  : 'text-[#bec6e0] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4 shrink-0" />
                <span>Bookings Dispatch</span>
              </div>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full text-[#bec6e0] font-mono">
                {bookings.length}
              </span>
            </button>

            <button
              id="ops-nav-verification-btn"
              onClick={() => {
                setActiveSidebarNav('verification');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarNav === 'verification'
                  ? 'bg-[#0051d5] text-white shadow-xs font-semibold'
                  : 'text-[#bec6e0] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>KYC Verification</span>
              </div>
              {pendingVerificationsCount > 0 && (
                <span className="text-[11px] bg-[#ba1a1a] text-white px-2 py-0.5 rounded-full font-bold">
                  {pendingVerificationsCount}
                </span>
              )}
            </button>

            <button
              id="ops-nav-reports-btn"
              onClick={() => {
                setActiveSidebarNav('reports');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarNav === 'reports'
                  ? 'bg-[#0051d5] text-white shadow-xs font-semibold'
                  : 'text-[#bec6e0] hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Yield & Analytics</span>
            </button>

            <button
              id="ops-nav-settings-btn"
              onClick={() => {
                setActiveSidebarNav('settings');
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarNav === 'settings'
                  ? 'bg-[#0051d5] text-white shadow-xs font-semibold'
                  : 'text-[#bec6e0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Hub Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom User info & Exit */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="px-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0051d5] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              OP
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white">SFO Hub Operations</p>
              <p className="text-[10px] text-[#bec6e0]">Manager ID: #9921 • Online</p>
            </div>
          </div>

          <button
            id="ops-exit-btn"
            onClick={onExitOps}
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Exit to Public Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Operations Area */}
      <div className="flex-grow flex flex-col overflow-y-auto">
        {/* Top Operations Header */}
        <header className="bg-white border-b border-[#c6c6cd]/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 z-30 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
              {activeSidebarNav === 'dashboard' && 'Operations Dashboard'}
              {activeSidebarNav === 'fleet' && 'Fleet Management & Telematics'}
              {activeSidebarNav === 'bookings' && 'Reservation Dispatch Master'}
              {activeSidebarNav === 'verification' && 'KYC & License Verification Queue'}
              {activeSidebarNav === 'reports' && 'Operational Analytics & Yield'}
              {activeSidebarNav === 'settings' && 'Hub Parameters & Fleet Rules'}
            </h1>
            <p className="text-xs text-[#76777d]">
              Live Telemetry • San Francisco International Airport Hub (SFO-01)
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto relative">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-xs font-semibold text-[#0051d5] border border-[#0051d5]/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Oct 24, 2026 • Live Telemetry Active</span>
            </div>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                id="ops-notifications-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-[#c6c6cd]/60 hover:bg-[#eff4ff] text-[#45464d] relative cursor-pointer"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4" />
                {pendingActionCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] absolute top-1 right-1 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Center Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#0051d5]" />
                      Live System Alerts
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {actionItems.length} Total
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedReviewItem(item);
                          setShowNotifications(false);
                        }}
                        className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2.5"
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          item.priority === 'High' ? 'bg-rose-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500">{item.userOrVehicle}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.timeOrLocation}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 px-3 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[11px] font-bold text-[#0051d5] hover:underline"
                    >
                      Close Alerts Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content based on selected nav */}
        <main className="p-6 md:p-8 space-y-8 flex-grow">
          {/* ========================================================================= */}
          {/* VIEW 1: MAIN DASHBOARD */}
          {/* ========================================================================= */}
          {activeSidebarNav === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1: Total Active Rentals */}
                <div 
                  onClick={() => setActiveSidebarNav('bookings')}
                  className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#76777d]">Total Active Rentals</span>
                    <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-[#0b1c30]">1,245</div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#0c9488] mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+12% vs last week</span>
                    </div>
                  </div>
                </div>

                {/* Metric 2: Fleet Utilization */}
                <div 
                  onClick={() => setActiveSidebarNav('fleet')}
                  className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#76777d]">Fleet Utilization</span>
                    <div className="w-8 h-8 rounded-lg bg-[#0c9488]/10 text-[#0c9488] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-[#0b1c30]">82%</div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#0c9488] mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+4% vs last week</span>
                    </div>
                  </div>
                </div>

                {/* Metric 3: Verification Queue */}
                <div 
                  onClick={() => setActiveSidebarNav('verification')}
                  className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#76777d]">Verification Queue</span>
                    <div className="w-8 h-8 rounded-lg bg-[#ffb74d]/20 text-[#f57c00] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-[#0b1c30]">{pendingVerificationsCount}</div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#f57c00] mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Requires immediate review</span>
                    </div>
                  </div>
                </div>

                {/* Metric 4: Maintenance Required */}
                <div 
                  onClick={() => {
                    setFleetStatusFilter('Maintenance');
                    setActiveSidebarNav('fleet');
                  }}
                  className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-[#76777d]">Maintenance Required</span>
                    <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-[#0b1c30]">
                      {localFleet.filter((c) => c.status === 'Maintenance').length}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#ba1a1a] mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>2 urgent bay inspections</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Section: Action Required (Left) + Fleet Status (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Action Required List */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-xs space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">Action Required</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eff4ff] text-[#0051d5]">
                        {pendingActionCount} Pending
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          item.status === 'pending'
                            ? 'bg-[#f8f9ff] border-[#c6c6cd]/60 hover:border-[#0051d5]/40 shadow-xs'
                            : 'bg-slate-50 border-slate-200 opacity-70'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#0b1c30]">{item.title}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.priority === 'High'
                                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                  : 'bg-[#eff4ff] text-[#0051d5]'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-[#45464d]">{item.userOrVehicle}</p>
                          <p className="text-[11px] text-[#76777d]">{item.timeOrLocation}</p>
                        </div>

                        <div>
                          {item.status === 'pending' ? (
                            <button
                              id={`action-item-review-btn-${item.id}`}
                              onClick={() => setSelectedReviewItem(item)}
                              className="px-4 py-2 bg-[#0051d5] hover:bg-[#003ea8] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <span>{item.type === 'handover' ? 'Assign' : item.type === 'maintenance' ? 'Inspect' : 'Review'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-[#0c9488] flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {item.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Fleet Status & Donut Chart */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">Fleet Telematics Status</h2>
                    <p className="text-xs text-[#76777d]">Total SFO Hub Capacity: 3,500 Vehicles</p>
                  </div>

                  {/* SVG Donut Chart with Center Label */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Background track */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#eff4ff"
                          strokeWidth="14"
                        />
                        {/* Segment 1: 65% Rented (#0051d5) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#0051d5"
                          strokeWidth="14"
                          strokeDasharray="155.19 238.76"
                          strokeDashoffset="0"
                        />
                        {/* Segment 2: 25% Available (#0c9488) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#0c9488"
                          strokeWidth="14"
                          strokeDasharray="59.69 238.76"
                          strokeDashoffset="-155.19"
                        />
                        {/* Segment 3: 10% Maintenance (#ba1a1a) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#ba1a1a"
                          strokeWidth="14"
                          strokeDasharray="23.88 238.76"
                          strokeDashoffset="-214.88"
                        />
                      </svg>

                      {/* Center Donut Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-[#0b1c30]">3,500</span>
                        <span className="text-[10px] uppercase font-semibold text-[#76777d]">Total Active</span>
                      </div>
                    </div>

                    {/* Breakdown Legend */}
                    <div className="w-full mt-6 space-y-3">
                      {/* Rented 65% */}
                      <div 
                        onClick={() => {
                          setFleetStatusFilter('Rented');
                          setActiveSidebarNav('fleet');
                        }}
                        className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#0051d5]" />
                          <span className="font-semibold text-[#0b1c30]">Rented (65%)</span>
                        </div>
                        <span className="font-bold text-[#0b1c30]">2,275 cars</span>
                      </div>

                      {/* Available 25% */}
                      <div 
                        onClick={() => {
                          setFleetStatusFilter('Available');
                          setActiveSidebarNav('fleet');
                        }}
                        className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#0c9488]" />
                          <span className="font-semibold text-[#0b1c30]">Available (25%)</span>
                        </div>
                        <span className="font-bold text-[#0b1c30]">875 cars</span>
                      </div>

                      {/* Maintenance 10% */}
                      <div 
                        onClick={() => {
                          setFleetStatusFilter('Maintenance');
                          setActiveSidebarNav('fleet');
                        }}
                        className="flex justify-between items-center text-xs p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#ba1a1a]" />
                          <span className="font-semibold text-[#0b1c30]">Maintenance (10%)</span>
                        </div>
                        <span className="font-bold text-[#0b1c30]">350 cars</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: FLEET MANAGEMENT & TELEMATICS */}
          {/* ========================================================================= */}
          {activeSidebarNav === 'fleet' && (
            <div className="bg-white rounded-3xl border border-[#c6c6cd]/50 shadow-xs p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#76777d] absolute left-3.5 top-3" />
                  <input
                    id="fleet-search-input"
                    type="text"
                    value={fleetSearch}
                    onChange={(e) => setFleetSearch(e.target.value)}
                    placeholder="Search vehicle code, plate, model, location..."
                    className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'Rented', 'Available', 'Maintenance'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setFleetStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        fleetStatusFilter === st
                          ? 'bg-[#0051d5] text-white shadow-xs'
                          : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]'
                      }`}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[#76777d] uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-4">Vehicle / Code</th>
                      <th className="py-3.5 px-4">Plate</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Battery / Fuel</th>
                      <th className="py-3.5 px-4">Current Hub Location</th>
                      <th className="py-3.5 px-4">Service Interval</th>
                      <th className="py-3.5 px-4 text-right">Telematics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFleet.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No fleet vehicles match the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredFleet.map((car) => (
                        <tr key={car.id} className="hover:bg-[#f8f9ff] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0b1c30]">
                            <div>{car.name}</div>
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {car.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{car.plate}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                                car.status === 'Rented'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : car.status === 'Available'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                car.status === 'Rented' ? 'bg-blue-500' : car.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`} />
                              {car.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full ${
                                    car.fuelBattery > 50 ? 'bg-[#0c9488]' : car.fuelBattery > 20 ? 'bg-[#f57c00]' : 'bg-[#ba1a1a]'
                                  }`}
                                  style={{ width: `${car.fuelBattery}%` }}
                                />
                              </div>
                              <span className="font-bold font-mono">{car.fuelBattery}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#45464d]">{car.location}</td>
                          <td className="py-3.5 px-4 text-[#76777d]">{car.nextService}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              id={`fleet-telemetry-btn-${car.id}`}
                              onClick={() => setSelectedTelemetryCar(car)}
                              className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#0051d5] hover:text-white rounded-xl font-bold text-[#0051d5] transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                            >
                              <Radio className="w-3.5 h-3.5" />
                              <span>Diagnostics</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: BOOKINGS DISPATCH */}
          {/* ========================================================================= */}
          {activeSidebarNav === 'bookings' && (
            <div className="bg-white rounded-3xl border border-[#c6c6cd]/50 shadow-xs p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0b1c30]">All Active & Scheduled Rentals</h2>
                  <p className="text-xs text-[#76777d]">Live reservation dispatch, lockbox access, and digital key status.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'Confirmed', 'Active', 'Completed', 'Cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        bookingFilter === st
                          ? 'bg-[#0051d5] text-white shadow-xs'
                          : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#76777d] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search by pickup code, customer name, vehicle..."
                  className="w-full pl-10 pr-3 py-2 bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#0051d5]/20 focus:border-[#0051d5] outline-none"
                />
              </div>

              <div className="space-y-3">
                {filteredBookings.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    No reservations match the selected filter.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-[#c6c6cd]/50 bg-[#f8f9ff] hover:bg-white transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-extrabold text-[#0051d5] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                            {b.pickupCode}
                          </span>
                          <span className="font-bold text-[#0b1c30] text-sm">{b.vehicle.name}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold ${
                              b.status === 'Confirmed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : b.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-[#45464d]">
                          <span className="font-semibold text-slate-700">Driver:</span> {b.customerName} ({b.customerEmail} • {b.customerPhone})
                        </p>
                        <p className="text-[#76777d]">
                          <span className="font-semibold text-slate-700">Rental Window:</span> {b.pickupDate} ({b.pickupTime}) to {b.dropoffDate} ({b.dropoffTime}) • {b.days} Days • <strong className="text-slate-900">{formatCurrency(b.totalDue)}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end lg:self-auto">
                        <button
                          id={`resend-key-btn-${b.id}`}
                          onClick={() => handleResendDigitalKey(b)}
                          className="px-3.5 py-2 bg-white border border-[#c6c6cd] hover:border-[#0051d5] text-[#0051d5] font-bold rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Resend Access Key</span>
                        </button>

                        {onUpdateBookingStatus && b.status === 'Confirmed' && (
                          <button
                            onClick={() => {
                              onUpdateBookingStatus(b.id, 'Active');
                              showOpsToast(`Rental #${b.pickupCode} marked as Active Departure`);
                            }}
                            className="px-3 py-2 bg-[#0c9488] hover:bg-[#0f766e] text-white font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
                          >
                            Mark Picked Up
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: VERIFICATION QUEUE */}
          {/* ========================================================================= */}
          {activeSidebarNav === 'verification' && (
            <div className="bg-white rounded-3xl border border-[#c6c6cd]/50 shadow-xs p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#0b1c30]">Driver KYC & License Verification Portal</h2>
                  <p className="text-xs text-[#45464d]">
                    Review state driving credentials and DMV real-time records before authorizing digital key release.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setVerificationFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        verificationFilter === st
                          ? 'bg-[#0051d5] text-white shadow-xs'
                          : 'bg-[#eff4ff] text-[#45464d] hover:bg-[#e5eeff]'
                      }`}
                    >
                      {st.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {verificationItems.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    No verification records found under current filter.
                  </div>
                ) : (
                  verificationItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl border border-[#c6c6cd]/50 bg-[#f8f9ff] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#0b1c30]">{item.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.priority === 'High' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#eff4ff] text-[#0051d5]'
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs text-[#45464d]">{item.userOrVehicle} • {item.timeOrLocation}</p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCheck className="w-3 h-3" /> DMV Live Match: 99.4%
                          </span>
                          <span>•</span>
                          <span>Biometric Selfie: Verified</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {item.status === 'pending' ? (
                          <>
                            <button
                              id={`kyc-approve-btn-${item.id}`}
                              onClick={() => {
                                onUpdateActionItem(item.id, 'approved');
                                showOpsToast(`KYC Approved for ${item.userOrVehicle}`);
                              }}
                              className="px-3.5 py-2 bg-[#0c9488] hover:bg-[#0f766e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve License</span>
                            </button>
                            <button
                              id={`kyc-reject-btn-${item.id}`}
                              onClick={() => {
                                onUpdateActionItem(item.id, 'rejected');
                                showOpsToast(`KYC Rejected for ${item.userOrVehicle}`);
                              }}
                              className="px-3.5 py-2 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-[#0c9488] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: REPORTS & YIELD ANALYTICS */}
          {/* ========================================================================= */}
          {activeSidebarNav === 'reports' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-3xl bg-white border border-[#0051d5]/20 shadow-xs">
                  <span className="text-xs font-semibold text-[#76777d]">Monthly Gross Fleet Revenue</span>
                  <div className="text-3xl font-extrabold text-[#0051d5] mt-1">{formatCurrency(482900)}</div>
                  <span className="text-[11px] text-[#0c9488] font-bold inline-flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% MoM Growth
                  </span>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-[#0051d5]/20 shadow-xs">
                  <span className="text-xs font-semibold text-[#76777d]">Average Rental Duration</span>
                  <div className="text-3xl font-extrabold text-[#0051d5] mt-1">3.8 Days</div>
                  <span className="text-[11px] text-[#0c9488] font-bold inline-flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +0.4 days vs Target
                  </span>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-[#0051d5]/20 shadow-xs">
                  <span className="text-xs font-semibold text-[#76777d]">Customer Satisfaction Index</span>
                  <div className="text-3xl font-extrabold text-[#0051d5] mt-1">4.94 / 5.0</div>
                  <span className="text-[11px] text-[#0c9488] font-bold inline-flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> 98.2% Positive Feedback
                  </span>
                </div>
              </div>

              {/* Revenue by Vehicle Category Chart Card */}
              <div className="bg-white p-6 rounded-3xl border border-[#c6c6cd]/50 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0b1c30]">Fleet Revenue Contribution by Class</h3>
                  <p className="text-xs text-slate-500">Real-time yield analytics across Luxury SUV, Executive Sedan, and EV segments.</p>
                </div>

                <div className="space-y-4">
                  {/* Category 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">Luxury SUVs (Range Rover Velar, Audi Q7)</span>
                      <span className="text-[#0051d5]">{formatCurrency(198400)} (41%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-[#0051d5] h-full rounded-full" style={{ width: '41%' }} />
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">Electric Vehicles (Tesla Model Y, Hyundai Ioniq)</span>
                      <span className="text-[#0c9488]">{formatCurrency(164200)} (34%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-[#0c9488] h-full rounded-full" style={{ width: '34%' }} />
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-800">Executive Sedans (Mercedes-Benz S/E-Class)</span>
                      <span className="text-amber-600">{formatCurrency(120300)} (25%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: HUB SETTINGS & TELEMETRICS */}
          {/* ========================================================================= */}
          {activeSidebarNav === 'settings' && (
            <div className="bg-white rounded-3xl border border-[#c6c6cd]/50 shadow-xs p-6 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold text-[#0b1c30]">Operations & Telemetry Automation Rules</h2>
                <p className="text-xs text-[#76777d]">Configure digital access keys, automated maintenance triggers, and geo-fence drop-offs.</p>
              </div>

              <div className="space-y-4 text-xs text-[#0b1c30]">
                {/* Setting 1 */}
                <label className="flex items-center justify-between p-4 bg-[#f8f9ff] hover:bg-slate-100/80 rounded-2xl cursor-pointer border border-slate-200 transition-colors">
                  <div className="pr-4">
                    <h4 className="font-bold text-slate-900 text-sm">Instant Digital Key Dispatch</h4>
                    <p className="text-slate-500 mt-0.5">Automatically dispatch BLE mobile unlock token once KYC driver license is approved.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsState.autoDispatchKey}
                    onChange={(e) => setSettingsState({ ...settingsState, autoDispatchKey: e.target.checked })}
                    className="w-5 h-5 accent-[#0051d5] rounded-md cursor-pointer shrink-0"
                  />
                </label>

                {/* Setting 2 */}
                <label className="flex items-center justify-between p-4 bg-[#f8f9ff] hover:bg-slate-100/80 rounded-2xl cursor-pointer border border-slate-200 transition-colors">
                  <div className="pr-4">
                    <h4 className="font-bold text-slate-900 text-sm">Proactive 500-Mile Service Warning</h4>
                    <p className="text-slate-500 mt-0.5">Flag vehicle for service inspection when mileage nears manufacturer service threshold.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsState.maintenanceAlerts500}
                    onChange={(e) => setSettingsState({ ...settingsState, maintenanceAlerts500: e.target.checked })}
                    className="w-5 h-5 accent-[#0051d5] rounded-md cursor-pointer shrink-0"
                  />
                </label>

                {/* Setting 3 */}
                <label className="flex items-center justify-between p-4 bg-[#f8f9ff] hover:bg-slate-100/80 rounded-2xl cursor-pointer border border-slate-200 transition-colors">
                  <div className="pr-4">
                    <h4 className="font-bold text-slate-900 text-sm">Geo-Fence Automated Drop-off Detection</h4>
                    <p className="text-slate-500 mt-0.5">Automatically close rental agreement when car returns to SFO Bay 1-20 perimeter.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsState.geoFenceDropoff}
                    onChange={(e) => setSettingsState({ ...settingsState, geoFenceDropoff: e.target.checked })}
                    className="w-5 h-5 accent-[#0051d5] rounded-md cursor-pointer shrink-0"
                  />
                </label>

                {/* Setting 4: Speed Threshold */}
                <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Over-Speed Alert Threshold</h4>
                      <p className="text-slate-500 mt-0.5">Send high-priority telemetry alert if vehicle exceeds speed limit.</p>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#0051d5] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {settingsState.speedAlertThreshold} MPH
                    </span>
                  </div>
                  <input
                    type="range"
                    min={65}
                    max={95}
                    value={settingsState.speedAlertThreshold}
                    onChange={(e) => setSettingsState({ ...settingsState, speedAlertThreshold: Number(e.target.value) })}
                    className="w-full accent-[#0051d5] cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showOpsToast('Hub Settings & Telemetry Rules Saved Successfully')}
                    className="px-6 py-2.5 bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Save Operational Rules
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Action Item Review Modal */}
      {/* ========================================================================= */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#c6c6cd]/50 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Action ID: #{selectedReviewItem.id}
                </span>
                <h3 className="text-lg font-extrabold text-[#0b1c30] mt-1">{selectedReviewItem.title}</h3>
                <p className="text-xs text-[#76777d]">{selectedReviewItem.timeOrLocation}</p>
              </div>
              <button
                onClick={() => setSelectedReviewItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8f9ff] p-4 rounded-2xl space-y-2.5 text-xs text-[#45464d] border border-slate-200">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Subject / Target:</span>
                <span className="text-[#0b1c30] font-bold">{selectedReviewItem.userOrVehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Priority Level:</span>
                <span className={`font-bold ${selectedReviewItem.priority === 'High' ? 'text-[#ba1a1a]' : 'text-[#0051d5]'}`}>
                  {selectedReviewItem.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Verification System:</span>
                <span className="text-[#0c9488] font-bold">DMV Real-time API Match (Valid)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  onUpdateActionItem(selectedReviewItem.id, 'rejected');
                  setSelectedReviewItem(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ffdad6]/20 transition-colors cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => {
                  onUpdateActionItem(selectedReviewItem.id, 'approved');
                  setSelectedReviewItem(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0c9488] hover:bg-[#0f766e] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Authorize</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Full Vehicle Telemetry & Diagnostics Modal */}
      {/* ========================================================================= */}
      {selectedTelemetryCar && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedTelemetryCar.name}</h3>
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedTelemetryCar.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Plate: {selectedTelemetryCar.plate} • Location: {selectedTelemetryCar.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTelemetryCar(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Feedback banner */}
            {telemetryActionFeedback && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{telemetryActionFeedback}</span>
              </div>
            )}

            {/* Telemetry Sensor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block text-[11px]">Fuel / Battery</span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-1 block">
                  {selectedTelemetryCar.fuelBattery}%
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Optimal Charge</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block text-[11px]">Odometer</span>
                <span className="text-lg font-bold text-slate-900 font-mono mt-1 block">
                  {selectedTelemetryCar.mileage.toLocaleString()} mi
                </span>
                <span className="text-[10px] text-slate-500">{selectedTelemetryCar.nextService}</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block text-[11px]">Tire Pressure (TPMS)</span>
                <span className="text-lg font-bold text-emerald-600 font-mono mt-1 block">
                  34 PSI All
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">No Leaks Detected</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-slate-500 font-semibold block text-[11px]">GPS Signal</span>
                <span className="text-lg font-bold text-blue-600 font-mono mt-1 block">
                  37.6213° N
                </span>
                <span className="text-[10px] text-slate-500 font-mono">-122.3790° W</span>
              </div>
            </div>

            {/* Quick Status Modifier */}
            <div className="p-4 bg-[#f8f9ff] rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Override Operational Status:</span>
              <div className="flex gap-2 flex-wrap">
                {(['Available', 'Rented', 'Maintenance'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateVehicleStatus(selectedTelemetryCar.id, st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTelemetryCar.status === st
                        ? 'bg-[#0051d5] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Remote Commands Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">ECU Remote Telematics Broadcast:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleTriggerTelemetryCommand('Doors Locked Remotely')}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Lock Doors</span>
                </button>
                <button
                  onClick={() => handleTriggerTelemetryCommand('Doors Unlocked Remotely')}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unlock Doors</span>
                </button>
                <button
                  onClick={() => handleTriggerTelemetryCommand('Lights Flashed & Horn Sounded')}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Horn / Flash</span>
                </button>
                <button
                  onClick={() => handleTriggerTelemetryCommand('Valet Speed Limiter Set')}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Gauge className="w-3.5 h-3.5 text-rose-600" />
                  <span>Limit 75 MPH</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTelemetryCar(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Resend Digital Key Modal */}
      {/* ========================================================================= */}
      {selectedKeyBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Resend Digital Vehicle Key</h3>
                  <p className="text-xs text-slate-500 font-mono">Code: {selectedKeyBooking.pickupCode}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedKeyBooking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold">Recipient:</span>
                <span className="font-bold text-slate-900">{selectedKeyBooking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Email:</span>
                <span className="font-mono text-slate-900">{selectedKeyBooking.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Phone:</span>
                <span className="font-mono text-slate-900">{selectedKeyBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Assigned Vehicle:</span>
                <span className="font-bold text-[#0051d5]">{selectedKeyBooking.vehicle.name}</span>
              </div>
            </div>

            {keySentFeedback ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key delivered via Encrypted SMS & Email</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setSelectedKeyBooking(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-send-key-btn"
                  onClick={handleConfirmSendKey}
                  className="px-5 py-2.5 rounded-xl bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Digital Key Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
