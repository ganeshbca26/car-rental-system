import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Car, ShieldAlert, Check } from 'lucide-react';
import { CarRecord } from '../../types';

interface AdminDeleteModalProps {
  car: CarRecord;
  onClose: () => void;
  onConfirmDelete: (carId: string) => Promise<boolean>;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  car,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const success = await onConfirmDelete(car.id);
      if (!success) {
        setErrorMessage('Failed to delete vehicle. Please try again.');
        setIsDeleting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while deleting.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={!isDeleting ? onClose : undefined} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Top Warning Strip */}
        <div className="bg-rose-50 p-6 border-b border-rose-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-950">Delete Vehicle Record</h2>
            <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">
              Are you sure you want to delete this car? This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-700 ml-auto p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Car Details Summary Card */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
            <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
              <img
                src={car.imageUrl}
                alt={car.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-slate-900 truncate">{car.name}</h3>
              <p className="text-[11px] text-slate-500">{car.brand} • {car.category} ({car.year})</p>
              <div className="mt-1 flex items-center gap-2 font-mono text-[10px]">
                <span className="bg-slate-200 px-1.5 py-0.5 rounded-sm text-slate-800 font-bold">
                  {car.registrationNumber}
                </span>
                <span className="text-slate-400 truncate max-w-[100px]">VIN: {car.vin}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              Impact on System Operations:
            </div>
            <ul className="list-disc pl-4 text-[11px] text-amber-800 space-y-1">
              <li>Permanently removes vehicle from customer rental catalog.</li>
              <li>Removes vehicle telematics & maintenance records.</li>
              <li>Cancels any pending vehicle preparation tasks.</li>
            </ul>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-100 text-rose-800 text-xs font-semibold">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-delete-car-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <span className="animate-spin mr-1">◌</span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>{isDeleting ? 'Deleting...' : 'Delete Car'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
