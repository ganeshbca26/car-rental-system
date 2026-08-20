import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Car, 
  RotateCcw,
  CheckSquare,
  Square,
  Layers,
  Fuel,
  Gauge,
  SlidersHorizontal,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CarRecord, AdminTab } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface AdminCarRecordsProps {
  cars: CarRecord[];
  onSelectTab: (tab: AdminTab) => void;
  onViewCar: (car: CarRecord) => void;
  onEditCar: (car: CarRecord) => void;
  onDeleteCar: (car: CarRecord) => void;
  onBatchDelete?: (ids: string[]) => void;
  onBatchStatusChange?: (ids: string[], newStatus: CarRecord['status']) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminCarRecords: React.FC<AdminCarRecordsProps> = ({
  cars,
  onSelectTab,
  onViewCar,
  onEditCar,
  onDeleteCar,
  onBatchDelete,
  onBatchStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Sort state
  const [sortBy, setSortBy] = useState<keyof CarRecord | 'rentalRate'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Unique list of brands with counts
  const brandStats = useMemo(() => {
    const counts: Record<string, number> = {};
    cars.forEach((c) => {
      counts[c.brand] = (counts[c.brand] || 0) + 1;
    });
    const brands = Object.keys(counts).sort();
    return {
      brands: ['All', ...brands],
      counts,
    };
  }, [cars]);

  // Status counts for quick filter tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: cars.length,
      Available: 0,
      Rented: 0,
      Maintenance: 0,
      Unavailable: 0,
    };
    cars.forEach((c) => {
      if (counts[c.status] !== undefined) {
        counts[c.status] += 1;
      }
    });
    return counts;
  }, [cars]);

  // Unique categories with counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    cars.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    const categories = Object.keys(counts).sort();
    return {
      categories: ['All', ...categories],
      counts,
    };
  }, [cars]);

  // Filter & Sort Logic
  const filteredAndSortedCars = useMemo(() => {
    let list = [...cars];

    // 1. Search Query (Name, Brand, Model, Registration, VIN, Color)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.registrationNumber.toLowerCase().includes(q) ||
          c.vin.toLowerCase().includes(q) ||
          c.color.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    // 2. Brand Filter
    if (selectedBrand !== 'All') {
      list = list.filter((c) => c.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 3. Category Filter
    if (selectedCategory !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 4. Status Filter
    if (selectedStatus !== 'All') {
      list = list.filter((c) => c.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // 5. Sorting
    list.sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * multiplier;
      if (sortBy === 'brand') return a.brand.localeCompare(b.brand) * multiplier;
      if (sortBy === 'price') return (a.price - b.price) * multiplier;
      if (sortBy === 'rentalRate' || sortBy === 'rentalPricePerDay') {
        return (a.rentalPricePerDay - b.rentalPricePerDay) * multiplier;
      }
      if (sortBy === 'year') return (a.year - b.year) * multiplier;
      if (sortBy === 'mileage') return (a.mileage - b.mileage) * multiplier;
      if (sortBy === 'createdAt') {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier;
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status) * multiplier;
      return 0;
    });

    return list;
  }, [cars, searchQuery, selectedBrand, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Pagination slicing
  const totalRecords = filteredAndSortedCars.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCars = useMemo(() => {
    const start = (validCurrentPage - 1) * recordsPerPage;
    return filteredAndSortedCars.slice(start, start + recordsPerPage);
  }, [filteredAndSortedCars, validCurrentPage, recordsPerPage]);

  // Multi-select handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedCars.map((c) => c.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSortToggle = (column: keyof CarRecord | 'rentalRate') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    onSearchChange('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const listToExport = selectedIds.length > 0
      ? cars.filter((c) => selectedIds.includes(c.id))
      : filteredAndSortedCars;

    const headers = ['ID', 'Name', 'Brand', 'Model', 'Year', 'Registration', 'VIN', 'Category', 'Fuel', 'Transmission', 'Seats', 'Mileage', 'MSRP', 'DailyRate', 'Status', 'CreatedDate'];
    const rows = listToExport.map((c) => [
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
      c.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ridemate_car_records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: CarRecord['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
          </span>
        );
      case 'Rented':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Rented
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Maintenance
          </span>
        );
      case 'Unavailable':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Unavailable
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#0051d5]" />
            Car Records Inventory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing <strong className="text-slate-800">{totalRecords}</strong> registered vehicles in fleet database
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            id="admin-records-add-btn"
            onClick={() => onSelectTab('add-car')}
            className="flex items-center gap-1.5 bg-[#0051d5] hover:bg-[#0042b0] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Car</span>
          </button>
        </div>
      </div>

      {/* Status Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            setSelectedStatus('All');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatus === 'All'
              ? 'bg-[#0051d5] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All Statuses</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            selectedStatus === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {statusCounts.All}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('Available');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatus === 'Available'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Available</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            selectedStatus === 'Available' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {statusCounts.Available}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('Rented');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatus === 'Rented'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-blue-700 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Rented</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            selectedStatus === 'Rented' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            {statusCounts.Rented}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('Maintenance');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatus === 'Maintenance'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-700 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Maintenance</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            selectedStatus === 'Maintenance' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {statusCounts.Maintenance}
          </span>
        </button>

        <button
          onClick={() => {
            setSelectedStatus('Unavailable');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            selectedStatus === 'Unavailable'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          <span>Unavailable</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
            selectedStatus === 'Unavailable' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {statusCounts.Unavailable}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="car-records-search"
              type="text"
              placeholder="Search by car name, brand, model, plate, VIN, color..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#0051d5] rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter: Brand with Counts */}
          <div className="lg:col-span-3">
            <select
              id="filter-brand-select"
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-[#0051d5] focus:outline-hidden"
            >
              <option value="All">All Brands ({brandStats.brands.length - 1})</option>
              {brandStats.brands.filter((b) => b !== 'All').map((b) => (
                <option key={b} value={b}>
                  {b} ({brandStats.counts[b] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Filter: Category with Counts */}
          <div className="lg:col-span-2">
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-[#0051d5] focus:outline-hidden"
            >
              <option value="All">All Categories ({categoryStats.categories.length - 1})</option>
              {categoryStats.categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c} ({categoryStats.counts[c] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Filter: Status dropdown backup */}
          <div className="lg:col-span-2">
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-[#0051d5] focus:outline-hidden"
            >
              <option value="All">Status: All ({statusCounts.All})</option>
              <option value="Available">Available ({statusCounts.Available})</option>
              <option value="Rented">Rented ({statusCounts.Rented})</option>
              <option value="Maintenance">Maintenance ({statusCounts.Maintenance})</option>
              <option value="Unavailable">Unavailable ({statusCounts.Unavailable})</option>
            </select>
          </div>
        </div>

        {/* Quick Brand Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Quick Brand:
          </span>
          {brandStats.brands.map((b) => {
            const isSelected = selectedBrand === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setSelectedBrand(b);
                  setCurrentPage(1);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
                {b !== 'All' && <span className="ml-1 text-[10px] opacity-75">({brandStats.counts[b]})</span>}
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicators & Reset Button */}
        {(searchQuery || selectedBrand !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All') && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Active Filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                  <span>Name/Text: "{searchQuery}"</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="hover:text-blue-900 font-bold ml-0.5"
                    title="Remove search filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                  <span>Brand: {selectedBrand}</span>
                  <button
                    onClick={() => setSelectedBrand('All')}
                    className="hover:text-slate-950 font-bold ml-0.5"
                    title="Remove brand filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-slate-950 font-bold ml-0.5"
                    title="Remove category filter"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                  <span>Status: {selectedStatus}</span>
                  <button
                    onClick={() => setSelectedStatus('All')}
                    className="hover:text-slate-950 font-bold ml-0.5"
                    title="Remove status filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Batch Selection Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0b1329] text-white p-3.5 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">Vehicles Selected</span>
          </div>

          <div className="flex items-center gap-2">
            {onBatchStatusChange && (
              <>
                <button
                  onClick={() => onBatchStatusChange(selectedIds, 'Available')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/50 border border-emerald-500/40 text-xs font-semibold"
                >
                  Mark Available
                </button>
                <button
                  onClick={() => onBatchStatusChange(selectedIds, 'Maintenance')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/30 text-amber-300 hover:bg-amber-600/50 border border-amber-500/40 text-xs font-semibold"
                >
                  Mark Maintenance
                </button>
              </>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              Export Selected
            </button>

            {onBatchDelete && (
              <button
                onClick={() => onBatchDelete(selectedIds)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={() => setSelectedIds([])}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Clear selection"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="car-records-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold tracking-wider uppercase text-[10px]">
                {/* Select All Checkbox */}
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleSelectAllOnPage}
                    className="text-slate-400 hover:text-slate-700"
                    title="Select all on page"
                  >
                    {paginatedCars.length > 0 &&
                    paginatedCars.every((c) => selectedIds.includes(c.id)) ? (
                      <CheckSquare className="w-4 h-4 text-[#0051d5]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>

                {/* Car Photo & Name */}
                <th className="py-3 px-3 cursor-pointer hover:text-[#0051d5]" onClick={() => handleSortToggle('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Vehicle</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Brand & Model */}
                <th className="py-3 px-3 cursor-pointer hover:text-[#0051d5]" onClick={() => handleSortToggle('brand')}>
                  <div className="flex items-center gap-1.5">
                    <span>Brand & Category</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Registration & VIN */}
                <th className="py-3 px-3">Registration / VIN</th>

                {/* Year & Specs */}
                <th className="py-3 px-3 cursor-pointer hover:text-[#0051d5]" onClick={() => handleSortToggle('year')}>
                  <div className="flex items-center gap-1.5">
                    <span>Specs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Price / Rates */}
                <th className="py-3 px-3 cursor-pointer hover:text-[#0051d5]" onClick={() => handleSortToggle('rentalRate')}>
                  <div className="flex items-center gap-1.5">
                    <span>Rental Rate / MSRP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Status */}
                <th className="py-3 px-3 cursor-pointer hover:text-[#0051d5]" onClick={() => handleSortToggle('status')}>
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Created Date */}
                <th className="py-3 px-3 cursor-pointer hover:text-[#0051d5]" onClick={() => handleSortToggle('createdAt')}>
                  <div className="flex items-center gap-1.5">
                    <span>Added</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedCars.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Car className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-700">No cars found matching your criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or reset the filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-[#0051d5] text-white rounded-xl text-xs font-bold hover:bg-[#0042b0]"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedCars.map((car) => {
                  const isSelected = selectedIds.includes(car.id);

                  return (
                    <tr
                      key={car.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleSelectRow(car.id)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#0051d5]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Photo + Display Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img
                              src={car.imageUrl}
                              alt={car.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <button
                              onClick={() => onViewCar(car)}
                              className="font-extrabold text-slate-900 hover:text-[#0051d5] text-left line-clamp-1 cursor-pointer"
                            >
                              {car.name}
                            </button>
                            <p className="text-[10px] text-slate-500">{car.color} • {car.year}</p>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Category */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{car.brand}</div>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                          {car.category}
                        </span>
                      </td>

                      {/* Registration & VIN */}
                      <td className="py-3 px-3 font-mono">
                        <div className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-sm w-fit border border-slate-200">
                          {car.registrationNumber}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[120px]" title={car.vin}>
                          {car.vin}
                        </span>
                      </td>

                      {/* Year & Specs */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-semibold">
                          {car.transmission} • {car.fuelType}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {car.seatingCapacity} seats • {car.mileage.toLocaleString()} mi
                        </div>
                      </td>

                      {/* Price & Daily Rate */}
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-[#0051d5] text-sm">
                          {formatCurrency(car.rentalPricePerDay)}
                          <span className="text-[10px] font-normal text-slate-500">/day</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          MSRP: {formatCurrency(car.price)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {getStatusBadge(car.status)}
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {new Date(car.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewCar(car)}
                            title="View Car Details"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0051d5] hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditCar(car)}
                            title="Edit Car Record"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCar(car)}
                            title="Delete Car"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination & Records Per Page */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span>
              Showing{' '}
              <strong className="text-slate-900">
                {totalRecords === 0 ? 0 : (validCurrentPage - 1) * recordsPerPage + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-900">
                {Math.min(validCurrentPage * recordsPerPage, totalRecords)}
              </strong>{' '}
              of <strong className="text-slate-900">{totalRecords}</strong> vehicles
            </span>

            <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
              <span className="text-slate-500">Per page:</span>
              <select
                id="records-per-page-select"
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-hidden focus:border-[#0051d5]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              // Only display around current page
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= validCurrentPage - 1 && pageNum <= validCurrentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                      validCurrentPage === pageNum
                        ? 'bg-[#0051d5] text-white shadow-xs'
                        : 'border border-slate-200 hover:bg-white text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              if (pageNum === validCurrentPage - 2 || pageNum === validCurrentPage + 2) {
                return <span key={pageNum} className="px-1 text-slate-400">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent text-slate-700 transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
