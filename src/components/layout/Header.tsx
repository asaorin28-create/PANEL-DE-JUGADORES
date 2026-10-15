import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  UserPlus, 
  Shield, 
  Wifi, 
  FolderGit2, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { GOOGLE_DRIVE_FOLDER_URL } from '../../lib/supabase';

interface HeaderProps {
  onOpenZipModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenZipModal }) => {
  const { 
    currentUser, 
    setCurrentUserRole, 
    notifications, 
    markNotificationRead, 
    clearAllNotifications,
    setIsAddPlayerOpen,
    isRealtimeConnected,
    setActiveTab,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: UserRole[] = [
    'Administrador',
    'Coordinador de Selecciones',
    'Seleccionador',
    'Observador / Scout',
    'Entrenador',
    'Usuario de Consulta',
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 md:px-6 backdrop-blur-md">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-sky-600 shadow-md shadow-amber-500/20 text-slate-950 font-black text-xl tracking-wider">
          ⚽
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">
              CANARIAS <span className="text-amber-400">SCOUT</span> PRO
            </h1>
            <span className="rounded-md bg-sky-950/80 px-2 py-0.5 text-[10px] font-semibold text-sky-400 border border-sky-800/60 uppercase tracking-wider">
              FIFLP / FCF
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Plataforma Oficial de Selecciones Autonómicas de Fútbol de Canarias
          </p>
        </div>
      </div>

      {/* Center Search / Realtime status badge */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-medium text-[11px]">
            {isRealtimeConnected ? 'Supabase Realtime: Conectado' : 'Modo Offline Sincronizado'}
          </span>
        </div>

        <a 
          href={GOOGLE_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300 hover:text-amber-300 hover:border-amber-400/50 transition-colors"
          title="Abrir carpeta compartida de Google Drive para imágenes"
        >
          <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden xl:inline text-[11px]">Google Drive Fotos</span>
        </a>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Add Player */}
        <button
          onClick={() => setIsAddPlayerOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Nuevo Jugador</span>
        </button>

        {/* GitHub ZIP Export Modal trigger */}
        <button
          onClick={onOpenZipModal}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-500/60 hover:text-sky-300 transition-colors cursor-pointer"
          title="Descargar código completo del proyecto en ZIP para GitHub"
        >
          <FolderGit2 className="h-3.5 w-3.5 text-sky-400" />
          <span className="hidden md:inline">Descargar ZIP</span>
        </button>

        {/* Push Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Notificaciones"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white uppercase tracking-wider">
                    Notificaciones en Tiempo Real
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-400 font-bold">
                    {unreadCount} nuevas
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearAllNotifications}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                    title="Marcar todas como leídas"
                  >
                    Marcar leídas
                  </button>
                  <button 
                    onClick={() => setIsNotifOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">No hay notificaciones recientes</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        n.read 
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400' 
                          : 'bg-slate-800/90 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-white mb-0.5">
                        <span className="text-[11px] text-amber-400 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700/80 transition-colors cursor-pointer"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-semibold text-white leading-tight">{currentUser.name}</p>
              <p className="text-[9px] text-amber-400 leading-tight">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                Simular Rol de Usuario
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentUserRole(r);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                    currentUser.role === r 
                      ? 'bg-amber-500/20 text-amber-300 font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{r}</span>
                  {currentUser.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />}
                </button>
              ))}
              <div className="border-t border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 text-[11px] text-sky-400 hover:text-sky-300"
                >
                  Ver matriz de permisos & auditoría →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
