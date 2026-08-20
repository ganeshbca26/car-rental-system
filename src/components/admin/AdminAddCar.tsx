import React, { useState, useEffect, useId } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  Car, 
  DollarSign, 
  Tag, 
  Fuel, 
  Gauge, 
  Users, 
  Calendar, 
  FileText,
  Star,
  Info,
  Layers,
  MapPin,
  Eye,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { CarRecord, AdminTab } from '../../types';
import { SAMPLE_CAR_PRESET_IMAGES } from '../../data/adminMockData';
import { formatCurrency } from '../../utils/currency';

interface AdminAddCarProps {
  onSaveCar: (carData: Partial<CarRecord>, addAnother: boolean) => Promise<boolean>;
  onCancel: () => void;
  onSelectTab: (tab: AdminTab) => void;
}

interface FormErrors {
  name?: string;
  brand?: string;
  model?: string;
  year?: string;
  registrationNumber?: string;
  vin?: string;
  category?: string;
  rentalPricePerDay?: string;
  price?: string;
  mileage?: string;
  seatingCapacity?: string;
  images?: string;
}

// Preset vehicle templates for quick 1-click loading
const QUICK_TEMPLATES = [
  {
    label: 'BMW M4 Competition',
    brand: 'BMW',
    model: 'M4 Competition Coupe',
    year: 2024,
    category: 'Sports' as const,
    fuelType: 'Gas' as const,
    transmission: 'Automatic' as const,
    seatingCapacity: 4,
    color: 'Isle of Man Green',
    price: 86500,
    rentalPricePerDay: 240,
    discount: 10,
    mileage: 3200,
    location: 'San Francisco International Airport (SFO)',
    registrationNumber: 'CA-8M4COMP',
    vin: 'WBA43AZ08PFP98124',
    description: 'High-performance luxury sports coupe with 503 HP twin-turbo inline-6, M xDrive AWD, and carbon fiber interior package.',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    label: 'Porsche 911 GT3 RS',
    brand: 'Porsche',
    model: '911 GT3 RS',
    year: 2024,
    category: 'Sports' as const,
    fuelType: 'Gas' as const,
    transmission: 'Automatic' as const,
    seatingCapacity: 2,
    color: 'Guards Red',
    price: 241300,
    rentalPricePerDay: 580,
    discount: 0,
    mileage: 1400,
    location: 'Silicon Valley Hub / SJC',
    registrationNumber: 'CA-911GT3R',
    vin: 'WP0AB2A92PS192847',
    description: 'Track-ready supercar with naturally aspirated 4.0L flat-six producing 518 hp, DRS active aerodynamics, and PDK transmission.',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    label: 'Tesla Model S Plaid',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    category: 'Electric' as const,
    fuelType: 'Electric' as const,
    transmission: 'Automatic' as const,
    seatingCapacity: 5,
    color: 'Solid Black',
    price: 89990,
    rentalPricePerDay: 195,
    discount: 5,
    mileage: 4800,
    location: 'Downtown Hub',
    registrationNumber: 'CA-EVPLAID',
    vin: '5YJSA1E67PF993821',
    description: 'Tri-motor all-wheel drive flagship EV with 1,020 hp, 0-60 mph in 1.99s, and 396 miles of estimated range.',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    label: 'Mercedes-Benz G 63 AMG',
    brand: 'Mercedes-Benz',
    model: 'AMG G 63 4MATIC',
    year: 2024,
    category: 'Luxury' as const,
    fuelType: 'Gas' as const,
    transmission: 'Automatic' as const,
    seatingCapacity: 5,
    color: 'Obsidian Black Metallic',
    price: 183000,
    rentalPricePerDay: 420,
    discount: 0,
    mileage: 6200,
    location: 'San Francisco International Airport (SFO)',
    registrationNumber: 'CA-G63LUXE',
    vin: 'W1N4632761X991823',
    description: 'Iconic luxury SUV featuring handcrafted AMG 4.0L V8 Biturbo, three differential locks, and Burmester surround sound.',
    images: [
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop'
    ]
  }
];

export const AdminAddCar: React.FC<AdminAddCarProps> = ({
  onSaveCar,
  onCancel,
  onSelectTab,
}) => {
  // Form State
  const [name, setName] = useState('BMW M4 Competition Coupe');
  const [brand, setBrand] = useState('BMW');
  const [model, setModel] = useState('M4 Competition Coupe');
  const [year, setYear] = useState<number>(2024);
  const [registrationNumber, setRegistrationNumber] = useState('CA-9XYZ88');
  const [vin, setVin] = useState('WBA43AZ08PFP98124');

  const [category, setCategory] = useState<CarRecord['category']>('Luxury');
  const [fuelType, setFuelType] = useState<CarRecord['fuelType']>('Gas');
  const [transmission, setTransmission] = useState<CarRecord['transmission']>('Automatic');
  const [seatingCapacity, setSeatingCapacity] = useState<number>(5);
  const [color, setColor] = useState('Isle of Man Green');
  const [mileage, setMileage] = useState<number>(4200);
  const [location, setLocation] = useState('San Francisco International Airport (SFO)');
  const [description, setDescription] = useState('Premium luxury vehicle configured with high-performance drivetrain, driver-assist technology, and leather cabin.');

  // Pricing
  const [price, setPrice] = useState<number>(85000);
  const [rentalPricePerDay, setRentalPricePerDay] = useState<number>(195);
  const [discount, setDiscount] = useState<number>(0);
  const [status, setStatus] = useState<CarRecord['status']>('Available');

  // Media & Upload State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop'
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'card' | 'specs'>('card');

  // Touched and Errors State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Auto-compose display name if model and brand change
  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    if (!name || name.includes(brand)) {
      setName(`${newBrand} ${model || ''}`.trim());
    }
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (!name || name.startsWith(brand)) {
      setName(`${brand} ${newModel}`.trim());
    }
  };

  // Field validation engine
  const validateField = (field: string, val?: any): string | undefined => {
    const currentYear = new Date().getFullYear();

    switch (field) {
      case 'brand': {
        const v = val !== undefined ? val : brand;
        if (!v || !v.trim()) return 'Manufacturer / Brand is required.';
        return undefined;
      }
      case 'model': {
        const v = val !== undefined ? val : model;
        if (!v || !v.trim()) return 'Model name is required.';
        if (v.trim().length < 2) return 'Model name must be at least 2 characters.';
        return undefined;
      }
      case 'name': {
        const v = val !== undefined ? val : name;
        if (!v || !v.trim()) return 'Full car display name is required.';
        return undefined;
      }
      case 'year': {
        const v = val !== undefined ? val : year;
        if (!v || isNaN(v)) return 'Manufacturing year is required.';
        if (v < 1990 || v > currentYear + 2) {
          return `Year must be between 1990 and ${currentYear + 2}.`;
        }
        return undefined;
      }
      case 'registrationNumber': {
        const v = val !== undefined ? val : registrationNumber;
        if (!v || !v.trim()) return 'Registration / License Plate is required.';
        if (v.trim().length < 3) return 'Registration number must be at least 3 characters.';
        return undefined;
      }
      case 'vin': {
        const v = val !== undefined ? val : vin;
        if (!v || !v.trim()) return 'VIN / Chassis number is required.';
        if (v.trim().length < 8) return 'VIN must be at least 8 alphanumeric characters.';
        if (v.trim().length > 17) return 'VIN standard cannot exceed 17 characters.';
        return undefined;
      }
      case 'rentalPricePerDay': {
        const v = val !== undefined ? val : rentalPricePerDay;
        if (v === undefined || isNaN(v) || v <= 0) return 'Daily rental price must be greater than $0.';
        return undefined;
      }
      case 'price': {
        const v = val !== undefined ? val : price;
        if (v === undefined || isNaN(v) || v <= 0) return 'Vehicle valuation / MSRP must be greater than $0.';
        return undefined;
      }
      case 'mileage': {
        const v = val !== undefined ? val : mileage;
        if (v === undefined || isNaN(v) || v < 0) return 'Odometer mileage cannot be negative.';
        return undefined;
      }
      case 'seatingCapacity': {
        const v = val !== undefined ? val : seatingCapacity;
        if (!v || v < 1 || v > 12) return 'Seating capacity must be between 1 and 12.';
        return undefined;
      }
      case 'images': {
        const v = val !== undefined ? val : images;
        if (!v || v.length === 0) return 'At least one vehicle image is required.';
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  // Full form validation
  const validateForm = (): boolean => {
    const fieldsToValidate = [
      'brand',
      'model',
      'name',
      'year',
      'registrationNumber',
      'vin',
      'rentalPricePerDay',
      'price',
      'mileage',
      'seatingCapacity',
      'images',
    ];

    const errs: FormErrors = {};
    const newTouched: Record<string, boolean> = {};

    fieldsToValidate.forEach((field) => {
      newTouched[field] = true;
      const msg = validateField(field);
      if (msg) {
        (errs as any)[field] = msg;
      }
    });

    setTouched(newTouched);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Image Upload Handlers
  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    const cleanUrl = customImageUrl.trim();
    if (!images.includes(cleanUrl)) {
      const updated = [...images, cleanUrl];
      setImages(updated);
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
    setCustomImageUrl('');
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter((file) => file.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      setErrors((prev) => ({ ...prev, images: 'Please select valid image files (PNG, JPG, WebP, AVIF).' }));
      return;
    }

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const resultStr = reader.result;
          setImages((prev) => {
            if (!prev.includes(resultStr)) {
              return [...prev, resultStr];
            }
            return prev;
          });
          setErrors((prev) => ({ ...prev, images: undefined }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    if (updated.length === 0) {
      setErrors((prev) => ({ ...prev, images: 'At least one vehicle image is required.' }));
    }
  };

  const handleSetHeroImage = (indexToHero: number) => {
    const selected = images[indexToHero];
    const rest = images.filter((_, idx) => idx !== indexToHero);
    setImages([selected, ...rest]);
  };

  const handleSelectPresetImage = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  };

  // Load a full template
  const handleApplyTemplate = (tmpl: typeof QUICK_TEMPLATES[0]) => {
    setBrand(tmpl.brand);
    setModel(tmpl.model);
    setName(`${tmpl.brand} ${tmpl.model}`);
    setYear(tmpl.year);
    setCategory(tmpl.category);
    setFuelType(tmpl.fuelType);
    setTransmission(tmpl.transmission);
    setSeatingCapacity(tmpl.seatingCapacity);
    setColor(tmpl.color);
    setPrice(tmpl.price);
    setRentalPricePerDay(tmpl.rentalPricePerDay);
    setDiscount(tmpl.discount);
    setMileage(tmpl.mileage);
    setLocation(tmpl.location);
    setRegistrationNumber(tmpl.registrationNumber);
    setVin(tmpl.vin);
    setDescription(tmpl.description);
    setImages(tmpl.images);
    setErrors({});
    setTouched({});
  };

  // Submit Handler
  const handleSubmit = async (addAnother: boolean = false) => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const carData: Partial<CarRecord> = {
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
      images,
      imageUrl: images[0] || 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop',
      location,
      description: description.trim() || `High-performance ${brand} ${model} engineered for comfort, luxury, and reliability.`,
    };

    const success = await onSaveCar(carData, addAnother);
    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
      if (addAnother) {
        // Reset form to blank template for next entry
        setName('');
        setModel('');
        setRegistrationNumber('');
        setVin('');
        setDescription('');
        setImages(['https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop']);
        setErrors({});
        setTouched({});
        setTimeout(() => setSubmitSuccess(false), 3500);
      }
    }
  };

  const effectiveDailyRate = discount > 0 
    ? Math.round(rentalPricePerDay * (1 - discount / 100)) 
    : rentalPricePerDay;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center font-bold border border-blue-100">
              <Car className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Add New Vehicle to Fleet</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Register automotive records with telemetry specs, license registration, pricing, and high-resolution media.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Preset Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Preset Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetPicker(!showPresetPicker)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0051d5] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showPresetPicker ? 'Close Presets' : 'Quick Presets'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 bg-[#0051d5] hover:bg-[#0042b0] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="animate-spin mr-1">◌</span>
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Save Vehicle</span>
          </button>
        </div>
      </div>

      {/* Quick Templates Drawer */}
      {showPresetPicker && (
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-blue-800 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                1-Click Autofill Automotive Templates
              </span>
            </div>
            <button
              onClick={() => setShowPresetPicker(false)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_TEMPLATES.map((tmpl, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleApplyTemplate(tmpl);
                  setShowPresetPicker(false);
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/10 hover:border-blue-400 rounded-xl p-3.5 cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold text-white mb-1">
                    <span>{tmpl.label}</span>
                    <span className="text-[10px] bg-blue-500/40 text-blue-200 px-1.5 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{tmpl.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">{formatCurrency(tmpl.rentalPricePerDay)}/day</span>
                  <span className="text-[11px] text-blue-300 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Apply <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Vehicle record successfully indexed to fleet database!</p>
              <p className="text-[11px] text-emerald-700">The vehicle is now ready for reservations, dispatch operations, and management.</p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('records')}
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 px-3 py-1 bg-emerald-100/60 rounded-lg"
          >
            View in Car Records →
          </button>
        </div>
      )}

      {/* Main Grid: Form Inputs + Live Preview Sticky Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields (8 Cols) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(false);
          }}
          className="lg:col-span-7 xl:col-span-8 space-y-6"
        >
          {/* SECTION 1: Identity & Credentials */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0051d5]" />
                  1. Identification & Registration
                </h2>
                <p className="text-xs text-slate-500">Core vehicle manufacturer data and VIN verification</p>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">* Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Brand */}
              <div>
                <label htmlFor="add-car-brand" className="block text-xs font-bold text-slate-700 mb-1">
                  Manufacturer / Brand *
                </label>
                <select
                  id="add-car-brand"
                  value={brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  onBlur={() => handleBlur('brand')}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                    touched.brand && errors.brand ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                  } rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all`}
                >
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Genesis">Genesis</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Lucid">Lucid Motors</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="Other">Other / Custom</option>
                </select>
                {touched.brand && errors.brand && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.brand}</span>
                  </p>
                )}
              </div>

              {/* Model */}
              <div>
                <label htmlFor="add-car-model" className="block text-xs font-bold text-slate-700 mb-1">
                  Model Name *
                </label>
                <input
                  id="add-car-model"
                  type="text"
                  placeholder="e.g. M4 Competition Coupe"
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  onBlur={() => handleBlur('model')}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                    touched.model && errors.model ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                  } rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                {touched.model && errors.model && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.model}</span>
                  </p>
                )}
              </div>

              {/* Full Car Display Name */}
              <div className="sm:col-span-2">
                <label htmlFor="add-car-name" className="block text-xs font-bold text-slate-700 mb-1">
                  Full Customer Display Name *
                </label>
                <input
                  id="add-car-name"
                  type="text"
                  placeholder="e.g. BMW M4 Competition Coupe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                    touched.name && errors.name ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                  } rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                {touched.name && errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Year */}
              <div>
                <label htmlFor="add-car-year" className="block text-xs font-bold text-slate-700 mb-1">
                  Manufacturing Year *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="add-car-year"
                    type="number"
                    min={1990}
                    max={new Date().getFullYear() + 2}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    onBlur={() => handleBlur('year')}
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border ${
                      touched.year && errors.year ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                    } rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all`}
                  />
                </div>
                {touched.year && errors.year && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.year}</span>
                  </p>
                )}
              </div>

              {/* Registration Number */}
              <div>
                <label htmlFor="add-car-registration" className="block text-xs font-bold text-slate-700 mb-1">
                  Registration / License Plate *
                </label>
                <input
                  id="add-car-registration"
                  type="text"
                  placeholder="e.g. CA-8KX9201"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('registrationNumber')}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 uppercase font-mono font-bold tracking-wider border ${
                    touched.registrationNumber && errors.registrationNumber
                      ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200'
                      : 'border-slate-200'
                  } rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all`}
                />
                {touched.registrationNumber && errors.registrationNumber && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.registrationNumber}</span>
                  </p>
                )}
              </div>

              {/* VIN / Chassis Number */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="add-car-vin" className="text-xs font-bold text-slate-700">
                    VIN / Chassis Identification Number *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">17-character standard</span>
                </div>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="add-car-vin"
                    type="text"
                    placeholder="e.g. WBA43AZ08PFP98124"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    onBlur={() => handleBlur('vin')}
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 uppercase font-mono font-bold tracking-wider border ${
                      touched.vin && errors.vin
                        ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200'
                        : 'border-slate-200'
                    } rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all`}
                  />
                </div>
                {touched.vin && errors.vin && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.vin}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Technical Specifications & Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#0051d5]" />
                  2. Vehicle Specs & Fleet Depot
                </h2>
                <p className="text-xs text-slate-500">Category, transmission, powertrain, seating, and location</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {/* Category / Type */}
              <div>
                <label htmlFor="add-car-category" className="block text-xs font-bold text-slate-700 mb-1">
                  Category / Body Style *
                </label>
                <select
                  id="add-car-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CarRecord['category'])}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Electric">Electric EV</option>
                  <option value="Sports">Sports Performance</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Truck">Truck / Pickup</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="add-car-fuel" className="block text-xs font-bold text-slate-700 mb-1">
                  Powertrain / Fuel *
                </label>
                <select
                  id="add-car-fuel"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as CarRecord['fuelType'])}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Gas">Gasoline</option>
                  <option value="Hybrid">Hybrid (HEV / PHEV)</option>
                  <option value="Electric">100% Electric (EV)</option>
                  <option value="Diesel">Clean Diesel</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label htmlFor="add-car-transmission" className="block text-xs font-bold text-slate-700 mb-1">
                  Transmission *
                </label>
                <select
                  id="add-car-transmission"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as CarRecord['transmission'])}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Automatic">Automatic (Dual-Clutch / Steptronic)</option>
                  <option value="Manual">Manual (6-Speed / 7-Speed)</option>
                </select>
              </div>

              {/* Seating Capacity */}
              <div>
                <label htmlFor="add-car-seats" className="block text-xs font-bold text-slate-700 mb-1">
                  Seating Capacity *
                </label>
                <select
                  id="add-car-seats"
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                  onBlur={() => handleBlur('seatingCapacity')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                >
                  <option value={2}>2 Passengers (Roadster / Supercar)</option>
                  <option value={4}>4 Passengers (Coupe / GT)</option>
                  <option value={5}>5 Passengers (Sedan / Crossover)</option>
                  <option value={7}>7 Passengers (3-Row Family SUV)</option>
                  <option value={8}>8 Passengers (Passenger Van)</option>
                </select>
              </div>

              {/* Exterior Color */}
              <div>
                <label htmlFor="add-car-color" className="block text-xs font-bold text-slate-700 mb-1">
                  Exterior Color Finish *
                </label>
                <input
                  id="add-car-color"
                  type="text"
                  placeholder="e.g. Isle of Man Green Metallic"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Odometer Mileage */}
              <div>
                <label htmlFor="add-car-mileage" className="block text-xs font-bold text-slate-700 mb-1">
                  Current Mileage (miles) *
                </label>
                <div className="relative">
                  <Gauge className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="add-car-mileage"
                    type="number"
                    min={0}
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    onBlur={() => handleBlur('mileage')}
                    className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border ${
                      touched.mileage && errors.mileage ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                    } rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
                  />
                </div>
                {touched.mileage && errors.mileage && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.mileage}</span>
                  </p>
                )}
              </div>

              {/* Location Depot */}
              <div className="sm:col-span-2">
                <label htmlFor="add-car-location" className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Fleet Depot / Station *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="add-car-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="San Francisco International Airport (SFO)">San Francisco International Airport (SFO)</option>
                    <option value="Silicon Valley Hub / SJC">Silicon Valley Hub / SJC</option>
                    <option value="Oakland International Airport (OAK)">Oakland International Airport (OAK)</option>
                    <option value="Downtown Hub">Downtown Hub</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="add-car-status" className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Operational Status *
                </label>
                <select
                  id="add-car-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CarRecord['status'])}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Available">Available (Ready to Rent)</option>
                  <option value="Rented">Rented (Active Booking)</option>
                  <option value="Maintenance">Maintenance (Service Bay)</option>
                  <option value="Unavailable">Unavailable (Reserved/Decommissioned)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="add-car-description" className="block text-xs font-bold text-slate-700 mb-1">
                Vehicle Overview & Marketing Notes
              </label>
              <textarea
                id="add-car-description"
                rows={2}
                placeholder="Highlight standout performance packages, luxury amenities, safety features, or technology..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* SECTION 3: Pricing & Commercial Valuation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#0051d5]" />
                  3. Pricing & Valuation
                </h2>
                <p className="text-xs text-slate-500">MSRP valuation, daily customer rental price, and promotional discounts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Vehicle MSRP / Valuation */}
              <div>
                <label htmlFor="add-car-price" className="block text-xs font-bold text-slate-700 mb-1">
                  Vehicle MSRP / Asset Value (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">₹</span>
                  <input
                    id="add-car-price"
                    type="number"
                    min={1000}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    onBlur={() => handleBlur('price')}
                    className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border ${
                      touched.price && errors.price ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200' : 'border-slate-200'
                    } rounded-xl text-xs text-slate-900 font-extrabold focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
                  />
                </div>
                {touched.price && errors.price && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.price}</span>
                  </p>
                )}
              </div>

              {/* Daily Rental Price */}
              <div>
                <label htmlFor="add-car-rental-price" className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Rental Price (₹/day) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">₹</span>
                  <input
                    id="add-car-rental-price"
                    type="number"
                    min={1}
                    value={rentalPricePerDay}
                    onChange={(e) => setRentalPricePerDay(Number(e.target.value))}
                    onBlur={() => handleBlur('rentalPricePerDay')}
                    className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border ${
                      touched.rentalPricePerDay && errors.rentalPricePerDay
                        ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-200'
                        : 'border-slate-200'
                    } rounded-xl text-xs text-slate-900 font-extrabold focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100`}
                  />
                </div>
                {touched.rentalPricePerDay && errors.rentalPricePerDay && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.rentalPricePerDay}</span>
                  </p>
                )}
              </div>

              {/* Promotional Discount */}
              <div>
                <label htmlFor="add-car-discount" className="block text-xs font-bold text-slate-700 mb-1">
                  Promotional Discount (%)
                </label>
                <div className="relative">
                  <input
                    id="add-car-discount"
                    type="number"
                    min={0}
                    max={100}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-extrabold focus:bg-white focus:border-[#0051d5] focus:outline-hidden focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">%</span>
                </div>
                {discount > 0 ? (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">
                    Effective rate: {formatCurrency(effectiveDailyRate)}/day ({discount}% off)
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1">Standard rate applies</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: Media Gallery & File Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#0051d5]" />
                  4. Vehicle Media & Multi-Image Gallery
                </h2>
                <p className="text-xs text-slate-500">
                  Upload images, drop files, paste image URLs, or select curated automotive samples
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {images.length} {images.length === 1 ? 'Image' : 'Images'}
              </span>
            </div>

            {/* Drag & Drop Upload Zone + URL Paste Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Upload Dropzone Placeholder */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isDragging
                    ? 'border-[#0051d5] bg-blue-50/70 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-colors ${
                  isDragging ? 'bg-blue-600 text-white' : 'bg-blue-100/70 text-[#0051d5]'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {isDragging ? 'Drop vehicle photos now' : 'Drag & drop vehicle photos here'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG, WebP, AVIF up to 10MB
                </p>
                <label className="mt-3 inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:border-[#0051d5] hover:text-[#0051d5] text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs cursor-pointer transition-colors">
                  <span>Browse From Computer</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Paste Image URL Box */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <label htmlFor="add-car-image-url" className="block text-xs font-bold text-slate-800 mb-1">
                    Add High-Res Image by Web Link
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Paste any public Unsplash or CDN image URL:
                  </p>
                  <div className="flex gap-2">
                    <input
                      id="add-car-image-url"
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#0051d5]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-[#0051d5] hover:bg-[#0042b0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Preset suggestions mini row */}
                <div className="mt-3 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Curated Presets:</span>
                    <span className="text-[10px] text-slate-400">Click to attach</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {SAMPLE_CAR_PRESET_IMAGES.slice(0, 5).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPresetImage(preset.url)}
                        className="h-10 w-14 rounded-lg overflow-hidden border border-slate-300 hover:border-blue-500 shrink-0 relative group"
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message for Images */}
            {touched.images && errors.images && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{errors.images}</span>
              </div>
            )}

            {/* Gallery Grid of Uploaded Images */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Gallery Showcase ({images.length})
                </span>
                <span className="text-[11px] text-slate-500">The first image is the Primary Cover photo</span>
              </div>

              {images.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400">
                  No images uploaded yet. Drop photos above or choose a preset.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                        index === 0
                          ? 'border-[#0051d5] ring-2 ring-blue-200 shadow-md'
                          : 'border-slate-200 hover:border-slate-400'
                      } bg-slate-100 group h-32`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Car preview ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />

                      {/* Primary Cover Tag */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-[#0051d5] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" /> Primary Cover
                        </div>
                      )}

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetHeroImage(index)}
                            title="Set as primary cover photo"
                            className="bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md transition-colors shadow-xs"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          title="Remove image"
                          className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-md transition-colors shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Bottom Action Bar */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Vehicles are instantly indexed and made available in booking feeds.</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Save and Add Another
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-[#0051d5] hover:bg-[#0042b0] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="animate-spin mr-1">◌</span>
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Save Vehicle</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Live Card & Specs Preview (4 Cols Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header with Preview Mode Toggle */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0051d5]" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Customer Preview
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Real-Time
              </span>
            </div>

            {/* Live Vehicle Card Mockup */}
            <div className="p-4">
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image Cover */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt={name || 'Car preview'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Car className="w-10 h-10 mb-1 opacity-50" />
                      <span className="text-xs font-medium">No Image Uploaded</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-xs ${
                      status === 'Available'
                        ? 'bg-emerald-600 text-white'
                        : status === 'Rented'
                        ? 'bg-blue-600 text-white'
                        : status === 'Maintenance'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-md">
                      {category}
                    </span>
                  </div>

                  {/* Discount Tag */}
                  {discount > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-600 text-white rounded-md shadow-xs flex items-center gap-0.5">
                        <Tag className="w-3 h-3" /> {discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>{brand} • {year}</span>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {registrationNumber || 'NO PLATE'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">
                      {name || 'New Vehicle'}
                    </h3>
                  </div>

                  {/* Specs Quick Pills */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-600 pt-1">
                    <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                      <Fuel className="w-3 h-3 text-[#0051d5] mb-0.5" />
                      <span className="font-bold">{fuelType}</span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                      <Gauge className="w-3 h-3 text-[#0051d5] mb-0.5" />
                      <span className="font-bold">{transmission.slice(0, 4)}.</span>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center">
                      <Users className="w-3 h-3 text-[#0051d5] mb-0.5" />
                      <span className="font-bold">{seatingCapacity} Seats</span>
                    </div>
                  </div>

                  {/* Pricing Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Rental Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-slate-900">{formatCurrency(effectiveDailyRate)}</span>
                        <span className="text-xs text-slate-500">/day</span>
                        {discount > 0 && (
                          <span className="text-xs text-slate-400 line-through ml-1">
                            {formatCurrency(rentalPricePerDay)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Asset Valuation</span>
                      <span className="text-xs font-bold text-slate-700">
                        {formatCurrency(price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Telematics Box */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Telemetry Summary
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">VIN Code:</span>
                  <span className="font-mono font-bold text-slate-800">{vin || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Depot Hub:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">{location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Odometer:</span>
                  <span className="font-medium text-slate-800">{mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Color finish:</span>
                  <span className="font-medium text-slate-800">{color}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddCar;
