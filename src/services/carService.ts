import { CarRecord, AdminStats, AdminActivityLog } from '../types';
import { INITIAL_CAR_RECORDS, INITIAL_ADMIN_ACTIVITY } from '../data/adminMockData';

// Storage key for client-side local cache fallback
const LOCAL_STORAGE_KEY = 'ridemate_admin_cars_v1';
const ACTIVITY_STORAGE_KEY = 'ridemate_admin_activity_v1';

function getLocalCars(): CarRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading from localStorage', e);
  }
  return [...INITIAL_CAR_RECORDS];
}

function saveLocalCars(cars: CarRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cars));
  } catch (e) {
    console.error('Failed saving to localStorage', e);
  }
}

function getLocalActivity(): AdminActivityLog[] {
  try {
    const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading activity from localStorage', e);
  }
  return [...INITIAL_ADMIN_ACTIVITY];
}

function saveLocalActivity(logs: AdminActivityLog[]): void {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error('Failed saving activity to localStorage', e);
  }
}

export const carService = {
  // Return all cars as an array
  async getAllCars(): Promise<CarRecord[]> {
    try {
      const res = await fetch('/api/cars');
      if (res.ok) {
        const json = await res.json();
        saveLocalCars(json.data);
        return json.data;
      }
    } catch (err) {
      console.warn('Backend API unreachable, using local cache', err);
    }
    return getLocalCars();
  },

  // GET /cars - Fetch all cars with optional query parameters
  async getCars(params?: {
    search?: string;
    brand?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ success: boolean; data: CarRecord[]; count: number; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.brand && params.brand !== 'All') query.append('brand', params.brand);
      if (params?.category && params.category !== 'All') query.append('category', params.category);
      if (params?.status && params.status !== 'All') query.append('status', params.status);
      if (params?.sortBy) query.append('sortBy', params.sortBy);
      if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

      const url = `/api/cars${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        saveLocalCars(json.data);
        return json;
      }
    } catch (err) {
      console.warn('Backend API unreachable, using client cache fallback', err);
    }

    // Fallback: client filtering
    let list = getLocalCars();
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.registrationNumber.toLowerCase().includes(q) ||
          c.vin.toLowerCase().includes(q) ||
          c.color.toLowerCase().includes(q)
      );
    }
    if (params?.brand && params.brand !== 'All') {
      list = list.filter((c) => c.brand.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.status && params.status !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params?.sortBy) {
      const order = params.sortOrder === 'desc' ? -1 : 1;
      list.sort((a, b) => {
        if (params.sortBy === 'name') return a.name.localeCompare(b.name) * order;
        if (params.sortBy === 'price') return (a.price - b.price) * order;
        if (params.sortBy === 'rentalPricePerDay') return (a.rentalPricePerDay - b.rentalPricePerDay) * order;
        if (params.sortBy === 'year') return (a.year - b.year) * order;
        if (params.sortBy === 'mileage') return (a.mileage - b.mileage) * order;
        if (params.sortBy === 'createdAt') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
        return 0;
      });
    }

    return {
      success: true,
      data: list,
      count: list.length,
      total: getLocalCars().length
    };
  },

  // GET /cars/:id - Fetch a specific car
  async getCarById(id: string): Promise<CarRecord | null> {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend API unreachable, using client cache', err);
    }

    const car = getLocalCars().find((c) => c.id === id);
    return car || null;
  },

  // POST /cars - Create a new car
  async createCar(carData: Partial<CarRecord>): Promise<CarRecord> {
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocalCars();
        saveLocalCars([json.data, ...current]);
        return json.data;
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to create vehicle record.');
      }
    } catch (err) {
      console.warn('Backend API unreachable, creating in client cache', err);
    }

    // Client fallback create
    const defaultImage =
      carData.imageUrl ||
      (carData.images && carData.images.length > 0
        ? carData.images[0]
        : 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop');

    const newCar: CarRecord = {
      id: `car-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: carData.name || 'New Vehicle',
      brand: carData.brand || 'Other',
      model: carData.model || '',
      year: carData.year || new Date().getFullYear(),
      registrationNumber: (carData.registrationNumber || `CA-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase(),
      vin: (carData.vin || `VIN${Date.now()}`).toUpperCase(),
      category: carData.category || 'Sedan',
      fuelType: carData.fuelType || 'Gas',
      transmission: carData.transmission || 'Automatic',
      seatingCapacity: carData.seatingCapacity || 5,
      color: carData.color || 'Obsidian Black',
      mileage: carData.mileage || 0,
      price: carData.price || 50000,
      rentalPricePerDay: carData.rentalPricePerDay || 100,
      discount: carData.discount || 0,
      status: carData.status || 'Available',
      images: carData.images && carData.images.length > 0 ? carData.images : [defaultImage],
      imageUrl: defaultImage,
      description: carData.description || `Premium ${carData.brand} ${carData.model} vehicle.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: carData.location || 'San Francisco International Airport (SFO)',
      luggageBags: carData.luggageBags || 3,
      mpgOrRange: carData.mpgOrRange || '24 MPG',
      rating: 5.0,
      reviewsCount: 0
    };

    const current = getLocalCars();
    saveLocalCars([newCar, ...current]);

    const logs = getLocalActivity();
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      action: 'create',
      title: 'New Vehicle Registered',
      details: `Added ${newCar.name} (${newCar.registrationNumber}) to fleet records.`,
      carId: newCar.id,
      carName: newCar.name,
      user: 'Ganesh J. (Admin)',
      timestamp: 'Just now'
    };
    saveLocalActivity([newLog, ...logs]);

    return newCar;
  },

  // PUT /cars/:id - Update an existing car
  async updateCar(id: string, updates: Partial<CarRecord>): Promise<CarRecord> {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocalCars();
        const index = current.findIndex((c) => c.id === id);
        if (index !== -1) {
          current[index] = json.data;
          saveLocalCars(current);
        }
        return json.data;
      }
    } catch (err) {
      console.warn('Backend API unreachable, updating in client cache', err);
    }

    const current = getLocalCars();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Vehicle record not found.');
    }

    const updated: CarRecord = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    current[index] = updated;
    saveLocalCars(current);

    const logs = getLocalActivity();
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      action: updates.status && updates.status !== current[index].status ? 'status_change' : 'update',
      title: 'Vehicle Record Updated',
      details: `Updated ${updated.name} (Status: ${updated.status}, Rate: $${updated.rentalPricePerDay}/day).`,
      carId: updated.id,
      carName: updated.name,
      user: 'Ganesh J. (Admin)',
      timestamp: 'Just now'
    };
    saveLocalActivity([newLog, ...logs]);

    return updated;
  },

  // DELETE /cars/:id - Delete a car
  async deleteCar(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const current = getLocalCars().filter((c) => c.id !== id);
        saveLocalCars(current);
        return true;
      }
    } catch (err) {
      console.warn('Backend API unreachable, deleting from client cache', err);
    }

    const current = getLocalCars();
    const carToDelete = current.find((c) => c.id === id);
    const filtered = current.filter((c) => c.id !== id);
    saveLocalCars(filtered);

    if (carToDelete) {
      const logs = getLocalActivity();
      const newLog: AdminActivityLog = {
        id: `act-${Date.now()}`,
        action: 'delete',
        title: 'Vehicle Deleted',
        details: `Permanently removed ${carToDelete.name} (${carToDelete.registrationNumber}) from fleet records.`,
        carName: carToDelete.name,
        user: 'Ganesh J. (Admin)',
        timestamp: 'Just now'
      };
      saveLocalActivity([newLog, ...logs]);
    }

    return true;
  },

  // Batch delete cars
  async batchDeleteCars(ids: string[]): Promise<boolean> {
    try {
      await Promise.all(ids.map((id) => fetch(`/api/cars/${id}`, { method: 'DELETE' })));
    } catch (e) {
      console.warn('Backend batch delete error', e);
    }

    const current = getLocalCars().filter((c) => !ids.includes(c.id));
    saveLocalCars(current);

    const logs = getLocalActivity();
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      action: 'delete',
      title: 'Batch Vehicle Deletion',
      details: `Bulk deleted ${ids.length} vehicles from database.`,
      user: 'Ganesh J. (Admin)',
      timestamp: 'Just now'
    };
    saveLocalActivity([newLog, ...logs]);
    return true;
  },

  // Batch update status
  async batchUpdateStatus(ids: string[], newStatus: CarRecord['status']): Promise<boolean> {
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/cars/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
          })
        )
      );
    } catch (e) {
      console.warn('Backend batch status error', e);
    }

    const current = getLocalCars().map((c) => (ids.includes(c.id) ? { ...c, status: newStatus } : c));
    saveLocalCars(current);

    const logs = getLocalActivity();
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      action: 'status_change',
      title: 'Batch Status Update',
      details: `Bulk updated status of ${ids.length} vehicles to "${newStatus}".`,
      user: 'Ganesh J. (Admin)',
      timestamp: 'Just now'
    };
    saveLocalActivity([newLog, ...logs]);
    return true;
  },

  // Get Activity Logs
  async getActivityLogs(): Promise<AdminActivityLog[]> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        if (json.recentActivity && json.recentActivity.length > 0) {
          saveLocalActivity(json.recentActivity);
          return json.recentActivity;
        }
      }
    } catch (err) {
      console.warn('Backend stats endpoint unreachable, returning local logs', err);
    }
    return getLocalActivity();
  },

  // Clear Activity Logs
  async clearActivityLogs(): Promise<void> {
    saveLocalActivity([]);
  },

  // GET /api/stats - Compute or fetch dashboard stats
  async getStats(): Promise<{
    stats: AdminStats;
    categoryBreakdown: Record<string, number>;
    recentActivity: AdminActivityLog[];
    recentlyAdded: CarRecord[];
  }> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.warn('Backend API unreachable, calculating stats from local cache', err);
    }

    const cars = getLocalCars();
    const total = cars.length;
    const available = cars.filter((c) => c.status === 'Available').length;
    const rented = cars.filter((c) => c.status === 'Rented').length;
    const maintenance = cars.filter((c) => c.status === 'Maintenance').length;
    const unavailable = cars.filter((c) => c.status === 'Unavailable').length;

    const totalFleetValuation = cars.reduce((sum, c) => sum + (c.price || 0), 0);
    const averageRentalRate =
      total > 0 ? Math.round(cars.reduce((sum, c) => sum + (c.rentalPricePerDay || 0), 0) / total) : 0;
    const utilizationRate = total > 0 ? Math.round((rented / total) * 100) : 0;

    const categoryBreakdown: Record<string, number> = {};
    cars.forEach((c) => {
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    });

    return {
      stats: {
        totalCars: total,
        availableCars: available,
        rentedCars: rented,
        unavailableCars: unavailable,
        maintenanceCars: maintenance,
        averageRentalRate,
        totalFleetValuation,
        utilizationRate
      },
      categoryBreakdown,
      recentActivity: getLocalActivity().slice(0, 10),
      recentlyAdded: cars.slice(0, 5)
    };
  },

  // Reset to default seed records
  async resetToSeedData(): Promise<CarRecord[]> {
    try {
      await fetch('/api/cars/reset', { method: 'POST' });
    } catch (e) {
      console.warn('Reset endpoint failed, resetting localStorage', e);
    }
    saveLocalCars([...INITIAL_CAR_RECORDS]);
    saveLocalActivity([...INITIAL_ADMIN_ACTIVITY]);
    return [...INITIAL_CAR_RECORDS];
  },

  async resetToSeed(): Promise<CarRecord[]> {
    return this.resetToSeedData();
  }
};
