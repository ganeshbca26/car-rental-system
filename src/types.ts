export type ScreenType = 'home' | 'search' | 'details' | 'bookings' | 'ops' | 'admin';
export type AdminTab = 'dashboard' | 'cars' | 'add-car' | 'records' | 'settings';

export interface CarRecord {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  vin: string;
  category: 'Sedan' | 'SUV' | 'Luxury' | 'Electric' | 'Coupe' | 'Sports' | 'Convertible' | 'Truck';
  fuelType: 'Gas' | 'Hybrid' | 'Electric' | 'Diesel';
  transmission: 'Automatic' | 'Manual';
  seatingCapacity: number;
  color: string;
  mileage: number; // in miles
  price: number; // MSRP / Vehicle value in USD
  rentalPricePerDay: number; // Rental rate in USD/day
  discount: number; // Percentage discount 0-100
  status: 'Available' | 'Rented' | 'Maintenance' | 'Unavailable';
  images: string[];
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  luggageBags?: number;
  mpgOrRange?: string;
  rating?: number;
  reviewsCount?: number;
  specs?: {
    engine?: string;
    acceleration?: string;
    topSpeed?: string;
    drivetrain?: string;
    climate?: string;
  };
}

export interface AdminActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'maintenance';
  title: string;
  details: string;
  carId?: string;
  carName?: string;
  user: string;
  timestamp: string;
}

export interface AdminStats {
  totalCars: number;
  availableCars: number;
  rentedCars: number;
  unavailableCars: number;
  maintenanceCars: number;
  averageRentalRate: number;
  totalFleetValuation: number;
  utilizationRate: number;
}

export interface Vehicle {
  id: string;
  name: string;
  year: number;
  make: string;
  model: string;
  category: string; // e.g. "Luxury SUV", "Executive Sedan", "Compact EV", "Family SUV"
  type: 'Sedan' | 'SUV' | 'Luxury' | 'Electric';
  pricePerDay: number;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  luggageBags: number;
  fuelType: 'Gas' | 'Hybrid' | 'Electric';
  mpgOrRange: string; // e.g. "24 MPG", "32 MPG", "250mi Range", "300mi Range"
  available: boolean;
  featured?: boolean;
  tag?: string; // e.g. "Available", "EV", "Premium Selection"
  imageUrl: string;
  galleryImages: {
    hero: string;
    interior: string;
    wheel: string;
    trunk: string;
  };
  rating: number;
  reviewsCount: number;
  description: string;
  specs: {
    engine?: string;
    acceleration?: string;
    topSpeed?: string;
    drivetrain?: string;
    climate?: string;
  };
  location: string;
}

export interface SearchState {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}

export interface FilterState {
  vehicleTypes: string[];
  maxPrice: number;
  capacities: number[];
  transmissions: string[];
}

export interface Booking {
  id: string;
  pickupCode: string;
  vehicleId: string;
  vehicle: Vehicle;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  days: number;
  dailyRate: number;
  rentalRateTotal: number;
  taxesAndFees: number;
  protectionPlan: 'basic' | 'standard' | 'premium';
  protectionFee: number;
  totalDue: number;
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  driverLicenseNumber: string;
  paymentMethodLast4: string;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  type: 'id_verification' | 'handover' | 'license_update' | 'maintenance';
  title: string;
  userOrVehicle: string;
  timeOrLocation: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface FleetVehicle {
  id: string;
  code: string;
  name: string;
  plate: string;
  category: string;
  status: 'Rented' | 'Available' | 'Maintenance';
  fuelBattery: number; // percentage 0-100
  mileage: number;
  location: string;
  currentCustomer?: string;
  nextService: string;
}
