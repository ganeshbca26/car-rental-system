import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  Trash2, 
  Car, 
  Fuel, 
  Gauge, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Star, 
  Share2, 
  Tag
} from 'lucide-react';
import { CarRecord } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface AdminViewModalProps {
  car: CarRecord;
  onClose: () => void;
  onEdit: (car: CarRecord) => void;
  onDelete: (car: CarRecord) => void;
}

export const AdminViewModal: React.FC<AdminViewModalProps> = ({
  car,
  onClose,
  onEdit,
  onDelete,
}) => {
  const images = car.images && car.images.length > 0 ? car.images : [car.imageUrl];
  const [activeImage, setActiveImage] = useState(images[0]);

  const getStatusBadge = (status: CarRecord['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available for Booking
          </span>
        );
      case 'Rented':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Currently Rented
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Under Maintenance
          </span>
        );
      case 'Unavailable':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span> Offline / Reserved
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-300">Vehicle Registry:</span>
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded-sm text-blue-400 font-bold">
              {car.registrationNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(car);
              }}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(car);
              }}
              className="flex items-center gap-1 bg-rose-600/80 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Photo & Thumbnail Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={activeImage}
                alt={car.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">{getStatusBadge(car.status)}</div>
              <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                {car.category} • {car.fuelType}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-[#0051d5] ring-2 ring-blue-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Pricing Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                  {car.brand}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{car.year} Model</span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1 font-serif">{car.name}</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {car.location || 'San Francisco International Airport (SFO)'}
              </p>
            </div>

            <div className="sm:text-right bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div className="text-2xl font-extrabold text-[#0051d5]">
                {formatCurrency(car.rentalPricePerDay)}
                <span className="text-xs font-normal text-slate-500"> / day</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Valuation MSRP: <strong className="text-slate-800">{formatCurrency(car.price)}</strong>
              </div>
              {car.discount > 0 && (
                <div className="mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  {car.discount}% Special Promo Applied
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Fleet Specifications & Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Registration</span>
                <span className="font-mono text-xs font-bold text-slate-900">{car.registrationNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">VIN Number</span>
                <span className="font-mono text-xs font-bold text-slate-900 truncate block" title={car.vin}>
                  {car.vin}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Odometer</span>
                <span className="text-xs font-bold text-slate-900">{car.mileage.toLocaleString()} miles</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Exterior Color</span>
                <span className="text-xs font-bold text-slate-900">{car.color}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Transmission</span>
                <span className="text-xs font-bold text-slate-900">{car.transmission}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Fuel / Powertrain</span>
                <span className="text-xs font-bold text-slate-900">{car.fuelType}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Seating</span>
                <span className="text-xs font-bold text-slate-900">{car.seatingCapacity} Passengers</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Efficiency</span>
                <span className="text-xs font-bold text-slate-900">{car.mpgOrRange || '24 MPG'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {car.description && (
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Vehicle Description</h2>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {car.description}
              </p>
            </div>
          )}

          {/* Performance specs if available */}
          {car.specs && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Engineering Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {car.specs.engine && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">Engine / Motor:</span>
                    <span className="font-semibold text-slate-900">{car.specs.engine}</span>
                  </div>
                )}
                {car.specs.acceleration && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">0-60 mph Acceleration:</span>
                    <span className="font-semibold text-slate-900">{car.specs.acceleration}</span>
                  </div>
                )}
                {car.specs.topSpeed && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">Top Speed:</span>
                    <span className="font-semibold text-slate-900">{car.specs.topSpeed}</span>
                  </div>
                )}
                {car.specs.drivetrain && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500">Drivetrain:</span>
                    <span className="font-semibold text-slate-900">{car.specs.drivetrain}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Registered on {new Date(car.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
