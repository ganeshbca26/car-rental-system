import React, { useState } from 'react';
import { Booking } from '../types';
import { formatCurrency } from '../utils/currency';
import { 
  Calendar, 
  History, 
  User, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  CreditCard, 
  MapPin, 
  Car, 
  AlertTriangle,
  Upload,
  ArrowRight,
  Shield,
  Download
} from 'lucide-react';

interface MyBookingsScreenProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onModifyBooking: (booking: Booking) => void;
  onBrowseFleet: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  bookings,
  onCancelBooking,
  onModifyBooking,
  onBrowseFleet
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile' | 'documents'>('upcoming');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(null);

  // Filter bookings
  const upcomingBookings = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Active');
  const pastBookings = bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0b1c30] tracking-tight">
            My Bookings
          </h1>
          <p className="text-sm text-[#45464d] mt-1">
            Manage your active trips, digital pickup keys, and verification credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar (matching Screen 4) */}
        <aside className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#c6c6cd]/50 shadow-sm space-y-1.5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#0051d5] text-white shadow-sm'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0051d5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" />
              <span>Upcoming</span>
            </div>
            {upcomingBookings.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#0051d5]'
                }`}
              >
                {upcomingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'past'
                ? 'bg-[#0051d5] text-white shadow-sm'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0051d5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4" />
              <span>Past</span>
            </div>
            {pastBookings.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'past' ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#45464d]'
                }`}
              >
                {pastBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'profile'
                ? 'bg-[#0051d5] text-white shadow-sm'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0051d5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'documents'
                ? 'bg-[#0051d5] text-white shadow-sm'
                : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0051d5]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </button>
        </aside>

        {/* Right Main Content Panel */}
        <main className="lg:col-span-9 space-y-8">
          {/* TAB 1: UPCOMING BOOKINGS */}
          {activeTab === 'upcoming' && (
            <div className="space-y-8">
              {upcomingBookings.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#c6c6cd]/50 text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-[#eff4ff] text-[#0051d5] mx-auto flex items-center justify-center">
                    <Car className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">No Upcoming Rentals</h3>
                  <p className="text-sm text-[#45464d] max-w-md mx-auto">
                    You don't have any scheduled vehicle reservations. Discover our luxury sedans, electric SUVs, and family fleet.
                  </p>
                  <button
                    onClick={onBrowseFleet}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0051d5] text-white rounded-xl text-sm font-semibold hover:bg-[#003ea8] transition-colors"
                  >
                    <span>Browse Vehicles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-[#c6c6cd]/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row group"
                  >
                    {/* Vehicle Photo with Confirmed badge */}
                    <div className="md:w-[42%] lg:w-[38%] h-64 md:h-auto relative bg-[#e5eeff] shrink-0 overflow-hidden">
                      <img
                        src={booking.vehicle.imageUrl}
                        alt={booking.vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#0c9488] border border-[#0c9488]/30 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed</span>
                      </div>
                    </div>

                    {/* Content & Specs (matching Screen 4) */}
                    <div className="p-6 md:p-7 flex-grow flex flex-col justify-between space-y-6">
                      {/* Top Row: Title, Subtitle & Price */}
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
                              {booking.vehicle.name}
                            </h2>
                            <p className="text-xs text-[#76777d]">or similar</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-[#0b1c30]">
                              {formatCurrency(booking.dailyRate)}
                            </span>
                            <span className="text-xs text-[#76777d] font-normal">/day</span>
                          </div>
                        </div>

                        {/* Specs Pill list */}
                        <div className="flex items-center gap-3 text-xs text-[#45464d] mt-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-[#0051d5]" />
                            {booking.vehicle.fuelType}
                          </span>
                          <span>•</span>
                          <span>{booking.vehicle.seats} Seats</span>
                        </div>

                        {/* Pickup & Dropoff Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#eff4ff] pt-4 mt-4">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#76777d] block">
                              PICKUP
                            </span>
                            <div className="text-sm font-bold text-[#0b1c30] mt-0.5">
                              {booking.pickupDate}, {booking.pickupTime}
                            </div>
                            <div className="text-xs text-[#45464d] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#76777d]" />
                              <span>{booking.pickupLocation}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#76777d] block">
                              DROPOFF
                            </span>
                            <div className="text-sm font-bold text-[#0b1c30] mt-0.5">
                              {booking.dropoffDate}, {booking.dropoffTime}
                            </div>
                            <div className="text-xs text-[#45464d] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#76777d]" />
                              <span>{booking.dropoffLocation}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pickup Code Box & Actions (exact matching Screen 4) */}
                      <div className="bg-[#eff4ff]/70 p-4 rounded-xl border border-[#c6c6cd]/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="bg-white px-4 py-2 rounded-lg border border-[#c6c6cd]/50 shadow-xs">
                            <span className="text-[10px] font-semibold text-[#76777d] uppercase tracking-wider block">
                              Pickup Code
                            </span>
                            <span className="text-lg md:text-xl font-mono font-bold text-[#0b1c30] tracking-wider">
                              {booking.pickupCode}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopyCode(booking.pickupCode)}
                            className="p-2 rounded-lg hover:bg-white text-[#0051d5] border border-transparent hover:border-[#c6c6cd]/40 transition-all"
                            title="Copy Pickup Code"
                          >
                            {copiedCode === booking.pickupCode ? (
                              <Check className="w-5 h-5 text-[#0c9488]" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Modify & Cancel Buttons */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => onModifyBooking(booking)}
                            className="px-4 py-2 border border-[#c6c6cd] bg-white hover:bg-[#eff4ff] text-[#0b1c30] rounded-lg text-xs font-semibold transition-colors"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => setCancelingBookingId(booking.id)}
                            className="px-4 py-2 border border-[#ffdad6] bg-white hover:bg-[#ffdad6]/30 text-[#ba1a1a] rounded-lg text-xs font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Verification Status Section (matching Screen 4) */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
                  Verification Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Driver's License */}
                  <div className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0b1c30]">Driver's License</h4>
                        <p className="text-xs text-[#76777d]">Uploaded Oct 10</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#0c9488] bg-[#0c9488]/10 px-2.5 py-1 rounded-full border border-[#0c9488]/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Card 2: Payment Method */}
                  <div className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#0051d5] flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0b1c30]">Payment Method</h4>
                        <p className="text-xs text-[#76777d]">Ending in 4242</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#0c9488] bg-[#0c9488]/10 px-2.5 py-1 rounded-full border border-[#0c9488]/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAST BOOKINGS */}
          {activeTab === 'past' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Past Rentals</h2>
              {pastBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#c6c6cd]/50 text-center text-sm text-[#45464d]">
                  No past rental history found.
                </div>
              ) : (
                pastBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white p-5 rounded-2xl border border-[#c6c6cd]/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={b.vehicle.imageUrl}
                        alt={b.vehicle.name}
                        className="w-16 h-12 object-cover rounded-lg bg-[#eff4ff]"
                      />
                      <div>
                        <h4 className="font-bold text-base text-[#0b1c30]">{b.vehicle.name}</h4>
                        <p className="text-xs text-[#76777d]">
                          {b.pickupDate} — {b.dropoffDate} • {b.days} Days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#0b1c30]">{formatCurrency(b.totalDue, { decimals: 2 })}</span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#45464d]">
                        {b.status}
                      </span>
                      <button
                        onClick={() => alert(`Receipt downloaded for ${b.pickupCode}`)}
                        className="p-2 rounded-lg border border-[#c6c6cd]/60 hover:bg-[#eff4ff] text-[#0051d5]"
                        title="Download Invoice Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: USER PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Driver Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    defaultValue="Ganesh J."
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="ganeshj.bca_iom@bkc.met.edu"
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (415) 555-0199"
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Preferred Pickup Hub</label>
                  <input
                    type="text"
                    defaultValue="San Francisco International Airport (SFO)"
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30]"
                  />
                </div>
              </div>
              <button
                onClick={() => alert('Profile updated successfully!')}
                className="px-6 py-2.5 bg-[#0051d5] text-white text-xs font-semibold rounded-xl hover:bg-[#003ea8] transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Identity & KYC Documents</h2>
                <button
                  onClick={() => alert('Document upload portal opened')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0051d5] text-white text-xs font-semibold rounded-xl hover:bg-[#003ea8]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New Document</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-[#c6c6cd]/50 bg-[#f8f9ff] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#0051d5]" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0b1c30]">California Driver's License</h4>
                      <p className="text-xs text-[#76777d]">ID: CA-D8829104 • Expires 2029</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#0c9488] bg-[#0c9488]/10 px-2.5 py-1 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-[#c6c6cd]/50 bg-[#f8f9ff] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#0051d5]" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0b1c30]">Visa Corporate Preferred</h4>
                      <p className="text-xs text-[#76777d]">Card ending 4242 • Exp 10/28</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#0c9488] bg-[#0c9488]/10 px-2.5 py-1 rounded-full">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c6c6cd]/50 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-[#0b1c30]">Cancel Reservation?</h3>
            <p className="text-xs text-center text-[#45464d]">
              Are you sure you want to cancel this reservation? Full refunds are granted automatically up to 24 hours before pickup.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelingBookingId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-[#c6c6cd] text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff]"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  onCancelBooking(cancelingBookingId);
                  setCancelingBookingId(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-xs font-semibold text-white shadow-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
