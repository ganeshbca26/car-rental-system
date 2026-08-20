import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Car, 
  DollarSign, 
  Gauge, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';
import { CarRecord } from '../../types';
import { SAMPLE_CAR_PRESET_IMAGES } from '../../data/adminMockData';

interface AdminEditModalProps {
  car: CarRecord;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CarRecord>) => Promise<boolean>;
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({
  car,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(car.name);
  const [brand, setBrand] = useState(car.brand);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState<number>(car.year);
  const [registrationNumber, setRegistrationNumber] = useState(car.registrationNumber);
  const [vin, setVin] = useState(car.vin);

  const [category, setCategory] = useState<CarRecord['category']>(car.category);
  const [fuelType, setFuelType] = useState<CarRecord['fuelType']>(car.fuelType);
  const [transmission, setTransmission] = useState<CarRecord['transmission']>(car.transmission);
  const [seatingCapacity, setSeatingCapacity] = useState<number>(car.seatingCapacity);
  const [color, setColor] = useState(car.color);
  const [mileage, setMileage] = useState<number>(car.mileage);
  const [status, setStatus] = useState<CarRecord['status']>(car.status);
  const [location, setLocation] = useState(car.location || 'San Francisco International Airport (SFO)');
  const [description, setDescription] = useState(car.description || '');

  const [price, setPrice] = useState<number>(car.price);
  const [rentalPricePerDay, setRentalPricePerDay] = useState<number>(car.rentalPricePerDay);
  const [discount, setDiscount] = useState<number>(car.discount || 0);

  const [images, setImages] = useState<string[]>(car.images?.length > 0 ? car.images : [car.imageUrl]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (customImageUrl.trim() && !images.includes(customImageUrl.trim())) {
      setImages([...images, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim() || !model.trim() || !registrationNumber.trim() || !vin.trim()) {
      setErrorMessage('Please fill in all required basic information fields.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const updates: Partial<CarRecord> = {
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      registrationNumber: registrationNumber.trim().toUpperCase(),
      vin: vin.trim().toUpperCase(),
      category,
      fuelType,
      transmission,
      seatingCapacity: Number(seatingCapacity),
      color: color.trim(),
      mileage: Number(mileage),
      price: Number(price),
      rentalPricePerDay: Number(rentalPricePerDay),
      discount: Number(discount),
      status,
      location,
      description: description.trim(),
      images: images.length > 0 ? images : [car.imageUrl],
      imageUrl: images[0] || car.imageUrl,
    };

    const success = await onSave(car.id, updates);
    setIsSaving(false);
    if (!success) {
      setErrorMessage('Failed to update car record.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="fixed inset-0" onClick={!isSaving ? onClose : undefined} />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full my-8 z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Vehicle: {car.name}</h2>
              <p className="text-xs text-slate-400 font-mono">Reg: {car.registrationNumber} • ID: {car.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0051d5]" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Registration</label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 font-mono border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">VIN Number</label>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-50 font-mono border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Specs & Status */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#0051d5]" /> Technical Specifications & Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CarRecord['category'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Electric">Electric</option>
                  <option value="Sports">Sports</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as CarRecord['fuelType'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                >
                  <option value="Gas">Gas</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as CarRecord['transmission'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CarRecord['status'])}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seats</label>
                <input
                  type="number"
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mileage (mi)</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#0051d5]" /> Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">MSRP (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rental Rate (₹/day)</label>
                <input
                  type="number"
                  value={rentalPricePerDay}
                  onChange={(e) => setRentalPricePerDay(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#0051d5]" /> Media Gallery ({images.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-xs text-[#0051d5] font-semibold hover:underline"
              >
                {showPresets ? 'Hide presets' : 'Pick preset photos'}
              </button>
            </div>

            {showPresets && (
              <div className="grid grid-cols-5 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                {SAMPLE_CAR_PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!images.includes(preset.url)) setImages([...images, preset.url]);
                    }}
                    className="h-16 rounded-lg overflow-hidden border border-slate-300 hover:border-blue-600"
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste Image URL..."
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#0051d5] text-white rounded-xl text-xs font-bold"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative h-20 rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Vehicle" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[#0051d5] hover:bg-[#0042b0] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
          >
            {isSaving ? <span className="animate-spin">◌</span> : <CheckCircle2 className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
