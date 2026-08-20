import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Car,
  ChevronRight,
  User,
  Shield,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { AdminTab, AdminActivityLog } from '../../types';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenMobileMenu: () => void;
  onExitAdmin: () => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (q: string) => void;
  recentActivity: AdminActivityLog[];
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileMenu,
  onExitAdmin,
  globalSearchQuery,
  onGlobalSearchChange,
  recentActivity,
  onRefreshData,
  isRefreshing = false,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'cars':
        return 'Fleet Inventory Grid';
      case 'add-car':
        return 'Add New Vehicle';
      case 'records':
        return 'Car Records Data Table';
      case 'settings':
        return 'System & Fleet Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-bold">{getBreadcrumbTitle()}</span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="admin-global-search-input"
              type="text"
              placeholder="Quick search by car name, brand, plate or VIN..."
              value={globalSearchQuery}
              onChange={(e) => {
                onGlobalSearchChange(e.target.value);
                if (currentTab !== 'records' && currentTab !== 'cars' && e.target.value.trim().length > 0) {
                  onSelectTab('records');
                }
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-[#0051d5] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {globalSearchQuery && (
              <button
                onClick={() => onGlobalSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Refresh Data Button */}
          <button
            onClick={onRefreshData}
            title="Refresh Fleet Data"
            className="p-2 rounded-xl text-slate-600 hover:text-[#0051d5] hover:bg-blue-50 transition-colors border border-slate-200/80"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0051d5]' : ''}`} />
          </button>

          {/* Quick Add Car CTA */}
          {currentTab !== 'add-car' && (
            <button
              id="admin-header-add-car-btn"
              onClick={() => onSelectTab('add-car')}
              className="hidden sm:flex items-center gap-1.5 bg-[#0051d5] hover:bg-[#0042b0] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Car</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileMenuOpen(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80"
              aria-label="View activity logs & notifications"
            >
              <Bell className="w-4 h-4" />
              {recentActivity.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0051d5] rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#0051d5]" />
                      <span className="text-xs font-bold text-slate-900">Recent Fleet Activity</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#0051d5]">
                      {recentActivity.length} Events
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {recentActivity.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No recent fleet activity logs.
                      </div>
                    ) : (
                      recentActivity.map((log) => (
                        <div key={log.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3">
                          <div className="mt-0.5">
                            {log.action === 'create' && (
                              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                                <Plus className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {log.action === 'update' && (
                              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                                <Info className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {log.action === 'delete' && (
                              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {log.action === 'status_change' && (
                              <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-900 truncate">{log.title}</p>
                              <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{log.details}</p>
                            <span className="text-[10px] text-slate-400 font-medium">By {log.user}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        onSelectTab('dashboard');
                      }}
                      className="text-xs font-semibold text-[#0051d5] hover:underline"
                    >
                      View all in Dashboard
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
            >
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">Ganesh J.</div>
                <div className="text-[10px] font-semibold text-blue-600 leading-tight">Super Admin</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0051d5] to-[#2563eb] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                GJ
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-900">Ganesh J.</p>
                    <p className="text-[11px] text-slate-500 truncate">ganeshj.bca_iom@bkc.met.edu</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 w-fit">
                      <Shield className="w-3 h-3" /> Full Administrator Access
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onSelectTab('dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Admin Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onSelectTab('settings');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>System Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onExitAdmin();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-2.5 font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                      <span>View Public Marketplace</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onExitAdmin();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out / Exit</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
