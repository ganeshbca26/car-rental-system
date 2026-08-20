import { CarRecord, AdminActivityLog } from '../types';

export const INITIAL_CAR_RECORDS: CarRecord[] = [
  {
    id: 'car-bmw-m4',
    name: 'BMW M4 Competition Coupe',
    brand: 'BMW',
    model: 'M4 Competition xDrive',
    year: 2024,
    registrationNumber: 'CA-8KX9201',
    vin: 'WBA43AZ08PFP98124',
    category: 'Sports',
    fuelType: 'Gas',
    transmission: 'Automatic',
    seatingCapacity: 4,
    color: 'Isle of Man Green',
    mileage: 8420,
    price: 86500,
    rentalPricePerDay: 210,
    discount: 10,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
    description: 'Track-bred performance coupe with 503-hp M TwinPower Turbo inline 6-cylinder engine, M xDrive all-wheel drive system, carbon bucket seats, and M Drive Professional telematics.',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-18T09:15:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 2,
    mpgOrRange: '19 MPG',
    rating: 4.96,
    reviewsCount: 84,
    specs: {
      engine: '3.0L Twin-Turbo Inline-6 (503 hp)',
      acceleration: '0-60 mph in 3.4s',
      topSpeed: '180 mph',
      drivetrain: 'M xDrive AWD',
      climate: 'Dual-zone climate control'
    }
  },
  {
    id: 'car-range-rover-velar',
    name: 'Range Rover Velar Dynamic',
    brand: 'Land Rover',
    model: 'Velar P250 R-Dynamic SE',
    year: 2024,
    registrationNumber: 'CA-7RM8472',
    vin: 'SALYA2EX8PA746192',
    category: 'Luxury',
    fuelType: 'Gas',
    transmission: 'Automatic',
    seatingCapacity: 5,
    color: 'Fuji White',
    mileage: 12450,
    price: 74200,
    rentalPricePerDay: 185,
    discount: 5,
    status: 'Rented',
    images: [
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop',
    description: 'Refined avant-garde luxury SUV offering continuous variable damping, flush deployable door handles, Pivi Pro dual 10-inch touchscreens, and panoramic sliding roof.',
    createdAt: '2026-07-22T11:00:00Z',
    updatedAt: '2026-08-19T16:20:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 4,
    mpgOrRange: '24 MPG',
    rating: 4.95,
    reviewsCount: 142,
    specs: {
      engine: '2.0L Turbocharged I4 (247 hp)',
      acceleration: '0-60 mph in 7.1s',
      topSpeed: '135 mph',
      drivetrain: 'Intelligent AWD',
      climate: 'Four-zone climate control'
    }
  },
  {
    id: 'car-porsche-taycan',
    name: 'Porsche Taycan 4S',
    brand: 'Porsche',
    model: 'Taycan 4S Electric Performance Plus',
    year: 2024,
    registrationNumber: 'CA-9PT3381',
    vin: 'WP0AA2Y18PSA10934',
    category: 'Electric',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 4,
    color: 'Frozen Blue Metallic',
    mileage: 6180,
    price: 118500,
    rentalPricePerDay: 260,
    discount: 15,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
    description: 'Soul, electrified. 522-hp dual-motor all-wheel electric powertrain with 800-volt architecture, 270kW ultra-fast charging, adaptive air suspension, and curved glass instrument cluster.',
    createdAt: '2026-08-01T08:45:00Z',
    updatedAt: '2026-08-17T12:00:00Z',
    location: 'Silicon Valley Hub / SJC',
    luggageBags: 3,
    mpgOrRange: '270mi Range',
    rating: 4.98,
    reviewsCount: 96,
    specs: {
      engine: 'Dual Permanent Magnet Synchronous Motors (522 hp)',
      acceleration: '0-60 mph in 3.8s',
      topSpeed: '155 mph',
      drivetrain: 'All-Wheel Drive',
      climate: 'Advanced 4-Zone Climate'
    }
  },
  {
    id: 'car-mercedes-s580',
    name: 'Mercedes-Benz S 580 4MATIC',
    brand: 'Mercedes-Benz',
    model: 'S 580 Executive Sedan',
    year: 2024,
    registrationNumber: 'CA-5MB1109',
    vin: 'W1K6G8GB4PA203914',
    category: 'Sedan',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seatingCapacity: 5,
    color: 'Obsidian Black Metallic',
    mileage: 15300,
    price: 125000,
    rentalPricePerDay: 235,
    discount: 0,
    status: 'Rented',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
    description: 'The pinnacle of automotive luxury and effortless power. Features 4.0L V8 biturbo with EQ Boost, Burmester 3D Surround Sound, executive rear seating with massage function, and active ambient lighting.',
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-08-19T14:40:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 3,
    mpgOrRange: '25 MPG',
    rating: 4.93,
    reviewsCount: 165,
    specs: {
      engine: '4.0L V8 Biturbo with Mild Hybrid (496 hp)',
      acceleration: '0-60 mph in 4.3s',
      topSpeed: '130 mph',
      drivetrain: '4MATIC AWD',
      climate: 'Thermotronic 4-Zone'
    }
  },
  {
    id: 'car-tesla-modely',
    name: 'Tesla Model Y Long Range',
    brand: 'Tesla',
    model: 'Model Y Dual Motor AWD',
    year: 2024,
    registrationNumber: 'CA-3TS8841',
    vin: '5YJYGAEE8PF619283',
    category: 'Electric',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    color: 'Midnight Silver Metallic',
    mileage: 18900,
    price: 49990,
    rentalPricePerDay: 95,
    discount: 10,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop',
    description: 'Versatile, high-efficiency all-electric crossover with 330 miles EPA range, Supercharger network access, 15-inch center touchscreen display, and expansive glass roof.',
    createdAt: '2026-07-01T09:20:00Z',
    updatedAt: '2026-08-16T11:10:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 4,
    mpgOrRange: '330mi Range',
    rating: 4.88,
    reviewsCount: 310,
    specs: {
      engine: 'Dual Motor All-Wheel Drive',
      acceleration: '0-60 mph in 4.8s',
      topSpeed: '135 mph',
      drivetrain: 'Dual Motor AWD',
      climate: 'HEPA filtration air system'
    }
  },
  {
    id: 'car-audi-q7',
    name: 'Audi Q7 55 TFSI Quattro',
    brand: 'Audi',
    model: 'Q7 55 Prestige 7-Passenger',
    year: 2023,
    registrationNumber: 'CA-6AQ4490',
    vin: 'WA1VAAF78PD092183',
    category: 'SUV',
    fuelType: 'Gas',
    transmission: 'Automatic',
    seatingCapacity: 7,
    color: 'Navarra Blue Metallic',
    mileage: 24100,
    price: 68900,
    rentalPricePerDay: 135,
    discount: 5,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    description: 'Spacious three-row luxury SUV equipped with 335-hp turbocharged V6, quattro all-wheel drive, Audi virtual cockpit plus, Matrix-design LED headlights, and 7,700-lb towing capacity.',
    createdAt: '2026-05-18T13:10:00Z',
    updatedAt: '2026-08-15T08:30:00Z',
    location: 'Oakland International Airport (OAK)',
    luggageBags: 5,
    mpgOrRange: '22 MPG',
    rating: 4.86,
    reviewsCount: 114,
    specs: {
      engine: '3.0L Turbocharged V6 (335 hp)',
      acceleration: '0-60 mph in 5.7s',
      topSpeed: '130 mph',
      drivetrain: 'quattro AWD',
      climate: 'Three-zone automatic climate'
    }
  },
  {
    id: 'car-ford-bronco',
    name: 'Ford Bronco Wildtrak 4x4',
    brand: 'Ford',
    model: 'Bronco Wildtrak Sasquatch',
    year: 2024,
    registrationNumber: 'CA-2FD9018',
    vin: '1FMEE5DP8PLA83912',
    category: 'SUV',
    fuelType: 'Gas',
    transmission: 'Automatic',
    seatingCapacity: 5,
    color: 'Eruption Green',
    mileage: 11200,
    price: 61500,
    rentalPricePerDay: 145,
    discount: 0,
    status: 'Maintenance',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
    description: 'Rugged outdoor adventure vehicle with Sasquatch Package, 35-inch mud-terrain tires, Bilstein position-sensitive dampers, removable roof and doors, and G.O.A.T. terrain modes.',
    createdAt: '2026-06-28T16:40:00Z',
    updatedAt: '2026-08-20T01:10:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 4,
    mpgOrRange: '17 MPG',
    rating: 4.91,
    reviewsCount: 88,
    specs: {
      engine: '2.7L EcoBoost V6 (315 hp)',
      acceleration: '0-60 mph in 6.4s',
      topSpeed: '100 mph',
      drivetrain: 'Advanced 4x4 with Automatic On-Demand',
      climate: 'Dual-zone climate control'
    }
  },
  {
    id: 'car-chevrolet-corvette',
    name: 'Chevrolet Corvette Stingray 3LT',
    brand: 'Chevrolet',
    model: 'Corvette C8 Stingray Convertible',
    year: 2024,
    registrationNumber: 'CA-4CV7720',
    vin: '1G1YB2D48P5109283',
    category: 'Sports',
    fuelType: 'Gas',
    transmission: 'Automatic',
    seatingCapacity: 2,
    color: 'Torch Red',
    mileage: 5400,
    price: 88900,
    rentalPricePerDay: 240,
    discount: 10,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
    description: 'Mid-engine American supercar with retractable hardtop, 6.2L naturally aspirated V8, Z51 Performance Package, Magnetic Selective Ride Control, and Performance Data Recorder.',
    createdAt: '2026-07-14T10:15:00Z',
    updatedAt: '2026-08-18T14:30:00Z',
    location: 'Silicon Valley Hub / SJC',
    luggageBags: 2,
    mpgOrRange: '19 MPG',
    rating: 4.97,
    reviewsCount: 129,
    specs: {
      engine: '6.2L LT2 V8 (495 hp)',
      acceleration: '0-60 mph in 2.9s',
      topSpeed: '194 mph',
      drivetrain: 'Rear-Wheel Drive Mid-Engine',
      climate: 'Dual-zone climate'
    }
  },
  {
    id: 'car-genesis-gv80',
    name: 'Genesis GV80 3.5T Prestige',
    brand: 'Genesis',
    model: 'GV80 AWD Prestige',
    year: 2024,
    registrationNumber: 'CA-1GN5591',
    vin: 'KMUHC81B4PU192834',
    category: 'Luxury',
    fuelType: 'Gas',
    transmission: 'Automatic',
    seatingCapacity: 5,
    color: 'Cardiff Green',
    mileage: 14800,
    price: 78500,
    rentalPricePerDay: 165,
    discount: 5,
    status: 'Available',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    description: 'Executive Korean luxury crossover featuring twin-turbo V3.5 engine, Electronically Controlled Suspension with Road Preview, 14.5-inch HD screen, and Nappa leather upholstery with G-Matrix quilting.',
    createdAt: '2026-06-04T12:00:00Z',
    updatedAt: '2026-08-16T15:00:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 4,
    mpgOrRange: '20 MPG',
    rating: 4.89,
    reviewsCount: 76,
    specs: {
      engine: '3.5L Twin-Turbo V6 (375 hp)',
      acceleration: '0-60 mph in 5.3s',
      topSpeed: '149 mph',
      drivetrain: 'AWD with Electronic Limited-Slip Differential',
      climate: 'Three-zone climate control'
    }
  },
  {
    id: 'car-ford-f150-lightning',
    name: 'Ford F-150 Lightning Platinum',
    brand: 'Ford',
    model: 'F-150 Lightning Platinum EV',
    year: 2024,
    registrationNumber: 'CA-7FL1948',
    vin: '1FT6W1EV8PW109284',
    category: 'Truck',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    color: 'Star White Metallic',
    mileage: 9300,
    price: 92000,
    rentalPricePerDay: 175,
    discount: 0,
    status: 'Unavailable',
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1200&auto=format&fit=crop',
    description: 'All-electric full-size pickup with 580-hp dual-motor powertrain, Mega Power Frunk with 400L storage, Pro Power Onboard 9.6kW output, and Nirvana leather multi-contour seats.',
    createdAt: '2026-07-10T14:15:00Z',
    updatedAt: '2026-08-19T10:00:00Z',
    location: 'San Francisco International Airport (SFO)',
    luggageBags: 6,
    mpgOrRange: '300mi Range',
    rating: 4.87,
    reviewsCount: 52,
    specs: {
      engine: 'Dual eMotors Extended Range (580 hp)',
      acceleration: '0-60 mph in 3.8s',
      topSpeed: '110 mph',
      drivetrain: 'Dual Motor 4x4',
      climate: 'Dual-zone climate control'
    }
  }
];

export const INITIAL_ADMIN_ACTIVITY: AdminActivityLog[] = [
  {
    id: 'act-001',
    action: 'status_change',
    title: 'Vehicle Status Updated',
    details: 'Ford Bronco Wildtrak status set to Maintenance for 10k mile tire rotation & brake inspection.',
    carId: 'car-ford-bronco',
    carName: 'Ford Bronco Wildtrak 4x4',
    user: 'Ganesh J. (Admin)',
    timestamp: '10 minutes ago'
  },
  {
    id: 'act-002',
    action: 'create',
    title: 'New Vehicle Registered',
    details: 'Added BMW M4 Competition Coupe (CA-8KX9201) to executive fleet inventory.',
    carId: 'car-bmw-m4',
    carName: 'BMW M4 Competition Coupe',
    user: 'Ganesh J. (Admin)',
    timestamp: '2 hours ago'
  },
  {
    id: 'act-003',
    action: 'update',
    title: 'Rental Rates Adjusted',
    details: 'Updated Porsche Taycan 4S daily promotional rate from $290 to $260/day with 15% discount.',
    carId: 'car-porsche-taycan',
    carName: 'Porsche Taycan 4S',
    user: 'Sarah M. (Fleet Mgr)',
    timestamp: '5 hours ago'
  },
  {
    id: 'act-004',
    action: 'status_change',
    title: 'Vehicle Rented',
    details: 'Mercedes-Benz S 580 dispatched for 4-day reservation RM-8472.',
    carId: 'car-mercedes-s580',
    carName: 'Mercedes-Benz S 580 4MATIC',
    user: 'System Dispatch',
    timestamp: 'Yesterday at 4:30 PM'
  },
  {
    id: 'act-005',
    action: 'delete',
    title: 'Vehicle Decommissioned',
    details: 'Removed retired 2020 Audi A4 (CA-4AQ1129) following lease return cycle.',
    carName: 'Audi A4 45 TFSI',
    user: 'Ganesh J. (Admin)',
    timestamp: '3 days ago'
  }
];

export const SAMPLE_CAR_PRESET_IMAGES = [
  {
    label: 'BMW Sports Coupe (Green)',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Luxury SUV (White)',
    url: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Porsche Electric Sports (Blue)',
    url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Executive Sedan (Black)',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'EV Crossover (Silver)',
    url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Corvette Supercar (Red)',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Off-road 4x4 (Green)',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Electric Truck (White)',
    url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    label: 'Modern Cockpit Interior',
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Rear Trunk Cargo',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
  }
];
