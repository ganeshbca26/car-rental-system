import { Vehicle, Booking, ActionItem, FleetVehicle } from '../types';

export const HOTLINK_IMAGES = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsIpLriyiiosUnCqbpRskPQpbQKuGX3_Crn-Hfqnlb8O1XAbh-CirngVfY2zEkK2Nk3_fpr6tXje7bLPC_F5J0QWKHgcLJicdY2OOPMZdGn8IGTbXGZ8bcWEMnYkZR5dVaQuoKJBa2zx1gannvqnpuYNmMBgDpHfD0iNnqETIaV5x99HeO7Aj0raaHwOO_LwZzsVELo_Cw3rX7O3nmnqpDr6rB1pZhanT6cF7RHDa5BXQ0-pzMcEv',
  executiveSedan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARCKcYYq_PLRz2tL8dUSHNaAe4KVMAABgFU1VcIRkQFgJx-MJdLhrWnCMF6QSOVFv1ysZsTMcagMOfF1Hk-TuzdD1ov5OOeBhMeqfdBVi4EwQbdzmtgikfwo70XY1f7v0f_7IK7-dnd6rTuKtqG2BTe8bUtcTyW8oDYdYoESYnj01_SEIPL9-2Jtb-7aFHHbQD98W8o_v6K2o--jK391TIxs2lqdpSFcnO2oNKYhXQmfKix30gaNqS',
  familySUV: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVH1Q1JUKZDBtcsOTrBXfj3loU0fh2Y-OW-MIjU-JEh8wiQztf_13jeLDDuqqkMIaFU-xMo39X0aVw7aK8nSnqunF8B0_DZnoFhfgK3HyEKZhPw-Z19j8BL7jzGND-Y5rzK5LrRXaY6FyqlYoq93FLdsqn3G_fVE4cFIvMaXq2i3axKN5VyaxtnVV9DRo-4pDhIcqIAJkixnbEIvVdUXBa_c6LCouQUHuCJVnRYV-c1Mc6lGCcC2Qw',
  compactEV: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTxOeXXgR2l-fBDGI9u77IKcMFfTjZQiiPcoHECPyNVJOBW0M7v70oaORboZBdassv70cvZucmDWx8qodtBw0Lb-CSjmbSs9muQmQOcZyMDOLHTtun8kpCigMYgLxH9wqM6syF8Klut6BqtTQCbgCown5yHJuFvPAOPF8pp3snDruFvqrV7LDduZeaKnrrVYt-XUBp1QBUQFfPuCNMY3Tqoq0FSMhVKcIn_K-ZChD3hKArEXarooL3',
  velarMain: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop',
  velarInterior: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
  velarWheel: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop',
  velarTrunk: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  modelYBooking: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop',
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'range-rover-velar',
    name: 'Range Rover Velar',
    year: 2024,
    make: 'Land Rover',
    model: 'Range Rover Velar P250 Dynamic',
    category: 'Luxury SUV',
    type: 'Luxury',
    pricePerDay: 185,
    transmission: 'Automatic',
    seats: 5,
    luggageBags: 4,
    fuelType: 'Gas',
    mpgOrRange: '24 MPG',
    available: true,
    featured: true,
    tag: 'Premium Selection',
    imageUrl: HOTLINK_IMAGES.velarMain,
    galleryImages: {
      hero: HOTLINK_IMAGES.velarMain,
      interior: HOTLINK_IMAGES.velarInterior,
      wheel: HOTLINK_IMAGES.velarWheel,
      trunk: HOTLINK_IMAGES.velarTrunk
    },
    rating: 4.95,
    reviewsCount: 142,
    description: 'Or similar Premium SUV. Refined capability meets contemporary elegance. Features all-wheel drive, Touch Pro Duo touchscreen cockpit, panoramic sunroof, and adaptive air suspension for exceptional ride comfort.',
    specs: {
      engine: '2.0L Turbocharged I4 (247 hp)',
      acceleration: '0-60 mph in 7.1s',
      topSpeed: '135 mph',
      drivetrain: 'Intelligent AWD',
      climate: 'Dual-zone automatic climate'
    },
    location: 'San Francisco International Airport (SFO)'
  },
  {
    id: 'executive-sedan-2024',
    name: 'Executive Sedan 2024',
    year: 2024,
    make: 'Mercedes-Benz',
    model: 'S-Class / E-Class Executive',
    category: 'Executive Sedan',
    type: 'Sedan',
    pricePerDay: 85,
    transmission: 'Automatic',
    seats: 5,
    luggageBags: 2,
    fuelType: 'Hybrid',
    mpgOrRange: '32 MPG',
    available: true,
    featured: true,
    tag: 'Available',
    imageUrl: HOTLINK_IMAGES.executiveSedan,
    galleryImages: {
      hero: HOTLINK_IMAGES.executiveSedan,
      interior: HOTLINK_IMAGES.velarInterior,
      wheel: HOTLINK_IMAGES.velarWheel,
      trunk: HOTLINK_IMAGES.velarTrunk
    },
    rating: 4.9,
    reviewsCount: 218,
    description: 'Premium comfort and advanced technology for business travel. Whisper-quiet cabin, ergonomic leather seats, and integrated GPS navigation.',
    specs: {
      engine: '2.0L Mild-Hybrid Turbo',
      acceleration: '0-60 mph in 6.2s',
      drivetrain: 'Rear-Wheel Drive with Comfort Dynamic',
      climate: 'Tri-zone Climate Control'
    },
    location: 'San Francisco International Airport (SFO)'
  },
  {
    id: 'family-suv-2023',
    name: 'Family SUV 2023',
    year: 2023,
    make: 'Audi',
    model: 'Q7 / Atlas 7-Seater',
    category: 'Family SUV',
    type: 'SUV',
    pricePerDay: 110,
    transmission: 'Automatic',
    seats: 7,
    luggageBags: 4,
    fuelType: 'Gas',
    mpgOrRange: '24 MPG',
    available: true,
    featured: true,
    tag: 'Available',
    imageUrl: HOTLINK_IMAGES.familySUV,
    galleryImages: {
      hero: HOTLINK_IMAGES.familySUV,
      interior: HOTLINK_IMAGES.velarInterior,
      wheel: HOTLINK_IMAGES.velarWheel,
      trunk: HOTLINK_IMAGES.velarTrunk
    },
    rating: 4.88,
    reviewsCount: 310,
    description: 'Spacious interior and top safety ratings for peace of mind. Accommodates 7 passengers with generous rear cargo space and rear-seat entertainment ports.',
    specs: {
      engine: '3.0L V6 Turbocharged',
      acceleration: '0-60 mph in 6.9s',
      drivetrain: 'Quattro All-Wheel Drive',
      climate: 'Quad-zone Climate Control'
    },
    location: 'Downtown San Francisco Hub'
  },
  {
    id: 'eco-electric-ev-2024',
    name: 'Eco Electric EV 2024',
    year: 2024,
    make: 'Hyundai / BYD',
    model: 'Ioniq 5 / Dolphin EV',
    category: 'Compact EV',
    type: 'Electric',
    pricePerDay: 95,
    transmission: 'Automatic',
    seats: 5,
    luggageBags: 2,
    fuelType: 'Electric',
    mpgOrRange: '300mi Range',
    available: true,
    featured: true,
    tag: 'EV',
    imageUrl: HOTLINK_IMAGES.compactEV,
    galleryImages: {
      hero: HOTLINK_IMAGES.compactEV,
      interior: HOTLINK_IMAGES.velarInterior,
      wheel: HOTLINK_IMAGES.velarWheel,
      trunk: HOTLINK_IMAGES.velarTrunk
    },
    rating: 4.92,
    reviewsCount: 184,
    description: 'Zero emissions and instant torque for an efficient city drive. Superfast DC charging support and ultra-modern digital cockpit with Apple CarPlay & Android Auto.',
    specs: {
      engine: 'Permanent Magnet Synchronous Motor',
      acceleration: '0-60 mph in 5.1s',
      drivetrain: 'Dual Motor AWD',
      climate: 'Heat Pump Smart Climate'
    },
    location: 'San Francisco International Airport (SFO)'
  },
  {
    id: 'tesla-model-y',
    name: 'Tesla Model Y Long Range',
    year: 2024,
    make: 'Tesla',
    model: 'Model Y Dual Motor AWD',
    category: 'Electric SUV',
    type: 'Electric',
    pricePerDay: 142,
    transmission: 'Automatic',
    seats: 5,
    luggageBags: 3,
    fuelType: 'Electric',
    mpgOrRange: '330mi Range',
    available: true,
    featured: false,
    tag: 'EV',
    imageUrl: HOTLINK_IMAGES.modelYBooking,
    galleryImages: {
      hero: HOTLINK_IMAGES.modelYBooking,
      interior: HOTLINK_IMAGES.velarInterior,
      wheel: HOTLINK_IMAGES.velarWheel,
      trunk: HOTLINK_IMAGES.velarTrunk
    },
    rating: 4.96,
    reviewsCount: 420,
    description: 'Seamless access with keyless digital unlock, premium sound system, Autopilot highway assist, and instant access to the nationwide Tesla Supercharger network.',
    specs: {
      engine: 'Dual AC Electric Motors',
      acceleration: '0-60 mph in 4.8s',
      drivetrain: 'All-Wheel Drive',
      climate: 'Bioweapon Defense Mode HEPA Filtration'
    },
    location: 'SFO Airport, Terminal 2'
  },
  {
    id: 'porsche-macan-gts',
    name: 'Porsche Macan GTS',
    year: 2024,
    make: 'Porsche',
    model: 'Macan GTS Sports Edition',
    category: 'Luxury SUV',
    type: 'Luxury',
    pricePerDay: 195,
    transmission: 'Automatic',
    seats: 5,
    luggageBags: 3,
    fuelType: 'Gas',
    mpgOrRange: '22 MPG',
    available: true,
    featured: false,
    tag: 'Premium Selection',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
    galleryImages: {
      hero: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
      interior: HOTLINK_IMAGES.velarInterior,
      wheel: HOTLINK_IMAGES.velarWheel,
      trunk: HOTLINK_IMAGES.velarTrunk
    },
    rating: 4.98,
    reviewsCount: 95,
    description: 'Pure performance with sports exhaust, 434 hp twin-turbo V6, 7-speed PDK transmission, and sport chrono package.',
    specs: {
      engine: '2.9L Twin-Turbo V6 (434 hp)',
      acceleration: '0-60 mph in 4.3s',
      drivetrain: 'Porsche Traction Management AWD',
      climate: 'Tri-zone Automatic Climate Control'
    },
    location: 'Downtown San Francisco Hub'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-rm-8472',
    pickupCode: 'RM-8472',
    vehicleId: 'tesla-model-y',
    vehicle: INITIAL_VEHICLES[4], // Tesla Model Y
    pickupLocation: 'SFO Airport, Terminal 2',
    dropoffLocation: 'SFO Airport, Terminal 2',
    pickupDate: '2026-10-24',
    pickupTime: '10:00 AM',
    dropoffDate: '2026-10-27',
    dropoffTime: '2:00 PM',
    days: 3,
    dailyRate: 142,
    rentalRateTotal: 426,
    taxesAndFees: 48.25,
    protectionPlan: 'standard',
    protectionFee: 45.00,
    totalDue: 519.25,
    status: 'Confirmed',
    customerName: 'Ganesh J.',
    customerEmail: 'ganeshj.bca_iom@bkc.met.edu',
    customerPhone: '+1 (415) 555-0199',
    driverLicenseNumber: 'CA-D8829104',
    paymentMethodLast4: '4242',
    createdAt: '2026-10-10T14:32:00Z'
  },
  {
    id: 'bk-rm-3190',
    pickupCode: 'RM-3190',
    vehicleId: 'executive-sedan-2024',
    vehicle: INITIAL_VEHICLES[1],
    pickupLocation: 'San Francisco International Airport (SFO)',
    dropoffLocation: 'San Francisco International Airport (SFO)',
    pickupDate: '2026-07-14',
    pickupTime: '09:00 AM',
    dropoffDate: '2026-07-18',
    dropoffTime: '11:00 AM',
    days: 4,
    dailyRate: 85,
    rentalRateTotal: 340,
    taxesAndFees: 42.50,
    protectionPlan: 'standard',
    protectionFee: 60.00,
    totalDue: 442.50,
    status: 'Completed',
    customerName: 'Ganesh J.',
    customerEmail: 'ganeshj.bca_iom@bkc.met.edu',
    customerPhone: '+1 (415) 555-0199',
    driverLicenseNumber: 'CA-D8829104',
    paymentMethodLast4: '4242',
    createdAt: '2026-07-02T10:15:00Z'
  }
];

export const INITIAL_ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-1',
    type: 'id_verification',
    title: 'Document Review: ID Verification',
    userOrVehicle: 'User: John Doe',
    timeOrLocation: 'Submitted 2 hours ago',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'act-2',
    type: 'handover',
    title: 'Vehicle Handover: SUV-204',
    userOrVehicle: 'Location: Downtown Hub',
    timeOrLocation: '14:00 PM Today',
    priority: 'Medium',
    status: 'pending'
  },
  {
    id: 'act-3',
    type: 'license_update',
    title: 'Document Review: License Update',
    userOrVehicle: 'User: Sarah Smith',
    timeOrLocation: 'Submitted 3 hours ago',
    priority: 'High',
    status: 'pending'
  },
  {
    id: 'act-4',
    type: 'maintenance',
    title: 'Scheduled Inspection: Sedan-108',
    userOrVehicle: 'Vehicle: Executive Sedan #108',
    timeOrLocation: '16:30 PM Today',
    priority: 'Medium',
    status: 'pending'
  }
];

export const INITIAL_FLEET: FleetVehicle[] = [
  {
    id: 'fl-1',
    code: 'SUV-204',
    name: 'Range Rover Velar Dynamic',
    plate: '8XYZ741',
    category: 'Luxury SUV',
    status: 'Available',
    fuelBattery: 94,
    mileage: 12450,
    location: 'Downtown Hub (Bay 4)',
    nextService: 'In 3,550 miles'
  },
  {
    id: 'fl-2',
    code: 'SED-102',
    name: 'Executive Sedan 2024',
    plate: '7ABC892',
    category: 'Executive Sedan',
    status: 'Rented',
    fuelBattery: 78,
    mileage: 18200,
    location: 'SFO Terminal 2',
    currentCustomer: 'Michael Chang',
    nextService: 'In 1,800 miles'
  },
  {
    id: 'fl-3',
    code: 'EV-301',
    name: 'Tesla Model Y Long Range',
    plate: '9EVT388',
    category: 'Electric SUV',
    status: 'Rented',
    fuelBattery: 86,
    mileage: 9140,
    location: 'SFO Terminal 2 (Ready Zone)',
    currentCustomer: 'Ganesh J. (RM-8472)',
    nextService: 'In 6,000 miles'
  },
  {
    id: 'fl-4',
    code: 'SUV-508',
    name: 'Family SUV 2023 7-Seat',
    plate: '6FAM441',
    category: 'Family SUV',
    status: 'Available',
    fuelBattery: 100,
    mileage: 24100,
    location: 'Downtown Hub (Bay 12)',
    nextService: 'In 2,200 miles'
  },
  {
    id: 'fl-5',
    code: 'EV-109',
    name: 'Compact Eco EV 2024',
    plate: '9ECO512',
    category: 'Compact EV',
    status: 'Maintenance',
    fuelBattery: 45,
    mileage: 15300,
    location: 'South Service Center',
    nextService: 'Scheduled Today 16:30'
  },
  {
    id: 'fl-6',
    code: 'SED-108',
    name: 'Mercedes-Benz E-Class',
    plate: '8MBZ108',
    category: 'Executive Sedan',
    status: 'Maintenance',
    fuelBattery: 60,
    mileage: 29800,
    location: 'Main Service Bay 2',
    nextService: 'Tire rotation & inspection'
  }
];
