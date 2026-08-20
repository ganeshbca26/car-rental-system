import React, { useState } from 'react';
import { Vehicle, Booking, SearchState } from '../types';
import { formatCurrency } from '../utils/currency';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  User, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Car,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface CheckoutModalProps {
  vehicle: Vehicle;
  searchState: SearchState;
  rentalDays: number;
  initialPlan: 'basic' | 'standard' | 'premium';
  onClose: () => void;
  onBookingConfirmed: (newBooking: Booking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  vehicle,
  searchState,
  rentalDays,
  initialPlan = 'standard',
  onClose,
  onBookingConfirmed
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [protectionPlan, setProtectionPlan] = useState<'basic' | 'standard' | 'premium'>(initialPlan);

  // Form Fields
  const [name, setName] = useState('Ganesh J.');
  const [email, setEmail] = useState('ganeshj.bca_iom@bkc.met.edu');
  const [phone, setPhone] = useState('+1 (415) 555-0199');
  const [licenseNumber, setLicenseNumber] = useState('CA-D8829104');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('10/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [isProcessing, setIsProcessing] = useState(false);

  // Price calculations
  const rentalRateSubtotal = vehicle.pricePerDay * rentalDays;
  const taxesAndFees = Math.round(rentalRateSubtotal * 0.1125 * 100) / 100;
  const protectionFeePerDay = protectionPlan === 'basic' ? 0 : protectionPlan === 'standard' ? 15 : 28;
  const protectionTotal = protectionFeePerDay * rentalDays;
  const totalDue = rentalRateSubtotal + taxesAndFees + protectionTotal;

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Generate unique pickup code like RM-8472
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const code = `RM-${randomDigits}`;

      const newBooking: Booking = {
        id: `bk-${code.toLowerCase()}`,
        pickupCode: code,
        vehicleId: vehicle.id,
        vehicle: vehicle,
        pickupLocation: searchState.pickupLocation || 'San Francisco International Airport (SFO)',
        dropoffLocation: searchState.returnLocation || searchState.pickupLocation || 'San Francisco International Airport (SFO)',
        pickupDate: searchState.pickupDate || '2026-10-24',
        pickupTime: '10:00 AM',
        dropoffDate: searchState.returnDate || '2026-10-27',
        dropoffTime: '2:00 PM',
        days: rentalDays,
        dailyRate: vehicle.pricePerDay,
        rentalRateTotal: rentalRateSubtotal,
        taxesAndFees: taxesAndFees,
        protectionPlan: protectionPlan,
        protectionFee: protectionTotal,
        totalDue: totalDue,
        status: 'Confirmed',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        driverLicenseNumber: licenseNumber,
        paymentMethodLast4: cardNumber.slice(-4) || '4242',
        createdAt: new Date().toISOString()
      };

      setIsProcessing(false);
      onBookingConfirmed(newBooking);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#c6c6cd]/50 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#0b1c30] text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center text-white">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight">Complete Reservation</h2>
              <p className="text-xs text-[#bec6e0]">{vehicle.name} • {rentalDays} Days Rental</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bec6e0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress indicator */}
        <div className="grid grid-cols-3 border-b border-[#eff4ff] bg-[#f8f9ff] text-xs font-semibold">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-2 text-center border-b-2 transition-colors ${
              step === 1
                ? 'border-[#0051d5] text-[#0051d5] bg-white'
                : 'border-transparent text-[#76777d]'
            }`}
          >
            1. Driver Information
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-3 px-2 text-center border-b-2 transition-colors ${
              step === 2
                ? 'border-[#0051d5] text-[#0051d5] bg-white'
                : 'border-transparent text-[#76777d]'
            }`}
          >
            2. Protection Coverage
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-3 px-2 text-center border-b-2 transition-colors ${
              step === 3
                ? 'border-[#0051d5] text-[#0051d5] bg-white'
                : 'border-transparent text-[#76777d]'
            }`}
          >
            3. Payment & Finalize
          </button>
        </div>

        <form onSubmit={handleConfirmReservation} className="p-6 space-y-6">
          {/* STEP 1: Driver Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0b1c30] mb-2">
                <User className="w-4 h-4 text-[#0051d5]" />
                <span>Primary Driver & KYC Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Driver's License Number</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                  />
                </div>
              </div>

              <div className="bg-[#eff4ff] p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-[#45464d]">
                <FileCheck className="w-4 h-4 text-[#0051d5] shrink-0 mt-0.5" />
                <span>
                  Your driver's license profile on RIDEMATE is linked. You will receive an instant digital lockbox unlock code upon confirmation.
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-[#0051d5] text-white font-semibold text-sm rounded-xl hover:bg-[#003ea8] transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Protection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Protection Plan */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0b1c30] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#0051d5]" />
                <span>Select Your Protection Plan</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Basic */}
                <div
                  onClick={() => setProtectionPlan('basic')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    protectionPlan === 'basic'
                      ? 'border-[#0051d5] bg-[#eff4ff]/60 shadow-sm'
                      : 'border-[#c6c6cd]/50 bg-white hover:border-[#c6c6cd]'
                  }`}
                >
                  <h4 className="font-bold text-sm text-[#0b1c30]">Basic</h4>
                  <p className="text-xs text-[#76777d] mt-0.5">State Minimum</p>
                  <div className="mt-3 font-bold text-sm text-[#0b1c30]">{formatCurrency(0)} <span className="text-[11px] font-normal text-[#76777d]">/day</span></div>
                  <p className="text-[11px] text-[#45464d] mt-2">Personal auto insurance deductible applies.</p>
                </div>

                {/* Standard */}
                <div
                  onClick={() => setProtectionPlan('standard')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    protectionPlan === 'standard'
                      ? 'border-[#0051d5] bg-[#eff4ff]/60 shadow-sm'
                      : 'border-[#c6c6cd]/50 bg-white hover:border-[#c6c6cd]'
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-[#0051d5] text-white text-[10px] font-bold rounded-full">
                    Recommended
                  </span>
                  <h4 className="font-bold text-sm text-[#0b1c30]">Standard</h4>
                  <p className="text-xs text-[#76777d] mt-0.5">Collision & Windshield</p>
                  <div className="mt-3 font-bold text-sm text-[#0b1c30]">{formatCurrency(15)} <span className="text-[11px] font-normal text-[#76777d]">/day</span></div>
                  <p className="text-[11px] text-[#45464d] mt-2">Damage liability waiver applied.</p>
                </div>

                {/* Premium */}
                <div
                  onClick={() => setProtectionPlan('premium')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    protectionPlan === 'premium'
                      ? 'border-[#0051d5] bg-[#eff4ff]/60 shadow-sm'
                      : 'border-[#c6c6cd]/50 bg-white hover:border-[#c6c6cd]'
                  }`}
                >
                  <h4 className="font-bold text-sm text-[#0b1c30]">Premium Zero</h4>
                  <p className="text-xs text-[#76777d] mt-0.5">Full Peace of Mind</p>
                  <div className="mt-3 font-bold text-sm text-[#0b1c30]">{formatCurrency(28)} <span className="text-[11px] font-normal text-[#76777d]">/day</span></div>
                  <p className="text-[11px] text-[#45464d] mt-2">Zero deductible + 24/7 roadside tow.</p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-semibold text-[#45464d] hover:text-[#0b1c30]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#0051d5] text-white font-semibold text-sm rounded-xl hover:bg-[#003ea8] transition-colors flex items-center gap-1.5"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Summary Confirmation */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0b1c30] mb-2">
                <CreditCard className="w-4 h-4 text-[#0051d5]" />
                <span>Payment Method</span>
              </div>

              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#c6c6cd]/50 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#45464d] block mb-1">Card Number</label>
                  <div className="flex items-center bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 focus-within:border-[#0051d5]">
                    <CreditCard className="w-4 h-4 text-[#76777d] mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full border-none p-0 focus:outline-none text-sm text-[#0b1c30]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#45464d] block mb-1">Expires</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#45464d] block mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full bg-white border border-[#c6c6cd] rounded-xl px-3 py-2 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Breakdown Box */}
              <div className="bg-white p-4 rounded-xl border border-[#eff4ff] shadow-xs space-y-2 text-xs text-[#45464d]">
                <div className="flex justify-between">
                  <span>{vehicle.name} ({rentalDays} days @ {formatCurrency(vehicle.pricePerDay)}/day)</span>
                  <span className="font-semibold text-[#0b1c30]">{formatCurrency(rentalRateSubtotal, { decimals: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes & Concession Fees</span>
                  <span className="font-semibold text-[#0b1c30]">{formatCurrency(taxesAndFees, { decimals: 2 })}</span>
                </div>
                {protectionTotal > 0 && (
                  <div className="flex justify-between">
                    <span>{protectionPlan === 'standard' ? 'Standard Protection' : 'Premium Zero Protection'}</span>
                    <span className="font-semibold text-[#0b1c30]">{formatCurrency(protectionTotal, { decimals: 2 })}</span>
                  </div>
                )}
                <div className="border-t border-[#eff4ff] pt-2 flex justify-between items-baseline text-sm font-bold text-[#0b1c30]">
                  <span>Total Amount Due</span>
                  <span className="text-xl text-[#0051d5]">{formatCurrency(totalDue, { decimals: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm font-semibold text-[#45464d] hover:text-[#0b1c30]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3 bg-[#0051d5] hover:bg-[#003ea8] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Confirming Reservation...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm & Book Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
