import React, { useState, useEffect, useMemo, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import { AdminTab, CarRecord, AdminStats, AdminActivityLog } from '../../types';
import { carService } from '../../services/carService';
import { INITIAL_CAR_RECORDS, INITIAL_ADMIN_ACTIVITY } from '../../data/adminMockData';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminAddCar } from './AdminAddCar';
import { AdminCarRecords } from './AdminCarRecords';
import { AdminCarGrid } from './AdminCarGrid';
import { AdminSettings } from './AdminSettings';
import { AdminDeleteModal } from './AdminDeleteModal';
import { AdminEditModal } from './AdminEditModal';
import { AdminViewModal } from './AdminViewModal';
import { CheckCircle2, AlertCircle, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Panel caught rendering error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-serif mb-2">Admin Dashboard Recovered</h2>
          <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
            The admin view intercepted an unexpected state. Click below to restore standard sample fleet records and reload the dashboard.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('ridemate_admin_cars_v1');
                this.props.onReset();
                this.setState({ hasError: false, error: null });
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0051d5] hover:bg-[#0042b0] text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset & Reload Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export interface AdminPanelProps {
  onExitAdmin?: () => void;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onExitAdmin = () => {},
  onLogout = () => {},
}) => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Initialize with seed data immediately so UI never renders blank
  const [cars, setCars] = useState<CarRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ridemate_admin_cars_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cached admin cars', e);
    }
    return INITIAL_CAR_RECORDS;
  });

  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('ridemate_admin_activity_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading cached admin activity', e);
    }
    return INITIAL_ADMIN_ACTIVITY;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Global search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [viewingCar, setViewingCar] = useState<CarRecord | null>(null);
  const [editingCar, setEditingCar] = useState<CarRecord | null>(null);
  const [deletingCar, setDeletingCar] = useState<CarRecord | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load cars & logs asynchronously
  const loadFleetData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedCars, fetchedLogs] = await Promise.all([
        carService.getAllCars(),
        carService.getActivityLogs(),
      ]);
      if (fetchedCars && fetchedCars.length > 0) {
        setCars(fetchedCars);
      }
      if (fetchedLogs && fetchedLogs.length > 0) {
        setActivityLogs(fetchedLogs);
      }
    } catch (err) {
      console.error('Error fetching fleet data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFleetData();
  }, [loadFleetData]);

  // Compute live admin statistics
  const stats: AdminStats = useMemo(() => {
    const totalCars = cars.length;
    const availableCars = cars.filter((c) => c.status === 'Available').length;
    const rentedCars = cars.filter((c) => c.status === 'Rented').length;
    const maintenanceCars = cars.filter((c) => c.status === 'Maintenance').length;
    const unavailableCars = cars.filter((c) => c.status === 'Unavailable').length;
    const totalFleetValuation = cars.reduce((sum, c) => sum + (c.price || 0), 0);
    const averageRentalRate =
      totalCars > 0 ? Math.round(cars.reduce((sum, c) => sum + (c.rentalPricePerDay || 0), 0) / totalCars) : 0;
    const utilizationRate = totalCars > 0 ? Math.round((rentedCars / totalCars) * 100) : 0;

    return {
      totalCars,
      availableCars,
      rentedCars,
      unavailableCars,
      maintenanceCars,
      averageRentalRate,
      totalFleetValuation,
      utilizationRate,
    };
  }, [cars]);

  // Category breakdown for charts
  const categoryBreakdown: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {
      Luxury: 0,
      SUV: 0,
      Sedan: 0,
      Electric: 0,
      Sports: 0,
    };
    cars.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [cars]);

  // CSV Export helper
  const handleExportCSV = useCallback(() => {
    const headers = [
      'ID',
      'Name',
      'Brand',
      'Model',
      'Year',
      'Registration Number',
      'VIN',
      'Category',
      'Fuel Type',
      'Transmission',
      'Seats',
      'Mileage (mi)',
      'Valuation ($)',
      'Rental Price ($/day)',
      'Status',
      'Created Date',
    ];

    const rows = cars.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      c.brand,
      `"${c.model.replace(/"/g, '""')}"`,
      c.year,
      c.registrationNumber,
      c.vin,
      c.category,
      c.fuelType,
      c.transmission,
      c.seatingCapacity,
      c.mileage,
      c.price,
      c.rentalPricePerDay,
      c.status,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ridemate_fleet_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${cars.length} vehicle records to CSV.`);
  }, [cars]);

  // CRUD Handlers
  const handleSaveCar = async (carData: Partial<CarRecord>, addAnother: boolean): Promise<boolean> => {
    try {
      const newCar = await carService.createCar(carData);
      setCars((prev) => [newCar, ...prev]);
      const updatedLogs = await carService.getActivityLogs();
      setActivityLogs(updatedLogs);

      showToast(`Vehicle "${newCar.name}" successfully added to fleet!`);
      if (!addAnother) {
        setActiveTab('records');
      }
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to add car.', 'error');
      return false;
    }
  };

  const handleUpdateCar = async (id: string, updates: Partial<CarRecord>): Promise<boolean> => {
    try {
      const updated = await carService.updateCar(id, updates);
      setCars((prev) => prev.map((c) => (c.id === id ? updated : c)));
      const updatedLogs = await carService.getActivityLogs();
      setActivityLogs(updatedLogs);

      setEditingCar(null);
      showToast(`Vehicle "${updated.name}" updated successfully!`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update vehicle record.', 'error');
      return false;
    }
  };

  const handleDeleteCar = async (carId: string): Promise<boolean> => {
    try {
      const deletedCar = cars.find((c) => c.id === carId);
      const success = await carService.deleteCar(carId);
      if (success) {
        setCars((prev) => prev.filter((c) => c.id !== carId));
        const updatedLogs = await carService.getActivityLogs();
        setActivityLogs(updatedLogs);

        setDeletingCar(null);
        showToast(`Vehicle "${deletedCar?.name || 'Car'}" was deleted from records.`);
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to delete vehicle.', 'error');
      return false;
    }
  };

  const handleBatchDelete = async (ids: string[]) => {
    if (window.confirm(`Are you sure you want to permanently delete ${ids.length} vehicles?`)) {
      try {
        await carService.batchDeleteCars(ids);
        setCars((prev) => prev.filter((c) => !ids.includes(c.id)));
        const updatedLogs = await carService.getActivityLogs();
        setActivityLogs(updatedLogs);
        showToast(`Successfully deleted ${ids.length} vehicles from database.`);
      } catch (err: any) {
        showToast(err.message || 'Batch delete failed.', 'error');
      }
    }
  };

  const handleBatchStatusChange = async (ids: string[], newStatus: CarRecord['status']) => {
    try {
      await carService.batchUpdateStatus(ids, newStatus);
      setCars((prev) =>
        prev.map((c) => (ids.includes(c.id) ? { ...c, status: newStatus } : c))
      );
      const updatedLogs = await carService.getActivityLogs();
      setActivityLogs(updatedLogs);
      showToast(`Updated status of ${ids.length} vehicles to "${newStatus}".`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update batch status.', 'error');
    }
  };

  const handleQuickStatusToggle = async (car: CarRecord, newStatus: CarRecord['status']) => {
    try {
      const updated = await carService.updateCar(car.id, { status: newStatus });
      setCars((prev) => prev.map((c) => (c.id === car.id ? updated : c)));
      const updatedLogs = await carService.getActivityLogs();
      setActivityLogs(updatedLogs);
      showToast(`${car.name} is now ${newStatus}.`);
    } catch (err: any) {
      showToast('Failed to change vehicle status.', 'error');
    }
  };

  const handleResetSeedData = async () => {
    if (window.confirm('Reset all car fleet data back to original demonstration inventory?')) {
      const freshCars = await carService.resetToSeedData();
      setCars(freshCars);
      const updatedLogs = await carService.getActivityLogs();
      setActivityLogs(updatedLogs);
      showToast('Fleet inventory restored to factory sample records.');
    }
  };

  return (
    <AdminErrorBoundary onReset={handleResetSeedData}>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased relative">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-5 right-5 z-60 animate-in fade-in slide-in-from-top-4 duration-200">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
                toast.type === 'success'
                  ? 'bg-slate-900 text-white border-slate-800'
                  : 'bg-rose-600 text-white border-rose-700'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-white shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Left Sidebar */}
        <AdminSidebar
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          totalCarsCount={cars.length}
          availableCount={stats.availableCars}
          onExitAdmin={onExitAdmin}
          mobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Column (with lg:pl-72 padding to account for fixed sidebar) */}
        <div className="lg:pl-72 flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Header */}
          <AdminHeader
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onExitAdmin={onExitAdmin}
            globalSearchQuery={searchQuery}
            onGlobalSearchChange={(q) => {
              setSearchQuery(q);
              if (activeTab !== 'records' && activeTab !== 'cars' && q.trim().length > 0) {
                setActiveTab('records');
              }
            }}
            recentActivity={activityLogs}
            onRefreshData={loadFleetData}
            isRefreshing={isLoading}
          />

          {/* Body Section by Tab */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* 1. Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <AdminDashboard
                stats={stats}
                cars={cars}
                recentActivity={activityLogs}
                categoryBreakdown={categoryBreakdown}
                onSelectTab={setActiveTab}
                onViewCar={setViewingCar}
                onEditCar={setEditingCar}
                onDeleteCar={setDeletingCar}
                onResetSeedData={handleResetSeedData}
                onExportRecords={handleExportCSV}
              />
            )}

            {/* 2. Cars Visual Grid Tab */}
            {activeTab === 'cars' && (
              <AdminCarGrid
                cars={cars}
                onSelectTab={setActiveTab}
                onViewCar={setViewingCar}
                onEditCar={setEditingCar}
                onDeleteCar={setDeletingCar}
                onQuickStatusToggle={handleQuickStatusToggle}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {/* 3. Add Car Tab */}
            {activeTab === 'add-car' && (
              <AdminAddCar
                onSaveCar={handleSaveCar}
                onCancel={() => setActiveTab('records')}
                onSelectTab={setActiveTab}
              />
            )}

            {/* 4. Car Records Table Tab */}
            {activeTab === 'records' && (
              <AdminCarRecords
                cars={cars}
                onSelectTab={setActiveTab}
                onViewCar={setViewingCar}
                onEditCar={setEditingCar}
                onDeleteCar={setDeletingCar}
                onBatchDelete={handleBatchDelete}
                onBatchStatusChange={handleBatchStatusChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {/* 5. Settings Tab */}
            {activeTab === 'settings' && (
              <AdminSettings onResetSeedData={handleResetSeedData} />
            )}
          </main>
        </div>

        {/* Modals */}
        {viewingCar && (
          <AdminViewModal
            car={viewingCar}
            onClose={() => setViewingCar(null)}
            onEdit={(c) => {
              setViewingCar(null);
              setEditingCar(c);
            }}
            onDelete={(c) => {
              setViewingCar(null);
              setDeletingCar(c);
            }}
          />
        )}

        {editingCar && (
          <AdminEditModal
            car={editingCar}
            onClose={() => setEditingCar(null)}
            onSave={handleUpdateCar}
          />
        )}

        {deletingCar && (
          <AdminDeleteModal
            car={deletingCar}
            onClose={() => setDeletingCar(null)}
            onConfirmDelete={handleDeleteCar}
          />
        )}
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminPanel;
