import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  PlusCircle, 
  FileText, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  X,
  ExternalLink,
  Activity,
  ChevronRight
} from 'lucide-react';
import { AdminTab } from '../../types';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  totalCarsCount: number;
  availableCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  totalCarsCount,
  availableCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Fleet metrics & activity'
    },
    {
      id: 'cars' as AdminTab,
      label: 'Cars',
      icon: Car,
      badge: totalCarsCount.toString(),
      description: 'Visual inventory overview'
    },
    {
      id: 'add-car' as AdminTab,
      label: 'Add Car',
      icon: PlusCircle,
      badge: 'New',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Register vehicle & media'
    },
    {
      id: 'records' as AdminTab,
      label: 'Car Records',
      icon: FileText,
      badge: `${availableCount} Live`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Data table & batch actions'
    },
    {
      id: 'settings' as AdminTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
      description: 'System & fleet configuration'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0b1329] text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0051d5] to-[#2563eb] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight font-serif">RIDEMATE</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Car Management System</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Fleet Quick Status Pill */}
        <div className="px-4 pt-4 pb-2">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-300 font-medium">API Server Online</span>
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/40">
              Port 3000
            </span>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
          <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Fleet Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#0051d5] text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <div className="text-left">
                    <div className="leading-tight">{item.label}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.badgeColor ||
                        (isActive ? 'bg-white/20 text-white border-white/30' : 'bg-slate-800 text-slate-300 border-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Card & Logout / Switch to Public View */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
          {/* Admin User info */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-750">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              GJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate">Ganesh J.</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">Super Administrator</p>
            </div>
          </div>

          {/* Switch to Public Marketplace button */}
          <button
            id="admin-exit-btn"
            onClick={onExitAdmin}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-750 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Marketplace</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400">Exit Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
