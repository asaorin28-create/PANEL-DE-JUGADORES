import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle, 
  Database, 
  Download, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GOOGLE_DRIVE_FOLDER_URL, SUPABASE_URL } from '../../lib/supabase';
import type { PlayerPosition } from '../../types';

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
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    await triggerGoogleSheetsSync();
    setIsSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  const positionsDefinition: { code: PlayerPosition; name: string; line: string }[] = [
    { code: 'POR', name: 'Portero', line: 'Portería' },
    { code: 'DFC', name: 'Defensa Central', line: 'Defensa' },
    { code: 'LD', name: 'Lateral Derecho', line: 'Defensa' },
    { code: 'LI', name: 'Lateral Izquierdo', line: 'Defensa' },
    { code: 'CAD', name: 'Carrilero Derecho', line: 'Defensa' },
    { code: 'CAI', name: 'Carrilero Izquierdo', line: 'Defensa' },
    { code: 'MCD', name: 'Mediocentro Defensivo', line: 'Mediocampo' },
    { code: 'MC', name: 'Mediocentro Organizador', line: 'Mediocampo' },
    { code: 'INT_D', name: 'Interior Derecho', line: 'Mediocampo' },
    { code: 'INT_I', name: 'Interior Izquierdo', line: 'Mediocampo' },
    { code: 'MCO', name: 'Mediapunta / Enganche', line: 'Mediocampo' },
    { code: 'ED', name: 'Extremo Derecho', line: 'Delantera' },
    { code: 'EI', name: 'Extremo Izquierdo', line: 'Delantera' },
    { code: 'DC', name: 'Delantero Centro', line: 'Delantera' },
    { code: 'SD', name: 'Segundo Delantero', line: 'Delantera' },
  ];

  const sheetsTabs = [
    { id: 'jugadores', name: '1. Jugadores', count: players.length },
    { id: 'posiciones', name: '2. Posiciones', count: positionsDefinition.length },
    { id: 'clubes', name: '3. Clubes', count: clubs.length },
    { id: 'observaciones', name: '4. Observaciones', count: observations.length },
    { id: 'agenda', name: '5. Agenda', count: events.length },
    { id: 'convocatorias', name: '6. Convocatorias', count: callUps.length },
    { id: 'conv_jugadores', name: '7. Jugadores Convocados', count: callUps.reduce((acc, c) => acc + c.selectedPlayerIds.length + c.reservePlayerIds.length, 0) },
    { id: 'valoraciones', name: '8. Valoraciones Históricas', count: players.length },
    { id: 'estadisticas', name: '9. Estadísticas Islas', count: 7 },
    { id: 'configuracion', name: '10. Configuración', count: 5 },
  ];

  const getActiveTabCSV = (): string => {
    if (activeTabPreview === 'jugadores') {
      const headers = ['UUID', 'CODIGO_INTERNO', 'NOMBRE_DEPORTIVO', 'NOMBRE', 'APELLIDOS', 'CLUB', 'ISLA', 'POS_PPAL', 'PIE', 'ESTADO'];
      const rows = players.map(p => [p.id, p.internalCode, p.sportsName, p.firstName, p.lastName, p.currentClub, p.island, p.primaryPosition, p.dominantFoot, p.status]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    if (activeTabPreview === 'posiciones') {
      const headers = ['CODIGO', 'NOMBRE', 'LINEA'];
      const rows = positionsDefinition.map(p => [p.code, p.name, p.line]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    if (activeTabPreview === 'clubes') {
      const headers = ['ID_CLUB', 'NOMBRE', 'ISLA', 'CATEGORIA', 'EMAIL'];
      const rows = clubs.map(c => [c.id, c.name, c.island, c.category, c.contactEmail]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    if (activeTabPreview === 'observaciones') {
      const headers = ['ID_OBS', 'FECHA', 'PARTIDO', 'RIVAL', 'OBSERVADOR', 'NOTA_TECNICA', 'NOTA_TACTICA', 'MINUTOS'];
      const rows = observations.map(o => [o.id, o.date, o.match, o.rival, o.observerName, o.ratingTecnica, o.ratingTactica, o.minutesPlayed]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    if (activeTabPreview === 'agenda') {
      const headers = ['ID_EVENTO', 'TITULO', 'TIPO', 'FECHA', 'HORA', 'LUGAR', 'ISLA', 'ESTADO'];
      const rows = events.map(e => [e.id, e.title, e.type, e.date, e.time, e.location, e.island, e.status]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    if (activeTabPreview === 'convocatorias') {
      const headers = ['ID_CONV', 'TITULO', 'CATEGORIA', 'FECHA', 'SELECCION', 'NUM_TITULARES', 'NUM_RESERVAS'];
      const rows = callUps.map(c => [c.id, c.title, c.category, c.date, c.selectionName, c.selectedPlayerIds.length, c.reservePlayerIds.length]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    if (activeTabPreview === 'valoraciones') {
      const headers = ['JUGADOR', 'ISLA', 'POSICION', 'CONTROL_ORIENTADO', 'VISION_JUEGO', 'VELOCIDAD', 'RESISTENCIA', 'DISCIPLINA_TACTICA'];
      const rows = players.map(p => [p.sportsName, p.island, p.primaryPosition, p.ratings.controlOrientado, p.ratings.visionJuego, p.ratings.velocidad, p.ratings.resistencia, p.ratings.disciplinaTactica]);
      return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    }
    return 'DATO,VALOR\nESTADO,OK';
  };

  const handleDownloadActiveTabCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + getActiveTabCSV();
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Canarias_Scout_${activeTabPreview}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(getActiveTabCSV()).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    });
  };

  // Island stats calculation
  const islandsList = ['Gran Canaria', 'Tenerife', 'Lanzarote', 'Fuerteventura', 'La Palma', 'La Gomera', 'El Hierro'];
  const islandStats = islandsList.map(island => {
    const count = players.filter(p => p.island === island).length;
    const percentage = players.length > 0 ? ((count / players.length) * 100).toFixed(1) : '0';
    return { island, count, percentage };
  });

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Estructura de las 10 Pestañas Sincronizadas
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              {copiedSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedSuccess ? '¡Copiado!' : 'Copiar CSV'}</span>
            </button>
            <button
              onClick={handleDownloadActiveTabCSV}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descargar CSV Pestaña</span>
            </button>
          </div>
        </div>

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
                {players.map((p) => (
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

          {activeTabPreview === 'posiciones' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">CÓDIGO POSICIÓN</th>
                  <th className="py-2 px-3">NOMBRE OFICIAL</th>
                  <th className="py-2 px-3">LÍNEA TÁCTICA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {positionsDefinition.map((pos) => (
                  <tr key={pos.code}>
                    <td className="py-2 px-3 font-mono font-bold text-amber-400">{pos.code}</td>
                    <td className="py-2 px-3 font-semibold text-white">{pos.name}</td>
                    <td className="py-2 px-3 text-sky-400">{pos.line}</td>
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

          {activeTabPreview === 'observaciones' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">FECHA</th>
                  <th className="py-2 px-3">PARTIDO</th>
                  <th className="py-2 px-3">RIVAL</th>
                  <th className="py-2 px-3">SCOUT</th>
                  <th className="py-2 px-3 text-center">NOTA TÉCNICA</th>
                  <th className="py-2 px-3 text-center">NOTA TÁCTICA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {observations.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2 px-3 font-mono text-amber-400">{o.date}</td>
                    <td className="py-2 px-3 font-semibold text-white">{o.match}</td>
                    <td className="py-2 px-3">{o.rival}</td>
                    <td className="py-2 px-3 text-slate-300">{o.observerName}</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-400">{o.ratingTecnica}</td>
                    <td className="py-2 px-3 text-center font-bold text-sky-400">{o.ratingTactica}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'agenda' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">ACTIVIDAD</th>
                  <th className="py-2 px-3">TIPO</th>
                  <th className="py-2 px-3">FECHA & HORA</th>
                  <th className="py-2 px-3">ISLA</th>
                  <th className="py-2 px-3">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 px-3 font-semibold text-white">{e.title}</td>
                    <td className="py-2 px-3 text-sky-300">{e.type}</td>
                    <td className="py-2 px-3 text-slate-300">{e.date} ({e.time})</td>
                    <td className="py-2 px-3">{e.island}</td>
                    <td className="py-2 px-3 font-bold text-emerald-400">{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'convocatorias' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">TÍTULO CONVOCATORIA</th>
                  <th className="py-2 px-3">CATEGORÍA</th>
                  <th className="py-2 px-3">TORNEO</th>
                  <th className="py-2 px-3 text-center">TITULARES</th>
                  <th className="py-2 px-3 text-center">RESERVAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {callUps.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 px-3 font-semibold text-white">{c.title}</td>
                    <td className="py-2 px-3 text-amber-400">{c.category}</td>
                    <td className="py-2 px-3 text-slate-300">{c.tournament}</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-400">{c.selectedPlayerIds.length}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-400">{c.reservePlayerIds.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'conv_jugadores' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">FUTBOLISTA</th>
                  <th className="py-2 px-3">CLUB</th>
                  <th className="py-2 px-3">CONVOCATORIA</th>
                  <th className="py-2 px-3">ROL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {callUps.flatMap((c) => 
                  c.selectedPlayerIds.map(pid => {
                    const ply = players.find(p => p.id === pid);
                    return { ply, callup: c.title, role: 'Titular' };
                  }).concat(
                    c.reservePlayerIds.map(pid => {
                      const ply = players.find(p => p.id === pid);
                      return { ply, callup: c.title, role: 'Reserva' };
                    })
                  )
                ).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-semibold text-white">{item.ply?.sportsName || 'Jugador'}</td>
                    <td className="py-2 px-3">{item.ply?.currentClub}</td>
                    <td className="py-2 px-3 text-slate-300">{item.callup}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.role === 'Titular' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {item.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'valoraciones' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">FUTBOLISTA</th>
                  <th className="py-2 px-3">ISLA</th>
                  <th className="py-2 px-3 text-center">TÉCNICA</th>
                  <th className="py-2 px-3 text-center">VISIÓN</th>
                  <th className="py-2 px-3 text-center">VELOCIDAD</th>
                  <th className="py-2 px-3 text-center">FÍSICO</th>
                  <th className="py-2 px-3 text-center">TÁCTICA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {players.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-3 font-semibold text-white">{p.sportsName} ({p.primaryPosition})</td>
                    <td className="py-2 px-3">{p.island}</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-400">{p.ratings.controlOrientado}</td>
                    <td className="py-2 px-3 text-center font-bold text-sky-400">{p.ratings.visionJuego}</td>
                    <td className="py-2 px-3 text-center font-bold text-emerald-400">{p.ratings.velocidad}</td>
                    <td className="py-2 px-3 text-center font-bold text-purple-400">{p.ratings.fuerza}</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-300">{p.ratings.disciplinaTactica}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'estadisticas' && (
            <table className="w-full text-left text-slate-300">
              <thead className="text-[10px] uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">ISLA DEL ARCHIPIÉLAGO</th>
                  <th className="py-2 px-3 text-center">JUGADORES CENSADOS</th>
                  <th className="py-2 px-3 text-center">PORCENTAJE DEL TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {islandStats.map((st) => (
                  <tr key={st.island}>
                    <td className="py-2 px-3 font-semibold text-white">{st.island}</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-400">{st.count}</td>
                    <td className="py-2 px-3 text-center text-slate-300">{st.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTabPreview === 'configuracion' && (
            <div className="space-y-3 p-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Base de Datos:</span>
                <span className="font-mono text-emerald-400">Supabase Cloud (PostgreSQL 15)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Canal Realtime Broadcast:</span>
                <span className="font-mono text-sky-400">canarias-scout-broadcast (Push Notifications)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Carpeta Google Drive:</span>
                <span className="font-mono text-amber-400">Repositorio Oficial Compartido (Fotos & Dossiers)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Formato de Sincronización:</span>
                <span className="font-mono text-slate-200">UUIDs primarios CAN-2026-XXX (Sin duplicidad)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seguridad y Roles:</span>
                <span className="font-mono text-purple-400">RBAC (6 Perfiles Técnicos Federativos)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
