import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  ClipboardList, 
  LayoutGrid, 
  Flame, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GOOGLE_DRIVE_FOLDER_URL } from '../../lib/supabase';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenZipModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, onOpenZipModal }) => {
  const { activeTab, setActiveTab, players, events, callUps, tacticalPlays } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'players',
      label: 'Base de Jugadores',
      icon: Users,
      badge: players.length,
    },
    {
      id: 'agenda',
      label: 'Agenda de Scouting',
      icon: CalendarDays,
      badge: events.filter(e => e.status === 'Pendiente').length,
    },
    {
      id: 'callups',
      label: 'Convocatorias',
      icon: ClipboardList,
      badge: callUps.length,
    },
    {
      id: 'lineups',
      label: 'Constructor de Onces',
      icon: LayoutGrid,
      badge: null,
    },
    {
      id: 'tactics',
      label: 'Pizarra Táctica 2D/Animada',
      icon: Flame,
      badge: `${tacticalPlays.length} tácticas`,
      highlight: true,
    },
    {
      id: 'reports',
      label: 'Informes & Comparador',
      icon: FileText,
      badge: null,
    },
    {
      id: 'sheets',
      label: 'Google Sheets & Drive',
      icon: FileSpreadsheet,
      badge: '10 pestañas',
    },
    {
      id: 'admin',
      label: 'Roles & Auditoría',
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow hover:text-white transition-colors cursor-pointer"
        aria-label="Alternar menú lateral"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-sky-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              } ${item.highlight && !isActive ? 'border border-amber-500/20 bg-amber-500/5' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className="relative">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                )}
              </div>

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick shortcuts in sidebar bottom */}
      <div className="border-t border-slate-800 p-2 space-y-2">
        {!collapsed ? (
          <div className="rounded-xl border border-sky-900/50 bg-gradient-to-br from-sky-950/60 to-slate-900 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Google Drive Fotos</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
              Repositorio de fotos de jugadores y carnets federativos en la nube de Canarias.
            </p>
            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600/30 border border-sky-500/40 px-2.5 py-1.5 text-[11px] font-semibold text-sky-200 hover:bg-sky-600/50 transition-colors"
            >
              <span>Abrir Carpeta</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : (
          <a
            href={GOOGLE_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-400 hover:text-white transition-colors mx-auto"
            title="Google Drive Fotos"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </aside>
  );
};
