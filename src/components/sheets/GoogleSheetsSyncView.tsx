import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  Database, 
  ArrowRight, 
  Download, 
  Upload, 
  AlertCircle,
  FolderGit2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GOOGLE_DRIVE_FOLDER_URL, SUPABASE_URL } from '../../lib/supabase';

export const GoogleSheetsSyncView: React.FC = () => {
  const { 
    players, 
    clubs, 
    observations, 
    events, 
    callUps, 
    triggerGoogleSheetsSync 
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState('jugadores');

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    await triggerGoogleSheetsSync();
    setIsSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  const sheetsTabs = [
    { id: 'jugadores', name: '1. Jugadores', count: players.length },
    { id: 'posiciones', name: '2. Posiciones', count: 15 },
    { id: 'clubes', name: '3. Clubes', count: clubs.length },
    { id: 'observaciones', name: '4. Observaciones', count: observations.length },
    { id: 'agenda', name: '5. Agenda', count: events.length },
    { id: 'convocatorias', name: '6. Convocatorias', count: callUps.length },
    { id: 'conv_jugadores', name: '7. Jugadores Convocados', count: callUps.reduce((acc, c) => acc + c.selectedPlayerIds.length, 0) },
    { id: 'valoraciones', name: '8. Valoraciones Históricas', count: players.length },
    { id: 'estadisticas', name: '9. Estadísticas', count: 7 },
    { id: 'configuracion', name: '10. Configuración', count: 4 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/60 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Integración Bidireccional de Datos
              </span>
              <span className="text-xs text-slate-400">10 Pestañas Estructuradas</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Sincronización con Google Sheets & Google Drive
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              La base de datos relacional de Supabase actúa como fuente principal de verdad, y Google Sheets permite la consulta masiva, filtrado y edición segura sin duplicación de filas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
            </button>

            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-amber-300 transition-all"
            >
              <ExternalLink className="h-4 w-4 text-sky-400" />
              <span>Abrir Google Drive</span>
            </a>
          </div>
        </div>

        {syncSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs font-semibold text-emerald-300 animate-in fade-in">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Sincronización completada con éxito. 10 pestañas actualizadas y vinculadas con Supabase sin duplicados.</span>
          </div>
        )}
      </div>

      {/* Connection Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Base de Datos Principal</span>
            <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-base font-bold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-sky-400" />
            <span>Supabase Cloud (PostgreSQL)</span>
          </p>
          <p className="text-[11px] text-slate-400 font-mono truncate">
            {SUPABASE_URL}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Carpeta Google Drive</span>
            <span className="text-[10px] text-sky-400 font-bold">Activo</span>
          </div>
          <p className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Fotos & Carnets de Jugadores</span>
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            Vinculado a carpeta oficial compartida
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Modo de Consulta</span>
            <span className="text-[10px] text-emerald-400 font-bold">Sin Duplicados</span>
          </div>
          <p className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Google Sheets API v4</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Relaciones por UUID internos (CAN-2026-XXX)
          </p>
        </div>
      </div>

      {/* 10 Pestañas Structure Navigator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Estructura de las 10 Pestañas Sincronizadas
        </h3>

        <div className="flex flex-wrap gap-2">
          {sheetsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabPreview(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTabPreview === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTabPreview === tab.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Data Preview Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 overflow-x-auto text-xs">
          {activeTabPreview === 'jugadores' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">UUID (ID_JUGADOR)</th>
                  <th className="py-2 px-3">NOMBRE</th>
                  <th className="py-2 px-3">CLUB</th>
                  <th className="py-2 px-3">ISLA</th>
                  <th className="py-2 px-3">POS_PPAL</th>
                  <th className="py-2 px-3">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {players.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-mono text-amber-400">{p.internalCode}</td>
                    <td className="py-2 px-3 font-semibold text-white">{p.sportsName}</td>
                    <td className="py-2 px-3">{p.currentClub}</td>
                    <td className="py-2 px-3">{p.island}</td>
                    <td className="py-2 px-3">{p.primaryPosition}</td>
                    <td className="py-2 px-3">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'clubes' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">ID_CLUB</th>
                  <th className="py-2 px-3">NOMBRE CLUB</th>
                  <th className="py-2 px-3">ISLA</th>
                  <th className="py-2 px-3">CATEGORÍA</th>
                  <th className="py-2 px-3">EMAIL CONTACTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {clubs.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 px-3 font-mono text-sky-400">{c.id}</td>
                    <td className="py-2 px-3 font-semibold text-white">{c.name}</td>
                    <td className="py-2 px-3">{c.island}</td>
                    <td className="py-2 px-3">{c.category}</td>
                    <td className="py-2 px-3 text-slate-400">{c.contactEmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview !== 'jugadores' && activeTabPreview !== 'clubes' && (
            <p className="py-4 text-center text-slate-500">
              Pestaña conectada y sincronizada con el esquema relacional de la Federación Canaria de Fútbol.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
