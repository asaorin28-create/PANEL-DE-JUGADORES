import React from 'react';
import { 
  Users, 
  MapPin, 
  Star, 
  Calendar, 
  Award, 
  Clock, 
  ArrowUpRight, 
  Flame, 
  Plus, 
  Eye, 
  FileText, 
  LayoutGrid, 
  ClipboardList,
  Sparkles,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Island, ScoutingStatus } from '../../types';

export const DashboardView: React.FC = () => {
  const { 
    players, 
    observations, 
    events, 
    callUps, 
    tacticalPlays,
    setActiveTab, 
    setSelectedPlayerId, 
    setIsAddPlayerOpen,
    setIsAddObservationOpen
  } = useApp();

  // Metrics calculation
  const totalPlayers = players.length;
  const priorityPlayers = players.filter(p => p.status === 'Prioritario');
  const convocatedPlayers = players.filter(p => p.status === 'Convocado');
  const pendingObserve = players.filter(p => p.status === 'Pendiente de observar' || p.status === 'Nuevo');
  const upcomingEvents = events.filter(e => e.status === 'Pendiente');

  // Breakdown by island
  const islandsList: Island[] = [
    'Gran Canaria',
    'Tenerife',
    'Lanzarote',
    'Fuerteventura',
    'La Palma',
    'La Gomera',
    'El Hierro',
  ];

  const islandCounts = islandsList.map((island) => {
    const count = players.filter(p => p.island === island).length;
    const percentage = totalPlayers > 0 ? Math.round((count / totalPlayers) * 100) : 0;
    return { island, count, percentage };
  });

  // Top rated technical players
  const topRatedPlayers = [...players]
    .sort((a, b) => {
      const avgA = (a.ratings.controlOrientado + a.ratings.visionJuego + a.ratings.tomaDecisiones) / 3;
      const avgB = (b.ratings.controlOrientado + b.ratings.visionJuego + b.ratings.tomaDecisiones) / 3;
      return avgB - avgA;
    })
    .slice(0, 5);

  // Status breakdown
  const statusList: ScoutingStatus[] = [
    'Prioritario',
    'Convocado',
    'Propuesto para convocatoria',
    'En seguimiento',
    'Pendiente de observar',
    'Nuevo',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950/80 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                Temporada Oficial 2025 / 2026
              </span>
              <span className="text-xs text-slate-400">Archipiélago Canario</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Plataforma Integral de Scouting & Selecciones Canarias
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Detección de talento juvenil, convocatorias de la Federación Canaria y pizarra táctica de alto rendimiento vinculada en tiempo real.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddPlayerOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Jugador</span>
            </button>
            <button
              onClick={() => setIsAddObservationOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Eye className="h-4 w-4 text-sky-400" />
              <span>Registrar Observación</span>
            </button>
            <button
              onClick={() => setActiveTab('tactics')}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Pizarra Táctica</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div 
          onClick={() => setActiveTab('players')}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-sky-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Jugadores</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">{totalPlayers}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>Base de datos activa en 7 islas</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('players')}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Seguimiento Prioritario</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{priorityPlayers.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Candidatos a Selección Autonómica</p>
        </div>

        <div 
          onClick={() => setActiveTab('callups')}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Convocados Oficiales</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{convocatedPlayers.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">{callUps.length} convocatorias en curso</p>
        </div>

        <div 
          onClick={() => setActiveTab('agenda')}
          className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Próximos Seguimientos</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-300 mt-2">{upcomingEvents.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">{observations.length} informes completados</p>
        </div>
      </div>

      {/* Main Grid: Island Distribution & Top Prospects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Prospects Table & Scouting Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Rated Prospects (Wyscout-style cards) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Futbolistas Destacados en Valoración Técnica</span>
                </h3>
                <p className="text-xs text-slate-400">Calculado a partir de observaciones presenciales y métricas técnicas</p>
              </div>
              <button 
                onClick={() => setActiveTab('players')}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                <span>Ver todos</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topRatedPlayers.map((player) => {
                const avgTech = ((player.ratings.controlOrientado + player.ratings.visionJuego + player.ratings.tomaDecisiones + player.ratings.paseCorto) / 4).toFixed(1);

                return (
                  <div
                    key={player.id}
                    onClick={() => {
                      setSelectedPlayerId(player.id);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-800/80 bg-slate-800/40 hover:bg-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={player.photoUrl} 
                        alt={player.sportsName}
                        className="h-11 w-11 rounded-full object-cover border-2 border-slate-700 group-hover:border-amber-400 transition-colors"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {player.sportsName}
                          </span>
                          <span className="rounded bg-slate-700/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                            {player.primaryPosition}
                          </span>
                          <span className="rounded bg-sky-950 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300 border border-sky-800/60">
                            {player.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {player.currentClub} • {player.island}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-xs font-semibold text-slate-400">Nota Media:</span>
                          <span className="text-sm font-black text-amber-400">{avgTech}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          player.status === 'Prioritario' 
                            ? 'bg-amber-500/20 text-amber-300' 
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {player.status}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Access Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab('players')}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-center group cursor-pointer"
            >
              <Users className="h-5 w-5 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Base de Datos</span>
              <span className="text-[10px] text-slate-400">Filtros Wyscout</span>
            </button>

            <button
              onClick={() => setActiveTab('callups')}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-center group cursor-pointer"
            >
              <ClipboardList className="h-5 w-5 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Convocatorias</span>
              <span className="text-[10px] text-slate-400">Listados Oficiales</span>
            </button>

            <button
              onClick={() => setActiveTab('lineups')}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-center group cursor-pointer"
            >
              <LayoutGrid className="h-5 w-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Once Inicial</span>
              <span className="text-[10px] text-slate-400">Pizarra de Campo</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-all text-center group cursor-pointer"
            >
              <FileText className="h-5 w-5 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-white">Informes PDF</span>
              <span className="text-[10px] text-slate-400">Comparador 4 Jugadores</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Island Distribution & Recent Activity */}
        <div className="space-y-6">
          {/* Island Breakdown Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span>Distribución por Isla</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">Canarias</span>
            </div>

            <div className="space-y-3">
              {islandCounts.map(({ island, count, percentage }) => (
                <div key={island} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{island}</span>
                    <span className="text-slate-400 font-bold">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        island === 'Gran Canaria' ? 'bg-amber-400' :
                        island === 'Tenerife' ? 'bg-sky-400' :
                        island === 'Lanzarote' ? 'bg-emerald-400' :
                        island === 'Fuerteventura' ? 'bg-purple-400' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Scouting Agenda Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>Agenda Inmediata</span>
              </h3>
              <button 
                onClick={() => setActiveTab('agenda')}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
              >
                Ver calendario
              </button>
            </div>

            <div className="space-y-2.5">
              {events.slice(0, 3).map((event) => (
                <div 
                  key={event.id}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{event.title}</span>
                    <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{event.location} • {event.island}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
